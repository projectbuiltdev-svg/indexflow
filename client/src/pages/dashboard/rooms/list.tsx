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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building } from "lucide-react";

const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  floor: z.string().optional(),
  roomTypeId: z.string().min(1, "Room type is required"),
  status: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

function statusVariant(status: string) {
  switch (status) {
    case "available": return "default" as const;
    case "occupied": return "secondary" as const;
    case "maintenance": return "destructive" as const;
    default: return "default" as const;
  }
}

export default function RoomsList() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: { roomNumber: "", floor: "", roomTypeId: "", status: "available" },
  });

  const { data: rooms = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/rooms?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: roomTypes = [] } = useQuery<any[]>({
    queryKey: [`/api/room-types?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: RoomFormValues) => {
      await apiRequest("POST", "/api/rooms", {
        venueId,
        roomNumber: values.roomNumber,
        floor: values.floor || undefined,
        roomTypeId: values.roomTypeId,
        status: values.status || "available",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/rooms?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Room added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage rooms.</div>;
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="roomNumber" render={({ field }) => (
                  <FormItem><FormLabel>Room Number</FormLabel><FormControl><Input data-testid="input-room-number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="floor" render={({ field }) => (
                  <FormItem><FormLabel>Floor</FormLabel><FormControl><Input data-testid="input-room-floor" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="roomTypeId" render={({ field }) => (
                  <FormItem><FormLabel>Room Type</FormLabel><FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-room-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((rt: any) => (
                          <SelectItem key={rt.id} value={String(rt.id)}>{rt.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-room-status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-room">
                  {createMutation.isPending ? "Adding..." : "Add Room"}
                </Button>
              </form>
            </Form>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((r: any) => (
                  <TableRow key={r.id} data-testid={`room-row-${r.id}`}>
                    <TableCell>{r.roomNumber}</TableCell>
                    <TableCell>{getRoomTypeName(r.roomTypeId)}</TableCell>
                    <TableCell>{r.floor || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(r.status || "available")} data-testid={`room-status-${r.id}`}>
                        {r.status || "available"}
                      </Badge>
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
