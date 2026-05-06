"""
Repository Ingestion Service
Handles cloning, chunking, and embedding of repositories
"""
import os
import re
import shutil
import uuid
import json
import logging
import subprocess
import threading
from collections import Counter
from pathlib import Path
from typing import Dict, Any, List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
from app.rag import get_embeddings, create_vectorstore

logger = logging.getLogger(__name__)

# In-memory storage for ingestion status (hackathon simplicity)
ingestion_status: Dict[str, Dict[str, Any]] = {}
# Thread-safe lock for status updates (Bug Fix #1)
_status_lock = threading.Lock()

# ---------------------------------------------------------------------------
# File-extension allow-list: only ingest readable text/code files.
# Binary files (images, compiled artifacts, etc.) break the embedding pipeline
# and waste token budget.
# ---------------------------------------------------------------------------
_ALLOWED_EXTENSIONS = {
    # Web / frontend
    ".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs",
    ".html", ".css", ".scss", ".sass", ".less", ".svelte", ".vue",
    # Backend / scripting
    ".py", ".rb", ".go", ".java", ".kt", ".scala",
    ".php", ".rs", ".c", ".cpp", ".h", ".hpp",
    ".cs", ".swift", ".m",
    # Shell / config
    ".sh", ".bash", ".zsh", ".fish",
    ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".env.example",
    # Data / docs
    ".json", ".xml", ".csv", ".sql",
    ".md", ".mdx", ".rst", ".txt",
    # Misc
    ".graphql", ".proto", ".tf", ".hcl",
}

# Directories to skip entirely
_SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv", "env",
    "dist", "build", ".next", ".nuxt", "out", "target",
    ".mypy_cache", ".pytest_cache", ".ruff_cache",
    "vendor", "third_party", ".idea", ".vscode",
}

_SKIP_BASENAMES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
    "uv.lock", "poetry.lock", "Pipfile.lock", "Cargo.lock", "go.sum",
}

_MAX_FILE_BYTES = 750_000

_LANGUAGE_MAP = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript/React",
    ".ts": "TypeScript",
    ".tsx": "TypeScript/React",
    ".go": "Go",
    ".rs": "Rust",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
    ".rb": "Ruby",
    ".php": "PHP",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".cs": "C#",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".md": "Markdown",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".toml": "TOML",
    ".sh": "Shell",
    ".sql": "SQL",
}


def _is_allowed_file(file_path: str) -> bool:
    """
    Return True only for text/code files we can meaningfully embed.
    Rejects binary files, generated lock files, compiled artefacts, etc.
    """
    # Reject any path containing a skip directory
    parts = file_path.replace("\\", "/").split("/")
    for part in parts:
        if part in _SKIP_DIRS:
            return False

    # Must have an allowed extension (or be a well-known dotfile like .gitignore)
    _, ext = os.path.splitext(file_path)
    basename = os.path.basename(file_path)
    if basename in _SKIP_BASENAMES:
        return False
    if basename.endswith((".min.js", ".min.css")):
        return False

    if ext.lower() in _ALLOWED_EXTENSIONS:
        return True

    # Allow extensionless files that are clearly text (Makefile, Dockerfile, etc.)
    _allowed_basenames = {
        "Makefile", "Dockerfile", "Procfile", "Gemfile", "Rakefile",
        ".gitignore", ".dockerignore", ".editorconfig", ".eslintrc",
        ".prettierrc", ".babelrc", "Pipfile",
    }
    if basename in _allowed_basenames:
        return True

    return False


def normalize_repo_url(repo_url: str) -> str:
    """Normalize GitHub URLs so duplicate ingestion can be reused."""
    normalized = repo_url.strip()
    normalized = normalized[:-1] if normalized.endswith("/") else normalized
    normalized = normalized[:-4] if normalized.endswith(".git") else normalized
    return normalized.lower()


def _repo_index_path() -> Path:
    return Path(settings.data_dir) / "repo_index.json"


def _metadata_dir() -> Path:
    return Path(settings.data_dir) / "metadata"


def _metadata_path(repo_id: str) -> Path:
    return _metadata_dir() / f"{repo_id}.json"


def _files_path(repo_id: str) -> Path:
    return _metadata_dir() / f"{repo_id}_files.json"


def _structure_path(repo_id: str) -> Path:
    return _metadata_dir() / f"{repo_id}_structure.json"


def _read_repo_index() -> Dict[str, str]:
    path = _repo_index_path()
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as err:
        logger.warning(f"Failed to read repo index: {err}")
        return {}


def _write_repo_index(index: Dict[str, str]) -> None:
    path = _repo_index_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(index, indent=2, sort_keys=True), encoding="utf-8")


def register_repo_url(repo_url: str, repo_id: str) -> None:
    """Persist a GitHub URL to repo_id mapping for duplicate reuse."""
    with _status_lock:
        index = _read_repo_index()
        index[normalize_repo_url(repo_url)] = repo_id
        _write_repo_index(index)


def find_existing_repo(repo_url: str) -> str | None:
    """Return an existing repo_id for the same URL when it is still usable."""
    normalized = normalize_repo_url(repo_url)
    with _status_lock:
        for repo_id, status in ingestion_status.items():
            if status.get("repo_url") == normalized and status.get("status") != "failed":
                return repo_id
        repo_id = _read_repo_index().get(normalized)

    if repo_id and get_status(repo_id)["status"] == "completed":
        return repo_id
    return None


def save_repo_metadata(repo_id: str, metadata: Dict[str, Any]) -> None:
    _metadata_dir().mkdir(parents=True, exist_ok=True)
    _metadata_path(repo_id).write_text(
        json.dumps(metadata, indent=2, sort_keys=True),
        encoding="utf-8",
    )


def load_repo_metadata(repo_id: str) -> Dict[str, Any] | None:
    path = _metadata_path(repo_id)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as err:
        logger.warning(f"Failed to read metadata for {repo_id}: {err}")
        return None


def save_repo_files(repo_id: str, files: List[str]) -> None:
    _metadata_dir().mkdir(parents=True, exist_ok=True)
    _files_path(repo_id).write_text(
        json.dumps(files, indent=2),
        encoding="utf-8",
    )


def load_repo_files(repo_id: str) -> List[str] | None:
    path = _files_path(repo_id)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as err:
        logger.warning(f"Failed to read files for {repo_id}: {err}")
        return None


def save_repo_structure(repo_id: str, structure: Dict[str, Any]) -> None:
    _metadata_dir().mkdir(parents=True, exist_ok=True)
    _structure_path(repo_id).write_text(
        json.dumps(structure, indent=2),
        encoding="utf-8",
    )


def load_repo_structure(repo_id: str) -> Dict[str, Any] | None:
    path = _structure_path(repo_id)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as err:
        logger.warning(f"Failed to read structure for {repo_id}: {err}")
        return None


def _language_for_path(path: str) -> str:
    ext = Path(path).suffix.lower()
    if Path(path).name.lower() == "dockerfile":
        return "Docker"
    return _LANGUAGE_MAP.get(ext, "Other")


def _suggest_questions(stats: Dict[str, Any]) -> List[str]:
    questions = [
        "Explain the architecture of this repository.",
        "What files should I read first to understand the project?",
        "Where are the main entry points?",
        "What are the most important dependencies or config files?",
    ]
    languages = {item["name"] for item in stats.get("languages", [])}
    if {"Python", "TypeScript", "JavaScript"} & languages:
        questions.append("How does data flow from the backend to the frontend?")
    if stats.get("code_health", {}).get("has_tests"):
        questions.append("How are tests organized in this repository?")
    else:
        questions.append("What testing gaps are visible from the repository structure?")
    return questions[:6]


def _build_repo_files(repo_id: str, documents: List[Document]) -> List[str]:
    seen: set = set()
    files: list[str] = []
    for doc in documents:
        path = doc.metadata.get("source", "")
        if not path:
            continue
        normalized = os.path.normpath(path).replace("\\", "/")
        if normalized.startswith("..") or normalized.startswith("/"):
            continue
        if normalized not in seen:
            seen.add(normalized)
            files.append(normalized)
    files.sort()
    return files


def _build_repo_structure(repo_id: str, documents: List[Document]) -> Dict[str, Any]:
    lang_map = {
        "py": "Python", "js": "JavaScript", "ts": "TypeScript",
        "tsx": "React/TSX", "jsx": "React/JSX", "go": "Go", "rs": "Rust",
        "java": "Java", "cpp": "C++", "c": "C", "rb": "Ruby",
        "php": "PHP", "swift": "Swift", "kt": "Kotlin", "cs": "C#",
        "html": "HTML", "css": "CSS", "scss": "SCSS", "md": "Markdown",
        "json": "JSON", "yaml": "YAML", "yml": "YAML", "toml": "TOML",
        "sh": "Shell", "sql": "SQL",
    }
    color_palette = [
        "#818cf8", "#60a5fa", "#34d399", "#c084fc",
        "#fb923c", "#4ade80", "#f87171", "#38bdf8",
        "#facc15", "#a78bfa", "#2dd4bf", "#f472b6",
    ]

    seen_paths: set = set()
    all_paths: list[str] = []
    for doc in documents:
        path = doc.metadata.get("source", "")
        if path and path not in seen_paths:
            seen_paths.add(path)
            all_paths.append(path.replace("\\", "/"))

    # Legacy flat nodes
    dir_structure: dict[str, dict] = {}
    for path in all_paths:
        parts = path.split("/")
        if len(parts) > 1:
            top_dir = parts[0]
            if top_dir not in dir_structure:
                dir_structure[top_dir] = {"name": top_dir, "file_count": 0, "subdirs": set(), "languages": set()}
            dir_structure[top_dir]["file_count"] += 1
            if len(parts) > 2:
                dir_structure[top_dir]["subdirs"].add(parts[1])
            if "." in parts[-1]:
                ext = parts[-1].rsplit(".", 1)[-1].lower()
                if ext in lang_map:
                    dir_structure[top_dir]["languages"].add(lang_map[ext])

    nodes = []
    for dir_name, data in sorted(dir_structure.items(), key=lambda x: -x[1]["file_count"])[:8]:
        nodes.append({
            "id": dir_name, "label": dir_name,
            "file_count": data["file_count"],
            "subdirs": list(data["subdirs"])[:3],
            "languages": list(data["languages"]),
        })

    # Full recursive tree
    raw_tree: dict = {}

    def insert_path(tree: dict, parts: list):
        if not parts:
            return
        if len(parts) == 1:
            if "__root_files__" not in tree:
                tree["__root_files__"] = []
            tree["__root_files__"].append(parts[0])
            return
        head = parts[0]
        rest = parts[1:]
        if head not in tree:
            tree[head] = {"__files__": [], "__dirs__": {}}
        if len(rest) == 1:
            tree[head]["__files__"].append(rest[0])
        elif rest:
            insert_path(tree[head]["__dirs__"], rest)

    for path in all_paths:
        insert_path(raw_tree, path.split("/"))

    def tree_to_nodes(tree: dict, depth: int = 0, color_idx: int = 0, path_prefix: str = "") -> list:
        result = []

        root_files = tree.get("__root_files__", [])
        for ri, fname in enumerate(sorted(root_files)[:30]):
            ext = fname.rsplit(".", 1)[-1].lower() if "." in fname else ""
            c_idx = (color_idx + ri) % len(color_palette)
            full_path = f"{path_prefix}/{fname}" if path_prefix else fname
            result.append({
                "id": full_path, "label": fname,
                "type": "file", "ext": ext,
                "language": lang_map.get(ext, ""),
                "color": color_palette[c_idx],
                "children": [], "depth": depth,
            })

        for i, name in enumerate(sorted(k for k in tree.keys() if k not in ("__root_files__",))):
            subtree = tree[name]
            c_idx = (color_idx + i) % len(color_palette)
            files = subtree.get("__files__", [])
            subdirs = subtree.get("__dirs__", {})
            full_path = f"{path_prefix}/{name}" if path_prefix else name
            langs: set = set()
            for f in files:
                if "." in f:
                    ext = f.rsplit(".", 1)[-1].lower()
                    if ext in lang_map:
                        langs.add(lang_map[ext])
            children = tree_to_nodes(subdirs, depth + 1, c_idx, full_path)
            for fname in sorted(files)[:30]:
                ext = fname.rsplit(".", 1)[-1].lower() if "." in fname else ""
                children.append({
                    "id": f"{full_path}/{fname}", "label": fname,
                    "type": "file", "ext": ext,
                    "language": lang_map.get(ext, ""),
                    "color": color_palette[c_idx],
                    "children": [], "depth": depth + 1,
                })
            result.append({
                "id": full_path, "label": name, "type": "dir",
                "file_count": len(files),
                "languages": sorted(list(langs)),
                "color": color_palette[c_idx],
                "children": children,
                "depth": depth,
            })
        return result

    tree_nodes = tree_to_nodes(raw_tree)

    return {
        "repo_id": repo_id,
        "root": {"name": "Repository", "type": "repository"},
        "nodes": nodes,
        "total_files": len(all_paths),
        "tree": tree_nodes,
    }


def _build_repo_metadata(
    repo_id: str,
    repo_url: str,
    documents: List[Document],
    chunks: List[Document],
    skipped: Dict[str, int],
) -> Dict[str, Any]:
    file_paths = [doc.metadata["source"] for doc in documents]
    language_counts = Counter(_language_for_path(path) for path in file_paths)
    dir_counts = Counter(path.split("/", 1)[0] if "/" in path else "." for path in file_paths)
    largest_files = sorted(
        (
            {
                "path": doc.metadata["source"],
                "bytes": len(doc.page_content.encode("utf-8")),
                "lines": doc.page_content.count("\n") + 1,
            }
            for doc in documents
        ),
        key=lambda item: item["bytes"],
        reverse=True,
    )[:8]
    dependency_files = [
        path for path in file_paths
        if Path(path).name in {
            "pyproject.toml", "package.json", "requirements.txt", "pom.xml",
            "build.gradle", "go.mod", "Cargo.toml", "Gemfile",
        }
    ]
    entrypoints = [
        path for path in file_paths
        if Path(path).name in {
            "main.py", "app.py", "server.py", "index.js", "index.ts",
            "main.ts", "main.tsx", "page.tsx", "App.tsx", "Dockerfile",
        }
    ][:12]
    has_tests = any(
        "/test" in f"/{path.lower()}" or Path(path).name.lower().startswith("test_")
        for path in file_paths
    )
    has_readme = any(Path(path).name.lower().startswith("readme") for path in file_paths)
    languages = [
        {"name": name, "count": count}
        for name, count in language_counts.most_common()
    ]
    top_dirs = [
        {"name": name, "count": count}
        for name, count in dir_counts.most_common(8)
    ]
    primary_language = languages[0]["name"] if languages else "Unknown"
    summary = (
        f"This repository contains {len(file_paths)} ingested files and "
        f"{len(chunks)} searchable chunks. The primary language appears to be "
        f"{primary_language}; key areas include "
        f"{', '.join(item['name'] for item in top_dirs[:4]) or 'root files'}."
    )
    code_health = {
        "has_readme": has_readme,
        "has_tests": has_tests,
        "largest_files": largest_files,
        "dependency_files": dependency_files,
        "entrypoints": entrypoints,
        "skipped_files": skipped,
    }
    stats = {
        "total_files": len(file_paths),
        "total_chunks": len(chunks),
        "languages": languages,
        "top_directories": top_dirs,
        "code_health": code_health,
    }
    return {
        "repo_id": repo_id,
        "repo_url": normalize_repo_url(repo_url),
        "summary": summary,
        "suggested_questions": _suggest_questions(stats),
        "stats": stats,
        "code_health": code_health,
    }


def _annotate_chunk_locations(chunks: List[Document], documents: List[Document]) -> None:
    """Add approximate line ranges to chunks for citations."""
    source_text = {doc.metadata["source"]: doc.page_content for doc in documents}
    for chunk in chunks:
        source = chunk.metadata.get("source")
        original = source_text.get(source or "")
        if not original:
            continue
        start_idx = original.find(chunk.page_content)
        if start_idx < 0:
            probe = chunk.page_content.strip()[:200]
            start_idx = original.find(probe) if probe else -1
        if start_idx < 0:
            continue
        line_start = original.count("\n", 0, start_idx) + 1
        line_end = line_start + chunk.page_content.count("\n")
        chunk.metadata["line_start"] = line_start
        chunk.metadata["line_end"] = max(line_start, line_end)


def generate_repo_id() -> str:
    """Generate unique repository identifier"""
    return str(uuid.uuid4())


def validate_repo_id(repo_id: str) -> bool:
    """
    Validate repo_id is a valid UUID (Bug Fix #7)
    
    Args:
        repo_id: Repository identifier to validate
    
    Returns:
        True if valid UUID, False otherwise
    """
    try:
        uuid.UUID(repo_id)
        return True
    except ValueError:
        return False


def update_status(
    repo_id: str,
    status: str,
    progress: int = 0,
    error: str | None = None,
    stage: str | None = None,
    stats: Dict[str, Any] | None = None,
    repo_url: str | None = None,
):
    """Update ingestion status (thread-safe)"""
    with _status_lock:
        previous = ingestion_status.get(repo_id, {})
        ingestion_status[repo_id] = {
            "status": status,
            "progress": progress,
            "error": error,
            "stage": stage,
            "stats": stats if stats is not None else previous.get("stats"),
            "repo_url": normalize_repo_url(repo_url) if repo_url else previous.get("repo_url"),
        }
    logger.info(f"Repo {repo_id}: {status} ({progress}%) — {stage or ''}")


def get_status(repo_id: str) -> Dict[str, Any]:
    """Get ingestion status, with chromadb fallback for server restarts (thread-safe)"""
    with _status_lock:
        cached = ingestion_status.get(repo_id)
        if cached:
            return cached

    # Fallback: check if a completed chromadb collection exists on disk
    chroma_path = f"{settings.chromadb_dir}/{repo_id}"
    if os.path.isdir(chroma_path) and os.listdir(chroma_path):
        # Re-populate in-memory status so subsequent calls are fast
        with _status_lock:
            metadata = load_repo_metadata(repo_id)
            ingestion_status[repo_id] = {
                "status": "completed",
                "progress": 100,
                "stage": "Ready!",
                "stats": (metadata or {}).get("stats"),
                "repo_url": (metadata or {}).get("repo_url"),
            }
            return ingestion_status[repo_id]

    return {"status": "not_found", "progress": 0}


def ingest_repository(repo_url: str, repo_id: str) -> None:
    """
    Ingest a GitHub repository into the RAG pipeline.

    Steps:
    1. Clone repository using GitLoader (tries main, then master branch)
    2. Filter to code/text files only
    3. Split documents into overlapping chunks
    4. Generate embeddings and store in ChromaDB

    Args:
        repo_url: GitHub repository URL
        repo_id:  Unique repository identifier
    """
    try:
        # Issue #8 Fix: Check disk space before starting
        import shutil
        os.makedirs(settings.data_dir, exist_ok=True)
        stat = shutil.disk_usage(settings.data_dir)
        available_gb = stat.free / (1024**3)
        if available_gb < 5.0:
            raise ValueError(
                f"Insufficient disk space. Available: {available_gb:.2f}GB, Required: 5GB minimum"
            )

        update_status(
            repo_id,
            "processing",
            5,
            stage="Starting ingestion...",
            repo_url=repo_url,
        )

        # ------------------------------------------------------------------ #
        # Step 1: Clone repository                                             #
        # ------------------------------------------------------------------ #
        logger.info(f"Cloning repository: {repo_url}")
        repo_path = f"{settings.repositories_dir}/{repo_id}"

        # Always start with a clean directory to avoid stale git state
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)
        os.makedirs(repo_path, exist_ok=True)

        update_status(repo_id, "processing", 15, stage="Cloning repository...")

        # Strategy: try default branch first (no --branch flag), then main/master.
        # --depth=1 = shallow clone (latest snapshot only, no history)
        # --filter=blob:none = blobless clone (fetch file contents on-demand)
        # Together this is the fastest possible clone for any repo size.
        cloned = False

        # Attempt 1: default branch (works for any repo regardless of branch name)
        attempts = [
            ["git", "clone", "--depth=1", "--filter=blob:none",
             "--single-branch", repo_url, repo_path],
        ]
        # Attempt 2+: explicit branches as fallback
        for branch in ["main", "master"]:
            attempts.append(
                ["git", "clone", "--depth=1", "--filter=blob:none",
                 "--branch", branch, "--single-branch", repo_url, repo_path]
            )

        for cmd in attempts:
            if os.path.exists(repo_path):
                shutil.rmtree(repo_path)
            try:
                # Issue #7 Fix: Explicitly set shell=False for security
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=180,
                    shell=False  # Explicit security setting
                )
                if result.returncode == 0:
                    branch_label = cmd[cmd.index("--branch") + 1] if "--branch" in cmd else "default"
                    logger.info(f"Shallow-cloned branch '{branch_label}' successfully")
                    cloned = True
                    break
                else:
                    logger.warning(f"Clone attempt failed: {result.stderr[:300]}")
            except subprocess.TimeoutExpired:
                logger.warning(f"Clone timed out (180s) for cmd: {' '.join(cmd[-3:])}")
            except Exception as clone_err:
                logger.warning(f"Clone error: {clone_err}")

        if not cloned:
            raise ValueError(
                "Could not clone repository. "
                "Check the URL is a valid public GitHub repo and try again."
            )


        # Walk the cloned directory and load allowed files manually
        update_status(repo_id, "processing", 35, stage="Reading code files...")
        documents: List[Document] = []
        skipped = {"unsupported": 0, "large": 0, "empty": 0, "read_error": 0}
        repo_path_obj = Path(repo_path)
        for root, dirnames, filenames in os.walk(repo_path):
            dirnames[:] = [name for name in dirnames if name not in _SKIP_DIRS]
            for filename in filenames:
                file_path = Path(root) / filename
                if not _is_allowed_file(str(file_path)):
                    skipped["unsupported"] += 1
                    continue
                try:
                    if file_path.stat().st_size > _MAX_FILE_BYTES:
                        skipped["large"] += 1
                        logger.debug(f"Skipping large file {file_path}")
                        continue
                    content = file_path.read_text(encoding="utf-8", errors="ignore")
                    if not content.strip():
                        skipped["empty"] += 1
                        continue
                    rel_path = str(file_path.relative_to(repo_path_obj))
                    documents.append(Document(
                        page_content=content,
                        metadata={"source": rel_path}
                    ))
                except Exception as read_err:
                    skipped["read_error"] += 1
                    logger.debug(f"Skipping {file_path}: {read_err}")

        logger.info(f"Loaded {len(documents)} documents from repository")
        update_status(
            repo_id,
            "processing",
            45,
            stage=f"Loaded {len(documents)} files...",
            stats={"files_loaded": len(documents), "skipped_files": skipped},
        )

        if not documents:
            raise ValueError(
                "No supported code/text files found in repository. "
                "Ensure the repository contains source files."
            )

        # ------------------------------------------------------------------ #
        # Step 2: Split documents                                              #
        # ------------------------------------------------------------------ #
        update_status(repo_id, "processing", 50, stage=f"Chunking {len(documents)} files...")
        logger.info(f"Splitting {len(documents)} documents into chunks")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1600,
            chunk_overlap=100,
            separators=["\n\n", "\n", " ", ""],
            length_function=len,
        )

        chunks = text_splitter.split_documents(documents)
        _annotate_chunk_locations(chunks, documents)
        logger.info(f"Created {len(chunks)} chunks from {len(documents)} files")

        if not chunks:
            raise ValueError("Document splitting produced zero chunks. Check file contents.")

        # ------------------------------------------------------------------ #
        # Step 3: Generate embeddings and persist to ChromaDB                 #
        # ------------------------------------------------------------------ #
        update_status(repo_id, "processing", 70, stage="Generating embeddings...")
        logger.info("Generating embeddings and storing in ChromaDB")

        embeddings = get_embeddings()

        update_status(repo_id, "processing", 85, stage="Building vector index...")
        create_vectorstore(repo_id, chunks, embeddings)

        metadata = _build_repo_metadata(repo_id, repo_url, documents, chunks, skipped)
        save_repo_metadata(repo_id, metadata)
        
        files_data = _build_repo_files(repo_id, documents)
        save_repo_files(repo_id, files_data)
        
        structure_data = _build_repo_structure(repo_id, documents)
        save_repo_structure(repo_id, structure_data)
        
        register_repo_url(repo_url, repo_id)

        # ------------------------------------------------------------------ #
        # Step 4: Done                                                         #
        # ------------------------------------------------------------------ #
        update_status(
            repo_id,
            "completed",
            100,
            stage="Ready!",
            stats=metadata["stats"],
            repo_url=repo_url,
        )
        logger.info(f"Repository {repo_id} ingestion completed successfully")

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Ingestion failed for {repo_id}: {error_msg}", exc_info=True)
        update_status(repo_id, "failed", 0, error_msg)
    finally:
        # Clean up cloned repo directory to avoid leaking disk space
        repo_path = f"{settings.repositories_dir}/{repo_id}"
        if os.path.exists(repo_path):
            try:
                shutil.rmtree(repo_path)
                logger.info(f"Cleaned up cloned repo at {repo_path}")
            except Exception as cleanup_err:
                logger.warning(f"Failed to clean up {repo_path}: {cleanup_err}")


def validate_github_url(url: str) -> bool:
    """
    Validate that the URL is a well-formed GitHub repository URL.

    Issue #3 Fix: More restrictive pattern to prevent subdomain attacks.
    - No leading/trailing dots or hyphens in username/repo
    - Anchored to github.com domain only
    - Prevents path traversal and SSRF attacks

    Args:
        url: Repository URL to validate

    Returns:
        True if valid, False otherwise
    """
    if not url:
        return False

    # Accept https://github.com/<owner>/<repo> only (Bug Fix M5: HTTPS only, HTTP is insecure)
    # Trailing .git suffix is optional
    # More restrictive: no leading/trailing dots/hyphens
    pattern = r"^https://github\.com/[A-Za-z0-9]([A-Za-z0-9_-]*[A-Za-z0-9])?/[A-Za-z0-9]([A-Za-z0-9_.-]*[A-Za-z0-9])?(\.git)?/?$"
    return bool(re.match(pattern, url.strip()))

# Made with Bob
