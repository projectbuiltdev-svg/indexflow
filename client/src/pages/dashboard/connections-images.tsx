import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, HelpCircle, X, ExternalLink, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProviderSetting {
  id: number;
  workspaceId: string;
  provider: string;
  apiKey: string | null;
  isEnabled: boolean | null;
}

const providers = [
  {
    id: "unsplash",
    name: "Unsplash",
    steps: [
      { step: "Go to unsplash.com/developers and create an account", link: "https://unsplash.com/developers" },
      { step: "Click 'Your apps' and then 'New Application'" },
      { step: "Accept the guidelines and name your app" },
      { step: "Copy the Access Key (not the Secret Key)" },
      { step: "Paste it in the API Key field above and click Save" },
    ],
  },
  {
    id: "pexels",
    name: "Pexels",
    steps: [
      { step: "Go to pexels.com/api and sign up for a free account", link: "https://www.pexels.com/api/" },
      { step: "Click 'Your API Key' in the navigation" },
      { step: "Describe your use case and submit" },
      { step: "Copy the API key from your dashboard" },
      { step: "Paste it in the API Key field above and click Save" },
    ],
  },
  {
    id: "pixabay",
    name: "Pixabay",
    steps: [
      { step: "Go to pixabay.com/api/docs and create an account", link: "https://pixabay.com/api/docs/" },
      { step: "Log in and your API key will be shown on the documentation page" },
      { step: "Copy the API key" },
      { step: "Paste it in the API Key field above and click Save" },
    ],
  },
];

export default function ConnectionsImages() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const wsId = selectedWorkspace?.id || "";
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: allProviders = [], isLoading } = useQuery<ProviderSetting[]>({
    queryKey: ["/api/workspaces", wsId, "ai-providers"],
    enabled: !!wsId,
  });

  const getProviderSetting = (providerId: string) =>
    allProviders.find((p) => p.provider === providerId);

  const saveMutation = useMutation({
    mutationFn: async ({ provider, apiKey }: { provider: string; apiKey: string }) =>
      apiRequest("PUT", `/api/workspaces/${wsId}/ai-providers`, {
        workspaceId: wsId,
        provider,
        apiKey,
        isEnabled: true,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", wsId, "ai-providers"] });
      const ref = inputRefs.current[variables.provider];
      if (ref) ref.value = "";
      toast({ title: "Settings Saved", description: `${variables.provider} API key has been saved.` });
    },
    onError: (_err, variables) => {
      toast({ title: "Error", description: `Failed to save ${variables.provider} API key.`, variant: "destructive" });
    },
  });

  const testMutation = useMutation({
    mutationFn: async ({ provider }: { provider: string }) => {
      const res = await fetch(`/api/workspaces/${wsId}/images/search?q=test&source=${provider}&page=1`);
      if (!res.ok) throw new Error("Test failed");
      const data = await res.json();
      return data;
    },
    onSuccess: (_data, variables) => {
      toast({ title: "Connection Successful", description: `${variables.provider} API connection is working.` });
    },
    onError: (_err, variables) => {
      toast({ title: "Connection Failed", description: `Could not connect to ${variables.provider}. Check your API key.`, variant: "destructive" });
    },
  });

  const handleSave = (providerId: string) => {
    const ref = inputRefs.current[providerId];
    const apiKey = ref?.value?.trim() || "";
    if (!apiKey) {
      toast({ title: "Missing API Key", description: "Please enter an API key.", variant: "destructive" });
      return;
    }
    saveMutation.mutate({ provider: providerId, apiKey });
  };

  const handleTest = (providerId: string) => {
    testMutation.mutate({ provider: providerId });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Image Banks</h1>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground" data-testid="text-note">Leave blank to use platform defaults. Click "Setup Guide" on any provider for step-by-step instructions.</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {providers.map((p) => {
          const setting = getProviderSetting(p.id);
          const isConnected = !!setting?.apiKey;

          return (
            <Card key={p.id} data-testid={`card-image-provider-${p.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge variant={isConnected ? "default" : "secondary"} data-testid={`badge-image-status-${p.id}`}>
                  {isConnected ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                  ) : (
                    "Not Connected"
                  )}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{isConnected ? "Replace API Key" : "API Key"}</Label>
                  <Input
                    type="password"
                    placeholder={`Enter ${p.name} API key`}
                    ref={(el) => { inputRefs.current[p.id] = el; }}
                    data-testid={`input-api-key-${p.id}`}
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    data-testid={`button-save-${p.id}`}
                    onClick={() => handleSave(p.id)}
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-test-${p.id}`}
                    onClick={() => handleTest(p.id)}
                    disabled={testMutation.isPending}
                  >
                    {testMutation.isPending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedGuide(expandedGuide === p.id ? null : p.id)}
                    data-testid={`button-guide-${p.id}`}
                  >
                    {expandedGuide === p.id ? <X className="h-3 w-3 mr-1" /> : <HelpCircle className="h-3 w-3 mr-1" />}
                    {expandedGuide === p.id ? "Close" : "Setup Guide"}
                  </Button>
                </div>

                {expandedGuide === p.id && (
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium mb-2">How to get your {p.name} API key:</p>
                    <ol className="space-y-2">
                      {p.steps.map((s, i) => (
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
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
