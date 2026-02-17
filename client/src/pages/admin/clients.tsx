import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Venue } from "@shared/schema";

export default function AdminClients() {
  const { data: venues, isLoading } = useQuery<Venue[]>({ queryKey: ["/api/venues"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-clients-title">Clients</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Venues</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !venues?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-clients">No clients yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((v) => (
                  <TableRow key={v.id} data-testid={`row-client-${v.id}`}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.type}</TableCell>
                    <TableCell>{v.city || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={v.status === "active" ? "default" : "secondary"} className="text-xs">
                        {v.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{v.plan}</Badge>
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
