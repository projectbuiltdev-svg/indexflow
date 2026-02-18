import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const stats = [
  { label: "Total Revenue", value: "$177,000", icon: DollarSign },
  { label: "This Month", value: "$14,750", icon: TrendingUp },
  { label: "Growth", value: "+15.3%", icon: ArrowUpRight },
  { label: "Avg Revenue Per Agency", value: "$3,765", icon: BarChart3 },
];

const monthlyRevenue = [
  { month: "Mar", revenue: 10200 },
  { month: "Apr", revenue: 11400 },
  { month: "May", revenue: 12100 },
  { month: "Jun", revenue: 11800 },
  { month: "Jul", revenue: 13200 },
  { month: "Aug", revenue: 13900 },
  { month: "Sep", revenue: 14100 },
  { month: "Oct", revenue: 14800 },
  { month: "Nov", revenue: 13600 },
  { month: "Dec", revenue: 15200 },
  { month: "Jan", revenue: 14500 },
  { month: "Feb", revenue: 14750 },
];

const planRevenue = [
  { month: "Sep", starter: 2800, professional: 6200, enterprise: 5100 },
  { month: "Oct", starter: 3000, professional: 6500, enterprise: 5300 },
  { month: "Nov", starter: 2600, professional: 5800, enterprise: 5200 },
  { month: "Dec", starter: 3200, professional: 6800, enterprise: 5200 },
  { month: "Jan", starter: 2900, professional: 6400, enterprise: 5200 },
  { month: "Feb", starter: 3100, professional: 6500, enterprise: 5150 },
];

const churnData = [
  { month: "Sep", newRevenue: 2100, churnedRevenue: -800 },
  { month: "Oct", newRevenue: 1800, churnedRevenue: -600 },
  { month: "Nov", newRevenue: 1500, churnedRevenue: -1200 },
  { month: "Dec", newRevenue: 2400, churnedRevenue: -700 },
  { month: "Jan", newRevenue: 1900, churnedRevenue: -900 },
  { month: "Feb", newRevenue: 2200, churnedRevenue: -500 },
];

export default function AdminBillingRevenue() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Revenue</h1>
        <p className="text-sm text-muted-foreground">Revenue tracking and forecasting</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Revenue (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-monthly-revenue">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-plan-revenue">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="starter" stackId="a" fill="hsl(var(--muted-foreground))" name="Starter" />
                  <Bar dataKey="professional" stackId="a" fill="hsl(var(--primary))" name="Professional" />
                  <Bar dataKey="enterprise" stackId="a" fill="hsl(var(--chart-3, 150 60% 40%))" name="Enterprise" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New vs Churned Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-churn-revenue">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newRevenue" fill="hsl(var(--primary))" name="New Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churnedRevenue" fill="hsl(var(--destructive))" name="Churned Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}