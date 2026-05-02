"""
Repository Ingestion Service
Handles cloning, chunking, and embedding of repositories
"""
import os
import re
import shutil
import uuid
import logging
import threading
from typing import Dict, Any
from langchain_community.document_loaders import GitLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
from app.rag import get_embeddings, create_vectorstore

logger = logging.getLogger(__name__)

# In-memory storage for ingestion status (hackathon simplicity)
ingestion_status: Dict[str, Dict[str, Any]] = {}
# Thread-safe lock for status updates (Bug Fix #1)
_status_lock = threading.Lock()

# ---------------------------------------------------------------------------
# File-extension allow-list: only ingest readable text/code files.
# Binary files (images, compiled artifacts, etc.) break the embedding pipeline
# and waste token budget.
# ---------------------------------------------------------------------------
_ALLOWED_EXTENSIONS = {
    # Web / frontend
    ".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs",
    ".html", ".css", ".scss", ".sass", ".less", ".svelte", ".vue",
    # Backend / scripting
    ".py", ".rb", ".go", ".java", ".kt", ".scala",
    ".php", ".rs", ".c", ".cpp", ".h", ".hpp",
    ".cs", ".swift", ".m",
    # Shell / config
    ".sh", ".bash", ".zsh", ".fish",
    ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".env.example",
    # Data / docs
    ".json", ".xml", ".csv", ".sql",
    ".md", ".mdx", ".rst", ".txt",
    # Misc
    ".graphql", ".proto", ".tf", ".hcl",
}

# Directories to skip entirely
_SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv", "env",
    "dist", "build", ".next", ".nuxt", "out", "target",
    ".mypy_cache", ".pytest_cache", ".ruff_cache",
    "vendor", "third_party", ".idea", ".vscode",
}


def _is_allowed_file(file_path: str) -> bool:
    """
    Return True only for text/code files we can meaningfully embed.
    Rejects binary files, generated lock files, compiled artefacts, etc.
    """
    # Reject any path containing a skip directory
    parts = file_path.replace("\\", "/").split("/")
    for part in parts:
        if part in _SKIP_DIRS:
            return False

    # Must have an allowed extension (or be a well-known dotfile like .gitignore)
    _, ext = os.path.splitext(file_path)
    if ext.lower() in _ALLOWED_EXTENSIONS:
        return True

    # Allow extensionless files that are clearly text (Makefile, Dockerfile, etc.)
    basename = os.path.basename(file_path)
    _allowed_basenames = {
        "Makefile", "Dockerfile", "Procfile", "Gemfile", "Rakefile",
        ".gitignore", ".dockerignore", ".editorconfig", ".eslintrc",
        ".prettierrc", ".babelrc", "Pipfile",
    }
    if basename in _allowed_basenames:
        return True

    return False


def generate_repo_id() -> str:
    """Generate unique repository identifier"""
    return str(uuid.uuid4())


def validate_repo_id(repo_id: str) -> bool:
    """
    Validate repo_id is a valid UUID (Bug Fix #7)
    
    Args:
        repo_id: Repository identifier to validate
    
    Returns:
        True if valid UUID, False otherwise
    """
    try:
        uuid.UUID(repo_id)
        return True
    except ValueError:
        return False


def update_status(repo_id: str, status: str, progress: int = 0, error: str | None = None, stage: str | None = None):
    """Update ingestion status (thread-safe)"""
    with _status_lock:
        ingestion_status[repo_id] = {
            "status": status,
            "progress": progress,
            "error": error,
            "stage": stage,
        }
    logger.info(f"Repo {repo_id}: {status} ({progress}%) — {stage or ''}")


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
    Ingest a GitHub repository into the RAG pipeline.

    Steps:
    1. Clone repository using GitLoader (tries main, then master branch)
    2. Filter to code/text files only
    3. Split documents into overlapping chunks
    4. Generate embeddings and store in ChromaDB

    Args:
        repo_url: GitHub repository URL
        repo_id:  Unique repository identifier
    """
    try:
        update_status(repo_id, "processing", 5, stage="Starting ingestion...")

        # ------------------------------------------------------------------ #
        # Step 1: Clone repository                                             #
        # ------------------------------------------------------------------ #
        logger.info(f"Cloning repository: {repo_url}")
        repo_path = f"{settings.repositories_dir}/{repo_id}"

        # Always start with a clean directory to avoid stale git state
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)
        os.makedirs(repo_path, exist_ok=True)

        update_status(repo_id, "processing", 15, stage="Cloning repository...")

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
                    # BUG FIX: was `lambda file_path: True` which loaded
                    # binaries and lock files, breaking the embedding step.
                    file_filter=_is_allowed_file,
                )

                update_status(repo_id, "processing", 35, stage="Reading code files...")
                documents = loader.load()
                logger.info(
                    f"Loaded {len(documents)} documents from branch '{branch}'"
                )
                break
            except Exception as branch_err:
                logger.warning(f"Branch '{branch}' failed: {branch_err}")
                continue

        if documents is None:
            raise ValueError(
                "Could not clone repository. "
                "Neither 'main' nor 'master' branch found."
            )

        if not documents:
            raise ValueError(
                "No supported code/text files found in repository. "
                "Ensure the repository contains source files."
            )

        # ------------------------------------------------------------------ #
        # Step 2: Split documents                                              #
        # ------------------------------------------------------------------ #
        update_status(repo_id, "processing", 50, stage=f"Chunking {len(documents)} files...")
        logger.info(f"Splitting {len(documents)} documents into chunks")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""],
            length_function=len,
        )

        chunks = text_splitter.split_documents(documents)
        logger.info(f"Created {len(chunks)} chunks from {len(documents)} files")

        if not chunks:
            raise ValueError("Document splitting produced zero chunks. Check file contents.")

        # ------------------------------------------------------------------ #
        # Step 3: Generate embeddings and persist to ChromaDB                 #
        # ------------------------------------------------------------------ #
        update_status(repo_id, "processing", 70, stage="Generating embeddings...")
        logger.info("Generating embeddings and storing in ChromaDB")

        embeddings = get_embeddings()

        update_status(repo_id, "processing", 85, stage="Building vector index...")
        create_vectorstore(repo_id, chunks, embeddings)

        # ------------------------------------------------------------------ #
        # Step 4: Done                                                         #
        # ------------------------------------------------------------------ #
        update_status(repo_id, "completed", 100, stage="Ready!")
        logger.info(f"Repository {repo_id} ingestion completed successfully")

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Ingestion failed for {repo_id}: {error_msg}", exc_info=True)
        update_status(repo_id, "failed", 0, error_msg)


def validate_github_url(url: str) -> bool:
    """
    Validate that the URL is a well-formed GitHub repository URL.

    BUG FIX: old implementation used a substring check (`"github.com" in url`)
    which accepted hostile URLs like `evil.com/?r=github.com`.
    Now uses a proper regex anchored to the URL host.

    Args:
        url: Repository URL to validate

    Returns:
        True if valid, False otherwise
    """
    if not url:
        return False

    # Accept https://github.com/<owner>/<repo> or http variant
    # Trailing .git suffix is optional
    pattern = r"^https?://github\.com/[A-Za-z0-9_.\-]+/[A-Za-z0-9_.\-]+(\.git)?/?$"
    return bool(re.match(pattern, url.strip()))

# Made with Bob
