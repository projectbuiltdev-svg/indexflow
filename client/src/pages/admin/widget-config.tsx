import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import type { Venue } from "@shared/schema";
import { AdminLayout } from "@/components/admin-layout";

interface WidgetSetting {
  id: number;
  venueId: string;
  isEnabled: boolean | null;
  primaryColor: string | null;
  position: string | null;
  voiceEnabled: boolean | null;
  welcomeMessage: string | null;
}

export default function AdminWidgetConfig() {
  useVenue();

  const { data: venues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: allWidgetSettings = [], isLoading: widgetLoading } = useQuery<WidgetSetting[]>({
    queryKey: ["/api/admin/widget-settings"],
  });

  const isLoading = venuesLoading || widgetLoading;
  const venueMap = new Map(venues.map((v) => [v.id, v]));

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-widget-config">
          Widget Configuration
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Widget Settings by Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : allWidgetSettings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-widget-config">
              No widget settings found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Voice Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allWidgetSettings.map((ws) => (
                  <TableRow key={ws.id} data-testid={`row-widget-${ws.id}`}>
                    <TableCell className="font-medium">
                      {venueMap.get(ws.venueId)?.name || ws.venueId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ws.isEnabled ? "default" : "outline"}>
                        {ws.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-sm border"
                          style={{ backgroundColor: ws.primaryColor || "#000" }}
                        />
                        <span className="text-muted-foreground text-sm">{ws.primaryColor || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ws.position || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={ws.voiceEnabled ? "default" : "outline"}>
                        {ws.voiceEnabled ? "Yes" : "No"}
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
    </AdminLayout>
  );
}
