"""
Query Service
Handles question answering using RAG pipeline
"""
import logging
from typing import List, Dict, Any
from app.rag import get_embeddings, get_llm, get_vectorstore, build_prompt
from app.models import Source

logger = logging.getLogger(__name__)


def query_repository(repo_id: str, question: str) -> Dict[str, Any]:
    """
    Query a repository using RAG pipeline
    
    Steps:
    1. Load vectorstore for repository
    2. Perform similarity search
    3. Build prompt with context
    4. Generate answer using LLM
    5. Return answer with sources
    
    Args:
        repo_id: Repository identifier
        question: User's question
        
    Returns:
        Dictionary with answer and sources
    """
    try:
        logger.info(f"Processing query for repo {repo_id}: {question}")
        
        # Step 1: Load vectorstore
        embeddings = get_embeddings()
        vectorstore = get_vectorstore(repo_id, embeddings)
        
        # Step 2: Similarity search
        logger.info("Performing similarity search")
        docs = vectorstore.similarity_search(question, k=5)
        
        if not docs:
            logger.warning("No relevant documents found")
            return {
                "answer": "I couldn't find relevant information in the repository to answer your question.",
                "sources": [],
                "repo_id": repo_id
            }
        
        # Step 3: Build context and prompt
        context = "\n\n".join([doc.page_content for doc in docs])
        prompt = build_prompt(context, question)
        
        # Step 4: Generate answer
        logger.info("Generating answer with LLM")
        llm = get_llm()
        answer = llm.invoke(prompt)
        
        # Step 5: Extract sources (deduplicated by file path)
        seen_paths = set()
        sources = []
        for doc in docs:
            path = doc.metadata.get("source", "unknown")
            if path not in seen_paths:
                seen_paths.add(path)
                sources.append(Source(file_path=path, content=None))
        
        logger.info(f"Query completed successfully for repo {repo_id}")
        
        return {
            "answer": answer,
            "sources": sources,
            "repo_id": repo_id
        }
        
    except Exception as e:
        logger.error(f"Query failed for repo {repo_id}: {e}")
        raise

# Made with Bob
