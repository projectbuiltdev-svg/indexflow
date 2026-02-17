import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";

interface RankKeyword {
  id: number;
  venueId: string;
  keyword: string;
  createdAt: string | null;
}

interface RankResult {
  id: number;
  venueId: string;
  keywordId: number;
  keyword: string;
  position: number | null;
  previousPosition: number | null;
  url: string | null;
  searchEngine: string;
  checkedAt: string | null;
}

export default function AdminRankTracker() {
  const { selectedVenue } = useVenue();
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState("");

  const venueId = selectedVenue?.id;

  const { data: keywords = [], isLoading: kwLoading } = useQuery<RankKeyword[]>({
    queryKey: ["/api/rank-keywords", `?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery<RankResult[]>({
    queryKey: ["/api/rank-results", `?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const addMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await apiRequest("POST", "/api/rank-keywords", { venueId, keyword });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rank-keywords"] });
      setNewKeyword("");
      toast({ title: "Keyword added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/rank-keywords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rank-keywords"] });
      toast({ title: "Keyword removed" });
    },
  });

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-rank-tracker">
          Rank Tracker
        </h1>
      </div>

      {!selectedVenue ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center" data-testid="no-venue-selected">
              Please select a venue to view rank tracking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Keywords - {selectedVenue.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newKeyword.trim()) addMutation.mutate(newKeyword.trim());
                }}
              >
                <Input
                  placeholder="Add keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  data-testid="input-add-keyword"
                />
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-add-keyword">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </form>

              {kwLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : keywords.length === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="empty-state-keywords">
                  No keywords tracked yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((kw) => (
                      <TableRow key={kw.id} data-testid={`row-keyword-${kw.id}`}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {kw.createdAt ? new Date(kw.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(kw.id)}
                            data-testid={`button-delete-keyword-${kw.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rank Results</CardTitle>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8" data-testid="empty-state-results">
                  No rank results yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Previous</TableHead>
                      <TableHead>Engine</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Checked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow key={r.id} data-testid={`row-result-${r.id}`}>
                        <TableCell className="font-medium">{r.keyword}</TableCell>
                        <TableCell>
                          <Badge variant={r.position && r.position <= 10 ? "default" : "outline"}>
                            {r.position ?? "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{r.previousPosition ?? "-"}</TableCell>
                        <TableCell>{r.searchEngine}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">{r.url || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.checkedAt ? new Date(r.checkedAt).toLocaleDateString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </AdminLayout>
  );
}
