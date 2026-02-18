import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, ShieldCheck } from "lucide-react";

const paymentProviders = [
  { id: "stripe", name: "Stripe", status: "connected", processed: "$12,450.00", transactions: 89, mode: "Live" },
  { id: "paypal", name: "PayPal", status: "disconnected", processed: "$0.00", transactions: 0, mode: "-" },
];

export default function ConnectionsPayments() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Payment Connections</h1>
          <p className="text-muted-foreground">Manage payment gateway integrations</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-gateways">2</p>
                  <p className="text-xs text-muted-foreground">Payment Gateways</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-processed">$12,450</p>
                  <p className="text-xs text-muted-foreground">Total Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-transactions">89</p>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateways</CardTitle>
            <CardDescription>Connect Stripe or PayPal to accept payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {paymentProviders.map((provider) => (
                <Card key={provider.id} data-testid={`card-payment-${provider.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold">{provider.name}</h3>
                      </div>
                      <Badge variant={provider.status === "connected" ? "default" : "secondary"} className="text-xs">
                        {provider.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <p>Processed: {provider.processed}</p>
                      <p>Transactions: {provider.transactions}</p>
                      {provider.mode !== "-" && <p>Mode: {provider.mode}</p>}
                    </div>
                    <Button
                      variant={provider.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      data-testid={`button-payment-${provider.id}`}
                    >
                      {provider.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
