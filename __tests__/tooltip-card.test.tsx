import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Tooltip } from "@/components/ui/tooltip-card";

// Mock motion/react for jsdom
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("Tooltip Component", () => {
  it("renders trigger children correctly", () => {
    render(
      <Tooltip content="Tooltip details text">
        <span>Hover Me</span>
      </Tooltip>
    );

    expect(screen.getByText("Hover Me")).toBeInTheDocument();
  });

  it("displays tooltip content upon mouse enter", () => {
    render(
      <Tooltip content="Tooltip details text">
        <span data-testid="trigger">Hover Me</span>
      </Tooltip>
    );

    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger, { clientX: 50, clientY: 50 });

    expect(screen.getByText("Tooltip details text")).toBeInTheDocument();
  });

  it("hides tooltip content on mouse leave", () => {
    render(
      <Tooltip content="Tooltip details text">
        <span data-testid="trigger">Hover Me</span>
      </Tooltip>
    );

    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger, { clientX: 50, clientY: 50 });
    expect(screen.getByText("Tooltip details text")).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    // After mouseLeave, isVisible is false
    expect(screen.queryByText("Tooltip details text")).not.toBeInTheDocument();
  });
});
