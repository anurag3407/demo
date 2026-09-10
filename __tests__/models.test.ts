import { describe, it, expect } from "vitest";
import { ChatSession, Message, ProviderConfig } from "@/lib/db";

describe("Database Mongoose Models & Schemas", () => {
  describe("ChatSession Model", () => {
    it("has expected schema fields with defaults", () => {
      const session = new ChatSession({
        title: "Test Architecture Chat",
        modelName: "gpt-4o",
      });

      expect(session.title).toBe("Test Architecture Chat");
      expect(session.modelName).toBe("gpt-4o");
      expect(session.isPinned).toBe(false);
      expect(session.isArchived).toBe(false);
    });

    it("defaults to 'New Chat' if title is not provided", () => {
      const session = new ChatSession({});
      expect(session.title).toBe("New Chat");
      expect(session.modelName).toBe("gpt-4o");
    });
  });

  describe("Message Model", () => {
    it("validates required role and content fields", () => {
      const msg = new Message({
        role: "user",
        content: "Explain LCEL streaming in LangChain.",
      });

      expect(msg.role).toBe("user");
      expect(msg.content).toBe("Explain LCEL streaming in LangChain.");
      expect(msg.parentMessageId).toBeNull();
      expect(msg.reasoningContent).toBeNull();
    });

    it("supports reasoningContent and toolCalls", () => {
      const msg = new Message({
        role: "assistant",
        content: "Here is the response.",
        reasoningContent: "First, let's consider the pipeline architecture...",
        toolCalls: [
          {
            toolName: "webSearch",
            args: { query: "Next.js 15 App Router" },
            isError: false,
          },
        ],
      });

      expect(msg.reasoningContent).toContain("pipeline architecture");
      expect(msg.toolCalls).toHaveLength(1);
      expect(msg.toolCalls[0].toolName).toBe("webSearch");
    });
  });

  describe("ProviderConfig Model", () => {
    it("correctly sets default parameters for custom OpenAI-compatible providers", () => {
      const provider = new ProviderConfig({
        name: "Local Ollama",
        baseUrl: "http://localhost:11434/v1",
        defaultModel: "llama3.2",
      });

      expect(provider.name).toBe("Local Ollama");
      expect(provider.baseUrl).toBe("http://localhost:11434/v1");
      expect(provider.isDefault).toBe(false);
      expect(provider.parameters.temperature).toBe(0.7);
      expect(provider.parameters.topP).toBe(1.0);
      expect(provider.parameters.maxTokens).toBe(2048);
    });
  });
});
