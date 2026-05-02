/**
 * API Service Layer
 * Handles all communication with the FastAPI backend
 */

import axios, { AxiosInstance } from "axios";
import {
  IngestRequest,
  IngestResponse,
  IngestionStatus,
  QueryRequest,
  QueryResponse,
  HealthResponse,
} from "@/types/api";

// Backend API base URL - defaults to localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      // No timeout - allow AI operations to complete naturally
      timeout: 0,
    });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>("/api/health");
    return response.data;
  }

  /**
   * Ingest a GitHub repository
   * @param repoUrl - GitHub repository URL
   * @returns Repository ID and initial status
   */
  async ingestRepository(repoUrl: string): Promise<IngestResponse> {
    const request: IngestRequest = { repo_url: repoUrl };
    const response = await this.client.post<IngestResponse>(
      "/api/ingest",
      request,
    );
    return response.data;
  }

  /**
   * Get ingestion status for a repository
   * @param repoId - Repository identifier
   * @returns Current ingestion status and progress
   */
  async getIngestionStatus(repoId: string): Promise<IngestionStatus> {
    const response = await this.client.get<IngestionStatus>(
      `/api/ingest/${repoId}/status`,
    );
    return response.data;
  }

  /**
   * Query a repository with a natural language question
   * @param repoId - Repository identifier
   * @param question - Natural language question
   * @returns Answer and source references
   */
  async queryRepository(
    repoId: string,
    question: string,
  ): Promise<QueryResponse> {
    const request: QueryRequest = { repo_id: repoId, question };
    const response = await this.client.post<QueryResponse>(
      "/api/query",
      request,
    );
    return response.data;
  }

  /**
   * Poll ingestion status with adaptive polling (Issue #12)
   * @param repoId - Repository identifier
   * @param onProgress - Callback for progress updates
   * @param signal - AbortSignal to cancel polling
   * @returns Final ingestion status
   */
  async pollIngestionStatus(
    repoId: string,
    onProgress?: (status: IngestionStatus) => void,
    signal?: AbortSignal,
  ): Promise<IngestionStatus> {
    let attempts = 0;
    let networkErrors = 0;        // consecutive network error counter
    const maxNetworkErrors = 5;   // tolerate up to 5 transient errors before giving up
    let pollInterval = 1000;      // start at 1s
    const maxInterval = 3000;     // cap at 3s (don't spam but stay responsive)
    const maxAttempts = 240;      // 4 min at 1s, longer with backoff — outlasts 180s clone


    return new Promise((resolve, reject) => {
      const poll = async () => {
        // Check if polling was cancelled
        if (signal?.aborted) {
          reject(new Error("Polling cancelled"));
          return;
        }

        // Check if max attempts exceeded
        if (attempts >= maxAttempts) {
          reject(
            new Error(
              "Ingestion timeout - exceeded maximum attempts. Please try again.",
            ),
          );
          return;
        }

        attempts++;

        try {
          const status = await this.getIngestionStatus(repoId);
          networkErrors = 0; // reset on success

          // Call progress callback if provided
          if (onProgress) {
            onProgress(status);
          }

          // Check if ingestion is complete
          if (status.status === "completed") {
            resolve(status);
          } else if (status.status === "failed") {
            reject(new Error(status.error || "Ingestion failed"));
          } else {
            // Adaptive polling: increase interval as progress increases
            if (status.progress && status.progress > 50) {
              pollInterval = Math.min(pollInterval * 1.2, maxInterval);
            }
            setTimeout(poll, pollInterval);
          }
        } catch (error: any) {
          networkErrors++;
          // Tolerate transient network errors (server restart, 503, etc.)
          if (networkErrors <= maxNetworkErrors) {
            console.warn(`Poll attempt ${attempts} failed (network error ${networkErrors}/${maxNetworkErrors}), retrying...`);
            setTimeout(poll, pollInterval);
          } else {
            reject(error);
          }
        }
      };

      // Start polling
      poll();
    });
  }
  /**
   * Stream a repository query as Server-Sent Events
   * Yields parsed SSE event objects: {token?, sources?, error?}
   */
  async *streamQuery(
    repoId: string,
    question: string,
    signal?: AbortSignal,
  ): AsyncGenerator<{ token?: string; sources?: { file_path: string }[]; error?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/query/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_id: repoId, question }),
      signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Stream failed" }));
      throw new Error(err.detail || `HTTP ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          yield JSON.parse(data);
        } catch {
          // ignore malformed SSE lines
        }
      }
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Made with Bob
