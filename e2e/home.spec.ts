import { test, expect } from "@playwright/test";

test.describe("Chatbot Landing & Showcase Page", () => {
  test("loads the landing page successfully with title and sections", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify main header
    await expect(
      page.getByRole("heading", { name: "Aceternity UI & Shadcn Components" })
    ).toBeVisible();

    // Verify Card Stack section exists
    await expect(
      page.getByRole("heading", { name: "Card Stack Component" })
    ).toBeVisible();

    // Verify Tooltip Card section exists
    await expect(
      page.getByRole("heading", { name: "Tooltip Card Component" })
    ).toBeVisible();
  });

  test("renders card stack with content and testimonial cards", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for card text
    await expect(page.getByText("Manu Arora")).toBeVisible();
    await expect(page.getByText("Senior Software Engineer")).toBeVisible();
  });

  test("interacts with tooltip card on hover", async ({ page }) => {
    await page.goto("/");

    // Locate the AWS tooltip trigger
    const awsTrigger = page.locator("text=AWS").first();
    await expect(awsTrigger).toBeVisible();

    // Hover over the AWS trigger
    await awsTrigger.hover();

    // Verify tooltip content appears
    await expect(
      page.getByText("world's most comprehensive and broadly adopted cloud platform")
    ).toBeVisible();
  });

  test("verifies API health check endpoint", async ({ request }) => {
    const response = await request.get("/api/health");
    expect([200, 503]).toContain(response.status());

    const body = await response.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("database");
    expect(body.database).toHaveProperty("connected");
  });
});
