export type AiProvider = "openai" | "anthropic" | "google" | "mistral" | "groq";

export type AiKeySource = "agency" | "client";

export interface ByokConfig {
  workspaceId: string;
  aiKeySource: AiKeySource;
  provider: AiProvider;
}

export interface ByokKeyResolution {
  resolved: boolean;
  source: "workspace-byok" | "platform-fallback" | "none";
  provider: AiProvider;
  model: string;
  keyPresent: boolean;
}

export interface ByokUsageRecord {
  workspaceId: string;
  campaignId: string;
  provider: AiProvider;
  model: string;
  tokensIn: number;
  tokensOut: number;
  requestCount: number;
  estimatedCost: number;
  date: string;
}

export interface ByokUsageSummary {
  workspaceId: string;
  period: "day" | "week" | "month";
  totalTokensIn: number;
  totalTokensOut: number;
  totalRequests: number;
  totalEstimatedCost: number;
  byProvider: Record<AiProvider, ByokProviderUsage>;
  byCampaign: Record<string, ByokCampaignUsage>;
}

export interface ByokProviderUsage {
  provider: AiProvider;
  tokensIn: number;
  tokensOut: number;
  requestCount: number;
  estimatedCost: number;
}

export interface ByokCampaignUsage {
  campaignId: string;
  campaignName: string;
  tokensIn: number;
  tokensOut: number;
  requestCount: number;
  estimatedCost: number;
}

export interface ByokModelConfig {
  provider: AiProvider;
  model: string;
  maxTokens: number;
  temperature: number;
  supportsStreaming: boolean;
  costPerMillionIn: number;
  costPerMillionOut: number;
}

export interface ByokValidationResult {
  valid: boolean;
  provider: AiProvider;
  error: string | null;
  modelsAvailable: string[];
}
