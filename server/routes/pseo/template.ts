import { Router, Request, Response } from "express";
import { parseTemplateFromSource, parseTemplateWithBranding } from "../../pseo/template-parser";

const router = Router();

router.post("/parse", async (req: Request, res: Response) => {
  try {
    const { html, url } = req.body;

    if (!html && !url) {
      return res.status(400).json({ error: "Provide either html or url" });
    }

    const source = url || html;
    const isUrl = !!url;

    let result;
    if (isUrl) {
      result = await parseTemplateFromSource(source);
    } else {
      result = parseTemplateWithBranding(source);
    }

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Template parse failed" });
  }
});

export default router;
