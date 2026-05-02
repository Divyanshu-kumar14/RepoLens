"""
RAG Pipeline - LangChain integration with watsonx.ai
Handles embeddings and LLM initialization
"""
from langchain_ibm import WatsonxLLM
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Module-level singleton to avoid re-initializing the heavy model on every call
_embeddings_instance: HuggingFaceEmbeddings | None = None


def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Initialize embeddings model (singleton)
    Uses HuggingFace sentence-transformers
    """
    global _embeddings_instance
    if _embeddings_instance is not None:
        return _embeddings_instance

    try:
        _embeddings_instance = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        logger.info("Embeddings model initialized successfully (HuggingFace)")
        return _embeddings_instance
    except Exception as e:
        logger.error(f"Failed to initialize embeddings: {e}")
        raise


def get_llm() -> WatsonxLLM:
    """
    Initialize watsonx.ai LLM
    Uses Granite 3 8B Instruct model
    """
    try:
        llm = WatsonxLLM(
            model_id="ibm/granite-8b-code-instruct",
            url=settings.watsonx_url,
            apikey=settings.watsonx_api_key,
            project_id=settings.watsonx_project_id,
            params={
                "max_new_tokens": 1000,
                "temperature": 0.3,
                "top_p": 0.9,
                "top_k": 50,
            }
        )
        logger.info("LLM initialized successfully")
        return llm
    except Exception as e:
        logger.error(f"Failed to initialize LLM: {e}")
        raise


def get_vectorstore(repo_id: str, embeddings: HuggingFaceEmbeddings) -> Chroma:
    """
    Load existing ChromaDB vectorstore for a repository
    
    Args:
        repo_id: Repository identifier
        embeddings: Embeddings function
        
    Returns:
        Chroma vectorstore instance
    """
    try:
        persist_directory = f"{settings.chromadb_dir}/{repo_id}"
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )
        logger.info(f"Loaded vectorstore for repo {repo_id}")
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to load vectorstore for {repo_id}: {e}")
        raise


def create_vectorstore(
    repo_id: str,
    documents: list,
    embeddings: HuggingFaceEmbeddings
) -> Chroma:
    """
    Create new ChromaDB vectorstore from documents
    
    Args:
        repo_id: Repository identifier
        documents: List of LangChain documents
        embeddings: Embeddings function
        
    Returns:
        Chroma vectorstore instance
    """
    try:
        persist_directory = f"{settings.chromadb_dir}/{repo_id}"
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=persist_directory
        )
        logger.info(f"Created vectorstore for repo {repo_id} with {len(documents)} documents")
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to create vectorstore for {repo_id}: {e}")
        raise


def build_prompt(context: str, question: str) -> str:
    """
    Build prompt for the LLM with context and question
    
    Args:
        context: Retrieved code context
        question: User's question
        
    Returns:
        Formatted prompt string
    """
    prompt = f"""You are a helpful code assistant. Provide a clear, concise answer based on the code context below. Reference specific files or functions when relevant.

CODE CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""
    
    return prompt

# Made with Bob
