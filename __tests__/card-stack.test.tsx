import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CardStack } from "@/components/ui/card-stack";

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

const mockCards = [
  {
    id: 1,
    name: "Ada Lovelace",
    designation: "First Programmer",
    content: <p>Analytical Engine pioneer</p>,
  },
  {
    id: 2,
    name: "Alan Turing",
    designation: "Computer Scientist",
    content: <p>Father of modern computing</p>,
  },
];

describe("CardStack Component", () => {
  it("renders all card items provided in props", () => {
    render(<CardStack items={mockCards} />);

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("First Programmer")).toBeInTheDocument();
    expect(screen.getByText("Analytical Engine pioneer")).toBeInTheDocument();

    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(screen.getByText("Father of modern computing")).toBeInTheDocument();
  });

  it("applies offset and custom styling structure", () => {
    const { container } = render(
      <CardStack items={mockCards} offset={15} scaleFactor={0.08} />
    );

    const outerContainer = container.querySelector(".relative");
    expect(outerContainer).toBeInTheDocument();
  });
});
