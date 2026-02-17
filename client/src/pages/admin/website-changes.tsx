import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileEdit } from "lucide-react";
import type { WebsiteChangeRequest, Venue } from "@shared/schema";

export default function AdminWebsiteChanges() {
  useVenue();

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: requests = [], isLoading } = useQuery<WebsiteChangeRequest[]>({
    queryKey: ["/api/admin/website-change-requests"],
  });

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const statusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default" as const;
      case "in_progress": return "secondary" as const;
      case "rejected": return "destructive" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FileEdit className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-website-changes">
          Website Change Requests
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Change Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-website-changes">
              No website change requests found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} data-testid={`row-change-request-${req.id}`}>
                    <TableCell className="font-medium">
                      {venueMap.get(req.venueId)?.name || req.venueId}
                    </TableCell>
                    <TableCell>{req.changeType}</TableCell>
                    <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}
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
