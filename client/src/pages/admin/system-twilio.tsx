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
import { Phone, MessageSquare, Wifi, CalendarCheck, Mic, Shield, Settings } from "lucide-react";

const stats = [
  { label: "Total Voice Calls", value: "1,293", subtitle: "+87 this week", icon: Phone },
  { label: "SMS Sent", value: "3,847", subtitle: "+312 this week", icon: MessageSquare },
  { label: "Twilio Connected", value: "38", subtitle: "of 47 clients", icon: Wifi },
  { label: "Bookings via Phone", value: "456", subtitle: "+34 this week", icon: CalendarCheck },
];

const clientStatus = [
  { client: "Bella Cucina", status: "Connected", phone: "+1 (212) 555-0142", calls: 156, sms: 423, ai: true },
  { client: "Grand Meridian", status: "Connected", phone: "+1 (415) 555-0198", calls: 134, sms: 398, ai: true },
  { client: "Sakura Dining", status: "Connected", phone: "+1 (646) 555-0234", calls: 98, sms: 287, ai: true },
  { client: "Coastal Breeze", status: "Not Connected", phone: "-", calls: 0, sms: 0, ai: false },
  { client: "The Blue Lagoon", status: "Connected", phone: "+1 (310) 555-0167", calls: 45, sms: 134, ai: true },
];

const recentSms = [
  { from: "Bella Cucina", message: "Your reservation for 2 at 7:30 PM has been confirmed.", time: "2 min ago" },
  { from: "Grand Meridian", message: "Reminder: Check-in tomorrow at 3:00 PM. Reply HELP for assistance.", time: "15 min ago" },
  { from: "Sakura Dining", message: "Thank you for your booking! We look forward to seeing you.", time: "1 hr ago" },
  { from: "The Blue Lagoon", message: "Your table is ready! Please arrive within 15 minutes.", time: "2 hrs ago" },
];

const voiceFeatures = ["Inbound call handling", "AI voice assistant", "Call recording", "Voicemail transcription", "Call forwarding"];
const smsFeatures = ["Booking confirmations", "Reminder notifications", "Two-way messaging", "Bulk SMS campaigns", "Auto-responses"];
const securityConfig = ["Webhook validation", "API key rotation", "Rate limiting", "Number verification", "Audit logging"];

export default function AdminSystemTwilio() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Twilio Management</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Monitor voice calls, SMS messaging, and Twilio connections across all clients</p>
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
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client Twilio Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Calls</TableHead>
                    <TableHead className="text-right">SMS</TableHead>
                    <TableHead>AI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientStatus.map((row, i) => (
                    <TableRow key={i} data-testid={`row-twilio-client-${i}`}>
                      <TableCell className="font-medium">{row.client}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={row.status === "Connected" ? "text-emerald-600 border-emerald-500/30 text-xs" : "text-muted-foreground text-xs"}
                          data-testid={`badge-twilio-status-${i}`}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.phone}</TableCell>
                      <TableCell className="text-right">{row.calls}</TableCell>
                      <TableCell className="text-right">{row.sms}</TableCell>
                      <TableCell>
                        <span className={`h-2 w-2 rounded-full inline-block ${row.ai ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent SMS Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSms.map((sms, i) => (
                  <div key={i} className="space-y-1" data-testid={`sms-activity-${i}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{sms.from}</span>
                      <span className="text-xs text-muted-foreground">{sms.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{sms.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4" data-testid="text-section-config">Twilio Configuration Overview</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Voice Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {voiceFeatures.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">SMS Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {smsFeatures.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Security & Config</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {securityConfig.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
