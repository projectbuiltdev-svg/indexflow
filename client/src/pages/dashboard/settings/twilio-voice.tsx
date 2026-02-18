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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, CheckCircle, AlertCircle, Volume2, User, Check, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

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

export default function SettingsTwilioVoice() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  
  const [twilioConnected, setTwilioConnected] = useState(false);
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [voicePersona, setVoicePersona] = useState("female");
  const [voiceGreeting, setVoiceGreeting] = useState("Thank you for calling. How may I assist you today?");
  const [enableVoicemail, setEnableVoicemail] = useState(true);
  const [maxCallDuration, setMaxCallDuration] = useState("5");

  const { data: settings } = useQuery<TwilioSettingsData>({
    queryKey: ["/api/workspaces", workspaceId, "twilio-settings"],
  });

  useEffect(() => {
    if (settings) {
      setTwilioConnected(settings.isConnected || false);
      if (settings.phoneNumber) setPhoneNumber(settings.phoneNumber);
      setVoicePersona(settings.voicePersona || "female");
      setVoiceGreeting(settings.phoneGreeting || "Thank you for calling. How may I assist you today?");
      setMaxCallDuration(String(settings.maxCallDuration || 5));
      setEnableVoicemail(settings.voicemailEnabled ?? true);
    }
  }, [settings]);

  useEffect(() => {
    document.title = "Twilio Voice Settings | indexFlow Dashboard";
  }, []);

  const connectMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
      workspaceId, accountSid, authToken, phoneNumber, isConnected: true,
      voicePersona, phoneGreeting: voiceGreeting, maxCallDuration: parseInt(maxCallDuration), voicemailEnabled: enableVoicemail,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      toast({ title: "Twilio Connected" });
    },
    onError: () => toast({ title: "Error", description: "Failed to connect.", variant: "destructive" }),
  });

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
      workspaceId, voicePersona, phoneGreeting: voiceGreeting, maxCallDuration: parseInt(maxCallDuration),
      voicemailEnabled: enableVoicemail, isConnected: twilioConnected,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      toast({ title: "Voice settings saved" });
    },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  const disconnectMutation = useMutation({
    mutationFn: () => apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
      workspaceId, isConnected: false, accountSid: null, authToken: null, phoneNumber: null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      setTwilioConnected(false);
      setAccountSid("");
      setAuthToken("");
      setPhoneNumber("");
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
            <h1 className="text-2xl font-bold">Twilio Voice Settings</h1>
            <p className="text-muted-foreground">Configure AI-powered voice calls for your workspace</p>
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
                    <CardDescription>Connect your Twilio account for voice calls</CardDescription>
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
                      Your phone number: {phoneNumber || "+1 (555) 123-4567"}
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
                <CardTitle>What Twilio Voice Powers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> AI-powered voice calls for reservations</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 24/7 automated call handling</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Custom voice persona and greeting</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Voicemail when needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice Settings
                </CardTitle>
                <CardDescription>
                  Configure how the AI sounds on phone calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Voice Persona</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={voicePersona === "female" ? "default" : "outline"}
                      onClick={() => setVoicePersona("female")}
                      className="flex-1"
                      data-testid="button-voice-female"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Female
                    </Button>
                    <Button
                      variant={voicePersona === "male" ? "default" : "outline"}
                      onClick={() => setVoicePersona("male")}
                      className="flex-1"
                      data-testid="button-voice-male"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Male
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="voice-greeting">Phone Greeting</Label>
                  <Textarea
                    id="voice-greeting"
                    value={voiceGreeting}
                    onChange={(e) => setVoiceGreeting(e.target.value)}
                    rows={3}
                    className="mt-1"
                    placeholder="Thank you for calling [Business Name]. How may I help you today?"
                    data-testid="input-voice-greeting"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-duration">Max Call Duration</Label>
                  <Select value={maxCallDuration} onValueChange={setMaxCallDuration}>
                    <SelectTrigger className="mt-1" data-testid="select-max-duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 minutes</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voicemail">Enable Voicemail</Label>
                    <p className="text-sm text-muted-foreground">Allow callers to leave messages</p>
                  </div>
                  <Switch
                    id="voicemail"
                    checked={enableVoicemail}
                    onCheckedChange={setEnableVoicemail}
                    data-testid="switch-voicemail"
                  />
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveMutation.mutate()} data-testid="button-save-voice-settings">
              <Check className="w-4 h-4 mr-2" />
              Save Voice Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
