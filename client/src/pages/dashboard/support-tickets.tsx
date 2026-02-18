import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";

const mockTickets = [
  { id: "TKT-1024", subject: "Widget not loading on Safari", priority: "high", status: "open", created: "2026-02-18", updated: "2026-02-18" },
  { id: "TKT-1023", subject: "API rate limit exceeded", priority: "medium", status: "in-progress", created: "2026-02-17", updated: "2026-02-18" },
  { id: "TKT-1022", subject: "Custom domain SSL certificate issue", priority: "high", status: "in-progress", created: "2026-02-16", updated: "2026-02-17" },
  { id: "TKT-1021", subject: "How to export booking data?", priority: "low", status: "resolved", created: "2026-02-15", updated: "2026-02-16" },
  { id: "TKT-1020", subject: "Twilio webhook not triggering", priority: "medium", status: "resolved", created: "2026-02-14", updated: "2026-02-15" },
];

export default function SupportTickets() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Support Tickets</h1>
            <p className="text-muted-foreground">Submit and track support requests</p>
          </div>
          <Button data-testid="button-new-ticket">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <LifeBuoy className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-tickets">5</p>
                  <p className="text-xs text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-open-tickets">1</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-in-progress">2</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-resolved-tickets">2</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>View and manage your support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border hover-elevate cursor-pointer flex-wrap" data-testid={`row-ticket-${ticket.id}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono text-xs text-muted-foreground">{ticket.id}</p>
                      <p className="font-medium text-sm">{ticket.subject}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Created {ticket.created} - Updated {ticket.updated}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={ticket.priority === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      variant={ticket.status === "resolved" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {ticket.status}
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
