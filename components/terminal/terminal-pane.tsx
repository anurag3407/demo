"use client";

import React from "react";

interface TerminalPaneProps {
  title?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  actionButtons?: React.ReactNode;
}

export const TerminalPane: React.FC<TerminalPaneProps> = ({
  title,
  badge,
  children,
  className = "",
  actionButtons,
}) => {
  return (
    <div
      className={`relative border border-[var(--term-border)] bg-[var(--term-bg)] font-mono text-[var(--term-primary)] shadow-none rounded-none flex flex-col ${className}`}
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Pane ASCII Header */}
      {title && (
        <div className="flex items-center justify-between border-b border-[var(--term-border)] px-3 py-1.5 text-xs select-none bg-[var(--term-dim-border)]/20">
          <div className="flex items-center gap-2 font-bold tracking-wider">
            <span className="text-[var(--term-secondary)]">+-- [</span>
            <span className="uppercase tracking-widest text-[var(--term-primary)]" style={{ textShadow: "var(--term-glow)" }}>
              {title}
            </span>
            <span className="text-[var(--term-secondary)]">] --+</span>
            {badge && (
              <span className="text-[10px] px-1 py-0.2 border border-[var(--term-border)] bg-black text-[var(--term-secondary)]">
                {badge}
              </span>
            )}
          </div>
          {actionButtons && <div className="flex items-center gap-2">{actionButtons}</div>}
        </div>
      )}

      {/* Pane Content */}
      <div className="flex-1 p-3 sm:p-4 overflow-auto">{children}</div>
    </div>
  );
};
