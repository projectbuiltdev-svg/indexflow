import { Router, Request, Response } from "express";
import { db } from "../db";
import { weTemplates } from "../../db/schema/we-templates";
import { weProjects } from "../../db/schema/we-projects";
import { weDeployments } from "../../db/schema/we-deployments";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { weFormSubmissions } from "../../db/schema/we-form-submissions";
import { weVersions } from "../../db/schema/we-versions";
import { workspaces } from "../../shared/schema";
import { getAllBlocks } from "../config/we-block-library";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

function requireSuperAdmin(req: Request, res: Response, next: Function) {
  const user = (req as any).user;
  if (!user || user.role !== "super_admin") {
    return res.status(403).json({ error: "Super admin required" });
  }
  next();
}

router.use(requireSuperAdmin);

router.get("/templates", async (_req: Request, res: Response) => {
  try {
    const templates = await db.select().from(weTemplates).orderBy(desc(weTemplates.createdAt));

    const projectCounts = await db.execute(
      sql`SELECT selected_template_id as "templateId", COUNT(*)::int as count FROM we_projects GROUP BY selected_template_id`
    );

    const usageMap = new Map<number, number>();
    for (const r of projectCounts.rows as any[]) {
      usageMap.set(r.templateId, r.count);
    }

    const result = templates.map((t) => ({
      ...t,
      usageCount: usageMap.get(t.id) || 0,
    }));

    res.json({ templates: result, total: result.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/templates", async (req: Request, res: Response) => {
  try {
    const { name, category, styleTags, featureTags, grapejsState, version } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "name and category required" });
    }

    if (grapejsState) {
      const validation = validateGrapejsState(grapejsState);
      if (!validation.valid) {
        return res.status(400).json({ error: "Invalid blocks", unknownBlocks: validation.unknownBlocks });
      }
    }

    const [template] = await db.insert(weTemplates).values({
      name,
      category,
      styleTags: styleTags || [],
      featureTags: featureTags || [],
      grapejsState: grapejsState || {},
      version: version || 1,
      isActive: false,
    }).returning();

    await db.insert(weAuditLog).values({
      venueId: "system",
      action: "template_created",
      userId: (req as any).user?.id,
      metadata: { templateId: template.id, name },
      severity: "info",
    });

    res.json(template);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/templates/:templateId", async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.templateId as string);
    const { name, category, styleTags, featureTags, isActive, grapejsState, version } = req.body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (styleTags !== undefined) updates.styleTags = styleTags;
    if (featureTags !== undefined) updates.featureTags = featureTags;
    if (isActive !== undefined) updates.isActive = isActive;
    if (grapejsState !== undefined) updates.grapejsState = grapejsState;
    if (version !== undefined) updates.version = version;
    updates.updatedAt = new Date();

    const [updated] = await db.update(weTemplates).set(updates).where(eq(weTemplates.id, templateId)).returning();

    await db.insert(weAuditLog).values({
      venueId: "system",
      action: "template_updated",
      userId: (req as any).user?.id,
      metadata: { templateId, changes: Object.keys(updates) },
      severity: "info",
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/templates/:templateId", async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.templateId as string);

    await db.update(weTemplates).set({ isActive: false, updatedAt: new Date() }).where(eq(weTemplates.id, templateId));

    await db.insert(weAuditLog).values({
      venueId: "system",
      action: "template_deleted",
      userId: (req as any).user?.id,
      metadata: { templateId },
      severity: "warn",
    });

    res.json({ deleted: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/templates/:templateId/validate", async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.templateId as string);
    const [template] = await db.select().from(weTemplates).where(eq(weTemplates.id, templateId));

    if (!template) return res.status(404).json({ error: "Template not found" });

    const validation = validateGrapejsState(template.grapejsState || {});
    res.json(validation);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/workspaces", async (_req: Request, res: Response) => {
  try {
    const allWorkspaces = await db.select().from(workspaces);

    const projRows = await db.execute(
      sql`SELECT venue_id, COUNT(*)::int as count FROM we_projects GROUP BY venue_id`
    );
    const projMap = new Map<string, number>();
    for (const r of projRows.rows as any[]) projMap.set(r.venue_id, r.count);

    const depRows = await db.execute(
      sql`SELECT venue_id, COUNT(*)::int as count FROM we_deployments GROUP BY venue_id`
    );
    const depMap = new Map<string, number>();
    for (const r of depRows.rows as any[]) depMap.set(r.venue_id, r.count);

    const result = allWorkspaces.map((ws) => ({
      venueId: ws.id,
      name: ws.name,
      tier: (ws as any).subscriptionTier || ws.plan || "solo",
      projectCount: projMap.get(ws.id) || 0,
      deploymentCount: depMap.get(ws.id) || 0,
      lastActive: ws.updatedAt || ws.createdAt,
    }));

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/workspaces/:venueId", async (req: Request, res: Response) => {
  try {
    const venueId = req.params.venueId as string;

    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, venueId));
    if (!ws) return res.status(404).json({ error: "Workspace not found" });

    const projects = await db.select().from(weProjects).where(eq(weProjects.venueId, venueId));
    const deployments = await db.select().from(weDeployments).where(eq(weDeployments.venueId, venueId)).orderBy(desc(weDeployments.createdAt));

    const formCountRes = await db.execute(
      sql`SELECT COUNT(*)::int as count FROM we_form_submissions WHERE venue_id = ${venueId}`
    );

    res.json({
      venueId: ws.id,
      name: ws.name,
      tier: (ws as any).subscriptionTier || ws.plan || "solo",
      projectCount: projects.length,
      projects: projects.map((p) => ({ id: p.id, name: p.name, status: p.status, templateId: p.selectedTemplateId })),
      deployments: deployments.map((d) => ({
        id: d.id, deploymentType: d.deploymentType, status: d.status, domain: d.domain, deployedAt: d.deployedAt,
      })),
      formSubmissionCount: Number((formCountRes.rows as any[])[0]?.count || 0),
      storageUsed: 0,
      byokStatus: (ws as any).aiKeySource || "agency",
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/workspaces/:venueId/audit", async (req: Request, res: Response) => {
  try {
    const venueId = req.params.venueId as string;
    const action = req.query.action as string | undefined;
    const severity = req.query.severity as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const conditions: any[] = [eq(weAuditLog.venueId, venueId)];
    if (action) conditions.push(eq(weAuditLog.action, action));
    if (severity && severity !== "all") conditions.push(eq(weAuditLog.severity, severity as any));
    if (from) conditions.push(gte(weAuditLog.createdAt, new Date(from)));
    if (to) conditions.push(lte(weAuditLog.createdAt, new Date(to)));

    const logs = await db.select().from(weAuditLog)
      .where(and(...conditions))
      .orderBy(desc(weAuditLog.createdAt))
      .limit(500);

    res.json(logs);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/workspaces/:venueId/access", async (req: Request, res: Response) => {
  try {
    const venueId = req.params.venueId as string;
    const { reason, dataType } = req.body;

    if (!reason || !dataType) {
      return res.status(400).json({ error: "reason and dataType required" });
    }

    const validTypes = ["grapesjs_state", "version_history", "analytics_config"];
    if (!validTypes.includes(dataType)) {
      return res.status(400).json({ error: "Invalid dataType" });
    }

    const userId = (req as any).user?.id;

    await db.insert(weAuditLog).values({
      venueId,
      action: "super_admin_access",
      userId,
      metadata: { reason, dataType, timestamp: new Date().toISOString() },
      severity: "warn",
    });

    let data: any = null;

    if (dataType === "grapesjs_state") {
      const projects = await db.select().from(weProjects).where(eq(weProjects.venueId, venueId));
      data = projects.map((p) => ({ id: p.id, name: p.name, buildState: p.buildState }));
    } else if (dataType === "version_history") {
      const versions = await db.select().from(weVersions).where(eq(weVersions.venueId, venueId)).orderBy(desc(weVersions.createdAt)).limit(50);
      data = versions;
    } else if (dataType === "analytics_config") {
      const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, venueId));
      data = { siteProfile: (ws as any)?.siteProfile };
    }

    res.json({ data, accessLogged: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const projRes = await db.execute(sql`SELECT COUNT(*)::int as count FROM we_projects`);
    const depRes = await db.execute(sql`SELECT COUNT(*)::int as count FROM we_deployments`);
    const formRes = await db.execute(sql`SELECT COUNT(*)::int as count FROM we_form_submissions`);
    const activeRes = await db.execute(sql`SELECT COUNT(DISTINCT venue_id)::int as count FROM we_projects`);

    const depByType = await db.execute(
      sql`SELECT deployment_type as type, COUNT(*)::int as count FROM we_deployments GROUP BY deployment_type`
    );

    const topTpl = await db.execute(
      sql`SELECT selected_template_id as "templateId", COUNT(*)::int as count FROM we_projects GROUP BY selected_template_id ORDER BY count DESC LIMIT 5`
    );

    const templateNames = await db.select({ id: weTemplates.id, name: weTemplates.name }).from(weTemplates);
    const nameMap = new Map<number, string>();
    for (const t of templateNames) nameMap.set(t.id, t.name);

    const deploymentsByType: Record<string, number> = {};
    for (const d of depByType.rows as any[]) deploymentsByType[d.type] = d.count;

    res.json({
      totalProjects: Number((projRes.rows as any[])[0]?.count || 0),
      totalDeployments: Number((depRes.rows as any[])[0]?.count || 0),
      totalTemplateUses: Number((projRes.rows as any[])[0]?.count || 0),
      activeWorkspaces: Number((activeRes.rows as any[])[0]?.count || 0),
      formSubmissionCount: Number((formRes.rows as any[])[0]?.count || 0),
      deploymentsByType,
      topTemplates: (topTpl.rows as any[]).map((t: any) => ({
        templateId: t.templateId,
        name: nameMap.get(t.templateId) || `Template #${t.templateId}`,
        count: t.count,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

function validateGrapejsState(state: Record<string, any>): { valid: boolean; unknownBlocks: string[]; warnings: string[] } {
  const knownBlockIds = new Set(getAllBlocks().map((b) => b.id));
  const unknownBlocks: string[] = [];
  const warnings: string[] = [];

  const components = state.components || state.pages?.[0]?.frames?.[0]?.component?.components || [];

  function walk(items: any[]) {
    for (const item of items) {
      const blockType = item.type || item.tagName;
      if (blockType && blockType !== "default" && blockType !== "text" && blockType !== "image" && blockType !== "wrapper" && !knownBlockIds.has(blockType)) {
        unknownBlocks.push(blockType);
      }
      if (item.components) walk(item.components);
    }
  }

  if (Array.isArray(components)) walk(components);

  return { valid: unknownBlocks.length === 0, unknownBlocks, warnings };
}

export default router;
