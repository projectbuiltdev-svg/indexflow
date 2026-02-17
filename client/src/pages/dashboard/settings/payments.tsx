import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Save } from "lucide-react";

const paymentFormSchema = z.object({
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  depositAmount: z.string().optional(),
  depositEnabled: z.boolean(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function SettingsPayments() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { stripePublishableKey: "", stripeSecretKey: "", depositAmount: "", depositEnabled: false },
  });

  const { data: settings, isLoading } = useQuery<any>({
    queryKey: [`/api/payment-settings?venueId=${venueId}`],
    enabled: !!venueId,
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        stripePublishableKey: settings.stripePublishableKey || "",
        stripeSecretKey: settings.stripeSecretKey || "",
        depositAmount: settings.depositAmount ? String(settings.depositAmount) : "",
        depositEnabled: !!settings.depositEnabled || !!settings.depositAmount,
      });
    }
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      await apiRequest("PUT", "/api/payment-settings", {
        venueId,
        stripePublishableKey: values.stripePublishableKey || undefined,
        stripeSecretKey: values.stripeSecretKey || undefined,
        depositAmount: values.depositAmount || undefined,
        depositEnabled: values.depositEnabled,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/payment-settings?venueId=${venueId}`] });
      toast({ title: "Payment settings saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage payment settings.</div>;
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
      <h1 className="text-2xl font-semibold" data-testid="page-title">Payment Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Stripe Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="stripePublishableKey" render={({ field }) => (
                <FormItem><FormLabel>Publishable Key</FormLabel><FormControl><Input data-testid="input-stripe-publishable" placeholder="pk_..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="stripeSecretKey" render={({ field }) => (
                <FormItem><FormLabel>Secret Key</FormLabel><FormControl><Input data-testid="input-stripe-secret" type="password" placeholder="sk_..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deposit Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="depositEnabled" render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel>Enable Deposits</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-deposit-enabled" />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="depositAmount" render={({ field }) => (
                <FormItem><FormLabel>Deposit Amount</FormLabel><FormControl><Input data-testid="input-deposit-amount" type="number" min="0" step="0.01" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save-payments">
            <Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
