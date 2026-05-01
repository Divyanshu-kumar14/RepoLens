"""
API Routes - All endpoints in one file
Handles HTTP requests and responses
"""
import asyncio
import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks
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
    validate_github_url
)
from app.services.query import query_repository
from app.config import settings

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


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
        
        # Start background ingestion task
        background_tasks.add_task(
            ingest_repository,
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

# Made with Bob
