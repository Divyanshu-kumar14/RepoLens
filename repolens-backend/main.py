"""
RepoLens Backend - Main Entry Point
FastAPI application for chat with your codebase
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.types import ASGIApp, Receive, Scope, Send
from app.api.routes import router
import logging
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


# Initialize FastAPI app
app = FastAPI(
    title="RepoLens MVP",
    description="Chat with your codebase using watsonx.ai Granite",
    version="0.1.0"
)

# Add selective gzip compression — skips SSE (text/event-stream) responses
app.add_middleware(SelectiveGZipMiddleware, minimum_size=1000)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hackathon mode - allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        reload_excludes=["data/*"] if settings.debug else None,
    )

# Made with Bob
