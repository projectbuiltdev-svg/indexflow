import { hashSeed, seededRandom, seededSelectIndex } from "../utils/pseo-hash-seeder";
import { resolveAiKey } from "../ai-chat";
import {
  MIN_H1_POOL_SIZE,
  MIN_H2_POOL_SIZE,
  MIN_PARAGRAPH_POOL_SIZE,
  MAX_POOL_EXPANSIONS,
} from "../config/pseo-similarity-threshold";

export interface CampaignContext {
  campaignId: string;
  workspaceId: string;
  serviceName: string;
  serviceDescription: string;
  sectionCount: number;
  languageCode: string;
  tone?: string;
}

export interface SpintaxPool {
  h1Variants: string[];
  h2Variants: Record<number, string[]>;
  paragraphVariants: Record<number, string[]>;
}

export interface SpintaxPoolRecord {
  id: string;
  campaignId: string;
  venueId: string;
  poolType: string;
  zoneId: string | null;
  variants: string[];
  usageCount: Record<string, number> | null;
  version: number;
}

export interface PoolStorage {
  getPoolsByCampaign(campaignId: string): Promise<SpintaxPoolRecord[]>;
  upsertPool(pool: {
    campaignId: string;
    venueId: string;
    poolType: string;
    zoneId: string | null;
    variants: string[];
    version: number;
  }): Promise<SpintaxPoolRecord>;
  logAudit(entry: {
    campaignId: string;
    venueId: string;
    action: string;
    message: string;
    meta?: Record<string, any>;
  }): Promise<void>;
}

export interface UsedH1Tracker {
  getUsedH1s(campaignId: string): Promise<string[]>;
}

const SYNONYM_MAP: Record<string, string[]> = {
  excellent: ["outstanding", "exceptional", "superb", "first-rate"],
  professional: ["expert", "skilled", "experienced", "qualified"],
  reliable: ["dependable", "trustworthy", "consistent", "steady"],
  affordable: ["cost-effective", "budget-friendly", "economical", "competitive"],
  quality: ["premium", "superior", "top-tier", "high-grade"],
  fast: ["quick", "rapid", "swift", "prompt"],
  best: ["top", "leading", "premier", "finest"],
  service: ["solution", "provision", "offering", "support"],
  team: ["crew", "staff", "specialists", "professionals"],
  local: ["nearby", "neighbourhood", "community", "area"],
  trusted: ["reputable", "established", "proven", "recognised"],
  comprehensive: ["thorough", "complete", "full", "extensive"],
  dedicated: ["committed", "devoted", "focused", "attentive"],
  modern: ["contemporary", "up-to-date", "current", "state-of-the-art"],
  friendly: ["approachable", "welcoming", "personable", "helpful"],
  certified: ["accredited", "licensed", "authorised", "approved"],
  great: ["remarkable", "impressive", "wonderful", "terrific"],
  provides: ["offers", "delivers", "supplies", "furnishes"],
  important: ["essential", "crucial", "vital", "critical"],
  customers: ["clients", "patrons", "users", "consumers"],
};

export async function generateSpintaxPool(
  context: CampaignContext,
  aiCallFn?: (prompt: string, apiKey: string) => Promise<string>
): Promise<SpintaxPool> {
  const resolvedKey = await resolveAiKey(context.workspaceId, "openai");

  if (!resolvedKey.apiKey) {
    return generateFallbackPool(context);
  }

  const prompt = buildPoolPrompt(context);

  const caller = aiCallFn || callOpenAI;

  try {
    const raw = await caller(prompt, resolvedKey.apiKey);
    const parsed = parsePoolResponse(raw, context.sectionCount);
    validatePoolSizes(parsed, context.sectionCount);
    return parsed;
  } catch {
    return generateFallbackPool(context);
  }
}

function buildPoolPrompt(ctx: CampaignContext): string {
  return `Generate spintax content variants for a ${ctx.serviceName} service page.
Service: ${ctx.serviceName}
Description: ${ctx.serviceDescription}
Tone: ${ctx.tone || "professional"}
Language: ${ctx.languageCode}
Sections: ${ctx.sectionCount}

Return JSON with this exact structure:
{
  "h1Variants": [${MIN_H1_POOL_SIZE}+ unique H1 headlines with {location} and {keyword} placeholders],
  "h2Variants": { "0": [${MIN_H2_POOL_SIZE}+ subheadings], "1": [...], ... for each section index },
  "paragraphVariants": { "0": [${MIN_PARAGRAPH_POOL_SIZE}+ paragraphs], "1": [...], ... for each section index }
}

Rules:
- Each variant must be unique and meaningfully different
- Use {location} placeholder for town/city name
- Use {keyword} placeholder for primary service keyword
- H1s should be compelling, SEO-friendly headlines
- Paragraphs should be 2-3 sentences each
- All content must sound natural, not templated`;
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a content generation assistant. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parsePoolResponse(raw: string, sectionCount: number): SpintaxPool {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in AI response");

  const parsed = JSON.parse(jsonMatch[0]);

  const h2Variants: Record<number, string[]> = {};
  const paragraphVariants: Record<number, string[]> = {};

  for (let i = 0; i < sectionCount; i++) {
    h2Variants[i] = parsed.h2Variants?.[String(i)] || parsed.h2Variants?.[i] || [];
    paragraphVariants[i] = parsed.paragraphVariants?.[String(i)] || parsed.paragraphVariants?.[i] || [];
  }

  return {
    h1Variants: parsed.h1Variants || [],
    h2Variants,
    paragraphVariants,
  };
}

function validatePoolSizes(pool: SpintaxPool, sectionCount: number): void {
  if (pool.h1Variants.length < MIN_H1_POOL_SIZE) {
    throw new Error(`H1 pool size ${pool.h1Variants.length} < minimum ${MIN_H1_POOL_SIZE}`);
  }
  for (let i = 0; i < sectionCount; i++) {
    if ((pool.h2Variants[i]?.length || 0) < MIN_H2_POOL_SIZE) {
      throw new Error(`H2 pool size for section ${i} < minimum ${MIN_H2_POOL_SIZE}`);
    }
    if ((pool.paragraphVariants[i]?.length || 0) < MIN_PARAGRAPH_POOL_SIZE) {
      throw new Error(`Paragraph pool size for section ${i} < minimum ${MIN_PARAGRAPH_POOL_SIZE}`);
    }
  }
}

export function generateFallbackPool(ctx: CampaignContext): SpintaxPool {
  const svc = ctx.serviceName;

  const h1Variants = [
    `{keyword} in {location} — Trusted Local ${svc}`,
    `Find the Best {keyword} in {location}`,
    `Professional {keyword} Services in {location}`,
    `{location}'s Leading {keyword} Provider`,
    `Expert {keyword} Near You in {location}`,
    `Top-Rated {keyword} in {location} — Call Today`,
    `Reliable {keyword} Services Across {location}`,
    `Your Local {keyword} Specialist in {location}`,
  ];

  const h2Variants: Record<number, string[]> = {};
  const paragraphVariants: Record<number, string[]> = {};

  const h2Templates = [
    [`Why Choose Our {keyword} in {location}`, `About Our ${svc} Services`, `What Sets Us Apart in {location}`, `Our Commitment to {location}`, `Trusted ${svc} Experts`],
    [`Our ${svc} Process`, `How We Deliver Results`, `Step-by-Step {keyword} Service`, `What to Expect from Our Team`, `Our Proven Approach`],
    [`Areas We Serve Near {location}`, `Serving {location} and Surrounding Areas`, `Local Coverage in {location}`, `{keyword} Across the {location} Region`, `Your Neighbourhood ${svc} Team`],
  ];

  const paraTemplates = [
    [`When you need {keyword} in {location}, our team delivers outstanding results every time.`, `Searching for reliable {keyword} in {location}? We have been serving the local community for years.`, `Our {keyword} services in {location} are designed around your specific requirements.`, `{location} residents trust us for professional {keyword} — and for good reason.`],
    [`We follow a proven process to deliver exceptional {keyword} results in {location}.`, `Our {location} team uses the latest techniques to ensure quality {keyword} outcomes.`, `From start to finish, our {keyword} process is transparent and efficient.`, `Every project in {location} benefits from our structured {keyword} approach.`],
    [`We proudly serve {location} and the wider surrounding area with expert {keyword}.`, `No matter where you are in {location}, our {keyword} team is ready to help.`, `Our coverage extends throughout {location}, bringing quality {keyword} to your doorstep.`, `Residents across {location} rely on our dependable {keyword} services.`],
  ];

  for (let i = 0; i < ctx.sectionCount; i++) {
    const templateIdx = i % h2Templates.length;
    h2Variants[i] = [...h2Templates[templateIdx]];
    paragraphVariants[i] = [...paraTemplates[templateIdx]];
  }

  return { h1Variants, h2Variants, paragraphVariants };
}

export function resolveH1(
  locationId: string,
  serviceId: string,
  pool: SpintaxPool,
  locationName: string,
  primaryKeyword: string
): string {
  const seed = hashSeed(locationId, serviceId);
  const idx = seededSelectIndex(seed, pool.h1Variants.length);
  const template = pool.h1Variants[idx];
  return injectPlaceholders(template, locationName, primaryKeyword);
}

export function resolveH2(
  locationId: string,
  serviceId: string,
  sectionIndex: number,
  pool: SpintaxPool
): string {
  const seed = hashSeed(locationId, serviceId + `-h2-${sectionIndex}`);
  const variants = pool.h2Variants[sectionIndex] || [];
  if (variants.length === 0) return "";
  const idx = seededSelectIndex(seed, variants.length);
  return variants[idx];
}

export function resolveParagraph(
  locationId: string,
  serviceId: string,
  sectionIndex: number,
  pool: SpintaxPool
): string {
  const seed = hashSeed(locationId, serviceId + `-p-${sectionIndex}`);
  const variants = pool.paragraphVariants[sectionIndex] || [];
  if (variants.length === 0) return "";
  const idx = seededSelectIndex(seed, variants.length);
  return variants[idx];
}

function injectPlaceholders(template: string, locationName: string, keyword: string): string {
  return template
    .replace(/\{location\}/gi, locationName)
    .replace(/\{keyword\}/gi, keyword);
}

export function checkH1Collision(
  resolvedH1: string,
  usedH1s: string[]
): boolean {
  return usedH1s.includes(resolvedH1);
}

export function resolveH1WithCollisionAvoidance(
  locationId: string,
  serviceId: string,
  pool: SpintaxPool,
  locationName: string,
  primaryKeyword: string,
  usedH1s: string[]
): { h1: string; collisionAvoided: boolean; variantIndex: number } {
  const baseSeed = hashSeed(locationId, serviceId);
  const baseIdx = seededSelectIndex(baseSeed, pool.h1Variants.length);

  const baseH1 = injectPlaceholders(pool.h1Variants[baseIdx], locationName, primaryKeyword);

  if (!checkH1Collision(baseH1, usedH1s)) {
    return { h1: baseH1, collisionAvoided: false, variantIndex: baseIdx };
  }

  for (let offset = 1; offset < pool.h1Variants.length; offset++) {
    const nextIdx = (baseIdx + offset) % pool.h1Variants.length;
    const candidate = injectPlaceholders(pool.h1Variants[nextIdx], locationName, primaryKeyword);
    if (!checkH1Collision(candidate, usedH1s)) {
      return { h1: candidate, collisionAvoided: true, variantIndex: nextIdx };
    }
  }

  return { h1: baseH1, collisionAvoided: true, variantIndex: baseIdx };
}

export async function expandPool(
  campaignId: string,
  workspaceId: string,
  poolType: "h1" | "h2" | "paragraph",
  sectionIndex: number | null,
  currentVariants: string[],
  expansionCount: number,
  poolStorage: PoolStorage,
  aiCallFn?: (prompt: string, apiKey: string) => Promise<string>,
  overrideApiKey?: string
): Promise<{ variants: string[]; expanded: boolean; reason?: string }> {
  if (expansionCount >= MAX_POOL_EXPANSIONS) {
    return {
      variants: currentVariants,
      expanded: false,
      reason: `Maximum pool expansions (${MAX_POOL_EXPANSIONS}) reached`,
    };
  }

  let apiKey = overrideApiKey || null;
  if (!apiKey) {
    const resolvedKey = await resolveAiKey(workspaceId, "openai");
    apiKey = resolvedKey.apiKey;
  }

  if (!apiKey) {
    return {
      variants: currentVariants,
      expanded: false,
      reason: "No AI API key available",
    };
  }

  const prompt = `Generate exactly 3 new unique content variants of type "${poolType}".
Existing variants (DO NOT duplicate):
${currentVariants.map((v, i) => `${i + 1}. ${v}`).join("\n")}

Return a JSON array of exactly 3 new strings. Each must be meaningfully different from existing variants.
Use {location} and {keyword} placeholders where appropriate.`;

  const caller = aiCallFn || callOpenAI;

  try {
    const raw = await caller(prompt, apiKey);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");

    const newVariants: string[] = JSON.parse(jsonMatch[0]);
    const combined = [...currentVariants, ...newVariants];

    const zoneId = sectionIndex !== null ? `section-${sectionIndex}` : null;

    await poolStorage.upsertPool({
      campaignId,
      venueId: workspaceId,
      poolType,
      zoneId,
      variants: combined,
      version: expansionCount + 2,
    });

    await poolStorage.logAudit({
      campaignId,
      venueId: workspaceId,
      action: "spintax_pool_expanded",
      message: `Pool type "${poolType}" expanded (expansion ${expansionCount + 1}/${MAX_POOL_EXPANSIONS}). Added ${newVariants.length} variants.`,
      meta: { poolType, sectionIndex, expansionCount: expansionCount + 1, newVariantCount: newVariants.length },
    });

    return { variants: combined, expanded: true };
  } catch (err: any) {
    return {
      variants: currentVariants,
      expanded: false,
      reason: `Expansion failed: ${err.message}`,
    };
  }
}

export function applyMicroVariation(text: string, seed: number): string {
  const words = text.split(/\s+/);
  if (words.length === 0) return text;

  const result: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i];
    const punctuationMatch = rawWord.match(/^([^\p{L}]*)([\p{L}]+)([^\p{L}]*)$/u);

    if (!punctuationMatch) {
      result.push(rawWord);
      continue;
    }

    const [, prefix, core, suffix] = punctuationMatch;
    const lower = core.toLowerCase();
    const synonyms = SYNONYM_MAP[lower];

    if (!synonyms || synonyms.length === 0) {
      result.push(rawWord);
      continue;
    }

    const wordSeed = seed + i * 7919;
    const r = seededRandom(wordSeed);

    if (r < 0.35) {
      result.push(rawWord);
      continue;
    }

    const synIdx = Math.floor(seededRandom(wordSeed + 1) * synonyms.length) % synonyms.length;
    let replacement = synonyms[synIdx];

    if (core[0] === core[0].toUpperCase()) {
      replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }

    result.push(prefix + replacement + suffix);
  }

  return result.join(" ");
}

export async function storePool(
  campaignId: string,
  workspaceId: string,
  pool: SpintaxPool,
  poolStorage: PoolStorage
): Promise<void> {
  await poolStorage.upsertPool({
    campaignId,
    venueId: workspaceId,
    poolType: "h1",
    zoneId: null,
    variants: pool.h1Variants,
    version: 1,
  });

  for (const [idx, variants] of Object.entries(pool.h2Variants)) {
    await poolStorage.upsertPool({
      campaignId,
      venueId: workspaceId,
      poolType: "h2",
      zoneId: `section-${idx}`,
      variants,
      version: 1,
    });
  }

  for (const [idx, variants] of Object.entries(pool.paragraphVariants)) {
    await poolStorage.upsertPool({
      campaignId,
      venueId: workspaceId,
      poolType: "paragraph",
      zoneId: `section-${idx}`,
      variants,
      version: 1,
    });
  }
}
