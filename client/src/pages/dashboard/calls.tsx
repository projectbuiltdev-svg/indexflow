import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Plus } from "lucide-react";

const callFormSchema = z.object({
  callerPhone: z.string().min(1, "Phone number is required"),
  duration: z.coerce.number().min(0).optional(),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

type CallFormValues = z.infer<typeof callFormSchema>;

function callStatusVariant(status: string) {
  switch (status) {
    case "completed": return "default" as const;
    case "missed": return "destructive" as const;
    case "voicemail": return "secondary" as const;
    case "in-progress": return "outline" as const;
    default: return "default" as const;
  }
}

export default function DashboardCalls() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<CallFormValues>({
    resolver: zodResolver(callFormSchema),
    defaultValues: { callerPhone: "", duration: 0, status: "completed", notes: "" },
  });

  const { data: callLogs = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/call-logs?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: CallFormValues) => {
      await apiRequest("POST", "/api/call-logs", {
        venueId,
        callerPhone: values.callerPhone,
        duration: values.duration || undefined,
        status: values.status,
        aiSummary: values.notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/call-logs?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Call logged" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to view call logs.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Call Logs</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Call Logs</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-log-call"><Plus className="h-4 w-4 mr-2" />Log Call</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Call</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="callerPhone" render={({ field }) => (
                  <FormItem><FormLabel>Caller Phone</FormLabel><FormControl><Input data-testid="input-caller-phone" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem><FormLabel>Duration (seconds)</FormLabel><FormControl><Input data-testid="input-duration" type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-call-status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="missed">Missed</SelectItem>
                        <SelectItem value="voicemail">Voicemail</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea data-testid="input-call-notes" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-call">
                  {createMutation.isPending ? "Logging..." : "Log Call"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {callLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-testid="empty-state">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No call logs yet.</p>
            </div>
          ) : (
            <Table data-testid="call-logs-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Caller Phone</TableHead>
                  <TableHead>Duration (s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogs.map((log: any) => (
                  <TableRow key={log.id} data-testid={`call-row-${log.id}`}>
                    <TableCell>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{log.callerPhone || "-"}</TableCell>
                    <TableCell>{log.duration ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={callStatusVariant(log.status || "")} data-testid={`call-status-${log.id}`}>
                        {log.status || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.aiSummary || "-"}</TableCell>
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
