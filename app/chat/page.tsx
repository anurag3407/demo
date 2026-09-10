import ChatInterface from "@/components/chat/chat-interface";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chat - Nex N2.5 Pro & Multi-Model Assistant",
  description: "Next.js AI Chatbot powered by LangChain and OpenRouter compatible endpoints.",
};

export default function ChatPage() {
  return <ChatInterface />;
}
