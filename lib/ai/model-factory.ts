import { ChatOpenAI } from "@langchain/openai";
import { DEFAULT_MODEL_ID } from "./models";

export interface ModelClientConfig {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

let proxyInitialized = false;
function setupProxyIfNeeded() {
  if (proxyInitialized) return;
  proxyInitialized = true;

  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    (process.env.NODE_ENV !== "production" ? "http://127.0.0.1:8181" : undefined);

  if (proxyUrl) {
    try {
      const { ProxyAgent, setGlobalDispatcher } = require("undici");
      setGlobalDispatcher(new ProxyAgent(proxyUrl));
      console.log(`[AI Factory] Global dispatcher configured with proxy: ${proxyUrl}`);
    } catch {
      // ignore
    }
  }
}

export function createLangChainClient(config?: ModelClientConfig): ChatOpenAI {
  setupProxyIfNeeded();

  const apiKey =
    config?.apiKey ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    "";

  const baseUrl =
    config?.baseUrl ||
    process.env.OPENROUTER_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    "https://openrouter.ai/api/v1";

  const modelName = config?.model || DEFAULT_MODEL_ID;

  if (!apiKey) {
    throw new Error(
      "Missing API key. Please configure OPENROUTER_API_KEY in .env.local or supply it in the client settings."
    );
  }

  return new ChatOpenAI({
    apiKey: apiKey,
    openAIApiKey: apiKey,
    configuration: {
      baseURL: baseUrl,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "VibeChat Enterprise AI",
      },
    },
    modelName: modelName,
    temperature: config?.temperature ?? 0.7,
    maxTokens: config?.maxTokens ?? 4096,
    streaming: true,
  });
}
