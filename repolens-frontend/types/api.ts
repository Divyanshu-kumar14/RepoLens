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
}

export interface IngestionStatus {
  repo_id: string;
  status: "completed" | "processing" | "failed" | "not_found";
  progress?: number;
  error?: string;
}

export interface QueryRequest {
  repo_id: string;
  question: string;
}

export interface Source {
  file_path: string;
  content?: string;
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

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
}

// Made with Bob
