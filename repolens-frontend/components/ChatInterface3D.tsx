/**
 * Material 3D Chat Interface
 * Enhanced chat UI with 3D depth and Material Design
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card3D from "./ui/Card3D";
import Button3D from "./ui/Button3D";
import Input3D from "./ui/Input3D";
import LoadingSpinner from "./ui/LoadingSpinner";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CodeIcon from "@mui/icons-material/Code";
import { Message } from "@/types/api";

interface ChatInterface3DProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInterface3D({
  messages,
  onSendMessage,
  isLoading,
  disabled = false,
}: ChatInterface3DProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Card3D className="w-full max-w-5xl mx-auto" elevation={3}>
      <div className="flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center elevation-2">
              <SmartToyIcon className="text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <p className="text-sm text-gray-500">Powered by IBM Granite</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center space-y-4 max-w-md mx-auto px-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto">
                    <CodeIcon className="text-4xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Start a Conversation
                    </h4>
                    <p className="text-sm text-gray-500">
                      Ask me anything about your codebase
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <SmartToyIcon className="text-white text-sm" />
              </div>
              <div className="glass rounded-2xl p-4 max-w-[80%]">
                <LoadingSpinner size="sm" variant="dots" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 items-end flex-shrink-0"
        >
          <div className="flex-1">
            <Input3D
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your codebase..."
              disabled={disabled || isLoading}
              fullWidth
            />
          </div>
          <Button3D
            variant="primary"
            disabled={disabled || isLoading || !input.trim()}
            icon={<SendIcon />}
            className="!rounded-xl !py-3 !px-6"
            onClick={() => handleSubmit(new Event("submit") as any)}
          >
            Send
          </Button3D>
        </form>
      </div>
    </Card3D>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.type === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-green-500 to-teal-600"
            : "bg-gradient-to-br from-blue-500 to-purple-600"
        }`}
      >
        {isUser ? (
          <PersonIcon className="text-white text-sm" />
        ) : (
          <SmartToyIcon className="text-white text-sm" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}
      >
        <motion.div
          className={`glass rounded-2xl p-4 ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "surface-variant"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </motion.div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 w-full"
          >
            <p className="text-xs text-gray-500 font-medium">Sources:</p>
            {message.sources.map((source, index) => (
              <motion.div
                key={index}
                className="glass rounded-lg p-3 text-xs"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start gap-2">
                  <CodeIcon className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-blue-600 dark:text-blue-400 truncate">
                      {source.file_path}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {source.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
}

// Made with Bob
