import { Phone, Play, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

const calls = [
  { id: 1, client: "Acme Digital", caller: "+1 (555) 123-4567", duration: "2:34", outcome: "Lead Captured", type: "Voice", smsSent: true, date: "Jan 28, 2026 3:45 PM" },
  { id: 2, client: "Dragon Media", caller: "+1 (555) 234-5678", duration: "1:12", outcome: "Info Request", type: "Voice", smsSent: false, date: "Jan 28, 2026 2:30 PM" },
  { id: 3, client: "Summit Marketing", caller: "+1 (555) 345-6789", duration: "4:56", outcome: "Lead Captured", type: "Voice", smsSent: true, date: "Jan 28, 2026 1:15 PM" },
  { id: 4, client: "Acme Digital", caller: "+1 (555) 456-7890", duration: "0:45", outcome: "Transferred", type: "Voice", smsSent: false, date: "Jan 28, 2026 11:00 AM" },
  { id: 5, client: "Metro Creative", caller: "+1 (555) 567-8901", duration: "3:21", outcome: "Lead Captured", type: "Voice", smsSent: true, date: "Jan 27, 2026 7:30 PM" },
  { id: 6, client: "Acme Digital", caller: "+1 (555) 111-2222", duration: "-", outcome: "Confirmed", type: "SMS", smsSent: false, date: "Jan 28, 2026 4:00 PM" },
  { id: 7, client: "Summit Marketing", caller: "+1 (555) 333-4444", duration: "-", outcome: "Cancelled", type: "SMS", smsSent: false, date: "Jan 28, 2026 3:30 PM" },
];

export default function AdminCalls() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Call & SMS Logs</h1>
          <p className="text-sm text-muted-foreground">AI voice call and SMS history across all clients</p>
        </div>
        <Button variant="outline" data-testid="button-export-calls">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>All AI-handled phone calls and SMS interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground">Phone</th>
                  <th className="pb-3 font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Duration</th>
                  <th className="pb-3 font-medium text-muted-foreground">Outcome</th>
                  <th className="pb-3 font-medium text-muted-foreground">SMS</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={call.id} className="border-b last:border-0" data-testid={`row-call-${call.id}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {call.type === "Voice" ? (
                            <Phone className="h-4 w-4 text-primary" />
                          ) : (
                            <MessageCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="font-medium">{call.client}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{call.caller}</td>
                    <td className="py-4">
                      <Badge variant={call.type === "Voice" ? "default" : "secondary"}>
                        {call.type}
                      </Badge>
                    </td>
                    <td className="py-4">{call.duration}</td>
                    <td className="py-4">
                      <Badge variant={call.outcome === "Lead Captured" ? "default" : "secondary"}>
                        {call.outcome}
                      </Badge>
                    </td>
                    <td className="py-4">
                      {call.type === "Voice" && call.smsSent && (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                          Sent
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 text-muted-foreground">{call.date}</td>
                    <td className="py-4">
                      {call.type === "Voice" && (
                        <Button variant="ghost" size="icon" data-testid={`button-play-${call.id}`}>
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
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
