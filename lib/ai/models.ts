export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "nex-agi/nex-n2.5-pro:free",
    name: "Nex N2.5 Pro (Free)",
    provider: "Nex AGI",
    description: "High-capability reasoning and instruction-following model on OpenRouter.",
    badge: "Default Free",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "State-of-the-art general reasoning, math, and code generation.",
    badge: "Popular",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Industry standard open-weight frontier intelligence.",
    badge: "Fast",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast, intelligent, and cost-efficient multimodal model.",
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Ultra low latency next-gen model with multimodal understanding.",
  },
];

export const DEFAULT_MODEL_ID =
  process.env.DEFAULT_MODEL || "nex-agi/nex-n2.5-pro:free";
