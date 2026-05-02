/**
 * RepoInput Component
 * Handles GitHub repository URL input and ingestion status tracking
 */

"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { IngestionStatus } from "@/types/api";

interface RepoInputProps {
  onIngestionComplete: (repoId: string) => void;
}

export default function RepoInput({ onIngestionComplete }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [currentRepoId, setCurrentRepoId] = useState<string | null>(null);
  const [ingestionStatus, setIngestionStatus] =
    useState<IngestionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate GitHub URL format
  const isValidGitHubUrl = (url: string): boolean => {
    const githubPattern =
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url);
  };

  // Handle repository ingestion
  const handleIngest = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!isValidGitHubUrl(repoUrl)) {
      setError(
        "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)",
      );
      return;
    }

    setError(null);
    setIsIngesting(true);
    setIngestionStatus(null);

    try {
      // Start ingestion
      const response = await apiService.ingestRepository(repoUrl);
      setCurrentRepoId(response.repo_id);

      // Poll for status updates
      await apiService.pollIngestionStatus(response.repo_id, (status) => {
        setIngestionStatus(status);
      });

      // Ingestion complete
      onIngestionComplete(response.repo_id);
      setIsIngesting(false);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to ingest repository",
      );
      setIsIngesting(false);
      setIngestionStatus(null);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isIngesting) {
      handleIngest();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Ingest GitHub Repository
      </h2>

      <div className="space-y-4">
        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://github.com/username/repository"
            disabled={isIngesting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
          />
          <button
            onClick={handleIngest}
            disabled={isIngesting || !repoUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isIngesting ? "Ingesting..." : "Ingest"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Ingestion Status */}
        {isIngesting && ingestionStatus && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-800 font-medium">
                Status: {ingestionStatus.status}
              </span>
              {ingestionStatus.progress !== undefined && (
                <span className="text-blue-600 text-sm">
                  {ingestionStatus.progress}%
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {ingestionStatus.progress !== undefined && (
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ingestionStatus.progress}%` }}
                />
              </div>
            )}

            {/* Repository ID */}
            {currentRepoId && (
              <p className="text-xs text-gray-600 mt-2">
                Repository ID: {currentRepoId}
              </p>
            )}
          </div>
        )}

        {/* Success Message */}
        {!isIngesting && ingestionStatus?.status === "completed" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✓ Repository ingested successfully! You can now ask questions.
            </p>
          </div>
        )}

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          Enter a public GitHub repository URL to analyze its codebase.
          Ingestion may take 1-2 minutes depending on repository size.
        </p>
      </div>
    </div>
  );
}

// Made with Bob
