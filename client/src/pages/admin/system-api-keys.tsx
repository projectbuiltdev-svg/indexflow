import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, ImageIcon, Camera, Aperture, BarChart3 } from "lucide-react";

const services = [
  { name: "OpenAI", icon: Brain, connected: true, lastTested: "Feb 17, 2026", usage: "2.3M tokens/mo", inputs: [{ placeholder: "API key", type: "password" as const }] },
  { name: "Pexels", icon: ImageIcon, connected: true, lastTested: "Feb 16, 2026", usage: "1,230 calls/mo", inputs: [{ placeholder: "API key", type: "password" as const }] },
  { name: "Pixabay", icon: Camera, connected: false, lastTested: "Never", usage: "0 calls/mo", inputs: [{ placeholder: "API key", type: "password" as const }] },
  { name: "Unsplash", icon: Aperture, connected: true, lastTested: "Feb 15, 2026", usage: "620 calls/mo", inputs: [{ placeholder: "API key", type: "password" as const }] },
  { name: "DataForSEO", icon: BarChart3, connected: true, lastTested: "Feb 17, 2026", usage: "18,420 calls/mo", inputs: [{ placeholder: "Login", type: "text" as const }, { placeholder: "Password", type: "password" as const }] },
];

export default function AdminSystemApiKeys() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">API Keys</h1>
        <p className="text-sm text-muted-foreground">Third-party service credentials</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((svc) => (
          <Card key={svc.name} data-testid={`card-service-${svc.name.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <svc.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{svc.name}</CardTitle>
              </div>
              <Badge variant={svc.connected ? "default" : "secondary"} data-testid={`badge-status-${svc.name.toLowerCase().replace(/\s+/g, "-")}`}>
                {svc.connected ? "Connected" : "Not Connected"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {svc.inputs.map((input, idx) => (
                <Input
                  key={idx}
                  type={input.type}
                  placeholder={input.placeholder}
                  data-testid={`input-${svc.name.toLowerCase().replace(/\s+/g, "-")}-${idx}`}
                />
              ))}
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" data-testid={`button-save-${svc.name.toLowerCase().replace(/\s+/g, "-")}`}>Save</Button>
                <Button variant="outline" size="sm" data-testid={`button-test-${svc.name.toLowerCase().replace(/\s+/g, "-")}`}>Test</Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p data-testid={`text-last-tested-${svc.name.toLowerCase().replace(/\s+/g, "-")}`}>Last tested: {svc.lastTested}</p>
                <p data-testid={`text-usage-${svc.name.toLowerCase().replace(/\s+/g, "-")}`}>Monthly usage: {svc.usage}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}