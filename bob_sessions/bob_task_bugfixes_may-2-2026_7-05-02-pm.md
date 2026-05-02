**User:**

<task>
resolve this error - [browser] Encountered two children with the same key, `app`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 
[browser] Encountered two children with the same key, `services`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 
[browser] Encountered two children with the same key, `skills`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 
[browser] Encountered two children with the same key, `app`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 
[browser] Encountered two children with the same key, `services`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
</task>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs


# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T13:30:16.758Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>


# Current Workspace Directory (/home/rtx/RepoLens) Files
.gitignore
AGENTS.md
ARCHITECTURE_BLUEPRINT.md
LICENSE
QUICKSTART.md
README.md
.bob/
bob_sessions/
bob_sessions/bob_task_add_more_features_may-2-2026_1-35-20-pm.md
bob_sessions/bob_task_add_more_features_may-2-2026_1-35-20-pm.png
bob_sessions/bob_task_architecture_blueprint_may-1-2026_8-58-48-pm.md
bob_sessions/bob_task_architecture_blueprint_may-1-2026_8-58-48-pm.png
bob_sessions/bob_task_bug_fixes_may-2-2026_12-39-06-pm.md
bob_sessions/bob_task_bug_fixes_may-2-2026_12-39-06-pm.png
bob_sessions/bob_task_debugging_may-1-2026_11-10-32-pm.md
bob_sessions/bob_task_debugging_may-1-2026_11-10-32-pm.png
bob_sessions/bob_task_fixes_the_backend_may-1-2026_11-10-32-pm.md
bob_sessions/bob_task_fixes_the_backend_may-1-2026_11-10-32-pm.png
bob_sessions/bob_task_frontend_may-2-2026_12-53-07-am
bob_sessions/bob_task_frontend_may-2-2026_12-53-07-am.png
bob_sessions/bob_task_frontend_redesign_may-2-2026_11-31-48-am.md
bob_sessions/bob_task_frontend_redesign_may-2-2026_11-31-48-am.png
bob_sessions/bob_task_may-1-2026_8-27-35-pm.md
bob_sessions/bob_task_may-1-2026_8-27-35-pm.png
repolens-backend/
repolens-backend/.env.example
repolens-backend/main.py
repolens-backend/pyproject.toml
repolens-backend/README.md
repolens-backend/requirements.txt
repolens-backend/uv.lock
repolens-backend/app/
repolens-backend/app/__init__.py
repolens-backend/app/config.py
repolens-backend/app/models.py
repolens-backend/app/rag.py
repolens-backend/app/api/
repolens-backend/app/api/__init__.py
repolens-backend/app/api/routes.py
repolens-backend/app/services/
repolens-backend/app/services/__init__.py
repolens-backend/app/services/ingestion.py
repolens-backend/app/services/query.py
repolens-backend/app/services/stream.py
repolens-frontend/
repolens-frontend/.env.example
repolens-frontend/AGENTS.md
repolens-frontend/CHATBOX_AUTOSCROLL_FIX.md
repolens-frontend/CODE_REVIEW_REPORT.md
repolens-frontend/DESIGN_SYSTEM.md
repolens-frontend/eslint.config.mjs
repolens-frontend/next-env.d.ts
repolens-frontend/next.config.ts
repolens-frontend/package-lock.json
repolens-frontend/package.json
repolens-frontend/postcss.config.mjs
repolens-frontend/README.md
repolens-frontend/tsconfig.json
repolens-frontend/tsconfig.tsbuildinfo
repolens-frontend/app/
repolens-frontend/app/favicon.ico
repolens-frontend/app/globals.css
repolens-frontend/app/layout.tsx
repolens-frontend/app/page.tsx
repolens-frontend/components/
repolens-frontend/components/ChatBox.tsx
repolens-frontend/components/ChatInterface3D.tsx
repolens-frontend/components/CodeHealthDashboard.tsx
repolens-frontend/components/ErrorBoundary.tsx
repolens-frontend/components/FileTree.tsx
repolens-frontend/components/Hero3D.tsx
repolens-frontend/components/MessageList.tsx
repolens-frontend/components/MindMapVisualization.tsx
repolens-frontend/components/RepoInput.tsx
repolens-frontend/components/ui/
repolens-frontend/components/ui/Button3D.tsx
repolens-frontend/components/ui/Card3D.tsx
repolens-frontend/components/ui/Input3D.tsx
repolens-frontend/components/ui/LoadingSpinner.tsx
repolens-frontend/components/ui/MarkdownRenderer.tsx
repolens-frontend/components/ui/Navigation3D.tsx
repolens-frontend/components/ui/Toast.tsx
repolens-frontend/hooks/
repolens-frontend/hooks/useTheme.ts
repolens-frontend/hooks/useToast.ts
repolens-frontend/public/
repolens-frontend/public/file.svg
repolens-frontend/public/globe.svg
repolens-frontend/public/next.svg
repolens-frontend/public/vercel.svg
repolens-frontend/public/window.svg
repolens-frontend/services/
repolens-frontend/services/api.ts
repolens-frontend/types/
repolens-frontend/types/api.ts
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

The Navigation3D component looks fine. The issue is likely in the page.tsx file where the navigation links are being rendered. Let me check the main page component:

<read_file>
<path>repolens-frontend/app/page.tsx</path>
</read_file>

---

**User:**

[read_file for 'repolens-frontend/app/page.tsx'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>repolens-frontend/app/page.tsx</path>
<content lines="1-572">
  1 | /**
  2 |  * RepoLens - Main Page with Material 3D Design
  3 |  * Chat with Your Codebase - Enhanced UI/UX
  4 |  */
  5 | 
  6 | "use client";
  7 | 
  8 | import { useState, useRef, useEffect, useCallback } from "react";
  9 | import { motion } from "framer-motion";
 10 | import dynamic from "next/dynamic";
 11 | import Navigation3D from "@/components/ui/Navigation3D";
 12 | import Card3D from "@/components/ui/Card3D";
 13 | import Button3D from "@/components/ui/Button3D";
 14 | import Input3D from "@/components/ui/Input3D";
 15 | import LoadingSpinner from "@/components/ui/LoadingSpinner";
 16 | import { ToastContainer } from "@/components/ui/Toast";
 17 | 
 18 | // Issue #13: Code splitting for heavy 3D components
 19 | const Hero3D = dynamic(() => import("@/components/Hero3D"), {
 20 |   loading: () => <div className="h-screen" />,
 21 |   ssr: false,
 22 | });
 23 | 
 24 | const ChatInterface3D = dynamic(() => import("@/components/ChatInterface3D"), {
 25 |   loading: () => <LoadingSpinner />,
 26 |   ssr: false,
 27 | });
 28 | 
 29 | const FileTree = dynamic(() => import("@/components/FileTree"), {
 30 |   loading: () => null,
 31 |   ssr: false,
 32 | });
 33 | 
 34 | const MindMapVisualization = dynamic(
 35 |   () => import("@/components/MindMapVisualization"),
 36 |   {
 37 |     loading: () => null,
 38 |     ssr: false,
 39 |   },
 40 | );
 41 | 
 42 | const CodeHealthDashboard = dynamic(
 43 |   () => import("@/components/CodeHealthDashboard"),
 44 |   {
 45 |     loading: () => null,
 46 |     ssr: false,
 47 |   },
 48 | );
 49 | import { useTheme } from "@/hooks/useTheme";
 50 | import { useToast } from "@/hooks/useToast";
 51 | import { apiService } from "@/services/api";
 52 | import { Message } from "@/types/api";
 53 | import GitHubIcon from "@mui/icons-material/GitHub";
 54 | import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
 55 | import CheckCircleIcon from "@mui/icons-material/CheckCircle";
 56 | import CodeIcon from "@mui/icons-material/Code";
 57 | import SpeedIcon from "@mui/icons-material/Speed";
 58 | import SecurityIcon from "@mui/icons-material/Security";
 59 | 
 60 | export default function Home() {
 61 |   const [currentRepoId, setCurrentRepoId] = useState<string | null>(null);
 62 |   const [messages, setMessages] = useState<Message[]>([]);
 63 |   const [isQuerying, setIsQuerying] = useState(false);
 64 |   const [isIngesting, setIsIngesting] = useState(false);
 65 |   const [repoUrl, setRepoUrl] = useState("");
 66 |   const [ingestionProgress, setIngestionProgress] = useState(0);
 67 |   const [ingestionStage, setIngestionStage] = useState("");
 68 |   const [highlightedFile, setHighlightedFile] = useState<string | undefined>();
 69 | 
 70 |   const SUGGESTED_QUESTIONS = [
 71 |     "What does this project do?",
 72 |     "How does authentication work?",
 73 |     "List all API endpoints",
 74 |     "What are the main dependencies?",
 75 |     "Explain the folder structure",
 76 |     "Are there any potential security issues?",
 77 |   ];
 78 | 
 79 |   const { isDarkMode, toggleTheme, mounted } = useTheme();
 80 |   const toast = useToast();
 81 | 
 82 |   // AbortController refs for cleanup
 83 |   const queryAbortControllerRef = useRef<AbortController | null>(null);
 84 |   const ingestAbortControllerRef = useRef<AbortController | null>(null);
 85 | 
 86 |   // Cleanup on unmount
 87 |   useEffect(() => {
 88 |     return () => {
 89 |       queryAbortControllerRef.current?.abort();
 90 |       ingestAbortControllerRef.current?.abort();
 91 |     };
 92 |   }, []);
 93 | 
 94 |   // ── Helper: send a message for a specific repo_id using SSE streaming ──────
 95 |   // Defined FIRST because handleIngestRepo depends on it (auto-summary).
 96 |   const handleSendMessageForRepo = useCallback(
 97 |     async (repoId: string, question: string) => {
 98 |       const userMessage: Message = {
 99 |         id: `user-${Date.now()}`,
100 |         type: "user",
101 |         content: question,
102 |         timestamp: new Date(),
103 |       };
104 |       setMessages((prev) => [...prev, userMessage]);
105 |       setIsQuerying(true);
106 | 
107 |       // Placeholder assistant message — updated in-place as tokens arrive
108 |       const assistantId = `assistant-${Date.now()}`;
109 |       const placeholderMessage: Message = {
110 |         id: assistantId,
111 |         type: "assistant",
112 |         content: "",
113 |         sources: [],
114 |         timestamp: new Date(),
115 |       };
116 |       setMessages((prev) => [...prev, placeholderMessage]);
117 | 
118 |       try {
119 |         const abortController = new AbortController();
120 |         queryAbortControllerRef.current = abortController;
121 | 
122 |         let accumulated = "";
123 |         for await (const event of apiService.streamQuery(
124 |           repoId,
125 |           question,
126 |           abortController.signal,
127 |         )) {
128 |           if (event.error) {
129 |             throw new Error(event.error);
130 |           }
131 |           if (event.token) {
132 |             accumulated += event.token;
133 |             setMessages((prev) =>
134 |               prev.map((m) =>
135 |                 m.id === assistantId ? { ...m, content: accumulated } : m,
136 |               ),
137 |             );
138 |           }
139 |           if (event.sources) {
140 |             setMessages((prev) =>
141 |               prev.map((m) =>
142 |                 m.id === assistantId ? { ...m, sources: event.sources } : m,
143 |               ),
144 |             );
145 |           }
146 |         }
147 | 
148 |         // Empty stream → fall back to non-streaming endpoint
149 |         if (!accumulated) {
150 |           const response = await apiService.queryRepository(repoId, question);
151 |           setMessages((prev) =>
152 |             prev.map((m) =>
153 |               m.id === assistantId
154 |                 ? { ...m, content: response.answer, sources: response.sources }
155 |                 : m,
156 |             ),
157 |           );
158 |         }
159 |       } catch (err: any) {
160 |         if (err.name === "AbortError" || err.name === "CanceledError") return;
161 |         // Stream error → fall back to regular query
162 |         try {
163 |           const response = await apiService.queryRepository(repoId, question);
164 |           setMessages((prev) =>
165 |             prev.map((m) =>
166 |               m.id === assistantId
167 |                 ? { ...m, content: response.answer, sources: response.sources }
168 |                 : m,
169 |             ),
170 |           );
171 |         } catch (fallbackErr: any) {
172 |           toast.error(
173 |             fallbackErr.response?.data?.detail ||
174 |               fallbackErr.message ||
175 |               "Failed to get answer",
176 |           );
177 |           // Remove the empty placeholder on total failure
178 |           setMessages((prev) => prev.filter((m) => m.id !== assistantId));
179 |         }
180 |       } finally {
181 |         setIsQuerying(false);
182 |         queryAbortControllerRef.current = null;
183 |       }
184 |     },
185 |     [toast],
186 |   );
187 | 
188 |   // ── Ingest handler ──────────────────────────────────────────────────────────
189 |   const handleIngestRepo = useCallback(async () => {
190 |     if (!repoUrl.trim()) {
191 |       toast.error("Please enter a repository URL");
192 |       return;
193 |     }
194 | 
195 |     setIsIngesting(true);
196 |     setIngestionProgress(0);
197 |     setIngestionStage("Starting...");
198 |     try {
199 |       const response = await apiService.ingestRepository(repoUrl);
200 | 
201 |       await apiService.pollIngestionStatus(response.repo_id, (status) => {
202 |         setIngestionProgress(status.progress ?? 0);
203 |         setIngestionStage(status.stage ?? "Processing...");
204 |       });
205 | 
206 |       setCurrentRepoId(response.repo_id);
207 |       setMessages([]);
208 |       setIngestionProgress(100);
209 |       setIngestionStage("Ready!");
210 |       toast.success("Repository ingested successfully!");
211 | 
212 |       // Auto-summarize after ingestion (Feature 2)
213 |       // Use the repo_id directly from response — don't rely on currentRepoId state
214 |       // which may not have propagated yet.
215 |       setTimeout(() => {
216 |         handleSendMessageForRepo(
217 |           response.repo_id,
218 |           "Give me a concise overview of this repository: its main purpose, tech stack, key features, and folder structure.",
219 |         );
220 |       }, 500);
221 |     } catch (err: any) {
222 |       toast.error(
223 |         err.response?.data?.detail ||
224 |           err.message ||
225 |           "Failed to ingest repository",
226 |       );
227 |     } finally {
228 |       setIsIngesting(false);
229 |     }
230 |   }, [repoUrl, toast, handleSendMessageForRepo]);
231 | 
232 |   // Handle sending a question with cancellation support (Issue #15)
233 |   const handleSendMessage = useCallback(
234 |     async (question: string) => {
235 |       if (!currentRepoId) {
236 |         toast.error("Please ingest a repository first");
237 |         return;
238 |       }
239 |       await handleSendMessageForRepo(currentRepoId, question);
240 |     },
241 |     [currentRepoId, handleSendMessageForRepo, toast],
242 |   );
243 | 
244 |   // Prevent flash of unstyled content
245 |   if (!mounted) {
246 |     return null;
247 |   }
248 | 
249 |   return (
250 |     <main className="min-h-screen surface">
251 |       {/* Navigation */}
252 |       <Navigation3D onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
253 | 
254 |       {/* Hero Section */}
255 |       <Hero3D />
256 | 
257 |       {/* Main Content */}
258 |       <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
259 |         {/* Repository Input Section */}
260 |         <motion.div
261 |           initial={{ opacity: 0, y: 30 }}
262 |           whileInView={{ opacity: 1, y: 0 }}
263 |           viewport={{ once: true }}
264 |           transition={{ duration: 0.6 }}
265 |           id="features"
266 |           className="flex justify-center"
267 |         >
268 |           <Card3D elevation={3} className="w-full max-w-3xl">
269 |             <div className="text-center mb-8">
270 |               <h2 className="text-3xl md:text-4xl font-bold mb-3">
271 |                 Get Started
272 |               </h2>
273 |               <p className="text-gray-600 dark:text-gray-400 text-lg">
274 |                 Enter a GitHub repository URL to begin analyzing your codebase
275 |               </p>
276 |             </div>
277 | 
278 |             <div className="space-y-4">
279 |               <Input3D
280 |                 value={repoUrl}
281 |                 onChange={(e) => setRepoUrl(e.target.value)}
282 |                 placeholder="https://github.com/Divyanshu-kumar14/RepoLens.git"
283 |                 icon={<GitHubIcon />}
284 |                 fullWidth
285 |                 disabled={isIngesting}
286 |               />
287 | 
288 |               <Button3D
289 |                 onClick={handleIngestRepo}
290 |                 variant="primary"
291 |                 size="lg"
292 |                 fullWidth
293 |                 loading={isIngesting}
294 |                 disabled={isIngesting || !repoUrl.trim()}
295 |                 icon={<RocketLaunchIcon />}
296 |               >
297 |                 {isIngesting ? "Ingesting Repository..." : "Ingest Repository"}
298 |               </Button3D>
299 | 
300 |               {isIngesting && (
301 |                 <motion.div
302 |                   initial={{ opacity: 0, height: 0 }}
303 |                   animate={{ opacity: 1, height: "auto" }}
304 |                   className="py-4 space-y-3"
305 |                 >
306 |                   {/* Stage Label */}
307 |                   <div className="flex items-center justify-between text-sm">
308 |                     <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
309 |                       <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
310 |                       {ingestionStage}
311 |                     </span>
312 |                     <span className="text-gray-500 dark:text-gray-400 font-mono">
313 |                       {ingestionProgress}%
314 |                     </span>
315 |                   </div>
316 |                   {/* Progress Bar */}
317 |                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
318 |                     <motion.div
319 |                       className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
320 |                       initial={{ width: "0%" }}
321 |                       animate={{ width: `${ingestionProgress}%` }}
322 |                       transition={{ duration: 0.5, ease: "easeOut" }}
323 |                     />
324 |                   </div>
325 |                   {/* Step Indicators */}
326 |                   <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
327 |                     {[
328 |                       "Cloning",
329 |                       "Reading",
330 |                       "Chunking",
331 |                       "Embedding",
332 |                       "Indexing",
333 |                     ].map((step, i) => {
334 |                       const stepProgress = (i + 1) * 20;
335 |                       const isActive = ingestionProgress >= stepProgress - 10;
336 |                       return (
337 |                         <span
338 |                           key={step}
339 |                           className={
340 |                             isActive
341 |                               ? "text-blue-500 dark:text-blue-400 font-medium"
342 |                               : ""
343 |                           }
344 |                         >
345 |                           {step}
346 |                         </span>
347 |                       );
348 |                     })}
349 |                   </div>
350 |                 </motion.div>
351 |               )}
352 | 
353 |               {currentRepoId && (
354 |                 <motion.div
355 |                   initial={{ opacity: 0, scale: 0.9 }}
356 |                   animate={{ opacity: 1, scale: 1 }}
357 |                   className="glass rounded-xl p-4 flex items-center gap-3"
358 |                 >
359 |                   <CheckCircleIcon className="text-green-500 flex-shrink-0" />
360 |                   <div className="flex-1 text-center md:text-left">
361 |                     <p className="font-medium">Repository Ready!</p>
362 |                     <p className="text-sm text-gray-600 dark:text-gray-400">
363 |                       Start asking questions below
364 |                     </p>
365 |                   </div>
366 |                 </motion.div>
367 |               )}
368 |             </div>
369 |           </Card3D>
370 |         </motion.div>
371 | 
372 |         {/* Chat Interface */}
373 |         {currentRepoId && (
374 |           <motion.div
375 |             initial={{ opacity: 0, y: 30 }}
376 |             animate={{ opacity: 1, y: 0 }}
377 |             transition={{ duration: 0.6 }}
378 |             className="flex flex-col items-center gap-6"
379 |           >
380 |             {/* Suggested Question Chips */}
381 |             {messages.length <= 2 && (
382 |               <motion.div
383 |                 initial={{ opacity: 0, y: 10 }}
384 |                 animate={{ opacity: 1, y: 0 }}
385 |                 transition={{ duration: 0.4 }}
386 |                 className="w-full max-w-6xl"
387 |               >
388 |                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center font-medium">
389 |                   💡 Try asking:
390 |                 </p>
391 |                 <div className="flex flex-wrap gap-2 justify-center">
392 |                   {SUGGESTED_QUESTIONS.map((q) => (
393 |                     <motion.button
394 |                       key={q}
395 |                       onClick={() => handleSendMessage(q)}
396 |                       disabled={isQuerying}
397 |                       className="glass px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
398 |                       whileHover={{ scale: 1.03 }}
399 |                       whileTap={{ scale: 0.97 }}
400 |                     >
401 |                       {q}
402 |                     </motion.button>
403 |                   ))}
404 |                 </div>
405 |               </motion.div>
406 |             )}
407 | 
408 |             {/* Two-Column Layout: File Tree (Left) + Chat (Right) */}
409 |             <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-4 w-full max-w-[1400px]">
410 |               {/* Left Sidebar - File Tree */}
411 |               <div className="flex-shrink-0 flex flex-col h-[600px] overflow-hidden">
412 |                 <FileTree
413 |                   repoId={currentRepoId}
414 |                   highlightedFile={highlightedFile}
415 |                   onFileClick={(path) => {
416 |                     setHighlightedFile(path);
417 |                     handleSendMessage(
418 |                       `Explain what the file "${path}" does and its role in the project.`,
419 |                     );
420 |                   }}
421 |                 />
422 |               </div>
423 | 
424 |               {/* Chat Interface */}
425 |               <div className="flex-1 min-w-0">
426 |                 <ChatInterface3D
427 |                   messages={messages}
428 |                   onSendMessage={handleSendMessage}
429 |                   isLoading={isQuerying}
430 |                   disabled={!currentRepoId}
431 |                 />
432 |               </div>
433 |             </div>
434 | 
435 |             {/* Mind Map - Full Width Below Chat */}
436 |             <div className="w-full max-w-[1400px]">
437 |               <MindMapVisualization
438 |                 repoId={currentRepoId}
439 |                 onNodeClick={(question) => handleSendMessage(question)}
440 |               />
441 |             </div>
442 | 
443 |             {/* Code Health Dashboard - Full Width Below Mind Map */}
444 |             <div className="w-full max-w-[1400px]">
445 |               <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
446 |                 <CodeHealthDashboard repoId={currentRepoId} />
447 |               </div>
448 |             </div>
449 |           </motion.div>
450 |         )}
451 | 
452 |         {/* Features Section */}
453 |         <motion.div
454 |           initial={{ opacity: 0, y: 30 }}
455 |           whileInView={{ opacity: 1, y: 0 }}
456 |           viewport={{ once: true }}
457 |           transition={{ duration: 0.6 }}
458 |           id="how-it-works"
459 |           className="space-y-12"
460 |         >
461 |           <div className="text-center max-w-3xl mx-auto">
462 |             <h2 className="text-3xl md:text-4xl font-bold mb-4">
463 |               How It Works
464 |             </h2>
465 |             <p className="text-gray-600 dark:text-gray-400 text-lg">
466 |               RepoLens uses advanced AI to understand and analyze your codebase
467 |             </p>
468 |           </div>
469 | 
470 |           <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
471 |             {[
472 |               {
473 |                 icon: <CodeIcon className="text-4xl" />,
474 |                 title: "Code Analysis",
475 |                 description:
476 |                   "Deep semantic understanding of your repository structure and code patterns",
477 |               },
478 |               {
479 |                 icon: <SpeedIcon className="text-4xl" />,
480 |                 title: "Instant Answers",
481 |                 description:
482 |                   "Get responses in seconds with relevant source code references",
483 |               },
484 |               {
485 |                 icon: <SecurityIcon className="text-4xl" />,
486 |                 title: "Secure & Private",
487 |                 description:
488 |                   "Your code is processed securely with enterprise-grade AI",
489 |               },
490 |             ].map((feature, index) => (
491 |               <motion.div
492 |                 key={feature.title}
493 |                 initial={{ opacity: 0, y: 20 }}
494 |                 whileInView={{ opacity: 1, y: 0 }}
495 |                 viewport={{ once: true }}
496 |                 transition={{ duration: 0.4, delay: index * 0.1 }}
497 |               >
498 |                 <Card3D className="text-center h-full flex flex-col items-center justify-center p-8">
499 |                   <div className="text-blue-600 dark:text-blue-400 mb-4 flex items-center justify-center">
500 |                     {feature.icon}
501 |                   </div>
502 |                   <h3 className="text-xl font-semibold mb-3">
503 |                     {feature.title}
504 |                   </h3>
505 |                   <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
506 |                     {feature.description}
507 |                   </p>
508 |                 </Card3D>
509 |               </motion.div>
510 |             ))}
511 |           </div>
512 |         </motion.div>
513 | 
514 |         {/* About Section */}
515 |         <motion.div
516 |           initial={{ opacity: 0, y: 30 }}
517 |           whileInView={{ opacity: 1, y: 0 }}
518 |           viewport={{ once: true }}
519 |           transition={{ duration: 0.6 }}
520 |           id="about"
521 |           className="flex justify-center"
522 |         >
523 |           <Card3D elevation={3} className="w-full max-w-4xl text-center p-8">
524 |             <h2 className="text-3xl md:text-4xl font-bold mb-6">
525 |               About RepoLens
526 |             </h2>
527 |             <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
528 |               RepoLens is powered by IBM watsonx.ai Granite models, providing
529 |               enterprise-grade AI capabilities for code understanding and
530 |               analysis. Built with FastAPI, LangChain, and ChromaDB for optimal
531 |               performance.
532 |             </p>
533 |             <div className="flex flex-wrap gap-3 justify-center">
534 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
535 |                 FastAPI
536 |               </span>
537 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
538 |                 LangChain
539 |               </span>
540 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
541 |                 watsonx.ai
542 |               </span>
543 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
544 |                 ChromaDB
545 |               </span>
546 |               <span className="glass px-5 py-2 rounded-full text-sm font-medium">
547 |                 Next.js
548 |               </span>
549 |             </div>
550 |           </Card3D>
551 |         </motion.div>
552 |       </section>
553 | 
554 |       {/* Footer */}
555 |       <footer className="surface-variant py-12 mt-20">
556 |         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
557 |           <p className="text-gray-600 dark:text-gray-400 mb-2">
558 |             Built with ❤️ using Material Design 3 principles
559 |           </p>
560 |           <p className="text-sm text-gray-500 dark:text-gray-500">
561 |             © 2026 RepoLens. Powered by IBM watsonx.ai Granite.
562 |           </p>
563 |         </div>
564 |       </footer>
565 | 
566 |       {/* Toast Notifications */}
567 |       <ToastContainer toasts={toast.toasts} />
568 |     </main>
569 |   );
570 | }
571 | 
572 | // Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs


# Current Time
Current time in ISO 8601 UTC format: 2026-05-02T13:34:50.419Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$6.70

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

