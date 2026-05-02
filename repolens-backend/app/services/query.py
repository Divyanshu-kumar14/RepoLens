"""
Query Service
Handles question answering using RAG pipeline
"""
import logging
import time
from hashlib import sha256
from typing import List, Dict, Any, Tuple
from app.rag import get_embeddings, get_llm, get_vectorstore, build_prompt, clean_answer
from app.models import Source

logger = logging.getLogger(__name__)

# Query result cache with TTL (Issue #3: Query Caching)
_query_cache: Dict[str, Tuple[Dict[str, Any], float]] = {}
_CACHE_TTL = 3600  # 1 hour cache


def get_cache_key(repo_id: str, question: str) -> str:
    """Generate cache key from repo_id and question"""
    return sha256(f"{repo_id}:{question.lower().strip()}".encode()).hexdigest()


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
    # Check cache first (Issue #3: Query Caching)
    cache_key = get_cache_key(repo_id, question)
    if cache_key in _query_cache:
        cached_result, timestamp = _query_cache[cache_key]
        if time.time() - timestamp < _CACHE_TTL:
            logger.info(f"Cache hit for query: {question[:50]}...")
            return cached_result
        else:
            # Expired, remove from cache
            del _query_cache[cache_key]
    
    try:
        logger.info(f"Processing query for repo {repo_id}: {question!r}")

        # Step 1: Load vectorstore (fast — Chroma reads from disk)
        embeddings = get_embeddings()
        vectorstore = get_vectorstore(repo_id, embeddings)

        # Step 2: Retrieve top-k most relevant chunks with relevance filtering (Issue #4)
        logger.info("Performing optimized similarity search with relevance scores")
        try:
            # Try similarity search with relevance scores
            docs_with_scores = vectorstore.similarity_search_with_relevance_scores(
                question,
                k=10,  # Get more candidates
            )
            # Filter by relevance score (keep only relevant results)
            docs = [doc for doc, score in docs_with_scores if score >= 0.5]
            
            # If too few results, fall back to top 3
            if len(docs) < 3:
                logger.info("Few relevant results, falling back to top 3")
                docs = vectorstore.similarity_search(question, k=3)
            elif len(docs) > 6:
                docs = docs[:6]  # Limit to top 6
                
            logger.info(f"Retrieved {len(docs)} relevant documents")
        except Exception as e:
            # Fallback to basic similarity search if relevance scores not supported
            logger.warning(f"Relevance search failed, using basic search: {e}")
            docs = vectorstore.similarity_search(question, k=6)

        if not docs:
            logger.warning("No relevant documents found for query")
            result = {
                "answer": (
                    "I couldn't find relevant information in the repository "
                    "to answer your question. Try rephrasing or asking about "
                    "a specific file or function."
                ),
                "sources": [],
                "repo_id": repo_id,
            }
            # Cache negative results too (shorter TTL)
            _query_cache[cache_key] = (result, time.time() - _CACHE_TTL + 300)  # 5 min cache
            return result

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

        result = {
            "answer": answer,
            "sources": sources,
            "repo_id": repo_id,
        }
        
        # Cache the successful result
        _query_cache[cache_key] = (result, time.time())
        
        # Limit cache size (keep last 100 queries)
        if len(_query_cache) > 100:
            oldest_key = min(_query_cache.keys(),
                           key=lambda k: _query_cache[k][1])
            del _query_cache[oldest_key]
            logger.debug("Cache size limit reached, removed oldest entry")
        
        return result

    except Exception as e:
        logger.error(f"Query failed for repo {repo_id}: {e}", exc_info=True)
        raise

# Made with Bob
