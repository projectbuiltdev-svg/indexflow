import { resolveAiKey } from "../ai-chat";

const AI_CALL_TIMEOUT_MS = 30000;

export interface AiCallResult {
  success: boolean;
  text: string;
  error?: string;
  provider?: string;
  model?: string;
  authFailure?: boolean;
}

export async function callAi(
  workspaceId: string,
  prompt: string,
  model: string = "gpt-4o-mini"
): Promise<AiCallResult> {
  try {
    const resolved = await resolveAiKey(workspaceId, inferProvider(model));

    if (!resolved.apiKey) {
      return { success: false, text: "", error: "No API key available", authFailure: true };
    }

    const provider = resolved.provider || inferProvider(model);

    if (provider === "anthropic") {
      return await callAnthropic(resolved.apiKey, prompt, model);
    }

    return await callOpenAI(resolved.apiKey, prompt, model);
  } catch (err: any) {
    return { success: false, text: "", error: err.message || "AI call failed" };
  }
}

function inferProvider(model: string): string {
  if (model.startsWith("claude")) return "anthropic";
  return "openai";
}

async function callOpenAI(apiKey: string, prompt: string, model: string): Promise<AiCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CALL_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 401 || response.status === 403) {
      return { success: false, text: "", error: `Auth failure: ${response.status}`, provider: "openai", model, authFailure: true };
    }

    if (!response.ok) {
      return { success: false, text: "", error: `OpenAI error: ${response.status}`, provider: "openai", model };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return { success: true, text, provider: "openai", model };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { success: false, text: "", error: `AI call timed out after ${AI_CALL_TIMEOUT_MS}ms`, provider: "openai", model };
    }
    return { success: false, text: "", error: err.message, provider: "openai", model };
  }
}

async function callAnthropic(apiKey: string, prompt: string, model: string): Promise<AiCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CALL_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 401 || response.status === 403) {
      return { success: false, text: "", error: `Auth failure: ${response.status}`, provider: "anthropic", model, authFailure: true };
    }

    if (!response.ok) {
      return { success: false, text: "", error: `Anthropic error: ${response.status}`, provider: "anthropic", model };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    return { success: true, text, provider: "anthropic", model };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { success: false, text: "", error: `AI call timed out after ${AI_CALL_TIMEOUT_MS}ms`, provider: "anthropic", model };
    }
    return { success: false, text: "", error: err.message, provider: "anthropic", model };
  }
}
