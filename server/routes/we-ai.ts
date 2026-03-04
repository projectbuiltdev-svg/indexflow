import { Router, Request, Response } from "express";
import { db } from "../db";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { wePages } from "../../db/schema/we-pages";
import { eq, and } from "drizzle-orm";
import { buildAiContext } from "../services/we-ai-context";
import OpenAI from "openai";

const router = Router();
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 5000;
const TIMEOUT_MS = 30000;

router.post("/:projectId/:pageId/chat", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);
    const { message, conversationHistory } = req.body;

    if (!message) return res.status(400).json({ error: "message is required" });

    const lastCall = cooldowns.get(venueId) || 0;
    if (Date.now() - lastCall < COOLDOWN_MS) {
      return res.status(429).json({ error: "Please wait before sending another request" });
    }
    cooldowns.set(venueId, Date.now());

    const context = await buildAiContext(
      projectId,
      pageId,
      message,
      conversationHistory || [],
      venueId
    );

    const apiKey = (req as any).resolvedByokKey as string;
    const client = new OpenAI({ apiKey });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let responseText = "";
    try {
      const completion = await client.chat.completions.create(
        {
          model: context.model,
          max_tokens: context.maxTokens,
          messages: [
            { role: "system", content: context.systemPrompt },
            { role: "user", content: context.userPrompt },
          ],
        },
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      responseText = completion.choices[0]?.message?.content || "";
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        return res.status(504).json({ error: "AI request timed out" });
      }
      throw err;
    }

    let parsed: any;
    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/) ||
                        responseText.match(/(\{[\s\S]*\})/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[1]);
    } catch {
      return res.status(422).json({
        error: "AI response was not parseable as JSON diff",
        raw: responseText.slice(0, 500),
      });
    }

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "ai_chat",
      metadata: { pageId, model: context.model },
      severity: "info",
    }).catch(() => {});

    res.json({ diff: parsed });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/out-of-library", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const { instruction } = req.body;

    if (!instruction) return res.status(400).json({ error: "instruction is required" });

    const apiKey = (req as any).resolvedByokKey as string;
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: [
            "You are an expert web developer.",
            "Generate clean, responsive HTML/CSS/JS code for the user's request.",
            "Return a JSON object with exactly three keys: html, css, js.",
            "Do not include <html>, <head>, or <body> tags.",
            "Only return the JSON object, nothing else.",
          ].join("\n"),
        },
        { role: "user", content: instruction },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "";
    let result: { html: string; css: string; js: string };

    try {
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/);
      if (!jsonMatch) throw new Error("No JSON");
      result = JSON.parse(jsonMatch[1]);
    } catch {
      result = { html: raw, css: "", js: "" };
    }

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "ai_code_generation",
      metadata: { projectId },
      severity: "info",
    }).catch(() => {});

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
