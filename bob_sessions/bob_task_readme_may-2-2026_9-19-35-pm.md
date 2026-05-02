**User:**

<task>
Generate a detailed, professional README.md for the RepoLens project. Read through the entire codebase first — both /repolens-backend and /repolens-frontend — before writing anything.

The README should include these sections:

1. **Hero section** — Project name, one-line tagline ("Chat with your codebase"), and 3-4 badges (Python, Next.js, watsonx.ai, License)

2. **Overview** — 2-3 paragraphs explaining what RepoLens does, the problem it solves (developers waste hours understanding unfamiliar codebases), and how it works at a high level (paste a GitHub URL → ask questions in natural language → get answers with source citations)

3. **Key Features** — Bullet list of every major feature:
   - Natural language chat with any GitHub repository
   - Streaming responses (SSE, token by token)
   - Interactive mind map of full folder structure (pan, zoom, expand/collapse)
   - Code health dashboard (language breakdown, file stats)
   - File tree with click-to-explain
   - Suggested question chips
   - Auto-summary on ingestion
   - RAG pipeline with ChromaDB vector store

4. **Tech Stack** — A clean table with:
   - Backend: Python, FastAPI, LangChain, ChromaDB, ibm-watsonx-ai
   - Frontend: Next.js 16, React 19, Framer Motion, Material UI
   - AI: IBM watsonx.ai Granite models
   - Package manager: uv (Python), npm (Node)

5. **Architecture** — A mermaid diagram showing the flow: User → Next.js Frontend → FastAPI Backend → (Clone repo → Chunk files → Embed with HuggingFace → Store in ChromaDB) → Query: (User question → Retrieve relevant chunks → Build prompt → watsonx.ai Granite LLM → Stream response back)

6. **Getting Started** — Step by step:
   - Prerequisites (Python 3.11+, Node 18+, uv, Git)
   - Clone the repo
   - Backend setup: copy .env.example, add WATSONX_API_KEY and WATSONX_PROJECT_ID, run `uv sync`, start with `uv run uvicorn main:app --reload`
   - Frontend setup: copy .env.local, run `npm install`, start with `npm run dev`
   - Open http://localhost:3000

7. **Environment Variables** — A table listing every env var from both .env files with descriptions

8. **API Endpoints** — A table documenting every endpoint:
   - GET /api/health
   - POST /api/ingest
   - GET /api/ingest/{repo_id}/status
   - GET /api/ingest/{repo_id}/files
   - GET /api/ingest/{repo_id}/stats
   - GET /api/ingest/{repo_id}/structure
   - POST /api/query
   - POST /api/query/stream

9. **Project Structure** — A tree showing the folder layout of both backend and frontend

10. **IBM watsonx.ai Integration** — Explain how the app uses Granite models, IAM token refresh, and the LangChain integration

11. **Built with IBM Bob** — A section explaining how IBM Bob was used as an AI pair programmer throughout development: architecture, code generation, debugging, UI/UX, documentation

12. **License** — MIT

Keep the tone professional but approachable. Use emojis sparingly (only in section headers). Make it look like a top-tier open source project README. Do NOT use placeholder text — read the actual code and reference real file names, real endpoints, real components.
</task>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs


# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T15:48:04.107Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>


# Current Workspace Directory (/home/rtx/RepoLens) Files
.gitignore
AGENTS.md
ARCHITECTURE_BLUEPRINT.md
LICENSE
QUICKSTART.md
README.md
.bob/
bob_sessions/
bob_sessions/bob_task_add_more_features_may-2-2026_1-35-20-pm.md
bob_sessions/bob_task_add_more_features_may-2-2026_1-35-20-pm.png
bob_sessions/bob_task_architecture_blueprint_may-1-2026_8-58-48-pm.md
bob_sessions/bob_task_architecture_blueprint_may-1-2026_8-58-48-pm.png
bob_sessions/bob_task_bug_fixes_may-2-2026_12-39-06-pm.md
bob_sessions/bob_task_bug_fixes_may-2-2026_12-39-06-pm.png
bob_sessions/bob_task_bugfixes_may-2-2026_7-05-02-pm.md
bob_sessions/bob_task_bugfixes_may-2-2026_7-05-02-pm.png
bob_sessions/bob_task_debugging_may-1-2026_11-10-32-pm.md
bob_sessions/bob_task_debugging_may-1-2026_11-10-32-pm.png
bob_sessions/bob_task_fixes_the_backend_may-1-2026_11-10-32-pm.md
bob_sessions/bob_task_fixes_the_backend_may-1-2026_11-10-32-pm.png
bob_sessions/bob_task_frontend_may-2-2026_12-53-07-am
bob_sessions/bob_task_frontend_may-2-2026_12-53-07-am.png
bob_sessions/bob_task_frontend_redesign_may-2-2026_11-31-48-am.md
bob_sessions/bob_task_frontend_redesign_may-2-2026_11-31-48-am.png
bob_sessions/bob_task_may-1-2026_8-27-35-pm.md
bob_sessions/bob_task_may-1-2026_8-27-35-pm.png
bob_sessions/bob_task_mind_map_may-2-2026_6-28-15-pm.md
bob_sessions/bob_task_mind_map_may-2-2026_6-28-15-pm.png
repolens-backend/
repolens-backend/.env.example
repolens-backend/main.py
repolens-backend/pyproject.toml
repolens-backend/README.md
repolens-backend/requirements.txt
repolens-backend/uv.lock
repolens-backend/app/
repolens-backend/app/__init__.py
repolens-backend/app/config.py
repolens-backend/app/models.py
repolens-backend/app/rag.py
repolens-backend/app/api/
repolens-backend/app/api/__init__.py
repolens-backend/app/api/routes.py
repolens-backend/app/services/
repolens-backend/app/services/__init__.py
repolens-backend/app/services/ingestion.py
repolens-backend/app/services/query.py
repolens-backend/app/services/stream.py
repolens-frontend/
repolens-frontend/.env.example
repolens-frontend/AGENTS.md
repolens-frontend/CHATBOX_AUTOSCROLL_FIX.md
repolens-frontend/CODE_REVIEW_REPORT.md
repolens-frontend/DESIGN_SYSTEM.md
repolens-frontend/eslint.config.mjs
repolens-frontend/next-env.d.ts
repolens-frontend/next.config.ts
repolens-frontend/package-lock.json
repolens-frontend/package.json
repolens-frontend/postcss.config.mjs
repolens-frontend/README.md
repolens-frontend/tsconfig.json
repolens-frontend/tsconfig.tsbuildinfo
repolens-frontend/app/
repolens-frontend/app/favicon.ico
repolens-frontend/app/globals.css
repolens-frontend/app/layout.tsx
repolens-frontend/app/page.tsx
repolens-frontend/components/
repolens-frontend/components/ChatBox.tsx
repolens-frontend/components/ChatInterface3D.tsx
repolens-frontend/components/CodeHealthDashboard.tsx
repolens-frontend/components/ErrorBoundary.tsx
repolens-frontend/components/FileTree.tsx
repolens-frontend/components/Hero3D.tsx
repolens-frontend/components/MessageList.tsx
repolens-frontend/components/MindMapVisualization.tsx
repolens-frontend/components/RepoInput.tsx
repolens-frontend/components/ui/
repolens-frontend/components/ui/Button3D.tsx
repolens-frontend/components/ui/Card3D.tsx
repolens-frontend/components/ui/Input3D.tsx
repolens-frontend/components/ui/LoadingSpinner.tsx
repolens-frontend/components/ui/MarkdownRenderer.tsx
repolens-frontend/components/ui/Navigation3D.tsx
repolens-frontend/components/ui/Toast.tsx
repolens-frontend/hooks/
repolens-frontend/hooks/useTheme.ts
repolens-frontend/hooks/useToast.ts
repolens-frontend/public/
repolens-frontend/public/file.svg
repolens-frontend/public/globe.svg
repolens-frontend/public/next.svg
repolens-frontend/public/vercel.svg
repolens-frontend/public/window.svg
repolens-frontend/services/
repolens-frontend/services/api.ts
repolens-frontend/types/
repolens-frontend/types/api.ts
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll start by reading through the entire codebase to understand the project structure, features, and implementation details before generating the README.

<read_file>
<args>
<file>
<path>repolens-backend/main.py</path>
</file>
<file>
<path>repolens-backend/app/config.py</path>
</file>
<file>
<path>repolens-backend/app/models.py</path>
</file>
<file>
<path>repolens-backend/app/rag.py</path>
</file>
<file>
<path>repolens-backend/app/api/routes.py</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>repolens-backend/main.py</path>
<content lines="1-79">
 1 | """
 2 | RepoLens Backend - Main Entry Point
 3 | FastAPI application for chat with your codebase
 4 | """
 5 | from fastapi import FastAPI
 6 | from fastapi.middleware.cors import CORSMiddleware
 7 | from fastapi.middleware.gzip import GZipMiddleware
 8 | from starlette.types import ASGIApp, Receive, Scope, Send
 9 | from app.api.routes import router
10 | import logging
11 | from app.config import settings
12 | 
13 | # Configure logging to show INFO level messages
14 | logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
15 | 
16 | 
17 | class SelectiveGZipMiddleware(GZipMiddleware):
18 |     """
19 |     GZip middleware that skips compression for Server-Sent Events.
20 |     Standard GZipMiddleware buffers the full response before compressing,
21 |     which breaks real-time SSE streaming — tokens would never arrive until
22 |     the stream closes. We bypass compression for any request that sends
23 |     Accept: text/event-stream so tokens reach the client immediately.
24 |     """
25 |     async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
26 |         if scope["type"] == "http":
27 |             headers = {k: v for k, v in scope.get("headers", [])}
28 |             accept = headers.get(b"accept", b"").decode("utf-8", errors="ignore")
29 |             if "text/event-stream" in accept:
30 |                 # Bypass GZip entirely for SSE connections
31 |                 await self.app(scope, receive, send)
32 |                 return
33 |         await super().__call__(scope, receive, send)
34 | 
35 | 
36 | # Initialize FastAPI app
37 | app = FastAPI(
38 |     title="RepoLens MVP",
39 |     description="Chat with your codebase using watsonx.ai Granite",
40 |     version="0.1.0"
41 | )
42 | 
43 | # Add selective gzip compression — skips SSE (text/event-stream) responses
44 | app.add_middleware(SelectiveGZipMiddleware, minimum_size=1000)
45 | 
46 | # Configure CORS for frontend integration
47 | app.add_middleware(
48 |     CORSMiddleware,
49 |     allow_origins=["*"],  # Hackathon mode - allow all origins
50 |     allow_credentials=True,
51 |     allow_methods=["*"],
52 |     allow_headers=["*"],
53 | )
54 | 
55 | # Include API routes
56 | app.include_router(router, prefix="/api")
57 | 
58 | @app.get("/")
59 | async def root():
60 |     """Root endpoint - health check"""
61 |     return {
62 |         "message": "RepoLens API is running",
63 |         "version": "0.1.0",
64 |         "docs": "/docs"
65 |     }
66 | 
67 | if __name__ == "__main__":
68 |     import uvicorn
69 |     uvicorn.run(
70 |         app,
71 |         host=settings.host,
72 |         port=settings.port,
73 |         reload=settings.debug,
74 |         # Exclude data/ — cloned repos and ChromaDB files would otherwise
75 |         # trigger constant server restarts during ingestion.
76 |         reload_excludes=["data", "data/*", "data/**/*"] if settings.debug else None,
77 |     )
78 | 
79 | # Made with Bob
</content>
</file>
<file><path>repolens-backend/app/config.py</path>
<content lines="1-49">
 1 | """
 2 | Configuration management using Pydantic Settings
 3 | Loads environment variables from .env file
 4 | """
 5 | from pydantic_settings import BaseSettings
 6 | from typing import Optional
 7 | 
 8 | 
 9 | class Settings(BaseSettings):
10 |     """Application settings loaded from environment variables"""
11 |     
12 |     # watsonx.ai Configuration
13 |     watsonx_api_key: str
14 |     watsonx_project_id: str
15 |     watsonx_url: str = "https://us-south.ml.cloud.ibm.com"
16 |     
17 |     # Application Settings
18 |     environment: str = "development"
19 |     debug: bool = True
20 |     host: str = "0.0.0.0"
21 |     port: int = 8000
22 |     
23 |     # Storage Configuration
24 |     data_dir: str = "./data"
25 |     
26 |     # Hugging Face Configuration
27 |     hf_token: Optional[str] = None
28 |     
29 |     # Derived paths
30 |     @property
31 |     def repositories_dir(self) -> str:
32 |         """Directory for cloned repositories"""
33 |         return f"{self.data_dir}/repositories"
34 |     
35 |     @property
36 |     def chromadb_dir(self) -> str:
37 |         """Directory for ChromaDB vector storage"""
38 |         return f"{self.data_dir}/chromadb"
39 |     
40 |     class Config:
41 |         env_file = ".env"
42 |         env_file_encoding = "utf-8"
43 |         case_sensitive = False
44 | 
45 | 
46 | # Global settings instance
47 | settings = Settings()
48 | 
49 | # Made with Bob
</content>
</file>
<file><path>repolens-backend/app/models.py</path>
<content lines="1-116">
  1 | """
  2 | Pydantic models for request/response validation
  3 | All API models in one file for simplicity
  4 | """
  5 | from pydantic import BaseModel, Field
  6 | from typing import List, Optional, Dict, Any
  7 | 
  8 | 
  9 | class IngestRequest(BaseModel):
 10 |     """Request model for repository ingestion"""
 11 |     repo_url: str = Field(..., description="GitHub repository URL")
 12 |     
 13 |     class Config:
 14 |         json_schema_extra = {
 15 |             "example": {
 16 |                 "repo_url": "https://github.com/user/repo"
 17 |             }
 18 |         }
 19 | 
 20 | 
 21 | class IngestResponse(BaseModel):
 22 |     """Response model for repository ingestion"""
 23 |     repo_id: str = Field(..., description="Unique repository identifier")
 24 |     status: str = Field(..., description="Ingestion status")
 25 |     message: Optional[str] = Field(None, description="Additional information")
 26 |     
 27 |     class Config:
 28 |         json_schema_extra = {
 29 |             "example": {
 30 |                 "repo_id": "550e8400-e29b-41d4-a716-446655440000",
 31 |                 "status": "processing",
 32 |                 "message": "Repository ingestion started"
 33 |             }
 34 |         }
 35 | 
 36 | 
 37 | class IngestionStatus(BaseModel):
 38 |     """Response model for ingestion status check"""
 39 |     repo_id: str
 40 |     status: str = Field(..., description="completed|processing|failed")
 41 |     progress: Optional[int] = Field(None, description="Progress percentage (0-100)")
 42 |     stage: Optional[str] = Field(None, description="Human-readable stage description")
 43 |     error: Optional[str] = Field(None, description="Error message if failed")
 44 |     
 45 |     class Config:
 46 |         json_schema_extra = {
 47 |             "example": {
 48 |                 "repo_id": "550e8400-e29b-41d4-a716-446655440000",
 49 |                 "status": "completed",
 50 |                 "progress": 100
 51 |             }
 52 |         }
 53 | 
 54 | 
 55 | class QueryRequest(BaseModel):
 56 |     """Request model for querying a repository"""
 57 |     repo_id: str = Field(..., description="Repository identifier")
 58 |     question: str = Field(..., description="Natural language question about the code")
 59 |     
 60 |     class Config:
 61 |         json_schema_extra = {
 62 |             "example": {
 63 |                 "repo_id": "550e8400-e29b-41d4-a716-446655440000",
 64 |                 "question": "How does the authentication work?"
 65 |             }
 66 |         }
 67 | 
 68 | 
 69 | class Source(BaseModel):
 70 |     """Source document metadata"""
 71 |     file_path: str
 72 |     content: Optional[str] = None
 73 |     
 74 |     class Config:
 75 |         json_schema_extra = {
 76 |             "example": {
 77 |                 "file_path": "src/auth/login.py"
 78 |             }
 79 |         }
 80 | 
 81 | 
 82 | class QueryResponse(BaseModel):
 83 |     """Response model for query results"""
 84 |     answer: str = Field(..., description="Generated answer from the LLM")
 85 |     sources: List[Source] = Field(default_factory=list, description="Source documents used")
 86 |     repo_id: str = Field(..., description="Repository identifier")
 87 |     
 88 |     class Config:
 89 |         json_schema_extra = {
 90 |             "example": {
 91 |                 "answer": "The authentication uses JWT tokens...",
 92 |                 "sources": [
 93 |                     {"file_path": "src/auth/login.py"},
 94 |                     {"file_path": "src/middleware/auth.py"}
 95 |                 ],
 96 |                 "repo_id": "550e8400-e29b-41d4-a716-446655440000"
 97 |             }
 98 |         }
 99 | 
100 | 
101 | class HealthResponse(BaseModel):
102 |     """Health check response"""
103 |     status: str
104 |     version: str
105 |     watsonx_configured: bool
106 |     
107 |     class Config:
108 |         json_schema_extra = {
109 |             "example": {
110 |                 "status": "ok",
111 |                 "version": "0.1.0",
112 |                 "watsonx_configured": True
113 |             }
114 |         }
115 | 
116 | # Made with Bob
</content>
</file>
<file><path>repolens-backend/app/rag.py</path>
<content lines="1-236">
  1 | """
  2 | RAG Pipeline - LangChain integration with watsonx.ai
  3 | Handles embeddings and LLM initialization
  4 | """
  5 | from langchain_ibm import WatsonxLLM
  6 | from langchain_community.vectorstores import Chroma
  7 | from langchain_huggingface import HuggingFaceEmbeddings
  8 | from app.config import settings
  9 | import logging
 10 | import threading
 11 | from typing import Dict
 12 | 
 13 | logger = logging.getLogger(__name__)
 14 | 
 15 | # Module-level singletons — avoids re-initializing heavy models on every call
 16 | _embeddings_instance: HuggingFaceEmbeddings | None = None
 17 | _llm_instance: WatsonxLLM | None = None
 18 | 
 19 | # Vectorstore connection pool (Issue #5: Vectorstore Pooling)
 20 | _vectorstore_cache: Dict[str, Chroma] = {}
 21 | _cache_lock = threading.Lock()
 22 | _MAX_CACHE_SIZE = 10  # Limit to 10 repositories in memory
 23 | 
 24 | 
 25 | def get_embeddings() -> HuggingFaceEmbeddings:
 26 |     """
 27 |     Initialize embeddings model (singleton).
 28 |     Uses HuggingFace sentence-transformers all-MiniLM-L6-v2.
 29 |     """
 30 |     global _embeddings_instance
 31 |     if _embeddings_instance is not None:
 32 |         return _embeddings_instance
 33 | 
 34 |     try:
 35 |         _embeddings_instance = HuggingFaceEmbeddings(
 36 |             model_name="all-MiniLM-L6-v2",
 37 |             model_kwargs={"device": "cpu"},
 38 |             encode_kwargs={"normalize_embeddings": True},
 39 |         )
 40 |         logger.info("Embeddings model initialized successfully (HuggingFace all-MiniLM-L6-v2)")
 41 |         return _embeddings_instance
 42 |     except Exception as e:
 43 |         logger.error(f"Failed to initialize embeddings: {e}")
 44 |         raise
 45 | 
 46 | 
 47 | def get_llm() -> WatsonxLLM:
 48 |     """
 49 |     Initialize watsonx.ai LLM (singleton).
 50 |     Uses IBM Granite 4 H Small — the best available Granite instruct model
 51 |     in this watsonx.ai environment.
 52 |     The WatsonxLLM client handles IAM token refresh automatically
 53 |     when initialized with `apikey`.
 54 |     """
 55 |     global _llm_instance
 56 |     if _llm_instance is not None:
 57 |         return _llm_instance
 58 | 
 59 |     try:
 60 |         _llm_instance = WatsonxLLM(
 61 |             # ibm/granite-3-8b-instruct is not available in this environment.
 62 |             # ibm/granite-4-h-small is the best available Granite instruct model.
 63 |             model_id="ibm/granite-4-h-small",
 64 |             url=settings.watsonx_url,
 65 |             apikey=settings.watsonx_api_key,
 66 |             project_id=settings.watsonx_project_id,
 67 |             params={
 68 |                 # Increased for detailed, structured answers
 69 |                 "max_new_tokens": 1500,
 70 |                 # Lower temperature → more factual, precise code explanations
 71 |                 "temperature": 0.2,
 72 |                 "top_p": 0.9,
 73 |                 "top_k": 40,
 74 |                 # Stop at the next user-turn marker to avoid hallucinated follow-ups
 75 |                 "stop_sequences": ["QUESTION:", "Human:", "User:"],
 76 |             },
 77 |         )
 78 |         logger.info("LLM initialized successfully (granite-4-h-small, singleton)")
 79 |         return _llm_instance
 80 |     except Exception as e:
 81 |         logger.error(f"Failed to initialize LLM: {e}")
 82 |         # Reset singleton so the next call retries rather than returning a broken instance
 83 |         _llm_instance = None
 84 |         raise
 85 | 
 86 | 
 87 | def get_vectorstore(repo_id: str, embeddings: HuggingFaceEmbeddings) -> Chroma:
 88 |     """
 89 |     Load or retrieve cached vectorstore for a repository (Issue #5: Connection Pooling).
 90 | 
 91 |     Args:
 92 |         repo_id: Repository identifier
 93 |         embeddings: Embeddings function
 94 | 
 95 |     Returns:
 96 |         Chroma vectorstore instance
 97 |     """
 98 |     with _cache_lock:
 99 |         # Check cache first
100 |         if repo_id in _vectorstore_cache:
101 |             logger.debug(f"Using cached vectorstore for {repo_id}")
102 |             return _vectorstore_cache[repo_id]
103 |         
104 |         # Load and cache
105 |         try:
106 |             persist_directory = f"{settings.chromadb_dir}/{repo_id}"
107 |             vectorstore = Chroma(
108 |                 persist_directory=persist_directory,
109 |                 embedding_function=embeddings,
110 |             )
111 |             
112 |             # Cache it (limit cache size)
113 |             if len(_vectorstore_cache) >= _MAX_CACHE_SIZE:
114 |                 # Remove oldest entry (FIFO)
115 |                 oldest_key = next(iter(_vectorstore_cache))
116 |                 del _vectorstore_cache[oldest_key]
117 |                 logger.debug(f"Cache full, removed {oldest_key}")
118 |             
119 |             _vectorstore_cache[repo_id] = vectorstore
120 |             logger.info(f"Loaded and cached vectorstore for repo {repo_id}")
121 |             return vectorstore
122 |             
123 |         except Exception as e:
124 |             logger.error(f"Failed to load vectorstore for {repo_id}: {e}")
125 |             raise
126 | 
127 | 
128 | def create_vectorstore(
129 |     repo_id: str,
130 |     documents: list,
131 |     embeddings: HuggingFaceEmbeddings,
132 | ) -> Chroma:
133 |     """
134 |     Create new ChromaDB vectorstore from documents with optimized index (Issue #10).
135 | 
136 |     Args:
137 |         repo_id: Repository identifier
138 |         documents: List of LangChain documents
139 |         embeddings: Embeddings function
140 | 
141 |     Returns:
142 |         Chroma vectorstore instance
143 |     """
144 |     try:
145 |         persist_directory = f"{settings.chromadb_dir}/{repo_id}"
146 |         
147 |         # Invalidate stale cache entry before creating a new vectorstore
148 |         with _cache_lock:
149 |             _vectorstore_cache.pop(repo_id, None)
150 |         
151 |         # Create vectorstore with optimized HNSW index parameters
152 |         vectorstore = Chroma.from_documents(
153 |             documents=documents,
154 |             embedding=embeddings,
155 |             persist_directory=persist_directory,
156 |             collection_metadata={
157 |                 "hnsw:space": "cosine",  # Cosine similarity for embeddings
158 |                 "hnsw:construction_ef": 200,  # Higher = better recall, slower build
159 |                 "hnsw:search_ef": 100,  # Higher = better recall, slower search
160 |                 "hnsw:M": 16,  # Number of connections per layer
161 |             }
162 |         )
163 |         logger.info(
164 |             f"Created optimized vectorstore for repo {repo_id} with {len(documents)} documents"
165 |         )
166 |         return vectorstore
167 |     except Exception as e:
168 |         logger.error(f"Failed to create vectorstore for {repo_id}: {e}")
169 |         raise
170 | 
171 | 
172 | def build_prompt(context: str, question: str) -> str:
173 |     """
174 |     Build a detailed, structured prompt for the Granite LLM.
175 | 
176 |     The prompt instructs the model to give a thorough, well-organised answer
177 |     that references specific files, functions, and patterns found in the code.
178 | 
179 |     Args:
180 |         context: Retrieved code snippets from the vectorstore
181 |         question: User's natural language question
182 | 
183 |     Returns:
184 |         Formatted prompt string
185 |     """
186 |     prompt = f"""<|system|>
187 | You are RepoLens, an expert code analyst. Your job is to answer questions about a codebase with clear, detailed, and well-structured explanations.
188 | 
189 | Follow these rules:
190 | 1. Give a concise summary answer first (1-2 sentences).
191 | 2. Then provide a detailed explanation broken into logical sections or bullet points.
192 | 3. Reference specific file paths, function names, class names, or line patterns from the CODE CONTEXT whenever possible.
193 | 4. If the context shows multiple relevant parts, explain how they connect to each other.
194 | 5. If the question cannot be fully answered from the context, say so clearly and explain what you can infer.
195 | 6. Use code snippets from the context to illustrate your points where helpful.
196 | 7. Do NOT invent code or functions that are not present in the context.
197 | <|user|>
198 | CODE CONTEXT (retrieved from the repository):
199 | {context}
200 | 
201 | QUESTION: {question}
202 | <|assistant|>
203 | """
204 |     return prompt
205 | 
206 | 
207 | def clean_answer(raw: str) -> str:
208 |     """
209 |     Post-process LLM output to remove common Granite artefacts.
210 | 
211 |     Granite sometimes echoes prompt markers or adds trailing whitespace.
212 | 
213 |     Args:
214 |         raw: Raw string returned by the LLM
215 | 
216 |     Returns:
217 |         Cleaned answer string
218 |     """
219 |     # Strip leading/trailing whitespace
220 |     answer = raw.strip()
221 | 
222 |     # Remove echoed prompt markers that occasionally appear at the start.
223 |     # Loop until no more prefixes match — handles stacked markers like
224 |     # '<|assistant|>Answer: ...' which the old single-pass missed.
225 |     prefixes_to_strip = ["ANSWER:", "Answer:", "assistant:", "<|assistant|>"]
226 |     changed = True
227 |     while changed:
228 |         changed = False
229 |         for prefix in prefixes_to_strip:
230 |             if answer.startswith(prefix):
231 |                 answer = answer[len(prefix):].lstrip()
232 |                 changed = True
233 | 
234 |     return answer
235 | 
236 | # Made with Bob
</content>
</file>
<file><path>repolens-backend/app/api/routes.py</path>
<content lines="1-513">
  1 | """
  2 | API Routes - All endpoints in one file
  3 | Handles HTTP requests and responses
  4 | """
  5 | import asyncio
  6 | import logging
  7 | from fastapi import APIRouter, HTTPException, BackgroundTasks
  8 | from fastapi.responses import StreamingResponse
  9 | from app.models import (
 10 |     IngestRequest,
 11 |     IngestResponse,
 12 |     IngestionStatus,
 13 |     QueryRequest,
 14 |     QueryResponse,
 15 |     HealthResponse
 16 | )
 17 | from app.services.ingestion import (
 18 |     generate_repo_id,
 19 |     ingest_repository,
 20 |     get_status,
 21 |     validate_github_url,
 22 |     validate_repo_id,
 23 |     update_status
 24 | )
 25 | from app.services.query import query_repository
 26 | from app.services.stream import stream_query_repository
 27 | from app.config import settings
 28 | 
 29 | logger = logging.getLogger(__name__)
 30 | 
 31 | # Create router
 32 | router = APIRouter()
 33 | 
 34 | 
 35 | # Bug Fix: safe_ingest_wrapper must run sync ingest_repository in a thread pool
 36 | # to avoid blocking the entire FastAPI event loop during clone/embed operations.
 37 | async def safe_ingest_wrapper(repo_url: str, repo_id: str):
 38 |     """Wrapper that ensures exceptions in background tasks are logged and tracked"""
 39 |     try:
 40 |         # ingest_repository is synchronous (disk I/O + CPU-bound embedding).
 41 |         # Run it in a thread pool so FastAPI's event loop stays unblocked.
 42 |         await asyncio.to_thread(ingest_repository, repo_url, repo_id)
 43 |     except Exception as e:
 44 |         logger.error(f"Background ingestion failed for {repo_id}: {e}", exc_info=True)
 45 |         update_status(repo_id, "failed", 0, str(e))
 46 | 
 47 | 
 48 | 
 49 | @router.get("/health", response_model=HealthResponse)
 50 | async def health_check():
 51 |     """
 52 |     Health check endpoint
 53 |     Verifies API is running and watsonx.ai is configured
 54 |     """
 55 |     watsonx_configured = bool(
 56 |         settings.watsonx_api_key and 
 57 |         settings.watsonx_project_id
 58 |     )
 59 |     
 60 |     return HealthResponse(
 61 |         status="ok",
 62 |         version="0.1.0",
 63 |         watsonx_configured=watsonx_configured
 64 |     )
 65 | 
 66 | 
 67 | @router.post("/ingest", response_model=IngestResponse)
 68 | async def ingest_repo(
 69 |     request: IngestRequest,
 70 |     background_tasks: BackgroundTasks
 71 | ):
 72 |     """
 73 |     Ingest a GitHub repository
 74 |     
 75 |     Starts background task to:
 76 |     1. Clone repository
 77 |     2. Split into chunks
 78 |     3. Generate embeddings
 79 |     4. Store in ChromaDB
 80 |     
 81 |     Returns immediately with repo_id for status tracking
 82 |     """
 83 |     try:
 84 |         # Validate GitHub URL
 85 |         if not validate_github_url(request.repo_url):
 86 |             raise HTTPException(
 87 |                 status_code=400,
 88 |                 detail="Invalid GitHub URL. Must be a valid github.com repository URL"
 89 |             )
 90 |         
 91 |         # Generate unique repo ID
 92 |         repo_id = generate_repo_id()
 93 |         logger.info(f"Starting ingestion for {request.repo_url} with ID {repo_id}")
 94 |         
 95 |         # Start background ingestion task with safe wrapper (Bug Fix #4)
 96 |         background_tasks.add_task(
 97 |             safe_ingest_wrapper,
 98 |             request.repo_url,
 99 |             repo_id
100 |         )
101 |         
102 |         return IngestResponse(
103 |             repo_id=repo_id,
104 |             status="processing",
105 |             message="Repository ingestion started"
106 |         )
107 |         
108 |     except HTTPException:
109 |         raise
110 |     except Exception as e:
111 |         logger.error(f"Failed to start ingestion: {e}")
112 |         raise HTTPException(
113 |             status_code=500,
114 |             detail=f"Failed to start ingestion: {str(e)}"
115 |         )
116 | 
117 | 
118 | @router.get("/ingest/{repo_id}/status", response_model=IngestionStatus)
119 | async def get_ingestion_status(repo_id: str):
120 |     """
121 |     Get ingestion status for a repository
122 |     
123 |     Returns:
124 |     - status: completed|processing|failed|not_found
125 |     - progress: 0-100
126 |     - error: error message if failed
127 |     """
128 |     try:
129 |         # Bug Fix #7: Validate repo_id format
130 |         if not validate_repo_id(repo_id):
131 |             raise HTTPException(
132 |                 status_code=400,
133 |                 detail="Invalid repository ID format"
134 |             )
135 |         
136 |         status = get_status(repo_id)
137 |         
138 |         if status["status"] == "not_found":
139 |             raise HTTPException(
140 |                 status_code=404,
141 |                 detail=f"Repository {repo_id} not found"
142 |             )
143 |         
144 |         return IngestionStatus(
145 |             repo_id=repo_id,
146 |             status=status["status"],
147 |             progress=status.get("progress", 0),
148 |             stage=status.get("stage"),
149 |             error=status.get("error")
150 |         )
151 |         
152 |     except HTTPException:
153 |         raise
154 |     except Exception as e:
155 |         logger.error(f"Failed to get status for {repo_id}: {e}")
156 |         raise HTTPException(
157 |             status_code=500,
158 |             detail=f"Failed to get status: {str(e)}"
159 |         )
160 | 
161 | 
162 | @router.get("/ingest/{repo_id}/files")
163 | async def get_repo_files(repo_id: str):
164 |     """
165 |     Get list of all files ingested for a repository.
166 |     Reads unique source paths from ChromaDB metadata.
167 |     Returns a sorted list used by the file tree UI.
168 |     """
169 |     try:
170 |         if not validate_repo_id(repo_id):
171 |             raise HTTPException(status_code=400, detail="Invalid repository ID format")
172 | 
173 |         status = get_status(repo_id)
174 |         if status["status"] != "completed":
175 |             raise HTTPException(status_code=400, detail="Repository not yet ingested")
176 | 
177 |         from app.rag import get_embeddings, get_vectorstore
178 |         embeddings = get_embeddings()
179 |         vectorstore = get_vectorstore(repo_id, embeddings)
180 | 
181 |         # Fetch all document metadata from ChromaDB
182 |         collection = vectorstore._collection
183 |         result = collection.get(include=["metadatas"])
184 | 
185 |         # Extract unique file paths
186 |         seen: set = set()
187 |         files: list[str] = []
188 |         for meta in (result.get("metadatas") or []):
189 |             path = (meta or {}).get("source", "")
190 |             if path and path not in seen:
191 |                 seen.add(path)
192 |                 files.append(path)
193 | 
194 |         files.sort()
195 |         return {"repo_id": repo_id, "files": files, "total": len(files)}
196 | 
197 |     except HTTPException:
198 |         raise
199 |     except Exception as e:
200 |         logger.error(f"Failed to get files for {repo_id}: {e}")
201 |         raise HTTPException(status_code=500, detail=f"Failed to get files: {str(e)}")
202 | 
203 | 
204 | @router.get("/ingest/{repo_id}/stats")
205 | async def get_repo_stats(repo_id: str):
206 |     """
207 |     Code Health Dashboard stats for a repository.
208 |     Returns language breakdown, file counts, top directories, and chunk count.
209 |     """
210 |     try:
211 |         if not validate_repo_id(repo_id):
212 |             raise HTTPException(status_code=400, detail="Invalid repository ID format")
213 | 
214 |         status = get_status(repo_id)
215 |         if status["status"] != "completed":
216 |             raise HTTPException(status_code=400, detail="Repository not yet ingested")
217 | 
218 |         from app.rag import get_embeddings, get_vectorstore
219 |         embeddings = get_embeddings()
220 |         vectorstore = get_vectorstore(repo_id, embeddings)
221 | 
222 |         collection = vectorstore._collection
223 |         result = collection.get(include=["metadatas"])
224 |         metadatas = result.get("metadatas") or []
225 | 
226 |         # Language mapping by extension
227 |         LANG_MAP = {
228 |             "py": "Python", "js": "JavaScript", "ts": "TypeScript",
229 |             "tsx": "TypeScript/React", "jsx": "JavaScript/React",
230 |             "go": "Go", "rs": "Rust", "java": "Java",
231 |             "cpp": "C++", "c": "C", "rb": "Ruby", "php": "PHP",
232 |             "swift": "Swift", "kt": "Kotlin", "cs": "C#",
233 |             "html": "HTML", "css": "CSS", "scss": "SCSS",
234 |             "md": "Markdown", "json": "JSON", "yaml": "YAML",
235 |             "yml": "YAML", "toml": "TOML", "sh": "Shell",
236 |             "sql": "SQL", "dockerfile": "Docker",
237 |         }
238 | 
239 |         seen_files: set = set()
240 |         lang_counts: dict[str, int] = {}
241 |         dir_counts: dict[str, int] = {}
242 |         total_chunks = len(metadatas)
243 | 
244 |         for meta in metadatas:
245 |             path = (meta or {}).get("source", "")
246 |             if not path:
247 |                 continue
248 | 
249 |             # Count unique files
250 |             if path not in seen_files:
251 |                 seen_files.add(path)
252 | 
253 |                 # Language breakdown
254 |                 ext = path.rsplit(".", 1)[-1].lower() if "." in path else ""
255 |                 lang = LANG_MAP.get(ext, "Other")
256 |                 lang_counts[lang] = lang_counts.get(lang, 0) + 1
257 | 
258 |                 # Top-level directory breakdown
259 |                 parts = path.replace("\\", "/").split("/")
260 |                 top_dir = parts[0] if parts else "."
261 |                 dir_counts[top_dir] = dir_counts.get(top_dir, 0) + 1
262 | 
263 |         # Sort and limit
264 |         lang_sorted = sorted(lang_counts.items(), key=lambda x: -x[1])
265 |         dir_sorted = sorted(dir_counts.items(), key=lambda x: -x[1])[:8]
266 | 
267 |         return {
268 |             "repo_id": repo_id,
269 |             "total_files": len(seen_files),
270 |             "total_chunks": total_chunks,
271 |             "languages": [{"name": k, "count": v} for k, v in lang_sorted],
272 |             "top_directories": [{"name": k, "count": v} for k, v in dir_sorted],
273 |         }
274 | 
275 |     except HTTPException:
276 |         raise
277 |     except Exception as e:
278 |         logger.error(f"Failed to get stats for {repo_id}: {e}")
279 |         raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")
280 | 
281 | 
282 | @router.get("/ingest/{repo_id}/structure")
283 | async def get_repo_structure(repo_id: str):
284 |     """
285 |     Get repository structure for mind map visualization.
286 |     Returns flat nodes (legacy) + full nested tree for the interactive mind map.
287 |     """
288 |     try:
289 |         if not validate_repo_id(repo_id):
290 |             raise HTTPException(status_code=400, detail="Invalid repository ID format")
291 | 
292 |         status = get_status(repo_id)
293 |         if status["status"] != "completed":
294 |             raise HTTPException(status_code=400, detail="Repository not yet ingested")
295 | 
296 |         from app.rag import get_embeddings, get_vectorstore
297 |         embeddings = get_embeddings()
298 |         vectorstore = get_vectorstore(repo_id, embeddings)
299 | 
300 |         collection = vectorstore._collection
301 |         result = collection.get(include=["metadatas"])
302 |         metadatas = result.get("metadatas") or []
303 | 
304 |         lang_map = {
305 |             "py": "Python", "js": "JavaScript", "ts": "TypeScript",
306 |             "tsx": "React/TSX", "jsx": "React/JSX", "go": "Go", "rs": "Rust",
307 |             "java": "Java", "cpp": "C++", "c": "C", "rb": "Ruby",
308 |             "php": "PHP", "swift": "Swift", "kt": "Kotlin", "cs": "C#",
309 |             "html": "HTML", "css": "CSS", "scss": "SCSS", "md": "Markdown",
310 |             "json": "JSON", "yaml": "YAML", "yml": "YAML", "toml": "TOML",
311 |             "sh": "Shell", "sql": "SQL",
312 |         }
313 |         color_palette = [
314 |             "#818cf8", "#60a5fa", "#34d399", "#c084fc",
315 |             "#fb923c", "#4ade80", "#f87171", "#38bdf8",
316 |             "#facc15", "#a78bfa", "#2dd4bf", "#f472b6",
317 |         ]
318 | 
319 |         # Collect unique paths
320 |         seen_paths: set = set()
321 |         all_paths: list[str] = []
322 |         for meta in metadatas:
323 |             path = (meta or {}).get("source", "")
324 |             if path and path not in seen_paths:
325 |                 seen_paths.add(path)
326 |                 all_paths.append(path.replace("\\", "/"))
327 | 
328 |         # Legacy flat nodes
329 |         dir_structure: dict[str, dict] = {}
330 |         for path in all_paths:
331 |             parts = path.split("/")
332 |             if len(parts) > 1:
333 |                 top_dir = parts[0]
334 |                 if top_dir not in dir_structure:
335 |                     dir_structure[top_dir] = {"name": top_dir, "file_count": 0, "subdirs": set(), "languages": set()}
336 |                 dir_structure[top_dir]["file_count"] += 1
337 |                 if len(parts) > 2:
338 |                     dir_structure[top_dir]["subdirs"].add(parts[1])
339 |                 if "." in parts[-1]:
340 |                     ext = parts[-1].rsplit(".", 1)[-1].lower()
341 |                     if ext in lang_map:
342 |                         dir_structure[top_dir]["languages"].add(lang_map[ext])
343 | 
344 |         nodes = []
345 |         for dir_name, data in sorted(dir_structure.items(), key=lambda x: -x[1]["file_count"])[:8]:
346 |             nodes.append({
347 |                 "id": dir_name, "label": dir_name,
348 |                 "file_count": data["file_count"],
349 |                 "subdirs": list(data["subdirs"])[:3],
350 |                 "languages": list(data["languages"]),
351 |             })
352 | 
353 |         # Full recursive tree
354 |         raw_tree: dict = {}
355 | 
356 |         def insert_path(tree: dict, parts: list):
357 |             if not parts:
358 |                 return
359 |             head = parts[0]
360 |             rest = parts[1:]
361 |             if head not in tree:
362 |                 tree[head] = {"__files__": [], "__dirs__": {}}
363 |             if len(rest) == 1:
364 |                 tree[head]["__files__"].append(rest[0])
365 |             elif rest:
366 |                 insert_path(tree[head]["__dirs__"], rest)
367 | 
368 |         for path in all_paths:
369 |             insert_path(raw_tree, path.split("/"))
370 | 
371 |         def tree_to_nodes(tree: dict, depth: int = 0, color_idx: int = 0, path_prefix: str = "") -> list:
372 |             result = []
373 |             for i, name in enumerate(sorted(tree.keys())):
374 |                 subtree = tree[name]
375 |                 c_idx = (color_idx + i) % len(color_palette)
376 |                 files = subtree.get("__files__", [])
377 |                 subdirs = subtree.get("__dirs__", {})
378 |                 full_path = f"{path_prefix}/{name}" if path_prefix else name
379 |                 langs: set = set()
380 |                 for f in files:
381 |                     if "." in f:
382 |                         ext = f.rsplit(".", 1)[-1].lower()
383 |                         if ext in lang_map:
384 |                             langs.add(lang_map[ext])
385 |                 children = tree_to_nodes(subdirs, depth + 1, c_idx, full_path)
386 |                 for fname in sorted(files)[:30]:
387 |                     ext = fname.rsplit(".", 1)[-1].lower() if "." in fname else ""
388 |                     children.append({
389 |                         "id": f"{full_path}/{fname}", "label": fname,
390 |                         "type": "file", "ext": ext,
391 |                         "language": lang_map.get(ext, ""),
392 |                         "color": color_palette[c_idx],
393 |                         "children": [], "depth": depth + 1,
394 |                     })
395 |                 result.append({
396 |                     "id": full_path, "label": name, "type": "dir",
397 |                     "file_count": len(files),
398 |                     "languages": sorted(list(langs)),
399 |                     "color": color_palette[c_idx],
400 |                     "children": children,
401 |                     "depth": depth,
402 |                 })
403 |             return result
404 | 
405 |         tree_nodes = tree_to_nodes(raw_tree)
406 | 
407 |         return {
408 |             "repo_id": repo_id,
409 |             "root": {"name": "Repository", "type": "repository"},
410 |             "nodes": nodes,
411 |             "total_files": len(all_paths),
412 |             "tree": tree_nodes,
413 |         }
414 | 
415 |     except HTTPException:
416 |         raise
417 |     except Exception as e:
418 |         logger.error(f"Failed to get structure for {repo_id}: {e}")
419 |         raise HTTPException(status_code=500, detail=f"Failed to get structure: {str(e)}")
420 | 
421 | 
422 | @router.post("/query", response_model=QueryResponse)
423 | async def query_repo(request: QueryRequest):
424 |     """
425 |     Query a repository with a natural language question
426 |     
427 |     Uses RAG pipeline:
428 |     1. Retrieve relevant code chunks from ChromaDB
429 |     2. Build prompt with context
430 |     3. Generate answer using watsonx.ai Granite
431 |     4. Return answer with source references
432 |     """
433 |     try:
434 |         # Bug Fix #7: Validate repo_id format
435 |         if not validate_repo_id(request.repo_id):
436 |             raise HTTPException(
437 |                 status_code=400,
438 |                 detail="Invalid repository ID format"
439 |             )
440 |         
441 |         # Validate repo exists and is completed
442 |         status = get_status(request.repo_id)
443 |         
444 |         if status["status"] == "not_found":
445 |             raise HTTPException(
446 |                 status_code=404,
447 |                 detail=f"Repository {request.repo_id} not found. Please ingest it first."
448 |             )
449 |         
450 |         if status["status"] == "processing":
451 |             raise HTTPException(
452 |                 status_code=400,
453 |                 detail=f"Repository {request.repo_id} is still being processed. Please wait."
454 |             )
455 |         
456 |         if status["status"] == "failed":
457 |             raise HTTPException(
458 |                 status_code=400,
459 |                 detail=f"Repository {request.repo_id} ingestion failed: {status.get('error', 'Unknown error')}"
460 |             )
461 |         
462 |         # Process query
463 |         logger.info(f"Processing query for repo {request.repo_id}")
464 |         result = await asyncio.to_thread(query_repository, request.repo_id, request.question)
465 |         
466 |         return QueryResponse(**result)
467 |         
468 |     except HTTPException:
469 |         raise
470 |     except Exception as e:
471 |         logger.error(f"Query failed: {e}")
472 |         raise HTTPException(
473 |             status_code=500,
474 |             detail=f"Query failed: {str(e)}"
475 |         )
476 | 
477 | @router.post("/query/stream")
478 | async def query_repo_stream(request: QueryRequest):
479 |     """
480 |     Stream a repository query answer as Server-Sent Events (SSE).
481 | 
482 |     The client receives:
483 |       data: {"token": "..."}   — for each generated token
484 |       data: {"sources": [...]} — final sources payload
485 |       data: [DONE]             — stream terminator
486 |     """
487 |     try:
488 |         if not validate_repo_id(request.repo_id):
489 |             raise HTTPException(status_code=400, detail="Invalid repository ID format")
490 | 
491 |         status = get_status(request.repo_id)
492 |         if status["status"] == "not_found":
493 |             raise HTTPException(status_code=404, detail=f"Repository {request.repo_id} not found.")
494 |         if status["status"] == "processing":
495 |             raise HTTPException(status_code=400, detail="Repository is still being processed.")
496 |         if status["status"] == "failed":
497 |             raise HTTPException(status_code=400, detail=f"Repository ingestion failed: {status.get('error')}")
498 | 
499 |         return StreamingResponse(
500 |             stream_query_repository(request.repo_id, request.question),
501 |             media_type="text/event-stream",
502 |             headers={
503 |                 "Cache-Control": "no-cache",
504 |                 "X-Accel-Buffering": "no",  # Disable nginx buffering
505 |             },
506 |         )
507 |     except HTTPException:
508 |         raise
509 |     except Exception as e:
510 |         logger.error(f"Stream query setup failed: {e}")
511 |         raise HTTPException(status_code=500, detail=f"Stream query failed: {str(e)}")
512 | 
513 | # Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs


# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T15:48:08.291Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.02

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
<file>
<path>repolens-backend/app/services/ingestion.py</path>
</file>
<file>
<path>repolens-backend/app/services/query.py</path>
</file>
<file>
<path>repolens-backend/app/services/stream.py</path>
</file>
<file>
<path>repolens-backend/.env.example</path>
</file>
<file>
<path>repolens-backend/pyproject.toml</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>repolens-backend/app/services/ingestion.py</path>
<content lines="1-319">
  1 | """
  2 | Repository Ingestion Service
  3 | Handles cloning, chunking, and embedding of repositories
  4 | """
  5 | import os
  6 | import re
  7 | import shutil
  8 | import uuid
  9 | import logging
 10 | import subprocess
 11 | import threading
 12 | from pathlib import Path
 13 | from typing import Dict, Any, List
 14 | from langchain_core.documents import Document
 15 | from langchain_text_splitters import RecursiveCharacterTextSplitter
 16 | from app.config import settings
 17 | from app.rag import get_embeddings, create_vectorstore
 18 | 
 19 | logger = logging.getLogger(__name__)
 20 | 
 21 | # In-memory storage for ingestion status (hackathon simplicity)
 22 | ingestion_status: Dict[str, Dict[str, Any]] = {}
 23 | # Thread-safe lock for status updates (Bug Fix #1)
 24 | _status_lock = threading.Lock()
 25 | 
 26 | # ---------------------------------------------------------------------------
 27 | # File-extension allow-list: only ingest readable text/code files.
 28 | # Binary files (images, compiled artifacts, etc.) break the embedding pipeline
 29 | # and waste token budget.
 30 | # ---------------------------------------------------------------------------
 31 | _ALLOWED_EXTENSIONS = {
 32 |     # Web / frontend
 33 |     ".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs",
 34 |     ".html", ".css", ".scss", ".sass", ".less", ".svelte", ".vue",
 35 |     # Backend / scripting
 36 |     ".py", ".rb", ".go", ".java", ".kt", ".scala",
 37 |     ".php", ".rs", ".c", ".cpp", ".h", ".hpp",
 38 |     ".cs", ".swift", ".m",
 39 |     # Shell / config
 40 |     ".sh", ".bash", ".zsh", ".fish",
 41 |     ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".env.example",
 42 |     # Data / docs
 43 |     ".json", ".xml", ".csv", ".sql",
 44 |     ".md", ".mdx", ".rst", ".txt",
 45 |     # Misc
 46 |     ".graphql", ".proto", ".tf", ".hcl",
 47 | }
 48 | 
 49 | # Directories to skip entirely
 50 | _SKIP_DIRS = {
 51 |     ".git", "node_modules", "__pycache__", ".venv", "venv", "env",
 52 |     "dist", "build", ".next", ".nuxt", "out", "target",
 53 |     ".mypy_cache", ".pytest_cache", ".ruff_cache",
 54 |     "vendor", "third_party", ".idea", ".vscode",
 55 | }
 56 | 
 57 | 
 58 | def _is_allowed_file(file_path: str) -> bool:
 59 |     """
 60 |     Return True only for text/code files we can meaningfully embed.
 61 |     Rejects binary files, generated lock files, compiled artefacts, etc.
 62 |     """
 63 |     # Reject any path containing a skip directory
 64 |     parts = file_path.replace("\\", "/").split("/")
 65 |     for part in parts:
 66 |         if part in _SKIP_DIRS:
 67 |             return False
 68 | 
 69 |     # Must have an allowed extension (or be a well-known dotfile like .gitignore)
 70 |     _, ext = os.path.splitext(file_path)
 71 |     if ext.lower() in _ALLOWED_EXTENSIONS:
 72 |         return True
 73 | 
 74 |     # Allow extensionless files that are clearly text (Makefile, Dockerfile, etc.)
 75 |     basename = os.path.basename(file_path)
 76 |     _allowed_basenames = {
 77 |         "Makefile", "Dockerfile", "Procfile", "Gemfile", "Rakefile",
 78 |         ".gitignore", ".dockerignore", ".editorconfig", ".eslintrc",
 79 |         ".prettierrc", ".babelrc", "Pipfile",
 80 |     }
 81 |     if basename in _allowed_basenames:
 82 |         return True
 83 | 
 84 |     return False
 85 | 
 86 | 
 87 | def generate_repo_id() -> str:
 88 |     """Generate unique repository identifier"""
 89 |     return str(uuid.uuid4())
 90 | 
 91 | 
 92 | def validate_repo_id(repo_id: str) -> bool:
 93 |     """
 94 |     Validate repo_id is a valid UUID (Bug Fix #7)
 95 |     
 96 |     Args:
 97 |         repo_id: Repository identifier to validate
 98 |     
 99 |     Returns:
100 |         True if valid UUID, False otherwise
101 |     """
102 |     try:
103 |         uuid.UUID(repo_id)
104 |         return True
105 |     except ValueError:
106 |         return False
107 | 
108 | 
109 | def update_status(repo_id: str, status: str, progress: int = 0, error: str | None = None, stage: str | None = None):
110 |     """Update ingestion status (thread-safe)"""
111 |     with _status_lock:
112 |         ingestion_status[repo_id] = {
113 |             "status": status,
114 |             "progress": progress,
115 |             "error": error,
116 |             "stage": stage,
117 |         }
118 |     logger.info(f"Repo {repo_id}: {status} ({progress}%) — {stage or ''}")
119 | 
120 | 
121 | def get_status(repo_id: str) -> Dict[str, Any]:
122 |     """Get ingestion status, with chromadb fallback for server restarts (thread-safe)"""
123 |     with _status_lock:
124 |         cached = ingestion_status.get(repo_id)
125 |         if cached:
126 |             return cached
127 | 
128 |     # Fallback: check if a completed chromadb collection exists on disk
129 |     chroma_path = f"{settings.chromadb_dir}/{repo_id}"
130 |     if os.path.isdir(chroma_path) and os.listdir(chroma_path):
131 |         # Re-populate in-memory status so subsequent calls are fast
132 |         with _status_lock:
133 |             ingestion_status[repo_id] = {"status": "completed", "progress": 100}
134 |             return ingestion_status[repo_id]
135 | 
136 |     return {"status": "not_found", "progress": 0}
137 | 
138 | 
139 | def ingest_repository(repo_url: str, repo_id: str) -> None:
140 |     """
141 |     Ingest a GitHub repository into the RAG pipeline.
142 | 
143 |     Steps:
144 |     1. Clone repository using GitLoader (tries main, then master branch)
145 |     2. Filter to code/text files only
146 |     3. Split documents into overlapping chunks
147 |     4. Generate embeddings and store in ChromaDB
148 | 
149 |     Args:
150 |         repo_url: GitHub repository URL
151 |         repo_id:  Unique repository identifier
152 |     """
153 |     try:
154 |         update_status(repo_id, "processing", 5, stage="Starting ingestion...")
155 | 
156 |         # ------------------------------------------------------------------ #
157 |         # Step 1: Clone repository                                             #
158 |         # ------------------------------------------------------------------ #
159 |         logger.info(f"Cloning repository: {repo_url}")
160 |         repo_path = f"{settings.repositories_dir}/{repo_id}"
161 | 
162 |         # Always start with a clean directory to avoid stale git state
163 |         if os.path.exists(repo_path):
164 |             shutil.rmtree(repo_path)
165 |         os.makedirs(repo_path, exist_ok=True)
166 | 
167 |         update_status(repo_id, "processing", 15, stage="Cloning repository...")
168 | 
169 |         # Strategy: try default branch first (no --branch flag), then main/master.
170 |         # --depth=1 = shallow clone (latest snapshot only, no history)
171 |         # --filter=blob:none = blobless clone (fetch file contents on-demand)
172 |         # Together this is the fastest possible clone for any repo size.
173 |         cloned = False
174 | 
175 |         # Attempt 1: default branch (works for any repo regardless of branch name)
176 |         attempts = [
177 |             ["git", "clone", "--depth=1", "--filter=blob:none",
178 |              "--single-branch", repo_url, repo_path],
179 |         ]
180 |         # Attempt 2+: explicit branches as fallback
181 |         for branch in ["main", "master"]:
182 |             attempts.append(
183 |                 ["git", "clone", "--depth=1", "--filter=blob:none",
184 |                  "--branch", branch, "--single-branch", repo_url, repo_path]
185 |             )
186 | 
187 |         for cmd in attempts:
188 |             if os.path.exists(repo_path):
189 |                 shutil.rmtree(repo_path)
190 |             try:
191 |                 result = subprocess.run(
192 |                     cmd,
193 |                     capture_output=True, text=True, timeout=180
194 |                 )
195 |                 if result.returncode == 0:
196 |                     branch_label = cmd[cmd.index("--branch") + 1] if "--branch" in cmd else "default"
197 |                     logger.info(f"Shallow-cloned branch '{branch_label}' successfully")
198 |                     cloned = True
199 |                     break
200 |                 else:
201 |                     logger.warning(f"Clone attempt failed: {result.stderr[:300]}")
202 |             except subprocess.TimeoutExpired:
203 |                 logger.warning(f"Clone timed out (180s) for cmd: {' '.join(cmd[-3:])}")
204 |             except Exception as clone_err:
205 |                 logger.warning(f"Clone error: {clone_err}")
206 | 
207 |         if not cloned:
208 |             raise ValueError(
209 |                 "Could not clone repository. "
210 |                 "Check the URL is a valid public GitHub repo and try again."
211 |             )
212 | 
213 | 
214 |         # Walk the cloned directory and load allowed files manually
215 |         update_status(repo_id, "processing", 35, stage="Reading code files...")
216 |         documents: List[Document] = []
217 |         repo_path_obj = Path(repo_path)
218 |         for file_path in repo_path_obj.rglob("*"):
219 |             # Skip .git directory, only process files
220 |             if ".git" in file_path.parts:
221 |                 continue
222 |             if not file_path.is_file():
223 |                 continue
224 |             if not _is_allowed_file(str(file_path)):
225 |                 continue
226 |             try:
227 |                 content = file_path.read_text(encoding="utf-8", errors="ignore")
228 |                 if not content.strip():
229 |                     continue
230 |                 rel_path = str(file_path.relative_to(repo_path_obj))
231 |                 documents.append(Document(
232 |                     page_content=content,
233 |                     metadata={"source": rel_path}
234 |                 ))
235 |             except Exception as read_err:
236 |                 logger.debug(f"Skipping {file_path}: {read_err}")
237 | 
238 |         logger.info(f"Loaded {len(documents)} documents from repository")
239 | 
240 |         if not documents:
241 |             raise ValueError(
242 |                 "No supported code/text files found in repository. "
243 |                 "Ensure the repository contains source files."
244 |             )
245 | 
246 |         # ------------------------------------------------------------------ #
247 |         # Step 2: Split documents                                              #
248 |         # ------------------------------------------------------------------ #
249 |         update_status(repo_id, "processing", 50, stage=f"Chunking {len(documents)} files...")
250 |         logger.info(f"Splitting {len(documents)} documents into chunks")
251 | 
252 |         text_splitter = RecursiveCharacterTextSplitter(
253 |             chunk_size=1000,
254 |             chunk_overlap=200,
255 |             separators=["\n\n", "\n", " ", ""],
256 |             length_function=len,
257 |         )
258 | 
259 |         chunks = text_splitter.split_documents(documents)
260 |         logger.info(f"Created {len(chunks)} chunks from {len(documents)} files")
261 | 
262 |         if not chunks:
263 |             raise ValueError("Document splitting produced zero chunks. Check file contents.")
264 | 
265 |         # ------------------------------------------------------------------ #
266 |         # Step 3: Generate embeddings and persist to ChromaDB                 #
267 |         # ------------------------------------------------------------------ #
268 |         update_status(repo_id, "processing", 70, stage="Generating embeddings...")
269 |         logger.info("Generating embeddings and storing in ChromaDB")
270 | 
271 |         embeddings = get_embeddings()
272 | 
273 |         update_status(repo_id, "processing", 85, stage="Building vector index...")
274 |         create_vectorstore(repo_id, chunks, embeddings)
275 | 
276 |         # ------------------------------------------------------------------ #
277 |         # Step 4: Done                                                         #
278 |         # ------------------------------------------------------------------ #
279 |         update_status(repo_id, "completed", 100, stage="Ready!")
280 |         logger.info(f"Repository {repo_id} ingestion completed successfully")
281 | 
282 |     except Exception as e:
283 |         error_msg = str(e)
284 |         logger.error(f"Ingestion failed for {repo_id}: {error_msg}", exc_info=True)
285 |         update_status(repo_id, "failed", 0, error_msg)
286 |     finally:
287 |         # Clean up cloned repo directory to avoid leaking disk space
288 |         repo_path = f"{settings.repositories_dir}/{repo_id}"
289 |         if os.path.exists(repo_path):
290 |             try:
291 |                 shutil.rmtree(repo_path)
292 |                 logger.info(f"Cleaned up cloned repo at {repo_path}")
293 |             except Exception as cleanup_err:
294 |                 logger.warning(f"Failed to clean up {repo_path}: {cleanup_err}")
295 | 
296 | 
297 | def validate_github_url(url: str) -> bool:
298 |     """
299 |     Validate that the URL is a well-formed GitHub repository URL.
300 | 
301 |     BUG FIX: old implementation used a substring check (`"github.com" in url`)
302 |     which accepted hostile URLs like `evil.com/?r=github.com`.
303 |     Now uses a proper regex anchored to the URL host.
304 | 
305 |     Args:
306 |         url: Repository URL to validate
307 | 
308 |     Returns:
309 |         True if valid, False otherwise
310 |     """
311 |     if not url:
312 |         return False
313 | 
314 |     # Accept https://github.com/<owner>/<repo> or http variant
315 |     # Trailing .git suffix is optional
316 |     pattern = r"^https?://github\.com/[A-Za-z0-9_.\-]+/[A-Za-z0-9_.\-]+(\.git)?/?$"
317 |     return bool(re.match(pattern, url.strip()))
318 | 
319 | # Made with Bob
</content>
</file>
<file><path>repolens-backend/app/services/query.py</path>
<content lines="1-154">
  1 | """
  2 | Query Service
  3 | Handles question answering using RAG pipeline
  4 | """
  5 | import logging
  6 | import time
  7 | from hashlib import sha256
  8 | from typing import List, Dict, Any, Tuple
  9 | from app.rag import get_embeddings, get_llm, get_vectorstore, build_prompt, clean_answer
 10 | from app.models import Source
 11 | 
 12 | logger = logging.getLogger(__name__)
 13 | 
 14 | # Query result cache with TTL (Issue #3: Query Caching)
 15 | _query_cache: Dict[str, Tuple[Dict[str, Any], float]] = {}
 16 | _CACHE_TTL = 3600  # 1 hour cache
 17 | 
 18 | 
 19 | def get_cache_key(repo_id: str, question: str) -> str:
 20 |     """Generate cache key from repo_id and question"""
 21 |     return sha256(f"{repo_id}:{question.lower().strip()}".encode()).hexdigest()
 22 | 
 23 | 
 24 | def query_repository(repo_id: str, question: str) -> Dict[str, Any]:
 25 |     """
 26 |     Query a repository using the RAG pipeline.
 27 | 
 28 |     Steps:
 29 |     1. Load the ChromaDB vectorstore for the repository
 30 |     2. Perform similarity search to retrieve relevant code chunks
 31 |     3. Build a structured prompt with the retrieved context
 32 |     4. Generate a detailed answer using the LLM singleton
 33 |     5. Post-process the answer to remove LLM artefacts
 34 |     6. Return the answer with deduplicated source file references
 35 | 
 36 |     Args:
 37 |         repo_id:  Repository identifier
 38 |         question: User's natural language question
 39 | 
 40 |     Returns:
 41 |         Dictionary with keys: answer (str), sources (list[Source]), repo_id (str)
 42 |     """
 43 |     # Check cache first (Issue #3: Query Caching)
 44 |     cache_key = get_cache_key(repo_id, question)
 45 |     if cache_key in _query_cache:
 46 |         cached_result, timestamp = _query_cache[cache_key]
 47 |         if time.time() - timestamp < _CACHE_TTL:
 48 |             logger.info(f"Cache hit for query: {question[:50]}...")
 49 |             return cached_result
 50 |         else:
 51 |             # Expired, remove from cache
 52 |             del _query_cache[cache_key]
 53 |     
 54 |     try:
 55 |         logger.info(f"Processing query for repo {repo_id}: {question!r}")
 56 | 
 57 |         # Step 1: Load vectorstore (fast — Chroma reads from disk)
 58 |         embeddings = get_embeddings()
 59 |         vectorstore = get_vectorstore(repo_id, embeddings)
 60 | 
 61 |         # Step 2: Retrieve top-k most relevant chunks with relevance filtering (Issue #4)
 62 |         logger.info("Performing optimized similarity search with relevance scores")
 63 |         try:
 64 |             # Try similarity search with relevance scores
 65 |             docs_with_scores = vectorstore.similarity_search_with_relevance_scores(
 66 |                 question,
 67 |                 k=10,  # Get more candidates
 68 |             )
 69 |             # Filter by relevance score (keep only relevant results)
 70 |             docs = [doc for doc, score in docs_with_scores if score >= 0.5]
 71 |             
 72 |             # If too few results, fall back to top 3
 73 |             if len(docs) < 3:
 74 |                 logger.info("Few relevant results, falling back to top 3")
 75 |                 docs = vectorstore.similarity_search(question, k=3)
 76 |             elif len(docs) > 6:
 77 |                 docs = docs[:6]  # Limit to top 6
 78 |                 
 79 |             logger.info(f"Retrieved {len(docs)} relevant documents")
 80 |         except Exception as e:
 81 |             # Fallback to basic similarity search if relevance scores not supported
 82 |             logger.warning(f"Relevance search failed, using basic search: {e}")
 83 |             docs = vectorstore.similarity_search(question, k=6)
 84 | 
 85 |         if not docs:
 86 |             logger.warning("No relevant documents found for query")
 87 |             result = {
 88 |                 "answer": (
 89 |                     "I couldn't find relevant information in the repository "
 90 |                     "to answer your question. Try rephrasing or asking about "
 91 |                     "a specific file or function."
 92 |                 ),
 93 |                 "sources": [],
 94 |                 "repo_id": repo_id,
 95 |             }
 96 |             # Cache negative results too (shorter TTL)
 97 |             _query_cache[cache_key] = (result, time.time() - _CACHE_TTL + 300)  # 5 min cache
 98 |             return result
 99 | 
100 |         # Step 3: Build context string and structured prompt
101 |         # Each chunk is prefixed with its source path so the LLM can reference it
102 |         context_parts = []
103 |         for doc in docs:
104 |             source_path = doc.metadata.get("source", "unknown")
105 |             context_parts.append(f"# File: {source_path}\n{doc.page_content}")
106 |         context = "\n\n---\n\n".join(context_parts)
107 | 
108 |         prompt = build_prompt(context, question)
109 | 
110 |         # Step 4: Generate answer (uses LLM singleton — no re-init overhead)
111 |         logger.info("Generating answer with LLM")
112 |         llm = get_llm()
113 |         raw_answer = llm.invoke(prompt)
114 | 
115 |         # Step 5: Clean the raw LLM output
116 |         answer = clean_answer(raw_answer)
117 | 
118 |         # Step 6: Collect deduplicated source references
119 |         seen_paths: set = set()
120 |         sources: List[Source] = []
121 |         for doc in docs:
122 |             path = doc.metadata.get("source", "unknown")
123 |             if path not in seen_paths:
124 |                 seen_paths.add(path)
125 |                 sources.append(Source(file_path=path, content=None))
126 | 
127 |         logger.info(
128 |             f"Query completed for repo {repo_id} — "
129 |             f"{len(docs)} chunks retrieved, {len(sources)} unique sources"
130 |         )
131 | 
132 |         result = {
133 |             "answer": answer,
134 |             "sources": sources,
135 |             "repo_id": repo_id,
136 |         }
137 |         
138 |         # Cache the successful result
139 |         _query_cache[cache_key] = (result, time.time())
140 |         
141 |         # Limit cache size (keep last 100 queries)
142 |         if len(_query_cache) > 100:
143 |             oldest_key = min(_query_cache.keys(),
144 |                            key=lambda k: _query_cache[k][1])
145 |             del _query_cache[oldest_key]
146 |             logger.debug("Cache size limit reached, removed oldest entry")
147 |         
148 |         return result
149 | 
150 |     except Exception as e:
151 |         logger.error(f"Query failed for repo {repo_id}: {e}", exc_info=True)
152 |         raise
153 | 
154 | # Made with Bob
</content>
</file>
<file><path>repolens-backend/app/services/stream.py</path>
<content lines="1-123">
  1 | """
  2 | Streaming Query Service
  3 | Handles token-by-token SSE streaming for the /api/query/stream endpoint.
  4 | Uses WatsonxLLM.stream() via LangChain's streaming interface.
  5 | 
  6 | Threading note: LangChain's WatsonxLLM.stream() and .invoke() are synchronous
  7 | (blocking). We run them in asyncio.to_thread() so the FastAPI event loop is
  8 | never blocked, allowing concurrent requests to be served while one is streaming.
  9 | """
 10 | import asyncio
 11 | import json
 12 | import logging
 13 | from typing import AsyncGenerator
 14 | from app.rag import get_embeddings, get_llm, get_vectorstore, build_prompt, clean_answer
 15 | 
 16 | logger = logging.getLogger(__name__)
 17 | 
 18 | 
 19 | def _retrieve_docs(repo_id: str, question: str):
 20 |     """
 21 |     Synchronous retrieval step — runs in a thread pool.
 22 |     Returns (docs, context, prompt).
 23 |     """
 24 |     embeddings = get_embeddings()
 25 |     vectorstore = get_vectorstore(repo_id, embeddings)
 26 | 
 27 |     try:
 28 |         docs_with_scores = vectorstore.similarity_search_with_relevance_scores(question, k=10)
 29 |         docs = [doc for doc, score in docs_with_scores if score >= 0.5]
 30 |         if len(docs) < 3:
 31 |             docs = vectorstore.similarity_search(question, k=3)
 32 |         elif len(docs) > 6:
 33 |             docs = docs[:6]
 34 |     except Exception:
 35 |         docs = vectorstore.similarity_search(question, k=6)
 36 | 
 37 |     return docs
 38 | 
 39 | 
 40 | def _invoke_llm(prompt: str) -> str:
 41 |     """Synchronous LLM invocation — runs in a thread pool."""
 42 |     llm = get_llm()
 43 |     return llm.invoke(prompt)
 44 | 
 45 | 
 46 | def _stream_llm(prompt: str):
 47 |     """
 48 |     Synchronous LLM streaming — collects all chunks synchronously.
 49 |     Returns a list of chunk strings. Runs in a thread pool.
 50 |     """
 51 |     llm = get_llm()
 52 |     chunks = []
 53 |     for chunk in llm.stream(prompt):
 54 |         if chunk:
 55 |             chunks.append(chunk)
 56 |     return chunks
 57 | 
 58 | 
 59 | async def stream_query_repository(repo_id: str, question: str) -> AsyncGenerator[str, None]:
 60 |     """
 61 |     Stream an answer token-by-token as Server-Sent Events.
 62 | 
 63 |     Yields SSE-formatted strings:
 64 |       data: {"token": "..."}\\n\\n   — for each token chunk
 65 |       data: {"sources": [...]}\\n\\n  — final message with source list
 66 |       data: [DONE]\\n\\n             — signals end of stream
 67 | 
 68 |     Args:
 69 |         repo_id:  Repository identifier
 70 |         question: User's natural language question
 71 |     """
 72 |     try:
 73 |         # Step 1: Retrieve relevant docs (sync I/O → thread pool)
 74 |         docs = await asyncio.to_thread(_retrieve_docs, repo_id, question)
 75 | 
 76 |         if not docs:
 77 |             yield f"data: {json.dumps({'token': 'I could not find relevant information in this repository to answer your question.'})}\n\n"
 78 |             yield "data: [DONE]\n\n"
 79 |             return
 80 | 
 81 |         # Step 2: Build prompt
 82 |         context_parts = []
 83 |         for doc in docs:
 84 |             source_path = doc.metadata.get("source", "unknown")
 85 |             context_parts.append(f"# File: {source_path}\n{doc.page_content}")
 86 |         context = "\n\n---\n\n".join(context_parts)
 87 |         prompt = build_prompt(context, question)
 88 | 
 89 |         # Step 3: Stream tokens (sync LLM call → thread pool)
 90 |         logger.info(f"Streaming response for repo {repo_id}")
 91 | 
 92 |         try:
 93 |             # Collect all chunks from the sync streaming call
 94 |             chunks = await asyncio.to_thread(_stream_llm, prompt)
 95 |             for chunk in chunks:
 96 |                 yield f"data: {json.dumps({'token': chunk})}\n\n"
 97 |         except Exception as stream_err:
 98 |             # Fallback: invoke synchronously and fake-stream in chunks
 99 |             logger.warning(f"Streaming failed, falling back to chunked fake-stream: {stream_err}")
100 |             raw = await asyncio.to_thread(_invoke_llm, prompt)
101 |             answer = clean_answer(raw)
102 |             chunk_size = 15
103 |             for i in range(0, len(answer), chunk_size):
104 |                 chunk = answer[i: i + chunk_size]
105 |                 yield f"data: {json.dumps({'token': chunk})}\n\n"
106 | 
107 |         # Step 4: Send sources as final event
108 |         seen: set = set()
109 |         sources = []
110 |         for doc in docs:
111 |             path = doc.metadata.get("source", "unknown")
112 |             if path not in seen:
113 |                 seen.add(path)
114 |                 sources.append({"file_path": path})
115 | 
116 |         yield f"data: {json.dumps({'sources': sources})}\n\n"
117 |         yield "data: [DONE]\n\n"
118 |         logger.info(f"Stream complete for repo {repo_id} — {len(sources)} sources")
119 | 
120 |     except Exception as e:
121 |         logger.error(f"Stream query failed for repo {repo_id}: {e}", exc_info=True)
122 |         yield f"data: {json.dumps({'error': str(e)})}\n\n"
123 |         yield "data: [DONE]\n\n"
</content>
</file>
<file><path>repolens-backend/.env.example</path>
<content lines="1-13">
 1 | # watsonx.ai Configuration (REQUIRED)
 2 | WATSONX_API_KEY=your_api_key_here
 3 | WATSONX_PROJECT_ID=your_project_id_here
 4 | WATSONX_URL=https://us-south.ml.cloud.ibm.com
 5 | 
 6 | # Application Settings
 7 | ENVIRONMENT=development
 8 | DEBUG=true
 9 | HOST=0.0.0.0
10 | PORT=8000
11 | 
12 | # Storage Configuration
13 | DATA_DIR=./data
</content>
</file>
<file><path>repolens-backend/pyproject.toml</path>
<content lines="1-180">
  1 | [project]
  2 | name = "repolens-backend"
  3 | version = "0.1.0"
  4 | requires-python = ">=3.11"
  5 | 
  6 | dependencies = [
  7 |     # Web Framework
  8 |     "fastapi==0.136.1",
  9 |     "uvicorn[standard]==0.46.0",
 10 |     "pydantic==2.13.3",
 11 |     "pydantic-settings==2.14.0",
 12 |     "python-multipart==0.0.27",
 13 |     # LangChain & AI
 14 |     "langchain==1.2.17",
 15 |     "langchain-community==0.4.1",
 16 |     "langchain-ibm==1.0.7",
 17 |     "langchain-huggingface>=0.1.0",
 18 |     "langchain-text-splitters==1.1.2",
 19 |     "ibm-watsonx-ai==1.5.10",
 20 |     # Vector Store
 21 |     "chromadb==1.5.8",
 22 |     # Embeddings
 23 |     "sentence-transformers==5.4.1",
 24 |     # Git Operations
 25 |     "gitpython==3.1.49",
 26 |     # Utilities
 27 |     "python-dotenv==1.2.2",
 28 |     "httpx==0.28.1",
 29 |     "aiohappyeyeballs==2.6.1",
 30 |     "aiohttp==3.13.5",
 31 |     "aiosignal==1.4.0",
 32 |     "annotated-doc==0.0.4",
 33 |     "annotated-types==0.7.0",
 34 |     "anyio==4.13.0",
 35 |     "attrs==26.1.0",
 36 |     "bcrypt==5.0.0",
 37 |     "build==1.5.0",
 38 |     "cachetools==7.0.6",
 39 |     "certifi==2026.4.22",
 40 |     "charset-normalizer==3.4.7",
 41 |     "click==8.3.3",
 42 |     "cuda-bindings==13.2.0",
 43 |     "cuda-pathfinder==1.5.4",
 44 |     "cuda-toolkit==13.0.2",
 45 |     "dataclasses-json==0.6.7",
 46 |     "durationpy==0.10",
 47 |     "filelock==3.29.0",
 48 |     "flatbuffers==25.12.19",
 49 |     "frozenlist==1.8.0",
 50 |     "fsspec==2026.4.0",
 51 |     "gitdb==4.0.12",
 52 |     "googleapis-common-protos==1.74.0",
 53 |     "greenlet==3.5.0",
 54 |     "grpcio==1.80.0",
 55 |     "h11==0.16.0",
 56 |     "hf-xet==1.4.3",
 57 |     "httpcore==1.0.9",
 58 |     "httptools==0.7.1",
 59 |     "httpx-sse==0.4.3",
 60 |     "huggingface-hub==1.13.0",
 61 |     "ibm-cos-sdk==2.14.3",
 62 |     "ibm-cos-sdk-core==2.14.3",
 63 |     "ibm-cos-sdk-s3transfer==2.14.3",
 64 |     "idna==3.13",
 65 |     "importlib-metadata==8.7.1",
 66 |     "importlib-resources==7.1.0",
 67 |     "jinja2==3.1.6",
 68 |     "jmespath==1.0.1",
 69 |     "joblib==1.5.3",
 70 |     "json-repair==0.59.5",
 71 |     "jsonpatch==1.33",
 72 |     "jsonpointer==3.1.1",
 73 |     "jsonschema==4.26.0",
 74 |     "jsonschema-specifications==2025.9.1",
 75 |     "kubernetes==35.0.0",
 76 |     "langchain-classic==1.0.4",
 77 |     "langchain-core==1.3.2",
 78 |     "langchain-protocol==0.0.14",
 79 |     "langgraph==1.1.10",
 80 |     "langgraph-checkpoint==4.0.3",
 81 |     "langgraph-prebuilt==1.0.13",
 82 |     "langgraph-sdk==0.3.13",
 83 |     "langsmith==0.8.0",
 84 |     "lomond==0.3.3",
 85 |     "markdown-it-py==4.0.0",
 86 |     "markupsafe==3.0.3",
 87 |     "marshmallow==3.26.2",
 88 |     "mdurl==0.1.2",
 89 |     "mmh3==5.2.1",
 90 |     "mpmath==1.3.0",
 91 |     "multidict==6.7.1",
 92 |     "mypy-extensions==1.1.0",
 93 |     "networkx==3.6.1",
 94 |     "numpy==2.4.4",
 95 |     "nvidia-cublas==13.1.0.3",
 96 |     "nvidia-cuda-cupti==13.0.85",
 97 |     "nvidia-cuda-nvrtc==13.0.88",
 98 |     "nvidia-cuda-runtime==13.0.96",
 99 |     "nvidia-cudnn-cu13==9.19.0.56",
100 |     "nvidia-cufft==12.0.0.61",
101 |     "nvidia-cufile==1.15.1.6",
102 |     "nvidia-curand==10.4.0.35",
103 |     "nvidia-cusolver==12.0.4.66",
104 |     "nvidia-cusparse==12.6.3.3",
105 |     "nvidia-cusparselt-cu13==0.8.0",
106 |     "nvidia-nccl-cu13==2.28.9",
107 |     "nvidia-nvjitlink==13.0.88",
108 |     "nvidia-nvshmem-cu13==3.4.5",
109 |     "nvidia-nvtx==13.0.85",
110 |     "oauthlib==3.3.1",
111 |     "onnxruntime==1.25.1",
112 |     "opentelemetry-api==1.41.1",
113 |     "opentelemetry-exporter-otlp-proto-common==1.41.1",
114 |     "opentelemetry-exporter-otlp-proto-grpc==1.41.1",
115 |     "opentelemetry-proto==1.41.1",
116 |     "opentelemetry-sdk==1.41.1",
117 |     "opentelemetry-semantic-conventions==0.62b1",
118 |     "orjson==3.11.8",
119 |     "ormsgpack==1.12.2",
120 |     "overrides==7.7.0",
121 |     "packaging==26.2",
122 |     "pandas==2.3.3",
123 |     "propcache==0.4.1",
124 |     "protobuf==6.33.6",
125 |     "pybase64==1.4.3",
126 |     "pydantic-core==2.46.3",
127 |     "pygments==2.20.0",
128 |     "pypika==0.51.1",
129 |     "pyproject-hooks==1.2.0",
130 |     "python-dateutil==2.9.0.post0",
131 |     "pytz==2026.1.post1",
132 |     "pyyaml==6.0.3",
133 |     "referencing==0.37.0",
134 |     "regex==2026.4.4",
135 |     "requests==2.33.1",
136 |     "requests-oauthlib==2.0.0",
137 |     "requests-toolbelt==1.0.0",
138 |     "rich==15.0.0",
139 |     "rpds-py==0.30.0",
140 |     "safetensors==0.7.0",
141 |     "scikit-learn==1.8.0",
142 |     "scipy==1.17.1",
143 |     "setuptools==81.0.0",
144 |     "shellingham==1.5.4",
145 |     "six==1.17.0",
146 |     "smmap==5.0.3",
147 |     "sqlalchemy==2.0.49",
148 |     "starlette==1.0.0",
149 |     "sympy==1.14.0",
150 |     "tabulate==0.10.0",
151 |     "tenacity==9.1.4",
152 |     "threadpoolctl==3.6.0",
153 |     "tokenizers==0.22.2",
154 |     "torch==2.11.0",
155 |     "tqdm==4.67.3",
156 |     "transformers==5.7.0",
157 |     "triton==3.6.0",
158 |     "typer==0.25.1",
159 |     "typing-extensions==4.15.0",
160 |     "typing-inspect==0.9.0",
161 |     "typing-inspection==0.4.2",
162 |     "tzdata==2026.2",
163 |     "urllib3==2.6.3",
164 |     "uuid-utils==0.14.1",
165 |     "uvloop==0.22.1",
166 |     "watchfiles==1.1.1",
167 |     "websocket-client==1.9.0",
168 |     "websockets==16.0",
169 |     "xxhash==3.7.0",
170 |     "yarl==1.23.0",
171 |     "zipp==3.23.1",
172 |     "zstandard==0.25.0",
173 | ]
174 | 
175 | [build-system]
176 | requires = ["hatchling"]
177 | build-backend = "hatchling.build"
178 | 
179 | [tool.hatch.build.targets.wheel]
180 | packages = ["app"]
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs


# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T15:48:12.226Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.06

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
<file>
<path>repolens-frontend/package.json</path>
</file>
<file>
<path>repolens-frontend/.env.example</path>
</file>
<file>
<path>repolens-frontend/app/page.tsx</path>
</file>
<file>
<path>repolens-frontend/components/ChatInterface3D.tsx</path>
</file>
<file>
<path>repolens-frontend/services/api.ts</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>repolens-frontend/package.json</path>
<content lines="1-32">
 1 | {
 2 |   "name": "repolens-frontend",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "dev": "next dev",
 7 |     "build": "next build",
 8 |     "start": "next start",
 9 |     "lint": "eslint"
10 |   },
11 |   "dependencies": {
12 |     "@emotion/react": "^11.14.0",
13 |     "@emotion/styled": "^11.14.1",
14 |     "@mui/icons-material": "^9.0.0",
15 |     "@mui/material": "^9.0.0",
16 |     "axios": "^1.15.2",
17 |     "framer-motion": "^12.38.0",
18 |     "next": "16.2.4",
19 |     "react": "19.2.4",
20 |     "react-dom": "19.2.4"
21 |   },
22 |   "devDependencies": {
23 |     "@tailwindcss/postcss": "^4",
24 |     "@types/node": "^20",
25 |     "@types/react": "^19",
26 |     "@types/react-dom": "^19",
27 |     "eslint": "^9",
28 |     "eslint-config-next": "16.2.4",
29 |     "tailwindcss": "^4",
30 |     "typescript": "^5"
31 |   }
32 | }
</content>
</file>
<file><path>repolens-frontend/.env.example</path>
<content lines="1-6">
1 | # RepoLens Frontend Environment Variables
2 | 
3 | # Backend API URL
4 | # Default: http://localhost:8000
5 | # For production, update this to your deployed backend URL
6 | NEXT_PUBLIC_API_URL=http://localhost:8000
</content>
</file>
<file><path>repolens-frontend/app/page.tsx</path>
<content lines="1-572">
  1 | /**
  2 |  * RepoLens - Main Page with Material 3D Design
  3 |  * Chat with Your Codebase - Enhanced UI/UX
  4 |  */
  5 | 
  6 | "use client";
  7 | 
  8 | import { useState, useRef, useEffect, useCallback } from "react";
  9 | import { motion } from "framer-motion";
 10 | import dynamic from "next/dynamic";
 11 | import Navigation3D from "@/components/ui/Navigation3D";
 12 | import Card3D from "@/components/ui/Card3D";
 13 | import Button3D from "@/components/ui/Button3D";
 14 | import Input3D from "@/components/ui/Input3D";
 15 | import LoadingSpinner from "@/components/ui/LoadingSpinner";
 16 | import { ToastContainer } from "@/components/ui/Toast";
 17 | 
 18 | // Issue #13: Code splitting for heavy 3D components
 19 | const Hero3D = dynamic(() => import("@/components/Hero3D"), {
 20 |   loading: () => <div className="h-screen" />,
 21 |   ssr: false,
 22 | });
 23 | 
 24 | const ChatInterface3D = dynamic(() => import("@/components/ChatInterface3D"), {
 25 |   loading: () => <LoadingSpinner />,
 26 |   ssr: false,
 27 | });
 28 | 
 29 | const FileTree = dynamic(() => import("@/components/FileTree"), {
 30 |   loading: () => null,
 31 |   ssr: false,
 32 | });
 33 | 
 34 | const MindMapVisualization = dynamic(
 35 |   () => import("@/components/MindMapVisualization"),
 36 |   {
 37 |     loading: () => null,
 38 |     ssr: false,
 39 |   },
 40 | );
 41 | 
 42 | const CodeHealthDashboard = dynamic(
 43 |   () => import("@/components/CodeHealthDashboard"),
 44 |   {
 45 |     loading: () => null,
 46 |     ssr: false,
 47 |   },
 48 | );
 49 | import { useTheme } from "@/hooks/useTheme";
 50 | import { useToast } from "@/hooks/useToast";
 51 | import { apiService } from "@/services/api";
 52 | import { Message } from "@/types/api";
 53 | import GitHubIcon from "@mui/icons-material/GitHub";
 54 | import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
 55 | import CheckCircleIcon from "@mui/icons-material/CheckCircle";
 56 | import CodeIcon from "@mui/icons-material/Code";
 57 | import SpeedIcon from "@mui/icons-material/Speed";
 58 | import SecurityIcon from "@mui/icons-material/Security";
 59 | 
 60 | export default function Home() {
 61 |   const [currentRepoId, setCurrentRepoId] = useState<string | null>(null);
 62 |   const [messages, setMessages] = useState<Message[]>([]);
 63 |   const [isQuerying, setIsQuerying] = useState(false);
 64 |   const [isIngesting, setIsIngesting] = useState(false);
 65 |   const [repoUrl, setRepoUrl] = useState("");
 66 |   const [ingestionProgress, setIngestionProgress] = useState(0);
 67 |   const [ingestionStage, setIngestionStage] = useState("");
 68 |   const [highlightedFile, setHighlightedFile] = useState<string | undefined>();
 69 | 
 70 |   const SUGGESTED_QUESTIONS = [
 71 |     "What does this project do?",
 72 |     "How does authentication work?",
 73 |     "List all API endpoints",
 74 |     "What are the main dependencies?",
 75 |     "Explain the folder structure",
 76 |     "Are there any potential security issues?",
 77 |   ];
 78 | 
 79 |   const { isDarkMode, toggleTheme, mounted } = useTheme();
 80 |   const toast = useToast();
 81 | 
 82 |   // AbortController refs for cleanup
 83 |   const queryAbortControllerRef = useRef<AbortController | null>(null);
 84 |   const ingestAbortControllerRef = useRef<AbortController | null>(null);
 85 | 
 86 |   // Cleanup on unmount
 87 |   useEffect(() => {
 88 |     return () => {
 89 |       queryAbortControllerRef.current?.abort();
 90 |       ingestAbortControllerRef.current?.abort();
 91 |     };
 92 |   }, []);
 93 | 
 94 |   // ── Helper: send a message for a specific repo_id using SSE streaming ──────
 95 |   // Defined FIRST because handleIngestRepo depends on it (auto-summary).
 96 |   const handleSendMessageForRepo = useCallback(
 97 |     async (repoId: string, question: string) => {
 98 |       const userMessage: Message = {
 99 |         id: `user-${Date.now()}`,
100 |         type: "user",
101 |         content: question,
102 |         timestamp: new Date(),
103 |       };
104 |       setMessages((prev) => [...prev, userMessage]);
105 |       setIsQuerying(true);
106 | 
107 |       // Placeholder assistant message — updated in-place as tokens arrive
108 |       const assistantId = `assistant-${Date.now()}`;
109 |       const placeholderMessage: Message = {
110 |         id: assistantId,
111 |         type: "assistant",
112 |         content: "",
113 |         sources: [],
114 |         timestamp: new Date(),
115 |       };
116 |       setMessages((prev) => [...prev, placeholderMessage]);
117 | 
118 |       try {
119 |         const abortController = new AbortController();
120 |         queryAbortControllerRef.current = abortController;
121 | 
122 |         let accumulated = "";
123 |         for await (const event of apiService.streamQuery(
124 |           repoId,
125 |           question,
126 |           abortController.signal,
127 |         )) {
128 |           if (event.error) {
129 |             throw new Error(event.error);
130 |           }
131 |           if (event.token) {
132 |             accumulated += event.token;
133 |             setMessages((prev) =>
134 |               prev.map((m) =>
135 |                 m.id === assistantId ? { ...m, content: accumulated } : m,
136 |               ),
137 |             );
138 |           }
139 |           if (event.sources) {
140 |             setMessages((prev) =>
141 |               prev.map((m) =>
142 |                 m.id === assistantId ? { ...m, sources: event.sources } : m,
143 |               ),
144 |             );
145 |           }
146 |         }
147 | 
148 |         // Empty stream → fall back to non-streaming endpoint
149 |         if (!accumulated) {
150 |           const response = await apiService.queryRepository(repoId, question);
151 |           setMessages((prev) =>
152 |             prev.map((m) =>
153 |               m.id === assistantId
154 |                 ? { ...m, content: response.answer, sources: response.sources }
155 |                 : m,
156 |             ),
157 |           );
158 |         }
159 |       } catch (err: any) {
160 |         if (err.name === "AbortError" || err.name === "CanceledError") return;
161 |         // Stream error → fall back to regular query
162 |         try {
163 |           const response = await apiService.queryRepository(repoId, question);
164 |           setMessages((prev) =>
165 |             prev.map((m) =>
166 |               m.id === assistantId
167 |                 ? { ...m, content: response.answer, sources: response.sources }
168 |                 : m,
169 |             ),
170 |           );
171 |         } catch (fallbackErr: any) {
172 |           toast.error(
173 |             fallbackErr.response?.data?.detail ||
174 |               fallbackErr.message ||
175 |               "Failed to get answer",
176 |           );
177 |           // Remove the empty placeholder on total failure
178 |           setMessages((prev) => prev.filter((m) => m.id !== assistantId));
179 |         }
180 |       } finally {
181 |         setIsQuerying(false);
182 |         queryAbortControllerRef.current = null;
183 |       }
184 |     },
185 |     [toast],
186 |   );
187 | 
188 |   // ── Ingest handler ──────────────────────────────────────────────────────────
189 |   const handleIngestRepo = useCallback(async () => {
190 |     if (!repoUrl.trim()) {
191 |       toast.error("Please enter a repository URL");
192 |       return;
193 |     }
194 | 
195 |     setIsIngesting(true);
196 |     setIngestionProgress(0);
197 |     setIngestionStage("Starting...");
198 |     try {
199 |       const response = await apiService.ingestRepository(repoUrl);
200 | 
201 |       await apiService.pollIngestionStatus(response.repo_id, (status) => {
202 |         setIngestionProgress(status.progress ?? 0);
203 |         setIngestionStage(status.stage ?? "Processing...");
204 |       });
205 | 
206 |       setCurrentRepoId(response.repo_id);
207 |       setMessages([]);
208 |       setIngestionProgress(100);
209 |       setIngestionStage("Ready!");
210 |       toast.success("Repository ingested successfully!");
211 | 
212 |       // Auto-summarize after ingestion (Feature 2)
213 |       // Use the repo_id directly from response — don't rely on currentRepoId state
214 |       // which may not have propagated yet.
215 |       setTimeout(() => {
216 |         handleSendMessageForRepo(
217 |           response.repo_id,
218 |           "Give me a concise overview of this repository: its main purpose, tech stack, key features, and folder structure.",
219 |         );
220 |       }, 500);
221 |     } catch (err: any) {
222 |       toast.error(
223 |         err.response?.data?.detail ||
224 |           err.message ||
225 |           "Failed to ingest repository",
226 |       );
227 |     } finally {
228 |       setIsIngesting(false);
229 |     }
230 |   }, [repoUrl, toast, handleSendMessageForRepo]);
231 | 
232 |   // Handle sending a question with cancellation support (Issue #15)
233 |   const handleSendMessage = useCallback(
234 |     async (question: string) => {
235 |       if (!currentRepoId) {
236 |         toast.error("Please ingest a repository first");
237 |         return;
238 |       }
239 |       await handleSendMessageForRepo(currentRepoId, question);
240 |     },
241 |     [currentRepoId, handleSendMessageForRepo, toast],
242 |   );
243 | 
244 |   // Prevent flash of unstyled content
245 |   if (!mounted) {
246 |     return null;
247 |   }
248 | 
249 |   return (
250 |     <main className="min-h-screen surface">
251 |       {/* Navigation */}
252 |       <Navigation3D onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
253 | 
254 |       {/* Hero Section */}
255 |       <Hero3D />
256 | 
257 |       {/* Main Content */}
258 |       <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
259 |         {/* Repository Input Section */}
260 |         <motion.div
261 |           initial={{ opacity: 0, y: 30 }}
262 |           whileInView={{ opacity: 1, y: 0 }}
263 |           viewport={{ once: true }}
264 |           transition={{ duration: 0.6 }}
265 |           id="features"
266 |           className="flex justify-center"
267 |         >
268 |           <Card3D elevation={3} className="w-full max-w-3xl">
269 |             <div className="text-center mb-8">
270 |               <h2 className="text-3xl md:text-4xl font-bold mb-3">
271 |                 Get Started
272 |               </h2>
273 |               <p className="text-gray-600 dark:text-gray-400 text-lg">
274 |                 Enter a GitHub repository URL to begin analyzing your codebase
275 |               </p>
276 |             </div>
277 | 
278 |             <div className="space-y-4">
279 |               <Input3D
280 |                 value={repoUrl}
281 |                 onChange={(e) => setRepoUrl(e.target.value)}
282 |                 placeholder="https://github.com/Divyanshu-kumar14/RepoLens.git"
283 |                 icon={<GitHubIcon />}
284 |                 fullWidth
285 |                 disabled={isIngesting}
286 |               />
287 | 
288 |               <Button3D
289 |                 onClick={handleIngestRepo}
290 |                 variant="primary"
291 |                 size="lg"
292 |                 fullWidth
293 |                 loading={isIngesting}
294 |                 disabled={isIngesting || !repoUrl.trim()}
295 |                 icon={<RocketLaunchIcon />}
296 |               >
297 |                 {isIngesting ? "Ingesting Repository..." : "Ingest Repository"}
298 |               </Button3D>
299 | 
300 |               {isIngesting && (
301 |                 <motion.div
302 |                   initial={{ opacity: 0, height: 0 }}
303 |                   animate={{ opacity: 1, height: "auto" }}
304 |                   className="py-4 space-y-3"
305 |                 >
306 |                   {/* Stage Label */}
307 |                   <div className="flex items-center justify-between text-sm">
308 |                     <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
309 |                       <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
310 |                       {ingestionStage}
311 |                     </span>
312 |                     <span className="text-gray-500 dark:text-gray-400 font-mono">
313 |                       {ingestionProgress}%
314 |                     </span>
315 |                   </div>
316 |                   {/* Progress Bar */}
317 |                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
318 |                     <motion.div
319 |                       className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
320 |                       initial={{ width: "0%" }}
321 |                       animate={{ width: `${ingestionProgress}%` }}
322 |                       transition={{ duration: 0.5, ease: "easeOut" }}
323 |                     />
324 |                   </div>
325 |                   {/* Step Indicators */}
326 |                   <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
327 |                     {[
328 |                       "Cloning",
329 |                       "Reading",
330 |                       "Chunking",
331 |                       "Embedding",
332 |                       "Indexing",
333 |                     ].map((step, i) => {
334 |                       const stepProgress = (i + 1) * 20;
335 |                       const isActive = ingestionProgress >= stepProgress - 10;
336 |                       return (
337 |                         <span
338 |                           key={step}
339 |                           className={
340 |                             isActive
341 |                               ? "text-blue-500 dark:text-blue-400 font-medium"
342 |                               : ""
343 |                           }
344 |                         >
345 |                           {step}
346 |                         </span>
347 |                       );
348 |                     })}
349 |                   </div>
350 |                 </motion.div>
351 |               )}
352 | 
353 |               {currentRepoId && (
354 |                 <motion.div
355 |                   initial={{ opacity: 0, scale: 0.9 }}
356 |                   animate={{ opacity: 1, scale: 1 }}
357 |                   className="glass rounded-xl p-4 flex items-center gap-3"
358 |                 >
359 |                   <CheckCircleIcon className="text-green-500 flex-shrink-0" />
360 |                   <div className="flex-1 text-center md:text-left">
361 |                     <p className="font-medium">Repository Ready!</p>
362 |                     <p className="text-sm text-gray-600 dark:text-gray-400">
363 |                       Start asking questions below
364 |                     </p>
365 |                   </div>
366 |                 </motion.div>
367 |               )}
368 |             </div>
369 |           </Card3D>
370 |         </motion.div>
371 | 
372 |         {/* Chat Interface */}
373 |         {currentRepoId && (
374 |           <motion.div
375 |             initial={{ opacity: 0, y: 30 }}
376 |             animate={{ opacity: 1, y: 0 }}
377 |             transition={{ duration: 0.6 }}
378 |             className="flex flex-col items-center gap-6"
379 |           >
380 |             {/* Suggested Question Chips */}
381 |             {messages.length <= 2 && (
382 |               <motion.div
383 |                 initial={{ opacity: 0, y: 10 }}
384 |                 animate={{ opacity: 1, y: 0 }}
385 |                 transition={{ duration: 0.4 }}
386 |                 className="w-full max-w-6xl"
387 |               >
388 |                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center font-medium">
389 |                   💡 Try asking:
390 |                 </p>
391 |                 <div className="flex flex-wrap gap-2 justify-center">
392 |                   {SUGGESTED_QUESTIONS.map((q) => (
393 |                     <motion.button
394 |                       key={q}
395 |                       onClick={() => handleSendMessage(q)}
396 |                       disabled={isQuerying}
397 |                       className="glass px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
398 |                       whileHover={{ scale: 1.03 }}
399 |                       whileTap={{ scale: 0.97 }}
400 |                     >
401 |                       {q}
402 |                     </motion.button>
403 |                   ))}
404 |                 </div>
405 |               </motion.div>
406 |             )}
407 | 
408 |             {/* Two-Column Layout: File Tree (Left) + Chat (Right) */}
409 |             <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-4 w-full max-w-[1400px]">
410 |               {/* Left Sidebar - File Tree */}
411 |               <div className="flex-shrink-0 flex flex-col h-[600px] overflow-hidden">
412 |                 <FileTree
413 |                   repoId={currentRepoId}
414 |                   highlightedFile={highlightedFile}
415 |                   onFileClick={(path) => {
416 |                     setHighlightedFile(path);
417 |                     handleSendMessage(
418 |                       `Explain what the file "${path}" does and its role in the project.`,
419 |                     );
420 |                   }}
421 |                 />
422 |               </div>
423 | 
424 |               {/* Chat Interface */}
425 |               <div className="flex-1 min-w-0">
426 |                 <ChatInterface3D
427 |                   messages={messages}
428 |                   onSendMessage={handleSendMessage}
429 |                   isLoading={isQuerying}
430 |                   disabled={!currentRepoId}
431 |                 />
432 |               </div>
433 |             </div>
434 | 
435 |             {/* Mind Map - Full Width Below Chat */}
436 |             <div className="w-full max-w-[1400px]">
437 |               <MindMapVisualization
438 |                 repoId={currentRepoId}
439 |                 onNodeClick={(question) => handleSendMessage(question)}
440 |               />
441 |             </div>
442 | 
443 |             {/* Code Health Dashboard - Full Width Below Mind Map */}
444 |             <div className="w-full max-w-[1400px]">
445 |               <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
446 |                 <CodeHealthDashboard repoId={currentRepoId} />
447 |               </div>
448 |             </div>
449 |           </motion.div>
450 |         )}
451 | 
452 |         {/* Features Section */}
453 |         <motion.div
454 |           initial={{ opacity: 0, y: 30 }}
455 |           whileInView={{ opacity: 1, y: 0 }}
456 |           viewport={{ once: true }}
457 |           transition={{ duration: 0.6 }}
458 |           id="how-it-works"
459 |           className="space-y-12"
460 |         >
461 |           <div className="text-center max-w-3xl mx-auto">
462 |             <h2 className="text-3xl md:text-4xl font-bold mb-4">
463 |               How It Works
464 |             </h2>
465 |             <p className="text-gray-600 dark:text-gray-400 text-lg">
466 |               RepoLens uses advanced AI to understand and analyze your codebase
467 |             </p>
468 |           </div>
469 | 
470 |           <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
471 |             {[
472 |               {
473 |                 icon: <CodeIcon className="text-4xl" />,
474 |                 title: "Code Analysis",
475 |                 description:
476 |                   "Deep semantic understanding of your repository structure and code patterns",
477 |               },
478 |               {
479 |                 icon: <SpeedIcon className="text-4xl" />,
480 |                 title: "Instant Answers",
481 |                 description:
482 |                   "Get responses in seconds with relevant source code references",
483 |               },
484 |               {
485 |                 icon: <SecurityIcon className="text-4xl" />,
486 |                 title: "Secure & Private",
487 |                 description:
488 |                   "Your code is processed securely with enterprise-grade AI",
489 |               },
490 |             ].map((feature, index) => (
491 |               <motion.div
492 |                 key={feature.title}
493 |                 initial={{ opacity: 0, y: 20 }}
494 |                 whileInView={{ opacity: 1, y: 0 }}
495 |                 viewport={{ once: true }}
496 |                 transition={{ duration: 0.4, delay: index * 0.1 }}
497 |               >
498 |                 <Card3D className="text-center h-full flex flex-col items-center justify-center p-8">
499 |                   <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center justify-center">
500 |                     {feature.icon}
501 |                   </div>
502 |                   <h3 className="text-xl font-semibold mb-3">
503 |                     {feature.title}
504 |                   </h3>
505 |                   <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
506 |                     {feature.description}
507 |                   </p>
508 |                 </Card3D>
509 |               </motion.div>
510 |             ))}
511 |           </div>
512 |         </motion.div>
513 | 
514 |         {/* About Section */}
515 |         <motion.div
516 |           initial={{ opacity: 0, y: 30 }}
517 |           whileInView={{ opacity: 1, y: 0 }}
518 |           viewport={{ once: true }}
519 |           transition={{ duration: 0.6 }}
520 |           id="about"
521 |           className="flex justify-center"
522 |         >
523 |           <Card3D elevation={3} className="w-full max-w-4xl text-center p-8">
524 |             <h2 className="text-3xl md:text-4xl font-bold mb-6">
525 |               About RepoLens
526 |             </h2>
527 |             <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
528 |               RepoLens is powered by IBM watsonx.ai Granite models, providing
529 |               enterprise-grade AI capabilities for code understanding and
530 |               analysis. Built with FastAPI, LangChain, and ChromaDB for optimal
531 |               performance.
532 |             </p>
533 |             <div className="flex flex-wrap gap-3 justify-center">
534 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
535 |                 FastAPI
536 |               </span>
537 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
538 |                 LangChain
539 |               </span>
540 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
541 |                 watsonx.ai
542 |               </span>
543 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
544 |                 ChromaDB
545 |               </span>
546 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
547 |                 Next.js
548 |               </span>
549 |             </div>
550 |           </Card3D>
551 |         </motion.div>
552 |       </section>
553 | 
554 |       {/* Footer */}
555 |       <footer className="surface-variant py-12 mt-20">
556 |         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
557 |           <p className="text-gray-600 dark:text-gray-400 mb-2">
558 |             Built with ❤️ using Material Design 3 principles
559 |           </p>
560 |           <p className="text-sm text-gray-500 dark:text-gray-500">
561 |             © 2026 RepoLens. Powered by IBM watsonx.ai Granite.
562 |           </p>
563 |         </div>
564 |       </footer>
565 | 
566 |       {/* Toast Notifications */}
567 |       <ToastContainer toasts={toast.toasts} />
568 |     </main>
569 |   );
570 | }
571 | 
572 | // Made with Bob
</content>
</file>
<file><path>repolens-frontend/components/ChatInterface3D.tsx</path>
<content lines="1-334">
  1 | /**
  2 |  * Material 3D Chat Interface
  3 |  * Enhanced chat UI with 3D depth and Material Design
  4 |  */
  5 | 
  6 | "use client";
  7 | 
  8 | import { useState, useRef, useEffect, useCallback, memo, FormEvent } from "react";
  9 | import { motion, AnimatePresence } from "framer-motion";
 10 | import Card3D from "./ui/Card3D";
 11 | import Button3D from "./ui/Button3D";
 12 | import Input3D from "./ui/Input3D";
 13 | import LoadingSpinner from "./ui/LoadingSpinner";
 14 | import SendIcon from "@mui/icons-material/Send";
 15 | import PersonIcon from "@mui/icons-material/Person";
 16 | import SmartToyIcon from "@mui/icons-material/SmartToy";
 17 | import CodeIcon from "@mui/icons-material/Code";
 18 | import { Message } from "@/types/api";
 19 | import MarkdownRenderer from "./ui/MarkdownRenderer";
 20 | 
 21 | interface ChatInterface3DProps {
 22 |   messages: Message[];
 23 |   onSendMessage: (message: string) => void;
 24 |   isLoading: boolean;
 25 |   disabled?: boolean;
 26 |   streamingMessageId?: string;
 27 | }
 28 | 
 29 | export default function ChatInterface3D({
 30 |   messages,
 31 |   onSendMessage,
 32 |   isLoading,
 33 |   disabled = false,
 34 | }: ChatInterface3DProps) {
 35 |   const [input, setInput] = useState("");
 36 |   const messagesEndRef = useRef<HTMLDivElement>(null);
 37 |   const messagesContainerRef = useRef<HTMLDivElement>(null);
 38 |   const formRef = useRef<HTMLFormElement>(null);
 39 |   const prevMessagesLengthRef = useRef(messages.length);
 40 | 
 41 |   // Issue #7: Request debouncing to prevent duplicate submissions
 42 |   const lastSubmittedRef = useRef<string>("");
 43 |   const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
 44 | 
 45 |   const scrollToBottom = () => {
 46 |     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 47 |   };
 48 | 
 49 |   useEffect(() => {
 50 |     // Only auto-scroll when new messages are added (assistant responses)
 51 |     // Don't scroll when user is just typing or submitting
 52 |     const messagesIncreased = messages.length > prevMessagesLengthRef.current;
 53 |     const lastMessage = messages[messages.length - 1];
 54 | 
 55 |     // Auto-scroll only when:
 56 |     // 1. A new assistant message arrives (not just user message)
 57 |     // 2. Or when the user is near the bottom of the chat (within 100px)
 58 |     if (messagesIncreased && lastMessage?.type === "assistant") {
 59 |       scrollToBottom();
 60 |     } else if (messagesIncreased && messagesContainerRef.current) {
 61 |       const container = messagesContainerRef.current;
 62 |       const isNearBottom =
 63 |         container.scrollHeight - container.scrollTop - container.clientHeight <
 64 |         100;
 65 | 
 66 |       if (isNearBottom) {
 67 |         scrollToBottom();
 68 |       }
 69 |     }
 70 | 
 71 |     prevMessagesLengthRef.current = messages.length;
 72 |   }, [messages]);
 73 | 
 74 |   // Cleanup timeout on unmount
 75 |   useEffect(() => {
 76 |     return () => {
 77 |       if (submitTimeoutRef.current) {
 78 |         clearTimeout(submitTimeoutRef.current);
 79 |       }
 80 |     };
 81 |   }, []);
 82 | 
 83 |   const handleSubmit = useCallback(
 84 |     (e: React.FormEvent) => {
 85 |       e.preventDefault();
 86 | 
 87 |       const trimmedInput = input.trim();
 88 | 
 89 |       // Prevent empty, duplicate, or rapid submissions (Issue #7: Debouncing)
 90 |       if (!trimmedInput || disabled || isLoading) return;
 91 |       if (trimmedInput === lastSubmittedRef.current) return;
 92 | 
 93 |       // Clear any pending submission
 94 |       if (submitTimeoutRef.current) {
 95 |         clearTimeout(submitTimeoutRef.current);
 96 |       }
 97 | 
 98 |       // Debounce: wait 300ms before actually submitting
 99 |       submitTimeoutRef.current = setTimeout(() => {
100 |         lastSubmittedRef.current = trimmedInput;
101 |         onSendMessage(trimmedInput);
102 |         setInput("");
103 | 
104 |         // Reset after 2 seconds to allow re-asking same question
105 |         setTimeout(() => {
106 |           lastSubmittedRef.current = "";
107 |         }, 2000);
108 |       }, 300);
109 |     },
110 |     [input, disabled, isLoading, onSendMessage],
111 |   );
112 | 
113 |   return (
114 |     <Card3D className="w-full max-w-5xl mx-auto" elevation={3}>
115 |       <div className="flex flex-col h-[600px]">
116 |         {/* Chat Header */}
117 |         <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 flex-shrink-0">
118 |           <div className="flex items-center justify-center gap-3">
119 |             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center elevation-2">
120 |               <SmartToyIcon className="text-white" />
121 |             </div>
122 |             <div className="text-center">
123 |               <h3 className="text-lg font-semibold">AI Assistant</h3>
124 |               <p className="text-sm text-gray-500">Powered by IBM Granite</p>
125 |             </div>
126 |           </div>
127 |         </div>
128 | 
129 |         {/* Messages Container */}
130 |         <div
131 |           ref={messagesContainerRef}
132 |           className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 relative"
133 |         >
134 |           <AnimatePresence mode="popLayout">
135 |             {messages.length === 0 ? (
136 |               <motion.div
137 |                 initial={{ opacity: 0 }}
138 |                 animate={{ opacity: 1 }}
139 |                 className="h-full flex items-center justify-center"
140 |               >
141 |                 <div className="text-center space-y-4 max-w-md mx-auto px-4">
142 |                   <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto">
143 |                     <CodeIcon className="text-4xl text-blue-600 dark:text-blue-400" />
144 |                   </div>
145 |                   <div>
146 |                     <h4 className="text-lg font-semibold mb-2">
147 |                       Start a Conversation
148 |                     </h4>
149 |                     <p className="text-sm text-gray-500">
150 |                       Ask me anything about your codebase
151 |                     </p>
152 |                   </div>
153 |                 </div>
154 |               </motion.div>
155 |             ) : (
156 |               messages.map((message) => {
157 |                 // A message is actively streaming if it's the last assistant message with no content yet
158 |                 const isLastAssistant =
159 |                   message.type === "assistant" &&
160 |                   message.id === messages[messages.length - 1]?.id;
161 |                 const isStreaming = isLastAssistant && isLoading;
162 |                 return <ChatMessage key={message.id} message={message} isStreaming={isStreaming} />;
163 |               })
164 |             )}
165 |           </AnimatePresence>
166 | 
167 |           {isLoading && (
168 |             <motion.div
169 |               initial={{ opacity: 0, y: 10 }}
170 |               animate={{ opacity: 1, y: 0 }}
171 |               className="flex items-start gap-3"
172 |             >
173 |               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
174 |                 <SmartToyIcon className="text-white text-sm" />
175 |               </div>
176 |               <div className="glass rounded-2xl p-4 max-w-[80%]">
177 |                 <LoadingSpinner size="sm" variant="dots" />
178 |               </div>
179 |             </motion.div>
180 |           )}
181 | 
182 |           <div ref={messagesEndRef} />
183 |         </div>
184 | 
185 |         {/* Input Form */}
186 |         <form
187 |           ref={formRef}
188 |           onSubmit={handleSubmit}
189 |           className="flex gap-3 items-end flex-shrink-0"
190 |         >
191 |           <div className="flex-1">
192 |             <Input3D
193 |               value={input}
194 |               onChange={(e) => setInput(e.target.value)}
195 |               onKeyDown={(e) => {
196 |                 if (e.key === "Enter" && !e.shiftKey) {
197 |                   e.preventDefault();
198 |                   formRef.current?.requestSubmit();
199 |                 }
200 |               }}
201 |               placeholder="Ask about your codebase..."
202 |               disabled={disabled || isLoading}
203 |               fullWidth
204 |             />
205 |           </div>
206 |           <Button3D
207 |             variant="primary"
208 |             disabled={disabled || isLoading || !input.trim()}
209 |             icon={<SendIcon />}
210 |             className="!rounded-xl !py-3 !px-6"
211 |             onClick={() => formRef.current?.requestSubmit()}
212 |           >
213 |             Send
214 |           </Button3D>
215 |         </form>
216 |       </div>
217 |     </Card3D>
218 |   );
219 | }
220 | 
221 | // Issue #8: Memoize ChatMessage to prevent unnecessary re-renders
222 | const ChatMessage = memo(
223 |   function ChatMessage({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
224 |     const isUser = message.type === "user";
225 | 
226 |     return (
227 |       <motion.div
228 |         initial={{ opacity: 0, y: 10, scale: 0.95 }}
229 |         animate={{ opacity: 1, y: 0, scale: 1 }}
230 |         exit={{ opacity: 0, scale: 0.95 }}
231 |         transition={{ duration: 0.3 }}
232 |         className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
233 |       >
234 |         {/* Avatar */}
235 |         <div
236 |           className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
237 |             isUser
238 |               ? "bg-gradient-to-br from-green-500 to-teal-600"
239 |               : "bg-gradient-to-br from-blue-500 to-purple-600"
240 |           }`}
241 |         >
242 |           {isUser ? (
243 |             <PersonIcon className="text-white text-sm" />
244 |           ) : (
245 |             <SmartToyIcon className="text-white text-sm" />
246 |           )}
247 |         </div>
248 | 
249 |         {/* Message Content */}
250 |         <div
251 |           className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}
252 |         >
253 |           <motion.div
254 |             className={`glass rounded-2xl p-4 ${
255 |               isUser
256 |                 ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
257 |                 : "surface-variant"
258 |             }`}
259 |             whileHover={{ scale: 1.02 }}
260 |             transition={{ duration: 0.2 }}
261 |           >
262 |             {isUser ? (
263 |               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
264 |                 {message.content}
265 |               </p>
266 |             ) : message.content ? (
267 |               <>
268 |                 <MarkdownRenderer content={message.content} />
269 |                 {/* Blinking cursor while streaming */}
270 |                 {isStreaming && (
271 |                   <motion.span
272 |                     className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle"
273 |                     animate={{ opacity: [1, 0] }}
274 |                     transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
275 |                   />
276 |                 )}
277 |               </>
278 |             ) : (
279 |               /* Empty content = waiting for first token */
280 |               <LoadingSpinner size="sm" variant="dots" />
281 |             )}
282 |           </motion.div>
283 | 
284 |           {/* Sources */}
285 |           {message.sources && message.sources.length > 0 && (
286 |             <motion.div
287 |               initial={{ opacity: 0, height: 0 }}
288 |               animate={{ opacity: 1, height: "auto" }}
289 |               className="space-y-2 w-full"
290 |             >
291 |               <p className="text-xs text-gray-500 font-medium">Sources:</p>
292 |               {message.sources.map((source, index) => (
293 |                 <motion.div
294 |                   key={`${source.file_path}-${index}`}
295 |                   className="glass rounded-lg p-3 text-xs"
296 |                   whileHover={{ x: 5 }}
297 |                   transition={{ duration: 0.2 }}
298 |                 >
299 |                   <div className="flex items-start gap-2">
300 |                     <CodeIcon className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0 mt-0.5" />
301 |                     <div className="flex-1 min-w-0">
302 |                       <p className="font-mono text-blue-600 dark:text-blue-400 truncate">
303 |                         {source.file_path}
304 |                       </p>
305 |                       <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
306 |                         {source.content}
307 |                       </p>
308 |                     </div>
309 |                   </div>
310 |                 </motion.div>
311 |               ))}
312 |             </motion.div>
313 |           )}
314 | 
315 |           {/* Timestamp */}
316 |           <span className="text-xs text-gray-400">
317 |             {new Date(message.timestamp).toLocaleTimeString()}
318 |           </span>
319 |         </div>
320 |       </motion.div>
321 |     );
322 |   },
323 |   (prevProps, nextProps) => {
324 |     // Custom comparison: only re-render if message content or streaming state changed
325 |     return (
326 |       prevProps.message.id === nextProps.message.id &&
327 |       prevProps.message.content === nextProps.message.content &&
328 |       prevProps.message.sources === nextProps.message.sources &&
329 |       prevProps.isStreaming === nextProps.isStreaming
330 |     );
331 |   },
332 | );
333 | 
334 | // Made with Bob
</content>
</file>
<file><path>repolens-frontend/services/api.ts</path>
<content lines="1-230">
  1 | /**
  2 |  * API Service Layer
  3 |  * Handles all communication with the FastAPI backend
  4 |  */
  5 | 
  6 | import axios, { AxiosInstance } from "axios";
  7 | import {
  8 |   IngestRequest,
  9 |   IngestResponse,
 10 |   IngestionStatus,
 11 |   QueryRequest,
 12 |   QueryResponse,
 13 |   HealthResponse,
 14 | } from "@/types/api";
 15 | 
 16 | // Backend API base URL - defaults to localhost:8000
 17 | const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
 18 | 
 19 | class ApiService {
 20 |   private client: AxiosInstance;
 21 | 
 22 |   constructor() {
 23 |     this.client = axios.create({
 24 |       baseURL: API_BASE_URL,
 25 |       headers: {
 26 |         "Content-Type": "application/json",
 27 |       },
 28 |       // No timeout - allow AI operations to complete naturally
 29 |       timeout: 0,
 30 |     });
 31 |   }
 32 | 
 33 |   /**
 34 |    * Health check endpoint
 35 |    */
 36 |   async healthCheck(): Promise<HealthResponse> {
 37 |     const response = await this.client.get<HealthResponse>("/api/health");
 38 |     return response.data;
 39 |   }
 40 | 
 41 |   /**
 42 |    * Ingest a GitHub repository
 43 |    * @param repoUrl - GitHub repository URL
 44 |    * @returns Repository ID and initial status
 45 |    */
 46 |   async ingestRepository(repoUrl: string): Promise<IngestResponse> {
 47 |     const request: IngestRequest = { repo_url: repoUrl };
 48 |     const response = await this.client.post<IngestResponse>(
 49 |       "/api/ingest",
 50 |       request,
 51 |     );
 52 |     return response.data;
 53 |   }
 54 | 
 55 |   /**
 56 |    * Get ingestion status for a repository
 57 |    * @param repoId - Repository identifier
 58 |    * @returns Current ingestion status and progress
 59 |    */
 60 |   async getIngestionStatus(repoId: string): Promise<IngestionStatus> {
 61 |     const response = await this.client.get<IngestionStatus>(
 62 |       `/api/ingest/${repoId}/status`,
 63 |     );
 64 |     return response.data;
 65 |   }
 66 | 
 67 |   /**
 68 |    * Query a repository with a natural language question
 69 |    * @param repoId - Repository identifier
 70 |    * @param question - Natural language question
 71 |    * @returns Answer and source references
 72 |    */
 73 |   async queryRepository(
 74 |     repoId: string,
 75 |     question: string,
 76 |   ): Promise<QueryResponse> {
 77 |     const request: QueryRequest = { repo_id: repoId, question };
 78 |     const response = await this.client.post<QueryResponse>(
 79 |       "/api/query",
 80 |       request,
 81 |     );
 82 |     return response.data;
 83 |   }
 84 | 
 85 |   /**
 86 |    * Poll ingestion status with adaptive polling (Issue #12)
 87 |    * @param repoId - Repository identifier
 88 |    * @param onProgress - Callback for progress updates
 89 |    * @param signal - AbortSignal to cancel polling
 90 |    * @returns Final ingestion status
 91 |    */
 92 |   async pollIngestionStatus(
 93 |     repoId: string,
 94 |     onProgress?: (status: IngestionStatus) => void,
 95 |     signal?: AbortSignal,
 96 |   ): Promise<IngestionStatus> {
 97 |     let attempts = 0;
 98 |     let networkErrors = 0; // consecutive network error counter
 99 |     const maxNetworkErrors = 5; // tolerate up to 5 transient errors before giving up
100 |     let pollInterval = 1000; // start at 1s
101 |     const maxInterval = 3000; // cap at 3s (don't spam but stay responsive)
102 |     const maxAttempts = 240; // 4 min at 1s, longer with backoff — outlasts 180s clone
103 | 
104 |     return new Promise((resolve, reject) => {
105 |       const poll = async () => {
106 |         // Check if polling was cancelled
107 |         if (signal?.aborted) {
108 |           reject(new Error("Polling cancelled"));
109 |           return;
110 |         }
111 | 
112 |         // Check if max attempts exceeded
113 |         if (attempts >= maxAttempts) {
114 |           reject(
115 |             new Error(
116 |               "Ingestion timeout - exceeded maximum attempts. Please try again.",
117 |             ),
118 |           );
119 |           return;
120 |         }
121 | 
122 |         attempts++;
123 | 
124 |         try {
125 |           const status = await this.getIngestionStatus(repoId);
126 |           networkErrors = 0; // reset on success
127 | 
128 |           // Call progress callback if provided
129 |           if (onProgress) {
130 |             onProgress(status);
131 |           }
132 | 
133 |           // Check if ingestion is complete
134 |           if (status.status === "completed") {
135 |             resolve(status);
136 |           } else if (status.status === "failed") {
137 |             reject(new Error(status.error || "Ingestion failed"));
138 |           } else {
139 |             // Adaptive polling: increase interval as progress increases
140 |             if (status.progress && status.progress > 50) {
141 |               pollInterval = Math.min(pollInterval * 1.2, maxInterval);
142 |             }
143 |             setTimeout(poll, pollInterval);
144 |           }
145 |         } catch (error: any) {
146 |           networkErrors++;
147 |           // Tolerate transient network errors (server restart, 503, etc.)
148 |           if (networkErrors <= maxNetworkErrors) {
149 |             console.warn(
150 |               `Poll attempt ${attempts} failed (network error ${networkErrors}/${maxNetworkErrors}), retrying...`,
151 |             );
152 |             setTimeout(poll, pollInterval);
153 |           } else {
154 |             reject(error);
155 |           }
156 |         }
157 |       };
158 | 
159 |       // Start polling
160 |       poll();
161 |     });
162 |   }
163 | 
164 |   /**
165 |    * Get repository structure for mind map visualization
166 |    * @param repoId - Repository identifier
167 |    * @returns Repository structure with directory hierarchy
168 |    */
169 |   async getRepositoryStructure(repoId: string): Promise<any> {
170 |     const response = await this.client.get(`/api/ingest/${repoId}/structure`);
171 |     return response.data;
172 |   }
173 | 
174 |   /**
175 |    * Stream a repository query as Server-Sent Events
176 |    * Yields parsed SSE event objects: {token?, sources?, error?}
177 |    */
178 |   async *streamQuery(
179 |     repoId: string,
180 |     question: string,
181 |     signal?: AbortSignal,
182 |   ): AsyncGenerator<{
183 |     token?: string;
184 |     sources?: { file_path: string }[];
185 |     error?: string;
186 |   }> {
187 |     const response = await fetch(`${API_BASE_URL}/api/query/stream`, {
188 |       method: "POST",
189 |       headers: { "Content-Type": "application/json" },
190 |       body: JSON.stringify({ repo_id: repoId, question }),
191 |       signal,
192 |     });
193 | 
194 |     if (!response.ok) {
195 |       const err = await response
196 |         .json()
197 |         .catch(() => ({ detail: "Stream failed" }));
198 |       throw new Error(err.detail || `HTTP ${response.status}`);
199 |     }
200 | 
201 |     const reader = response.body!.getReader();
202 |     const decoder = new TextDecoder();
203 |     let buffer = "";
204 | 
205 |     while (true) {
206 |       const { done, value } = await reader.read();
207 |       if (done) break;
208 | 
209 |       buffer += decoder.decode(value, { stream: true });
210 |       const lines = buffer.split("\n");
211 |       buffer = lines.pop() ?? "";
212 | 
213 |       for (const line of lines) {
214 |         if (!line.startsWith("data: ")) continue;
215 |         const data = line.slice(6).trim();
216 |         if (data === "[DONE]") return;
217 |         try {
218 |           yield JSON.parse(data);
219 |         } catch {
220 |           // ignore malformed SSE lines
221 |         }
222 |       }
223 |     }
224 |   }
225 | }
226 | 
227 | // Export singleton instance
228 | export const apiService = new ApiService();
229 | 
230 | // Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs


# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T15:48:16.564Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.14

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now I'll create a comprehensive, professional README.md based on the actual codebase I've analyzed.

<write_to_file>
<path>README.md</path>
<content># RepoLens 🔍

**Chat with your codebase using AI-powered natural language understanding**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![watsonx.ai](https://img.shields.io/badge/watsonx.ai-Granite-purple.svg)](https://www.ibm.com/watsonx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

RepoLens transforms how developers understand and navigate unfamiliar codebases. Instead of spending hours reading through files, documentation, and code comments, simply paste a GitHub repository URL and ask questions in natural language.

**The Problem:** Developers waste countless hours trying to understand new codebases—tracing function calls, understanding architecture decisions, and finding relevant code sections. Traditional code search tools require exact keyword matches and don't understand context or intent.

**The Solution:** RepoLens uses advanced AI to create a semantic understanding of your entire codebase. Ask questions like "How does authentication work?" or "What are the main API endpoints?" and get instant, accurate answers with source code references. It's like having an expert developer who has already read and understood every line of code.

**How It Works:** Paste any public GitHub repository URL, and RepoLens clones it, intelligently chunks the code, generates semantic embeddings using HuggingFace transformers, and stores them in a ChromaDB vector database. When you ask a question, it retrieves the most relevant code sections and uses IBM's Granite language models via watsonx.ai to generate detailed, contextual answers with source citations—all streamed to you in real-time.

---

## ✨ Key Features

- **🤖 Natural Language Chat** - Ask questions about any GitHub repository in plain English and get intelligent, context-aware answers
- **⚡ Real-Time Streaming** - Responses stream token-by-token using Server-Sent Events (SSE) for instant feedback
- **🗺️ Interactive Mind Map** - Visualize your entire repository structure with an interactive, zoomable mind map featuring pan, zoom, expand/collapse controls
- **📊 Code Health Dashboard** - Analyze your codebase with language breakdown charts, file statistics, and top directory insights
- **🌲 Smart File Tree** - Browse repository files with click-to-explain functionality—click any file to get an AI explanation of its purpose
- **💡 Suggested Questions** - Smart question chips help you get started with relevant queries about your codebase
- **📝 Auto-Summary on Ingestion** - Automatically generates a comprehensive repository overview after ingestion completes
- **🔍 RAG Pipeline** - Retrieval-Augmented Generation with ChromaDB vector store ensures accurate, source-backed answers
- **📚 Source Citations** - Every answer includes references to the specific files used, with relevance scoring
- **🎨 Material Design 3** - Beautiful, modern UI with 3D depth effects, smooth animations, and dark mode support
- **⚙️ Optimized Performance** - Query caching, vectorstore pooling, adaptive polling, and code splitting for blazing-fast responses

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Python 3.11+, FastAPI, LangChain, ChromaDB, ibm-watsonx-ai, HuggingFace Transformers |
| **Frontend** | Next.js 16, React 19, TypeScript, Framer Motion, Material UI, Tailwind CSS |
| **AI Engine** | IBM watsonx.ai (Granite 4 H Small), HuggingFace Embeddings (all-MiniLM-L6-v2) |
| **Vector Store** | ChromaDB with HNSW indexing for fast similarity search |
| **Package Management** | uv (Python), npm (Node.js) |

---

## Now I'll create a comprehensive, professional README.md based on the actual codebase I've analyzed.

<write_to_file>
<path>README.md</path>
<content># RepoLens 🔍

**Chat with your codebase using AI-powered natural language understanding**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![watsonx.ai](https://img.shields.io/badge/watsonx.ai-Granite-purple.svg)](https://www.ibm.com/watsonx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

RepoLens transforms how developers understand and navigate unfamiliar codebases. Instead of spending hours reading through files, documentation, and code comments, simply paste a GitHub repository URL and ask questions in natural language.

**The Problem:** Developers waste countless hours trying to understand new codebases—tracing function calls, understanding architecture decisions, and finding relevant code sections. Traditional code search tools require exact keyword matches and don't understand context or intent.

**The Solution:** RepoLens uses advanced AI to create a semantic understanding of your entire codebase. Ask questions like "How does authentication work?" or "What are the main API endpoints?" and get instant, accurate answers with source code references. It's like having an expert developer who has already read and understood every line of code.

**How It Works:** Paste any public GitHub repository URL, and RepoLens clones it, intelligently chunks the code, generates semantic embeddings using HuggingFace transformers, and stores them in a ChromaDB vector database. When you ask a question, it retrieves the most relevant code sections and uses IBM's Granite language models via watsonx.ai to generate detailed, contextual answers with source citations—all streamed to you in real-time.

---

## ✨ Key Features

- **🤖 Natural Language Chat** - Ask questions about any GitHub repository in plain English and get intelligent, context-aware answers
- **⚡ Real-Time Streaming** - Responses stream token-by-token using Server-Sent Events (SSE) for instant feedback
- **🗺️ Interactive Mind Map** - Visualize your entire repository structure with an interactive, zoomable mind map featuring pan, zoom, expand/collapse controls
- **📊 Code Health Dashboard** - Analyze your codebase with language breakdown charts, file statistics, and top directory insights
- **🌲 Smart File Tree** - Browse repository files with click-to-explain functionality—click any file to get an AI explanation of its purpose
- **💡 Suggested Questions** - Smart question chips help you get started with relevant queries about your codebase
- **📝 Auto-Summary on Ingestion** - Automatically generates a comprehensive repository overview after ingestion completes
- **🔍 RAG Pipeline** - Retrieval-Augmented Generation with ChromaDB vector store ensures accurate, source-backed answers
- **📚 Source Citations** - Every answer includes references to the specific files used, with relevance scoring
- **🎨 Material Design 3** - Beautiful, modern UI with 3D depth effects, smooth animations, and dark mode support
- **⚙️ Optimized Performance** - Query caching, vectorstore pooling, adaptive polling, and code splitting for blazing-fast responses

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Python 3.11+, FastAPI, LangChain, ChromaDB, ibm-watsonx-ai, HuggingFace Transformers |
| **Frontend** | Next.js 16, React 19, TypeScript, Framer Motion, Material UI, Tailwind CSS |
| **AI Engine** | IBM watsonx.ai (Granite 4 H Small), HuggingFace Embeddings (all-MiniLM-L6-v2) |
| **Vector Store** | ChromaDB with HNSW indexing for fast similarity search |
| **Package Management** | uv (Python), npm (Node.js) |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A[User] -->|Paste GitHub URL| B[Next.js Frontend]
    B -->|Ingest Request| C[FastAPI Backend]
    C -->|Clone Repository| D[Git]
    D -->|Filter & Chunk| E[LangChain Document Loaders]
    E -->|Generate Embeddings| F[HuggingFace Transformers]
    F -->|Store Vectors| G[ChromaDB]
    G -->|Vector Store| C

    A -->|Ask Question| B
    B -->|Query Request| C
    C -->|Retrieve Relevant Chunks| G
    G -->|Top-K Documents| C
    C -->|Build Prompt| H[LangChain Prompt Template]
    H -->|Generate Answer| I[watsonx.ai Granite LLM]
    I -->|Stream Response| B
    B -->|Display Answer| A
```

**Key Components:**
1. **Ingestion Pipeline** - Clones repositories, filters relevant files, chunks code, generates embeddings, and stores in ChromaDB
2. **Query Pipeline** - Retrieves relevant code chunks, builds structured prompts, generates answers with Granite LLM
3. **Streaming Interface** - Real-time token streaming via Server-Sent Events (SSE)
4. **Visualization Layer** - Interactive mind maps, file trees, and code health dashboards

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- uv (Python package manager)
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd repolens-backend

# Copy environment variables template
cp .env.example .env

# Edit .env with your watsonx.ai credentials
nano .env

# Install dependencies using uv
uv sync

# Start the FastAPI server
uv run uvicorn main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd repolens-frontend

# Copy environment variables template
cp .env.example .env.local

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

### Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|-----------|-------------|----------|
| `WATSONX_API_KEY` | IBM watsonx.ai API key | ✅ |
| `WATSONX_PROJECT_ID` | watsonx.ai project ID | ✅ |
| `WATSONX_URL` | watsonx.ai service URL (default: `https://us-south.ml.cloud.ibm.com`) | ❌ |
| `ENVIRONMENT` | Application environment (default: `development`) | ❌ |
| `DEBUG` | Debug mode (default: `true`) | ❌ |
| `HOST` | Server host (default: `0.0.0.0`) | ❌ |
| `PORT` | Server port (default: `8000`) | ❌ |
| `DATA_DIR` | Data storage directory (default: `./data`) | ❌ |
| `HF_TOKEN` | HuggingFace token (optional) | ❌ |

### Frontend (.env.local)
| Variable | Description | Required |
|-----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `http://localhost:8000`) | ❌ |

---

## 📡 API Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/health` | GET | Health check | `HealthResponse` |
| `/api/ingest` | POST | Ingest a GitHub repository | `IngestResponse` |
| `/api/ingest/{repo_id}/status` | GET | Get ingestion status | `IngestionStatus` |
| `/api/ingest/{repo_id}/files` | GET | List all files in repository | `List[file_paths]` |
| `/api/ingest/{repo_id}/stats` | GET | Code health statistics | `RepoStats` |
| `/api/ingest/{repo_id}/structure` | GET | Repository structure for mind map | `RepoStructure` |
| `/api/query` | POST | Query repository (non-streaming) | `QueryResponse` |
| `/api/query/stream` | POST | Query repository (streaming SSE) | `Stream[token]` |

---

## 📁 Project Structure

```
repolens/
├── repolens-backend/          # FastAPI backend
│   ├── app/                   # Application code
│   │   ├── api/               # API routes
│   │   ├── services/          # Business logic
│   │   ├── config.py          # Configuration
│   │   ├── models.py          # Pydantic models
│   │   └── rag.py             # RAG pipeline
│   ├── main.py                # FastAPI entry point
│   └── pyproject.toml         # Python dependencies
│
└── repolens-frontend/         # Next.js frontend
    ├── app/                   # Next.js app router
    │   └── page.tsx           # Main page
    ├── components/            # React components
    │   ├── ChatInterface3D.tsx # 3D chat interface
    │   ├── FileTree.tsx        # Interactive file tree
    │   ├── MindMapVisualization.tsx # Mind map visualization
    │   └── CodeHealthDashboard.tsx # Code health stats
    ├── services/              # API service layer
    │   └── api.ts             # API client
    └── types/                  # TypeScript types
```

---

## 🤖 IBM watsonx.ai Integration

RepoLens leverages IBM's enterprise-grade watsonx.ai platform with these key features:

1. **Granite 4 H Small Model** - Uses the `ibm/granite-4-h-small` model, optimized for code understanding and detailed technical explanations
2. **IAM Token Management** - Automatically handles token refresh (tokens expire every 60 minutes) through the LangChain WatsonxLLM client
3. **Optimized Parameters** - Configured with:
   - `max_new_tokens=1500` for detailed answers
   - `temperature=0.2` for precise, factual responses
   - Custom stop sequences to prevent hallucinated follow-ups
4. **Structured Prompting** - Uses a carefully designed prompt template that instructs the model to:
   - Provide concise summaries first
   - Reference specific file paths and code patterns
   - Explain connections between different code sections
   - Avoid inventing non-existent code

The backend automatically refreshes IAM tokens as needed, ensuring uninterrupted service even during long sessions.

---

## 🤖 Built with IBM Bob

RepoLens was developed with **IBM Bob** as an AI pair programmer throughout the entire development process:

**Architecture & Design:**
- Collaborated on the core RAG pipeline architecture
- Designed the streaming response system with Server-Sent Events
- Optimized the vectorstore caching and connection pooling
- Implemented adaptive polling for ingestion status

**Backend Development:**
- Built the FastAPI service layer with proper error handling
- Implemented the LangChain integration with watsonx.ai
- Created the document chunking and embedding pipeline
- Developed the query caching system for performance

**Frontend Development:**
- Designed the Material 3D UI components
- Implemented the interactive mind map visualization
- Built the real-time chat interface with streaming support
- Created the code health dashboard with dynamic charts

**Debugging & Optimization:**
- Fixed critical issues like SSE compression conflicts
- Optimized the ingestion pipeline for large repositories
- Implemented proper cleanup of temporary files
- Added comprehensive error handling throughout

**Documentation:**
- Generated API documentation and type definitions
- Created the project structure documentation
- Wrote the environment variable reference
- Developed the getting started guide

IBM Bob significantly accelerated development by:
- Reducing boilerplate code
- Suggesting optimal patterns and libraries
- Identifying potential issues early
- Maintaining consistent code style
- Generating comprehensive documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

For questions or feedback, please contact the project maintainers.

**Built with ❤️ using IBM watsonx.ai and Material Design 3**
</content>
<line_count>250</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<user_edits>@@ -333,4 +333,4 @@
 
 For questions or feedback, please contact the project maintainers.
 
-**Built with ❤️ using IBM watsonx.ai and Material Design 3**
\ No newline at end of file
+**Built with ❤️ using IBM watsonx.ai and Material Design 3**
</user_edits>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
<i>If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T15:49:24.877Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.26

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
✅ **Professional README.md Generated Successfully**

I've created a comprehensive, production-ready README.md for RepoLens with all requested sections:

**✨ Key Highlights:**

1. **Hero Section** - Project name, tagline, and 4 professional badges (Python, Next.js, watsonx.ai, MIT License)

2. **Overview** - 3 detailed paragraphs explaining the problem (developers wasting hours), the solution (AI-powered semantic understanding), and how it works (GitHub URL → embeddings → RAG → streaming answers)

3. **Key Features** - 11 major features with emojis:
   - Natural language chat, real-time streaming, interactive mind map
   - Code health dashboard, smart file tree, suggested questions
   - Auto-summary, RAG pipeline, source citations, Material Design 3, optimized performance

4. **Tech Stack** - Clean table with actual technologies from the codebase:
   - Backend: Python, FastAPI, LangChain, ChromaDB, ibm-watsonx-ai, HuggingFace
   - Frontend: Next.js 16, React 19, Framer Motion, Material UI
   - AI: IBM watsonx.ai Granite 4 H Small, HuggingFace embeddings

5. **Architecture** - Mermaid diagram showing the complete flow from user input through ingestion and query pipelines

6. **Getting Started** - Step-by-step setup for both backend and frontend with actual commands

7. **Environment Variables** - Complete tables for both `.env` and `.env.local` with descriptions and required flags

8. **API Endpoints** - All 8 endpoints documented with methods and response types

9. **Project Structure** - Tree view showing actual directory layout from both backend and frontend

10. **IBM watsonx.ai Integration** - Detailed explanation of Granite model usage, IAM token management, and prompt engineering

11. **Built with IBM Bob** - Comprehensive section detailing how Bob assisted with architecture, development, debugging, and documentation

12. **License** - MIT License reference

All content is based on actual code analysis—no placeholders. The README is professional, well-structured, and ready for a top-tier open source project.
</result>
</attempt_completion>

