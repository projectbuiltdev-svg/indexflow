import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BedDouble } from "lucide-react";

function bookingStatusVariant(status: string) {
  switch (status) {
    case "confirmed": return "default";
    case "checked_in": return "secondary";
    case "checked_out": return "outline";
    case "cancelled": return "destructive";
    default: return "default";
  }
}

export default function RoomBookings() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;

  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/room-bookings", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/room-bookings?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Room Bookings</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Room Bookings</h1>
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
                  <TableHead>Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b: any) => (
                  <TableRow key={b.id} data-testid={`room-booking-row-${b.id}`}>
                    <TableCell>{b.guestName}</TableCell>
                    <TableCell>{b.roomId}</TableCell>
                    <TableCell>{b.checkIn}</TableCell>
                    <TableCell>{b.checkOut}</TableCell>
                    <TableCell>
                      <Badge variant={bookingStatusVariant(b.status)} data-testid={`room-booking-status-${b.id}`}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{b.totalAmount ? `$${b.totalAmount}` : "-"}</TableCell>
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
