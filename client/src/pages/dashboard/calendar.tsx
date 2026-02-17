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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const reservationFormSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  partySize: z.coerce.number().min(1),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

export default function DashboardCalendar() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: { guestName: "", guestEmail: "", partySize: 2, date: "", time: "19:00", notes: "" },
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

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to view the calendar.</div>;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const countsByDay: Record<string, number> = {};
  reservations.forEach((r: any) => {
    if (r.date) countsByDay[r.date] = (countsByDay[r.date] || 0) + 1;
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectedDayReservations = selectedDay
    ? reservations.filter((r: any) => r.date === selectedDay)
    : [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Calendar</h1>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <Button size="icon" variant="ghost" onClick={prevMonth} data-testid="button-prev-month"><ChevronLeft className="h-4 w-4" /></Button>
          <CardTitle data-testid="calendar-month-label">{monthLabel}</CardTitle>
          <Button size="icon" variant="ghost" onClick={nextMonth} data-testid="button-next-month"><ChevronRight className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const count = countsByDay[dateStr] || 0;
              const isToday = dateStr === new Date().toISOString().slice(0, 10);
              const isSelected = dateStr === selectedDay;
              return (
                <div
                  key={day}
                  className={`p-2 min-h-[60px] rounded-md border text-sm cursor-pointer ${isToday ? "border-primary bg-primary/5" : "border-border"} ${isSelected ? "ring-2 ring-primary" : ""}`}
                  data-testid={`calendar-day-${dateStr}`}
                  onClick={() => setSelectedDay(dateStr)}
                >
                  <div className="font-medium">{day}</div>
                  {count > 0 && (
                    <Badge variant="secondary" className="mt-1 text-xs">{count}</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDay && (
        <Card>
          <CardHeader>
            <CardTitle>Reservations for {selectedDay}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayReservations.length === 0 ? (
              <p className="text-muted-foreground" data-testid="empty-day-state">No reservations for this day.</p>
            ) : (
              <Table data-testid="day-reservations-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Party Size</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDayReservations.map((r: any) => (
                    <TableRow key={r.id} data-testid={`day-reservation-row-${r.id}`}>
                      <TableCell>{r.guestName}</TableCell>
                      <TableCell>{r.partySize}</TableCell>
                      <TableCell>{r.time}</TableCell>
                      <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
