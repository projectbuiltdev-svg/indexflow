import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { SupportTicket } from "@shared/schema";

export default function AdminSupport() {
  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({ queryKey: ["/api/admin/support-tickets"] });

  const statusVariant = (s: string) => {
    if (s === "open") return "destructive" as const;
    if (s === "in_progress") return "default" as const;
    if (s === "resolved" || s === "closed") return "secondary" as const;
    return "outline" as const;
  };

  const priorityVariant = (p: string) => {
    if (p === "high" || p === "urgent") return "destructive" as const;
    if (p === "medium") return "default" as const;
    return "secondary" as const;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-support-title">Support Tickets</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !tickets?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-tickets">No support tickets yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Venue ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id} data-testid={`row-ticket-${t.id}`}>
                    <TableCell className="font-medium max-w-[200px] truncate">{t.subject}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{t.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(t.priority)} className="text-xs">{t.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(t.status)} className="text-xs">{t.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{t.venueId}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
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
