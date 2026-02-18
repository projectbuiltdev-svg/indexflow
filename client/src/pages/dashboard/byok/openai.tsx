import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle, AlertCircle, HelpCircle, X, ExternalLink } from "lucide-react";

interface AiProviderSettings {
  id: number;
  workspaceId: string;
  provider: string;
  apiKey: string | null;
  organizationId: string | null;
  isConnected: boolean;
}

export default function ByokOpenai() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [orgId, setOrgId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const setupSteps = [
    { step: "Go to platform.openai.com and sign in", link: "https://platform.openai.com/signup" },
    { step: "Navigate to API Keys in your dashboard", link: "https://platform.openai.com/api-keys" },
    { step: "Click 'Create new secret key' and copy it immediately" },
    { step: "Paste the key in the API Key field above and click Save" },
    { step: "(Optional) Find your Organization ID under Settings > Organization", link: "https://platform.openai.com/account/organization" },
    { step: "Add billing to your OpenAI account", link: "https://platform.openai.com/account/billing" },
  ];

  useEffect(() => {
    document.title = "OpenAI Integration | indexFlow Dashboard";
  }, []);

  const { data: allProviders = [] } = useQuery<AiProviderSettings[]>({
    queryKey: ["/api/workspaces", workspaceId, "ai-providers"],
  });
  const settings = allProviders.find(p => p.provider === "openai");

  useEffect(() => {
    if (settings) {
      setApiKey(settings.apiKey || "");
      setOrgId(settings.organizationId || "");
      setIsConnected(settings.isConnected);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/ai-providers`, {
      workspaceId,
      provider: "openai",
      apiKey,
      organizationId: orgId || null,
      isConnected: !!apiKey,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "ai-providers"] });
      toast({ title: "Credentials saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save credentials.", variant: "destructive" });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">OpenAI Integration</h1>
          <p className="text-muted-foreground">Connect your OpenAI account for AI-powered features</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <CardTitle>OpenAI API Key</CardTitle>
                <CardDescription>Your OpenAI API key for GPT models</CardDescription>
              </div>
              <Badge variant="outline" className="ml-auto" data-testid="badge-openai-status">
                {isConnected ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                ) : (
                  <><AlertCircle className="w-3 h-3 mr-1" /> Not Connected</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="sk-..." data-testid="input-openai-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-id">Organization ID (Optional)</Label>
              <Input id="org-id" placeholder="org-..." data-testid="input-openai-org" value={orgId} onChange={(e) => setOrgId(e.target.value)} />
            </div>
            <Button className="w-full" data-testid="button-save-openai" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save OpenAI Credentials"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">Setup Guide</h3>
              <Button variant="outline" size="sm" onClick={() => setShowGuide(!showGuide)} data-testid="button-toggle-guide">
                {showGuide ? <X className="h-3 w-3 mr-1" /> : <HelpCircle className="h-3 w-3 mr-1" />}
                {showGuide ? "Close" : "Show Steps"}
              </Button>
            </div>
            {showGuide && (
              <ol className="mt-3 space-y-2">
                {setupSteps.map((s: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px] font-medium">{i + 1}</span>
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

        <Card>
          <CardHeader>
            <CardTitle>What OpenAI Powers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Virtual AI assistant</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Intelligent call handling</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Natural language conversations</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Smart response generation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
