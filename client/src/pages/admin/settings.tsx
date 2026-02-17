import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

interface AdminSetting {
  id: number;
  key: string;
  value: unknown;
  updatedAt: string | null;
}

export default function AdminSettings() {
  useVenue();

  const { data: settings = [], isLoading } = useQuery<AdminSetting[]>({
    queryKey: ["/api/admin-settings"],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-settings">
          Admin Settings
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : settings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-settings">
              No settings configured.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id} data-testid={`row-setting-${setting.id}`}>
                    <TableCell className="font-medium font-mono text-sm">{setting.key}</TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate">
                      {typeof setting.value === "object"
                        ? JSON.stringify(setting.value)
                        : String(setting.value ?? "-")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {setting.updatedAt ? new Date(setting.updatedAt).toLocaleDateString() : "-"}
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
