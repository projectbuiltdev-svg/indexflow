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
import { Plus, Trash2, Search } from "lucide-react";

export default function RankTracker() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState("");

  const { data: keywords = [], isLoading: loadingKw } = useQuery<any[]>({
    queryKey: ["/api/rank-keywords", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/rank-keywords?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const { data: results = [], isLoading: loadingRes } = useQuery<any[]>({
    queryKey: ["/api/rank-results", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/rank-results?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/rank-keywords", { venueId, keyword: newKeyword });
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

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  const isLoading = loadingKw || loadingRes;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Rank Tracker</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Rank Tracker</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              data-testid="input-new-keyword"
              onKeyDown={(e) => { if (e.key === "Enter" && newKeyword.trim()) addMutation.mutate(); }}
            />
            <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending || !newKeyword.trim()} data-testid="button-add-keyword">
              <Plus className="h-4 w-4 mr-2" />Add
            </Button>
          </div>

          {keywords.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-keywords">No keywords tracked.</p>
          ) : (
            <Table data-testid="keywords-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw: any) => (
                  <TableRow key={kw.id} data-testid={`keyword-row-${kw.id}`}>
                    <TableCell>{kw.keyword}</TableCell>
                    <TableCell>{kw.createdAt ? new Date(kw.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(kw.id)} data-testid={`button-delete-keyword-${kw.id}`}>
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
          {results.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-results">No rank results available.</p>
          ) : (
            <Table data-testid="results-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Previous</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Engine</TableHead>
                  <TableHead>Checked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r: any) => (
                  <TableRow key={r.id} data-testid={`result-row-${r.id}`}>
                    <TableCell>{r.keyword}</TableCell>
                    <TableCell>{r.position ?? "-"}</TableCell>
                    <TableCell>{r.previousPosition ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.url || "-"}</TableCell>
                    <TableCell>{r.searchEngine}</TableCell>
                    <TableCell>{r.checkedAt ? new Date(r.checkedAt).toLocaleDateString() : "-"}</TableCell>
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
