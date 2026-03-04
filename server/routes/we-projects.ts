import { Router, Request, Response } from "express";
import { db } from "../db";
import { weProjects } from "../../db/schema/we-projects";
import { wePages } from "../../db/schema/we-pages";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, desc, count, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projects = await db
      .select()
      .from(weProjects)
      .where(eq(weProjects.venueId, venueId))
      .orderBy(desc(weProjects.updatedAt));
    res.json({ projects, total: projects.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const { name, projectLanguage, intakeAnswers, selectedTemplateId } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now().toString(36);

    const tier = (req as any).tier || "solo";

    const [project] = await db
      .insert(weProjects)
      .values({
        venueId,
        name,
        slug,
        projectLanguage: projectLanguage || "en",
        tierAtCreation: tier,
        status: "draft",
        intakeAnswers: intakeAnswers || null,
        selectedTemplateId: selectedTemplateId || 0,
      })
      .returning();

    await db.insert(weAuditLog).values({
      venueId,
      projectId: project.id,
      userId: (req as any).user?.id,
      action: "project_created",
      metadata: { name, slug },
      severity: "info",
    });

    res.status(201).json(project);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const [project] = await db
      .select()
      .from(weProjects)
      .where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));

    if (!project) return res.status(404).json({ error: "Project not found" });

    const [pageCount] = await db
      .select({ count: count() })
      .from(wePages)
      .where(eq(wePages.projectId, projectId));

    res.json({ ...project, pageCount: pageCount?.count || 0 });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const { name, projectLanguage, intakeAnswers, status } = req.body;

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (projectLanguage !== undefined) updates.projectLanguage = projectLanguage;
    if (intakeAnswers !== undefined) updates.intakeAnswers = intakeAnswers;
    if (status !== undefined) updates.status = status;

    const [updated] = await db
      .update(weProjects)
      .set(updates)
      .where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Project not found" });

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "project_updated",
      metadata: { fields: Object.keys(updates) },
      severity: "info",
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const [updated] = await db
      .update(weProjects)
      .set({ status: "deleted", updatedAt: new Date() })
      .where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Project not found" });

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "project_deleted",
      metadata: { warning: "Pages, versions, and form submissions are retained" },
      severity: "warn",
    });

    res.json({ success: true, warning: "Pages, versions, and form submissions are retained" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
