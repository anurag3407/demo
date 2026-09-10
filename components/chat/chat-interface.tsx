"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Square,
  Plus,
  Trash2,
  Sliders,
  ChevronDown,
  Bot,
  User,
  RefreshCw,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./markdown-renderer";
import { SettingsModal } from "./settings-modal";
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from "@/lib/ai/models";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface ChatSessionItem {
  id: string;
  title: string;
  updatedAt: Date;
}

const STARTER_PROMPTS = [
  {
    title: "⚡ TypeScript Utility",
    prompt: "Write a high-performance LRU cache in TypeScript with O(1) get and put operations.",
  },
  {
    title: "🚀 Next.js Architecture",
    prompt: "Explain how React Server Components (RSC) and Server Actions optimize streaming performance in Next.js 15.",
  },
  {
    title: "🧠 Attention Mechanism",
    prompt: "Explain Scaled Dot-Product Attention in Transformers with mathematical formulas and intuition.",
  },
  {
    title: "🍃 MongoDB Indexing",
    prompt: "What are compound and partial indexes in MongoDB, and how do they optimize high-concurrency chat applications?",
  },
];

export default function ChatInterface() {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an expert AI assistant powered by Nex N2.5 Pro on OpenRouter. Provide accurate, clear, and well-structured markdown answers."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [customApiKey, setCustomApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("https://openrouter.ai/api/v1");

  // Error Banner
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Fetch initial sessions
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        if (data.sessions && Array.isArray(data.sessions)) {
          setSessions(
            data.sessions.map((s: any) => ({
              id: s._id || s.id,
              title: s.title,
              updatedAt: new Date(s.updatedAt || Date.now()),
            }))
          );
        }
      }
    } catch {
      // Local fallback
    }
  };

  // Start New Chat
  const handleNewChat = () => {
    if (isGenerating) {
      handleStop();
    }
    setMessages([]);
    setActiveSessionId(null);
    setErrorMessage(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Load Session
  const handleSelectSession = async (sessionId: string) => {
    if (isGenerating) {
      handleStop();
    }
    setActiveSessionId(sessionId);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((m: any) => ({
              id: m._id || m.id,
              role: m.role,
              content: m.content,
              createdAt: new Date(m.createdAt || Date.now()),
            }))
          );
        }
      }
    } catch (err: any) {
      setErrorMessage("Could not load session history.");
    }
  };

  // Delete Session
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    } catch {
      // ignore
    }
  };

  // Send Message
  const handleSubmit = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input.trim();
    if (!textToSend || isGenerating) return;

    setErrorMessage(null);
    setInput("");

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend,
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Placeholder for assistant response
    const assistantMessageId = "asst-" + (Date.now() + 1);
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };

    setMessages([...newMessages, initialAssistantMessage]);
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          systemPrompt,
          temperature,
          sessionId: activeSessionId || undefined,
          provider: {
            baseUrl: customBaseUrl || undefined,
            apiKey: customApiKey || undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(
          errorJson.error || `Server responded with status ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error("No response body received from stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                accumulatedText += parsed.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              }
            } catch (jsonErr: any) {
              if (jsonErr.message !== "Unexpected end of JSON input") {
                // ignore transient chunk splits
              }
            }
          }
        }
      }

      // Refresh sessions in sidebar
      fetchSessions();
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const errorText =
          err.message || "An unexpected error occurred during chat completion.";
        setErrorMessage(errorText);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId && !msg.content
              ? {
                  ...msg,
                  content:
                    "⚠️ **Generation Failed:** " +
                    errorText +
                    "\n\n*If using local OpenRouter connections, verify network access or configure custom API settings.*",
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Stop Generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Handle Key Down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        temperature={temperature}
        setTemperature={setTemperature}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        customBaseUrl={customBaseUrl}
        setCustomBaseUrl={setCustomBaseUrl}
        model={selectedModel}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 md:relative w-64 md:w-72 bg-neutral-50 dark:bg-neutral-900/90 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-none"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <Button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 rounded-xl"
          >
            <Plus className="w-4 h-4" /> New Chat
          </Button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden ml-2 p-2 text-neutral-500 hover:text-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1 text-xs font-bold tracking-wider text-neutral-400 uppercase">
            Conversations
          </div>
          {sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-neutral-400">
              No previous chats yet. Start a new conversation!
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => handleSelectSession(sess.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer transition-colors ${
                  activeSessionId === sess.id
                    ? "bg-neutral-200 dark:bg-neutral-800 font-semibold"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <span className="truncate pr-2">{sess.title}</span>
                <button
                  onClick={(e) => handleDeleteSession(sess.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              OpenRouter AI
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-[11px] truncate text-neutral-400">
            Model: {selectedModel.split("/").pop()}
          </div>
        </div>
      </aside>

      {/* Main Chat Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Model Selector Dropdown */}
            <div className="relative inline-block">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none bg-neutral-100 dark:bg-neutral-800 text-xs sm:text-sm font-semibold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 cursor-pointer border border-transparent"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) {m.badge ? `• ${m.badge}` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-2.5 pointer-events-none text-neutral-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <Link href="/terminal">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1.5 text-xs font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
              >
                &gt;_ CLI
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 text-xs rounded-lg"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Clear
            </Button>
          </div>
        </header>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold">Notice:</span>
              <span className="truncate">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-2 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Chat Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="max-w-2xl mx-auto py-12 flex flex-col items-center text-center space-y-8 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8 text-neutral-800 dark:text-neutral-200" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                  How can I help you today?
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Powered by <span className="font-semibold text-neutral-800 dark:text-neutral-200">Nex N2.5 Pro</span> on OpenRouter with LangChain SDK orchestration.
                </p>
              </div>

              {/* Starter Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {STARTER_PROMPTS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(starter.prompt)}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all hover:scale-[1.01] flex flex-col gap-1 text-left"
                  >
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {starter.title}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {starter.prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role !== "user" && (
                    <div className="size-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === "user"
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium text-sm sm:text-base"
                        : "bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div>
                        {msg.content ? (
                          <MarkdownRenderer content={msg.content} />
                        ) : (
                          <div className="flex items-center gap-1.5 py-1">
                            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]"></span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="size-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Prompt Input Container */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="max-w-3xl mx-auto relative flex flex-col gap-2">
            <div className="relative flex items-center border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-neutral-100 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedModel.split("/").pop()} anything... (Press Enter to send)`}
                rows={1}
                className="w-full py-3.5 pl-4 pr-12 bg-transparent text-sm sm:text-base focus:outline-none resize-none max-h-40"
              />

              <div className="absolute right-2.5">
                {isGenerating ? (
                  <button
                    onClick={handleStop}
                    type="button"
                    className="p-2 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-80 transition-opacity"
                    title="Stop generation"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit()}
                    disabled={!input.trim()}
                    type="button"
                    className="p-2 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
              <span>Shift + Enter for new line</span>
              <span>Model: {selectedModel}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
