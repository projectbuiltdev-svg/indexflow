import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserMinus, RotateCcw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TeamMember } from "@shared/schema";

export default function SettingsTeamNew() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState<number | null>(null);

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/workspaces", workspaceId, "team"],
    enabled: !!workspaceId,
  });

  const activeMembers = teamMembers.filter((m) => m.status === "accepted");
  const pendingInvites = teamMembers.filter((m) => m.status === "pending");

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const res = await apiRequest("POST", `/api/workspaces/${workspaceId}/team`, {
        email: data.email,
        role: data.role,
        status: "pending",
      });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "team"] });
      toast({ title: "Invitation sent", description: `Invited ${variables.email} as ${variables.role}` });
      setInviteEmail("");
      setInviteRole("editor");
      setInviteOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to send invite", description: error.message, variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await apiRequest("PATCH", `/api/team/${id}`, { role });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "team"] });
      toast({ title: "Role updated", description: `Role changed to ${variables.role}` });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "team"] });
      toast({ title: "Member removed", description: "Team member has been removed" });
      setRemoveMemberId(null);
      setRemoveOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to remove member", description: error.message, variant: "destructive" });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/team/${id}`, { status: "pending" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "team"] });
      toast({ title: "Invitation resent", description: "Invitation has been resent" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to resend invite", description: error.message, variant: "destructive" });
    },
  });

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    inviteMutation.mutate({ email: inviteEmail.trim(), role: inviteRole });
  };

  const handleRoleChange = (memberId: number, newRole: string) => {
    updateRoleMutation.mutate({ id: memberId, role: newRole });
  };

  const confirmRemove = () => {
    if (removeMemberId === null) return;
    removeMutation.mutate(removeMemberId);
  };

  const handleResendInvite = (invId: number) => {
    resendMutation.mutate(invId);
  };

  const handleCancelInvite = (invId: number) => {
    removeMutation.mutate(invId);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Team</h1>
        <Button data-testid="button-invite-member" onClick={() => setInviteOpen(true)} disabled={inviteMutation.isPending}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No active team members</TableCell>
                </TableRow>
              )}
              {activeMembers.map((m) => (
                <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                  <TableCell className="font-medium" data-testid={`text-member-email-${m.id}`}>{m.email}</TableCell>
                  <TableCell>
                    <Select value={m.role || "staff"} onValueChange={(val) => handleRoleChange(m.id, val)}>
                      <SelectTrigger className="w-[120px]" data-testid={`select-role-${m.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge data-testid={`badge-member-status-${m.id}`}>Active</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.acceptedAt ? new Date(m.acceptedAt).toLocaleDateString() : m.invitedAt ? new Date(m.invitedAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-remove-member-${m.id}`}
                        onClick={() => { setRemoveMemberId(m.id); setRemoveOpen(true); }}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInvites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No pending invites</TableCell>
                </TableRow>
              )}
              {pendingInvites.map((inv) => (
                <TableRow key={inv.id} data-testid={`row-invite-${inv.id}`}>
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell className="capitalize">{inv.role}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.invitedAt ? new Date(inv.invitedAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" data-testid={`badge-invite-status-${inv.id}`}>Pending</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="icon" data-testid={`button-resend-invite-${inv.id}`} onClick={() => handleResendInvite(inv.id)} disabled={resendMutation.isPending}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-cancel-invite-${inv.id}`} onClick={() => handleCancelInvite(inv.id)} disabled={removeMutation.isPending}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="member@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                data-testid="input-invite-email"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger data-testid="select-invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)} data-testid="button-cancel-invite-dialog">Cancel</Button>
            <Button onClick={handleInvite} disabled={inviteMutation.isPending} data-testid="button-send-invite">
              {inviteMutation.isPending ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to remove <span className="font-medium text-foreground">{teamMembers.find((m) => m.id === removeMemberId)?.email}</span> from the team? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)} data-testid="button-cancel-remove">Cancel</Button>
            <Button variant="destructive" onClick={confirmRemove} disabled={removeMutation.isPending} data-testid="button-confirm-remove">
              {removeMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
