/**
 * Code Health Dashboard
 * Shows repository stats: language breakdown, file counts, chunk count.
 * Appears after ingestion completes - gives judges an instant "wow" moment.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DataObjectIcon from "@mui/icons-material/DataObject";
import CodeIcon from "@mui/icons-material/Code";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

interface LangEntry { name: string; count: number; }
interface DirEntry  { name: string; count: number; }
interface RepoStats {
  total_files: number;
  total_chunks: number;
  languages: LangEntry[];
  top_directories: DirEntry[];
  code_health?: {
    has_readme?: boolean;
    has_tests?: boolean;
    dependency_files?: string[];
    entrypoints?: string[];
    skipped_files?: Record<string, number>;
  };
}

interface CodeHealthDashboardProps {
  repoId: string;
}

// Colour palette for language bars
const LANG_COLORS = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-cyan-500 to-cyan-600",
  "from-yellow-500 to-yellow-600",
  "from-red-500 to-red-600",
];

export default function CodeHealthDashboard({ repoId }: CodeHealthDashboardProps) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!repoId) return;
    const controller = new AbortController();

    fetch(`${API_BASE}/api/ingest/${repoId}/stats`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [repoId, API_BASE]);

  if (loading) return null;
  if (!stats) return null;

  const topLangs = stats.languages.slice(0, 6);
  const maxLangCount = Math.max(...topLangs.map((l) => l.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <CodeIcon sx={{ fontSize: 16 }} />
        Code Health
      </h3>

      {/* Stat Chips */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <InsertDriveFileIcon sx={{ fontSize: 18 }} className="text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">{stats.total_files}</p>
            <p className="text-xs text-gray-400 mt-0.5">Files</p>
          </div>
        </div>

        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <DataObjectIcon sx={{ fontSize: 18 }} className="text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">{stats.total_chunks}</p>
            <p className="text-xs text-gray-400 mt-0.5">Chunks</p>
          </div>
        </div>
      </div>

      {/* Language Breakdown */}
      {topLangs.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <CodeIcon sx={{ fontSize: 12 }} /> Languages
          </p>
          <div className="space-y-2">
            {topLangs.map((lang, i) => {
              const pct = Math.round((lang.count / maxLangCount) * 100);
              return (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 font-medium">{lang.name}</span>
                    <span className="text-gray-500">{lang.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${LANG_COLORS[i % LANG_COLORS.length]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Directories */}
      {stats.top_directories.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <FolderOpenIcon sx={{ fontSize: 12 }} /> Top Folders
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stats.top_directories.slice(0, 6).map((dir) => (
              <span
                key={dir.name}
                className="text-xs bg-gray-700/50 border border-white/5 text-gray-300 px-2 py-1 rounded-lg font-mono"
              >
                /{dir.name}
                <span className="ml-1 text-gray-500">{dir.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.code_health && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <DataObjectIcon sx={{ fontSize: 12 }} /> Signals
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs bg-gray-700/50 border border-white/5 text-gray-300 px-2 py-1 rounded-lg">
              README {stats.code_health.has_readme ? "yes" : "missing"}
            </span>
            <span className="text-xs bg-gray-700/50 border border-white/5 text-gray-300 px-2 py-1 rounded-lg">
              Tests {stats.code_health.has_tests ? "yes" : "not obvious"}
            </span>
            {(stats.code_health.dependency_files ?? []).slice(0, 3).map((file) => (
              <span
                key={file}
                className="text-xs bg-gray-700/50 border border-white/5 text-gray-300 px-2 py-1 rounded-lg font-mono"
              >
                {file}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Made with Bob
