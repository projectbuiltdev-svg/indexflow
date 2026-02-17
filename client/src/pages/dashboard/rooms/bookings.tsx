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
import { Plus, BedDouble } from "lucide-react";

const bookingFormSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  roomId: z.string().min(1, "Room is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  totalAmount: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

function bookingStatusVariant(status: string) {
  switch (status) {
    case "confirmed": return "default" as const;
    case "checked_in": return "secondary" as const;
    case "checked_out": return "outline" as const;
    case "cancelled": return "destructive" as const;
    default: return "default" as const;
  }
}

export default function RoomBookings() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { guestName: "", guestEmail: "", roomId: "", checkIn: "", checkOut: "", totalAmount: "" },
  });

  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/room-bookings?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: rooms = [] } = useQuery<any[]>({
    queryKey: [`/api/rooms?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: BookingFormValues) => {
      await apiRequest("POST", "/api/room-bookings", {
        venueId,
        guestName: values.guestName,
        guestEmail: values.guestEmail || undefined,
        roomId: values.roomId,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        totalAmount: values.totalAmount || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/room-bookings?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Booking created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/room-bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/room-bookings?venueId=${venueId}`] });
      toast({ title: "Booking status updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage room bookings.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Room Bookings</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  const getRoomName = (roomId: string) => {
    const r = rooms.find((rm: any) => rm.id === roomId || String(rm.id) === roomId);
    return r?.roomNumber || roomId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Room Bookings</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-booking"><Plus className="h-4 w-4 mr-2" />Add Booking</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Room Booking</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="guestName" render={({ field }) => (
                  <FormItem><FormLabel>Guest Name</FormLabel><FormControl><Input data-testid="input-booking-guest" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="guestEmail" render={({ field }) => (
                  <FormItem><FormLabel>Guest Email</FormLabel><FormControl><Input data-testid="input-booking-email" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="roomId" render={({ field }) => (
                  <FormItem><FormLabel>Room</FormLabel><FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-booking-room"><SelectValue placeholder="Select room" /></SelectTrigger>
                      <SelectContent>
                        {rooms.map((r: any) => (
                          <SelectItem key={r.id} value={String(r.id)}>{r.roomNumber}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="checkIn" render={({ field }) => (
                  <FormItem><FormLabel>Check In</FormLabel><FormControl><Input data-testid="input-booking-checkin" type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="checkOut" render={({ field }) => (
                  <FormItem><FormLabel>Check Out</FormLabel><FormControl><Input data-testid="input-booking-checkout" type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="totalAmount" render={({ field }) => (
                  <FormItem><FormLabel>Total Amount</FormLabel><FormControl><Input data-testid="input-booking-total" type="number" min="0" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-booking">
                  {createMutation.isPending ? "Creating..." : "Create Booking"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BedDouble className="h-5 w-5" />Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No room bookings yet.</p>
          ) : (
            <Table data-testid="room-bookings-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b: any) => (
                  <TableRow key={b.id} data-testid={`room-booking-row-${b.id}`}>
                    <TableCell>{b.guestName}</TableCell>
                    <TableCell>{getRoomName(b.roomId)}</TableCell>
                    <TableCell>{b.checkIn}</TableCell>
                    <TableCell>{b.checkOut}</TableCell>
                    <TableCell>
                      <Badge variant={bookingStatusVariant(b.status || "")} data-testid={`room-booking-status-${b.id}`}>
                        {b.status || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{b.totalAmount ? `$${b.totalAmount}` : "-"}</TableCell>
                    <TableCell>
                      <Select
                        value={b.status || "confirmed"}
                        onValueChange={(v) => updateStatusMutation.mutate({ id: b.id, status: v })}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-booking-status-${b.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="checked_in">Checked In</SelectItem>
                          <SelectItem value="checked_out">Checked Out</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
