import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WidgetSettings, TwilioSettings } from "@shared/schema";

export default function AiTrainingChannels() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id || "";

  const [widgetActive, setWidgetActive] = useState(true);
  const [widgetPersonality, setWidgetPersonality] = useState("professional");
  const [widgetResponseLength, setWidgetResponseLength] = useState("balanced");

  const [twilioActive, setTwilioActive] = useState(true);
  const [twilioPersonality, setTwilioPersonality] = useState("professional");
  const [twilioSmsStyle, setTwilioSmsStyle] = useState("concise");

  const { data: widgetSettings, isLoading: widgetLoading } = useQuery<WidgetSettings>({
    queryKey: ["/api/workspaces", workspaceId, "widget-settings"],
    enabled: !!workspaceId,
  });

  const { data: twilioSettings, isLoading: twilioLoading } = useQuery<TwilioSettings>({
    queryKey: ["/api/workspaces", workspaceId, "twilio-settings"],
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (widgetSettings) {
      setWidgetActive(widgetSettings.isEnabled ?? true);
    }
  }, [widgetSettings]);

  useEffect(() => {
    if (twilioSettings) {
      setTwilioActive(twilioSettings.smsEnabled ?? true);
      if (twilioSettings.voicePersona) {
        const persona = twilioSettings.voicePersona.toLowerCase();
        if (["professional", "friendly", "casual"].includes(persona)) {
          setTwilioPersonality(persona);
        }
      }
    }
  }, [twilioSettings]);

  const widgetMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PUT", `/api/workspaces/${workspaceId}/widget-settings`, {
        workspaceId,
        isEnabled: widgetActive,
        primaryColor: widgetSettings?.primaryColor || "#000000",
        position: widgetSettings?.position || "bottom-right",
        welcomeMessage: widgetSettings?.welcomeMessage || null,
        voiceEnabled: widgetSettings?.voiceEnabled ?? false,
        autoGreet: widgetSettings?.autoGreet ?? true,
        logoUrl: widgetSettings?.logoUrl || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "widget-settings"] });
      toast({ title: "Widget channel saved", description: `Active: ${widgetActive ? "Yes" : "No"}, Personality: ${widgetPersonality}, Length: ${widgetResponseLength}` });
    },
    onError: () => {
      toast({ title: "Save failed", description: "Could not save widget channel settings.", variant: "destructive" });
    },
  });

  const twilioMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
        workspaceId,
        smsEnabled: twilioActive,
        voicePersona: twilioPersonality,
        accountSid: twilioSettings?.accountSid || null,
        authToken: twilioSettings?.authToken || null,
        phoneNumber: twilioSettings?.phoneNumber || null,
        phoneGreeting: twilioSettings?.phoneGreeting || null,
        maxCallDuration: twilioSettings?.maxCallDuration ?? 5,
        voicemailEnabled: twilioSettings?.voicemailEnabled ?? true,
        smsTemplate: twilioSettings?.smsTemplate || null,
        isConnected: twilioSettings?.isConnected ?? false,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      toast({ title: "Twilio channel saved", description: `Active: ${twilioActive ? "Yes" : "No"}, Personality: ${twilioPersonality}, SMS Style: ${twilioSmsStyle}` });
    },
    onError: () => {
      toast({ title: "Save failed", description: "Could not save Twilio channel settings.", variant: "destructive" });
    },
  });

  if (!workspaceId) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">AI Channels</h1>
        <p className="text-sm text-muted-foreground">Select a workspace to manage AI channels</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">AI Channels</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card data-testid="card-channel-widget">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              Widget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {widgetLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Label htmlFor="widget-active">Active</Label>
                  <Switch
                    id="widget-active"
                    checked={widgetActive}
                    onCheckedChange={setWidgetActive}
                    data-testid="switch-widget-active"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Personality</Label>
                  <Select value={widgetPersonality} onValueChange={setWidgetPersonality}>
                    <SelectTrigger data-testid="select-widget-personality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Response Length</Label>
                  <Select value={widgetResponseLength} onValueChange={setWidgetResponseLength}>
                    <SelectTrigger data-testid="select-widget-response-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  data-testid="button-save-widget-channel"
                  onClick={() => widgetMutation.mutate()}
                  disabled={widgetMutation.isPending}
                >
                  {widgetMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-channel-twilio">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              Twilio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {twilioLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Label htmlFor="twilio-active">Active</Label>
                  <Switch
                    id="twilio-active"
                    checked={twilioActive}
                    onCheckedChange={setTwilioActive}
                    data-testid="switch-twilio-active"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voice Personality</Label>
                  <Select value={twilioPersonality} onValueChange={setTwilioPersonality}>
                    <SelectTrigger data-testid="select-twilio-personality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>SMS Response Style</Label>
                  <Select value={twilioSmsStyle} onValueChange={setTwilioSmsStyle}>
                    <SelectTrigger data-testid="select-twilio-sms-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  data-testid="button-save-twilio-channel"
                  onClick={() => twilioMutation.mutate()}
                  disabled={twilioMutation.isPending}
                >
                  {twilioMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
