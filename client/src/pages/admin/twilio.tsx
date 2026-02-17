import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone } from "lucide-react";
import type { Venue } from "@shared/schema";

interface TwilioSetting {
  id: number;
  venueId: string;
  accountSid: string | null;
  phoneNumber: string | null;
  isConnected: boolean | null;
  voicePersona: string | null;
  maxCallDuration: number | null;
}

export default function AdminTwilio() {
  useVenue();

  const { data: venues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: allTwilioSettings = [], isLoading: twilioLoading } = useQuery<TwilioSetting[]>({
    queryKey: ["/api/admin/twilio-settings"],
  });

  const isLoading = venuesLoading || twilioLoading;
  const venueMap = new Map(venues.map((v) => [v.id, v]));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Phone className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-twilio">
          Twilio Settings
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Twilio Configuration by Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : allTwilioSettings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-twilio">
              No Twilio settings configured.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Account SID</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Connected</TableHead>
                  <TableHead>Voice Persona</TableHead>
                  <TableHead>Max Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTwilioSettings.map((ts) => (
                  <TableRow key={ts.id} data-testid={`row-twilio-${ts.id}`}>
                    <TableCell className="font-medium">
                      {venueMap.get(ts.venueId)?.name || ts.venueId}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {ts.accountSid ? `${ts.accountSid.slice(0, 10)}...` : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ts.phoneNumber || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={ts.isConnected ? "default" : "outline"}>
                        {ts.isConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ts.voicePersona || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {ts.maxCallDuration ? `${ts.maxCallDuration} min` : "-"}
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
