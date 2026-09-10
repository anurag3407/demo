"use client";

import React from "react";

export const ASCII_LOGO = `
 __      _______ ____  ______    _______ ______ _____  __  __ _____ _   _          _      
 \\ \\    / /_   _|  _ \\|  ____|  |__   __|  ____|  __ \\|  \\/  |_   _| \\ | |   /\\   | |     
  \\ \\  / /  | | | |_) | |__        | |  | |__  | |__) | \\  / | | | |  \\| |  /  \\  | |     
   \\ \\/ /   | | |  _ <|  __|       | |  |  __| |  _  /| |\\/| | | | | . \` | / /\\ \\ | |     
    \\  /   _| |_| |_) | |____      | |  | |____| | \\ \\| |  | |_| |_| |\\  |/ ____ \\| |____ 
     \\/   |_____|____/|______|     |_|  |______|_|  \\_\\_|  |_|_____|_| \\_/_/    \\_\\______|
`;

export const AsciiBanner: React.FC<{ modelName: string; themeName: string }> = ({
  modelName,
  themeName,
}) => {
  return (
    <div className="space-y-3 select-none">
      <pre
        className="text-[9px] sm:text-[11px] md:text-xs leading-[1.1] font-mono text-[var(--term-primary)] overflow-x-auto whitespace-pre"
        style={{ textShadow: "var(--term-glow)" }}
      >
        {ASCII_LOGO}
      </pre>

      <div className="text-xs space-y-1 text-[var(--term-muted)] border-l-2 border-[var(--term-primary)] pl-3">
        <p className="text-[var(--term-primary)] font-bold">
          &gt;&gt; VIBE TERMINAL CLI INTERFACE v2.5.0-ALPHA [INITIALIZED]
        </p>
        <p>
          [SYSTEM] ARCH: X86_64_NODE25 // KERNEL: NEXTJS_15_APP_ROUTER // PROTOCOL: SSE_HTTP2
        </p>
        <p>
          [ENGINE] LANGCHAIN_LCEL // DEFAULT_MODEL: <span className="text-[var(--term-secondary)]">{modelName}</span>
        </p>
        <p>
          [PHOSPHOR] PALETTE: <span className="text-[var(--term-secondary)]">{themeName}</span> // CRT_SCANLINES: [ONLINE]
        </p>
        <p className="text-[var(--term-primary)]">
          [STATUS] READY. Type <span className="underline font-bold text-[var(--term-secondary)]">help</span> for command list, or enter a prompt directly to query the AI mainframe.
        </p>
      </div>
      <div className="text-xs text-[var(--term-muted)]">
        ========================================================================================
      </div>
    </div>
  );
};
