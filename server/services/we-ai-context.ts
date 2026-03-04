import { db } from "../db";
import { weProjects } from "../../db/schema/we-projects";
import { wePages } from "../../db/schema/we-pages";
import { weTemplates } from "../../db/schema/we-templates";
import { eq, and } from "drizzle-orm";
import { getAllBlocks } from "../config/we-block-library";
import { storage } from "../storage";

export interface AiContext {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  maxTokens: number;
}

export async function buildAiContext(
  projectId: number,
  pageId: number,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  venueId: string
): Promise<AiContext> {
  const [project] = await db
    .select()
    .from(weProjects)
    .where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));

  const [page] = await db
    .select()
    .from(wePages)
    .where(and(eq(wePages.id, pageId), eq(wePages.projectId, projectId)));

  const allBlocks = getAllBlocks();
  const blockList = allBlocks.map((b) => `${b.id} (${b.category})`).join(", ");

  let templateCategory = "";
  if (project?.selectedTemplateId) {
    const [tpl] = await db
      .select({ category: weTemplates.category })
      .from(weTemplates)
      .where(eq(weTemplates.id, project.selectedTemplateId));
    if (tpl) templateCategory = tpl.category;
  }

  let model = "gpt-4o";
  try {
    const providers = await storage.getAiProviderSettings(venueId);
    const openai = providers.find((p) => p.provider === "openai" && p.isEnabled);
    if (openai && (openai as any).model) model = (openai as any).model;
  } catch {}

  const lang = project?.projectLanguage || "en";
  const intake = (project?.intakeAnswers as Record<string, any>) || {};

  const systemPrompt = [
    "You are a website builder assistant for IndexFlow.",
    "You customise pre-built blocks only. Never generate structure from scratch.",
    `You always respond in ${lang}.`,
    "You return only a JSON diff of changed blocks.",
    "You never argue. You execute the instruction.",
    `Available blocks: ${blockList}`,
  ].join("\n");

  const projectContext = [
    `Project: ${project?.name || "Untitled"}`,
    `Business type: ${intake.businessType || "general"}`,
    `Style preferences: ${intake.stylePreference || "none specified"}`,
    `Current page: ${page?.name || "Unknown"} (${page?.slug || "/"})`,
    `Template category: ${templateCategory || "none"}`,
  ].join("\n");

  const recentHistory = conversationHistory.slice(-5);
  const historyText = recentHistory
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const canvasState = page?.grapejsState
    ? JSON.stringify(page.grapejsState).slice(0, 8000)
    : "{}";

  const userPrompt = [
    "PROJECT CONTEXT:",
    projectContext,
    "",
    "CURRENT CANVAS STATE:",
    canvasState,
    "",
    "CONVERSATION HISTORY:",
    historyText,
    "",
    "USER INSTRUCTION:",
    userMessage,
  ].join("\n");

  return { systemPrompt, userPrompt, model, maxTokens: 4000 };
}
