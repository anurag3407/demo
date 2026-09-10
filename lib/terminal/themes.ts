export type TerminalThemeId = "green" | "amber" | "cyan";

export interface TerminalTheme {
  id: TerminalThemeId;
  name: string;
  tag: string;
  bg: string;
  primary: string;
  primaryGlow: string;
  secondary: string;
  muted: string;
  border: string;
  dimBorder: string;
  error: string;
  cssVars: Record<string, string>;
}

export const TERMINAL_THEMES: Record<TerminalThemeId, TerminalTheme> = {
  green: {
    id: "green",
    name: "Phosphor Green",
    tag: "P1-GREEN",
    bg: "#0a0a0a",
    primary: "#33ff00",
    primaryGlow: "0 0 6px rgba(51, 255, 0, 0.55)",
    secondary: "#ffb000",
    muted: "#1f521f",
    border: "#246624",
    dimBorder: "#133813",
    error: "#ff3333",
    cssVars: {
      "--term-bg": "#0a0a0a",
      "--term-primary": "#33ff00",
      "--term-secondary": "#ffb000",
      "--term-muted": "#1f521f",
      "--term-border": "#246624",
      "--term-dim-border": "#133813",
      "--term-error": "#ff3333",
      "--term-glow": "0 0 6px rgba(51, 255, 0, 0.55)",
      "--term-glow-strong": "0 0 12px rgba(51, 255, 0, 0.8)",
    },
  },
  amber: {
    id: "amber",
    name: "Vintage Amber",
    tag: "P3-AMBER",
    bg: "#0a0800",
    primary: "#ffb000",
    primaryGlow: "0 0 6px rgba(255, 176, 0, 0.55)",
    secondary: "#33ff00",
    muted: "#664400",
    border: "#7a5200",
    dimBorder: "#402b00",
    error: "#ff3333",
    cssVars: {
      "--term-bg": "#0a0800",
      "--term-primary": "#ffb000",
      "--term-secondary": "#33ff00",
      "--term-muted": "#664400",
      "--term-border": "#7a5200",
      "--term-dim-border": "#402b00",
      "--term-error": "#ff3333",
      "--term-glow": "0 0 6px rgba(255, 176, 0, 0.55)",
      "--term-glow-strong": "0 0 12px rgba(255, 176, 0, 0.8)",
    },
  },
  cyan: {
    id: "cyan",
    name: "Cyberpunk Cyan",
    tag: "VT-CYAN",
    bg: "#020a0f",
    primary: "#00ffff",
    primaryGlow: "0 0 6px rgba(0, 255, 255, 0.55)",
    secondary: "#ff007f",
    muted: "#004455",
    border: "#006680",
    dimBorder: "#003340",
    error: "#ff3333",
    cssVars: {
      "--term-bg": "#020a0f",
      "--term-primary": "#00ffff",
      "--term-secondary": "#ff007f",
      "--term-muted": "#004455",
      "--term-border": "#006680",
      "--term-dim-border": "#003340",
      "--term-error": "#ff3333",
      "--term-glow": "0 0 6px rgba(0, 255, 255, 0.55)",
      "--term-glow-strong": "0 0 12px rgba(0, 255, 255, 0.8)",
    },
  },
};
