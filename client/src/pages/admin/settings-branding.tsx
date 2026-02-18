import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

export default function AdminSettingsBranding() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Branding</h1>
        <p className="text-sm text-muted-foreground">White-label platform appearance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-8" data-testid="upload-logo">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Click or drag to upload logo</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <Input defaultValue="IndexFlow" data-testid="input-platform-name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <Input defaultValue="SEO & Content Management Platform" data-testid="input-tagline" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <Input defaultValue="#2563EB" data-testid="input-primary-color" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Favicon</label>
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-8" data-testid="upload-favicon">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Click or drag to upload favicon</p>
              </div>
            </div>
          </div>

          <Button data-testid="button-save-branding">Save</Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}