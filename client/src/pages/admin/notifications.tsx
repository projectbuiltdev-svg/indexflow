import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, PhoneCall, LifeBuoy, FileText } from "lucide-react";

const notificationOptions = [
  { id: "new-venue", label: "New Venue Registration", description: "Get notified when a new venue signs up", icon: Bell },
  { id: "contact-message", label: "Contact Messages", description: "Notify on new CRM contact messages", icon: Mail },
  { id: "support-ticket", label: "Support Tickets", description: "Alert on new support tickets", icon: LifeBuoy },
  { id: "call-log", label: "Call Logs", description: "Notify on new incoming calls", icon: PhoneCall },
  { id: "website-change", label: "Website Change Requests", description: "Alert on new change requests", icon: MessageSquare },
  { id: "content-published", label: "Content Published", description: "Notify when blog posts are published", icon: FileText },
];

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-notifications-title">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
          <CardDescription>Configure which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationOptions.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <opt.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor={opt.id} className="text-sm font-medium">{opt.label}</Label>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </div>
              <Switch id={opt.id} defaultChecked data-testid={`switch-${opt.id}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
