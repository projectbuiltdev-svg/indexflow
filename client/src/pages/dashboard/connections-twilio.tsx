import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle, Loader2, Unlink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const twilioFeatures = [
  "AI-powered inbound call handling",
  "Outbound call automation",
  "SMS notifications and confirmations",
  "Call recording and transcription",
  "Voicemail with AI summary",
  "Multi-language voice support",
];

export default function ConnectionsTwilio() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const wsId = selectedWorkspace?.id || "";

  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { data: settings, isLoading } = useQuery<any>({
    queryKey: ["/api/workspaces", wsId, "twilio-settings"],
    enabled: !!wsId,
  });

  const isConnected = !!settings?.isConnected;

  useEffect(() => {
    if (settings && !isConnected) {
      setAccountSid(settings.accountSid || "");
      setPhoneNumber(settings.phoneNumber || "");
    }
  }, [settings, isConnected]);

  const connectMutation = useMutation({
    mutationFn: async (payload: any) =>
      apiRequest("PUT", `/api/workspaces/${wsId}/twilio-settings`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", wsId, "twilio-settings"] });
    },
  });

  const handleConnect = async () => {
    if (!accountSid.trim() || !authToken.trim() || !phoneNumber.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all Twilio credentials.", variant: "destructive" });
      return;
    }
    try {
      await connectMutation.mutateAsync({
        workspaceId: wsId,
        accountSid: accountSid.trim(),
        authToken: authToken.trim(),
        phoneNumber: phoneNumber.trim(),
        isConnected: true,
      });
      toast({ title: "Twilio Connected", description: "Your Twilio account has been connected successfully." });
      setAccountSid("");
      setAuthToken("");
      setPhoneNumber("");
    } catch {
      toast({ title: "Connection failed", description: "Failed to save Twilio settings.", variant: "destructive" });
    }
  };

  const handleDisconnect = async () => {
    try {
      await connectMutation.mutateAsync({
        workspaceId: wsId,
        accountSid: null,
        authToken: null,
        phoneNumber: null,
        isConnected: false,
      });
      toast({ title: "Twilio Disconnected", description: "Your Twilio account has been disconnected." });
    } catch {
      toast({ title: "Disconnect failed", description: "Failed to disconnect Twilio.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Twilio Setup</h1>
        <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Connect your Twilio account</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card data-testid="card-twilio-credentials">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Twilio Account Credentials</h3>
              </div>
              <Badge variant={isConnected ? "default" : "secondary"} data-testid="badge-twilio-status">
                {isConnected ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                ) : (
                  "Not Connected"
                )}
              </Badge>
            </div>

            {isConnected ? (
              <div className="space-y-3">
                <div className="rounded-md bg-muted/50 p-3 space-y-1">
                  <p className="text-sm"><span className="text-muted-foreground">Account SID:</span> {settings?.accountSid ? `${settings.accountSid.substring(0, 8)}...` : "Set"}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Auth Token:</span> ***</p>
                  <p className="text-sm"><span className="text-muted-foreground">Phone Number:</span> {settings?.phoneNumber || "Set"}</p>
                </div>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={handleDisconnect}
                  disabled={connectMutation.isPending}
                  data-testid="button-disconnect-twilio"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect Twilio
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-sid">Account SID</Label>
                    <Input
                      id="twilio-sid"
                      placeholder="AC..."
                      value={accountSid}
                      onChange={(e) => setAccountSid(e.target.value)}
                      data-testid="input-account-sid"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-token">Auth Token</Label>
                    <Input
                      id="twilio-token"
                      type="password"
                      placeholder="Enter auth token"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      data-testid="input-auth-token"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-phone">Phone Number</Label>
                    <Input
                      id="twilio-phone"
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      data-testid="input-phone-number"
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleConnect}
                  disabled={connectMutation.isPending}
                  data-testid="button-connect-twilio"
                >
                  {connectMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Connect Twilio Account
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-twilio-features">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold">Feature Capabilities</h3>
          <div className="space-y-2">
            {twilioFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2" data-testid={`feature-twilio-${idx}`}>
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
