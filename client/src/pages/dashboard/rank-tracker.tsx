import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Search } from "lucide-react";

const keywordFormSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
});

type KeywordFormValues = z.infer<typeof keywordFormSchema>;

export default function RankTracker() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<KeywordFormValues>({
    resolver: zodResolver(keywordFormSchema),
    defaultValues: { keyword: "" },
  });

  const { data: keywords = [], isLoading: loadingKw } = useQuery<any[]>({
    queryKey: [`/api/rank-keywords?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: results = [], isLoading: loadingRes } = useQuery<any[]>({
    queryKey: [`/api/rank-results?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const addMutation = useMutation({
    mutationFn: async (values: KeywordFormValues) => {
      await apiRequest("POST", "/api/rank-keywords", { venueId, keyword: values.keyword });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/rank-keywords?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
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
      queryClient.invalidateQueries({ queryKey: [`/api/rank-keywords?venueId=${venueId}`] });
      toast({ title: "Keyword removed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to track keyword rankings.</div>;
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Rank Tracker</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-keyword"><Plus className="h-4 w-4 mr-2" />Add Keyword</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Keyword</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="keyword" render={({ field }) => (
                  <FormItem><FormLabel>Keyword</FormLabel><FormControl><Input data-testid="input-new-keyword" placeholder="e.g. best restaurant downtown" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={addMutation.isPending} data-testid="button-submit-keyword">
                  {addMutation.isPending ? "Adding..." : "Add Keyword"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Keywords</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Change</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r: any) => {
                  const change = r.previousPosition && r.position ? r.previousPosition - r.position : null;
                  return (
                    <TableRow key={r.id} data-testid={`result-row-${r.id}`}>
                      <TableCell>{r.keyword}</TableCell>
                      <TableCell>{r.position ?? "-"}</TableCell>
                      <TableCell>
                        {change !== null && change !== 0 ? (
                          <span className={change > 0 ? "text-green-600" : "text-red-600"}>
                            {change > 0 ? "+" : ""}{change}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{r.url || "-"}</TableCell>
                      <TableCell>{r.checkedAt ? new Date(r.checkedAt).toLocaleDateString() : "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
