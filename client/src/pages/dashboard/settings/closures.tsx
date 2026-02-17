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
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, XCircle } from "lucide-react";

const closureFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  reason: z.string().optional(),
  allDay: z.boolean(),
});

type ClosureFormValues = z.infer<typeof closureFormSchema>;

export default function SettingsClosures() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ClosureFormValues>({
    resolver: zodResolver(closureFormSchema),
    defaultValues: { date: "", reason: "", allDay: true },
  });

  const { data: closures = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/closures?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: ClosureFormValues) => {
      await apiRequest("POST", "/api/closures", {
        venueId,
        date: values.date,
        reason: values.reason || undefined,
        allDay: values.allDay,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/closures?venueId=${venueId}`] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Closure added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/closures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/closures?venueId=${venueId}`] });
      toast({ title: "Closure removed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage closures.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Closures</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Closures</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-closure"><Plus className="h-4 w-4 mr-2" />Add Closure</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Closure</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input data-testid="input-closure-date" type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="reason" render={({ field }) => (
                  <FormItem><FormLabel>Reason</FormLabel><FormControl><Input data-testid="input-closure-reason" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="allDay" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel>All Day</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-all-day" />
                    </FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-closure">
                  {createMutation.isPending ? "Adding..." : "Add Closure"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><XCircle className="h-5 w-5" />Scheduled Closures</CardTitle>
        </CardHeader>
        <CardContent>
          {closures.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No closures scheduled.</p>
          ) : (
            <Table data-testid="closures-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>All Day</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closures.map((c: any) => (
                  <TableRow key={c.id} data-testid={`closure-row-${c.id}`}>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.reason || "-"}</TableCell>
                    <TableCell><Badge variant={c.allDay ? "default" : "secondary"}>{c.allDay ? "Yes" : "No"}</Badge></TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(c.id)} data-testid={`button-delete-closure-${c.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
