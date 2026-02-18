import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Clock, TrendingUp, CheckCircle } from "lucide-react";

const mockSessions = [
  { id: 1, visitor: "Visitor #1042", messages: 8, duration: "4:32", outcome: "Booking Made", date: "2026-02-18 15:10" },
  { id: 2, visitor: "Visitor #1041", messages: 3, duration: "1:15", outcome: "FAQ Answered", date: "2026-02-18 14:30" },
  { id: 3, visitor: "Visitor #1040", messages: 12, duration: "6:20", outcome: "Booking Made", date: "2026-02-18 13:00" },
  { id: 4, visitor: "Visitor #1039", messages: 2, duration: "0:45", outcome: "Abandoned", date: "2026-02-18 11:30" },
  { id: 5, visitor: "Visitor #1038", messages: 5, duration: "2:10", outcome: "FAQ Answered", date: "2026-02-17 16:45" },
];

export default function WidgetMonitoring() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Widget Monitoring</h1>
          <p className="text-muted-foreground">Track chat widget performance and visitor interactions</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-sessions">142</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-active-visitors">8</p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-avg-duration">3:15</p>
                  <p className="text-xs text-muted-foreground">Avg. Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-conversion-rate">34%</p>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Monitor chat widget interactions in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-session-${session.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{session.visitor}</p>
                      <p className="text-xs text-muted-foreground">{session.date} - {session.messages} messages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {session.duration}
                    </span>
                    <Badge variant={session.outcome === "Booking Made" ? "default" : "secondary"} className="text-xs">
                      {session.outcome}
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
