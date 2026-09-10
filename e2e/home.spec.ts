import { test, expect } from "@playwright/test";

test.describe("Chatbot Landing & Showcase Page", () => {
  test("loads the landing page successfully with hero and feature sections", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify main platform header
    await expect(
      page.getByRole("heading", {
        name: "Enterprise Multi-Model AI Chatbot Platform",
      })
    ).toBeVisible();

    // Verify Card Stack section exists
    await expect(
      page.getByRole("heading", { name: "Interactive Card Stack" })
    ).toBeVisible();

    // Verify Tooltip Card section exists
    await expect(
      page.getByRole("heading", { name: "Cursor Tracking Tooltip Cards" })
    ).toBeVisible();

    // Verify Launch Chatbot button
    await expect(page.getByRole("link", { name: "Launch Chatbot" })).toBeVisible();
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

  test("navigates to /chat and renders the interactive AI interface", async ({
    page,
  }) => {
    await page.goto("/chat");

    // Verify empty state prompt
    await expect(
      page.getByRole("heading", { name: "How can I help you today?" })
    ).toBeVisible();

    // Verify New Chat button
    await expect(page.getByRole("button", { name: "New Chat" })).toBeVisible();

    // Verify model selector displays Nex N2.5 Pro
    const modelSelect = page.getByRole("combobox");
    await expect(modelSelect).toBeVisible();
    await expect(modelSelect).toHaveValue("nex-agi/nex-n2.5-pro:free");

    // Verify prompt input box
    await expect(page.getByPlaceholder(/Ask nex-n2.5-pro:free anything/i)).toBeVisible();
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
