import { NextRequest } from "next/server";
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";
import { createLangChainClient } from "@/lib/ai/model-factory";
import { connectToDatabase, ChatSession, Message } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      model = "nex-agi/nex-n2.5-pro:free",
      provider,
      temperature,
      systemPrompt,
      sessionId,
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'messages' array is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Prepare LangChain messages
    const formattedMessages: BaseMessage[] = [];

    if (systemPrompt && typeof systemPrompt === "string") {
      formattedMessages.push(new SystemMessage(systemPrompt));
    } else if (!messages.some((m: any) => m.role === "system")) {
      formattedMessages.push(
        new SystemMessage(
          "You are an expert AI assistant powered by Nex N2.5 Pro on OpenRouter. Provide clear, helpful, well-reasoned, and nicely formatted markdown answers."
        )
      );
    }

    for (const msg of messages) {
      if (msg.role === "system") {
        formattedMessages.push(new SystemMessage(msg.content));
      } else if (msg.role === "assistant") {
        formattedMessages.push(new AIMessage(msg.content));
      } else {
        formattedMessages.push(new HumanMessage(msg.content));
      }
    }

    // 2. Instantiate LangChain model with OpenRouter
    const llm = createLangChainClient({
      baseUrl: provider?.baseUrl,
      apiKey: provider?.apiKey,
      model: model,
      temperature: temperature,
    });

    // 3. Obtain real live stream from the model
    const liveStream = await llm.stream(formattedMessages);

    // 4. Transform into SSE ReadableStream
    const encoder = new TextEncoder();
    let accumulatedContent = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of liveStream) {
            const content = typeof chunk.content === "string" ? chunk.content : "";
            if (content) {
              accumulatedContent += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }

          // Emit completion event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, totalLength: accumulatedContent.length })}\n\n`
            )
          );
          controller.close();

          // Asynchronously persist to MongoDB if available
          persistChat(sessionId, messages, accumulatedContent, model).catch((err) => {
            console.error("Non-blocking DB persistence note:", err.message);
          });
        } catch (streamError: any) {
          console.error("Error during live inference stream:", streamError);
          const errorMessage = streamError?.message || "Error during inference stream.";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API handler error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process chat completion request.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function persistChat(
  sessionId: string | undefined,
  messages: any[],
  assistantReply: string,
  modelName: string | undefined
) {
  try {
    await connectToDatabase();
    let session = null;

    if (sessionId) {
      session = await ChatSession.findById(sessionId);
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    if (!session && lastUserMessage) {
      const title =
        lastUserMessage.content.slice(0, 40) + (lastUserMessage.content.length > 40 ? "..." : "");
      session = await ChatSession.create({
        title: title || "New Chat",
        modelName: modelName || "nex-agi/nex-n2.5-pro:free",
      });
    }

    if (session && lastUserMessage) {
      await Message.create({
        sessionId: session._id,
        role: "user",
        content: lastUserMessage.content,
      });

      await Message.create({
        sessionId: session._id,
        role: "assistant",
        content: assistantReply,
        modelName: modelName,
      });
    }
  } catch {
    // Non-blocking
  }
}
