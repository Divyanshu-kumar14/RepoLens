"""
RepoLens Backend - Main Entry Point
FastAPI application for chat with your codebase
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="RepoLens MVP",
    description="Chat with your codebase using watsonx.ai Granite",
    version="0.1.0"
)

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
        reload=settings.debug
    )

# Made with Bob
