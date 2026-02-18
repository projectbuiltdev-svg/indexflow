import { DollarSign, TrendingUp, CreditCard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

const stats = [
  { label: "Monthly Revenue", value: "$12,857", change: "+12%", icon: DollarSign },
  { label: "Active Subscriptions", value: "43", change: "+3", icon: CreditCard },
  { label: "Avg. Revenue/Client", value: "$299", change: "+5%", icon: TrendingUp },
];

const recentTransactions = [
  { id: 1, client: "Acme Digital", amount: "$299.00", type: "Subscription", status: "Paid", date: "Jan 28, 2026" },
  { id: 2, client: "Dragon Media", amount: "$149.00", type: "Subscription", status: "Paid", date: "Jan 28, 2026" },
  { id: 3, client: "Coastal SEO", amount: "$499.00", type: "Setup Fee", status: "Paid", date: "Jan 24, 2026" },
  { id: 4, client: "Summit Marketing", amount: "$299.00", type: "Subscription", status: "Paid", date: "Jan 25, 2026" },
  { id: 5, client: "Metro Creative", amount: "$149.00", type: "Subscription", status: "Failed", date: "Jan 27, 2026" },
];

export default function AdminBilling() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Revenue and payment management</p>
        </div>
        <Button variant="outline" data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
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
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest billing activity across all clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{tx.client}</td>
                    <td className="py-4">{tx.amount}</td>
                    <td className="py-4 text-muted-foreground">{tx.type}</td>
                    <td className="py-4">
                      <Badge variant={tx.status === "Paid" ? "default" : "destructive"}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground">{tx.date}</td>
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
