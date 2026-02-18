import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, PhoneIncoming, PhoneOutgoing, Clock } from "lucide-react";

const stats = [
  { label: "Total Calls (Month)", value: "1,293", icon: Phone },
  { label: "Inbound", value: "987", icon: PhoneIncoming },
  { label: "Outbound", value: "306", icon: PhoneOutgoing },
  { label: "Avg Duration", value: "3m 24s", icon: Clock },
];

const callLogs = [
  { id: "CALL-8934", from: "+1 (917) 555-0123", to: "La Bella Italia", agency: "Hospitality Group NYC", duration: "4:12", type: "Inbound", status: "Completed", time: "10 min ago" },
  { id: "CALL-8933", from: "+1 (212) 555-0456", to: "Ocean View Bistro", agency: "Coastal Dining Co.", duration: "2:45", type: "Inbound", status: "Completed", time: "25 min ago" },
  { id: "CALL-8932", from: "System", to: "+1 (646) 555-0789", agency: "Metro Bistro Group", duration: "1:30", type: "Outbound", status: "Completed", time: "1 hr ago" },
  { id: "CALL-8931", from: "+41 79 555 0234", to: "Mountain Lodge", agency: "Alpine Hotels Ltd.", duration: "5:18", type: "Inbound", status: "Completed", time: "2 hrs ago" },
  { id: "CALL-8930", from: "+1 (310) 555-0567", to: "Skyline Bar", agency: "Pacific Venues Inc.", duration: "0:00", type: "Inbound", status: "Missed", time: "3 hrs ago" },
  { id: "CALL-8929", from: "System", to: "+1 (917) 555-0890", agency: "Hospitality Group NYC", duration: "0:45", type: "Outbound", status: "Voicemail", time: "4 hrs ago" },
];

export default function AdminSupportCallLogs() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform Call Logs</h1>
        <p className="text-muted-foreground">Voice call history across all agencies</p>
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
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Latest call activity across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {callLogs.map((call) => (
              <div key={call.id} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-call-${call.id}`}>
                <div className="min-w-0">
                  <p className="font-medium">{call.from} {call.type === "Inbound" ? "to" : "called"} {call.to}</p>
                  <p className="text-sm text-muted-foreground">{call.id} &middot; {call.agency} &middot; {call.duration} &middot; {call.time}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{call.type}</Badge>
                  <Badge variant={call.status === "Completed" ? "default" : call.status === "Missed" ? "destructive" : "secondary"}>{call.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-call-${call.id}`}>Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
