import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Globe, Send } from "lucide-react";

function statusVariant(status: string) {
  switch (status) {
    case "pending": return "default";
    case "in_progress": return "secondary";
    case "completed": return "outline";
    case "rejected": return "destructive";
    default: return "default";
  }
}

export default function WebsiteChanges() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [form, setForm] = useState({ changeType: "text", description: "", pageUrl: "" });

  const { data: requests = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/website-change-requests", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/website-change-requests?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/website-change-requests", {
        venueId,
        userId: "admin",
        changeType: form.changeType,
        description: form.description,
        pageUrl: form.pageUrl || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/website-change-requests"] });
      setForm({ changeType: "text", description: "", pageUrl: "" });
      toast({ title: "Change request submitted" });
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
        <h1 className="text-2xl font-semibold">Website Changes</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Website Changes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submit Change Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Change Type</Label>
            <Select value={form.changeType} onValueChange={(v) => setForm({ ...form, changeType: v })}>
              <SelectTrigger data-testid="select-change-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="layout">Layout</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Textarea data-testid="input-change-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Page URL</Label><Input data-testid="input-page-url" value={form.pageUrl} onChange={(e) => setForm({ ...form, pageUrl: e.target.value })} placeholder="https://" /></div>
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.description} data-testid="button-submit-change">
            <Send className="h-4 w-4 mr-2" />{createMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Change Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No change requests yet.</p>
          ) : (
            <Table data-testid="changes-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Page URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r: any) => (
                  <TableRow key={r.id} data-testid={`change-row-${r.id}`}>
                    <TableCell className="capitalize">{r.changeType}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.description}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.pageUrl || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                    </TableCell>
                    <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</TableCell>
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
