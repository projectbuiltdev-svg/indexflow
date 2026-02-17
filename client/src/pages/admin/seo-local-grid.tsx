import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Grid3X3, Plus, Trash2 } from "lucide-react";

interface GridKeyword {
  id: number;
  venueId: string;
  keyword: string;
  gridSize: number;
  distance: string;
  createdAt: string | null;
}

interface GridScanResult {
  id: number;
  venueId: string;
  keyword: string;
  gridSize: number;
  gridIndex: number;
  rank: number | null;
  businessName: string | null;
  scanDate: string | null;
}

export default function AdminLocalGrid() {
  const { selectedVenue } = useVenue();
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState("");

  const venueId = selectedVenue?.id;

  const { data: keywords = [], isLoading: kwLoading } = useQuery<GridKeyword[]>({
    queryKey: ["/api/grid-keywords", `?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: scanResults = [], isLoading: resultsLoading } = useQuery<GridScanResult[]>({
    queryKey: ["/api/grid-scan-results", `?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const addMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await apiRequest("POST", "/api/grid-keywords", { venueId, keyword });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grid-keywords"] });
      setNewKeyword("");
      toast({ title: "Grid keyword added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/grid-keywords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grid-keywords"] });
      toast({ title: "Grid keyword removed" });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Grid3X3 className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-local-grid">
          Local Grid
        </h1>
      </div>

      {!selectedVenue ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center" data-testid="no-venue-selected">
              Please select a venue to view local grid data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Grid Keywords - {selectedVenue.name}</CardTitle>
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
                  placeholder="Add grid keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  data-testid="input-add-grid-keyword"
                />
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-add-grid-keyword">
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
                <p className="text-muted-foreground text-center py-4" data-testid="empty-state-grid-keywords">
                  No grid keywords tracked yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Grid Size</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((kw) => (
                      <TableRow key={kw.id} data-testid={`row-grid-keyword-${kw.id}`}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell>{kw.gridSize}x{kw.gridSize}</TableCell>
                        <TableCell>{kw.distance} mi</TableCell>
                        <TableCell className="text-muted-foreground">
                          {kw.createdAt ? new Date(kw.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(kw.id)}
                            data-testid={`button-delete-grid-keyword-${kw.id}`}
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
              <CardTitle>Grid Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : scanResults.length === 0 ? (
                <div className="py-8 text-center" data-testid="empty-state-grid-results">
                  <p className="text-muted-foreground">No scan results yet. Run a scan to see grid data.</p>
                  <div className="mt-6 grid grid-cols-5 gap-1 max-w-xs mx-auto">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-sm border bg-muted flex items-center justify-center text-xs text-muted-foreground"
                      >
                        -
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-1 max-w-xs mx-auto">
                  {scanResults.slice(0, 25).map((r) => (
                    <div
                      key={r.id}
                      className={`aspect-square rounded-sm border flex items-center justify-center text-xs font-medium ${
                        r.rank && r.rank <= 3
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : r.rank && r.rank <= 10
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-muted text-muted-foreground"
                      }`}
                      data-testid={`grid-cell-${r.gridIndex}`}
                    >
                      {r.rank ?? "-"}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
