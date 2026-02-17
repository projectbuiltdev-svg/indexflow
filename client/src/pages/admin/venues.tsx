import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Hotel, UtensilsCrossed, Wine } from "lucide-react";
import type { Venue } from "@shared/schema";

function VenueTypeBadge({ type }: { type: string }) {
  switch (type) {
    case "restaurant":
      return <Badge variant="secondary" data-testid={`badge-type-${type}`}><UtensilsCrossed className="w-3 h-3 mr-1" />{type}</Badge>;
    case "hotel":
      return <Badge variant="secondary" data-testid={`badge-type-${type}`}><Hotel className="w-3 h-3 mr-1" />{type}</Badge>;
    case "bar":
      return <Badge variant="secondary" data-testid={`badge-type-${type}`}><Wine className="w-3 h-3 mr-1" />{type}</Badge>;
    default:
      return <Badge variant="secondary" data-testid={`badge-type-${type}`}><Building2 className="w-3 h-3 mr-1" />{type}</Badge>;
  }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <Badge className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-status-${status}`}>{status}</Badge>;
  }
  return <Badge variant="outline" data-testid={`badge-status-${status}`}>{status}</Badge>;
}

export default function VenueManagement() {
  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const totalVenues = venues.length;
  const restaurants = venues.filter((v) => v.type === "restaurant").length;
  const hotels = venues.filter((v) => v.type === "hotel").length;
  const bars = venues.filter((v) => v.type === "bar").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Venue Management</h1>
        <p className="text-muted-foreground mt-1">Manage all venues across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Venues", value: totalVenues, icon: Building2 },
          { label: "Restaurants", value: restaurants, icon: UtensilsCrossed },
          { label: "Hotels", value: hotels, icon: Hotel },
          { label: "Bars", value: bars, icon: Wine },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-venue-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>{m.value}</p>
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No venues found.
                  </TableCell>
                </TableRow>
              ) : (
                venues.map((venue) => (
                  <TableRow key={venue.id} data-testid={`row-venue-${venue.id}`}>
                    <TableCell className="font-medium text-sm" data-testid={`text-venue-name-${venue.id}`}>
                      {venue.name}
                    </TableCell>
                    <TableCell>
                      <VenueTypeBadge type={venue.type} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {venue.city || "\u2014"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {venue.state || "\u2014"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {venue.phone || "\u2014"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={venue.status} />
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
