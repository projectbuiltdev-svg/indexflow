import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, ToggleRight, Gauge, Shield } from "lucide-react";

const stats = [
  { label: "Feature Flags", value: "18", icon: ToggleRight },
  { label: "Active Flags", value: "14", icon: Settings },
  { label: "Rate Limits", value: "8", icon: Gauge },
  { label: "Security Rules", value: "12", icon: Shield },
];

const featureFlags = [
  { name: "ai_voice_booking", label: "AI Voice Booking", description: "Enable AI-powered voice booking for agencies", enabled: true },
  { name: "seo_local_grid", label: "Local SEO Grid", description: "Local search grid tracking feature", enabled: true },
  { name: "content_ai_writer", label: "AI Content Writer", description: "AI-powered blog and content generation", enabled: true },
  { name: "multi_language", label: "Multi-Language Support", description: "Multi-language website content", enabled: true },
  { name: "room_bookings", label: "Room Bookings", description: "Hotel room booking system", enabled: true },
  { name: "advanced_analytics", label: "Advanced Analytics", description: "Detailed analytics with custom reports", enabled: false },
  { name: "api_v2", label: "API v2 Access", description: "Next-gen API endpoints for integrations", enabled: false },
  { name: "white_label", label: "White Label Mode", description: "Full white-label branding for agencies", enabled: false },
];

const limits = [
  { name: "Max Venues per Agency", starter: "5", professional: "15", enterprise: "Unlimited" },
  { name: "Max Users per Agency", starter: "10", professional: "25", enterprise: "Unlimited" },
  { name: "AI Calls per Month", starter: "100", professional: "500", enterprise: "2,000" },
  { name: "Keywords Tracked", starter: "50", professional: "200", enterprise: "1,000" },
];

export default function AdminSettingsConfig() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform Configuration</h1>
        <p className="text-muted-foreground">Feature flags, rate limits, and platform settings</p>
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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Toggle platform features on and off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureFlags.map((flag) => (
                <div key={flag.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-flag-${flag.name}`}>
                  <div className="min-w-0">
                    <p className="font-medium">{flag.label}</p>
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                  </div>
                  <Badge variant={flag.enabled ? "default" : "secondary"}>{flag.enabled ? "Enabled" : "Disabled"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Limits</CardTitle>
            <CardDescription>Resource limits by subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {limits.map((limit) => (
                <div key={limit.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-limit-${limit.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <p className="font-medium">{limit.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">Starter: {limit.starter}</Badge>
                    <Badge variant="outline">Pro: {limit.professional}</Badge>
                    <Badge variant="default">Enterprise: {limit.enterprise}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
