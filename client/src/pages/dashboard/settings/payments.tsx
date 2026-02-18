import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, CheckCircle, AlertCircle, DollarSign, Shield } from "lucide-react";
import { SiStripe, SiPaypal } from "react-icons/si";

interface PaymentSettings {
  id: number;
  workspaceId: string;
  stripePublishableKey: string | null;
  stripeSecretKey: string | null;
  stripeWebhookSecret: string | null;
  stripeConnected: boolean;
  paypalClientId: string | null;
  paypalClientSecret: string | null;
  paypalConnected: boolean;
}

export default function SettingsPayments() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();

  const [stripePk, setStripePk] = useState("");
  const [stripeSk, setStripeSk] = useState("");
  const [stripeWebhook, setStripeWebhook] = useState("");
  const [stripeConnected, setStripeConnected] = useState(false);
  const [paypalClient, setPaypalClient] = useState("");
  const [paypalSecret, setPaypalSecret] = useState("");
  const [paypalConnected, setPaypalConnected] = useState(false);

  const { data: settings } = useQuery<PaymentSettings>({
    queryKey: ["/api/workspaces", workspaceId, "payment-settings"],
  });

  useEffect(() => {
    document.title = "Payments - Settings | indexFlow Dashboard";
  }, []);

  useEffect(() => {
    if (settings) {
      setStripePk(settings.stripePublishableKey || "");
      setStripeSk(settings.stripeSecretKey || "");
      setStripeWebhook(settings.stripeWebhookSecret || "");
      setStripeConnected(settings.stripeConnected || false);
      setPaypalClient(settings.paypalClientId || "");
      setPaypalSecret(settings.paypalClientSecret || "");
      setPaypalConnected(settings.paypalConnected || false);
    }
  }, [settings]);

  const stripeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", `/api/workspaces/${workspaceId}/payment-settings`, {
        stripePublishableKey: stripePk || null,
        stripeSecretKey: stripeSk || null,
        stripeWebhookSecret: stripeWebhook || null,
        stripeConnected: !!(stripePk && stripeSk),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "payment-settings"] });
      toast({ title: "Stripe settings saved", description: "Your Stripe credentials have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const paypalMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", `/api/workspaces/${workspaceId}/payment-settings`, {
        paypalClientId: paypalClient || null,
        paypalClientSecret: paypalSecret || null,
        paypalConnected: !!(paypalClient && paypalSecret),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "payment-settings"] });
      toast({ title: "PayPal settings saved", description: "Your PayPal credentials have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Integration</h1>
          <p className="text-muted-foreground">Connect your payment provider for pre-paid services</p>
        </div>

        <Tabs defaultValue="stripe" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe" className="gap-2" data-testid="tab-stripe">
              <SiStripe className="w-4 h-4" />
              Stripe
            </TabsTrigger>
            <TabsTrigger value="paypal" className="gap-2" data-testid="tab-paypal">
              <SiPaypal className="w-4 h-4" />
              PayPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <SiStripe className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>Stripe API Credentials</CardTitle>
                    <CardDescription>Connect your Stripe account for payment processing</CardDescription>
                  </div>
                  {stripeConnected ? (
                    <Badge variant="outline" className="ml-auto" data-testid="status-stripe">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto" data-testid="status-stripe">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-pk">Publishable Key</Label>
                  <Input
                    id="stripe-pk"
                    placeholder="pk_live_..."
                    data-testid="input-stripe-pk"
                    value={stripePk}
                    onChange={(e) => setStripePk(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-sk">Secret Key</Label>
                  <Input
                    id="stripe-sk"
                    type="password"
                    placeholder="sk_live_..."
                    data-testid="input-stripe-sk"
                    value={stripeSk}
                    onChange={(e) => setStripeSk(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                  <Input
                    id="stripe-webhook"
                    type="password"
                    placeholder="whsec_..."
                    data-testid="input-stripe-webhook"
                    value={stripeWebhook}
                    onChange={(e) => setStripeWebhook(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  data-testid="button-save-stripe"
                  onClick={() => stripeMutation.mutate()}
                  disabled={stripeMutation.isPending}
                >
                  {stripeMutation.isPending ? "Saving..." : "Connect Stripe Account"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <SiPaypal className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>PayPal API Credentials</CardTitle>
                    <CardDescription>Connect your PayPal account for payment processing</CardDescription>
                  </div>
                  {paypalConnected ? (
                    <Badge variant="outline" className="ml-auto" data-testid="status-paypal">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto" data-testid="status-paypal">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paypal-client">Client ID</Label>
                  <Input
                    id="paypal-client"
                    placeholder="Your PayPal Client ID"
                    data-testid="input-paypal-client"
                    value={paypalClient}
                    onChange={(e) => setPaypalClient(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-secret">Client Secret</Label>
                  <Input
                    id="paypal-secret"
                    type="password"
                    placeholder="Your PayPal Client Secret"
                    data-testid="input-paypal-secret"
                    value={paypalSecret}
                    onChange={(e) => setPaypalSecret(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  data-testid="button-save-paypal"
                  onClick={() => paypalMutation.mutate()}
                  disabled={paypalMutation.isPending}
                >
                  {paypalMutation.isPending ? "Saving..." : "Connect PayPal Account"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>What Payment Integration Powers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Pre-paid services</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Deposit collection for appointments</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cancellation protection</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Automatic refunds for cancellations</li>
              <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> PCI-compliant payment handling</li>
              <li className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Direct deposits to your bank account</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Banking Connection</p>
                <p className="text-sm text-muted-foreground">
                  Payments collected through Stripe or PayPal are deposited directly to your connected bank account. 
                  Configure your banking details in your payment provider's dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
