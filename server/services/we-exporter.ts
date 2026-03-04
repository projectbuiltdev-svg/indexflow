import { db } from "../db";
import { weProjects } from "../../db/schema/we-projects";
import { wePages } from "../../db/schema/we-pages";
import { weProjectAssets } from "../../db/schema/we-project-assets";
import { weDeployments } from "../../db/schema/we-deployments";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, isNull } from "drizzle-orm";
import { minifyHtml, minifyCss, minifyJs, inlineCriticalCss, generateSrcsets, bundleFonts } from "./we-optimiser";
import fs from "fs";
import path from "path";

export interface ExportJob {
  jobId: string;
  status: "processing" | "complete" | "failed";
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
}

const jobs = new Map<string, ExportJob>();

function generateJobId(): string {
  return `exp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function generateExport(projectId: number, venueId: string): Promise<ExportJob> {
  const jobId = generateJobId();
  const job: ExportJob = { jobId, status: "processing" };
  jobs.set(jobId, job);

  (async () => {
    try {
      const [project] = await db.select().from(weProjects).where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));
      if (!project) throw new Error("Project not found");

      const pages = await db.select().from(wePages).where(and(eq(wePages.projectId, projectId), isNull(wePages.deletedAt)));
      const assets = await db.select().from(weProjectAssets).where(eq(weProjectAssets.projectId, projectId));

      const exportDir = path.join(process.cwd(), "uploads", "we-exports", venueId, projectId.toString(), jobId);
      const srcDir = path.join(exportDir, "src");
      const distDir = path.join(exportDir, "dist");
      fs.mkdirSync(path.join(srcDir, "pages"), { recursive: true });
      fs.mkdirSync(path.join(srcDir, "assets"), { recursive: true });
      fs.mkdirSync(path.join(distDir, "pages"), { recursive: true });
      fs.mkdirSync(path.join(distDir, "assets"), { recursive: true });

      const report: string[] = ["Optimisation Report", "=".repeat(40), ""];
      let totalOriginal = 0;
      let totalOptimised = 0;

      for (const page of pages) {
        const state = page.grapejsState as any || {};
        const rawHtml = state.html || `<div>${page.name}</div>`;
        const rawCss = state.css || "";
        const rawJs = state.js || "";

        const srcHtml = wrapHtml(rawHtml, rawCss, rawJs, page.name, page.seoMeta as any);
        fs.writeFileSync(path.join(srcDir, "pages", `${page.slug === "/" ? "index" : page.slug.replace(/\//g, "-")}.html`), srcHtml);

        let distHtml = minifyHtml(srcHtml);
        const distCss = minifyCss(rawCss);
        const distJs = minifyJs(rawJs);
        distHtml = inlineCriticalCss(distHtml, distCss);
        distHtml = generateSrcsets(distHtml);
        distHtml = await bundleFonts(distHtml, projectId.toString(), venueId);

        const distFileName = `${page.slug === "/" ? "index" : page.slug.replace(/\//g, "-")}.html`;
        fs.writeFileSync(path.join(distDir, "pages", distFileName), distHtml);

        const srcSize = Buffer.byteLength(srcHtml);
        const distSize = Buffer.byteLength(distHtml);
        totalOriginal += srcSize;
        totalOptimised += distSize;
        report.push(`${page.name}: ${srcSize}B → ${distSize}B (${Math.round((1 - distSize / srcSize) * 100)}% saved)`);
      }

      const publicPages = pages.filter((p) => p.accessTag === "public");
      const sitemapEntries = publicPages.map((p) => `<url><loc>${p.slug}</loc></url>`);
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>`;
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
      fs.writeFileSync(path.join(srcDir, "sitemap.xml"), sitemap);

      const robots = "User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: /sitemap.xml";
      fs.writeFileSync(path.join(distDir, "robots.txt"), robots);
      fs.writeFileSync(path.join(srcDir, "robots.txt"), robots);

      const lang = project.projectLanguage || "en";
      const readme = [
        `# ${project.name} — Export`,
        "",
        `Language: ${lang}`,
        "",
        "## Pages",
        ...pages.map((p) => `- ${p.name} (${p.slug}) [${p.accessTag}]`),
        "",
        "## Assets",
        ...assets.map((a) => `- ${a.filename} (${a.fileType})`),
        "",
        "## Setup",
        "1. Upload /dist/ contents to your hosting provider",
        "2. Configure SSL certificate for your domain",
        "3. Point DNS to your hosting provider",
        "4. Form submissions require a backend handler — see form handler docs",
        "",
        `Generated: ${new Date().toISOString()}`,
      ].join("\n");
      fs.writeFileSync(path.join(exportDir, "README.md"), readme);

      report.push("", `Total: ${totalOriginal}B → ${totalOptimised}B (${Math.round((1 - totalOptimised / Math.max(totalOriginal, 1)) * 100)}% saved)`);
      fs.writeFileSync(path.join(exportDir, "optimisation-report.txt"), report.join("\n"));

      const downloadUrl = `/uploads/we-exports/${venueId}/${projectId}/${jobId}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await db.insert(weDeployments).values({
        projectId,
        venueId,
        deploymentType: "test",
        htmlSnapshot: downloadUrl,
        status: "success",
        deployedAt: new Date(),
      });

      await db.insert(weAuditLog).values({
        venueId,
        projectId,
        action: "export_generated",
        metadata: { jobId, pageCount: pages.length, totalOriginal, totalOptimised },
        severity: "info",
      });

      jobs.set(jobId, { jobId, status: "complete", downloadUrl, expiresAt });
    } catch (e: any) {
      jobs.set(jobId, { jobId, status: "failed", error: e.message });
    }
  })();

  return job;
}

export function getExportStatus(jobId: string): ExportJob | null {
  return jobs.get(jobId) || null;
}

function wrapHtml(body: string, css: string, js: string, title: string, seoMeta?: Record<string, any>): string {
  const meta = seoMeta || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title || title}</title>
  <meta name="description" content="${meta.description || ""}">
  <meta property="og:title" content="${meta.ogTitle || meta.title || title}">
  <meta property="og:description" content="${meta.ogDescription || meta.description || ""}">
  <style>${css}</style>
</head>
<body>
${body}
<script>${js}</script>
</body>
</html>`;
}
