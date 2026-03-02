import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { pseoPages } from "@shared/schema";
import { eq, and, isNull } from "drizzle-orm";
import { createPseoError, PseoErrorType } from "../pseo/error-handler";

export async function protectPseoManagedPages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.method !== "DELETE") {
    next();
    return;
  }

  const pageId = Number(req.params.id);
  if (!pageId || isNaN(pageId)) {
    next();
    return;
  }

  try {
    const [linked] = await db
      .select({ id: pseoPages.id })
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.venueSitePageId, pageId),
          isNull(pseoPages.deletedAt)
        )
      )
      .limit(1);

    if (linked) {
      const errorResponse = createPseoError(
        PseoErrorType.PERMISSION_DENIED,
        "This page is managed by a pSEO campaign and cannot be deleted from the pages UI",
        { retryable: false }
      );
      res.status(403).json(errorResponse);
      return;
    }

    next();
  } catch (err: any) {
    console.error("[pSEO] Page deletion protection check failed:", err.message);
    next();
  }
}
