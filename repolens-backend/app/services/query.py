"""
Query Service
Handles question answering using RAG pipeline
"""
import logging
from typing import List, Dict, Any
from app.rag import get_embeddings, get_llm, get_vectorstore, build_prompt, clean_answer
from app.models import Source

logger = logging.getLogger(__name__)


def query_repository(repo_id: str, question: str) -> Dict[str, Any]:
    """
    Query a repository using the RAG pipeline.

    Steps:
    1. Load the ChromaDB vectorstore for the repository
    2. Perform similarity search to retrieve relevant code chunks
    3. Build a structured prompt with the retrieved context
    4. Generate a detailed answer using the LLM singleton
    5. Post-process the answer to remove LLM artefacts
    6. Return the answer with deduplicated source file references

    Args:
        repo_id:  Repository identifier
        question: User's natural language question

    Returns:
        Dictionary with keys: answer (str), sources (list[Source]), repo_id (str)
    """
    try:
        logger.info(f"Processing query for repo {repo_id}: {question!r}")

        # Step 1: Load vectorstore (fast — Chroma reads from disk)
        embeddings = get_embeddings()
        vectorstore = get_vectorstore(repo_id, embeddings)

        # Step 2: Retrieve top-k most relevant chunks
        # k=6 gives more context than k=5 without blowing up the prompt window
        logger.info("Performing similarity search")
        docs = vectorstore.similarity_search(question, k=6)

        if not docs:
            logger.warning("No relevant documents found for query")
            return {
                "answer": (
                    "I couldn't find relevant information in the repository "
                    "to answer your question. Try rephrasing or asking about "
                    "a specific file or function."
                ),
                "sources": [],
                "repo_id": repo_id,
            }

        # Step 3: Build context string and structured prompt
        # Each chunk is prefixed with its source path so the LLM can reference it
        context_parts = []
        for doc in docs:
            source_path = doc.metadata.get("source", "unknown")
            context_parts.append(f"# File: {source_path}\n{doc.page_content}")
        context = "\n\n---\n\n".join(context_parts)

        prompt = build_prompt(context, question)

        # Step 4: Generate answer (uses LLM singleton — no re-init overhead)
        logger.info("Generating answer with LLM")
        llm = get_llm()
        raw_answer = llm.invoke(prompt)

        # Step 5: Clean the raw LLM output
        answer = clean_answer(raw_answer)

        # Step 6: Collect deduplicated source references
        seen_paths: set = set()
        sources: List[Source] = []
        for doc in docs:
            path = doc.metadata.get("source", "unknown")
            if path not in seen_paths:
                seen_paths.add(path)
                sources.append(Source(file_path=path, content=None))

        logger.info(
            f"Query completed for repo {repo_id} — "
            f"{len(docs)} chunks retrieved, {len(sources)} unique sources"
        )

        return {
            "answer": answer,
            "sources": sources,
            "repo_id": repo_id,
        }

    except Exception as e:
        logger.error(f"Query failed for repo {repo_id}: {e}", exc_info=True)
        raise

# Made with Bob
