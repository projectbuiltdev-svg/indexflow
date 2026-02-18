import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Headset, AlertCircle, CheckCircle, Clock } from "lucide-react";

const stats = [
  { label: "Total Tickets", value: "342", icon: Headset },
  { label: "Open", value: "12", icon: AlertCircle },
  { label: "Avg Response", value: "2.4 hrs", icon: Clock },
  { label: "Resolved (30d)", value: "89", icon: CheckCircle },
];

const tickets = [
  { id: "TKT-1042", subject: "Widget not loading on Safari", agency: "Hospitality Group NYC", priority: "High", status: "Open", created: "2 hrs ago" },
  { id: "TKT-1041", subject: "Booking confirmation email delayed", agency: "Coastal Dining Co.", priority: "Medium", status: "Open", created: "4 hrs ago" },
  { id: "TKT-1040", subject: "Cannot add new team member", agency: "Alpine Hotels Ltd.", priority: "Low", status: "In Progress", created: "6 hrs ago" },
  { id: "TKT-1039", subject: "SEO rank tracker shows incorrect data", agency: "Metro Bistro Group", priority: "High", status: "Open", created: "1 day ago" },
  { id: "TKT-1038", subject: "Custom domain SSL certificate issue", agency: "Pacific Venues Inc.", priority: "Critical", status: "In Progress", created: "1 day ago" },
  { id: "TKT-1037", subject: "Billing invoice discrepancy", agency: "Urban Eats Network", priority: "Medium", status: "Resolved", created: "2 days ago" },
];

export default function AdminSupportTickets() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">All Support Tickets</h1>
        <p className="text-muted-foreground">Support tickets across all agencies</p>
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
          <CardTitle>Ticket Queue</CardTitle>
          <CardDescription>Recent support tickets requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-ticket-${ticket.id}`}>
                <div className="min-w-0">
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">{ticket.id} &middot; {ticket.agency} &middot; {ticket.created}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={ticket.priority === "Critical" ? "destructive" : ticket.priority === "High" ? "destructive" : ticket.priority === "Medium" ? "default" : "secondary"}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant={ticket.status === "Open" ? "outline" : ticket.status === "In Progress" ? "default" : "secondary"}>
                    {ticket.status}
                  </Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-ticket-${ticket.id}`}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
