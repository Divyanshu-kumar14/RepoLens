"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { apiService } from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TreeNode {
  id: string;
  label: string;
  type: "dir" | "file";
  file_count?: number;
  languages?: string[];
  color: string;
  ext?: string;
  language?: string;
  children: TreeNode[];
  depth: number;
}

interface ApiData {
  repo_id: string;
  root: { name: string; type: string };
  total_files: number;
  tree: TreeNode[];
}

interface LayoutNode {
  id: string;
  label: string;
  type: "dir" | "file" | "root";
  color: string;
  ext?: string;
  x: number;
  y: number;
  parentId: string | null;
  depth: number;
  isLeaf: boolean;
  meta: string; // subtitle text
}

interface MindMapVisualizationProps {
  repoId: string;
  onNodeClick?: (question: string) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_W = 148;
const NODE_H = 40;
const ROOT_W = 160;
const ROOT_H = 52;
const H_GAP = 72;   // horizontal gap between levels
const V_GAP = 14;   // vertical gap between siblings

// ── Layout engine (left-to-right tree) ───────────────────────────────────────

interface LayoutResult {
  nodes: LayoutNode[];
  edges: { from: string; to: string; color: string }[];
  totalH: number;
  totalW: number;
}

function layoutTree(
  tree: TreeNode[],
  rootName: string,
  collapsed: Set<string>,
): LayoutResult {
  const nodes: LayoutNode[] = [];
  const edges: { from: string; to: string; color: string }[] = [];

  // Root
  nodes.push({
    id: "__root__",
    label: rootName,
    type: "root",
    color: "#a78bfa",
    x: 0,
    y: 0,
    parentId: null,
    depth: 0,
    isLeaf: false,
    meta: `${tree.length} top-level items`,
  });

  // Recursive subtree height calculation
  function subtreeHeight(node: TreeNode): number {
    if (collapsed.has(node.id) || node.children.length === 0) {
      return NODE_H + V_GAP;
    }
    return node.children.reduce((s, c) => s + subtreeHeight(c), 0);
  }

  // Deduplicate tracker — prevents React key errors from stale API data
  const seenIds = new Set<string>();

  // Place nodes recursively
  function place(
    nodes_: LayoutNode[],
    edges_: { from: string; to: string; color: string }[],
    items: TreeNode[],
    parentId: string,
    startX: number,
    startY: number,
    idPrefix: string,
  ): number {
    let curY = startY;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const h = subtreeHeight(item);
      const midY = curY + h / 2 - NODE_H / 2;

      // Make ID unique if the backend returns duplicates (e.g. before re-ingest)
      let uniqueId = item.id;
      if (seenIds.has(uniqueId)) {
        uniqueId = `${idPrefix}/${item.id}__${idx}`;
      }
      seenIds.add(uniqueId);

      nodes_.push({
        id: uniqueId,
        label: item.label,
        type: item.type,
        color: item.color,
        ext: item.ext,
        x: startX,
        y: midY,
        parentId,
        depth: item.depth + 1,
        isLeaf: item.children.length === 0 || collapsed.has(item.id),
        meta:
          item.type === "dir"
            ? `${item.file_count ?? 0} files${item.languages?.length ? " · " + item.languages.slice(0, 2).join(", ") : ""}`
            : item.language || item.ext || "",
      });

      edges_.push({ from: parentId, to: uniqueId, color: item.color });

      if (!collapsed.has(item.id) && item.children.length > 0) {
        place(
          nodes_,
          edges_,
          item.children,
          uniqueId,
          startX + NODE_W + H_GAP,
          curY,
          uniqueId,
        );
      }

      curY += h;
    }
    return curY;
  }

  const totalH = tree.reduce((s, n) => s + subtreeHeight(n), 0);
  const startY = -(totalH / 2);
  place(nodes, edges, tree, "__root__", ROOT_W / 2 + H_GAP, startY, "__root__");

  // Calculate bounding box
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const maxX = Math.max(...xs) + NODE_W + 40;
  const maxY = Math.max(...ys) + NODE_H + 40;

  return { nodes, edges, totalH, totalW: maxX };
}

// ── Bezier path ───────────────────────────────────────────────────────────────

function edgePath(
  fromNode: LayoutNode,
  toNode: LayoutNode,
): string {
  const isRoot = fromNode.type === "root";
  const fx = fromNode.x + (isRoot ? ROOT_W : NODE_W);
  const fy = fromNode.y + (isRoot ? ROOT_H : NODE_H) / 2;
  const tx = toNode.x;
  const ty = toNode.y + NODE_H / 2;
  const mx = (fx + tx) / 2;
  return `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`;
}

// ── File-type icon colors ─────────────────────────────────────────────────────

const EXT_COLOR: Record<string, string> = {
  py: "#3b82f6", ts: "#2563eb", tsx: "#06b6d4", js: "#f59e0b",
  jsx: "#f97316", json: "#84cc16", md: "#a3e635", css: "#f472b6",
  scss: "#ec4899", html: "#ef4444", go: "#22d3ee", rs: "#fb923c",
  yaml: "#e2e8f0", yml: "#e2e8f0", toml: "#fbbf24", sh: "#4ade80",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function MindMapVisualization({
  repoId,
  onNodeClick,
}: MindMapVisualizationProps) {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All nodes collapsed by default = false → everything expanded
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Pan + zoom
  const [tx, setTx] = useState(80);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(0.85);
  const panning = useRef(false);
  const panStart = useRef({ mx: 0, my: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch
  useEffect(() => {
    if (!repoId) return;
    setLoading(true);
    setError(null);
    apiService
      .getRepositoryStructure(repoId)
      .then((res: ApiData) => {
        setApiData(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load repository structure");
        setLoading(false);
      });
  }, [repoId]);

  // Layout
  const { nodes, edges } = useMemo(() => {
    if (!apiData?.tree) return { nodes: [], edges: [] };
    return layoutTree(apiData.tree, apiData.root.name, collapsed);
  }, [apiData, collapsed]);

  const nodeMap = useMemo(() => {
    const m: Record<string, LayoutNode> = {};
    nodes.forEach((n) => (m[n.id] = n));
    return m;
  }, [nodes]);

  // Center view on mount / data load
  useEffect(() => {
    if (!nodes.length || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ys = nodes.map((n) => n.y + NODE_H / 2);
    const midY = (Math.min(...ys) + Math.max(...ys)) / 2;
    setTx(60);
    setTy(rect.height / 2 - midY * scale);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  // Wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.909;
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setScale((s) => {
      const ns = Math.min(3, Math.max(0.2, s * factor));
      setTx((t) => cx - ((cx - t) * ns) / s);
      setTy((t) => cy - ((cy - t) * ns) / s);
      return ns;
    });
  }, []);

  // Pan
  const onPanDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    panning.current = true;
    panStart.current = { mx: e.clientX, my: e.clientY, tx, ty };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [tx, ty]);

  const onPanMove = useCallback((e: React.PointerEvent) => {
    if (!panning.current) return;
    setTx(panStart.current.tx + e.clientX - panStart.current.mx);
    setTy(panStart.current.ty + e.clientY - panStart.current.my);
  }, []);

  const onPanUp = useCallback(() => { panning.current = false; }, []);

  const resetView = useCallback(() => {
    if (!nodes.length || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ys = nodes.map((n) => n.y + NODE_H / 2);
    const midY = (Math.min(...ys) + Math.max(...ys)) / 2;
    setScale(0.85);
    setTx(60);
    setTy(rect.height / 2 - midY * 0.85);
  }, [nodes]);

  const toggleCollapse = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleNodeClick = useCallback(
    (node: LayoutNode) => {
      if (node.type === "root") return;
      setSelected((p) => (p === node.id ? null : node.id));
      if (node.type === "dir") {
        onNodeClick?.(
          `Explain the "${node.label}" directory: its purpose, what it contains, and key files.`,
        );
      } else {
        onNodeClick?.(`What does the file "${node.label}" do?`);
      }
    },
    [onNodeClick],
  );

  // ── Render states ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-[#0d0d1a] border border-white/10 rounded-2xl flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Building mind map…</p>
        </div>
      </div>
    );
  }

  if (error || !apiData) {
    return (
      <div className="w-full h-[600px] bg-[#0d0d1a] border border-white/10 rounded-2xl flex items-center justify-center">
        <div className="text-center space-y-2">
          <AccountTreeIcon className="text-red-400 text-5xl" />
          <p className="text-sm text-red-400">{error ?? "No data"}</p>
        </div>
      </div>
    );
  }

  // ── SVG canvas ────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col rounded-2xl overflow-hidden border border-white/10"
      style={{ height: 640, background: "#0a0a18" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0"
        style={{ background: "#0d0d22" }}>
        <div className="flex items-center gap-2">
          <AccountTreeIcon sx={{ fontSize: 18 }} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Repository Mind Map</span>
          <span className="ml-2 text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
            {apiData.total_files} files · click to explore
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale((s) => Math.min(3, s * 1.2))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Zoom in">
            <ZoomInIcon sx={{ fontSize: 18 }} />
          </button>
          <button onClick={() => setScale((s) => Math.max(0.2, s / 1.2))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Zoom out">
            <ZoomOutIcon sx={{ fontSize: 18 }} />
          </button>
          <button onClick={resetView}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Fit view">
            <CenterFocusStrongIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            onClick={() => {
              // Collapse all dirs
              const allDirs = nodes.filter(n => n.type === "dir").map(n => n.id);
              setCollapsed(new Set(allDirs));
            }}
            className="ml-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >Collapse all</button>
          <button
            onClick={() => setCollapsed(new Set())}
            className="px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >Expand all</button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{ cursor: panning.current ? "grabbing" : "grab" }}
        onWheel={onWheel}
        onPointerDown={onPanDown}
        onPointerMove={onPanMove}
        onPointerUp={onPanUp}
        onPointerLeave={onPanUp}
      >
        <svg width="100%" height="100%" style={{ overflow: "visible" }}>
          <defs>
            <filter id="mm-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${tx}, ${ty}) scale(${scale})`}>
            {/* ── Edges ── */}
            {edges.map((edge, ei) => {
              const fromN = nodeMap[edge.from];
              const toN = nodeMap[edge.to];
              if (!fromN || !toN) return null;
              const isSel = selected === edge.to || selected === edge.from;
              return (
                <path
                  key={`e-${ei}-${edge.from}-${edge.to}`}
                  d={edgePath(fromN, toN)}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth={isSel ? 2 : 1.2}
                  strokeOpacity={isSel ? 0.9 : selected ? 0.15 : 0.45}
                  style={{ transition: "stroke-opacity 0.2s" }}
                />
              );
            })}

            {/* ── Nodes ── */}
            {nodes.map((node, ni) => {
              const isRoot = node.type === "root";
              const isDir = node.type === "dir";
              const isFile = node.type === "file";
              const isSel = selected === node.id;
              const isHov = hovered === node.id;
              const isCol = collapsed.has(node.id);
              const dimmed = selected && !isSel && node.id !== "__root__";
              const w = isRoot ? ROOT_W : NODE_W;
              const h = isRoot ? ROOT_H : NODE_H;
              const accent = isRoot ? "#a78bfa" : node.color;
              const fileColor = isFile && node.ext ? (EXT_COLOR[node.ext] ?? node.color) : node.color;

              return (
                <g
                  key={`n-${ni}-${node.id}`}
                  style={{
                    cursor: isRoot ? "default" : "pointer",
                    opacity: dimmed ? 0.25 : 1,
                    transition: "opacity 0.2s",
                  }}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Glow behind selected */}
                  {isSel && (
                    <rect
                      x={node.x - 4} y={node.y - 4}
                      width={w + 8} height={h + 8}
                      rx={14}
                      fill={accent}
                      fillOpacity={0.18}
                      style={{ filter: "blur(8px)" }}
                    />
                  )}

                  {/* Card background */}
                  <rect
                    x={node.x} y={node.y}
                    width={w} height={h}
                    rx={isRoot ? 14 : 8}
                    fill={isRoot ? "#1e1040" : isSel ? "#1a1a3a" : isHov ? "#16162e" : "#111128"}
                    stroke={accent}
                    strokeWidth={isSel ? 2 : isHov ? 1.5 : 1}
                    strokeOpacity={isSel ? 1 : isHov ? 0.7 : 0.3}
                  />

                  {/* Left accent bar (dirs only) */}
                  {!isRoot && (
                    <rect
                      x={node.x} y={node.y + 4}
                      width={3} height={h - 8}
                      rx={2}
                      fill={isFile ? fileColor : accent}
                      fillOpacity={isSel || isHov ? 1 : 0.55}
                    />
                  )}

                  {/* Root label */}
                  {isRoot && (
                    <>
                      <text x={node.x + w / 2} y={node.y + 18}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#e9d5ff"
                        style={{ fontSize: 14, fontWeight: 700 }}>
                        {node.label.length > 18 ? node.label.slice(0, 17) + "…" : node.label}
                      </text>
                      <text x={node.x + w / 2} y={node.y + 36}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#a78bfa" fillOpacity={0.7}
                        style={{ fontSize: 10 }}>
                        {node.meta}
                      </text>
                    </>
                  )}

                  {/* Dir / file label */}
                  {!isRoot && (
                    <>
                      {/* Folder icon for dirs */}
                      {isDir && (
                        <text x={node.x + 12} y={node.y + h / 2 - 5}
                          dominantBaseline="middle" fill={accent} fillOpacity={0.8}
                          style={{ fontSize: 11, fontFamily: "monospace" }}>📁</text>
                      )}
                      {isFile && (
                        <text x={node.x + 12} y={node.y + h / 2 - 5}
                          dominantBaseline="middle" fill={fileColor} fillOpacity={0.8}
                          style={{ fontSize: 10, fontFamily: "monospace" }}>📄</text>
                      )}

                      <text
                        x={node.x + 28} y={node.y + (node.meta ? h / 2 - 6 : h / 2)}
                        dominantBaseline="middle"
                        fill={isFile ? fileColor : "#e2e8f0"}
                        style={{ fontSize: 11, fontWeight: isDir ? 600 : 400 }}
                      >
                        {node.label.length > 16 ? node.label.slice(0, 15) + "…" : node.label}
                      </text>

                      {node.meta && (
                        <text x={node.x + 28} y={node.y + h / 2 + 7}
                          dominantBaseline="middle"
                          fill={accent} fillOpacity={0.6}
                          style={{ fontSize: 9 }}>
                          {node.meta.length > 22 ? node.meta.slice(0, 21) + "…" : node.meta}
                        </text>
                      )}
                    </>
                  )}

                  {/* Collapse toggle button for dirs */}
                  {isDir && (
                    <g onClick={(e) => toggleCollapse(node.id, e)} style={{ cursor: "pointer" }}>
                      <circle
                        cx={node.x + w - 11} cy={node.y + h / 2}
                        r={9}
                        fill="#0d0d22"
                        stroke={accent} strokeWidth={1.5}
                      />
                      <text
                        x={node.x + w - 11} y={node.y + h / 2}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={accent}
                        style={{ fontSize: 13, fontWeight: 700, userSelect: "none" }}
                      >
                        {isCol ? "+" : "−"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hint */}
        <div className="absolute bottom-3 right-4 text-xs text-gray-600 pointer-events-none text-right space-y-0.5">
          <p>Scroll to zoom · drag to pan</p>
          <p>Click folder to query · +/− to expand</p>
        </div>
      </div>
    </motion.div>
  );
}

// Made with Bob
