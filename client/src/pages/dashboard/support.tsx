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
import { Plus, Ticket } from "lucide-react";

const ticketFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

function priorityVariant(priority: string) {
  switch (priority) {
    case "critical": return "destructive" as const;
    case "high": return "destructive" as const;
    case "medium": return "default" as const;
    case "low": return "secondary" as const;
    default: return "default" as const;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "open": return "default" as const;
    case "in_progress": return "secondary" as const;
    case "resolved": return "outline" as const;
    case "closed": return "outline" as const;
    default: return "default" as const;
  }
}

export default function DashboardSupport() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: { subject: "", description: "", priority: "medium" },
  });

  const { data: tickets = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/support-tickets?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: TicketFormValues) => {
      await apiRequest("POST", "/api/support-tickets", {
        venueId,
        userId: "admin",
        subject: values.subject,
        description: values.description,
        priority: values.priority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/support-tickets?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Ticket created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/support-tickets/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/support-tickets?venueId=${venueId}`] });
      toast({ title: "Ticket status updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage support tickets.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Support</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Support</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-ticket"><Plus className="h-4 w-4 mr-2" />New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem><FormLabel>Subject</FormLabel><FormControl><Input data-testid="input-ticket-subject" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea data-testid="input-ticket-description" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem><FormLabel>Priority</FormLabel><FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-ticket-priority"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-ticket">
                  {createMutation.isPending ? "Creating..." : "Create Ticket"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5" />Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No support tickets yet.</p>
          ) : (
            <Table data-testid="tickets-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t: any) => (
                  <TableRow key={t.id} data-testid={`ticket-row-${t.id}`}>
                    <TableCell>{t.subject}</TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(t.priority || "")}>{t.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(t.status || "")}>{t.status}</Badge>
                    </TableCell>
                    <TableCell>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Select
                        value={t.status || "open"}
                        onValueChange={(v) => updateStatusMutation.mutate({ id: t.id, status: v })}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-ticket-status-${t.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
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
