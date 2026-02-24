import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, CheckCircle, Key, HelpCircle, X, ExternalLink, AlertTriangle, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AiProviderSetting {
  id: number;
  workspaceId: string;
  provider: string;
  apiKey: string | null;
  isEnabled: boolean | null;
}

const openaiFeatures = [
  "AI-powered chat widget responses",
  "Content generation and editing",
  "Knowledge base question answering",
  "SEO content optimization",
  "Meta title & description generation",
  "Twilio Voice (AI) 24/7 customer service assistant",
];

const setupSteps = [
  { step: "Go to platform.openai.com and sign up or log in", link: "https://platform.openai.com/signup" },
  { step: "Navigate to API Keys in your OpenAI dashboard", link: "https://platform.openai.com/api-keys" },
  { step: "Click 'Create new secret key' and copy it immediately (it won't be shown again)" },
  { step: "Paste the key in the API Key field below and click Save" },
  { step: "Add billing to your OpenAI account to ensure API calls work", link: "https://platform.openai.com/account/billing" },
];

export default function ConnectionsAi() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const { data: workspace } = useQuery<any>({
    queryKey: ["/api/workspaces", workspaceId],
  });

  const aiKeySource = workspace?.aiKeySource || "agency";

  const { data: allProviders = [] } = useQuery<AiProviderSetting[]>({
    queryKey: ["/api/workspaces", workspaceId, "ai-providers"],
  });
  const openaiSetting = allProviders.find((p) => p.provider === "openai");
  const hasKey = !!openaiSetting?.apiKey;

  useEffect(() => {
    setApiKey("");
  }, [openaiSetting]);

  const toggleKeySourceMutation = useMutation({
    mutationFn: (newSource: string) =>
      apiRequest("PATCH", `/api/workspaces/${workspaceId}`, { aiKeySource: newSource }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId] });
      toast({ title: "AI key source updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update AI key source.", variant: "destructive" });
    },
  });

  const saveKeyMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/workspaces/${workspaceId}/ai-providers`, {
        workspaceId,
        provider: "openai",
        apiKey,
        isEnabled: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "ai-providers"] });
      setApiKey("");
      toast({ title: "API key saved securely" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save API key.", variant: "destructive" });
    },
  });

  const removeKeyMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/workspaces/${workspaceId}/ai-providers`, {
        workspaceId,
        provider: "openai",
        apiKey: null,
        isEnabled: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "ai-providers"] });
      toast({ title: "API key removed" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove API key.", variant: "destructive" });
    },
  });

  const isClientMode = aiKeySource === "client";

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">AI Provider Settings</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Manage AI API keys and configure how this workspace accesses AI features</p>
        </div>

        <Card data-testid="card-ai-key-source">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">AI Key Source</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose how this workspace gets its AI API keys. This controls whether AI features run on your agency keys or on a client-provided key.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => !toggleKeySourceMutation.isPending && toggleKeySourceMutation.mutate("agency")}
                disabled={toggleKeySourceMutation.isPending}
                className={`p-4 rounded-lg border-2 text-left transition-colors disabled:opacity-60 ${
                  !isClientMode
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
                data-testid="button-key-source-agency"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium text-sm">Agency Key</span>
                  {!isClientMode && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your agency API key powers all AI features for this workspace. Bill your client as an added service.
                </p>
              </button>

              <button
                type="button"
                onClick={() => !toggleKeySourceMutation.isPending && toggleKeySourceMutation.mutate("client")}
                disabled={toggleKeySourceMutation.isPending}
                className={`p-4 rounded-lg border-2 text-left transition-colors disabled:opacity-60 ${
                  isClientMode
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
                data-testid="button-key-source-client"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">Client Key</span>
                  {isClientMode && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Client provides their own API key. No fallback — if the key is missing or expired, AI features are disabled.
                </p>
              </button>
            </div>

            {isClientMode && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>No fallback.</strong> If the client's API key is missing, invalid, or expired, AI features (chat widget, content generation, meta generation) will not work for this workspace. All other features continue normally.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-openai-credentials">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">
                  {isClientMode ? "Client's OpenAI API Key" : "OpenAI API Key"}
                </h3>
              </div>
              <Badge
                variant={hasKey ? "default" : "secondary"}
                data-testid="badge-openai-status"
              >
                {hasKey ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                ) : (
                  "Not Connected"
                )}
              </Badge>
            </div>

            {isClientMode && (
              <p className="text-xs text-muted-foreground">
                Paste the API key your client provided. They get it from their own OpenAI account.
              </p>
            )}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">
                  {hasKey ? "Replace API Key" : "API Key"}
                </Label>
                <Input
                  id="openai-api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  data-testid="input-openai-api-key"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => saveKeyMutation.mutate()}
                disabled={!apiKey.trim() || saveKeyMutation.isPending}
                data-testid="button-save-openai"
              >
                <Key className="w-4 h-4 mr-2" />
                {saveKeyMutation.isPending ? "Saving..." : hasKey ? "Update Key" : "Save Key"}
              </Button>
              {hasKey && (
                <Button
                  variant="outline"
                  onClick={() => removeKeyMutation.mutate()}
                  disabled={removeKeyMutation.isPending}
                  data-testid="button-remove-openai"
                >
                  {removeKeyMutation.isPending ? "Removing..." : "Remove"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-setup-guide">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">Setup Guide</h3>
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
            <h3 className="font-semibold text-sm">What the (AI) key powers</h3>
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
    </>
  );
}
