import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, Clock, CheckCircle } from "lucide-react";

const stats = [
  { label: "Total Payouts", value: "$48,230", icon: Wallet },
  { label: "This Month", value: "$8,420", icon: ArrowUpRight },
  { label: "Pending", value: "$2,180", icon: Clock },
  { label: "Completed", value: "142", icon: CheckCircle },
];

const payouts = [
  { id: "PAY-0089", recipient: "Stripe Connect - Platform", amount: "$4,210.00", date: "Feb 15, 2026", status: "Completed" },
  { id: "PAY-0088", recipient: "Infrastructure Costs", amount: "$1,840.00", date: "Feb 10, 2026", status: "Completed" },
  { id: "PAY-0087", recipient: "DataForSEO API", amount: "$284.50", date: "Feb 8, 2026", status: "Completed" },
  { id: "PAY-0086", recipient: "Twilio Services", amount: "$412.30", date: "Feb 5, 2026", status: "Completed" },
  { id: "PAY-0085", recipient: "OpenAI API Usage", amount: "$1,673.20", date: "Feb 3, 2026", status: "Pending" },
];

export default function AdminBillingPayouts() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Payouts</h1>
        <p className="text-muted-foreground">Platform payout history and pending disbursements</p>
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
          <CardTitle>Payout History</CardTitle>
          <CardDescription>Recent platform payouts and disbursements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-payout-${payout.id}`}>
                <div className="min-w-0">
                  <p className="font-medium">{payout.recipient}</p>
                  <p className="text-sm text-muted-foreground">{payout.id} &middot; {payout.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{payout.amount}</span>
                  <Badge variant={payout.status === "Completed" ? "default" : "secondary"}>{payout.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-payout-${payout.id}`}>Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
