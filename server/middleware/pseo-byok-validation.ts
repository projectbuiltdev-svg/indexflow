import { storage } from "../storage";
import type { AiProvider } from "../types/byok.types";
import type { ByokValidationResult } from "../types/byok.types";
import { PseoErrorType, handleCampaignError, type CampaignErrorContext } from "../pseo/error-handler";
import { canTransition, type CampaignState } from "../pseo/campaign-state-machine";
import { BYOK_VALIDATION_CACHE_TTL_MS } from "../config/pseo-indexing-rate-limits";

type ImageBankProvider = "unsplash" | "pexels" | "pixabay";

const VALIDATION_CACHE_TTL_MS = BYOK_VALIDATION_CACHE_TTL_MS;

interface CachedValidation {
  result: ByokValidationResult;
  expiresAt: number;
}

const validationCache = new Map<string, CachedValidation>();

function cacheKey(workspaceId: string, provider: string): string {
  return `${workspaceId}:${provider}`;
}

function getCached(workspaceId: string, provider: string): ByokValidationResult | null {
  const key = cacheKey(workspaceId, provider);
  const entry = validationCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    validationCache.delete(key);
    return null;
  }
  return entry.result;
}

function setCache(workspaceId: string, provider: string, result: ByokValidationResult): void {
  const key = cacheKey(workspaceId, provider);
  validationCache.set(key, {
    result,
    expiresAt: Date.now() + VALIDATION_CACHE_TTL_MS,
  });
}

export function invalidateCache(workspaceId: string, provider?: string): void {
  if (provider) {
    validationCache.delete(cacheKey(workspaceId, provider));
  } else {
    for (const key of validationCache.keys()) {
      if (key.startsWith(`${workspaceId}:`)) {
        validationCache.delete(key);
      }
    }
  }
}

async function testOpenAiKey(apiKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say ok" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "openai", error: "Invalid or revoked API key", modelsAvailable: [] };
    }
    if (resp.status === 429) {
      return { valid: false, provider: "openai", error: "Rate limit or quota exceeded", modelsAvailable: [] };
    }
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return { valid: false, provider: "openai", error: `API returned ${resp.status}: ${body.slice(0, 200)}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "openai", error: null, modelsAvailable: ["gpt-4o", "gpt-4o-mini"] };
  } catch (err: any) {
    return { valid: false, provider: "openai", error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

async function testAnthropicKey(apiKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "Say ok" }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "anthropic", error: "Invalid or revoked API key", modelsAvailable: [] };
    }
    if (resp.status === 429) {
      return { valid: false, provider: "anthropic", error: "Rate limit or quota exceeded", modelsAvailable: [] };
    }
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return { valid: false, provider: "anthropic", error: `API returned ${resp.status}: ${body.slice(0, 200)}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "anthropic", error: null, modelsAvailable: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"] };
  } catch (err: any) {
    return { valid: false, provider: "anthropic", error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

async function testGoogleKey(apiKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say ok" }] }],
          generationConfig: { maxOutputTokens: 1 },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "google", error: "Invalid or revoked API key", modelsAvailable: [] };
    }
    if (resp.status === 429) {
      return { valid: false, provider: "google", error: "Rate limit or quota exceeded", modelsAvailable: [] };
    }
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return { valid: false, provider: "google", error: `API returned ${resp.status}: ${body.slice(0, 200)}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "google", error: null, modelsAvailable: ["gemini-2.0-flash", "gemini-2.0-flash-lite"] };
  } catch (err: any) {
    return { valid: false, provider: "google", error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

async function testMistralKey(apiKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: "Say ok" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "mistral", error: "Invalid or revoked API key", modelsAvailable: [] };
    }
    if (resp.status === 429) {
      return { valid: false, provider: "mistral", error: "Rate limit or quota exceeded", modelsAvailable: [] };
    }
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return { valid: false, provider: "mistral", error: `API returned ${resp.status}: ${body.slice(0, 200)}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "mistral", error: null, modelsAvailable: ["mistral-small-latest", "mistral-large-latest"] };
  } catch (err: any) {
    return { valid: false, provider: "mistral", error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

const AI_VALIDATORS: Record<AiProvider, (key: string) => Promise<ByokValidationResult>> = {
  openai: testOpenAiKey,
  anthropic: testAnthropicKey,
  google: testGoogleKey,
  mistral: testMistralKey,
  groq: async (apiKey: string) => {
    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: "Say ok" }],
          max_tokens: 1,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (resp.status === 401 || resp.status === 403) {
        return { valid: false, provider: "groq" as AiProvider, error: "Invalid or revoked API key", modelsAvailable: [] };
      }
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        return { valid: false, provider: "groq" as AiProvider, error: `API returned ${resp.status}: ${body.slice(0, 200)}`, modelsAvailable: [] };
      }
      return { valid: true, provider: "groq" as AiProvider, error: null, modelsAvailable: ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"] };
    } catch (err: any) {
      return { valid: false, provider: "groq" as AiProvider, error: err.message || "Connection failed", modelsAvailable: [] };
    }
  },
};

async function testUnsplashKey(accessKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch(
      `https://api.unsplash.com/search/photos?query=test&per_page=1`,
      {
        headers: { "Authorization": `Client-ID ${accessKey}` },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "unsplash" as any, error: "Invalid or revoked access key", modelsAvailable: [] };
    }
    if (!resp.ok) {
      return { valid: false, provider: "unsplash" as any, error: `API returned ${resp.status}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "unsplash" as any, error: null, modelsAvailable: [] };
  } catch (err: any) {
    return { valid: false, provider: "unsplash" as any, error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

async function testPexelsKey(apiKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch(
      `https://api.pexels.com/v1/search?query=test&per_page=1`,
      {
        headers: { "Authorization": apiKey },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "pexels" as any, error: "Invalid or revoked API key", modelsAvailable: [] };
    }
    if (!resp.ok) {
      return { valid: false, provider: "pexels" as any, error: `API returned ${resp.status}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "pexels" as any, error: null, modelsAvailable: [] };
  } catch (err: any) {
    return { valid: false, provider: "pexels" as any, error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

async function testPixabayKey(apiKey: string): Promise<ByokValidationResult> {
  try {
    const resp = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=test&per_page=3&image_type=photo`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (resp.status === 401 || resp.status === 403) {
      return { valid: false, provider: "pixabay" as any, error: "Invalid or revoked API key", modelsAvailable: [] };
    }
    if (!resp.ok) {
      return { valid: false, provider: "pixabay" as any, error: `API returned ${resp.status}`, modelsAvailable: [] };
    }
    return { valid: true, provider: "pixabay" as any, error: null, modelsAvailable: [] };
  } catch (err: any) {
    return { valid: false, provider: "pixabay" as any, error: err.message || "Connection failed", modelsAvailable: [] };
  }
}

const IMAGE_BANK_VALIDATORS: Record<ImageBankProvider, (key: string) => Promise<ByokValidationResult>> = {
  unsplash: testUnsplashKey,
  pexels: testPexelsKey,
  pixabay: testPixabayKey,
};

export async function validateAiProvider(
  workspaceId: string,
  provider: AiProvider,
  forceRefresh = false
): Promise<ByokValidationResult> {
  if (!forceRefresh) {
    const cached = getCached(workspaceId, provider);
    if (cached) return cached;
  }

  const allProviders = await storage.getAiProviderSettings(workspaceId);
  const settings = allProviders.find((p) => p.provider === provider);

  if (!settings?.apiKey || !settings.isEnabled) {
    const result: ByokValidationResult = {
      valid: false,
      provider,
      error: settings ? "Provider is disabled" : "No API key configured",
      modelsAvailable: [],
    };
    setCache(workspaceId, provider, result);
    return result;
  }

  const validator = AI_VALIDATORS[provider];
  const result = await validator(settings.apiKey);
  setCache(workspaceId, provider, result);
  return result;
}

export async function validateImageBank(
  workspaceId: string,
  provider: ImageBankProvider,
  forceRefresh = false
): Promise<ByokValidationResult> {
  if (!forceRefresh) {
    const cached = getCached(workspaceId, `image:${provider}`);
    if (cached) return cached;
  }

  const envKeys: Record<ImageBankProvider, string | undefined> = {
    unsplash: process.env.UNSPLASH_ACCESS_KEY,
    pexels: process.env.PEXELS_API_KEY,
    pixabay: process.env.PIXABAY_API_KEY,
  };

  const apiKey = envKeys[provider];
  if (!apiKey) {
    const result: ByokValidationResult = {
      valid: false,
      provider: provider as any,
      error: "No API key configured",
      modelsAvailable: [],
    };
    setCache(workspaceId, `image:${provider}`, result);
    return result;
  }

  const validator = IMAGE_BANK_VALIDATORS[provider];
  const result = await validator(apiKey);
  setCache(workspaceId, `image:${provider}`, result);
  return result;
}

export interface ByokValidationSummary {
  valid: boolean;
  providers: ByokValidationResult[];
  aiValid: boolean;
  imageBankValid: boolean;
}

export async function validateByokKeys(
  workspaceId: string,
  forceRefresh = false
): Promise<ByokValidationSummary> {
  const allProviders = await storage.getAiProviderSettings(workspaceId);
  const enabledAiProviders = allProviders
    .filter((p) => p.isEnabled && p.apiKey)
    .map((p) => p.provider as AiProvider);

  const imageBankProviders: ImageBankProvider[] = [];
  if (process.env.UNSPLASH_ACCESS_KEY) imageBankProviders.push("unsplash");
  if (process.env.PEXELS_API_KEY) imageBankProviders.push("pexels");
  if (process.env.PIXABAY_API_KEY) imageBankProviders.push("pixabay");

  const aiPromises = enabledAiProviders.map((p) => validateAiProvider(workspaceId, p, forceRefresh));
  const imagePromises = imageBankProviders.map((p) => validateImageBank(workspaceId, p, forceRefresh));

  const [aiResults, imageResults] = await Promise.all([
    Promise.all(aiPromises),
    Promise.all(imagePromises),
  ]);

  const allResults = [...aiResults, ...imageResults];
  const aiValid = aiResults.length > 0 && aiResults.some((r) => r.valid);
  const imageBankValid = imageResults.length === 0 || imageResults.some((r) => r.valid);

  return {
    valid: aiValid && imageBankValid,
    providers: allResults,
    aiValid,
    imageBankValid,
  };
}

export interface MidGenerationAuthFailure {
  handled: true;
  errorType: PseoErrorType;
  shouldPauseCampaign: boolean;
  campaignErrorResult: ReturnType<typeof handleCampaignError> | null;
}

export function handleMidGenerationAuthFailure(
  httpStatus: number,
  provider: AiProvider,
  campaignContext: CampaignErrorContext
): MidGenerationAuthFailure | null {
  if (httpStatus !== 401 && httpStatus !== 403) {
    return null;
  }

  invalidateCache(campaignContext.workspaceId, provider);

  const errorType = httpStatus === 401
    ? PseoErrorType.AI_KEY_INVALID
    : PseoErrorType.BYOK_VALIDATION_FAILED;

  const message = `${provider} returned ${httpStatus} during generation — key expired or revoked`;

  const shouldPause = canTransition(campaignContext.currentState, "paused");

  const campaignErrorResult = shouldPause
    ? handleCampaignError(errorType, message, campaignContext)
    : null;

  console.error(
    `[pSEO BYOK] Mid-generation auth failure: provider=${provider} status=${httpStatus} campaign=${campaignContext.campaignId}`
  );

  return {
    handled: true,
    errorType,
    shouldPauseCampaign: shouldPause,
    campaignErrorResult,
  };
}
