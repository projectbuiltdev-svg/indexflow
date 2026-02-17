import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LifeBuoy } from "lucide-react";
import type { SupportTicket } from "@shared/schema";

export default function AdminSupport() {
  const { selectedVenue } = useVenue();

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support-tickets", selectedVenue?.id ? `?venueId=${selectedVenue.id}` : ""],
    enabled: !!selectedVenue?.id,
  });

  const priorityVariant = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive" as const;
      case "high": return "destructive" as const;
      case "medium": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "resolved": return "default" as const;
      case "in_progress": return "secondary" as const;
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

      {!selectedVenue ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center" data-testid="no-venue-selected">
              Please select a venue to view support tickets.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tickets - {selectedVenue.name}</CardTitle>
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
                      <TableCell className="font-medium">{ticket.subject}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(ticket.status)}>{ticket.status}</Badge>
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
      )}
    </div>
  );
}
