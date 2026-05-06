/**
 * TypeScript types matching backend API models
 * Ensures type safety for API communication
 */

export interface IngestRequest {
  repo_url: string;
}

export interface IngestResponse {
  repo_id: string;
  status: string;
  message?: string;
  reused?: boolean;
}

export interface IngestionStatus {
  repo_id: string;
  status: "completed" | "processing" | "failed" | "not_found";
  progress?: number;
  stage?: string;
  error?: string;
  stats?: Record<string, unknown>;
}

export interface QueryRequest {
  repo_id: string;
  question: string;
  mode?: "explain" | "debug" | "summarize" | "onboard";
}

export interface Source {
  file_path: string;
  content?: string;
  line_start?: number;
  line_end?: number;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
  repo_id: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  watsonx_configured: boolean;
}

export interface RepoSummaryResponse {
  repo_id: string;
  summary: string;
  suggested_questions: string[];
  stats: Record<string, unknown>;
  code_health: Record<string, unknown>;
}

export interface RepositoryTreeNode {
  id: string;
  label: string;
  type: "dir" | "file";
  file_count?: number;
  languages?: string[];
  color: string;
  ext?: string;
  language?: string;
  children: RepositoryTreeNode[];
  depth: number;
}

export interface RepositoryStructureResponse {
  repo_id: string;
  root: { name: string; type: string };
  nodes?: unknown[];
  total_files: number;
  tree: RepositoryTreeNode[];
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
}

// Made with Bob
