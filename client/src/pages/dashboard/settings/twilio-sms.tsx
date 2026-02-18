import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Phone, CheckCircle, AlertCircle, Send, MessageSquare, Check, ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TwilioSettingsData {
  id: number;
  workspaceId: string;
  accountSid: string | null;
  authToken: string | null;
  phoneNumber: string | null;
  voicePersona: string;
  phoneGreeting: string | null;
  maxCallDuration: number;
  voicemailEnabled: boolean;
  smsEnabled: boolean;
  smsTemplate: string | null;
  isConnected: boolean;
}

export default function SettingsTwilioSms() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  
  const [twilioConnected, setTwilioConnected] = useState(false);
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsTemplate, setSmsTemplate] = useState(
    "Hi {client_name}! Your appointment with {workspace_name} is confirmed for {date} at {time}. Reply HELP for assistance or CANCEL to cancel."
  );
  const [testPhoneNumber, setTestPhoneNumber] = useState("");

  const { data: settings } = useQuery<TwilioSettingsData>({
    queryKey: ["/api/workspaces", workspaceId, "twilio-settings"],
  });

  useEffect(() => {
    if (settings) {
      setTwilioConnected(settings.isConnected || false);
      if (settings.phoneNumber) setPhoneNumber(settings.phoneNumber);
      setSmsEnabled(settings.smsEnabled ?? true);
      if (settings.smsTemplate) setSmsTemplate(settings.smsTemplate);
    }
  }, [settings]);

  useEffect(() => {
    document.title = "Twilio SMS Settings | indexFlow Dashboard";
  }, []);

  const connectMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
      workspaceId, accountSid, authToken, phoneNumber, isConnected: true, smsEnabled, smsTemplate,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      toast({ title: "Twilio Connected" });
    },
    onError: () => toast({ title: "Error", description: "Failed to connect.", variant: "destructive" }),
  });

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
      workspaceId, smsEnabled, smsTemplate, isConnected: twilioConnected,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      toast({ title: "SMS settings saved" });
    },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  const disconnectMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
      workspaceId, isConnected: false, accountSid: null, authToken: null, phoneNumber: null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      setTwilioConnected(false); setAccountSid(""); setAuthToken(""); setPhoneNumber("");
      toast({ title: "Twilio disconnected" });
    },
  });

  const handleConnect = () => {
    if (accountSid && authToken && phoneNumber) {
      connectMutation.mutate();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/${workspaceId}/settings/train-widget`}>
            <Button variant="ghost" size="icon" data-testid="button-back-training">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Twilio SMS Settings</h1>
            <p className="text-muted-foreground">Configure automated SMS confirmations for appointments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <CardTitle>Twilio Connection</CardTitle>
                    <CardDescription>Connect your Twilio account for SMS</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {twilioConnected ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not Connected
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {twilioConnected ? (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Twilio Connected
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      SMS will be sent from: {phoneNumber || "+1 (555) 123-4567"}
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => disconnectMutation.mutate()} data-testid="button-disconnect-twilio">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="account-sid">Account SID</Label>
                      <Input 
                        id="account-sid" 
                        value={accountSid}
                        onChange={(e) => setAccountSid(e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                        data-testid="input-twilio-sid" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auth-token">Auth Token</Label>
                      <Input 
                        id="auth-token" 
                        type="password" 
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                        placeholder="Your Twilio Auth Token" 
                        data-testid="input-twilio-token" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input 
                        id="phone-number" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890" 
                        data-testid="input-twilio-phone" 
                      />
                    </div>
                    <Button className="w-full" onClick={handleConnect} data-testid="button-connect-twilio">
                      Connect Twilio Account
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  SMS Confirmation Settings
                </CardTitle>
                <CardDescription>
                  Auto-send confirmation texts when clients complete appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-enabled">Enable SMS Confirmations</Label>
                    <p className="text-sm text-muted-foreground">Automatically text clients after scheduling</p>
                  </div>
                  <Switch
                    id="sms-enabled"
                    checked={smsEnabled}
                    onCheckedChange={setSmsEnabled}
                    data-testid="switch-sms-enabled"
                  />
                </div>

                <div className="pt-2">
                  <Label htmlFor="sms-template">Message Template</Label>
                  <Textarea
                    id="sms-template"
                    value={smsTemplate}
                    onChange={(e) => setSmsTemplate(e.target.value)}
                    rows={4}
                    className="mt-1 font-mono text-sm"
                    placeholder="Hi {client_name}! Your appointment is confirmed..."
                    data-testid="input-sms-template"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Available placeholders: {"{client_name}"}, {"{workspace_name}"}, {"{date}"}, {"{time}"}, {"{confirmation_code}"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What Twilio SMS Powers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Instant appointment confirmations</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Pre-paid service receipts</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Reminder notifications</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Two-way text messaging</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message Preview
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center cursor-help" data-testid="button-sms-info">
                        <span className="text-xs text-muted-foreground">?</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-sm">When your client completes a confirmed appointment, indexFlow automatically sends the confirmation SMS so you don't have to.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Preview how your confirmation SMS will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4" data-testid="sms-preview-container">
                  <div className="bg-card rounded-lg p-3 shadow-sm max-w-[280px]">
                    <p className="text-sm" data-testid="text-sms-preview">
                      {smsTemplate
                        .replace("{client_name}", "John")
                        .replace("{workspace_name}", "Your Business")
                        .replace("{date}", "Friday, Jan 15")
                        .replace("{time}", "7:30 PM")
                        .replace("{confirmation_code}", "APT-7X3K9")}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Sample preview with placeholder data
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Test SMS
                </CardTitle>
                <CardDescription>
                  Send a test message to verify your setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-phone">Phone Number</Label>
                  <Input
                    id="test-phone"
                    type="tel"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1"
                    data-testid="input-test-phone"
                  />
                </div>
                <Button 
                  className="w-full" 
                  disabled={!twilioConnected}
                  data-testid="button-send-test-sms"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Test SMS
                </Button>
                {!twilioConnected && (
                  <p className="text-xs text-muted-foreground text-center">
                    Connect Twilio to send test messages
                  </p>
                )}
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveMutation.mutate()} data-testid="button-save-sms-settings">
              <Check className="w-4 h-4 mr-2" />
              Save SMS Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
