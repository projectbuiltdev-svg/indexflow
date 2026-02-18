import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, UserMinus, RotateCcw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialMembers = [
  { id: 1, name: "Alex Morgan", email: "alex@company.com", role: "owner", status: "Active", joined: "2025-06-15" },
  { id: 2, name: "Jordan Lee", email: "jordan@company.com", role: "admin", status: "Active", joined: "2025-08-20" },
  { id: 3, name: "Casey Rivera", email: "casey@company.com", role: "editor", status: "Active", joined: "2025-11-10" },
  { id: 4, name: "Taylor Kim", email: "taylor@company.com", role: "viewer", status: "Active", joined: "2026-01-05" },
];

const initialPendingInvites = [
  { id: 1, email: "sam@company.com", role: "editor", invited: "2026-02-15", status: "Pending" },
  { id: 2, email: "pat@company.com", role: "viewer", invited: "2026-02-17", status: "Pending" },
];

export default function SettingsTeamNew() {
  const { toast } = useToast();
  const [members, setMembers] = useState(initialMembers);
  const [pendingInvites, setPendingInvites] = useState(initialPendingInvites);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState<number | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newInvite = {
      id: Date.now(),
      email: inviteEmail.trim(),
      role: inviteRole,
      invited: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    setPendingInvites((prev) => [...prev, newInvite]);
    toast({ title: "Invitation sent", description: `Invited ${inviteEmail} as ${inviteRole}` });
    setInviteEmail("");
    setInviteRole("editor");
    setInviteOpen(false);
  };

  const handleRoleChange = (memberId: number, newRole: string) => {
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: newRole } : m));
    toast({ title: "Role updated", description: `Role changed to ${newRole}` });
  };

  const confirmRemove = () => {
    if (removeMemberId === null) return;
    const member = members.find((m) => m.id === removeMemberId);
    setMembers((prev) => prev.filter((m) => m.id !== removeMemberId));
    toast({ title: "Member removed", description: `${member?.name || "Member"} has been removed from the team` });
    setRemoveMemberId(null);
    setRemoveOpen(false);
  };

  const handleResendInvite = (invId: number) => {
    const inv = pendingInvites.find((i) => i.id === invId);
    toast({ title: "Invitation resent", description: `Resent invitation to ${inv?.email}` });
  };

  const handleCancelInvite = (invId: number) => {
    const inv = pendingInvites.find((i) => i.id === invId);
    setPendingInvites((prev) => prev.filter((i) => i.id !== invId));
    toast({ title: "Invitation cancelled", description: `Cancelled invitation to ${inv?.email}` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Team</h1>
        <Button data-testid="button-invite-member" onClick={() => setInviteOpen(true)}>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                  <TableCell className="font-medium" data-testid={`text-member-name-${m.id}`}>{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.email}</TableCell>
                  <TableCell>
                    <Select value={m.role} onValueChange={(val) => handleRoleChange(m.id, val)}>
                      <SelectTrigger className="w-[120px]" data-testid={`select-role-${m.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge data-testid={`badge-member-status-${m.id}`}>{m.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.joined}</TableCell>
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
              {pendingInvites.map((inv) => (
                <TableRow key={inv.id} data-testid={`row-invite-${inv.id}`}>
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell className="capitalize">{inv.role}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.invited}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" data-testid={`badge-invite-status-${inv.id}`}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="icon" data-testid={`button-resend-invite-${inv.id}`} onClick={() => handleResendInvite(inv.id)}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-cancel-invite-${inv.id}`} onClick={() => handleCancelInvite(inv.id)}>
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
            <Button onClick={handleInvite} data-testid="button-send-invite">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to remove <span className="font-medium text-foreground">{members.find((m) => m.id === removeMemberId)?.name}</span> from the team? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)} data-testid="button-cancel-remove">Cancel</Button>
            <Button variant="destructive" onClick={confirmRemove} data-testid="button-confirm-remove">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
