"""
Repository Ingestion Service
Handles cloning, chunking, and embedding of repositories
"""
import os
import shutil
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
    """Get ingestion status, with chromadb fallback for server restarts"""
    cached = ingestion_status.get(repo_id)
    if cached:
        return cached

    # Fallback: check if a completed chromadb collection exists on disk
    chroma_path = f"{settings.chromadb_dir}/{repo_id}"
    if os.path.isdir(chroma_path) and os.listdir(chroma_path):
        # Re-populate in-memory status so subsequent calls are fast
        ingestion_status[repo_id] = {"status": "completed", "progress": 100}
        return ingestion_status[repo_id]

    return {"status": "not_found", "progress": 0}


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
        
        # Step 1: Clone repository (try main, fallback to master)
        logger.info(f"Cloning repository: {repo_url}")
        repo_path = f"{settings.repositories_dir}/{repo_id}"
        
        # Always start with a clean directory to avoid stale git state
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)
        os.makedirs(repo_path, exist_ok=True)
        
        documents = None
        for branch in ["main", "master"]:
            try:
                # Clean directory before each branch attempt
                if os.path.exists(repo_path):
                    shutil.rmtree(repo_path)
                os.makedirs(repo_path, exist_ok=True)
                
                loader = GitLoader(
                    clone_url=repo_url,
                    repo_path=repo_path,
                    branch=branch,
                    file_filter=lambda file_path: True,  # Load ALL files
                )
                
                update_status(repo_id, "processing", 30)
                documents = loader.load()
                logger.info(f"Loaded {len(documents)} documents from branch '{branch}'")
                break
            except Exception as branch_err:
                logger.warning(f"Branch '{branch}' failed: {branch_err}")
                continue
        
        if documents is None:
            raise ValueError("Could not clone repository. Neither 'main' nor 'master' branch found.")
        
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
