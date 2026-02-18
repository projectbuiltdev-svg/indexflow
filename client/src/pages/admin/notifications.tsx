import { Bell, Check, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin-layout";

const notifications = [
  { id: 1, type: "success", title: "New Client Signup", message: "Coastal SEO has signed up for Complete Solution", time: "2 hours ago", read: false },
  { id: 2, type: "warning", title: "Payment Failed", message: "Metro Creative subscription payment failed", time: "5 hours ago", read: false },
  { id: 3, type: "info", title: "Website Published", message: "Summit Marketing website is now live", time: "1 day ago", read: true },
  { id: 4, type: "success", title: "Setup Complete", message: "Pinnacle Digital setup has been completed", time: "2 days ago", read: true },
  { id: 5, type: "info", title: "High Call Volume", message: "Acme Digital received 50+ AI calls today", time: "3 days ago", read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "warning": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    default: return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export default function AdminNotifications() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Notifications</h1>
          <p className="text-sm text-muted-foreground">System alerts and updates</p>
        </div>
        <Button variant="outline" data-testid="button-mark-all-read">
          <Check className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Stay updated on platform activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`flex items-start gap-4 p-4 rounded-lg border ${!notif.read ? 'bg-muted/50' : ''}`}
            >
              {getIcon(notif.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{notif.title}</p>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
