import { describe, it, expect, vi } from "vitest";

// Mock @/lib/db
vi.mock("@/lib/db", () => ({
  connectToDatabase: vi.fn(),
}));

import { GET } from "@/app/api/health/route";
import { connectToDatabase } from "@/lib/db";

describe("Health API Route Handler (GET /api/health)", () => {
  it("returns 200 and healthy status when database is connected", async () => {
    (connectToDatabase as any).mockResolvedValueOnce({
      connection: {
        readyState: 1,
        name: "chatbot",
      },
    });

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.database.connected).toBe(true);
    expect(data.database.name).toBe("chatbot");
  });

  it("returns 503 and unhealthy status when database throws an error", async () => {
    (connectToDatabase as any).mockRejectedValueOnce(
      new Error("Atlas IP whitelist restriction")
    );

    const response = await GET();
    expect(response.status).toBe(503);

    const data = await response.json();
    expect(data.status).toBe("unhealthy");
    expect(data.database.connected).toBe(false);
    expect(data.database.error).toContain("Atlas IP whitelist restriction");
  });
});
