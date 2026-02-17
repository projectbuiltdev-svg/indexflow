import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { WebsiteChangeRequest } from "@shared/schema";

export default function AdminWebsiteChanges() {
  const { data: requests, isLoading } = useQuery<WebsiteChangeRequest[]>({ queryKey: ["/api/admin/website-change-requests"] });

  const statusVariant = (s: string) => {
    if (s === "completed") return "default" as const;
    if (s === "pending") return "secondary" as const;
    if (s === "rejected") return "destructive" as const;
    return "outline" as const;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-website-changes-title">Website Changes</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !requests?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-changes">No website change requests yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Page URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id} data-testid={`row-change-${r.id}`}>
                    <TableCell><Badge variant="outline" className="text-xs">{r.changeType}</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.description}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.pageUrl || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(r.status)} className="text-xs">{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
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
