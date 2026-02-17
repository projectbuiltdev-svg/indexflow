import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneCall } from "lucide-react";
import type { CallLog } from "@shared/schema";

export default function AdminCallLogs() {
  const { selectedVenue } = useVenue();

  const { data: logs = [], isLoading } = useQuery<CallLog[]>({
    queryKey: ["/api/call-logs", selectedVenue?.id ? `?venueId=${selectedVenue.id}` : ""],
    enabled: !!selectedVenue?.id,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <PhoneCall className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-call-logs">
          Call Logs
        </h1>
      </div>

      {!selectedVenue ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center" data-testid="no-venue-selected">
              Please select a venue to view call logs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Call Logs - {selectedVenue.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8" data-testid="empty-state-call-logs">
                No call logs found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} data-testid={`row-call-log-${log.id}`}>
                      <TableCell className="text-muted-foreground">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="font-medium">{log.callerPhone || "-"}</TableCell>
                      <TableCell>{log.duration ? `${log.duration}s` : "-"}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "completed" ? "default" : "outline"}>
                          {log.status || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {log.aiSummary || "-"}
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
