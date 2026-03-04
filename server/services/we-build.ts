import { db } from "../db";
import { weProjects } from "../../db/schema/we-projects";
import { wePages } from "../../db/schema/we-pages";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and } from "drizzle-orm";
import { scoreTemplates, selectTemplate } from "./we-template-scorer";
import { resolveAiKey } from "../ai-chat";
import { applyDiff, parseDiff } from "./we-diff";
import { isSupported } from "../config/we-language-config";

export interface BuildStatus {
  status: "idle" | "building" | "built" | "paused" | "failed";
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  failedStep: number | null;
  percentComplete: number;
}

const TOTAL_STEPS = 21;

async function getProject(projectId: number, venueId: string) {
  const [p] = await db.select().from(weProjects).where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));
  return p;
}

async function updateBuildState(projectId: number, state: Record<string, any>) {
  await db.update(weProjects).set({ buildState: state, updatedAt: new Date() }).where(eq(weProjects.id, projectId));
}

async function runStep(step: number, projectId: number, venueId: string): Promise<void> {
  const project = await getProject(projectId, venueId);
  if (!project) throw new Error("Project not found");

  const intake = (project.intakeAnswers as Record<string, any>) || {};
  const lang = project.projectLanguage || "en";

  switch (step) {
    case 1: {
      if (!project.intakeAnswers) throw new Error("No intake answers");
      break;
    }
    case 2: {
      const key = await resolveAiKey(venueId, "openai");
      if (!key.apiKey) throw new Error("No BYOK key connected");
      break;
    }
    case 3: {
      if (!project.selectedTemplateId || project.selectedTemplateId === 0) {
        const scored = await scoreTemplates(intake, venueId);
        if (scored.length > 0) {
          await selectTemplate(projectId, scored[0]._internalId, venueId);
        }
      }
      break;
    }
    case 4: {
      const pages = await db.select().from(wePages).where(and(eq(wePages.projectId, projectId), eq(wePages.venueId, venueId)));
      if (pages.length === 0) {
        const refreshed = await getProject(projectId, venueId);
        if (refreshed?.selectedTemplateId) {
          await selectTemplate(projectId, refreshed.selectedTemplateId, venueId);
        }
      }
      break;
    }
    case 5: {
      const pages = await db.select().from(wePages).where(eq(wePages.projectId, projectId));
      const homePage = pages.find((p) => p.isHome);
      if (homePage?.grapejsState) {
        const state = homePage.grapejsState as Record<string, any>;
        const tokens = {
          extractedAt: new Date().toISOString(),
          colors: state.styles?.colors || [],
          fonts: state.styles?.fonts || [],
          source: "template",
        };
        await updateBuildState(projectId, { ...((await getProject(projectId, venueId))?.buildState as any || {}), designTokens: tokens });
      }
      break;
    }
    case 6:
    case 7:
    case 8: {
      break;
    }
    case 9:
    case 10: {
      break;
    }
    case 11: {
      const pages = await db.select().from(wePages).where(and(eq(wePages.projectId, projectId), eq(wePages.venueId, venueId)));
      for (const page of pages) {
        if (!page.seoMeta) {
          const meta = {
            title: `${page.name} | ${project.name}`,
            description: `${page.name} page for ${project.name}`,
          };
          await db.update(wePages).set({ seoMeta: meta }).where(eq(wePages.id, page.id));
        }
      }
      break;
    }
    case 12: {
      break;
    }
    case 13: {
      const existing404 = await db.select().from(wePages).where(and(eq(wePages.projectId, projectId), eq(wePages.slug, "/404")));
      if (existing404.length === 0) {
        await db.insert(wePages).values({
          projectId,
          venueId,
          name: "404",
          slug: "/404",
          grapejsState: { components: [{ type: "text", content: "Page not found" }] },
          isHome: false,
          pageOrder: 999,
          accessTag: "public",
        });
      }
      break;
    }
    case 14: {
      const pages = await db.select({ slug: wePages.slug }).from(wePages).where(and(eq(wePages.projectId, projectId), eq(wePages.accessTag, "public")));
      const sitemap = pages.map((p) => p.slug).join("\n");
      const bs = (await getProject(projectId, venueId))?.buildState as any || {};
      await updateBuildState(projectId, { ...bs, sitemap });
      break;
    }
    case 15: {
      const bs = (await getProject(projectId, venueId))?.buildState as any || {};
      await updateBuildState(projectId, { ...bs, robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin" });
      break;
    }
    case 16: {
      if (!isSupported(lang)) {
        throw new Error(`Unsupported language: ${lang}`);
      }
      break;
    }
    case 17:
    case 18: {
      break;
    }
    case 19: {
      const pages = await db.select().from(wePages).where(eq(wePages.projectId, projectId));
      for (const page of pages) {
        if (!page.grapejsState) {
          throw new Error(`Page ${page.name} has no content`);
        }
      }
      break;
    }
    case 20: {
      const pages = await db.select().from(wePages).where(eq(wePages.projectId, projectId));
      const warnings: string[] = [];
      for (const page of pages) {
        if (!page.grapejsState) warnings.push(`${page.name}: empty`);
      }
      if (warnings.length > 0) {
        const bs = (await getProject(projectId, venueId))?.buildState as any || {};
        await updateBuildState(projectId, { ...bs, qualityWarnings: warnings });
      }
      break;
    }
    case 21: {
      await db.update(weProjects).set({ status: "built", updatedAt: new Date() }).where(eq(weProjects.id, projectId));
      await db.insert(weAuditLog).values({
        venueId,
        projectId,
        action: "build_completed",
        metadata: { totalSteps: TOTAL_STEPS },
        severity: "info",
      });
      break;
    }
  }
}

export async function startBuild(projectId: number, venueId: string): Promise<void> {
  const project = await getProject(projectId, venueId);
  if (!project) throw new Error("Project not found");
  if ((project.buildState as any)?.status === "building") throw new Error("Already building");

  await db.update(weProjects).set({
    status: "building",
    buildState: { status: "building", currentStep: 1, completedSteps: [], failedStep: null },
    updatedAt: new Date(),
  }).where(eq(weProjects.id, projectId));

  (async () => {
    const completedSteps: number[] = [];
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      let success = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await runStep(step, projectId, venueId);
          success = true;
          break;
        } catch (err) {
          if (attempt === 2) {
            await updateBuildState(projectId, {
              status: "paused",
              currentStep: step,
              completedSteps,
              failedStep: step,
            });
            await db.update(weProjects).set({ status: "paused" }).where(eq(weProjects.id, projectId));
            return;
          }
        }
      }
      if (success) {
        completedSteps.push(step);
        await updateBuildState(projectId, {
          status: "building",
          currentStep: step,
          completedSteps,
          failedStep: null,
        });
      }
    }
  })();
}

export async function resumeBuild(projectId: number, venueId: string): Promise<void> {
  const project = await getProject(projectId, venueId);
  if (!project) throw new Error("Project not found");

  const bs = project.buildState as any;
  if (!bs?.failedStep) throw new Error("No failed step to resume from");

  const startStep = bs.failedStep as number;
  const completedSteps: number[] = bs.completedSteps || [];

  await db.update(weProjects).set({
    status: "building",
    buildState: { ...bs, status: "building", failedStep: null },
    updatedAt: new Date(),
  }).where(eq(weProjects.id, projectId));

  (async () => {
    for (let step = startStep; step <= TOTAL_STEPS; step++) {
      let success = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await runStep(step, projectId, venueId);
          success = true;
          break;
        } catch {
          if (attempt === 2) {
            await updateBuildState(projectId, {
              status: "paused",
              currentStep: step,
              completedSteps,
              failedStep: step,
            });
            await db.update(weProjects).set({ status: "paused" }).where(eq(weProjects.id, projectId));
            return;
          }
        }
      }
      if (success) {
        completedSteps.push(step);
        await updateBuildState(projectId, {
          status: "building",
          currentStep: step,
          completedSteps,
          failedStep: null,
        });
      }
    }
  })();
}

export async function getBuildStatus(projectId: number, venueId: string): Promise<BuildStatus> {
  const project = await getProject(projectId, venueId);
  if (!project) return { status: "idle", currentStep: 0, totalSteps: TOTAL_STEPS, completedSteps: [], failedStep: null, percentComplete: 0 };

  const bs = project.buildState as any;
  if (!bs) return { status: "idle", currentStep: 0, totalSteps: TOTAL_STEPS, completedSteps: [], failedStep: null, percentComplete: 0 };

  const completedSteps = bs.completedSteps || [];
  return {
    status: bs.status || "idle",
    currentStep: bs.currentStep || 0,
    totalSteps: TOTAL_STEPS,
    completedSteps,
    failedStep: bs.failedStep || null,
    percentComplete: Math.round((completedSteps.length / TOTAL_STEPS) * 100),
  };
}
