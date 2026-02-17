import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import type { Venue } from "@shared/schema";

export default function AdminClients() {
  useVenue();

  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-clients">
          Clients
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Venues</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : venues.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-clients">
              No venues found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue.id} data-testid={`row-venue-${venue.id}`}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.type}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{venue.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={venue.status === "active" ? "default" : "outline"}>
                        {venue.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{venue.ownerId}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : "-"}
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
