import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Table2 } from "lucide-react";

export default function SettingsResources() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "table", capacity: "4" });

  const { data: resources = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/resources", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/resources?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/resources", {
        venueId,
        name: form.name,
        type: form.type,
        capacity: parseInt(form.capacity),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setDialogOpen(false);
      setForm({ name: "", type: "table", capacity: "4" });
      toast({ title: "Resource added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Resources</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Resources</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-resource"><Plus className="h-4 w-4 mr-2" />Add Resource</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input data-testid="input-resource-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger data-testid="select-resource-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="booth">Booth</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="patio">Patio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Capacity</Label><Input data-testid="input-resource-capacity" type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
              <Button data-testid="button-submit-resource" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name}>
                {createMutation.isPending ? "Adding..." : "Add Resource"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Table2 className="h-5 w-5" />Tables & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No resources configured.</p>
          ) : (
            <Table data-testid="resources-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((r: any) => (
                  <TableRow key={r.id} data-testid={`resource-row-${r.id}`}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="capitalize">{r.type}</TableCell>
                    <TableCell>{r.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={r.isActive ? "default" : "secondary"}>{r.isActive ? "Active" : "Inactive"}</Badge>
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
