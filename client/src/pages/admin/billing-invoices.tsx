import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

const stats = [
  { label: "Total Invoices", value: "312", icon: FileText },
  { label: "Paid This Month", value: "$12,450", icon: DollarSign },
  { label: "Outstanding", value: "$1,870", icon: AlertCircle },
  { label: "Collected Rate", value: "96.8%", icon: CheckCircle },
];

const invoices = [
  { id: "INV-2026-0287", agency: "Hospitality Group NYC", amount: "$890.00", date: "Feb 1, 2026", status: "Paid" },
  { id: "INV-2026-0286", agency: "Alpine Hotels Ltd.", amount: "$890.00", date: "Feb 1, 2026", status: "Paid" },
  { id: "INV-2026-0285", agency: "Coastal Dining Co.", amount: "$490.00", date: "Feb 1, 2026", status: "Paid" },
  { id: "INV-2026-0284", agency: "Pacific Venues Inc.", amount: "$490.00", date: "Feb 1, 2026", status: "Overdue" },
  { id: "INV-2026-0283", agency: "Metro Bistro Group", amount: "$190.00", date: "Feb 1, 2026", status: "Paid" },
  { id: "INV-2026-0282", agency: "Urban Eats Network", amount: "$0.00", date: "Feb 1, 2026", status: "Trial" },
];

export default function AdminBillingInvoices() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform Invoices</h1>
        <p className="text-muted-foreground">All invoices generated across the platform</p>
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
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Latest invoices across all agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-invoice-${inv.id}`}>
                <div className="min-w-0">
                  <p className="font-medium">{inv.id}</p>
                  <p className="text-sm text-muted-foreground">{inv.agency} &middot; {inv.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{inv.amount}</span>
                  <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Overdue" ? "destructive" : "secondary"}>{inv.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-invoice-${inv.id}`}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
