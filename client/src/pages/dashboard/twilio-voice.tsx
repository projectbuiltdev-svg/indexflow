import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Phone, Volume2, Settings } from "lucide-react";

export default function TwilioVoice() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Voice Settings</h1>
          <p className="text-muted-foreground">Configure voice call settings and AI voice assistant</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-phone-number">+1 (555) 987-6543</p>
                  <p className="text-xs text-muted-foreground">Active Number</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-voice-model">Alloy</p>
                  <p className="text-xs text-muted-foreground">Voice Model</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-language">English</p>
                  <p className="text-xs text-muted-foreground">Language</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-voice-status">Active</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Greeting Message</CardTitle>
              <CardDescription>Configure the AI greeting for incoming calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground" data-testid="text-greeting">
                  "Hello, thank you for calling! I'm your AI assistant. How can I help you today? I can assist with account inquiries, service information, and more."
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-3" data-testid="button-edit-greeting">
                Edit Greeting
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Call Routing</CardTitle>
              <CardDescription>Set up call forwarding and routing rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap">
                  <div>
                    <p className="font-medium text-sm">Fallback Number</p>
                    <p className="text-xs text-muted-foreground">When AI cannot handle the call</p>
                  </div>
                  <span className="text-sm" data-testid="text-fallback-number">+1 (555) 111-2222</span>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap">
                  <div>
                    <p className="font-medium text-sm">Max Ring Duration</p>
                    <p className="text-xs text-muted-foreground">Seconds before voicemail</p>
                  </div>
                  <span className="text-sm" data-testid="text-ring-duration">30s</span>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap">
                  <div>
                    <p className="font-medium text-sm">Recording</p>
                    <p className="text-xs text-muted-foreground">Call recording preference</p>
                  </div>
                  <Badge variant="secondary" data-testid="text-recording">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
