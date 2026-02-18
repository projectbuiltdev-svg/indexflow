import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, DollarSign } from "lucide-react";

const stats = [
  { label: "Pending Payouts", value: "$8,500", icon: Clock },
  { label: "Paid This Month", value: "$23,400", icon: DollarSign },
];

const payouts = [
  { agency: "Blue Digital Agency", amount: "$2,400.00", period: "Jan 2026", status: "Paid", requested: "Feb 1, 2026", paid: "Feb 5, 2026" },
  { agency: "Northstar Media", amount: "$3,100.00", period: "Jan 2026", status: "Paid", requested: "Feb 1, 2026", paid: "Feb 4, 2026" },
  { agency: "Cascade Creative", amount: "$1,800.00", period: "Jan 2026", status: "Pending", requested: "Feb 10, 2026", paid: "-" },
  { agency: "Vertex Solutions", amount: "$4,200.00", period: "Jan 2026", status: "Pending", requested: "Feb 12, 2026", paid: "-" },
  { agency: "Lunar Labs", amount: "$2,500.00", period: "Jan 2026", status: "Rejected", requested: "Feb 8, 2026", paid: "-" },
];

export default function AdminBillingPayouts() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Payouts</h1>
        <p className="text-sm text-muted-foreground">Payment processor payouts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p, i) => (
                <TableRow key={i} data-testid={`row-payout-${i}`}>
                  <TableCell className="font-medium">{p.agency}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{p.period}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "Paid" ? "default" : p.status === "Pending" ? "outline" : "destructive"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.requested}</TableCell>
                  <TableCell className="text-muted-foreground">{p.paid}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" data-testid={`button-approve-payout-${i}`}>Approve</Button>
                      <Button variant="destructive" size="sm" data-testid={`button-reject-payout-${i}`}>Reject</Button>
                      <Button variant="outline" size="sm" data-testid={`button-view-payout-${i}`}>View Details</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}