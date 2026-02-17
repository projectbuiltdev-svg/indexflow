import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminSetting } from "@shared/schema";

export default function AdminSettings() {
  const { data: settings, isLoading } = useQuery<AdminSetting[]>({ queryKey: ["/api/admin-settings"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-settings-title">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Admin Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !settings?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-settings">No admin settings configured yet</p>
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
                {settings.map((s) => (
                  <TableRow key={s.id} data-testid={`row-setting-${s.id}`}>
                    <TableCell className="font-medium font-mono text-sm">{s.key}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                      {typeof s.value === "object" ? JSON.stringify(s.value) : String(s.value ?? "—")}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : "—"}
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
