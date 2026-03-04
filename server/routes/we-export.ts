import { Router, Request, Response } from "express";
import { generateExport, getExportStatus } from "../services/we-exporter";

const router = Router();

router.post("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const job = await generateExport(projectId, venueId);
    res.status(202).json({ jobId: job.jobId });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/status/:jobId", async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    const job = getExportStatus(jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
