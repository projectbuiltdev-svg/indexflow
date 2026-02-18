import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle, Send } from "lucide-react";

const stats = [
  { label: "Email Templates", value: "14", icon: FileText },
  { label: "Emails Sent (Month)", value: "12,340", icon: Send },
  { label: "Delivery Rate", value: "99.2%", icon: CheckCircle },
  { label: "Active Providers", value: "1", icon: Mail },
];

const templates = [
  { name: "Booking Confirmation", category: "Transactional", lastEdited: "Feb 10, 2026", status: "Active", sends: "4,230" },
  { name: "Booking Reminder (24h)", category: "Transactional", lastEdited: "Feb 8, 2026", status: "Active", sends: "3,890" },
  { name: "Welcome Email", category: "Onboarding", lastEdited: "Jan 28, 2026", status: "Active", sends: "1,240" },
  { name: "Password Reset", category: "Authentication", lastEdited: "Jan 15, 2026", status: "Active", sends: "342" },
  { name: "Monthly Newsletter", category: "Marketing", lastEdited: "Feb 1, 2026", status: "Active", sends: "2,100" },
  { name: "Cancellation Notice", category: "Transactional", lastEdited: "Jan 20, 2026", status: "Active", sends: "538" },
  { name: "Review Request", category: "Engagement", lastEdited: "Feb 5, 2026", status: "Draft", sends: "0" },
];

export default function AdminSystemEmail() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Email Settings</h1>
        <p className="text-muted-foreground">Email template management and delivery configuration</p>
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
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>All email templates and their usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-template-${template.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.category} &middot; {template.sends} sends &middot; Last edited {template.lastEdited}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={template.status === "Active" ? "default" : "secondary"}>{template.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-edit-template-${template.name.toLowerCase().replace(/\s+/g, "-")}`}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
