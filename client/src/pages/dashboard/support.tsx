import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Ticket } from "lucide-react";

function priorityVariant(priority: string) {
  switch (priority) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "default";
    case "low": return "secondary";
    default: return "default";
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "open": return "default";
    case "in_progress": return "secondary";
    case "resolved": return "outline";
    case "closed": return "outline";
    default: return "default";
  }
}

export default function DashboardSupport() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", category: "general", priority: "medium" });

  const { data: tickets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/support-tickets", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/support-tickets?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/support-tickets", {
        venueId,
        userId: "admin",
        subject: form.subject,
        description: form.description,
        category: form.category,
        priority: form.priority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      setDialogOpen(false);
      setForm({ subject: "", description: "", category: "general", priority: "medium" });
      toast({ title: "Ticket created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
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
            <Button data-testid="button-create-ticket"><Plus className="h-4 w-4 mr-2" />Create Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Subject</Label><Input data-testid="input-ticket-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea data-testid="input-ticket-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger data-testid="select-ticket-category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger data-testid="select-ticket-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button data-testid="button-submit-ticket" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.subject || !form.description}>
                {createMutation.isPending ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t: any) => (
                  <TableRow key={t.id} data-testid={`ticket-row-${t.id}`}>
                    <TableCell>{t.subject}</TableCell>
                    <TableCell className="capitalize">{t.category}</TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(t.priority)}>{t.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                    </TableCell>
                    <TableCell>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</TableCell>
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
