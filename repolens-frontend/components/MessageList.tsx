/**
 * MessageList Component
 * Displays chat messages with user questions and AI answers
 */

"use client";

import { Message } from "@/types/api";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p className="text-center">
          No messages yet.
          <br />
          Ask a question about your repository to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.type === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {/* Message Content */}
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* Sources (for assistant messages) */}
            {message.type === "assistant" &&
              message.sources &&
              message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    📁 Sources:
                  </p>
                  <div className="space-y-1">
                    {message.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-600 bg-white rounded px-2 py-1"
                      >
                        {source.file_path}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Timestamp */}
            <div
              className={`text-xs mt-2 ${
                message.type === "user" ? "text-blue-200" : "text-gray-500"
              }`}
            >
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Made with Bob
