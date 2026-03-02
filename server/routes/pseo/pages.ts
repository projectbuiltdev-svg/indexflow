import type { Express } from "express";
import { db } from "../../db";
import { pseoPages, workspaceSitePages } from "@shared/schema";
import { pseoAuditLog } from "../../../db/schema/pseo-audit-log";
import { eq, and, isNull, ne } from "drizzle-orm";
import { requirePseoPermission, extractUserRole } from "../../middleware/pseo-permissions";
import { softDelete } from "../../utils/pseo-soft-delete";
import { createPseoError, PseoErrorType } from "../../pseo/error-handler";

const GSC_INDEXING_API_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";

async function requestGoogleUrlDeletion(url: string, gscToken: string | null): Promise<boolean> {
  if (!gscToken) return false;

  try {
    const resp = await fetch(GSC_INDEXING_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gscToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        type: "URL_DELETED",
      }),
      signal: AbortSignal.timeout(15000),
    });

    return resp.ok;
  } catch (err: any) {
    console.error("[pSEO] Google Indexing API deletion request failed:", err.message);
    return false;
  }
}

export function registerPseoPageRoutes(app: Express): void {
  app.delete(
    "/api/pseo/pages/:pageId",
    requirePseoPermission("activation"),
    async (req, res) => {
      const pageId = req.params.pageId;
      const { userId } = extractUserRole(req);

      try {
        const [page] = await db
          .select()
          .from(pseoPages)
          .where(
            and(
              eq(pseoPages.id, pageId),
              isNull(pseoPages.deletedAt)
            )
          );

        if (!page) {
          res.status(404).json({ error: "pSEO page not found" });
          return;
        }

        if (page.pageType === "hub") {
          const [activeChild] = await db
            .select({ id: pseoPages.id })
            .from(pseoPages)
            .where(
              and(
                eq(pseoPages.campaignId, page.campaignId),
                ne(pseoPages.id, pageId),
                isNull(pseoPages.deletedAt),
                eq(pseoPages.isPublished, true)
              )
            )
            .limit(1);

          if (activeChild) {
            const errorResponse = createPseoError(
              PseoErrorType.URL_CONFLICT,
              "Cannot delete hub page with active child pages. Delete or reassign child pages first.",
              { retryable: false }
            );
            res.status(409).json(errorResponse);
            return;
          }
        }

        await softDelete(pseoPages as any, pageId);

        if (page.venueSitePageId) {
          try {
            await db
              .delete(workspaceSitePages)
              .where(eq(workspaceSitePages.id, page.venueSitePageId));
          } catch (err: any) {
            console.error("[pSEO] Failed to hard-delete venue_site_page:", err.message);
          }
        }

        const pageUrl = page.slug.startsWith("/") ? page.slug : `/${page.slug}`;
        const { seoSettings } = await import("@shared/schema");
        const [gscSettings] = await db
          .select()
          .from(seoSettings)
          .where(
            and(
              eq(seoSettings.workspaceId, page.venueId),
              eq(seoSettings.provider, "google-search-console"),
              eq(seoSettings.isConnected, true)
            )
          );

        const gscToken = gscSettings?.apiKey || null;
        const indexingResult = await requestGoogleUrlDeletion(pageUrl, gscToken);

        try {
          await db.insert(pseoAuditLog).values({
            campaignId: page.campaignId,
            venueId: page.venueId,
            pageId: page.id,
            action: "page_deleted",
            message: `pSEO page deleted: ${page.title} (${pageUrl})`,
            level: "info",
            triggeredBy: userId || null,
            meta: {
              pageId: page.id,
              url: pageUrl,
              title: page.title,
              pageType: page.pageType,
              venueSitePageId: page.venueSitePageId,
              googleIndexingNotified: indexingResult,
            },
          });
        } catch (err: any) {
          console.error("[pSEO] Failed to write deletion audit log:", err.message);
        }

        res.json({
          success: true,
          pageId: page.id,
          googleIndexingNotified: indexingResult,
        });
      } catch (err: any) {
        console.error("[pSEO] Page deletion failed:", err.message);
        res.status(500).json({ error: "Failed to delete pSEO page" });
      }
    }
  );
}
