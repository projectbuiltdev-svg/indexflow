import type { Request, Response, NextFunction } from "express";
import { resolveAiKey } from "../ai-chat";

const cache = new Map<string, { key: string | null; ts: number }>();
const CACHE_TTL = 3600000;

export async function weByok(req: Request, res: Response, next: NextFunction): Promise<void> {
  const venueId = (req as any).venueId as string;
  if (!venueId) {
    res.status(402).json({ error: "Connect your AI key to use this feature" });
    return;
  }

  const cached = cache.get(venueId);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    if (!cached.key) {
      res.status(402).json({ error: "Connect your AI key to use this feature" });
      return;
    }
    (req as any).resolvedByokKey = cached.key;
    next();
    return;
  }

  try {
    const resolved = await resolveAiKey(venueId, "openai");
    cache.set(venueId, { key: resolved.apiKey, ts: Date.now() });

    if (!resolved.apiKey) {
      res.status(402).json({ error: "Connect your AI key to use this feature" });
      return;
    }

    (req as any).resolvedByokKey = resolved.apiKey;
    next();
  } catch {
    res.status(402).json({ error: "Connect your AI key to use this feature" });
  }
}
