"""
RAG Pipeline - LangChain integration with watsonx.ai
Handles embeddings and LLM initialization
"""
from langchain_ibm import WatsonxLLM
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import settings
import logging
import os
import shutil
import re
import threading
from typing import Dict

logger = logging.getLogger(__name__)

# Module-level singletons — avoids re-initializing heavy models on every call
_embeddings_instance: HuggingFaceEmbeddings | None = None
_embeddings_lock = threading.Lock()
_llm_instance: WatsonxLLM | None = None
_llm_lock = threading.Lock()

# Vectorstore connection pool (Issue #5: Vectorstore Pooling)
_vectorstore_cache: Dict[str, Chroma] = {}
_cache_lock = threading.Lock()
_MAX_CACHE_SIZE = 10  # Limit to 10 repositories in memory
_VECTORSTORE_BATCH_SIZE = 256


def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Initialize embeddings model (singleton).
    Uses HuggingFace sentence-transformers all-MiniLM-L6-v2.
    """
    global _embeddings_instance
    if _embeddings_instance is not None:
        return _embeddings_instance

    with _embeddings_lock:
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

    with _llm_lock:
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

    Issue #6 Fix: Properly cleanup old vectorstore connections to prevent memory leaks.

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
            
            # Cache it (limit cache size with proper cleanup)
            if len(_vectorstore_cache) >= _MAX_CACHE_SIZE:
                # Remove oldest entry (FIFO) with explicit cleanup
                oldest_key = next(iter(_vectorstore_cache))
                old_store = _vectorstore_cache.pop(oldest_key)
                # Issue #6 Fix: Explicit cleanup to prevent memory leaks
                try:
                    if hasattr(old_store, '_client'):
                        old_store._client.close()
                    logger.debug(f"Cache full, removed and cleaned up {oldest_key}")
                except Exception as cleanup_err:
                    logger.warning(f"Failed to cleanup vectorstore {oldest_key}: {cleanup_err}")
            
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

        # Invalidate stale cache entry before creating a new vectorstore
        with _cache_lock:
            _vectorstore_cache.pop(repo_id, None)
        
        # Bug Fix H5: Delete stale persist_directory on disk to prevent
        # Chroma from merging old data into the new vectorstore.
        if os.path.exists(persist_directory):
            shutil.rmtree(persist_directory)
            logger.info(f"Deleted stale vectorstore directory: {persist_directory}")

        # Build in batches so larger repos do not spend one huge blocking call
        # embedding and indexing every chunk at once.
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings,
            collection_metadata={
                "hnsw:space": "cosine",  # Cosine similarity for embeddings
                "hnsw:construction_ef": 100,  # Lower keeps demo ingestion faster
                "hnsw:search_ef": 50,
                "hnsw:M": 16,  # Number of connections per layer
            }
        )
        for start in range(0, len(documents), _VECTORSTORE_BATCH_SIZE):
            batch = documents[start:start + _VECTORSTORE_BATCH_SIZE]
            vectorstore.add_documents(batch)
            logger.info(
                "Indexed chunks %s-%s of %s for repo %s",
                start + 1,
                start + len(batch),
                len(documents),
                repo_id,
            )
        logger.info(
            f"Created optimized vectorstore for repo {repo_id} with {len(documents)} documents"
        )
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to create vectorstore for {repo_id}: {e}")
        raise


def _sanitize_prompt_input(text: str) -> str:
    """
    Bug Fix C3: Strip prompt-marker tokens from user input to prevent
    prompt injection attacks. Removes tokens like <|system|>, <|user|>,
    <|assistant|> that could hijack the LLM prompt structure.
    """
    # Remove chat template markers
    text = re.sub(r'<\|(?:system|user|assistant|end)\|>', '', text)
    # Remove common injection prefixes
    text = re.sub(r'(?i)^(SYSTEM:|INSTRUCTION:|CONTEXT:)\s*', '', text)
    return text.strip()


def build_prompt(context: str, question: str, mode: str = "explain") -> str:
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
    # Bug Fix C3: Sanitize user input to prevent prompt injection
    safe_question = _sanitize_prompt_input(question)
    mode_instructions = {
        "explain": "Explain the relevant code clearly and directly.",
        "debug": "Focus on likely bugs, failure points, and concrete fixes.",
        "summarize": "Give a compact summary with the most important details first.",
        "onboard": "Guide a new developer through the code and what to read next.",
    }
    answer_mode = mode_instructions.get(mode, mode_instructions["explain"])

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

Answer mode: {answer_mode}
<|user|>
CODE CONTEXT (retrieved from the repository):
{context}

QUESTION: {safe_question}
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

    # Remove echoed prompt markers that occasionally appear at the start.
    # Loop until no more prefixes match — handles stacked markers like
    # '<|assistant|>Answer: ...' which the old single-pass missed.
    prefixes_to_strip = ["ANSWER:", "Answer:", "assistant:", "<|assistant|>"]
    changed = True
    while changed:
        changed = False
        for prefix in prefixes_to_strip:
            if answer.startswith(prefix):
                answer = answer[len(prefix):].lstrip()
                changed = True

    return answer

# Made with Bob
