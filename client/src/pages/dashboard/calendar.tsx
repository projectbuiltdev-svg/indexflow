import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardCalendar() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ guest_name: "", guest_email: "", party_size: "2", date: "", time: "19:00", notes: "" });

  const { data: reservations = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/reservations", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/reservations?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/reservations", {
        venueId,
        guestName: form.guest_name,
        guestEmail: form.guest_email || undefined,
        partySize: parseInt(form.party_size),
        date: form.date,
        time: form.time,
        notes: form.notes || undefined,
        source: "manual",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      setDialogOpen(false);
      setForm({ guest_name: "", guest_email: "", party_size: "2", date: "", time: "19:00", notes: "" });
      toast({ title: "Reservation created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const countsByDay: Record<string, number> = {};
  reservations.forEach((r: any) => {
    if (r.date) {
      countsByDay[r.date] = (countsByDay[r.date] || 0) + 1;
    }
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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
            <div className="space-y-4">
              <div><Label>Guest Name</Label><Input data-testid="input-guest-name" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} /></div>
              <div><Label>Guest Email</Label><Input data-testid="input-guest-email" type="email" value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} /></div>
              <div><Label>Party Size</Label><Input data-testid="input-party-size" type="number" min="1" value={form.party_size} onChange={(e) => setForm({ ...form, party_size: e.target.value })} /></div>
              <div><Label>Date</Label><Input data-testid="input-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Time</Label><Input data-testid="input-time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
              <div><Label>Notes</Label><Textarea data-testid="input-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button data-testid="button-submit-reservation" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.guest_name || !form.date}>
                {createMutation.isPending ? "Creating..." : "Create Reservation"}
              </Button>
            </div>
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
              return (
                <div
                  key={day}
                  className={`p-2 min-h-[60px] rounded-md border text-sm ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
                  data-testid={`calendar-day-${dateStr}`}
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
    </div>
  );
}
