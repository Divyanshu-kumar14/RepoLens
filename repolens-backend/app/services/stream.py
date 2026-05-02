"""
Streaming Query Service
Handles token-by-token SSE streaming for the /api/query/stream endpoint.
Uses WatsonxLLM.stream() via LangChain's streaming interface.

Threading note: LangChain's WatsonxLLM.stream() and .invoke() are synchronous
(blocking). We run them in asyncio.to_thread() so the FastAPI event loop is
never blocked, allowing concurrent requests to be served while one is streaming.
"""
import asyncio
import json
import logging
from typing import AsyncGenerator
from app.rag import get_embeddings, get_llm, get_vectorstore, build_prompt, clean_answer

logger = logging.getLogger(__name__)


def _retrieve_docs(repo_id: str, question: str):
    """
    Synchronous retrieval step — runs in a thread pool.
    Returns (docs, context, prompt).
    """
    embeddings = get_embeddings()
    vectorstore = get_vectorstore(repo_id, embeddings)

    try:
        docs_with_scores = vectorstore.similarity_search_with_relevance_scores(question, k=10)
        docs = [doc for doc, score in docs_with_scores if score >= 0.5]
        if len(docs) < 3:
            docs = vectorstore.similarity_search(question, k=3)
        elif len(docs) > 6:
            docs = docs[:6]
    except Exception:
        docs = vectorstore.similarity_search(question, k=6)

    return docs


def _invoke_llm(prompt: str) -> str:
    """Synchronous LLM invocation — runs in a thread pool."""
    llm = get_llm()
    return llm.invoke(prompt)


def _stream_llm(prompt: str):
    """
    Synchronous LLM streaming — collects all chunks synchronously.
    Returns a list of chunk strings. Runs in a thread pool.
    """
    llm = get_llm()
    chunks = []
    for chunk in llm.stream(prompt):
        if chunk:
            chunks.append(chunk)
    return chunks


async def stream_query_repository(repo_id: str, question: str) -> AsyncGenerator[str, None]:
    """
    Stream an answer token-by-token as Server-Sent Events.

    Yields SSE-formatted strings:
      data: {"token": "..."}\\n\\n   — for each token chunk
      data: {"sources": [...]}\\n\\n  — final message with source list
      data: [DONE]\\n\\n             — signals end of stream

    Args:
        repo_id:  Repository identifier
        question: User's natural language question
    """
    try:
        # Step 1: Retrieve relevant docs (sync I/O → thread pool)
        docs = await asyncio.to_thread(_retrieve_docs, repo_id, question)

        if not docs:
            yield f"data: {json.dumps({'token': 'I could not find relevant information in this repository to answer your question.'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        # Step 2: Build prompt
        context_parts = []
        for doc in docs:
            source_path = doc.metadata.get("source", "unknown")
            context_parts.append(f"# File: {source_path}\n{doc.page_content}")
        context = "\n\n---\n\n".join(context_parts)
        prompt = build_prompt(context, question)

        # Step 3: Stream tokens (sync LLM call → thread pool)
        logger.info(f"Streaming response for repo {repo_id}")

        try:
            # Collect all chunks from the sync streaming call
            chunks = await asyncio.to_thread(_stream_llm, prompt)
            for chunk in chunks:
                yield f"data: {json.dumps({'token': chunk})}\n\n"
        except Exception as stream_err:
            # Fallback: invoke synchronously and fake-stream in chunks
            logger.warning(f"Streaming failed, falling back to chunked fake-stream: {stream_err}")
            raw = await asyncio.to_thread(_invoke_llm, prompt)
            answer = clean_answer(raw)
            chunk_size = 15
            for i in range(0, len(answer), chunk_size):
                chunk = answer[i: i + chunk_size]
                yield f"data: {json.dumps({'token': chunk})}\n\n"

        # Step 4: Send sources as final event
        seen: set = set()
        sources = []
        for doc in docs:
            path = doc.metadata.get("source", "unknown")
            if path not in seen:
                seen.add(path)
                sources.append({"file_path": path})

        yield f"data: {json.dumps({'sources': sources})}\n\n"
        yield "data: [DONE]\n\n"
        logger.info(f"Stream complete for repo {repo_id} — {len(sources)} sources")

    except Exception as e:
        logger.error(f"Stream query failed for repo {repo_id}: {e}", exc_info=True)
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        yield "data: [DONE]\n\n"

# Made with Bob
