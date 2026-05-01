"""
Repository Ingestion Service
Handles cloning, chunking, and embedding of repositories
"""
import os
import uuid
import logging
from typing import Dict, Any
from langchain_community.document_loaders import GitLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
from app.rag import get_embeddings, create_vectorstore

logger = logging.getLogger(__name__)

# In-memory storage for ingestion status (hackathon simplicity)
ingestion_status: Dict[str, Dict[str, Any]] = {}


def generate_repo_id() -> str:
    """Generate unique repository identifier"""
    return str(uuid.uuid4())


def update_status(repo_id: str, status: str, progress: int = 0, error: str = None):
    """Update ingestion status"""
    ingestion_status[repo_id] = {
        "status": status,
        "progress": progress,
        "error": error
    }
    logger.info(f"Repo {repo_id}: {status} ({progress}%)")


def get_status(repo_id: str) -> Dict[str, Any]:
    """Get ingestion status"""
    return ingestion_status.get(repo_id, {"status": "not_found", "progress": 0})


def ingest_repository(repo_url: str, repo_id: str) -> None:
    """
    Ingest a GitHub repository
    
    Steps:
    1. Clone repository using GitLoader
    2. Split documents into chunks
    3. Generate embeddings
    4. Store in ChromaDB
    
    Args:
        repo_url: GitHub repository URL
        repo_id: Unique repository identifier
    """
    try:
        # Update status: starting
        update_status(repo_id, "processing", 10)
        
        # Step 1: Clone repository
        logger.info(f"Cloning repository: {repo_url}")
        repo_path = f"{settings.repositories_dir}/{repo_id}"
        os.makedirs(repo_path, exist_ok=True)
        
        loader = GitLoader(
            clone_url=repo_url,
            repo_path=repo_path,
            branch="main"  # Try main first, fallback handled by GitLoader
        )
        
        update_status(repo_id, "processing", 30)
        documents = loader.load()
        logger.info(f"Loaded {len(documents)} documents from repository")
        
        if not documents:
            raise ValueError("No documents found in repository")
        
        # Step 2: Split documents
        update_status(repo_id, "processing", 50)
        logger.info("Splitting documents into chunks")
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""],
            length_function=len,
        )
        
        chunks = text_splitter.split_documents(documents)
        logger.info(f"Created {len(chunks)} chunks")
        
        # Step 3: Generate embeddings and store
        update_status(repo_id, "processing", 70)
        logger.info("Generating embeddings and storing in ChromaDB")
        
        embeddings = get_embeddings()
        vectorstore = create_vectorstore(repo_id, chunks, embeddings)
        
        # Step 4: Complete
        update_status(repo_id, "completed", 100)
        logger.info(f"Repository {repo_id} ingestion completed successfully")
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Ingestion failed for {repo_id}: {error_msg}")
        update_status(repo_id, "failed", 0, error_msg)


def validate_github_url(url: str) -> bool:
    """
    Basic validation for GitHub URLs
    
    Args:
        url: Repository URL to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not url:
        return False
    
    # Basic check for github.com
    valid_patterns = [
        "github.com",
        "https://github.com",
        "http://github.com"
    ]
    
    return any(pattern in url.lower() for pattern in valid_patterns)

# Made with Bob
