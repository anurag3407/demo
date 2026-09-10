import { describe, it, expect } from "vitest";
import { TERMINAL_THEMES } from "@/lib/terminal/themes";

describe("Terminal CLI Design Tokens & Themes", () => {
  it("contains all three required CRT phosphor themes", () => {
    expect(TERMINAL_THEMES).toHaveProperty("green");
    expect(TERMINAL_THEMES).toHaveProperty("amber");
    expect(TERMINAL_THEMES).toHaveProperty("cyan");
  });

  it("defines authentic phosphor colors matching the design system specifications", () => {
    // Green
    expect(TERMINAL_THEMES.green.bg).toBe("#0a0a0a");
    expect(TERMINAL_THEMES.green.primary).toBe("#33ff00");
    expect(TERMINAL_THEMES.green.secondary).toBe("#ffb000");

    // Amber
    expect(TERMINAL_THEMES.amber.primary).toBe("#ffb000");

    // Cyan
    expect(TERMINAL_THEMES.cyan.primary).toBe("#00ffff");
  });

  it("exports valid CSS variable maps for all themes", () => {
    for (const themeKey of ["green", "amber", "cyan"] as const) {
      const theme = TERMINAL_THEMES[themeKey];
      expect(theme.cssVars).toHaveProperty("--term-bg");
      expect(theme.cssVars).toHaveProperty("--term-primary");
      expect(theme.cssVars).toHaveProperty("--term-border");
      expect(theme.cssVars).toHaveProperty("--term-glow");
    }
  });
});
