import Link from "next/link";
import CardStackDemo from "@/components/card-stack-demo";
import TooltipCardDemo from "@/components/tooltip-card-demo";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  Database,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-bold shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              VibeChat <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Nex N2.5 Pro</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/anurag3407/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              title="GitHub Repo"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </Link>
            <Link href="/chat">
              <Button className="flex items-center gap-2 rounded-full px-5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity">
                Launch Chatbot <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Powered by Nex N2.5 Pro via OpenRouter
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-950 dark:text-white max-w-4xl leading-[1.15]">
          Enterprise Multi-Model AI Chatbot Platform
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          High-performance conversational intelligence built on Next.js 15, LangChain.js orchestration, OpenRouter endpoint compatibility, and MongoDB persistence.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/chat">
            <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 shadow-lg flex items-center gap-2">
              Start Chatting Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a
            href="#features"
            className="h-12 px-6 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Explore Interactive Features
          </a>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">Nex N2.5 Pro Default</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Pre-configured with Nex N2.5 Pro, DeepSeek V3, Llama 3.3, and GPT-4o Mini on OpenRouter.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">LangChain Streaming</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Real-time character-by-character token streaming with abort controllers and low TTFT.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">MongoDB Persistence</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Thread history, multi-turn message tree storage, and cached connection pooling on Atlas.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">Zero-Lock-In Security</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Encrypted keys, custom endpoint base URL overrides, and resilient local fallback.
          </p>
        </div>
      </section>

      {/* Interactive UI Components Showcase */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Interactive Feature Components
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Powered by Aceternity UI and Motion animations.
          </p>
        </div>

        {/* Card Stack Component */}
        <div className="flex flex-col items-center border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 bg-neutral-50/50 dark:bg-neutral-900/40 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Interactive Card Stack</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8">
            Auto-flipping stack of feedback cards with dynamic z-index and scaling.
          </p>
          <CardStackDemo />
        </div>

        {/* Tooltip Card Component */}
        <div className="flex flex-col items-center border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 bg-neutral-50/50 dark:bg-neutral-900/40 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Cursor Tracking Tooltip Cards</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
            Hover over keywords below to see dynamic viewport-aware popovers.
          </p>
          <TooltipCardDemo />
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/40 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            © {new Date().getFullYear()} VibeChat AI. Powered by Nex N2.5 Pro and LangChain SDK.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/chat" className="hover:text-neutral-900 dark:hover:text-white font-medium">
              Chat Interface
            </Link>
            <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white">
              OpenRouter
            </a>
            <a href="https://github.com/anurag3407/demo" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
