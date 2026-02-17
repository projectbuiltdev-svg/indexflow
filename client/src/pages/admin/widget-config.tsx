import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminWidgetConfig() {
  const { data: settings, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/widget-settings"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-widget-config-title">Widget Config</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Widget Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !settings?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-widget-settings">No widget settings yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue ID</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Primary Color</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>Auto Greet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((s: any) => (
                  <TableRow key={s.id} data-testid={`row-widget-${s.id}`}>
                    <TableCell className="text-xs font-mono">{s.venueId}</TableCell>
                    <TableCell>
                      <Badge variant={s.isEnabled ? "default" : "secondary"} className="text-xs">
                        {s.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>{s.position || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: s.primaryColor || "#000" }} />
                        <span className="text-xs text-muted-foreground">{s.primaryColor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.voiceEnabled ? "default" : "secondary"} className="text-xs">
                        {s.voiceEnabled ? "On" : "Off"}
                      </Badge>
                    </TableCell>
                    <TableCell>{s.autoGreet ? "Yes" : "No"}</TableCell>
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
