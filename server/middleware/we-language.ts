import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { weProjects } from "../../db/schema/we-projects";
import { eq } from "drizzle-orm";
import { isSupported, DEFAULT_LANGUAGE } from "../config/we-language-config";
import { storage } from "../storage";

export async function weLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const projectId = req.params.projectId ? parseInt(req.params.projectId as string) : null;
  const venueId = (req as any).venueId as string;

  let lang: string | null = null;

  if (projectId) {
    try {
      const [project] = await db
        .select({ projectLanguage: weProjects.projectLanguage })
        .from(weProjects)
        .where(eq(weProjects.id, projectId))
        .limit(1);
      if (project?.projectLanguage) {
        lang = project.projectLanguage;
      }
    } catch {}
  }

  if (!lang && venueId) {
    try {
      const ws = await storage.getWorkspace(venueId);
      if (ws && (ws as any).language) {
        lang = (ws as any).language;
      }
    } catch {}
  }

  if (!lang || !isSupported(lang)) {
    lang = DEFAULT_LANGUAGE;
  }

  (req as any).resolvedLanguage = lang;
  next();
}
