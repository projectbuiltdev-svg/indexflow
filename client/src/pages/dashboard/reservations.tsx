import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CalendarCheck, Users, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useVenue } from "@/lib/venue-context";
import type { Reservation } from "@shared/schema";

function ReservationStatusBadge({ status }: { status: string | null }) {
  const s = status || "pending";
  switch (s) {
    case "confirmed":
      return <Badge className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-res-status-${s}`}>{s}</Badge>;
    case "completed":
      return <Badge variant="secondary" data-testid={`badge-res-status-${s}`}>{s}</Badge>;
    case "cancelled":
      return <Badge variant="destructive" data-testid={`badge-res-status-${s}`}>{s}</Badge>;
    default:
      return <Badge variant="outline" data-testid={`badge-res-status-${s}`}>{s}</Badge>;
  }
}

function AddReservationDialog({ venueId }: { venueId: string }) {
  const [open, setOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [source, setSource] = useState("phone");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/reservations", {
        venueId,
        guestName,
        guestEmail: guestEmail || undefined,
        guestPhone: guestPhone || undefined,
        partySize: parseInt(partySize, 10),
        date,
        time,
        source,
        notes: notes || undefined,
        status: "confirmed",
        duration: 90,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({ title: "Reservation created" });
      setOpen(false);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setPartySize("2");
      setDate("");
      setTime("");
      setSource("phone");
      setNotes("");
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-reservation">
          <Plus className="w-4 h-4 mr-2" />
          Add Reservation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Reservation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="res-guest-name">Guest Name</Label>
            <Input
              id="res-guest-name"
              placeholder="John Doe"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              data-testid="input-res-guest-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="res-guest-email">Email</Label>
              <Input
                id="res-guest-email"
                type="email"
                placeholder="john@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                data-testid="input-res-guest-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-guest-phone">Phone</Label>
              <Input
                id="res-guest-phone"
                placeholder="(555) 123-4567"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                data-testid="input-res-guest-phone"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="res-party-size">Party Size</Label>
              <Input
                id="res-party-size"
                type="number"
                min="1"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                data-testid="input-res-party-size"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-date">Date</Label>
              <Input
                id="res-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="input-res-date"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-time">Time</Label>
              <Input
                id="res-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                data-testid="input-res-time"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger data-testid="select-res-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="widget">Widget</SelectItem>
                <SelectItem value="walk-in">Walk-in</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-notes">Notes</Label>
            <Textarea
              id="res-notes"
              placeholder="Any special requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px]"
              data-testid="textarea-res-notes"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => createMutation.mutate()}
            disabled={!guestName || !date || !time || createMutation.isPending}
            data-testid="button-submit-reservation"
          >
            {createMutation.isPending ? "Creating..." : "Create Reservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReservationsPage() {
  const { selectedVenue } = useVenue();

  const { data: allReservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations", selectedVenue?.id],
    enabled: !!selectedVenue,
  });

  const reservations = selectedVenue
    ? (allReservations || []).filter((r) => r.venueId === selectedVenue.id)
    : allReservations || [];

  const totalReservations = reservations.length;
  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const today = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter((r) => r.date === today).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Reservations</h1>
          <p className="text-muted-foreground mt-1">
            Manage guest reservations
            {selectedVenue && <span> for <span className="font-medium text-foreground">{selectedVenue.name}</span></span>}
          </p>
        </div>
        {selectedVenue && (
          <AddReservationDialog venueId={selectedVenue.id} />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Reservations", value: totalReservations, icon: CalendarDays },
          { label: "Confirmed", value: confirmed, icon: CalendarCheck },
          { label: "Today", value: todayReservations, icon: Users },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-res-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className="w-5 h-5 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Confirmation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {selectedVenue
                      ? "No reservations yet. Add your first reservation to get started."
                      : "Select a venue to view reservations."}
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((res) => (
                  <TableRow key={res.id} data-testid={`row-reservation-${res.id}`}>
                    <TableCell>
                      <span className="font-medium text-sm" data-testid={`text-res-guest-${res.id}`}>{res.guestName}</span>
                    </TableCell>
                    <TableCell className="text-sm" data-testid={`text-res-party-${res.id}`}>
                      {res.partySize}
                    </TableCell>
                    <TableCell className="text-sm">
                      {res.date}
                    </TableCell>
                    <TableCell className="text-sm">
                      {res.time}
                    </TableCell>
                    <TableCell>
                      <ReservationStatusBadge status={res.status} />
                    </TableCell>
                    <TableCell>
                      {res.source && (
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-res-source-${res.id}`}>
                          {res.source}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {res.confirmationCode || "\u2014"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
