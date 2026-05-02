"""
Configuration management using Pydantic Settings
Loads environment variables from .env file
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # watsonx.ai Configuration
    watsonx_api_key: str
    watsonx_project_id: str
    watsonx_url: str = "https://us-south.ml.cloud.ibm.com"
    
    # Application Settings
    environment: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Storage Configuration
    data_dir: str = "./data"
    
    # Hugging Face Configuration
    hf_token: Optional[str] = None
    
    # Derived paths
    @property
    def repositories_dir(self) -> str:
        """Directory for cloned repositories"""
        return f"{self.data_dir}/repositories"
    
    @property
    def chromadb_dir(self) -> str:
        """Directory for ChromaDB vector storage"""
        return f"{self.data_dir}/chromadb"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()

# Made with Bob
