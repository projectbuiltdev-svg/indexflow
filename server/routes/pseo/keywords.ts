import { Router, Request, Response } from "express";
import { resolveAiKey } from "../../ai-chat";

const router = Router();

router.post("/suggest", async (req: Request, res: Response) => {
  try {
    const { services, locations, businessCategory, workspaceId } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Provide at least one service" });
    }

    const resolved = await resolveAiKey(workspaceId || "", "openai");

    if (!resolved.apiKey) {
      return res.status(400).json({
        error: "No AI API key configured. Add an OpenAI key in Connections → AI Providers to use keyword suggestions.",
      });
    }

    const locationContext = Array.isArray(locations) && locations.length > 0
      ? `Target locations include: ${locations.slice(0, 5).join(", ")}.`
      : "";

    const prompt = `You are an SEO keyword research assistant. Generate keyword suggestions for a pSEO campaign.

Business category: ${businessCategory || "general"}
Services: ${services.join(", ")}
${locationContext}

For each service, suggest:
- 1 primary keyword (highest search volume, most relevant)
- 2 secondary keywords (related terms, variations)
- 1 longtail keyword (specific, lower competition phrase)

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    { "text": "keyword phrase", "type": "primary", "serviceName": "Service Name" },
    { "text": "keyword phrase", "type": "secondary", "serviceName": "Service Name" },
    { "text": "keyword phrase", "type": "longtail", "serviceName": "Service Name" }
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resolved.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `AI provider error: ${response.status}` });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (!parsed?.suggestions || !Array.isArray(parsed.suggestions)) {
      return res.status(502).json({ error: "AI returned invalid keyword format. Try again." });
    }

    const suggestions = parsed.suggestions.map((s: any, i: number) => ({
      id: `sug-${Date.now()}-${i}`,
      text: String(s.text || ""),
      type: ["primary", "secondary", "longtail"].includes(s.type) ? s.type : "secondary",
      serviceName: String(s.serviceName || ""),
      accepted: null,
    }));

    return res.json({ suggestions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Keyword suggestion failed" });
  }
});

export default router;
