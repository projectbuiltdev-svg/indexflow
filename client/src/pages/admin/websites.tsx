import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe } from "lucide-react";
import type { Domain as VenueDomain, Venue } from "@shared/schema";

export default function AdminWebsites() {
  useVenue();

  const { data: domains = [], isLoading: domainsLoading } = useQuery<VenueDomain[]>({
    queryKey: ["/api/domains"],
  });

  const { data: venues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const isLoading = domainsLoading || venuesLoading;
  const venueMap = new Map(venues.map((v) => [v.id, v]));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Globe className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-websites">
          Websites / Domains
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Domains</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : domains.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-websites">
              No domains found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((d) => (
                  <TableRow key={d.id} data-testid={`row-domain-${d.id}`}>
                    <TableCell className="font-medium">{d.domain}</TableCell>
                    <TableCell>{venueMap.get(d.venueId)?.name || d.venueId}</TableCell>
                    <TableCell>
                      <Badge variant={d.isPrimary ? "default" : "outline"}>
                        {d.isPrimary ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{d.blogTemplate}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "-"}
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
