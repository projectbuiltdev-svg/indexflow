import type { Request, Response, NextFunction } from "express";
import { createPseoError, PseoErrorType } from "../pseo/error-handler";

export function enforceUrlLock(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== "PUT" && req.method !== "PATCH") {
    next();
    return;
  }

  const body = req.body;
  if (body && (body.urlStructure !== undefined || body.url_structure !== undefined)) {
    const errorResponse = createPseoError(
      PseoErrorType.URL_CONFLICT,
      "URL structure cannot be changed after activation",
      { retryable: false }
    );
    res.status(403).json(errorResponse);
    return;
  }

  next();
}
