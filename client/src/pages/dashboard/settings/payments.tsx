import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Save } from "lucide-react";

export default function SettingsPayments() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<any>({
    queryKey: ["/api/payment-settings", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/payment-settings?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const [form, setForm] = useState({
    stripeSecretKey: "",
    stripePublishableKey: "",
    paypalClientId: "",
    paypalClientSecret: "",
    depositAmount: "",
    depositType: "fixed",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        stripeSecretKey: settings.stripeSecretKey || "",
        stripePublishableKey: settings.stripePublishableKey || "",
        paypalClientId: settings.paypalClientId || "",
        paypalClientSecret: settings.paypalClientSecret || "",
        depositAmount: settings.depositAmount || "",
        depositType: settings.depositType || "fixed",
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/api/payment-settings", {
        venueId,
        ...form,
        depositAmount: form.depositAmount || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-settings"] });
      toast({ title: "Payment settings saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Payment Settings</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Payment Settings</h1>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-payments">
          <Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Stripe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Secret Key</Label><Input data-testid="input-stripe-secret" type="password" value={form.stripeSecretKey} onChange={(e) => setForm({ ...form, stripeSecretKey: e.target.value })} /></div>
            <div><Label>Publishable Key</Label><Input data-testid="input-stripe-publishable" value={form.stripePublishableKey} onChange={(e) => setForm({ ...form, stripePublishableKey: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PayPal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Client ID</Label><Input data-testid="input-paypal-client-id" value={form.paypalClientId} onChange={(e) => setForm({ ...form, paypalClientId: e.target.value })} /></div>
            <div><Label>Client Secret</Label><Input data-testid="input-paypal-secret" type="password" value={form.paypalClientSecret} onChange={(e) => setForm({ ...form, paypalClientSecret: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deposit Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Deposit Amount</Label><Input data-testid="input-deposit-amount" type="number" min="0" step="0.01" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })} /></div>
            <div>
              <Label>Deposit Type</Label>
              <Select value={form.depositType} onValueChange={(v) => setForm({ ...form, depositType: v })}>
                <SelectTrigger data-testid="select-deposit-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
