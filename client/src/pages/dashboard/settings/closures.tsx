import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, XCircle } from "lucide-react";

export default function SettingsClosures() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ date: "", reason: "" });

  const { data: closures = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/closures", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/closures?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/closures", { venueId, date: form.date, reason: form.reason || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/closures"] });
      setDialogOpen(false);
      setForm({ date: "", reason: "" });
      toast({ title: "Closure added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/closures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/closures"] });
      toast({ title: "Closure removed" });
    },
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Closures</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Closures</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-closure"><Plus className="h-4 w-4 mr-2" />Add Closure</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Closure</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Date</Label><Input data-testid="input-closure-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Reason</Label><Input data-testid="input-closure-reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
              <Button data-testid="button-submit-closure" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.date}>
                {createMutation.isPending ? "Adding..." : "Add Closure"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><XCircle className="h-5 w-5" />Scheduled Closures</CardTitle>
        </CardHeader>
        <CardContent>
          {closures.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No closures scheduled.</p>
          ) : (
            <Table data-testid="closures-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closures.map((c: any) => (
                  <TableRow key={c.id} data-testid={`closure-row-${c.id}`}>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.reason || "-"}</TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(c.id)}
                        data-testid={`button-delete-closure-${c.id}`}
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
    </div>
  );
}
