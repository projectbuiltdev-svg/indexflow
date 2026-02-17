import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTwilio() {
  const { data: settings, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/twilio-settings"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-twilio-title">Twilio</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Twilio Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !settings?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-twilio">No Twilio settings yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue ID</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Connected</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>SMS</TableHead>
                  <TableHead>Voicemail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((s: any) => (
                  <TableRow key={s.id} data-testid={`row-twilio-${s.id}`}>
                    <TableCell className="text-xs font-mono">{s.venueId}</TableCell>
                    <TableCell>{s.phoneNumber || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={s.isConnected ? "default" : "secondary"} className="text-xs">
                        {s.isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </TableCell>
                    <TableCell>{s.voicePersona || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={s.smsEnabled ? "default" : "secondary"} className="text-xs">
                        {s.smsEnabled ? "On" : "Off"}
                      </Badge>
                    </TableCell>
                    <TableCell>{s.voicemailEnabled ? "Yes" : "No"}</TableCell>
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
