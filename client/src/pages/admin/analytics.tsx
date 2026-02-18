import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarCheck, PhoneCall, MessageCircle, MessageSquare, TrendingUp, FileEdit, Phone, Users } from "lucide-react";

const stats = [
  { label: "Total Bookings", value: "2,847", change: "+12%", icon: CalendarCheck },
  { label: "AI Voice Calls", value: "1,293", change: "+8%", icon: PhoneCall },
  { label: "SMS Sent", value: "3,847", change: "+15%", icon: MessageCircle },
  { label: "Widget Chats", value: "5,621", change: "+23%", icon: MessageSquare },
  { label: "Keywords Tracked", value: "342", change: "+18%", icon: TrendingUp },
  { label: "Website Changes", value: "89", change: "+9%", icon: FileEdit },
  { label: "Phone Bookings", value: "456", change: "+11%", icon: Phone },
  { label: "Active Users", value: "156", change: "+5%", icon: Users },
];

const topClients = [
  { name: "Acme Digital", bookings: 342, calls: 156, sms: 423, widgets: 823, keywords: 28, changes: 12, twilioConnected: true, gscConnected: true },
  { name: "Summit Marketing", bookings: 289, calls: 134, sms: 398, widgets: 567, keywords: 35, changes: 8, twilioConnected: true, gscConnected: true },
  { name: "Dragon Media", bookings: 234, calls: 98, sms: 287, widgets: 445, keywords: 18, changes: 5, twilioConnected: true, gscConnected: true },
  { name: "Coastal SEO", bookings: 198, calls: 0, sms: 0, widgets: 389, keywords: 22, changes: 15, twilioConnected: false, gscConnected: false },
  { name: "Sakura Digital", bookings: 167, calls: 45, sms: 134, widgets: 312, keywords: 15, changes: 3, twilioConnected: true, gscConnected: true },
  { name: "Metro Creative", bookings: 156, calls: 67, sms: 189, widgets: 298, keywords: 10, changes: 6, twilioConnected: true, gscConnected: false },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Analytics</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Platform-wide performance metrics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</span>
                </div>
                <p className="text-xs text-emerald-600 mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold" data-testid="text-section-top-clients">Top Performing Clients</h2>
          <p className="text-sm text-muted-foreground">Clients with highest engagement this month</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                  <TableHead className="text-right">AI Calls</TableHead>
                  <TableHead className="text-right">SMS</TableHead>
                  <TableHead className="text-right">Widgets</TableHead>
                  <TableHead className="text-right">Keywords</TableHead>
                  <TableHead className="text-right">Changes</TableHead>
                  <TableHead>Twilio</TableHead>
                  <TableHead>GSC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClients.map((client, index) => (
                  <TableRow key={client.name} data-testid={`row-analytics-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{client.bookings}</TableCell>
                    <TableCell className="text-right">{client.calls}</TableCell>
                    <TableCell className="text-right">{client.sms}</TableCell>
                    <TableCell className="text-right">{client.widgets}</TableCell>
                    <TableCell className="text-right">{client.keywords}</TableCell>
                    <TableCell className="text-right">{client.changes}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={client.twilioConnected ? "text-emerald-600 border-emerald-500/30 text-xs" : "text-muted-foreground text-xs"}
                        data-testid={`badge-twilio-${index}`}
                      >
                        {client.twilioConnected ? "Connected" : "Not Set Up"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={client.gscConnected ? "text-emerald-600 border-emerald-500/30 text-xs" : "text-muted-foreground text-xs"}
                        data-testid={`badge-gsc-${index}`}
                      >
                        {client.gscConnected ? "Connected" : "Not Set Up"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
