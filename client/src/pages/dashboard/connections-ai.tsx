import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, CheckCircle, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const openaiFeatures = [
  "AI-powered chat widget responses",
  "Content generation and editing",
  "Knowledge base question answering",
  "Phone call AI assistant",
  "SEO content optimization",
  "Automated email drafts",
];

export default function ConnectionsAi() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [orgId, setOrgId] = useState("");

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
