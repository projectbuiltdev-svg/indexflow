import { db } from "../db";
import { weTemplates } from "../../db/schema/we-templates";
import { weProjects } from "../../db/schema/we-projects";
import { wePages } from "../../db/schema/we-pages";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, desc } from "drizzle-orm";

export interface ScoredTemplate {
  name: string;
  category: string;
  styleTags: string[] | null;
  featureTags: string[] | null;
  score: number;
  version: number;
  createdAt: Date | null;
  _internalId: number;
}

interface IntakeAnswers {
  businessType?: string;
  needsContactForm?: boolean;
  needsGallery?: boolean;
  needsPricing?: boolean;
  needsTestimonials?: boolean;
  needsTeam?: boolean;
  pageCount?: number;
  stylePreference?: string;
  [key: string]: any;
}

function hasBlock(state: Record<string, any> | null, ...blockIds: string[]): boolean {
  if (!state) return false;
  const json = JSON.stringify(state);
  return blockIds.some((id) => json.includes(id));
}

export function scoreOne(template: { category: string | null; styleTags: any; grapejsState: any }, intake: IntakeAnswers): number {
  let score = 0;
  const state = template.grapejsState as Record<string, any> | null;

  if (intake.businessType && template.category && intake.businessType.toLowerCase() === template.category.toLowerCase()) score++;
  if (intake.needsContactForm && hasBlock(state, "form-contact")) score++;
  if (intake.needsGallery && hasBlock(state, "media-gallery-grid", "media-gallery-masonry")) score++;
  if (intake.needsPricing && hasBlock(state, "pricing-table-2col", "pricing-table-3col")) score++;
  if (intake.needsTestimonials && hasBlock(state, "social-testimonials-grid", "social-testimonials-carousel")) score++;
  if (intake.needsTeam && hasBlock(state, "team-grid", "team-list")) score++;

  if (intake.pageCount !== undefined) {
    if (intake.pageCount <= 3 && hasBlock(state, "footer") && !hasBlock(state, "nav-mega")) score++;
    if (intake.pageCount > 3 && hasBlock(state, "nav-mega", "nav-standard")) score++;
  }

  if (intake.stylePreference && Array.isArray(template.styleTags)) {
    const pref = intake.stylePreference.toLowerCase();
    if (template.styleTags.some((t: string) => t.toLowerCase() === pref)) score++;
  }

  return score;
}

export async function scoreTemplates(intakeAnswers: IntakeAnswers, _venueId: string): Promise<ScoredTemplate[]> {
  const templates = await db
    .select()
    .from(weTemplates)
    .where(eq(weTemplates.isActive, true))
    .orderBy(desc(weTemplates.createdAt));

  const scored = templates.map((t) => ({
    name: t.name,
    category: t.category,
    styleTags: t.styleTags,
    featureTags: t.featureTags,
    score: scoreOne(t, intakeAnswers),
    version: t.version,
    createdAt: t.createdAt,
    _internalId: t.id,
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aTime = a.createdAt ? a.createdAt.getTime() : 0;
    const bTime = b.createdAt ? b.createdAt.getTime() : 0;
    return bTime - aTime;
  });

  if (scored.length <= 3) return scored;

  const topCategory = scored[0].category;
  const sameCategory = scored.filter((s) => s.category === topCategory);

  if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
  return [scored[0], ...sameCategory.filter((s) => s._internalId !== scored[0]._internalId).slice(0, 2)];
}

export async function selectTemplate(projectId: number, templateId: number, venueId: string, userId?: string): Promise<void> {
  const [template] = await db
    .select()
    .from(weTemplates)
    .where(eq(weTemplates.id, templateId));

  if (!template) throw new Error("Template not found");

  await db
    .update(weProjects)
    .set({ selectedTemplateId: templateId, updatedAt: new Date() })
    .where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));

  await db.insert(wePages).values({
    projectId,
    venueId,
    name: "Home",
    slug: "/",
    grapejsState: template.grapejsState,
    isHome: true,
    pageOrder: 0,
    accessTag: "public",
  });

  await db.insert(weAuditLog).values({
    venueId,
    projectId,
    userId: userId || null,
    action: "template_selected",
    metadata: { templateId, templateName: template.name },
    severity: "info",
  });
}

export async function getSelectedTemplate(projectId: number, venueId: string): Promise<{ name: string; category: string; styleTags: string[] | null; featureTags: string[] | null; version: number } | null> {
  const [project] = await db
    .select({ selectedTemplateId: weProjects.selectedTemplateId })
    .from(weProjects)
    .where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));

  if (!project?.selectedTemplateId) return null;

  const [template] = await db
    .select({
      name: weTemplates.name,
      category: weTemplates.category,
      styleTags: weTemplates.styleTags,
      featureTags: weTemplates.featureTags,
      version: weTemplates.version,
    })
    .from(weTemplates)
    .where(eq(weTemplates.id, project.selectedTemplateId));

  return template || null;
}
