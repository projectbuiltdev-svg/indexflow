import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download, DollarSign, Clock } from "lucide-react";

const mockInvoices = [
  { id: "INV-2026-005", date: "2026-02-01", amount: 299.00, status: "paid", service: "SEO Monthly Plan" },
  { id: "INV-2026-004", date: "2026-01-15", amount: 150.00, status: "paid", service: "Backlink Audit" },
  { id: "INV-2026-003", date: "2026-01-01", amount: 299.00, status: "paid", service: "SEO Monthly Plan" },
  { id: "INV-2025-012", date: "2025-12-01", amount: 299.00, status: "paid", service: "SEO Monthly Plan" },
  { id: "INV-2026-006", date: "2026-03-01", amount: 299.00, status: "pending", service: "SEO Monthly Plan" },
];

export default function SeoInvoices() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">SEO Invoices</h1>
          <p className="text-muted-foreground">View and download invoices for SEO services</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-invoices">5</p>
                  <p className="text-xs text-muted-foreground">Total Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-paid">$1,346</p>
                  <p className="text-xs text-muted-foreground">Total Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-pending-amount">$299</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>All invoices for your SEO services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-invoice-${inv.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.service} - {inv.date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold">${inv.amount.toFixed(2)}</span>
                    <Badge variant={inv.status === "paid" ? "default" : "secondary"} className="text-xs">
                      {inv.status}
                    </Badge>
                    <Button variant="outline" size="sm" data-testid={`button-download-invoice-${inv.id}`}>
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
