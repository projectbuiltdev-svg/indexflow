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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, Users, Clock, CheckCircle, Plus } from "lucide-react";

const reservationFormSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().optional(),
  partySize: z.coerce.number().min(1, "Party size must be at least 1"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

function statusVariant(status: string) {
  switch (status) {
    case "confirmed": return "default" as const;
    case "pending": return "secondary" as const;
    case "completed": return "outline" as const;
    case "cancelled": return "destructive" as const;
    case "no-show": return "destructive" as const;
    default: return "default" as const;
  }
}

export default function DashboardToday() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      partySize: 2,
      date: new Date().toISOString().slice(0, 10),
      time: "19:00",
      notes: "",
    },
  });

  const { data: reservations = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/reservations?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: ReservationFormValues) => {
      await apiRequest("POST", "/api/reservations", {
        venueId,
        guestName: values.guestName,
        guestEmail: values.guestEmail || undefined,
        guestPhone: values.guestPhone || undefined,
        partySize: values.partySize,
        date: values.date,
        time: values.time,
        notes: values.notes || undefined,
        source: "manual",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reservations?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Reservation created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/reservations/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reservations?venueId=${venueId}`] });
      toast({ title: "Status updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to view today's reservations.</div>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayReservations = reservations.filter((r: any) => r.date === today);
  const upcoming = todayReservations.filter((r: any) => r.status === "confirmed").length;
  const completed = todayReservations.filter((r: any) => r.status === "completed").length;
  const totalGuests = todayReservations.reduce((sum: number, r: any) => sum + (r.partySize || 0), 0);

  const stats = [
    { label: "Today's Bookings", value: todayReservations.length, icon: CalendarCheck },
    { label: "Upcoming", value: upcoming, icon: Clock },
    { label: "Completed", value: completed, icon: CheckCircle },
    { label: "Total Guests", value: totalGuests, icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Today</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Today</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-reservation"><Plus className="h-4 w-4 mr-2" />Add Reservation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Reservation</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="guestName" render={({ field }) => (
                  <FormItem><FormLabel>Guest Name</FormLabel><FormControl><Input data-testid="input-guest-name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="guestEmail" render={({ field }) => (
                  <FormItem><FormLabel>Guest Email</FormLabel><FormControl><Input data-testid="input-guest-email" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="guestPhone" render={({ field }) => (
                  <FormItem><FormLabel>Guest Phone</FormLabel><FormControl><Input data-testid="input-guest-phone" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="partySize" render={({ field }) => (
                  <FormItem><FormLabel>Party Size</FormLabel><FormControl><Input data-testid="input-party-size" type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input data-testid="input-date" type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="time" render={({ field }) => (
                  <FormItem><FormLabel>Time</FormLabel><FormControl><Input data-testid="input-time" type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea data-testid="input-notes" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-reservation">
                  {createMutation.isPending ? "Creating..." : "Create Reservation"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} data-testid={`stat-card-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {todayReservations.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No reservations for today.</p>
          ) : (
            <Table data-testid="reservations-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayReservations.map((r: any) => (
                  <TableRow key={r.id} data-testid={`reservation-row-${r.id}`}>
                    <TableCell>{r.guestName}</TableCell>
                    <TableCell>{r.partySize}</TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(r.status)} data-testid={`status-badge-${r.id}`}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.status}
                        onValueChange={(v) => updateStatusMutation.mutate({ id: r.id, status: v })}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-status-${r.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
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
