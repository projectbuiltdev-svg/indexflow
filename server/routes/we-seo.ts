import { Router, Request, Response } from "express";
import { db } from "../db";
import { wePages } from "../../db/schema/we-pages";
import { weProjects } from "../../db/schema/we-projects";
import { eq, and } from "drizzle-orm";

const router = Router();

router.post("/:projectId/:pageId/generate", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);

    const [page] = await db
      .select()
      .from(wePages)
      .where(and(eq(wePages.id, pageId), eq(wePages.projectId, projectId), eq(wePages.venueId, venueId)));

    if (!page) return res.status(404).json({ error: "Page not found" });

    const [project] = await db
      .select({ projectLanguage: weProjects.projectLanguage, name: weProjects.name })
      .from(weProjects)
      .where(eq(weProjects.id, projectId));

    const existingMeta = (page.seoMeta as Record<string, any>) || {};
    const state = page.grapejsState as Record<string, any> || {};

    const pageText = extractTextFromState(state);
    const lang = project?.projectLanguage || "en";

    const generated: Record<string, any> = {};

    if (!existingMeta.title_manually_edited) {
      generated.title = generateTitle(page.name, project?.name || "", lang);
    }
    if (!existingMeta.description_manually_edited) {
      generated.description = generateDescription(pageText, lang);
    }
    if (!existingMeta.ogTitle_manually_edited) {
      generated.ogTitle = generated.title || existingMeta.title || page.name;
    }
    if (!existingMeta.ogDescription_manually_edited) {
      generated.ogDescription = generated.description || existingMeta.description || "";
    }

    const merged = { ...existingMeta, ...generated };

    await db
      .update(wePages)
      .set({ seoMeta: merged, updatedAt: new Date() })
      .where(eq(wePages.id, pageId));

    res.json({
      title: merged.title || "",
      description: merged.description || "",
      ogTitle: merged.ogTitle || "",
      ogDescription: merged.ogDescription || "",
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:projectId/:pageId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);

    const [page] = await db
      .select()
      .from(wePages)
      .where(and(eq(wePages.id, pageId), eq(wePages.projectId, projectId), eq(wePages.venueId, venueId)));

    if (!page) return res.status(404).json({ error: "Page not found" });

    const existingMeta = (page.seoMeta as Record<string, any>) || {};
    const updates = req.body as Record<string, any>;

    for (const [key, value] of Object.entries(updates)) {
      existingMeta[key] = value;
      existingMeta[`${key}_manually_edited`] = true;
    }

    const [updated] = await db
      .update(wePages)
      .set({ seoMeta: existingMeta, updatedAt: new Date() })
      .where(eq(wePages.id, pageId))
      .returning();

    res.json(updated.seoMeta);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

function extractTextFromState(state: Record<string, any>): string {
  const texts: string[] = [];
  function walk(obj: any) {
    if (!obj) return;
    if (typeof obj === "string") { texts.push(obj); return; }
    if (obj.content && typeof obj.content === "string") texts.push(obj.content);
    if (obj.text && typeof obj.text === "string") texts.push(obj.text);
    if (Array.isArray(obj.components)) obj.components.forEach(walk);
    if (Array.isArray(obj)) obj.forEach(walk);
  }
  walk(state);
  return texts.join(" ").slice(0, 500);
}

function generateTitle(pageName: string, projectName: string, _lang: string): string {
  return `${pageName} | ${projectName}`.slice(0, 60);
}

function generateDescription(text: string, _lang: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 155) || "Discover more on this page.";
}

export default router;
