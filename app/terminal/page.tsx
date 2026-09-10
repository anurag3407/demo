import { Metadata } from "next";
import { TerminalChat } from "@/components/terminal/terminal-chat";

export const metadata: Metadata = {
  title: "VibeChat CLI // Mainframe Terminal",
  description: "Cyber-industrial raw hacker terminal interface for AI reasoning with Nex N2.5 Pro.",
};

export default function TerminalPage() {
  return <TerminalChat />;
}
