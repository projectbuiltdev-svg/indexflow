import { useState } from "react";
import { useVenue } from "@/lib/venue-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Globe } from "lucide-react";

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function AdminNotifications() {
  useVenue();
  const { toast } = useToast();

  const [emailSettings, setEmailSettings] = useState<NotificationSetting[]>([
    { key: "new_reservation", label: "New Reservation", description: "Receive email when a new reservation is made", enabled: true },
    { key: "cancelled_reservation", label: "Cancelled Reservation", description: "Receive email when a reservation is cancelled", enabled: true },
    { key: "new_support_ticket", label: "New Support Ticket", description: "Receive email when a new support ticket is created", enabled: false },
    { key: "contact_message", label: "Contact Message", description: "Receive email for new contact form submissions", enabled: true },
  ]);

  const [smsSettings, setSmsSettings] = useState<NotificationSetting[]>([
    { key: "sms_reservation_confirm", label: "Reservation Confirmation", description: "Send SMS confirmation to guests", enabled: true },
    { key: "sms_reservation_reminder", label: "Reservation Reminder", description: "Send SMS reminder before reservation", enabled: false },
    { key: "sms_call_missed", label: "Missed Call Alert", description: "Send SMS alert for missed calls", enabled: false },
  ]);

  const [webhookSettings, setWebhookSettings] = useState<NotificationSetting[]>([
    { key: "webhook_reservation", label: "Reservation Webhook", description: "POST to webhook URL on new reservations", enabled: false },
    { key: "webhook_support", label: "Support Ticket Webhook", description: "POST to webhook URL on new tickets", enabled: false },
  ]);

  const toggleSetting = (
    settings: NotificationSetting[],
    setter: (s: NotificationSetting[]) => void,
    key: string
  ) => {
    setter(settings.map((s) => s.key === key ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    toast({ title: "Preferences saved", description: "Notification preferences updated successfully." });
  };

  const renderSection = (
    title: string,
    icon: typeof Mail,
    settings: NotificationSetting[],
    setter: (s: NotificationSetting[]) => void,
    testIdPrefix: string
  ) => {
    const Icon = icon;
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium" data-testid={`text-${testIdPrefix}-${setting.key}`}>{setting.label}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => toggleSetting(settings, setter, setting.key)}
                data-testid={`switch-${testIdPrefix}-${setting.key}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-semibold" data-testid="page-title-notifications">Notifications</h1>
        </div>
        <Button onClick={handleSave} data-testid="button-save-notifications">
          Save Preferences
        </Button>
      </div>

      {renderSection("Email Notifications", Mail, emailSettings, setEmailSettings, "email")}
      {renderSection("SMS Notifications", MessageSquare, smsSettings, setSmsSettings, "sms")}
      {renderSection("Webhook Notifications", Globe, webhookSettings, setWebhookSettings, "webhook")}
    </div>
  );
}
