"""
Pydantic models for request/response validation
All API models in one file for simplicity
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class IngestRequest(BaseModel):
    """Request model for repository ingestion"""
    repo_url: str = Field(..., description="GitHub repository URL")
    
    class Config:
        json_schema_extra = {
            "example": {
                "repo_url": "https://github.com/user/repo"
            }
        }


class IngestResponse(BaseModel):
    """Response model for repository ingestion"""
    repo_id: str = Field(..., description="Unique repository identifier")
    status: str = Field(..., description="Ingestion status")
    message: Optional[str] = Field(None, description="Additional information")
    
    class Config:
        json_schema_extra = {
            "example": {
                "repo_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "processing",
                "message": "Repository ingestion started"
            }
        }


class IngestionStatus(BaseModel):
    """Response model for ingestion status check"""
    repo_id: str
    status: str = Field(..., description="completed|processing|failed")
    progress: Optional[int] = Field(None, description="Progress percentage (0-100)")
    stage: Optional[str] = Field(None, description="Human-readable stage description")
    error: Optional[str] = Field(None, description="Error message if failed")
    
    class Config:
        json_schema_extra = {
            "example": {
                "repo_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "completed",
                "progress": 100
            }
        }


class QueryRequest(BaseModel):
    """Request model for querying a repository"""
    repo_id: str = Field(..., description="Repository identifier")
    question: str = Field(..., description="Natural language question about the code")
    
    class Config:
        json_schema_extra = {
            "example": {
                "repo_id": "550e8400-e29b-41d4-a716-446655440000",
                "question": "How does the authentication work?"
            }
        }


class Source(BaseModel):
    """Source document metadata"""
    file_path: str
    content: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "file_path": "src/auth/login.py"
            }
        }


class QueryResponse(BaseModel):
    """Response model for query results"""
    answer: str = Field(..., description="Generated answer from the LLM")
    sources: List[Source] = Field(default_factory=list, description="Source documents used")
    repo_id: str = Field(..., description="Repository identifier")
    
    class Config:
        json_schema_extra = {
            "example": {
                "answer": "The authentication uses JWT tokens...",
                "sources": [
                    {"file_path": "src/auth/login.py"},
                    {"file_path": "src/middleware/auth.py"}
                ],
                "repo_id": "550e8400-e29b-41d4-a716-446655440000"
            }
        }


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    watsonx_configured: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "ok",
                "version": "0.1.0",
                "watsonx_configured": True
            }
        }

# Made with Bob
