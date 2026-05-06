/**
 * FileTree Component
 * Collapsible file explorer sidebar showing all ingested repository files.
 * Clicking a file highlights it in the source list.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CloseIcon from "@mui/icons-material/Close";

interface FileTreeProps {
  repoId: string;
  highlightedFile?: string;
  onFileClick?: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
}

// Build a tree structure from a flat list of file paths
function buildTree(files: string[]): TreeNode[] {
  const root: TreeNode = { name: "root", path: "", isDir: true, children: [] };

  for (const file of files) {
    // Normalize path separators
    const parts = file.replace(/\\/g, "/").split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const existingChild = current.children.find((c) => c.name === part);

      if (existingChild) {
        current = existingChild;
      } else {
        const newNode: TreeNode = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          isDir: !isLast,
          children: [],
        };
        current.children.push(newNode);
        current = newNode;
      }
    }
  }

  // Sort: directories first, then files, alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({ ...n, children: sortNodes(n.children) }));
  };

  return sortNodes(root.children);
}

// Get file icon color based on extension
function getFileColor(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const colors: Record<string, string> = {
    ts: "text-blue-400",  tsx: "text-blue-500",
    js: "text-yellow-400", jsx: "text-yellow-500",
    py: "text-green-400",  go: "text-cyan-400",
    rs: "text-orange-400", java: "text-red-400",
    css: "text-pink-400",  scss: "text-pink-500",
    html: "text-orange-500", md: "text-gray-400",
    json: "text-yellow-300", yaml: "text-purple-400",
    yml: "text-purple-400",  toml: "text-red-300",
  };
  return colors[ext] ?? "text-gray-400";
}

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  highlighted?: string;
  onFileClick?: (path: string) => void;
}

function TreeNodeItem({ node, depth, highlighted, onFileClick }: TreeNodeItemProps) {
  const [open, setOpen] = useState(depth < 1);
  const isHighlighted = !node.isDir && highlighted && node.path.endsWith(highlighted);

  return (
    <div>
      <motion.div
        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg cursor-pointer text-sm select-none
          ${isHighlighted
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            : "hover:bg-white/5 text-gray-300 hover:text-white"
          }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (node.isDir) setOpen((v) => !v);
          else onFileClick?.(node.path);
        }}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.1 }}
      >
        {node.isDir ? (
          <>
            {open ? (
              <FolderOpenIcon sx={{ fontSize: 16 }} className="text-yellow-400 flex-shrink-0" />
            ) : (
              <FolderIcon sx={{ fontSize: 16 }} className="text-yellow-500 flex-shrink-0" />
            )}
            <span className="font-medium text-gray-200 truncate">{node.name}</span>
          </>
        ) : (
          <>
            <InsertDriveFileIcon
              sx={{ fontSize: 14 }}
              className={`flex-shrink-0 ${getFileColor(node.name)}`}
            />
            <span className="truncate font-mono text-xs">{node.name}</span>
          </>
        )}
      </motion.div>

      {node.isDir && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <TreeNodeItem
                  key={child.path}
                  node={child}
                  depth={depth + 1}
                  highlighted={highlighted}
                  onFileClick={onFileClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function FileTree({ repoId, highlightedFile, onFileClick }: FileTreeProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!repoId) return;
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
      fetch(`${API_BASE}/api/ingest/${repoId}/files`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data: { files?: string[] }) => {
          if (cancelled) return;
          setFiles(data.files ?? []);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setError("Could not load file tree");
          setLoading(false);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [repoId, API_BASE]);

  const tree = useMemo(() => buildTree(files), [files]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-full w-12 rounded-2xl border border-white/10 bg-gray-900/80 text-blue-400 hover:bg-gray-800"
        aria-label="Open file explorer"
        title="Open file explorer"
      >
        <AccountTreeIcon sx={{ fontSize: 20 }} />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-72 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full"

    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <AccountTreeIcon sx={{ fontSize: 18 }} className="text-blue-400" />
          <span className="text-sm font-semibold text-white">File Explorer</span>
          {files.length > 0 && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              {files.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Collapse file explorer"
          title="Collapse"
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 px-4 py-4">{error}</p>
        ) : tree.length === 0 ? (
          <p className="text-xs text-gray-500 px-4 py-4">No files found</p>
        ) : (
          tree.map((node) => (
            <TreeNodeItem
              key={node.path}
              node={node}
              depth={0}
              highlighted={highlightedFile}
              onFileClick={onFileClick}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

// Made with Bob
