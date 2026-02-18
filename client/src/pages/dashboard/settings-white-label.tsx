import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Globe, Type, Image } from "lucide-react";

export default function SettingsWhiteLabel() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">White Label</h1>
            <p className="text-muted-foreground">Customize branding and appearance for your clients</p>
          </div>
          <Button data-testid="button-save-branding">
            Save Changes
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-branding-status">Configured</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Branding</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-custom-domain">myagency.com</p>
                  <p className="text-xs text-muted-foreground">Custom Domain</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge variant="secondary" data-testid="text-logo-status">Uploaded</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Custom Logo</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-brand-color">#3B82F6</p>
                  <p className="text-xs text-muted-foreground">Brand Color</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>Customize logos, colors, and typography</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Company Name", value: "My Agency" },
                  { label: "Primary Color", value: "#3B82F6" },
                  { label: "Logo", value: "logo.png (uploaded)" },
                  { label: "Favicon", value: "favicon.ico (uploaded)" },
                  { label: "Font Family", value: "Inter" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium" data-testid={`text-brand-${i}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Branded email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { template: "Report Notification", status: "customized" },
                  { template: "Reminder", status: "customized" },
                  { template: "Account Update", status: "default" },
                  { template: "Welcome Email", status: "customized" },
                  { template: "Follow-up", status: "default" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-template-${i}`}>
                    <p className="text-sm font-medium">{item.template}</p>
                    <Badge variant={item.status === "customized" ? "default" : "secondary"} className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
