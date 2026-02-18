import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Key, Settings } from "lucide-react";

const aiProviders = [
  { id: "openai", name: "OpenAI", model: "GPT-4o", status: "connected", usage: "12,400 tokens" },
  { id: "anthropic", name: "Anthropic", model: "Claude 3.5", status: "connected", usage: "8,200 tokens" },
  { id: "google", name: "Google AI", model: "Gemini Pro", status: "disconnected", usage: "-" },
  { id: "grok", name: "Grok", model: "Grok-2", status: "disconnected", usage: "-" },
  { id: "mistral", name: "Mistral", model: "Mistral Large", status: "disconnected", usage: "-" },
  { id: "cohere", name: "Cohere", model: "Command R+", status: "disconnected", usage: "-" },
  { id: "perplexity", name: "Perplexity", model: "Sonar Pro", status: "disconnected", usage: "-" },
];

export default function ConnectionsAi() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">AI Providers</h1>
          <p className="text-muted-foreground">Connect and manage your AI provider API keys</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-providers">7</p>
                  <p className="text-xs text-muted-foreground">Available Providers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-connected-providers">2</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-active-model">GPT-4o</p>
                  <p className="text-xs text-muted-foreground">Primary Model</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Provider Connections</CardTitle>
            <CardDescription>Bring your own API keys for AI-powered features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiProviders.map((provider) => (
                <Card key={provider.id} data-testid={`card-provider-${provider.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">{provider.name}</h3>
                      </div>
                      <Badge variant={provider.status === "connected" ? "default" : "secondary"} className="text-xs">
                        {provider.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      <p>Model: {provider.model}</p>
                      <p>Usage: {provider.usage}</p>
                    </div>
                    <Button
                      variant={provider.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      data-testid={`button-provider-${provider.id}`}
                    >
                      {provider.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
