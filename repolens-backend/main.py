"""
RepoLens Backend - Main Entry Point
FastAPI application for chat with your codebase
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api.routes import router
import logging
import os
from app.config import settings

# Configure logging to show INFO level messages
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


class SelectiveGZipMiddleware(GZipMiddleware):
    """
    GZip middleware that skips compression for Server-Sent Events.
    Standard GZipMiddleware buffers the full response before compressing,
    which breaks real-time SSE streaming — tokens would never arrive until
    the stream closes. We bypass compression for any request that sends
    Accept: text/event-stream so tokens reach the client immediately.
    """
    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            headers = {k: v for k, v in scope.get("headers", [])}
            accept = headers.get(b"accept", b"").decode("utf-8", errors="ignore")
            if "text/event-stream" in accept:
                # Bypass GZip entirely for SSE connections
                await self.app(scope, receive, send)
                return
        await super().__call__(scope, receive, send)


# Bug Fix C2: Rate limiter to protect expensive endpoints (ingest, query)
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(
    title="RepoLens MVP",
    description="Chat with your codebase using watsonx.ai Granite",
    version="0.1.0"
)

# Attach rate limiter state and error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add selective gzip compression — skips SSE (text/event-stream) responses
app.add_middleware(SelectiveGZipMiddleware, minimum_size=1000)

# Configure CORS for frontend integration
# Issue #1 Fix: Restrict CORS to specific origins
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include API routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "RepoLens API is running",
        "version": "0.1.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        # Exclude data/ — cloned repos and ChromaDB files would otherwise
        # trigger constant server restarts during ingestion.
        reload_excludes=["data", "data/*", "data/**/*"] if settings.debug else None,
    )

# Made with Bob
