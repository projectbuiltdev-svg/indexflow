import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CallLog } from "@shared/schema";

export default function AdminCallLogs() {
  const { data: logs, isLoading } = useQuery<CallLog[]>({ queryKey: ["/api/admin/call-logs"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-call-logs-title">Call Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Call Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !logs?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-call-logs">No call logs yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caller</TableHead>
                  <TableHead>Venue ID</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id} data-testid={`row-call-${l.id}`}>
                    <TableCell className="font-medium">{l.callerPhone || "Unknown"}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{l.venueId}</TableCell>
                    <TableCell>{l.duration ? `${l.duration}s` : "—"}</TableCell>
                    <TableCell>
                      <Badge variant={l.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {l.status || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "—"}
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
