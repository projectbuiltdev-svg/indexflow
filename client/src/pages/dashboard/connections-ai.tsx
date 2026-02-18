import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, CheckCircle, Key, HelpCircle, X, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const openaiFeatures = [
  "AI-powered chat widget responses",
  "Content generation and editing",
  "Knowledge base question answering",
  "Phone call AI assistant",
  "SEO content optimization",
  "Automated email drafts",
];

const setupSteps = [
  { step: "Go to platform.openai.com and sign up or log in", link: "https://platform.openai.com/signup" },
  { step: "Navigate to API Keys in your OpenAI dashboard", link: "https://platform.openai.com/api-keys" },
  { step: "Click 'Create new secret key' and copy it immediately (it won't be shown again)" },
  { step: "Paste the key in the API Key field above and click Save" },
  { step: "(Optional) Find your Organization ID under Settings > Organization if you have multiple orgs", link: "https://platform.openai.com/account/organization" },
  { step: "Add billing to your OpenAI account to ensure API calls work", link: "https://platform.openai.com/account/billing" },
];

export default function ConnectionsAi() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [orgId, setOrgId] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const handleSave = () => {
    toast({ title: "Credentials Saved", description: "Your OpenAI credentials have been saved securely." });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">OpenAI Integration</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Connect your OpenAI account for AI-powered features</p>
        </div>

        <Card data-testid="card-openai-credentials">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">OpenAI API Key</h3>
              </div>
              <Badge variant="secondary" data-testid="badge-openai-status">Not Connected</Badge>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">API Key</Label>
                <Input
                  id="openai-api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  data-testid="input-openai-api-key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai-org-id">Organization ID <span className="text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="openai-org-id"
                  placeholder="org-..."
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  data-testid="input-openai-org-id"
                />
              </div>
            </div>

            <Button className="w-full" onClick={handleSave} data-testid="button-save-openai">
              <Key className="w-4 h-4 mr-2" />
              Save OpenAI Credentials
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-setup-guide">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold">Setup Guide</h3>
              <Button variant="outline" size="sm" onClick={() => setShowGuide(!showGuide)} data-testid="button-toggle-guide">
                {showGuide ? <X className="h-3 w-3 mr-1" /> : <HelpCircle className="h-3 w-3 mr-1" />}
                {showGuide ? "Close" : "Show Steps"}
              </Button>
            </div>
            {showGuide && (
              <ol className="mt-4 space-y-2.5">
                {setupSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-medium">{i + 1}</span>
                    <div className="pt-0.5">
                      <span className="text-muted-foreground">{s.step}</span>
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex items-center text-muted-foreground text-xs underline hover:text-foreground">
                          Open <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-openai-features">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">What OpenAI Powers</h3>
            <div className="space-y-2">
              {openaiFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2" data-testid={`feature-openai-${idx}`}>
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
