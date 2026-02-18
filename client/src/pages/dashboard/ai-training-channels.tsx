import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Settings, Zap } from "lucide-react";

const channels = [
  {
    id: "widget",
    name: "Chat Widget",
    icon: MessageSquare,
    status: "active",
    model: "GPT-4o",
    conversations: 142,
    description: "AI-powered chat widget embedded on your website",
  },
  {
    id: "twilio",
    name: "Twilio Voice",
    icon: Phone,
    status: "active",
    model: "GPT-4o",
    conversations: 67,
    description: "AI voice assistant for phone calls via Twilio",
  },
];

export default function AiTrainingChannels() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Channels</h1>
          <p className="text-muted-foreground">Configure AI channels for Widget and Twilio</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-active-channels">2</p>
                  <p className="text-xs text-muted-foreground">Active Channels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-conversations">209</p>
                  <p className="text-xs text-muted-foreground">Total Conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-default-model">GPT-4o</p>
                  <p className="text-xs text-muted-foreground">Default Model</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Channel Configuration</CardTitle>
            <CardDescription>Manage AI behavior for each communication channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {channels.map((channel) => (
                <Card key={channel.id} data-testid={`card-channel-${channel.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <channel.icon className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold">{channel.name}</h3>
                      </div>
                      <Badge variant={channel.status === "active" ? "default" : "secondary"} className="text-xs">
                        {channel.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">{channel.model}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-muted-foreground">Conversations</span>
                        <span className="font-medium">{channel.conversations}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-configure-${channel.id}`}>
                      Configure
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
