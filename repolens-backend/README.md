# RepoLens Backend

FastAPI backend for RepoLens - Chat with your codebase using watsonx.ai Granite.

## Features

- 🔄 Ingest GitHub repositories
- 🧠 RAG pipeline with LangChain
- 🤖 watsonx.ai Granite 3 8B Instruct
- 📦 ChromaDB vector storage
- ⚡ FastAPI async endpoints

## Prerequisites

- Python 3.11+
- `uv` package manager
- watsonx.ai API credentials

## Quick Start

### 1. Install Dependencies

```bash
cd repolens-backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### 3. Run the Server

```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```bash
GET /api/health
```

### Ingest Repository

```bash
POST /api/ingest
Content-Type: application/json

{
  "repo_url": "https://github.com/user/repo"
}
```

### Check Ingestion Status

```bash
GET /api/ingest/{repo_id}/status
```

### Query Repository

```bash
POST /api/query
Content-Type: application/json

{
  "repo_id": "uuid",
  "question": "How does authentication work?"
}
```

## Project Structure

```
repolens-backend/
├── main.py                 # FastAPI entry point
├── pyproject.toml         # Dependencies
├── .env                   # Environment variables
│
├── app/
│   ├── config.py          # Configuration
│   ├── models.py          # Pydantic models
│   ├── rag.py             # RAG pipeline
│   │
│   ├── api/
│   │   └── routes.py      # API endpoints
│   │
│   └── services/
│       ├── ingestion.py   # Repository ingestion
│       └── query.py       # Query processing
│
└── data/
    ├── repositories/      # Cloned repos
    └── chromadb/         # Vector storage
```

## Development

### View API Documentation

Once the server is running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Export Dependencies

For deployment or judging:

```bash
uv pip compile pyproject.toml -o requirements.txt
```

## Technology Stack

- **Framework**: FastAPI
- **AI/ML**: LangChain, watsonx.ai (IBM Granite)
- **Vector Store**: ChromaDB
- **Git Operations**: GitPython
- **Package Manager**: uv

## Notes

- This is a hackathon MVP - focused on core functionality
- No authentication/authorization
- In-memory status tracking (not persistent)
- Designed for small to medium repositories
- Uses watsonx.ai Granite 3 8B Instruct model

## Troubleshooting

### Import Errors

The import errors in the IDE are expected until dependencies are installed. Run:

```bash
uv pip install -e .
```

### watsonx.ai Authentication

Ensure your API key and project ID are correct in `.env`. The API uses IAM token authentication which refreshes automatically.

### Repository Cloning Issues

- Ensure the GitHub URL is public
- Check network connectivity
- Try with a smaller repository first

## License

MIT License - See LICENSE file for details
