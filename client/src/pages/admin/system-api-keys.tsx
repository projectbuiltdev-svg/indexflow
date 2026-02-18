import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, Shield, Activity, Settings } from "lucide-react";

const stats = [
  { label: "Active Keys", value: "7", icon: Key },
  { label: "Services Connected", value: "5", icon: Activity },
  { label: "Keys Rotated (30d)", value: "2", icon: Shield },
  { label: "Pending Setup", value: "1", icon: Settings },
];

const apiKeys = [
  { service: "OpenAI", key: "sk-...4x8m", status: "Active", lastUsed: "2 min ago", usage: "$1,673.20/mo" },
  { service: "Pexels", key: "px-...r9kl", status: "Active", lastUsed: "15 min ago", usage: "8,420 req/mo" },
  { service: "DataForSEO", key: "df-...j2wp", status: "Active", lastUsed: "5 min ago", usage: "$284.50/mo" },
  { service: "Twilio", key: "tw-...n5ht", status: "Active", lastUsed: "1 min ago", usage: "$412.30/mo" },
  { service: "SendGrid", key: "sg-...m8qz", status: "Active", lastUsed: "30 min ago", usage: "12,340 emails/mo" },
  { service: "Google Maps", key: "gm-...k4vb", status: "Active", lastUsed: "3 min ago", usage: "$89.00/mo" },
  { service: "Stripe", key: "sk-...p7xs", status: "Active", lastUsed: "10 min ago", usage: "312 txns/mo" },
];

export default function AdminSystemApiKeys() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform API Keys</h1>
        <p className="text-muted-foreground">Manage API keys and third-party service credentials</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>All platform API keys and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.service} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-apikey-${key.service.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{key.service}</p>
                  <p className="text-sm text-muted-foreground">{key.key} &middot; Last used: {key.lastUsed} &middot; {key.usage}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="default">{key.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-rotate-${key.service.toLowerCase().replace(/\s+/g, "-")}`}>Rotate</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
