import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from "lucide-react";

const mockCalls = [
  { id: 1, from: "+1 (555) 123-4567", to: "+1 (555) 987-6543", direction: "inbound", duration: "3:42", status: "completed", date: "2026-02-18 14:30" },
  { id: 2, from: "+1 (555) 987-6543", to: "+1 (555) 234-5678", direction: "outbound", duration: "1:15", status: "completed", date: "2026-02-18 13:15" },
  { id: 3, from: "+1 (555) 345-6789", to: "+1 (555) 987-6543", direction: "inbound", duration: "0:00", status: "missed", date: "2026-02-18 12:00" },
  { id: 4, from: "+1 (555) 456-7890", to: "+1 (555) 987-6543", direction: "inbound", duration: "5:20", status: "completed", date: "2026-02-17 16:45" },
  { id: 5, from: "+1 (555) 987-6543", to: "+1 (555) 567-8901", direction: "outbound", duration: "2:08", status: "completed", date: "2026-02-17 10:30" },
];

export default function TwilioCallLogs() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Call Logs</h1>
          <p className="text-muted-foreground">View call history and analytics</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-calls">5</p>
                  <p className="text-xs text-muted-foreground">Total Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <PhoneIncoming className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-inbound-calls">3</p>
                  <p className="text-xs text-muted-foreground">Inbound</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <PhoneOutgoing className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-outbound-calls">2</p>
                  <p className="text-xs text-muted-foreground">Outbound</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <PhoneMissed className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-missed-calls">1</p>
                  <p className="text-xs text-muted-foreground">Missed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Complete call history with duration and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-call-${call.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {call.direction === "inbound" && call.status !== "missed" && <PhoneIncoming className="w-4 h-4 text-green-500 shrink-0" />}
                    {call.direction === "outbound" && <PhoneOutgoing className="w-4 h-4 text-blue-500 shrink-0" />}
                    {call.status === "missed" && <PhoneMissed className="w-4 h-4 text-red-500 shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{call.from}</p>
                      <p className="text-xs text-muted-foreground">{call.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {call.duration}
                    </span>
                    <Badge variant={call.status === "completed" ? "default" : "destructive"} className="text-xs">
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
