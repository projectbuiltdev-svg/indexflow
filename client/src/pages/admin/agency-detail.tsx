import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, CreditCard, Globe } from "lucide-react";

const stats = [
  { label: "Workspaces", value: "14", icon: Globe },
  { label: "Team Members", value: "23", icon: Users },
  { label: "Monthly Spend", value: "$2,450", icon: CreditCard },
  { label: "Active Since", value: "Mar 2025", icon: Building2 },
];

export default function AdminAgencyDetail() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Agency Detail</h1>
        <p className="text-muted-foreground">Detailed view of agency account and activity</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspaces</CardTitle>
            <CardDescription>Workspaces managed by this agency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Acme Digital", "Dragon Media", "Coastal SEO", "Pinnacle Digital"].map((name) => (
                <div key={name} className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-medium">{name}</span>
                  <Badge variant="default">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Users with access to this agency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", role: "Owner", email: "sarah@digitalgrowth.com" },
                { name: "Tom Bradley", role: "Admin", email: "tom@digitalgrowth.com" },
                { name: "Amy Liu", role: "Editor", email: "amy@digitalgrowth.com" },
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Billing Summary</CardTitle>
            <CardDescription>Current subscription and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-muted-foreground">Plan</span>
                <Badge>Enterprise</Badge>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-muted-foreground">Monthly Total</span>
                <span className="font-medium">$2,450.00</span>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-muted-foreground">Next Invoice</span>
                <span className="font-medium">Mar 1, 2026</span>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">Visa ending 4242</span>
              </div>
              <Button variant="outline" className="w-full mt-2" data-testid="button-view-full-billing">View Full Billing History</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
