import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";
import type { Venue } from "@shared/schema";

interface PaymentSetting {
  id: number;
  venueId: string;
  stripeConnected: boolean | null;
  paypalConnected: boolean | null;
  depositAmount: string | null;
  depositType: string | null;
}

export default function AdminBilling() {
  useVenue();

  const { data: venues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: allPaymentSettings = [], isLoading: paymentsLoading } = useQuery<PaymentSetting[]>({
    queryKey: ["/api/admin/payment-settings"],
  });

  const isLoading = venuesLoading || paymentsLoading;

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-billing">
          Billing / Payment Settings
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings by Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : allPaymentSettings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-billing">
              No payment settings configured.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead>PayPal</TableHead>
                  <TableHead>Deposit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPaymentSettings.map((ps) => (
                  <TableRow key={ps.id} data-testid={`row-payment-${ps.id}`}>
                    <TableCell className="font-medium">
                      {venueMap.get(ps.venueId)?.name || ps.venueId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ps.stripeConnected ? "default" : "outline"}>
                        {ps.stripeConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ps.paypalConnected ? "default" : "outline"}>
                        {ps.paypalConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {ps.depositAmount ? `$${ps.depositAmount} (${ps.depositType || "fixed"})` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
