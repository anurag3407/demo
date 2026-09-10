import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility function", () => {
  it("merges standard class names correctly", () => {
    const result = cn("px-2 py-1", "bg-blue-500");
    expect(result).toBe("px-2 py-1 bg-blue-500");
  });

  it("handles conditional class names", () => {
    const isActive = true;
    const isPending = false;
    const result = cn(
      "base-class",
      isActive && "active-class",
      isPending && "pending-class"
    );
    expect(result).toBe("base-class active-class");
  });

  it("resolves Tailwind conflicts cleanly using tailwind-merge", () => {
    const result = cn("px-2 py-1 bg-red-500", "px-4 bg-green-500");
    // tailwind-merge should override px-2 with px-4 and bg-red-500 with bg-green-500
    expect(result).toBe("py-1 px-4 bg-green-500");
  });

  it("handles empty values, null, and undefined gracefully", () => {
    const result = cn(null, undefined, false, "", "text-white");
    expect(result).toBe("text-white");
  });
});
