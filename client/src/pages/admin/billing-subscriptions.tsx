import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, TrendingUp, Download } from "lucide-react";

const stats = [
  { label: "Monthly Revenue", value: "$12,857", change: "+12%", subtitle: "from last month", icon: DollarSign },
  { label: "Active Subscriptions", value: "43", change: "+3", subtitle: "from last month", icon: Users },
  { label: "Avg. Revenue/Client", value: "$299", change: "+5%", subtitle: "from last month", icon: TrendingUp },
];

const transactions = [
  { id: 1, client: "Apex Digital Agency", amount: "$299.00", type: "Subscription", status: "Paid", date: "Feb 15, 2026" },
  { id: 2, client: "Greenfield Law Firm", amount: "$499.00", type: "Subscription", status: "Paid", date: "Feb 14, 2026" },
  { id: 3, client: "Jake Morrison SEO", amount: "$149.00", type: "Add-on", status: "Paid", date: "Feb 14, 2026" },
  { id: 4, client: "BrightPath Marketing", amount: "$299.00", type: "Subscription", status: "Failed", date: "Feb 13, 2026" },
  { id: 5, client: "Meridian Hotels Group", amount: "$199.00", type: "Subscription", status: "Paid", date: "Feb 12, 2026" },
  { id: 6, client: "Summit Growth Partners", amount: "$299.00", type: "Subscription", status: "Paid", date: "Feb 11, 2026" },
];

export default function AdminBillingSubscriptions() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Billing</h1>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Revenue and payment management</p>
          </div>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-600">{stat.change}</span> {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold" data-testid="text-section-transactions">Recent Transactions</h2>
          <p className="text-sm text-muted-foreground">Latest billing activity across all clients</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                    <TableCell className="font-medium">{tx.client}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={tx.status === "Paid" ? "text-emerald-600 border-emerald-500/30" : "text-red-500 border-red-500/30"}
                        data-testid={`badge-status-${tx.id}`}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
