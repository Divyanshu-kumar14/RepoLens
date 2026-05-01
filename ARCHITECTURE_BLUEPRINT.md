# RepoLens - Chat with Your Codebase

---

## Executive Summary

RepoLens is a stripped-down "Chat With Your Codebase" application focused on the absolute essentials:

1. Ingest a public GitHub repository
2. Chunk and embed the code
3. Answer natural language questions using watsonx.ai Granite

**NO enterprise features. NO complex parsers. NO caching. NO auth. NO tests (initially).**

---

## 1. Minimal Folder Structure

### Root Directory

```
RepoLens/
├── repolens-backend/           # Python FastAPI backend
├── repolens-frontend/          # React frontend (OPTIONAL - CLI first)
├── bob_sessions/               # Hackathon compliance
├── .env.example
├── AGENTS.md
└── README.md
```

### Backend Structure (LEAN)

```
repolens-backend/
├── main.py                     # FastAPI app entry point
├── pyproject.toml             # uv dependencies
├── .env                       # Environment variables
│
├── app/
│   ├── __init__.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py          # ALL endpoints in ONE file
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ingestion.py       # Repository ingestion logic
│   │   └── query.py           # Query processing logic
│   │
│   ├── models.py              # Pydantic models (all in one file)
│   ├── config.py              # Configuration
│   └── rag.py                 # RAG pipeline (all in one file)
│
└── data/
    ├── repositories/          # Cloned repos
    └── chromadb/             # Vector storage
```

### Frontend Structure (PHASE 2 - Start with CLI)

```
repolens-frontend/
├── package.json
├── next.config.js
│
└── src/
    ├── app/
    │   ├── page.tsx           # Single page app
    │   └── layout.tsx
    │
    ├── components/
    │   ├── RepoInput.tsx      # URL input
    │   ├── ChatBox.tsx        # Chat interface
    │   └── MessageList.tsx    # Display messages
    │
    └── services/
        └── api.ts             # API calls
```

---

## 2. Essential Dependencies ONLY

### Backend (pyproject.toml)

```toml
[project]
name = "repolens-backend"
version = "0.1.0"
requires-python = ">=3.11"

dependencies = [
    # Web Framework
    "fastapi>=0.109.0",
    "uvicorn[standard]>=0.27.0",
    "pydantic>=2.5.0",
    "pydantic-settings>=2.1.0",
    "python-multipart>=0.0.6",

    # LangChain & AI
    "langchain>=0.1.0",
    "langchain-community>=0.0.13",
    "ibm-watsonx-ai>=0.2.0",
    "ibm-cloud-sdk-core>=3.18.0",

    # Vector Store
    "chromadb>=0.4.22",

    # Git Operations
    "gitpython>=3.1.41",

    # Utilities
    "python-dotenv>=1.0.0",
    "httpx>=0.26.0",
]
```

**Total: 13 packages. That's it.**

### Frontend (package.json) - PHASE 2

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  }
}
```

---

## 3. Repository Ingestion Flow (SIMPLIFIED)

### The Happy Path

```
GitHub URL → LangChain GitLoader → Text Splitter →
Embed with watsonx.ai → Store in ChromaDB → Done
```

### Implementation Steps

**Step 1: Accept GitHub URL**

- Single POST endpoint: `/api/ingest`
- Input: `{"repo_url": "https://github.com/user/repo"}`
- No validation beyond basic URL check

**Step 2: Clone with LangChain GitLoader**

```python
from langchain_community.document_loaders import GitLoader

loader = GitLoader(
    clone_url=repo_url,
    repo_path=f"./data/repositories/{repo_id}",
    branch="main"
)
documents = loader.load()
```

**Step 3: Split Documents**

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)
chunks = splitter.split_documents(documents)
```

**Step 4: Embed with watsonx.ai**

```python
from langchain_ibm import WatsonxEmbeddings

embeddings = WatsonxEmbeddings(
    model_id="ibm/slate-125m-english-rtrvr",
    url="https://us-south.ml.cloud.ibm.com",
    apikey=WATSONX_API_KEY,
    project_id=WATSONX_PROJECT_ID
)
```

**Step 5: Store in ChromaDB**

```python
from langchain_community.vectorstores import Chroma

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=f"./data/chromadb/{repo_id}"
)
```

**That's it. No custom parsers. No tree-sitter. No metadata extraction.**

---

## 4. Query Processing Flow (SIMPLIFIED)

### The Happy Path

```
User Question → Embed Question →
ChromaDB Similarity Search → Build Prompt →
watsonx.ai Granite → Stream Response
```

### Implementation Steps

**Step 1: Accept Query**

- Single POST endpoint: `/api/query`
- Input: `{"repo_id": "uuid", "question": "How does auth work?"}`

**Step 2: Retrieve Context**

```python
# Load existing vectorstore
vectorstore = Chroma(
    persist_directory=f"./data/chromadb/{repo_id}",
    embedding_function=embeddings
)

# Similarity search
docs = vectorstore.similarity_search(question, k=5)
context = "\n\n".join([doc.page_content for doc in docs])
```

**Step 3: Build Simple Prompt**

```python
prompt = f"""You are a code assistant. Answer the question based on this code:

CODE CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""
```

**Step 4: Call watsonx.ai Granite**

```python
from langchain_ibm import WatsonxLLM

llm = WatsonxLLM(
    model_id="ibm/granite-3-8b-instruct",
    url="https://us-south.ml.cloud.ibm.com",
    apikey=WATSONX_API_KEY,
    project_id=WATSONX_PROJECT_ID,
    params={
        "max_new_tokens": 1000,
        "temperature": 0.3,
    }
)

response = llm.invoke(prompt)
```

**Step 5: Return Response**

```python
return {"answer": response, "sources": [doc.metadata for doc in docs]}
```

**No streaming initially. No caching. No re-ranking. Just works.**

---

## 5. API Endpoints (MINIMAL)

### Backend Routes (routes.py)

```python
# POST /api/ingest
# Body: {"repo_url": "https://github.com/user/repo"}
# Response: {"repo_id": "uuid", "status": "processing"}

# GET /api/ingest/{repo_id}/status
# Response: {"status": "completed|processing|failed", "progress": 75}

# POST /api/query
# Body: {"repo_id": "uuid", "question": "How does X work?"}
# Response: {"answer": "...", "sources": [...]}

# GET /api/health
# Response: {"status": "ok"}
```

**4 endpoints total. That's it.**

---

## 6. Configuration (.env)

```bash
# watsonx.ai (REQUIRED)
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Application
ENVIRONMENT=development
DEBUG=true
HOST=0.0.0.0
PORT=8000

# Storage
DATA_DIR=./data
```

**No Redis. No Sentry. No Prometheus. Just the essentials.**

---

## 7. Implementation Timeline (30 Hours)

### Hour 0-2: Setup

- [x] Create project structure
- [x] Set up uv environment
- [x] Install dependencies
- [x] Configure .env

### Hour 2-6: Backend Core

- [ ] Implement FastAPI app skeleton
- [ ] Create config.py with settings
- [ ] Set up watsonx.ai authentication
- [ ] Test IAM token generation

### Hour 6-12: Ingestion Pipeline

- [ ] Implement `/api/ingest` endpoint
- [ ] Integrate LangChain GitLoader
- [ ] Set up text splitting
- [ ] Configure watsonx.ai embeddings
- [ ] Set up ChromaDB storage
- [ ] Test with sample repo

### Hour 12-18: Query Pipeline

- [ ] Implement `/api/query` endpoint
- [ ] Build RAG chain with LangChain
- [ ] Test retrieval from ChromaDB
- [ ] Integrate Granite LLM
- [ ] Test end-to-end query flow

### Hour 18-24: Frontend (Basic)

- [ ] Create Next.js app
- [ ] Build repo input form
- [ ] Build chat interface
- [ ] Connect to backend API
- [ ] Test full flow

### Hour 24-28: Polish & Debug

- [ ] Fix critical bugs
- [ ] Add basic error handling
- [ ] Improve UI/UX
- [ ] Test with multiple repos
- [ ] Prepare demo script

### Hour 28-30: Demo Prep

- [ ] Create demo repository
- [ ] Write README
- [ ] Record demo video
- [ ] Final testing
- [ ] Submit

---

## 8. Critical Success Factors

### Must Have (Non-Negotiable)

1. ✅ Ingest a public GitHub repo
2. ✅ Store embeddings in ChromaDB
3. ✅ Answer questions using Granite
4. ✅ Working demo by Sunday 3 AM

### Nice to Have (If Time Permits)

- Basic error messages
- Loading indicators
- Multiple repo support
- Conversation history

### Explicitly OUT OF SCOPE

- ❌ Authentication/authorization
- ❌ Multi-user support
- ❌ Caching layers
- ❌ Complex code parsing (tree-sitter)
- ❌ Testing suite
- ❌ Monitoring/logging
- ❌ Docker deployment
- ❌ CI/CD pipeline
- ❌ Database for metadata
- ❌ WebSocket streaming
- ❌ Advanced chunking strategies
- ❌ Re-ranking algorithms
- ❌ Response caching

---

## 9. Risk Mitigation (Hackathon Edition)

### Risk 1: watsonx.ai API Issues

**Mitigation:** Test authentication FIRST. Keep API key handy. Have backup plan to use local embeddings if needed.

### Risk 2: Large Repository Timeout

**Mitigation:** Start with small repos (<100 files). Add timeout handling. Skip binary files.

### Risk 3: ChromaDB Issues

**Mitigation:** Test persistence early. Keep data directory backed up.

### Risk 4: Time Overrun

**Mitigation:** Build CLI version first. Frontend is Phase 2. Have working backend by Hour 18.

---

## 10. Demo Script (Sunday 3 AM)

### 2-Minute Demo Flow

1. **Show empty state:** "Here's RepoLens, a chat interface for codebases"
2. **Ingest repo:** Paste GitHub URL, click "Ingest" (show progress)
3. **Ask question 1:** "What does this repository do?"
4. **Ask question 2:** "How does the authentication work?"
5. **Show sources:** Highlight that answers reference actual code files
6. **Wrap up:** "Built with FastAPI, LangChain, watsonx.ai Granite, and ChromaDB"

### Backup Demo (If Live Demo Fails)

- Pre-recorded video
- Screenshots of working system
- Pre-ingested repository ready to query

---

## 11. File Structure Reference

### main.py (Entry Point)

```python
from fastapi import FastAPI
from app.api.routes import router
from app.config import settings

app = FastAPI(title="RepoLens MVP")
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### app/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    watsonx_api_key: str
    watsonx_project_id: str
    watsonx_url: str = "https://us-south.ml.cloud.ibm.com"
    data_dir: str = "./data"

    class Config:
        env_file = ".env"

settings = Settings()
```

### app/models.py

```python
from pydantic import BaseModel

class IngestRequest(BaseModel):
    repo_url: str

class IngestResponse(BaseModel):
    repo_id: str
    status: str

class QueryRequest(BaseModel):
    repo_id: str
    question: str

class QueryResponse(BaseModel):
    answer: str
    sources: list
```

### app/rag.py

```python
from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain_community.vectorstores import Chroma
from app.config import settings

def get_embeddings():
    return WatsonxEmbeddings(
        model_id="ibm/slate-125m-english-rtrvr",
        url=settings.watsonx_url,
        apikey=settings.watsonx_api_key,
        project_id=settings.watsonx_project_id
    )

def get_llm():
    return WatsonxLLM(
        model_id="ibm/granite-3-8b-instruct",
        url=settings.watsonx_url,
        apikey=settings.watsonx_api_key,
        project_id=settings.watsonx_project_id,
        params={"max_new_tokens": 1000, "temperature": 0.3}
    )
```

---

## 12. Success Metrics (Hackathon Edition)

### Demo Success Criteria

- ✅ Ingest completes in <2 minutes for small repo
- ✅ Query returns answer in <5 seconds
- ✅ Answer references actual code from repo
- ✅ UI is functional (even if ugly)
- ✅ No crashes during demo

### Judging Criteria Alignment

- **Innovation:** RAG pipeline for code understanding
- **Technical Implementation:** LangChain + watsonx.ai + ChromaDB
- **Completeness:** Working end-to-end demo
- **Presentation:** Clear demo script, working prototype

---

## Conclusion

This is a **30-hour hackathon MVP**, not an enterprise product. Every decision prioritizes:

1. **Speed:** Use existing tools (LangChain, ChromaDB)
2. **Simplicity:** One file per concern, minimal abstractions
3. **Reliability:** Happy path only, basic error handling
4. **Demo-ability:** Working prototype over perfect code

**The goal is a working demo by Sunday 3 AM. Nothing more, nothing less.**

---

## Quick Start Commands

```bash
# Backend setup
cd repolens-backend
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv pip install -e .

# Run backend
uv run uvicorn main:app --reload

# Frontend setup (Phase 2)
cd repolens-frontend
npm install
npm run dev
```

**Now go build it. Clock is ticking. ⏰**
