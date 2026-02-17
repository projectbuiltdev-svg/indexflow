import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone } from "lucide-react";

function callStatusVariant(status: string) {
  switch (status) {
    case "completed": return "default";
    case "missed": return "destructive";
    case "voicemail": return "secondary";
    case "in-progress": return "outline";
    default: return "default";
  }
}

export default function DashboardCalls() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;

  const { data: callLogs = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/call-logs", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/call-logs?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Call Logs</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Call Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {callLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-testid="empty-state">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No call logs yet.</p>
            </div>
          ) : (
            <Table data-testid="call-logs-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Caller Phone</TableHead>
                  <TableHead>Duration (s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogs.map((log: any) => (
                  <TableRow key={log.id} data-testid={`call-row-${log.id}`}>
                    <TableCell>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{log.callerPhone || "-"}</TableCell>
                    <TableCell>{log.duration ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={callStatusVariant(log.status || "")} data-testid={`call-status-${log.id}`}>
                        {log.status || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.aiSummary || "-"}</TableCell>
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
