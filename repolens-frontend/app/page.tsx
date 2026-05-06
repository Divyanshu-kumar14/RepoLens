/**
 * RepoLens - Main Page with Material 3D Design
 * Chat with Your Codebase - Enhanced UI/UX
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navigation3D from "@/components/ui/Navigation3D";
import Card3D from "@/components/ui/Card3D";
import Button3D from "@/components/ui/Button3D";
import Input3D from "@/components/ui/Input3D";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ToastContainer } from "@/components/ui/Toast";

// Issue #13: Code splitting for heavy 3D components
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  loading: () => <div className="h-screen" />,
  ssr: false,
});

const ChatInterface3D = dynamic(() => import("@/components/ChatInterface3D"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const FileTree = dynamic(() => import("@/components/FileTree"), {
  loading: () => null,
  ssr: false,
});

const MindMapVisualization = dynamic(
  () => import("@/components/MindMapVisualization"),
  {
    loading: () => null,
    ssr: false,
  },
);

const CodeHealthDashboard = dynamic(
  () => import("@/components/CodeHealthDashboard"),
  {
    loading: () => null,
    ssr: false,
  },
);
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { apiService } from "@/services/api";
import { Message, QueryRequest } from "@/types/api";
import GitHubIcon from "@mui/icons-material/GitHub";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ChatIcon from "@mui/icons-material/Chat";
import InsightsIcon from "@mui/icons-material/Insights";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BugReportIcon from "@mui/icons-material/BugReport";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SchoolIcon from "@mui/icons-material/School";

const DEFAULT_SUGGESTED_QUESTIONS = [
  "What does this project do?",
  "How does authentication work?",
  "List all API endpoints",
  "What are the main dependencies?",
  "Explain the folder structure",
  "Are there any potential security issues?",
];

const QUERY_MODE_OPTIONS = [
  { value: "explain", label: "Explain", icon: <AutoAwesomeIcon sx={{ fontSize: 16 }} /> },
  { value: "debug", label: "Debug", icon: <BugReportIcon sx={{ fontSize: 16 }} /> },
  { value: "summarize", label: "Summary", icon: <SummarizeIcon sx={{ fontSize: 16 }} /> },
  { value: "onboard", label: "Onboard", icon: <SchoolIcon sx={{ fontSize: 16 }} /> },
] as const;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const maybeResponse = error as {
      response?: { data?: { detail?: unknown } };
      message?: unknown;
    };
    if (typeof maybeResponse.response?.data?.detail === "string") {
      return maybeResponse.response.data.detail;
    }
    if (typeof maybeResponse.message === "string") {
      return maybeResponse.message;
    }
  }
  return fallback;
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException && error.name === "AbortError"
  ) || (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    ((error as { name?: unknown }).name === "AbortError" ||
      (error as { name?: unknown }).name === "CanceledError")
  );
}

export default function Home() {
  const [currentRepoId, setCurrentRepoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [ingestionProgress, setIngestionProgress] = useState(0);
  const [ingestionStage, setIngestionStage] = useState("");
  const [highlightedFile, setHighlightedFile] = useState<string | undefined>();
  const [suggestedQuestions, setSuggestedQuestions] = useState(
    DEFAULT_SUGGESTED_QUESTIONS,
  );
  const [queryMode, setQueryMode] = useState<QueryRequest["mode"]>("explain");

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

  // ── Helper: send a message for a specific repo_id using SSE streaming ──────
  // Defined FIRST because handleIngestRepo depends on it (auto-summary).
  const handleSendMessageForRepo = useCallback(
    async (
      repoId: string,
      question: string,
      mode: QueryRequest["mode"] = queryMode,
    ) => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: question,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsQuerying(true);

      // Placeholder assistant message — updated in-place as tokens arrive
      const assistantId = `assistant-${Date.now()}`;
      const placeholderMessage: Message = {
        id: assistantId,
        type: "assistant",
        content: "",
        sources: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        const abortController = new AbortController();
        queryAbortControllerRef.current = abortController;

        let accumulated = "";
        for await (const event of apiService.streamQuery(
          repoId,
          question,
          abortController.signal,
          mode,
        )) {
          if (event.error) {
            throw new Error(event.error);
          }
          if (event.token) {
            accumulated += event.token;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated } : m,
              ),
            );
          }
          if (event.sources) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, sources: event.sources } : m,
              ),
            );
          }
        }

        // Empty stream → fall back to non-streaming endpoint
        if (!accumulated) {
          const response = await apiService.queryRepository(repoId, question, mode);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: response.answer, sources: response.sources }
                : m,
            ),
          );
        }
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        // Stream error → fall back to regular query
        try {
          const response = await apiService.queryRepository(repoId, question, mode);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: response.answer, sources: response.sources }
                : m,
            ),
          );
        } catch (fallbackErr: unknown) {
          toast.error(
            getErrorMessage(fallbackErr, "Failed to get answer"),
          );
          // Remove the empty placeholder on total failure
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
      } finally {
        setIsQuerying(false);
        queryAbortControllerRef.current = null;
      }
    },
    [queryMode, toast],
  );

  // ── Ingest handler ──────────────────────────────────────────────────────────
  const handleIngestRepo = useCallback(async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    setIsIngesting(true);
    setIngestionProgress(0);
    setIngestionStage("Starting...");
    try {
      // Bug Fix H3: Create abort controller for ingestion polling
      // so it cancels on unmount (cleanup is in useEffect above)
      ingestAbortControllerRef.current?.abort();
      const controller = new AbortController();
      ingestAbortControllerRef.current = controller;

      const response = await apiService.ingestRepository(repoUrl);

      await apiService.pollIngestionStatus(response.repo_id, (status) => {
        setIngestionProgress(status.progress ?? 0);
        setIngestionStage(status.stage ?? "Processing...");
      }, controller.signal);

      setCurrentRepoId(response.repo_id);
      setMessages([]);
      setIngestionProgress(100);
      setIngestionStage("Ready!");
      toast.success(
        response.reused
          ? "Existing repository index reused!"
          : "Repository ingested successfully!",
      );

      apiService
        .getRepositorySummary(response.repo_id)
        .then((summary) => {
          if (summary.suggested_questions.length > 0) {
            setSuggestedQuestions(summary.suggested_questions);
          }
        })
        .catch(() => setSuggestedQuestions(DEFAULT_SUGGESTED_QUESTIONS));

      // Auto-summarize after ingestion (Feature 2)
      // Use the repo_id directly from response — don't rely on currentRepoId state
      // which may not have propagated yet.
      setTimeout(() => {
        handleSendMessageForRepo(
          response.repo_id,
          "Give me a concise overview of this repository: its main purpose, tech stack, key features, and folder structure.",
          "summarize",
        );
      }, 500);
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Failed to ingest repository"),
      );
    } finally {
      setIsIngesting(false);
    }
  }, [repoUrl, toast, handleSendMessageForRepo]);

  // Handle sending a question with cancellation support (Issue #15)
  const handleSendMessage = useCallback(
    async (question: string) => {
      if (!currentRepoId) {
        toast.error("Please ingest a repository first");
        return;
      }
      await handleSendMessageForRepo(currentRepoId, question);
    },
    [currentRepoId, handleSendMessageForRepo, toast],
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
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Repository Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="features"
          className="flex justify-center scroll-mt-24"
        >
          <Card3D elevation={3} className="w-full max-w-3xl p-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get Started
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
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
                  className="py-4 space-y-3"
                >
                  {/* Stage Label */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      {ingestionStage}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-mono">
                      {ingestionProgress}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: "0%" }}
                      animate={{ width: `${ingestionProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  {/* Step Indicators */}
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
                    {[
                      { label: "Cloning", at: 15 },
                      { label: "Reading", at: 35 },
                      { label: "Chunking", at: 50 },
                      { label: "Embedding", at: 70 },
                      { label: "Indexing", at: 85 },
                    ].map((step) => {
                      const isCompleted = ingestionProgress > step.at;
                      const isActive =
                        ingestionProgress >= step.at - 10 && !isCompleted;
                      return (
                        <span
                          key={step.label}
                          className={
                            isCompleted
                              ? "text-green-500 dark:text-green-400 font-medium"
                              : isActive
                                ? "text-blue-500 dark:text-blue-400 font-medium"
                                : ""
                          }
                        >
                          {isCompleted ? "✓ " : ""}
                          {step.label}
                        </span>
                      );
                    })}
                  </div>
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
            className="flex flex-col items-center gap-6"
          >
            {/* Suggested Question Chips */}
            {messages.length <= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-6xl"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center font-medium">
                  💡 Try asking:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((q) => (
                    <motion.button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      disabled={isQuerying}
                      className="glass px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
              {QUERY_MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQueryMode(option.value)}
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                    queryMode === option.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-white/10"
                  }`}
                  aria-pressed={queryMode === option.value}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>

            {/* Two-Column Layout: File Tree (Left) + Chat (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-4 w-full max-w-[1400px]">
              {/* Left Sidebar - File Tree */}
              <div className="flex-shrink-0 flex flex-col h-[600px] overflow-hidden">
                <FileTree
                  repoId={currentRepoId}
                  highlightedFile={highlightedFile}
                  onFileClick={(path) => {
                    setHighlightedFile(path);
                    handleSendMessage(
                      `Explain what the file "${path}" does and its role in the project.`,
                    );
                  }}
                />
              </div>

              {/* Chat Interface */}
              <div className="flex-1 min-w-0">
                <ChatInterface3D
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isQuerying}
                  disabled={!currentRepoId}
                />
              </div>
            </div>

            {/* Mind Map - Full Width Below Chat */}
            <div className="w-full max-w-[1400px]">
              <MindMapVisualization
                repoId={currentRepoId}
                onNodeClick={(question) => handleSendMessage(question)}
              />
            </div>

            {/* Code Health Dashboard - Full Width Below Mind Map */}
            <div className="w-full max-w-[1400px]">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <CodeHealthDashboard repoId={currentRepoId} />
              </div>
            </div>
          </motion.div>
        )}

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="how-it-works"
          className="space-y-12 scroll-mt-24"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
              Three steps to understand any codebase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <GitHubIcon className="text-4xl" />,
                step: "01",
                title: "Paste a GitHub URL",
                description:
                  "Drop any public repository link — RepoLens clones it, chunks every file, and generates semantic embeddings in seconds.",
              },
              {
                icon: <AutoAwesomeIcon className="text-4xl" />,
                step: "02",
                title: "AI Understands Your Code",
                description:
                  "IBM Granite models via watsonx.ai build a deep understanding of your entire codebase using RAG with ChromaDB vector search.",
              },
              {
                icon: <ChatIcon className="text-4xl" />,
                step: "03",
                title: "Ask Anything",
                description:
                  "Chat in plain English — get instant, streaming answers with source file citations. Explore via the interactive mind map and file tree.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                <Card3D className="text-center h-full flex flex-col items-center justify-center p-8">
                  <div className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-3 tracking-widest">
                    STEP {feature.step}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
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
          className="scroll-mt-24 space-y-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About RepoLens
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
              Built in a single day with IBM Bob — from idea to working product
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <ChatIcon className="text-3xl" />,
                title: "Natural Language Chat",
                description: "Ask questions in plain English and get streaming, source-cited answers in real time.",
              },
              {
                icon: <AccountTreeIcon className="text-3xl" />,
                title: "Interactive Mind Map",
                description: "Explore your entire repo structure visually — pan, zoom, expand folders, click to query.",
              },
              {
                icon: <InsightsIcon className="text-3xl" />,
                title: "Code Health Dashboard",
                description: "Language breakdown, file distribution, and complexity stats at a glance.",
              },
              {
                icon: <AutoAwesomeIcon className="text-3xl" />,
                title: "Powered by Granite",
                description: "IBM watsonx.ai Granite models with LangChain RAG and ChromaDB vector search.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card3D className="h-full flex flex-col items-center text-center p-6">
                  <div className="text-blue-600 dark:text-blue-400 mb-3 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </Card3D>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            {["FastAPI", "LangChain", "watsonx.ai", "ChromaDB", "Next.js", "IBM Bob"].map((tech) => (
              <span key={tech} className="glass px-5 py-2 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
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
