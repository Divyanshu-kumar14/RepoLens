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
      timeout: 120000, // 2 minute timeout for AI operations
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
   * Poll ingestion status until completion or failure
   * @param repoId - Repository identifier
   * @param onProgress - Callback for progress updates
   * @param pollInterval - Polling interval in milliseconds (default: 2000)
   * @param maxAttempts - Maximum polling attempts (default: 60 = 2 minutes)
   * @param signal - AbortSignal to cancel polling
   * @returns Final ingestion status
   */
  async pollIngestionStatus(
    repoId: string,
    onProgress?: (status: IngestionStatus) => void,
    pollInterval: number = 2000,
    maxAttempts: number = 60,
    signal?: AbortSignal,
  ): Promise<IngestionStatus> {
    let attempts = 0;

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
            // Continue polling
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      // Start polling
      poll();
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Made with Bob
