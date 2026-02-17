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
import { Plus, Building } from "lucide-react";

export default function RoomsList() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ roomNumber: "", floor: "", roomTypeId: "" });

  const { data: rooms = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/rooms", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/rooms?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const { data: roomTypes = [] } = useQuery<any[]>({
    queryKey: ["/api/room-types", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/room-types?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/rooms", {
        venueId,
        roomNumber: form.roomNumber,
        floor: form.floor || undefined,
        roomTypeId: form.roomTypeId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      setDialogOpen(false);
      setForm({ roomNumber: "", floor: "", roomTypeId: "" });
      toast({ title: "Room added" });
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
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  const getRoomTypeName = (typeId: string) => {
    const rt = roomTypes.find((t: any) => t.id === typeId);
    return rt?.name || typeId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Rooms</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-room"><Plus className="h-4 w-4 mr-2" />Add Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Room</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Room Number</Label><Input data-testid="input-room-number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} /></div>
              <div><Label>Floor</Label><Input data-testid="input-room-floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
              <div>
                <Label>Room Type</Label>
                <Select value={form.roomTypeId} onValueChange={(v) => setForm({ ...form, roomTypeId: v })}>
                  <SelectTrigger data-testid="select-room-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((rt: any) => (
                      <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button data-testid="button-submit-room" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.roomNumber || !form.roomTypeId}>
                {createMutation.isPending ? "Adding..." : "Add Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No rooms configured.</p>
          ) : (
            <Table data-testid="rooms-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((r: any) => (
                  <TableRow key={r.id} data-testid={`room-row-${r.id}`}>
                    <TableCell>{r.roomNumber}</TableCell>
                    <TableCell>{r.floor || "-"}</TableCell>
                    <TableCell>{getRoomTypeName(r.roomTypeId)}</TableCell>
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
