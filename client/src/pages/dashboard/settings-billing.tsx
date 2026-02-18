import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Calendar, TrendingUp } from "lucide-react";

const mockInvoices = [
  { id: 1, date: "Feb 1, 2026", amount: "$99.00", status: "paid", plan: "Pro" },
  { id: 2, date: "Jan 1, 2026", amount: "$99.00", status: "paid", plan: "Pro" },
  { id: 3, date: "Dec 1, 2025", amount: "$49.00", status: "paid", plan: "Starter" },
  { id: 4, date: "Nov 1, 2025", amount: "$49.00", status: "paid", plan: "Starter" },
];

export default function SettingsBilling() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Billing & Usage</h1>
          <p className="text-muted-foreground">Manage your subscription and view usage</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-plan">Pro</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Current Plan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-monthly-cost">$99/mo</p>
                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-next-billing">Mar 1, 2026</p>
                  <p className="text-xs text-muted-foreground">Next Billing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-usage">68%</p>
                  <p className="text-xs text-muted-foreground">Usage This Period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Your current subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Plan", value: "Pro" },
                  { label: "Workspaces", value: "5 / 10" },
                  { label: "Team Members", value: "4 / 15" },
                  { label: "AI Conversations", value: "680 / 1,000" },
                  { label: "Storage", value: "2.4 GB / 10 GB" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium" data-testid={`text-plan-detail-${i}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4" data-testid="button-upgrade-plan">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-billing-${inv.id}`}>
                    <div>
                      <p className="font-medium text-sm">{inv.date}</p>
                      <p className="text-xs text-muted-foreground">{inv.plan} Plan</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{inv.amount}</span>
                      <Badge variant="default" className="text-xs">{inv.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
