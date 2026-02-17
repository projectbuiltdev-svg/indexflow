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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users } from "lucide-react";

export default function SettingsTeam() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "staff" });

  const { data: members = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/team-members", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/team-members?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/team-members", { venueId, email: form.email, role: form.role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      setDialogOpen(false);
      setForm({ email: "", role: "staff" });
      toast({ title: "Team member invited" });
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
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Team Members</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-member"><Plus className="h-4 w-4 mr-2" />Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Email</Label><Input data-testid="input-member-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger data-testid="select-member-role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button data-testid="button-submit-member" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.email}>
                {createMutation.isPending ? "Inviting..." : "Invite Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Team</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No team members yet.</p>
          ) : (
            <Table data-testid="team-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m: any) => (
                  <TableRow key={m.id} data-testid={`member-row-${m.id}`}>
                    <TableCell>{m.email}</TableCell>
                    <TableCell className="capitalize">{m.role}</TableCell>
                    <TableCell>
                      <Badge variant={m.status === "active" ? "default" : "secondary"}>{m.status}</Badge>
                    </TableCell>
                    <TableCell>{m.invitedAt ? new Date(m.invitedAt).toLocaleDateString() : "-"}</TableCell>
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
