"""
API Routes - All endpoints in one file
Handles HTTP requests and responses
"""
import asyncio
import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.models import (
    IngestRequest,
    IngestResponse,
    IngestionStatus,
    QueryRequest,
    QueryResponse,
    HealthResponse
)
from app.services.ingestion import (
    generate_repo_id,
    ingest_repository,
    get_status,
    validate_github_url,
    validate_repo_id,
    update_status
)
from app.services.query import query_repository
from app.services.stream import stream_query_repository
from app.config import settings

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


# Bug Fix: safe_ingest_wrapper must run sync ingest_repository in a thread pool
# to avoid blocking the entire FastAPI event loop during clone/embed operations.
async def safe_ingest_wrapper(repo_url: str, repo_id: str):
    """Wrapper that ensures exceptions in background tasks are logged and tracked"""
    try:
        # ingest_repository is synchronous (disk I/O + CPU-bound embedding).
        # Run it in a thread pool so FastAPI's event loop stays unblocked.
        await asyncio.to_thread(ingest_repository, repo_url, repo_id)
    except Exception as e:
        logger.error(f"Background ingestion failed for {repo_id}: {e}", exc_info=True)
        update_status(repo_id, "failed", 0, str(e))



@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    Verifies API is running and watsonx.ai is configured
    """
    watsonx_configured = bool(
        settings.watsonx_api_key and 
        settings.watsonx_project_id
    )
    
    return HealthResponse(
        status="ok",
        version="0.1.0",
        watsonx_configured=watsonx_configured
    )


@router.post("/ingest", response_model=IngestResponse)
async def ingest_repo(
    request: IngestRequest,
    background_tasks: BackgroundTasks
):
    """
    Ingest a GitHub repository
    
    Starts background task to:
    1. Clone repository
    2. Split into chunks
    3. Generate embeddings
    4. Store in ChromaDB
    
    Returns immediately with repo_id for status tracking
    """
    try:
        # Validate GitHub URL
        if not validate_github_url(request.repo_url):
            raise HTTPException(
                status_code=400,
                detail="Invalid GitHub URL. Must be a valid github.com repository URL"
            )
        
        # Generate unique repo ID
        repo_id = generate_repo_id()
        logger.info(f"Starting ingestion for {request.repo_url} with ID {repo_id}")
        
        # Start background ingestion task with safe wrapper (Bug Fix #4)
        background_tasks.add_task(
            safe_ingest_wrapper,
            request.repo_url,
            repo_id
        )
        
        return IngestResponse(
            repo_id=repo_id,
            status="processing",
            message="Repository ingestion started"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to start ingestion: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start ingestion: {str(e)}"
        )


@router.get("/ingest/{repo_id}/status", response_model=IngestionStatus)
async def get_ingestion_status(repo_id: str):
    """
    Get ingestion status for a repository
    
    Returns:
    - status: completed|processing|failed|not_found
    - progress: 0-100
    - error: error message if failed
    """
    try:
        # Bug Fix #7: Validate repo_id format
        if not validate_repo_id(repo_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid repository ID format"
            )
        
        status = get_status(repo_id)
        
        if status["status"] == "not_found":
            raise HTTPException(
                status_code=404,
                detail=f"Repository {repo_id} not found"
            )
        
        return IngestionStatus(
            repo_id=repo_id,
            status=status["status"],
            progress=status.get("progress", 0),
            stage=status.get("stage"),
            error=status.get("error")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get status for {repo_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get status: {str(e)}"
        )


@router.get("/ingest/{repo_id}/files")
async def get_repo_files(repo_id: str):
    """
    Get list of all files ingested for a repository.
    Reads unique source paths from ChromaDB metadata.
    Returns a sorted list used by the file tree UI.
    """
    try:
        if not validate_repo_id(repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(repo_id)
        if status["status"] != "completed":
            raise HTTPException(status_code=400, detail="Repository not yet ingested")

        from app.rag import get_embeddings, get_vectorstore
        embeddings = get_embeddings()
        vectorstore = get_vectorstore(repo_id, embeddings)

        # Fetch all document metadata from ChromaDB
        collection = vectorstore._collection
        result = collection.get(include=["metadatas"])

        # Extract unique file paths
        seen: set = set()
        files: list[str] = []
        for meta in (result.get("metadatas") or []):
            path = (meta or {}).get("source", "")
            if path and path not in seen:
                seen.add(path)
                files.append(path)

        files.sort()
        return {"repo_id": repo_id, "files": files, "total": len(files)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get files for {repo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get files: {str(e)}")


@router.get("/ingest/{repo_id}/stats")
async def get_repo_stats(repo_id: str):
    """
    Code Health Dashboard stats for a repository.
    Returns language breakdown, file counts, top directories, and chunk count.
    """
    try:
        if not validate_repo_id(repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(repo_id)
        if status["status"] != "completed":
            raise HTTPException(status_code=400, detail="Repository not yet ingested")

        from app.rag import get_embeddings, get_vectorstore
        embeddings = get_embeddings()
        vectorstore = get_vectorstore(repo_id, embeddings)

        collection = vectorstore._collection
        result = collection.get(include=["metadatas"])
        metadatas = result.get("metadatas") or []

        # Language mapping by extension
        LANG_MAP = {
            "py": "Python", "js": "JavaScript", "ts": "TypeScript",
            "tsx": "TypeScript/React", "jsx": "JavaScript/React",
            "go": "Go", "rs": "Rust", "java": "Java",
            "cpp": "C++", "c": "C", "rb": "Ruby", "php": "PHP",
            "swift": "Swift", "kt": "Kotlin", "cs": "C#",
            "html": "HTML", "css": "CSS", "scss": "SCSS",
            "md": "Markdown", "json": "JSON", "yaml": "YAML",
            "yml": "YAML", "toml": "TOML", "sh": "Shell",
            "sql": "SQL", "dockerfile": "Docker",
        }

        seen_files: set = set()
        lang_counts: dict[str, int] = {}
        dir_counts: dict[str, int] = {}
        total_chunks = len(metadatas)

        for meta in metadatas:
            path = (meta or {}).get("source", "")
            if not path:
                continue

            # Count unique files
            if path not in seen_files:
                seen_files.add(path)

                # Language breakdown
                ext = path.rsplit(".", 1)[-1].lower() if "." in path else ""
                lang = LANG_MAP.get(ext, "Other")
                lang_counts[lang] = lang_counts.get(lang, 0) + 1

                # Top-level directory breakdown
                parts = path.replace("\\", "/").split("/")
                top_dir = parts[1] if len(parts) > 2 else parts[0]
                dir_counts[top_dir] = dir_counts.get(top_dir, 0) + 1

        # Sort and limit
        lang_sorted = sorted(lang_counts.items(), key=lambda x: -x[1])
        dir_sorted = sorted(dir_counts.items(), key=lambda x: -x[1])[:8]

        return {
            "repo_id": repo_id,
            "total_files": len(seen_files),
            "total_chunks": total_chunks,
            "languages": [{"name": k, "count": v} for k, v in lang_sorted],
            "top_directories": [{"name": k, "count": v} for k, v in dir_sorted],
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get stats for {repo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")


@router.post("/query", response_model=QueryResponse)
async def query_repo(request: QueryRequest):
    """
    Query a repository with a natural language question
    
    Uses RAG pipeline:
    1. Retrieve relevant code chunks from ChromaDB
    2. Build prompt with context
    3. Generate answer using watsonx.ai Granite
    4. Return answer with source references
    """
    try:
        # Bug Fix #7: Validate repo_id format
        if not validate_repo_id(request.repo_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid repository ID format"
            )
        
        # Validate repo exists and is completed
        status = get_status(request.repo_id)
        
        if status["status"] == "not_found":
            raise HTTPException(
                status_code=404,
                detail=f"Repository {request.repo_id} not found. Please ingest it first."
            )
        
        if status["status"] == "processing":
            raise HTTPException(
                status_code=400,
                detail=f"Repository {request.repo_id} is still being processed. Please wait."
            )
        
        if status["status"] == "failed":
            raise HTTPException(
                status_code=400,
                detail=f"Repository {request.repo_id} ingestion failed: {status.get('error', 'Unknown error')}"
            )
        
        # Process query
        logger.info(f"Processing query for repo {request.repo_id}")
        result = await asyncio.to_thread(query_repository, request.repo_id, request.question)
        
        return QueryResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Query failed: {str(e)}"
        )

@router.post("/query/stream")
async def query_repo_stream(request: QueryRequest):
    """
    Stream a repository query answer as Server-Sent Events (SSE).

    The client receives:
      data: {"token": "..."}   — for each generated token
      data: {"sources": [...]} — final sources payload
      data: [DONE]             — stream terminator
    """
    try:
        if not validate_repo_id(request.repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(request.repo_id)
        if status["status"] == "not_found":
            raise HTTPException(status_code=404, detail=f"Repository {request.repo_id} not found.")
        if status["status"] == "processing":
            raise HTTPException(status_code=400, detail="Repository is still being processed.")
        if status["status"] == "failed":
            raise HTTPException(status_code=400, detail=f"Repository ingestion failed: {status.get('error')}")

        return StreamingResponse(
            stream_query_repository(request.repo_id, request.question),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",  # Disable nginx buffering
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Stream query setup failed: {e}")
        raise HTTPException(status_code=500, detail=f"Stream query failed: {str(e)}")

# Made with Bob
