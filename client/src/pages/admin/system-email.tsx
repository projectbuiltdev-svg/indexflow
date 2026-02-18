import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const templates = [
  { name: "Welcome", description: "Sent to new users upon registration" },
  { name: "Invoice", description: "Monthly billing invoice notification" },
  { name: "Password Reset", description: "Password reset request email" },
  { name: "Support Reply", description: "Reply to support ticket submissions" },
  { name: "Announcement", description: "Platform-wide announcement template" },
];

export default function AdminSystemEmail() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Email Configuration</h1>
        <p className="text-sm text-muted-foreground">SMTP settings and email templates</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Host</label>
              <Input placeholder="smtp.example.com" data-testid="input-smtp-host" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Port</label>
              <Input placeholder="587" data-testid="input-smtp-port" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input placeholder="username" data-testid="input-smtp-username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="Password" data-testid="input-smtp-password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">From Address</label>
              <Input placeholder="noreply@indexflow.io" data-testid="input-from-address" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">From Name</label>
              <Input placeholder="IndexFlow" data-testid="input-from-name" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button data-testid="button-save-smtp">Save</Button>
            <Button variant="outline" data-testid="button-send-test-email">Send Test Email</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-template-${template.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" data-testid={`button-edit-template-${template.name.toLowerCase().replace(/\s+/g, "-")}`}>Edit</Button>
                  <Button variant="outline" size="sm" data-testid={`button-preview-template-${template.name.toLowerCase().replace(/\s+/g, "-")}`}>Preview</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}