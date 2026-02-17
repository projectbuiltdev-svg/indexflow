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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, BedDouble } from "lucide-react";

export default function RoomTypes() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", basePrice: "100", maxOccupancy: "2" });

  const { data: roomTypes = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/room-types", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/room-types?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/room-types", {
        venueId,
        name: form.name,
        description: form.description || undefined,
        basePrice: form.basePrice,
        maxOccupancy: parseInt(form.maxOccupancy),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/room-types"] });
      setDialogOpen(false);
      setForm({ name: "", description: "", basePrice: "100", maxOccupancy: "2" });
      toast({ title: "Room type added" });
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
        <h1 className="text-2xl font-semibold">Room Types</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Room Types</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-room-type"><Plus className="h-4 w-4 mr-2" />Add Room Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Room Type</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input data-testid="input-room-type-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea data-testid="input-room-type-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Base Price</Label><Input data-testid="input-room-type-price" type="number" min="0" step="0.01" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} /></div>
              <div><Label>Max Occupancy</Label><Input data-testid="input-room-type-occupancy" type="number" min="1" value={form.maxOccupancy} onChange={(e) => setForm({ ...form, maxOccupancy: e.target.value })} /></div>
              <Button data-testid="button-submit-room-type" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name}>
                {createMutation.isPending ? "Adding..." : "Add Room Type"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BedDouble className="h-5 w-5" />Room Types</CardTitle>
        </CardHeader>
        <CardContent>
          {roomTypes.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No room types configured.</p>
          ) : (
            <Table data-testid="room-types-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Max Occupancy</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomTypes.map((rt: any) => (
                  <TableRow key={rt.id} data-testid={`room-type-row-${rt.id}`}>
                    <TableCell>{rt.name}</TableCell>
                    <TableCell>${rt.basePrice}</TableCell>
                    <TableCell>{rt.maxOccupancy}</TableCell>
                    <TableCell>
                      <Badge variant={rt.isActive ? "default" : "secondary"}>{rt.isActive ? "Active" : "Inactive"}</Badge>
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
