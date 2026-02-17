import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Venue } from "@shared/schema";

export default function AdminBilling() {
  const { data: venues, isLoading: loadingVenues } = useQuery<Venue[]>({ queryKey: ["/api/venues"] });
  const { data: paymentSettings, isLoading: loadingPayments } = useQuery<any[]>({ queryKey: ["/api/admin/payment-settings"] });

  const isLoading = loadingVenues || loadingPayments;

  const venuePaymentMap = new Map<string, any>();
  paymentSettings?.forEach((ps: any) => venuePaymentMap.set(ps.venueId, ps));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-billing-title">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Settings by Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !venues?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-billing">No venues yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead>PayPal</TableHead>
                  <TableHead>Deposit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((v) => {
                  const ps = venuePaymentMap.get(v.id);
                  return (
                    <TableRow key={v.id} data-testid={`row-billing-${v.id}`}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{v.plan}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={ps?.stripeConnected ? "default" : "secondary"} className="text-xs">
                          {ps?.stripeConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ps?.paypalConnected ? "default" : "secondary"} className="text-xs">
                          {ps?.paypalConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </TableCell>
                      <TableCell>{ps?.depositAmount ? `$${ps.depositAmount}` : "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
