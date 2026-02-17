import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Trash2, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useVenue } from "@/lib/venue-context";
import type { RankKeyword } from "@shared/schema";

export default function RankTracker() {
  const { selectedVenue } = useVenue();
  const [addOpen, setAddOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const { toast } = useToast();

  const { data: allKeywords, isLoading } = useQuery<RankKeyword[]>({
    queryKey: ["/api/rank-keywords", selectedVenue?.id],
    enabled: !!selectedVenue,
  });

  const keywords = selectedVenue
    ? (allKeywords || []).filter((k) => k.venueId === selectedVenue.id)
    : allKeywords || [];

  const addMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/rank-keywords", {
        venueId: selectedVenue!.id,
        keyword: newKeyword,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rank-keywords"] });
      toast({ title: "Keyword added" });
      setAddOpen(false);
      setNewKeyword("");
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/rank-keywords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rank-keywords"] });
      toast({ title: "Keyword removed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Rank Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor keyword positions
            {selectedVenue && <span> for <span className="font-medium text-foreground">{selectedVenue.name}</span></span>}
          </p>
        </div>
        {selectedVenue && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-keyword">
                <Plus className="w-4 h-4 mr-2" />
                Add Keyword
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Keyword</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="new-keyword">Keyword</Label>
                  <Input
                    id="new-keyword"
                    placeholder="e.g. best restaurant downtown"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    data-testid="input-new-keyword"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => addMutation.mutate()}
                  disabled={!newKeyword || addMutation.isPending}
                  data-testid="button-submit-keyword"
                >
                  {addMutation.isPending ? "Adding..." : "Add Keyword"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Total Keywords", value: keywords.length, icon: Hash },
          { label: "Tracked", value: keywords.length, icon: Search },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-kw-${m.label.toLowerCase().replace(/[\s.]+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className="w-5 h-5 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No keywords tracked yet. Add keywords to start monitoring.
                  </TableCell>
                </TableRow>
              ) : (
                keywords.map((kw) => (
                  <TableRow key={kw.id} data-testid={`row-keyword-${kw.id}`}>
                    <TableCell>
                      <span className="font-medium text-sm" data-testid={`text-keyword-${kw.id}`}>{kw.keyword}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {kw.createdAt ? new Date(kw.createdAt).toLocaleDateString() : "\u2014"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(kw.id)}
                        data-testid={`button-delete-keyword-${kw.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
