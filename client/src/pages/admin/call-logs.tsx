import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall } from "lucide-react";
import type { CallLog, Venue } from "@shared/schema";
import { AdminLayout } from "@/components/admin-layout";

export default function AdminCallLogs() {
  useVenue();
  const [filterVenueId, setFilterVenueId] = useState<string>("all");

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: logs = [], isLoading } = useQuery<CallLog[]>({
    queryKey: ["/api/admin/call-logs"],
  });

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const filteredLogs = filterVenueId === "all"
    ? logs
    : logs.filter((l) => l.venueId === filterVenueId);

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-6 w-6" />
          <h1 className="text-2xl font-semibold" data-testid="page-title-call-logs">Call Logs</h1>
        </div>
        <Select value={filterVenueId} onValueChange={setFilterVenueId}>
          <SelectTrigger className="w-[200px]" data-testid="select-filter-venue">
            <SelectValue placeholder="Filter by venue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Venues</SelectItem>
            {venues.map((v) => (
              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filterVenueId !== "all" ? `Call Logs - ${venueMap.get(filterVenueId)?.name}` : "All Call Logs"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-call-logs">
              No call logs found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Caller Phone</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Summary</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} data-testid={`row-call-log-${log.id}`}>
                    <TableCell className="font-medium">
                      {venueMap.get(log.venueId)?.name || log.venueId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.callerPhone || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{log.duration ? `${log.duration}s` : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "completed" ? "default" : "outline"}>
                        {log.status || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {log.aiSummary || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
