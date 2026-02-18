import { Phone, MessageSquare, PhoneCall, MessageCircle, CheckCircle, AlertCircle, Search, Filter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin-layout";

const twilioStats = [
  { label: "Total Voice Calls", value: "1,293", change: "+87 this week", icon: PhoneCall },
  { label: "SMS Sent", value: "3,847", change: "+312 this week", icon: MessageCircle },
  { label: "Twilio Connected", value: "38", change: "of 47 clients", icon: CheckCircle },
  { label: "Leads via Phone", value: "456", change: "+34 this week", icon: Phone },
];

const clientTwilioStatus = [
  { id: 1, name: "Acme Digital", connected: true, phoneNumber: "+1 (555) 123-4567", voiceCalls: 156, smsSent: 423, aiProvider: "OpenAI", plan: "Complete Solution" },
  { id: 2, name: "Dragon Media", connected: true, phoneNumber: "+1 (555) 234-5678", voiceCalls: 98, smsSent: 287, aiProvider: "Anthropic", plan: "Professional" },
  { id: 3, name: "Coastal SEO", connected: false, phoneNumber: "-", voiceCalls: 0, smsSent: 0, aiProvider: "None", plan: "Complete Solution" },
  { id: 4, name: "Summit Marketing", connected: true, phoneNumber: "+1 (555) 345-6789", voiceCalls: 134, smsSent: 398, aiProvider: "OpenAI", plan: "Complete Solution" },
  { id: 5, name: "Metro Creative", connected: true, phoneNumber: "+1 (555) 456-7890", voiceCalls: 67, smsSent: 189, aiProvider: "Google AI", plan: "Professional" },
  { id: 6, name: "Sakura Digital", connected: true, phoneNumber: "+1 (555) 567-8901", voiceCalls: 45, smsSent: 134, aiProvider: "OpenAI", plan: "Complete Solution" },
  { id: 7, name: "Rustic Creative", connected: false, phoneNumber: "-", voiceCalls: 0, smsSent: 0, aiProvider: "None", plan: "Professional" },
];

const recentSms = [
  { id: 1, client: "Acme Digital", to: "+1 (555) 111-2222", type: "Confirmation", status: "Delivered", time: "2 mins ago" },
  { id: 2, client: "Summit Marketing", to: "+1 (555) 333-4444", type: "Reminder", status: "Delivered", time: "15 mins ago" },
  { id: 3, client: "Metro Creative", to: "+1 (555) 555-6666", type: "Confirmation", status: "Delivered", time: "32 mins ago" },
  { id: 4, client: "Dragon Media", to: "+1 (555) 777-8888", type: "Cancellation", status: "Delivered", time: "1 hour ago" },
  { id: 5, client: "Sakura Digital", to: "+1 (555) 999-0000", type: "Confirmation", status: "Failed", time: "2 hours ago" },
];

export default function AdminTwilio() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-admin-twilio-title">Twilio Management</h1>
        <p className="text-muted-foreground">Monitor voice calls, SMS messaging, and Twilio connections across all clients</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {twilioStats.map((stat) => (
          <Card key={stat.label} data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Twilio Status</CardTitle>
            <CardDescription>Connection status and usage per client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-9" data-testid="input-search-twilio-clients" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Client</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Phone</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Calls</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">SMS</th>
                    <th className="pb-3 font-medium text-muted-foreground">AI</th>
                  </tr>
                </thead>
                <tbody>
                  {clientTwilioStatus.map((client) => (
                    <tr key={client.id} className="border-b last:border-0" data-testid={`row-twilio-client-${client.id}`}>
                      <td className="py-3">
                        <span className="font-medium text-sm">{client.name}</span>
                      </td>
                      <td className="py-3">
                        {client.connected ? (
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30" data-testid={`badge-connected-${client.id}`}>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground" data-testid={`badge-disconnected-${client.id}`}>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Not Set Up
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{client.phoneNumber}</td>
                      <td className="py-3 text-sm text-right">{client.voiceCalls}</td>
                      <td className="py-3 text-sm text-right">{client.smsSent}</td>
                      <td className="py-3">
                        <Badge variant="secondary" className="text-xs">{client.aiProvider}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent SMS Activity</CardTitle>
            <CardDescription>Latest SMS messages sent across all clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSms.map((sms) => (
                <div key={sms.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`row-sms-${sms.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{sms.client}</p>
                      <p className="text-xs text-muted-foreground">To: {sms.to}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{sms.type}</Badge>
                      <Badge
                        variant="outline"
                        className={sms.status === "Delivered"
                          ? "text-green-600 dark:text-green-400 border-green-500/30 text-xs"
                          : "text-red-600 dark:text-red-400 border-red-500/30 text-xs"
                        }
                      >
                        {sms.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{sms.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Twilio Configuration Overview</CardTitle>
          <CardDescription>Platform-wide Twilio settings and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-primary" />
                Voice Features
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> AI phone assistant (multi-provider)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Speech recognition & TwiML</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Phone inquiry tracking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Call logging & transcripts</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Configurable voice persona</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                SMS Features
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Lead confirmations</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Follow-up reminders</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Notification messages</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Client self-service (CONFIRM/CANCEL/STATUS)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Custom SMS templates</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Security & Config
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Twilio signature validation</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Workspace-level authorization</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Auto webhook configuration</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Client BYOK support</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Per-workspace Twilio credentials</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
