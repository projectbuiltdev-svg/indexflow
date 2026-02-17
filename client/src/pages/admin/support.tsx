import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifeBuoy } from "lucide-react";
import type { SupportTicket, Venue } from "@shared/schema";

export default function AdminSupport() {
  useVenue();
  const { toast } = useToast();

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support-tickets"],
  });

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, string> }) => {
      const res = await apiRequest("PATCH", `/api/support-tickets/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      toast({ title: "Ticket updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const priorityVariant = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive" as const;
      case "high": return "destructive" as const;
      case "medium": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "resolved": return "default" as const;
      case "in-progress": return "secondary" as const;
      case "closed": return "outline" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-support">
          Support Tickets
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-support">
              No support tickets found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} data-testid={`row-ticket-${ticket.id}`}>
                    <TableCell className="font-medium">
                      {venueMap.get(ticket.venueId)?.name || ticket.venueId}
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{ticket.category}</TableCell>
                    <TableCell>
                      <Select
                        value={ticket.priority}
                        onValueChange={(value) => updateMutation.mutate({ id: ticket.id, data: { priority: value } })}
                      >
                        <SelectTrigger className="w-[120px]" data-testid={`select-priority-${ticket.id}`}>
                          <SelectValue>
                            <Badge variant={priorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => updateMutation.mutate({ id: ticket.id, data: { status: value } })}
                      >
                        <SelectTrigger className="w-[140px]" data-testid={`select-status-${ticket.id}`}>
                          <SelectValue>
                            <Badge variant={statusVariant(ticket.status)}>{ticket.status}</Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "-"}
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
