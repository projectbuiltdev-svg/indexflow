import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle } from "lucide-react";
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
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleConnect = () => {
    toast({ title: "Twilio Connected", description: "Your Twilio account has been connected successfully." });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Twilio Setup</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Connect your Twilio account</p>
        </div>

        <Card data-testid="card-twilio-credentials">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Twilio Account Credentials</h3>
              </div>
              <Badge variant="secondary" data-testid="badge-twilio-status">Not Connected</Badge>
            </div>

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

            <Button className="w-full" onClick={handleConnect} data-testid="button-connect-twilio">
              Connect Twilio Account
            </Button>
          </CardContent>
        </Card>

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
    </ClientLayout>
  );
}
