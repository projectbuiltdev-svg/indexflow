import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function AdminNotifications() {
  useVenue();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-notifications">
          Notifications
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-3" data-testid="empty-state-notifications">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-medium">No new notifications</h2>
            <p className="text-muted-foreground">
              You're all caught up. New notifications will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
