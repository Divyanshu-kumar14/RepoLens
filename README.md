# 🔍 RepoLens - Chat with Your Codebase

AI-powered codebase analysis using watsonx.ai Granite, LangChain, and ChromaDB.

## Overview

RepoLens allows you to have natural language conversations with any public GitHub repository. Simply provide a repository URL, and RepoLens will:

1. **Clone and analyze** the repository
2. **Chunk and embed** the code using watsonx.ai
3. **Store embeddings** in ChromaDB for fast retrieval
4. **Answer questions** using IBM Granite LLM with RAG (Retrieval-Augmented Generation)

## 🎯 Features

✅ **GitHub Repository Ingestion** - Automatically clone and process any public repo  
✅ **Real-time Progress Tracking** - Visual feedback during ingestion  
✅ **Natural Language Queries** - Ask questions in plain English  
✅ **Source Code References** - Answers include file paths and context  
✅ **Powered by watsonx.ai** - Uses IBM Granite 3-8B-Instruct model  
✅ **Fast Vector Search** - ChromaDB for efficient code retrieval

## 🏗️ Architecture

```
┌─────────────────┐
│  Next.js        │
│  Frontend       │
│  (Port 3000)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐      ┌──────────────┐
│  FastAPI        │◄────►│  ChromaDB    │
│  Backend        │      │  Vector DB   │
│  (Port 8000)    │      └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  watsonx.ai     │
│  Granite LLM    │
│  + Embeddings   │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** with `uv` package manager
- **Node.js 18+** and npm
- **watsonx.ai API Key** and Project ID
- **Git** installed

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd RepoLens
```

### 2. Backend Setup

```bash
cd repolens-backend

# Create .env file
cp .env.example .env
# Edit .env and add your watsonx.ai credentials

# Install dependencies with uv
uv sync

# Run the backend
uv run uvicorn main:app --reload
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd repolens-frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env.local

# Run the frontend
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Use RepoLens

1. Open `http://localhost:3000` in your browser
2. Enter a GitHub repository URL (e.g., `https://github.com/user/repo`)
3. Click "Ingest" and wait for processing to complete
4. Ask questions about the codebase!

## 📁 Project Structure

```
RepoLens/
├── repolens-backend/          # Python FastAPI backend
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── services/         # Business logic
│   │   ├── config.py         # Configuration
│   │   ├── models.py         # Pydantic models
│   │   └── rag.py            # RAG pipeline
│   ├── data/                 # Cloned repos & vector DB
│   ├── main.py               # FastAPI entry point
│   └── pyproject.toml        # Python dependencies
│
├── repolens-frontend/         # Next.js React frontend
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── services/             # API service layer
│   ├── types/                # TypeScript types
│   └── package.json          # Node dependencies
│
├── bob_sessions/             # Hackathon compliance
├── ARCHITECTURE_BLUEPRINT.md # Detailed architecture
└── README.md                 # This file
```

## 🔧 Configuration

### Backend Environment Variables

Create `repolens-backend/.env`:

```bash
# watsonx.ai Configuration (REQUIRED)
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Application Settings
ENVIRONMENT=development
DEBUG=true
HOST=0.0.0.0
PORT=8000
DATA_DIR=./data
```

### Frontend Environment Variables

Create `repolens-frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | `/api/ingest`                  | Submit repository for ingestion |
| GET    | `/api/ingest/{repo_id}/status` | Check ingestion progress        |
| POST   | `/api/query`                   | Ask questions about repository  |
| GET    | `/api/health`                  | Health check                    |

## 💡 Example Usage

### Example Questions

Once a repository is ingested, try asking:

- "What does this repository do?"
- "How does the authentication work?"
- "Explain the main components of this project"
- "What dependencies does this project use?"
- "How is error handling implemented?"
- "Show me the API endpoints"

### Example Repositories to Try

- Small projects (< 100 files) work best for demos
- Public repositories only
- Examples:
  - `https://github.com/user/small-flask-app`
  - `https://github.com/user/simple-react-app`

## 🛠️ Technology Stack

### Backend

- **FastAPI** - Modern Python web framework
- **LangChain** - LLM orchestration framework
- **watsonx.ai** - IBM Granite LLM and embeddings
- **ChromaDB** - Vector database for embeddings
- **GitPython** - Git repository operations

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ImportError: No module named 'app'`

```bash
cd repolens-backend
uv sync
```

**Problem:** `watsonx.ai authentication failed`

- Verify API key and project ID in `.env`
- Check that credentials are valid in watsonx.ai console

**Problem:** `ChromaDB persistence error`

```bash
rm -rf repolens-backend/data/chromadb/*
```

### Frontend Issues

**Problem:** `Cannot connect to backend`

- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled in backend

**Problem:** `Module not found errors`

```bash
cd repolens-frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development

### Running Tests

Backend:

```bash
cd repolens-backend
uv run pytest
```

Frontend:

```bash
cd repolens-frontend
npm test
```

### Code Quality

Backend:

```bash
cd repolens-backend
uv run ruff check .
uv run black .
```

Frontend:

```bash
cd repolens-frontend
npm run lint
```

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Use production WSGI server (Gunicorn)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or custom server
3. Update `NEXT_PUBLIC_API_URL` to production backend

## 📄 License

See LICENSE file for details.

## 🙏 Acknowledgments

- **IBM watsonx.ai** - For providing the Granite LLM and embeddings
- **LangChain** - For the RAG framework
- **ChromaDB** - For vector storage
- **FastAPI** - For the backend framework
- **Next.js** - For the frontend framework

## 📞 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review API documentation at `/docs`
3. Check backend logs for detailed error messages

---

**Built for IBM watsonx.ai Hackathon**  
**Made with Bob - AI Coding Assistant**

## 🎯 Hackathon Compliance

This project includes:

- ✅ `bob_sessions/` directory with session logs
- ✅ `AGENTS.md` with agent rules
- ✅ Complete source code
- ✅ Documentation and README
- ✅ Working demo

**Demo Video:** [Link to demo video]  
**Live Demo:** [Link to deployed app]
