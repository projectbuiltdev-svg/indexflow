import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react";

const stats = [
  { label: "Monthly Revenue", value: "$12,857", icon: DollarSign },
  { label: "Annual Run Rate", value: "$154,284", icon: TrendingUp },
  { label: "Growth (MoM)", value: "+8.3%", icon: ArrowUpRight },
  { label: "Avg. Revenue/Agency", value: "$536", icon: BarChart3 },
];

const monthlyData = [
  { month: "Sep 2025", revenue: "$9,420", agencies: 18, newMrr: "$1,230" },
  { month: "Oct 2025", revenue: "$10,180", agencies: 19, newMrr: "$760" },
  { month: "Nov 2025", revenue: "$10,890", agencies: 20, newMrr: "$710" },
  { month: "Dec 2025", revenue: "$11,340", agencies: 21, newMrr: "$450" },
  { month: "Jan 2026", revenue: "$11,870", agencies: 22, newMrr: "$530" },
  { month: "Feb 2026", revenue: "$12,857", agencies: 24, newMrr: "$987" },
];

export default function AdminBillingRevenue() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Revenue</h1>
        <p className="text-muted-foreground">Platform revenue metrics and growth trends</p>
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
          <CardTitle>Monthly Revenue Breakdown</CardTitle>
          <CardDescription>Revenue trend over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((row) => (
              <div key={row.month} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-revenue-${row.month.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{row.month}</p>
                  <p className="text-sm text-muted-foreground">{row.agencies} agencies</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-right">
                    <p className="font-medium">{row.revenue}</p>
                    <p className="text-sm text-muted-foreground">+{row.newMrr} new</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
