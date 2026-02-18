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

export default function ByokCohere() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const setupSteps = [
    { step: "Go to dashboard.cohere.com and sign up", link: "https://dashboard.cohere.com" },
    { step: "Navigate to API Keys in the sidebar", link: "https://dashboard.cohere.com/api-keys" },
    { step: "Your trial key is shown by default, or click 'Create Trial Key'" },
    { step: "Copy the API key" },
    { step: "Paste it in the API Key field above and click Save" },
  ];

  useEffect(() => {
    document.title = "Cohere Integration | indexFlow Dashboard";
  }, []);

  const { data: allProviders = [] } = useQuery<AiProviderSettings[]>({
    queryKey: ["/api/workspaces", workspaceId, "ai-providers"],
  });
  const settings = allProviders.find(p => p.provider === "cohere");

  useEffect(() => {
    if (settings) {
      setApiKey(settings.apiKey || "");
      setIsConnected(settings.isConnected);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/ai-providers`, {
      workspaceId,
      provider: "cohere",
      apiKey,
      organizationId: null,
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
          <h1 className="text-2xl font-bold">Cohere Integration</h1>
          <p className="text-muted-foreground">Connect your Cohere account for AI capabilities</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <CardTitle>Cohere API Key</CardTitle>
                <CardDescription>Your Cohere API credentials</CardDescription>
              </div>
              <Badge variant="outline" className="ml-auto" data-testid="badge-cohere-status">
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
              <Input id="api-key" type="password" placeholder="Your Cohere API key" data-testid="input-cohere-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <Button className="w-full" data-testid="button-save-cohere" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Cohere Credentials"}
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
            <CardTitle>What Cohere Powers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cohere-powered assistant</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Enterprise-grade AI</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Multilingual support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
