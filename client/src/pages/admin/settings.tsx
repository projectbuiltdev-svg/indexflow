import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings } from "lucide-react";

interface AdminSetting {
  id: number;
  key: string;
  value: unknown;
  updatedAt: string | null;
}

const platformFormSchema = z.object({
  platformName: z.string().min(1, "Platform name is required"),
  supportEmail: z.string().email("Valid email required"),
  timezone: z.string().min(1, "Timezone is required"),
});

type PlatformFormValues = z.infer<typeof platformFormSchema>;

export default function AdminSettings() {
  useVenue();
  const { toast } = useToast();

  const { data: settings = [], isLoading } = useQuery<AdminSetting[]>({
    queryKey: ["/api/admin-settings"],
  });

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: { platformName: "IndexFlow", supportEmail: "support@indexflow.com", timezone: "America/New_York" },
  });

  const handleSave = (data: PlatformFormValues) => {
    toast({ title: "Settings saved", description: `Platform: ${data.platformName}, Email: ${data.supportEmail}` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-settings">Admin Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 max-w-md">
              <FormField control={form.control} name="platformName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Name</FormLabel>
                  <FormControl><Input {...field} data-testid="input-platform-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="supportEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email</FormLabel>
                  <FormControl><Input {...field} type="email" data-testid="input-support-email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="timezone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl><Input {...field} data-testid="input-timezone" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" data-testid="button-save-settings">
                Save Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
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
