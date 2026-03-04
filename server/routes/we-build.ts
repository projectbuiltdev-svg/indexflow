import { Router, Request, Response } from "express";
import { startBuild, resumeBuild, getBuildStatus } from "../services/we-build";

const router = Router();

router.post("/:projectId/start", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    await startBuild(projectId, venueId);
    res.status(202).json({ message: "Build started" });
  } catch (e: any) {
    if (e.message === "Already building") {
      return res.status(409).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/resume", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    await resumeBuild(projectId, venueId);
    res.status(202).json({ message: "Build resumed" });
  } catch (e: any) {
    if (e.message === "No failed step to resume from") {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/status", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const status = await getBuildStatus(projectId, venueId);
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
