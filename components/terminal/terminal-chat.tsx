"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TerminalPane } from "./terminal-pane";
import { AsciiBanner } from "./ascii-banner";
import { CRTScanlines } from "./crt-scanlines";
import { TERMINAL_THEMES, TerminalThemeId } from "@/lib/terminal/themes";
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from "@/lib/ai/models";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "system" | "error" | "banner";
  text?: string;
  prompt?: string;
  timestamp?: string;
}

export const TerminalChat: React.FC = () => {
  // Theme state
  const [themeId, setThemeId] = useState<TerminalThemeId>("green");
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const theme = TERMINAL_THEMES[themeId];

  // Shell State
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: "banner-0", type: "banner" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeModel, setActiveModel] = useState<string>(DEFAULT_MODEL_ID);

  // References
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isStreaming]);

  // Keep focus on input
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Cycle theme
  const cycleTheme = () => {
    setThemeId((prev) => (prev === "green" ? "amber" : prev === "amber" ? "cyan" : "green"));
  };

  // Execute Shell Command
  const handleCommand = async (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    // Add command to history
    setCommandHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);

    const now = new Date().toLocaleTimeString();

    // Echo the user prompt to terminal buffer
    const userLineId = "cmd-" + Date.now();
    setHistory((prev) => [
      ...prev,
      { id: userLineId, type: "input", text: raw, prompt: "guest@vibechat:~$", timestamp: now },
    ]);

    setInputVal("");

    const parts = raw.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    // Built-in Shell Commands
    if (command === "clear" || command === "cls") {
      setHistory([]);
      return;
    }

    if (command === "help" || command === "man") {
      setHistory((prev) => [
        ...prev,
        {
          id: "sys-" + Date.now(),
          type: "system",
          text: `AVAILABLE SYSTEM UTILITIES:
--------------------------------------------------------------------------------
  [prompt]               : Any natural language text is dispatched directly to AI.
  ask <query>            : Explicit query to the current neural network model.
  theme [green|amber|cyan]: Switch phosphor display palette.
  scanlines              : Toggle CRT scanline overlay on/off.
  model [name]           : Display or switch active model identifier.
  status                 : Query mainframe diagnostics & database telemetry.
  sessions               : List registered conversational sessions.
  matrix                 : Initiate ASCII digital rain visualizer.
  clear / cls            : Flush the terminal screen buffer.
  gui                    : Navigate back to the visual Next.js interface.
--------------------------------------------------------------------------------`,
        },
      ]);
      return;
    }

    if (command === "theme") {
      const target = args.toLowerCase().trim() as TerminalThemeId;
      if (target && TERMINAL_THEMES[target]) {
        setThemeId(target);
        setHistory((prev) => [
          ...prev,
          {
            id: "sys-" + Date.now(),
            type: "system",
            text: `[OK] Phosphor theme switched to: ${TERMINAL_THEMES[target].name} (${TERMINAL_THEMES[target].tag})`,
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            id: "sys-" + Date.now(),
            type: "system",
            text: `Active theme: ${theme.name}. Usage: theme [green | amber | cyan]`,
          },
        ]);
      }
      return;
    }

    if (command === "scanlines") {
      setScanlinesEnabled((prev) => !prev);
      setHistory((prev) => [
        ...prev,
        {
          id: "sys-" + Date.now(),
          type: "system",
          text: `[OK] CRT Scanlines: ${!scanlinesEnabled ? "[ENABLED]" : "[DISABLED]"}`,
        },
      ]);
      return;
    }

    if (command === "model") {
      if (args.trim()) {
        const found = AVAILABLE_MODELS.find(
          (m) => m.id.toLowerCase().includes(args.toLowerCase()) || m.name.toLowerCase().includes(args.toLowerCase())
        );
        if (found) {
          setActiveModel(found.id);
          setHistory((prev) => [
            ...prev,
            {
              id: "sys-" + Date.now(),
              type: "system",
              text: `[OK] Active inference model switched to: ${found.name} (${found.id})`,
            },
          ]);
        } else {
          setActiveModel(args.trim());
          setHistory((prev) => [
            ...prev,
            {
              id: "sys-" + Date.now(),
              type: "system",
              text: `[WARN] Custom model set: ${args.trim()}`,
            },
          ]);
        }
      } else {
        const list = AVAILABLE_MODELS.map(
          (m) => `  * ${m.id === activeModel ? ">> " : "   "}${m.name} [${m.id}]`
        ).join("\n");
        setHistory((prev) => [
          ...prev,
          {
            id: "sys-" + Date.now(),
            type: "system",
            text: `ACTIVE MODEL: ${activeModel}\n\nAVAILABLE MODELS:\n${list}\n\nUsage: model <model-id>`,
          },
        ]);
      }
      return;
    }

    if (command === "status") {
      setHistory((prev) => [
        ...prev,
        {
          id: "sys-" + Date.now(),
          type: "system",
          text: `SYSTEM TELEMETRY REPORT:
================================================================================
  NODE RUNTIME    : v25.2.1 [STABLE]
  FRAMEWORK       : Next.js 15 (App Router + Turbopack)
  ORCHESTRATION   : LangChain.js (LCEL Streaming Pipeline)
  ACTIVE MODEL    : ${activeModel}
  INFERENCE GW    : OpenRouter.ai (https://openrouter.ai/api/v1)
  DATABASE STATUS : MongoDB Atlas (chatbot cluster) [REPLICA_SET]
  THEME ENGINE    : ${theme.name} (${theme.tag})
  CRT SCANLINES   : ${scanlinesEnabled ? "ACTIVE" : "OFF"}
  LATENCY (TTFT)  : <450ms
================================================================================`,
        },
      ]);
      return;
    }

    if (command === "matrix") {
      setHistory((prev) => [
        ...prev,
        {
          id: "sys-" + Date.now(),
          type: "system",
          text: `01001110 01100101 01111000 00100000 01000001 01000111 01001001
[||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||] 100%
WAKE UP, NEO... THE MATRIX HAS YOU.`,
        },
      ]);
      return;
    }

    if (command === "gui") {
      window.location.href = "/chat";
      return;
    }

    // Otherwise, dispatch to AI inference!
    const query = command === "ask" ? args : raw;
    await dispatchAIQuery(query);
  };

  // Dispatch AI Query via Streaming
  const dispatchAIQuery = async (prompt: string) => {
    setIsStreaming(true);

    const streamLineId = "asst-" + Date.now();
    setHistory((prev) => [
      ...prev,
      {
        id: streamLineId,
        type: "output",
        text: "",
        prompt: `[${activeModel.split("/").pop()}]: `,
      },
    ]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: activeModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawText = decoder.decode(value);
          const lines = rawText.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (!dataStr) continue;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.content) {
                  accumulated += parsed.content;
                  setHistory((prev) =>
                    prev.map((l) =>
                      l.id === streamLineId ? { ...l, text: accumulated } : l
                    )
                  );
                }
              } catch {}
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setHistory((prev) =>
          prev.map((l) =>
            l.id === streamLineId
              ? {
                  ...l,
                  type: "error",
                  text: `[ERR] INFERENCE_EXCEPTION: ${err.message || "Upstream failure"}`,
                }
              : l
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Stop Generation
  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Key navigation for command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div
      style={theme.cssVars as React.CSSProperties}
      className="min-h-screen w-full bg-[var(--term-bg)] text-[var(--term-primary)] font-mono flex flex-col selection:bg-[var(--term-primary)] selection:text-black"
      onClick={focusInput}
    >
      {/* CRT Scanline FX Overlay */}
      <CRTScanlines enabled={scanlinesEnabled} />

      {/* Terminal Top Control Bar */}
      <header className="border-b border-[var(--term-border)] bg-[var(--term-dim-border)]/30 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-[var(--term-primary)]" style={{ textShadow: "var(--term-glow)" }}>
            &gt; VIBE_OS_CLI
          </span>
          <span className="hidden sm:inline text-[var(--term-muted)]">//</span>
          <span className="hidden sm:inline text-xs text-[var(--term-secondary)]">
            TTY1 @ {activeModel.split("/").pop()}
          </span>
        </div>

        {/* Quick Action Bracketed Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={cycleTheme}
            className="px-2 py-0.5 border border-[var(--term-border)] bg-black hover:bg-[var(--term-primary)] hover:text-black transition-colors"
          >
            [ THEME: {theme.tag} ]
          </button>

          <button
            type="button"
            onClick={() => setScanlinesEnabled(!scanlinesEnabled)}
            className="px-2 py-0.5 border border-[var(--term-border)] bg-black hover:bg-[var(--term-primary)] hover:text-black transition-colors"
          >
            [ CRT: {scanlinesEnabled ? "ON" : "OFF"} ]
          </button>

          <button
            type="button"
            onClick={() => setHistory([])}
            className="px-2 py-0.5 border border-[var(--term-border)] bg-black hover:bg-[var(--term-primary)] hover:text-black transition-colors"
          >
            [ CLEAR ]
          </button>

          {isStreaming && (
            <button
              type="button"
              onClick={handleAbort}
              className="px-2 py-0.5 border border-[var(--term-error)] text-[var(--term-error)] bg-black hover:bg-[var(--term-error)] hover:text-black font-bold animate-pulse"
            >
              [ ABORT ]
            </button>
          )}

          <Link
            href="/chat"
            className="px-2 py-0.5 border border-[var(--term-border)] bg-black text-[var(--term-secondary)] hover:bg-[var(--term-secondary)] hover:text-black transition-colors"
          >
            [ GUI MODE ]
          </Link>
        </div>
      </header>

      {/* Main Terminal Viewport */}
      <main className="flex-1 flex flex-col p-3 sm:p-6 overflow-hidden max-w-6xl w-full mx-auto">
        <TerminalPane
          title="TTY1 - MAIN CONSOLE"
          badge={isStreaming ? "PROCESSING" : "ONLINE"}
          className="flex-1 min-h-[75vh]"
          actionButtons={
            <div className="text-[10px] text-[var(--term-muted)]">
              UP/DOWN: HISTORY | HELP: MAN
            </div>
          }
        >
          {/* Scrollable Buffer */}
          <div className="space-y-3 font-mono text-xs sm:text-sm leading-relaxed pb-8">
            {history.map((line) => {
              if (line.type === "banner") {
                return (
                  <AsciiBanner
                    key={line.id}
                    modelName={activeModel}
                    themeName={theme.name}
                  />
                );
              }

              if (line.type === "input") {
                return (
                  <div key={line.id} className="flex gap-2 items-start text-[var(--term-secondary)] font-bold">
                    <span className="text-[var(--term-muted)] select-none">[{line.timestamp}]</span>
                    <span className="select-none">{line.prompt}</span>
                    <span className="text-white">{line.text}</span>
                  </div>
                );
              }

              if (line.type === "error") {
                return (
                  <div key={line.id} className="text-[var(--term-error)] bg-red-950/20 p-2 border border-red-900/50">
                    {line.text}
                  </div>
                );
              }

              return (
                <div key={line.id} className="space-y-1">
                  {line.prompt && (
                    <span className="text-[var(--term-secondary)] font-bold text-xs select-none">
                      {line.prompt}
                    </span>
                  )}
                  <div
                    className="whitespace-pre-wrap text-[var(--term-primary)]"
                    style={{ textShadow: "var(--term-glow)" }}
                  >
                    {line.text}
                    {isStreaming && line.id === history[history.length - 1]?.id && (
                      <span className="inline-block w-2.5 h-4 ml-0.5 bg-[var(--term-primary)] align-middle animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Prompt Line */}
            <div className="flex items-center gap-2 pt-2 text-sm font-bold">
              <span className="text-[var(--term-secondary)] select-none whitespace-nowrap">
                guest@vibechat:~$
              </span>
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isStreaming}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full bg-transparent border-none outline-none text-[var(--term-primary)] font-mono text-xs sm:text-sm caret-transparent p-0 m-0"
                  style={{ textShadow: "var(--term-glow)" }}
                />
                {/* Custom Blinking Block Cursor */}
                <span
                  className="inline-block w-2.5 h-4 bg-[var(--term-primary)] animate-pulse pointer-events-none select-none"
                  style={{
                    boxShadow: "var(--term-glow)",
                  }}
                />
              </div>
            </div>

            <div ref={terminalEndRef} />
          </div>
        </TerminalPane>
      </main>

      {/* Status Footer Bar */}
      <footer className="border-t border-[var(--term-border)] bg-[var(--term-dim-border)]/20 px-3 sm:px-4 py-1.5 text-[11px] text-[var(--term-muted)] flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-3">
          <span>STATUS: <span className="text-[var(--term-primary)] font-bold">[OK]</span></span>
          <span>GATEWAY: <span className="text-[var(--term-secondary)]">OPENROUTER</span></span>
          <span>PALETTE: <span className="text-[var(--term-secondary)]">{theme.name}</span></span>
        </div>
        <div>
          <span>PRESS [ENTER] TO DISPATCH COMMAND // TYPE &apos;HELP&apos; FOR CHEATSHEET</span>
        </div>
      </footer>
    </div>
  );
};
