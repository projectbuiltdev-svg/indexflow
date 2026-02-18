import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Type, Image, Globe } from "lucide-react";

const stats = [
  { label: "Brand Assets", value: "12", icon: Image },
  { label: "Color Themes", value: "3", icon: Palette },
  { label: "Font Families", value: "2", icon: Type },
  { label: "Custom Domains", value: "1", icon: Globe },
];

const brandSettings = [
  { setting: "Platform Name", value: "IndexFlow", category: "Identity" },
  { setting: "Primary Color", value: "#2563EB", category: "Colors" },
  { setting: "Secondary Color", value: "#7C3AED", category: "Colors" },
  { setting: "Heading Font", value: "Inter", category: "Typography" },
  { setting: "Body Font", value: "Inter", category: "Typography" },
  { setting: "Logo (Light)", value: "logo-light.webp", category: "Assets" },
  { setting: "Logo (Dark)", value: "logo-dark.webp", category: "Assets" },
  { setting: "Favicon", value: "favicon.webp", category: "Assets" },
  { setting: "OG Image", value: "og-image.webp", category: "Social" },
  { setting: "Support Email", value: "support@indexflow.io", category: "Contact" },
];

export default function AdminSettingsBranding() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform Branding</h1>
        <p className="text-muted-foreground">Customize platform appearance, logos, and brand identity</p>
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
        <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle>Brand Settings</CardTitle>
            <CardDescription>Platform branding configuration</CardDescription>
          </div>
          <Button data-testid="button-save-branding">Save Changes</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brandSettings.map((item) => (
              <div key={item.setting} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-brand-${item.setting.toLowerCase().replace(/[\s()]/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{item.setting}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{item.value}</span>
                  <Button variant="outline" size="sm" data-testid={`button-edit-brand-${item.setting.toLowerCase().replace(/[\s()]/g, "-")}`}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
