import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, DollarSign, Activity } from "lucide-react";

const stats = [
  { label: "Phone Numbers", value: "28", icon: Phone },
  { label: "SMS Sent (Month)", value: "3,847", icon: MessageSquare },
  { label: "Voice Minutes", value: "1,293", icon: Activity },
  { label: "Monthly Cost", value: "$412.30", icon: DollarSign },
];

const phoneNumbers = [
  { number: "+1 (212) 555-0142", agency: "Hospitality Group NYC", type: "Voice + SMS", status: "Active", calls: 234 },
  { number: "+1 (415) 555-0198", agency: "Coastal Dining Co.", type: "Voice + SMS", status: "Active", calls: 156 },
  { number: "+41 44 555 0173", agency: "Alpine Hotels Ltd.", type: "Voice", status: "Active", calls: 89 },
  { number: "+1 (646) 555-0234", agency: "Metro Bistro Group", type: "SMS Only", status: "Active", calls: 0 },
  { number: "+1 (310) 555-0167", agency: "Pacific Venues Inc.", type: "Voice + SMS", status: "Suspended", calls: 0 },
];

export default function AdminSystemTwilio() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform Twilio</h1>
        <p className="text-muted-foreground">Twilio configuration and phone number management</p>
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
          <CardTitle>Phone Numbers</CardTitle>
          <CardDescription>All Twilio phone numbers assigned to agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phoneNumbers.map((phone) => (
              <div key={phone.number} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-phone-${phone.number.replace(/\D/g, "")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{phone.number}</p>
                  <p className="text-sm text-muted-foreground">{phone.agency} &middot; {phone.type} &middot; {phone.calls} calls this month</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={phone.status === "Active" ? "default" : "destructive"}>{phone.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-manage-phone-${phone.number.replace(/\D/g, "")}`}>Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
