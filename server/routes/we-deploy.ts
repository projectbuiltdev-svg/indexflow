import { Router, Request, Response } from "express";
import {
  deployToTestUrl,
  deployToStaging,
  deployToLive,
  rollbackDeployment,
  getDeploymentHistory,
} from "../services/we-deployer";
import { getDnsPollingStatus, startDnsPolling } from "../services/we-dns-poller";
import { canDeploy } from "../config/we-tier-config";

const router = Router();

router.post("/:projectId/test", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const result = await deployToTestUrl(projectId, venueId);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/staging", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const isOnTrial = !!(req as any).isOnTrial;

    if (isOnTrial) return res.status(403).json({ error: "Staging requires a paid plan" });

    const projectId = parseInt(req.params.projectId as string);
    const result = await deployToStaging(projectId, venueId);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/live", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const isOnTrial = !!(req as any).isOnTrial;
    const tier = (req as any).tier || "solo";

    if (isOnTrial) return res.status(403).json({ error: "Live deployment is not available during trial" });
    if (!canDeploy(tier, false)) return res.status(403).json({ error: "Upgrade required for live deployment" });

    const projectId = parseInt(req.params.projectId as string);
    const { domainId, stagingConfirmed } = req.body;

    if (!domainId) return res.status(400).json({ error: "domainId required" });

    const result = await deployToLive(projectId, venueId, domainId, !!stagingConfirmed);
    res.json(result);
  } catch (e: any) {
    if (e.message === "Domain not verified") return res.status(400).json({ error: e.message });
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/rollback", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const { deploymentId } = req.body;

    if (!deploymentId) return res.status(400).json({ error: "deploymentId required" });

    const result = await rollbackDeployment(deploymentId, venueId);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/history", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const result = await getDeploymentHistory(projectId, venueId);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/dns-status/:domainId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const domainId = parseInt(req.params.domainId as string);

    startDnsPolling(domainId, venueId);

    const status = getDnsPollingStatus(domainId);
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
