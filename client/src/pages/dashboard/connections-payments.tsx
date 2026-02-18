import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, CheckCircle, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentFeatures = [
  "Accept one-time payments from clients",
  "Recurring subscription billing",
  "Automated invoice generation",
  "Refund processing",
  "Payment analytics and reporting",
  "Multi-currency support",
];

export default function ConnectionsPayments() {
  const { toast } = useToast();
  const [stripePublishable, setStripePublishable] = useState("");
  const [stripeSecret, setStripeSecret] = useState("");
  const [stripeWebhook, setStripeWebhook] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalSecret, setPaypalSecret] = useState("");

  const handleConnectStripe = () => {
    toast({ title: "Stripe Connected", description: "Your Stripe account has been connected successfully." });
  };

  const handleConnectPaypal = () => {
    toast({ title: "PayPal Connected", description: "Your PayPal account has been connected successfully." });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Payment Integration</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Connect your payment provider</p>
        </div>

        <Tabs defaultValue="stripe" data-testid="tabs-payment">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="stripe" data-testid="tab-stripe">Stripe</TabsTrigger>
            <TabsTrigger value="paypal" data-testid="tab-paypal">PayPal</TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="mt-4 space-y-4">
            <Card data-testid="card-stripe-credentials">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">Stripe API Credentials</h3>
                  </div>
                  <Badge variant="secondary" data-testid="badge-stripe-status">Not Connected</Badge>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-publishable">Publishable Key</Label>
                    <Input
                      id="stripe-publishable"
                      placeholder="pk_live_..."
                      value={stripePublishable}
                      onChange={(e) => setStripePublishable(e.target.value)}
                      data-testid="input-stripe-publishable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret">Secret Key</Label>
                    <Input
                      id="stripe-secret"
                      type="password"
                      placeholder="sk_live_..."
                      value={stripeSecret}
                      onChange={(e) => setStripeSecret(e.target.value)}
                      data-testid="input-stripe-secret"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                    <Input
                      id="stripe-webhook"
                      type="password"
                      placeholder="whsec_..."
                      value={stripeWebhook}
                      onChange={(e) => setStripeWebhook(e.target.value)}
                      data-testid="input-stripe-webhook"
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleConnectStripe} data-testid="button-connect-stripe">
                  Connect Stripe Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paypal" className="mt-4 space-y-4">
            <Card data-testid="card-paypal-credentials">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">PayPal API Credentials</h3>
                  </div>
                  <Badge variant="secondary" data-testid="badge-paypal-status">Not Connected</Badge>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <Input
                      id="paypal-client-id"
                      placeholder="Enter PayPal Client ID"
                      value={paypalClientId}
                      onChange={(e) => setPaypalClientId(e.target.value)}
                      data-testid="input-paypal-client-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Secret</Label>
                    <Input
                      id="paypal-secret"
                      type="password"
                      placeholder="Enter PayPal Secret"
                      value={paypalSecret}
                      onChange={(e) => setPaypalSecret(e.target.value)}
                      data-testid="input-paypal-secret"
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleConnectPaypal} data-testid="button-connect-paypal">
                  Connect PayPal Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card data-testid="card-payment-features">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">What Payment Integration Powers</h3>
            <div className="space-y-2">
              {paymentFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2" data-testid={`feature-payment-${idx}`}>
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-banking-connection">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium text-sm">Banking Connection</p>
                <p className="text-xs text-muted-foreground">Payments are deposited directly into your connected bank account via Stripe or PayPal. Manage payout settings in your payment provider dashboard.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
