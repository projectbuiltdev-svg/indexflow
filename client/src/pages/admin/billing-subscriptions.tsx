import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Users, TrendingUp, Package } from "lucide-react";

const stats = [
  { label: "Active Subscriptions", value: "43", icon: CreditCard },
  { label: "Enterprise Plans", value: "8", icon: Package },
  { label: "Monthly Revenue", value: "$12,857", icon: TrendingUp },
  { label: "Total Seats", value: "187", icon: Users },
];

const subscriptions = [
  { agency: "Hospitality Group NYC", plan: "Enterprise", mrr: "$890", seats: 23, status: "Active", renewal: "Mar 1, 2026" },
  { agency: "Alpine Hotels Ltd.", plan: "Enterprise", mrr: "$890", seats: 34, status: "Active", renewal: "Mar 5, 2026" },
  { agency: "Coastal Dining Co.", plan: "Professional", mrr: "$490", seats: 12, status: "Active", renewal: "Mar 8, 2026" },
  { agency: "Pacific Venues Inc.", plan: "Professional", mrr: "$490", seats: 18, status: "Past Due", renewal: "Feb 15, 2026" },
  { agency: "Metro Bistro Group", plan: "Starter", mrr: "$190", seats: 8, status: "Active", renewal: "Mar 12, 2026" },
  { agency: "Urban Eats Network", plan: "Starter", mrr: "$190", seats: 5, status: "Trial", renewal: "Mar 1, 2026" },
];

export default function AdminBillingSubscriptions() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Subscriptions</h1>
        <p className="text-muted-foreground">Manage all agency subscription plans and billing</p>
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
          <CardTitle>Subscription List</CardTitle>
          <CardDescription>All active and pending subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.agency} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-subscription-${sub.agency.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{sub.agency}</p>
                  <p className="text-sm text-muted-foreground">{sub.plan} &middot; {sub.mrr}/mo &middot; {sub.seats} seats &middot; Renews {sub.renewal}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={sub.status === "Active" ? "default" : sub.status === "Past Due" ? "destructive" : "secondary"}>{sub.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-manage-${sub.agency.toLowerCase().replace(/\s+/g, "-")}`}>Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
