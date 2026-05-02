"""
RAG Pipeline - LangChain integration with watsonx.ai
Handles embeddings and LLM initialization
"""
from langchain_ibm import WatsonxLLM
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import settings
import logging
import threading
from typing import Dict

logger = logging.getLogger(__name__)

# Module-level singletons — avoids re-initializing heavy models on every call
_embeddings_instance: HuggingFaceEmbeddings | None = None
_llm_instance: WatsonxLLM | None = None

# Vectorstore connection pool (Issue #5: Vectorstore Pooling)
_vectorstore_cache: Dict[str, Chroma] = {}
_cache_lock = threading.Lock()
_MAX_CACHE_SIZE = 10  # Limit to 10 repositories in memory


def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Initialize embeddings model (singleton).
    Uses HuggingFace sentence-transformers all-MiniLM-L6-v2.
    """
    global _embeddings_instance
    if _embeddings_instance is not None:
        return _embeddings_instance

    try:
        _embeddings_instance = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        logger.info("Embeddings model initialized successfully (HuggingFace all-MiniLM-L6-v2)")
        return _embeddings_instance
    except Exception as e:
        logger.error(f"Failed to initialize embeddings: {e}")
        raise


def get_llm() -> WatsonxLLM:
    """
    Initialize watsonx.ai LLM (singleton).
    Uses IBM Granite 4 H Small — the best available Granite instruct model
    in this watsonx.ai environment.
    The WatsonxLLM client handles IAM token refresh automatically
    when initialized with `apikey`.
    """
    global _llm_instance
    if _llm_instance is not None:
        return _llm_instance

    try:
        _llm_instance = WatsonxLLM(
            # ibm/granite-3-8b-instruct is not available in this environment.
            # ibm/granite-4-h-small is the best available Granite instruct model.
            model_id="ibm/granite-4-h-small",
            url=settings.watsonx_url,
            apikey=settings.watsonx_api_key,
            project_id=settings.watsonx_project_id,
            params={
                # Increased for detailed, structured answers
                "max_new_tokens": 1500,
                # Lower temperature → more factual, precise code explanations
                "temperature": 0.2,
                "top_p": 0.9,
                "top_k": 40,
                # Stop at the next user-turn marker to avoid hallucinated follow-ups
                "stop_sequences": ["QUESTION:", "Human:", "User:"],
            },
        )
        logger.info("LLM initialized successfully (granite-4-h-small, singleton)")
        return _llm_instance
    except Exception as e:
        logger.error(f"Failed to initialize LLM: {e}")
        # Reset singleton so the next call retries rather than returning a broken instance
        _llm_instance = None
        raise


def get_vectorstore(repo_id: str, embeddings: HuggingFaceEmbeddings) -> Chroma:
    """
    Load or retrieve cached vectorstore for a repository (Issue #5: Connection Pooling).

    Args:
        repo_id: Repository identifier
        embeddings: Embeddings function

    Returns:
        Chroma vectorstore instance
    """
    with _cache_lock:
        # Check cache first
        if repo_id in _vectorstore_cache:
            logger.debug(f"Using cached vectorstore for {repo_id}")
            return _vectorstore_cache[repo_id]
        
        # Load and cache
        try:
            persist_directory = f"{settings.chromadb_dir}/{repo_id}"
            vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings,
            )
            
            # Cache it (limit cache size)
            if len(_vectorstore_cache) >= _MAX_CACHE_SIZE:
                # Remove oldest entry (FIFO)
                oldest_key = next(iter(_vectorstore_cache))
                del _vectorstore_cache[oldest_key]
                logger.debug(f"Cache full, removed {oldest_key}")
            
            _vectorstore_cache[repo_id] = vectorstore
            logger.info(f"Loaded and cached vectorstore for repo {repo_id}")
            return vectorstore
            
        except Exception as e:
            logger.error(f"Failed to load vectorstore for {repo_id}: {e}")
            raise


def create_vectorstore(
    repo_id: str,
    documents: list,
    embeddings: HuggingFaceEmbeddings,
) -> Chroma:
    """
    Create new ChromaDB vectorstore from documents with optimized index (Issue #10).

    Args:
        repo_id: Repository identifier
        documents: List of LangChain documents
        embeddings: Embeddings function

    Returns:
        Chroma vectorstore instance
    """
    try:
        persist_directory = f"{settings.chromadb_dir}/{repo_id}"
        
        # Create vectorstore with optimized HNSW index parameters
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=persist_directory,
            collection_metadata={
                "hnsw:space": "cosine",  # Cosine similarity for embeddings
                "hnsw:construction_ef": 200,  # Higher = better recall, slower build
                "hnsw:search_ef": 100,  # Higher = better recall, slower search
                "hnsw:M": 16,  # Number of connections per layer
            }
        )
        logger.info(
            f"Created optimized vectorstore for repo {repo_id} with {len(documents)} documents"
        )
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to create vectorstore for {repo_id}: {e}")
        raise


def build_prompt(context: str, question: str) -> str:
    """
    Build a detailed, structured prompt for the Granite LLM.

    The prompt instructs the model to give a thorough, well-organised answer
    that references specific files, functions, and patterns found in the code.

    Args:
        context: Retrieved code snippets from the vectorstore
        question: User's natural language question

    Returns:
        Formatted prompt string
    """
    prompt = f"""<|system|>
You are RepoLens, an expert code analyst. Your job is to answer questions about a codebase with clear, detailed, and well-structured explanations.

Follow these rules:
1. Give a concise summary answer first (1-2 sentences).
2. Then provide a detailed explanation broken into logical sections or bullet points.
3. Reference specific file paths, function names, class names, or line patterns from the CODE CONTEXT whenever possible.
4. If the context shows multiple relevant parts, explain how they connect to each other.
5. If the question cannot be fully answered from the context, say so clearly and explain what you can infer.
6. Use code snippets from the context to illustrate your points where helpful.
7. Do NOT invent code or functions that are not present in the context.
<|user|>
CODE CONTEXT (retrieved from the repository):
{context}

QUESTION: {question}
<|assistant|>
"""
    return prompt


def clean_answer(raw: str) -> str:
    """
    Post-process LLM output to remove common Granite artefacts.

    Granite sometimes echoes prompt markers or adds trailing whitespace.

    Args:
        raw: Raw string returned by the LLM

    Returns:
        Cleaned answer string
    """
    # Strip leading/trailing whitespace
    answer = raw.strip()

    # Remove echoed prompt markers that occasionally appear at the start
    prefixes_to_strip = ["ANSWER:", "Answer:", "assistant:", "<|assistant|>"]
    for prefix in prefixes_to_strip:
        if answer.startswith(prefix):
            answer = answer[len(prefix):].lstrip()

    return answer

# Made with Bob
