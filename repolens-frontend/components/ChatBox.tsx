/**
 * ChatBox Component
 * Handles user question input and submission
 */

"use client";

import { useState } from "react";

interface ChatBoxProps {
  onSendMessage: (question: string) => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ChatBox({
  onSendMessage,
  disabled = false,
  isLoading = false,
}: ChatBoxProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim() || disabled || isLoading) return;

    onSendMessage(question.trim());
    setQuestion(""); // Clear input after sending
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "Please ingest a repository first..."
              : "Ask a question about the codebase..."
          }
          disabled={disabled || isLoading}
          rows={3}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none text-gray-800"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || isLoading || !question.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium self-end"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Thinking...
            </span>
          ) : (
            "Send"
          )}
        </button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}

// Made with Bob
