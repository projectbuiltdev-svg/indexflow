import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

export default function TwilioVoice() {
  const { toast } = useToast();

  const [greeting, setGreeting] = useState("Hello, thank you for calling! I'm your AI assistant. How can I help you today?");
  const [voice, setVoice] = useState("alloy");
  const [language, setLanguage] = useState("en");
  const [forwardingNumber, setForwardingNumber] = useState("+1 (555) 111-2222");
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true);

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Voice settings have been saved successfully." });
  };

  const handleTestCall = () => {
    toast({ title: "Test call initiated", description: "A test call is being placed to your forwarding number." });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Voice Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Voice Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-greeting"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice Selection</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger data-testid="select-voice">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy</SelectItem>
                <SelectItem value="echo">Echo</SelectItem>
                <SelectItem value="fable">Fable</SelectItem>
                <SelectItem value="onyx">Onyx</SelectItem>
                <SelectItem value="nova">Nova</SelectItem>
                <SelectItem value="shimmer">Shimmer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger data-testid="select-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forwarding">Call Forwarding Number</Label>
            <Input
              id="forwarding"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={forwardingNumber}
              onChange={(e) => setForwardingNumber(e.target.value)}
              data-testid="input-forwarding-number"
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <Label htmlFor="business-hours">Business Hours Only</Label>
              <p className="text-xs text-muted-foreground">Only accept calls during configured business hours</p>
            </div>
            <Switch
              id="business-hours"
              checked={businessHoursOnly}
              onCheckedChange={setBusinessHoursOnly}
              data-testid="switch-business-hours"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button data-testid="button-save-voice" onClick={handleSave}>Save</Button>
            <Button variant="outline" data-testid="button-test-call" onClick={handleTestCall}>
              <Phone className="w-4 h-4 mr-2" />
              Test Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
