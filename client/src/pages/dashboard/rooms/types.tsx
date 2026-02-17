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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Pencil, BedDouble } from "lucide-react";

const roomTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  basePrice: z.string().min(1, "Base rate is required"),
  maxOccupancy: z.coerce.number().min(1, "Max occupancy must be at least 1"),
  amenities: z.string().optional(),
});

type RoomTypeFormValues = z.infer<typeof roomTypeFormSchema>;

export default function RoomTypes() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeFormSchema),
    defaultValues: { name: "", description: "", basePrice: "100", maxOccupancy: 2, amenities: "" },
  });

  const { data: roomTypes = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/room-types?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: RoomTypeFormValues) => {
      await apiRequest("POST", "/api/room-types", {
        venueId,
        name: values.name,
        description: values.description || undefined,
        basePrice: values.basePrice,
        maxOccupancy: values.maxOccupancy,
        amenities: values.amenities || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/room-types?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Room type added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (values: RoomTypeFormValues) => {
      await apiRequest("PATCH", `/api/room-types/${editId}`, {
        name: values.name,
        description: values.description || undefined,
        basePrice: values.basePrice,
        maxOccupancy: values.maxOccupancy,
        amenities: values.amenities || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/room-types?venueId=${venueId}`] });
      setDialogOpen(false);
      setEditId(null);
      form.reset();
      toast({ title: "Room type updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const openEdit = (rt: any) => {
    setEditId(rt.id);
    form.reset({
      name: rt.name || "",
      description: rt.description || "",
      basePrice: rt.basePrice ? String(rt.basePrice) : "100",
      maxOccupancy: rt.maxOccupancy || 2,
      amenities: rt.amenities || "",
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditId(null);
    form.reset({ name: "", description: "", basePrice: "100", maxOccupancy: 2, amenities: "" });
    setDialogOpen(true);
  };

  const onSubmit = (values: RoomTypeFormValues) => {
    if (editId) editMutation.mutate(values);
    else createMutation.mutate(values);
  };

  const isPending = createMutation.isPending || editMutation.isPending;

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage room types.</div>;
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
            <Button onClick={openCreate} data-testid="button-add-room-type"><Plus className="h-4 w-4 mr-2" />Add Room Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Room Type" : "Add Room Type"}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input data-testid="input-room-type-name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea data-testid="input-room-type-description" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="basePrice" render={({ field }) => (
                  <FormItem><FormLabel>Base Rate</FormLabel><FormControl><Input data-testid="input-room-type-price" type="number" min="0" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="maxOccupancy" render={({ field }) => (
                  <FormItem><FormLabel>Max Occupancy</FormLabel><FormControl><Input data-testid="input-room-type-occupancy" type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="amenities" render={({ field }) => (
                  <FormItem><FormLabel>Amenities</FormLabel><FormControl><Input data-testid="input-room-type-amenities" placeholder="WiFi, TV, Mini-bar" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isPending} data-testid="button-submit-room-type">
                  {isPending ? "Saving..." : editId ? "Update Room Type" : "Add Room Type"}
                </Button>
              </form>
            </Form>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Max Occupancy</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomTypes.map((rt: any) => (
                  <TableRow key={rt.id} data-testid={`room-type-row-${rt.id}`}>
                    <TableCell>{rt.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{rt.description || "-"}</TableCell>
                    <TableCell>${rt.basePrice}</TableCell>
                    <TableCell>{rt.maxOccupancy}</TableCell>
                    <TableCell className="max-w-xs truncate">{rt.amenities || "-"}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(rt)} data-testid={`button-edit-room-type-${rt.id}`}>
                        <Pencil className="h-4 w-4" />
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
