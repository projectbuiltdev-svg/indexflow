import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Domain } from "@shared/schema";

export default function AdminWebsites() {
  const { data: domains, isLoading } = useQuery<Domain[]>({ queryKey: ["/api/domains"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-websites-title">Websites</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Venue Domains</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !domains?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-domains">No domains yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Venue ID</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((d) => (
                  <TableRow key={d.id} data-testid={`row-domain-${d.id}`}>
                    <TableCell className="font-medium">{d.domain}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">{d.venueId}</TableCell>
                    <TableCell>
                      <Badge variant={d.isPrimary ? "default" : "secondary"} className="text-xs">
                        {d.isPrimary ? "Primary" : "Secondary"}
                      </Badge>
                    </TableCell>
                    <TableCell>{d.blogTemplate}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}
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
