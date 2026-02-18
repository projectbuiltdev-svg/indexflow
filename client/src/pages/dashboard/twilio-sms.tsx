import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, CheckCircle, Clock } from "lucide-react";

const mockMessages = [
  { id: 1, to: "+1 (555) 123-4567", message: "Your reservation for 2 at 7:00 PM is confirmed.", type: "confirmation", status: "delivered", date: "2026-02-18 14:30" },
  { id: 2, to: "+1 (555) 234-5678", message: "Reminder: Your reservation is tomorrow at 8:00 PM.", type: "reminder", status: "delivered", date: "2026-02-18 10:00" },
  { id: 3, to: "+1 (555) 345-6789", message: "Your table is ready! Please proceed to the host stand.", type: "notification", status: "delivered", date: "2026-02-17 19:15" },
  { id: 4, to: "+1 (555) 456-7890", message: "Thank you for dining with us! We'd love your feedback.", type: "follow-up", status: "pending", date: "2026-02-17 21:00" },
];

export default function TwilioSms() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">SMS Settings</h1>
            <p className="text-muted-foreground">Configure SMS notifications and view message history</p>
          </div>
          <Button data-testid="button-send-sms">
            <Send className="w-4 h-4 mr-2" />
            Send SMS
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-messages">4</p>
                  <p className="text-xs text-muted-foreground">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-delivered">3</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-pending-sms">1</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-sms-status">Active</Badge>
                  <p className="text-xs text-muted-foreground mt-1">SMS Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>Recent SMS messages sent from your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-sms-${msg.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">To: {msg.to}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                    <p className="text-xs text-muted-foreground">{msg.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{msg.type}</Badge>
                    <Badge variant={msg.status === "delivered" ? "default" : "secondary"} className="text-xs">
                      {msg.status}
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
