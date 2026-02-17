import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileEdit } from "lucide-react";
import type { WebsiteChangeRequest, Venue } from "@shared/schema";

export default function AdminWebsiteChanges() {
  useVenue();
  const { toast } = useToast();

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: requests = [], isLoading } = useQuery<WebsiteChangeRequest[]>({
    queryKey: ["/api/admin/website-change-requests"],
  });

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/website-change-requests/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/website-change-requests"] });
      toast({ title: "Status updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const statusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default" as const;
      case "approved": return "secondary" as const;
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
                    <TableCell>
                      <Badge variant="secondary">{req.changeType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{req.description}</TableCell>
                    <TableCell>
                      <Select
                        value={req.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: req.id, status: value })}
                      >
                        <SelectTrigger className="w-[140px]" data-testid={`select-status-${req.id}`}>
                          <SelectValue>
                            <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
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
