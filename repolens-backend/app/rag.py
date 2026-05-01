"""
RAG Pipeline - LangChain integration with watsonx.ai
Handles embeddings and LLM initialization
"""
from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain_community.vectorstores import Chroma
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def get_embeddings() -> WatsonxEmbeddings:
    """
    Initialize watsonx.ai embeddings model
    Uses IBM Slate model for code embeddings
    """
    try:
        embeddings = WatsonxEmbeddings(
            model_id="ibm/slate-125m-english-rtrvr",
            url=settings.watsonx_url,
            apikey=settings.watsonx_api_key,
            project_id=settings.watsonx_project_id
        )
        logger.info("Embeddings model initialized successfully")
        return embeddings
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
            model_id="ibm/granite-3-8b-instruct",
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


def get_vectorstore(repo_id: str, embeddings: WatsonxEmbeddings) -> Chroma:
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
    embeddings: WatsonxEmbeddings
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
    prompt = f"""You are a helpful code assistant. Answer the question based on the provided code context.

CODE CONTEXT:
{context}

QUESTION: {question}

ANSWER: Provide a clear, concise answer based on the code context above. Reference specific files or functions when relevant."""
    
    return prompt

# Made with Bob
