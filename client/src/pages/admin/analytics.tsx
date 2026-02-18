import { BarChart3, TrendingUp, Users, Phone, MessageSquare, MessageCircle, PhoneCall, Globe, FileEdit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

const stats = [
  { label: "Total Leads", value: "2,847", change: "+12%", icon: BarChart3 },
  { label: "AI Voice Calls", value: "1,293", change: "+8%", icon: PhoneCall },
  { label: "SMS Sent", value: "3,847", change: "+15%", icon: MessageCircle },
  { label: "Widget Chats", value: "5,621", change: "+23%", icon: MessageSquare },
  { label: "Keywords Tracked", value: "342", change: "+18%", icon: TrendingUp },
  { label: "Website Changes", value: "89", change: "+9%", icon: FileEdit },
  { label: "Phone Leads", value: "456", change: "+11%", icon: Phone },
  { label: "Active Users", value: "156", change: "+5%", icon: Users },
];

const topClients = [
  { name: "Acme Digital", leads: 342, calls: 156, sms: 423, widgets: 823, keywords: 28, changes: 12, twilioConnected: true, gscConnected: true },
  { name: "Summit Marketing", leads: 289, calls: 134, sms: 398, widgets: 567, keywords: 35, changes: 8, twilioConnected: true, gscConnected: true },
  { name: "Dragon Media", leads: 234, calls: 98, sms: 287, widgets: 445, keywords: 18, changes: 5, twilioConnected: true, gscConnected: true },
  { name: "Coastal SEO", leads: 198, calls: 0, sms: 0, widgets: 389, keywords: 22, changes: 15, twilioConnected: false, gscConnected: false },
  { name: "Sakura Digital", leads: 167, calls: 45, sms: 134, widgets: 312, keywords: 15, changes: 3, twilioConnected: true, gscConnected: true },
  { name: "Metro Creative", leads: 156, calls: 67, sms: 189, widgets: 298, keywords: 10, changes: 6, twilioConnected: true, gscConnected: false },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform-wide performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Clients</CardTitle>
          <CardDescription>Clients with highest engagement this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Leads</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">AI Calls</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">SMS</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Widgets</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Keywords</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Changes</th>
                  <th className="pb-3 font-medium text-muted-foreground">Twilio</th>
                  <th className="pb-3 font-medium text-muted-foreground">GSC</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((client, index) => (
                  <tr key={client.name} className="border-b last:border-0" data-testid={`row-analytics-${index}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">{client.leads}</td>
                    <td className="py-4 text-right">{client.calls}</td>
                    <td className="py-4 text-right">{client.sms}</td>
                    <td className="py-4 text-right">{client.widgets}</td>
                    <td className="py-4 text-right">{client.keywords}</td>
                    <td className="py-4 text-right">{client.changes}</td>
                    <td className="py-4">
                      <Badge variant="outline" className={client.twilioConnected ? "text-green-600 dark:text-green-400 border-green-500/30 text-xs" : "text-muted-foreground text-xs"}>
                        {client.twilioConnected ? "Connected" : "Not Set Up"}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className={client.gscConnected ? "text-green-600 dark:text-green-400 border-green-500/30 text-xs" : "text-muted-foreground text-xs"}>
                        {client.gscConnected ? "Connected" : "Not Set Up"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
