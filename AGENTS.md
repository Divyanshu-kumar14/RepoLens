# AGENTS.md

This file provides strict guidance to IBM Bob when working with the RepoLens repository.

## Project Overview: RepoLens

RepoLens is a "Chat With Your Codebase" web application.

- **Backend:** Python / FastAPI

- **Frontend:** React / Next.js

- **AI Engine:** LangChain integrated with watsonx.ai (IBM Granite models).

- **Core Loop:** Ingest a Git repository, chunk the code, vectorize it, and allow natural language querying via a RAG pipeline.

## 🛑 CRITICAL CORE RULE: Package Management

This project STRICTLY uses `uv` for all Python dependency management.

- DO NOT ever suggest, write, or execute `pip install`, `poetry`, or `conda`.
- To add a package: `uv add <package_name>`
- To run a script: `uv run <script.py>`

## Timeline Constraint: The hard deadline is Sunday 3:00 AM. Reject any complex architecture, boilerplate, or feature creep that jeopardizes completing a basic, functional demo by this deadline. Prioritize speed and simplicity.

## Commands

- **Backend Dev Server:** `uv run uvicorn main:app --reload`

- **Exporting Dependencies (for judging):** `uv pip compile pyproject.toml -o requirements.txt`

## Code Style & API Patterns

- **No Hallucinated LLMs:** The backend MUST use `ibm-watsonx-ai` via LangChain. Do not write boilerplate for OpenAI, Anthropic, or standard HuggingFace endpoints.

- **Model Configuration:** Issue #15 Fix - Currently using `ibm/granite-4-h-small` as `granite-3-8b-instruct` is not available in this watsonx.ai environment. The WatsonxLLM client handles IAM token refresh automatically when initialized with `apikey`.

- **Authentication Gotcha:** The watsonx.ai API requires trading an API key for an **IAM Access Token**. This token expires every 60 minutes. The WatsonxLLM client handles this refresh logic automatically; do not hardcode a static token.

## Directory Structure & Compliance

- **Backend Logic:** Keep all API routes and LangChain setup inside a `/repolens-backend` directory.

- **Frontend Logic:** Keep all React code inside a `/repolens-frontend` directory.
