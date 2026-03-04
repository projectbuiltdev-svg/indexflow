import { Router, Request, Response } from "express";
import { db } from "../db";
import { weProjectAssets } from "../../db/schema/we-project-assets";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and } from "drizzle-orm";
import path from "path";
import fs from "fs";

const router = Router();

const ALLOWED_TYPES = new Set(["jpg", "jpeg", "png", "webp", "svg", "gif"]);
const MAX_SIZE = 10 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "we-assets");

function sanitizeFilename(name: string): string {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_.]/g, "")
    .toLowerCase();
}

router.post("/:projectId/upload", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      const chunks: Buffer[] = [];
      let totalSize = 0;

      await new Promise<void>((resolve, reject) => {
        req.on("data", (chunk: Buffer) => {
          totalSize += chunk.length;
          if (totalSize > MAX_SIZE) {
            reject(new Error("File exceeds 10MB limit"));
            return;
          }
          chunks.push(chunk);
        });
        req.on("end", resolve);
        req.on("error", reject);
      });

      const rawFilename = (req.headers["x-filename"] as string) || `upload-${Date.now()}`;
      const ext = rawFilename.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_TYPES.has(ext)) {
        return res.status(400).json({ error: `File type .${ext} not allowed. Use: jpg, png, webp, svg, gif` });
      }

      const filename = sanitizeFilename(rawFilename);
      const dir = path.join(UPLOAD_DIR, venueId, projectId.toString());
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, filename);
      fs.writeFileSync(filePath, Buffer.concat(chunks));

      const [asset] = await db
        .insert(weProjectAssets)
        .values({
          projectId,
          venueId,
          filename,
          filePath: `/uploads/we-assets/${venueId}/${projectId}/${filename}`,
          fileType: ext,
          fileSize: totalSize,
          altText: req.headers["x-alt-text"] as string || null,
        })
        .returning();

      return res.status(201).json(asset);
    }

    const { filename: rawFilename, base64, altText } = req.body;
    if (!rawFilename || !base64) return res.status(400).json({ error: "filename and base64 required" });

    const ext = rawFilename.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_TYPES.has(ext)) {
      return res.status(400).json({ error: `File type .${ext} not allowed. Use: jpg, png, webp, svg, gif` });
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.length > MAX_SIZE) return res.status(400).json({ error: "File exceeds 10MB limit" });

    const filename = sanitizeFilename(rawFilename);
    const dir = path.join(UPLOAD_DIR, venueId, projectId.toString());
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buffer);

    const [asset] = await db
      .insert(weProjectAssets)
      .values({
        projectId,
        venueId,
        filename,
        filePath: `/uploads/we-assets/${venueId}/${projectId}/${filename}`,
        fileType: ext,
        fileSize: buffer.length,
        altText: altText || null,
      })
      .returning();

    res.status(201).json(asset);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const assets = await db
      .select()
      .from(weProjectAssets)
      .where(and(eq(weProjectAssets.projectId, projectId), eq(weProjectAssets.venueId, venueId)));

    res.json({ assets, total: assets.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:projectId/:assetId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const assetId = parseInt(req.params.assetId as string);

    const [asset] = await db
      .select()
      .from(weProjectAssets)
      .where(
        and(
          eq(weProjectAssets.id, assetId),
          eq(weProjectAssets.projectId, projectId),
          eq(weProjectAssets.venueId, venueId)
        )
      );

    if (!asset) return res.status(404).json({ error: "Asset not found" });

    await db.delete(weProjectAssets).where(eq(weProjectAssets.id, assetId));

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "asset_deleted",
      metadata: { assetId, filename: asset.filename, retainedFor: "30 days" },
      severity: "info",
    });

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
