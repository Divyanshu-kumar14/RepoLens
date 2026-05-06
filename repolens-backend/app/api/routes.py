"""
API Routes - All endpoints in one file
Handles HTTP requests and responses
"""
import asyncio
import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from fastapi.responses import StreamingResponse
from app.models import (
    IngestRequest,
    IngestResponse,
    IngestionStatus,
    QueryRequest,
    QueryResponse,
    HealthResponse,
    RepoSummaryResponse
)
from app.services.ingestion import (
    generate_repo_id,
    ingest_repository,
    get_status,
    validate_github_url,
    validate_repo_id,
    update_status,
    find_existing_repo,
    load_repo_metadata
)
from app.services.query import query_repository
from app.services.stream import stream_query_repository
from app.config import settings

logger = logging.getLogger(__name__)
QUERY_TIMEOUT_SECONDS = 60

# Bug Fix C2: Import limiter — initialized in main.py, accessed here via app.state
from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)

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
@limiter.limit("5/minute")
async def ingest_repo(
    request: Request,
    ingest_request: IngestRequest,
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
        if not validate_github_url(ingest_request.repo_url):
            raise HTTPException(
                status_code=400,
                detail="Invalid GitHub URL. Must be a valid github.com repository URL"
            )

        existing_repo_id = find_existing_repo(ingest_request.repo_url)
        if existing_repo_id:
            status = get_status(existing_repo_id)
            logger.info(f"Reusing existing ingestion {existing_repo_id}")
            return IngestResponse(
                repo_id=existing_repo_id,
                status=status["status"],
                message="Repository already ingested; reusing existing index",
                reused=True,
            )
        
        # Generate unique repo ID
        repo_id = generate_repo_id()
        logger.info(f"Starting ingestion for {ingest_request.repo_url} with ID {repo_id}")
        
        # Start background ingestion task with safe wrapper (Bug Fix #4)
        background_tasks.add_task(
            safe_ingest_wrapper,
            ingest_request.repo_url,
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
            error=status.get("error"),
            stats=status.get("stats"),
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

    Issue #2 Fix: Validate and sanitize file paths to prevent path traversal.
    """
    try:
        if not validate_repo_id(repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(repo_id)
        if status["status"] != "completed":
            raise HTTPException(status_code=400, detail="Repository not yet ingested")

        from app.services.ingestion import load_repo_files
        files = await asyncio.to_thread(load_repo_files, repo_id)
        
        if files is None:
            raise HTTPException(status_code=404, detail="Repository files data not found")

        return {"repo_id": repo_id, "files": files, "total": len(files)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get files for {repo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get files: {str(e)}")


@router.get("/ingest/{repo_id}/summary", response_model=RepoSummaryResponse)
async def get_repo_summary(repo_id: str):
    """Get the lightweight repo summary generated during ingestion."""
    try:
        if not validate_repo_id(repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(repo_id)
        if status["status"] != "completed":
            raise HTTPException(status_code=400, detail="Repository not yet ingested")

        metadata = await asyncio.to_thread(load_repo_metadata, repo_id)
        if not metadata:
            raise HTTPException(status_code=404, detail="Repository summary not found")

        return RepoSummaryResponse(
            repo_id=repo_id,
            summary=metadata.get("summary", ""),
            suggested_questions=metadata.get("suggested_questions", []),
            stats=metadata.get("stats", {}),
            code_health=metadata.get("code_health", {}),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get summary for {repo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")


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

        metadata = await asyncio.to_thread(load_repo_metadata, repo_id)
        if metadata and metadata.get("stats"):
            return {
                "repo_id": repo_id,
                **metadata["stats"],
            }
            
        raise HTTPException(status_code=404, detail="Repository stats not found")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get stats for {repo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")


@router.get("/ingest/{repo_id}/structure")
async def get_repo_structure(repo_id: str):
    """
    Get repository structure for mind map visualization.
    Returns flat nodes (legacy) + full nested tree for the interactive mind map.
    """
    try:
        if not validate_repo_id(repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(repo_id)
        if status["status"] != "completed":
            raise HTTPException(status_code=400, detail="Repository not yet ingested")

        from app.services.ingestion import load_repo_structure
        structure = await asyncio.to_thread(load_repo_structure, repo_id)
        
        if structure is None:
            raise HTTPException(status_code=404, detail="Repository structure data not found")

        return structure

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get structure for {repo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get structure: {str(e)}")


@router.post("/query", response_model=QueryResponse)
@limiter.limit("30/minute")
async def query_repo(request: Request, query_request: QueryRequest):
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
        if not validate_repo_id(query_request.repo_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid repository ID format"
            )
        
        # Validate repo exists and is completed
        status = get_status(query_request.repo_id)
        
        if status["status"] == "not_found":
            raise HTTPException(
                status_code=404,
                detail=f"Repository {query_request.repo_id} not found. Please ingest it first."
            )
        
        if status["status"] == "processing":
            raise HTTPException(
                status_code=400,
                detail=f"Repository {query_request.repo_id} is still being processed. Please wait."
            )
        
        if status["status"] == "failed":
            raise HTTPException(
                status_code=400,
                detail=f"Repository {query_request.repo_id} ingestion failed: {status.get('error', 'Unknown error')}"
            )
        
        # Process query
        logger.info(f"Processing query for repo {query_request.repo_id}")
        try:
            result = await asyncio.wait_for(
                asyncio.to_thread(
                    query_repository,
                    query_request.repo_id,
                    query_request.question,
                    query_request.mode,
                ),
                timeout=QUERY_TIMEOUT_SECONDS,
            )
        except TimeoutError:
            logger.warning(
                "Query timed out for repo %s after %ss",
                query_request.repo_id,
                QUERY_TIMEOUT_SECONDS,
            )
            raise HTTPException(
                status_code=504,
                detail="Query timed out. Try a more specific question.",
            )
        
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
@limiter.limit("30/minute")
async def query_repo_stream(request: Request, query_request: QueryRequest):
    """
    Stream a repository query answer as Server-Sent Events (SSE).

    The client receives:
      data: {"token": "..."}   — for each generated token
      data: {"sources": [...]} — final sources payload
      data: [DONE]             — stream terminator
    """
    try:
        if not validate_repo_id(query_request.repo_id):
            raise HTTPException(status_code=400, detail="Invalid repository ID format")

        status = get_status(query_request.repo_id)
        if status["status"] == "not_found":
            raise HTTPException(status_code=404, detail=f"Repository {query_request.repo_id} not found.")
        if status["status"] == "processing":
            raise HTTPException(status_code=400, detail="Repository is still being processed.")
        if status["status"] == "failed":
            raise HTTPException(status_code=400, detail=f"Repository ingestion failed: {status.get('error')}")

        return StreamingResponse(
            stream_query_repository(
                query_request.repo_id,
                query_request.question,
                query_request.mode,
            ),
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
