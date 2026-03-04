import type { Request, Response, NextFunction } from "express";

export function weAuth(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
