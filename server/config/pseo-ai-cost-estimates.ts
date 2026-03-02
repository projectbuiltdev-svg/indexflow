export const REFERENCE_PAGE_COUNT = 665;

export const GPT_4O_MINI_COST_PER_665 = 1;
export const GPT_4O_COST_PER_665 = 17;
export const CLAUDE_SONNET_COST_PER_665 = 22;
export const IMAGE_COST = 0;

export interface AiCostEstimate {
  model: string;
  provider: string;
  costPer665Pages: number;
  costPerPage: number;
}

export const AI_COST_ESTIMATES: AiCostEstimate[] = [
  {
    model: "gpt-4o-mini",
    provider: "openai",
    costPer665Pages: GPT_4O_MINI_COST_PER_665,
    costPerPage: GPT_4O_MINI_COST_PER_665 / REFERENCE_PAGE_COUNT,
  },
  {
    model: "gpt-4o",
    provider: "openai",
    costPer665Pages: GPT_4O_COST_PER_665,
    costPerPage: GPT_4O_COST_PER_665 / REFERENCE_PAGE_COUNT,
  },
  {
    model: "claude-3-5-sonnet-latest",
    provider: "anthropic",
    costPer665Pages: CLAUDE_SONNET_COST_PER_665,
    costPerPage: CLAUDE_SONNET_COST_PER_665 / REFERENCE_PAGE_COUNT,
  },
];

export function estimateCampaignCost(model: string, pageCount: number): number {
  const estimate = AI_COST_ESTIMATES.find((e) => e.model === model);
  if (!estimate) return 0;
  return Math.round(estimate.costPerPage * pageCount * 100) / 100;
}
