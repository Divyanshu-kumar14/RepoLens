/**
 * RepoLens - Main Page with Material 3D Design
 * Chat with Your Codebase - Enhanced UI/UX
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navigation3D from "@/components/ui/Navigation3D";
import Hero3D from "@/components/Hero3D";
import ChatInterface3D from "@/components/ChatInterface3D";
import Card3D from "@/components/ui/Card3D";
import Button3D from "@/components/ui/Button3D";
import Input3D from "@/components/ui/Input3D";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ToastContainer } from "@/components/ui/Toast";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { apiService } from "@/services/api";
import { Message } from "@/types/api";
import GitHubIcon from "@mui/icons-material/GitHub";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";

export default function Home() {
  const [currentRepoId, setCurrentRepoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  const { isDarkMode, toggleTheme, mounted } = useTheme();
  const toast = useToast();

  // AbortController refs for cleanup
  const queryAbortControllerRef = useRef<AbortController | null>(null);
  const ingestAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      queryAbortControllerRef.current?.abort();
      ingestAbortControllerRef.current?.abort();
    };
  }, []);

  // Handle repository ingestion
  const handleIngestRepo = useCallback(async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    setIsIngesting(true);
    try {
      const response = await apiService.ingestRepository(repoUrl);

      // Wait for the background ingestion task to complete
      await apiService.pollIngestionStatus(response.repo_id);

      setCurrentRepoId(response.repo_id);
      setMessages([]);
      toast.success("Repository ingested successfully!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail ||
          err.message ||
          "Failed to ingest repository",
      );
    } finally {
      setIsIngesting(false);
    }
  }, [repoUrl, toast]);

  // Handle sending a question
  const handleSendMessage = useCallback(
    async (question: string) => {
      if (!currentRepoId) {
        toast.error("Please ingest a repository first");
        return;
      }

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: question,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsQuerying(true);

      try {
        const response = await apiService.queryRepository(
          currentRepoId,
          question,
        );

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: response.answer,
          sources: response.sources,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        toast.error(
          err.response?.data?.detail || err.message || "Failed to get answer",
        );

        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          type: "assistant",
          content: `Sorry, I encountered an error: ${err.response?.data?.detail || err.message || "Unknown error"}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsQuerying(false);
      }
    },
    [currentRepoId, toast],
  );

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen surface">
      {/* Navigation */}
      <Navigation3D onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />

      {/* Hero Section */}
      <Hero3D />

      {/* Main Content */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Repository Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="features"
          className="flex justify-center"
        >
          <Card3D elevation={3} className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Get Started
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Enter a GitHub repository URL to begin analyzing your codebase
              </p>
            </div>

            <div className="space-y-4">
              <Input3D
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/Divyanshu-kumar14/RepoLens.git"
                icon={<GitHubIcon />}
                fullWidth
                disabled={isIngesting}
              />

              <Button3D
                onClick={handleIngestRepo}
                variant="primary"
                size="lg"
                fullWidth
                loading={isIngesting}
                disabled={isIngesting || !repoUrl.trim()}
                icon={<RocketLaunchIcon />}
              >
                {isIngesting ? "Ingesting Repository..." : "Ingest Repository"}
              </Button3D>

              {isIngesting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-center py-4"
                >
                  <LoadingSpinner
                    variant="dots"
                    text="Analyzing your codebase... This may take a minute."
                  />
                </motion.div>
              )}

              {currentRepoId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircleIcon className="text-green-500 flex-shrink-0" />
                  <div className="flex-1 text-center md:text-left">
                    <p className="font-medium">Repository Ready!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Start asking questions below
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card3D>
        </motion.div>

        {/* Chat Interface */}
        {currentRepoId && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <ChatInterface3D
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isQuerying}
              disabled={!currentRepoId}
            />
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="how-it-works"
          className="space-y-12"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              RepoLens uses advanced AI to understand and analyze your codebase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <CodeIcon className="text-4xl" />,
                title: "Code Analysis",
                description:
                  "Deep semantic understanding of your repository structure and code patterns",
              },
              {
                icon: <SpeedIcon className="text-4xl" />,
                title: "Instant Answers",
                description:
                  "Get responses in seconds with relevant source code references",
              },
              {
                icon: <SecurityIcon className="text-4xl" />,
                title: "Secure & Private",
                description:
                  "Your code is processed securely with enterprise-grade AI",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card3D className="text-center h-full flex flex-col items-center justify-center p-8">
                  <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="about"
          className="flex justify-center"
        >
          <Card3D elevation={3} className="w-full max-w-4xl text-center p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About RepoLens
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
              RepoLens is powered by IBM watsonx.ai Granite models, providing
              enterprise-grade AI capabilities for code understanding and
              analysis. Built with FastAPI, LangChain, and ChromaDB for optimal
              performance.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="glass px-5 py-2 rounded-full text-sm font-medium">
                FastAPI
              </span>
              <span className="glass px-5 py-2 rounded-full text-sm font-medium">
                LangChain
              </span>
              <span className="glass px-5 py-2 rounded-full text-sm font-medium">
                watsonx.ai
              </span>
              <span className="glass px-5 py-2 rounded-full text-sm font-medium">
                ChromaDB
              </span>
              <span className="glass px-5 py-2 rounded-full text-sm font-medium">
                Next.js
              </span>
            </div>
          </Card3D>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="surface-variant py-12 mt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Built with ❤️ using Material Design 3 principles
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 RepoLens. Powered by IBM watsonx.ai Granite.
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} />
    </main>
  );
}

// Made with Bob
