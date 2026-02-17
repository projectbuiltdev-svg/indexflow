import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSEO() {
  const { data: rankKeywords, isLoading: loadingRank } = useQuery<any[]>({ queryKey: ["/api/admin/rank-keywords"] });
  const { data: gridKeywords, isLoading: loadingGrid } = useQuery<any[]>({ queryKey: ["/api/admin/grid-keywords"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-seo-title">SEO & Rankings</h1>
      <Tabs defaultValue="rank">
        <TabsList>
          <TabsTrigger value="rank" data-testid="tab-rank-keywords">Rank Keywords ({rankKeywords?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="grid" data-testid="tab-grid-keywords">Grid Keywords ({gridKeywords?.length ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="rank">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rank Tracker Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRank ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : !rankKeywords?.length ? (
                <p className="text-muted-foreground text-sm" data-testid="text-no-rank-keywords">No rank keywords yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Venue ID</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankKeywords.map((k: any) => (
                      <TableRow key={k.id} data-testid={`row-rank-${k.id}`}>
                        <TableCell className="font-medium">{k.keyword}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{k.venueId}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grid Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingGrid ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : !gridKeywords?.length ? (
                <p className="text-muted-foreground text-sm" data-testid="text-no-grid-keywords">No grid keywords yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Venue ID</TableHead>
                      <TableHead>Grid Size</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gridKeywords.map((k: any) => (
                      <TableRow key={k.id} data-testid={`row-grid-${k.id}`}>
                        <TableCell className="font-medium">{k.keyword}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{k.venueId}</TableCell>
                        <TableCell>{k.gridSize}x{k.gridSize}</TableCell>
                        <TableCell>{k.distance} mi</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
