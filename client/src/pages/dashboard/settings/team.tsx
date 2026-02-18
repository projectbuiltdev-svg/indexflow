import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Users, Plus, Trash2, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TeamMember {
  id: number;
  workspaceId: string;
  userId: string | null;
  email: string;
  role: string;
  status: string;
  invitedAt: string;
  acceptedAt: string | null;
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600",
  manager: "bg-blue-500/10 text-blue-600",
  staff: "bg-green-500/10 text-green-600",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  accepted: "bg-green-500/10 text-green-600",
};

export default function SettingsTeam() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("staff");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Team - indexFlow Dashboard";
  }, []);

  const { data: team = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/workspaces", workspaceId, "team"],
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; role: string }) =>
      apiRequest("POST", `/api/workspaces/${workspaceId}/team`, { ...data, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "team"] });
      setNewEmail("");
      toast({ title: "Team member added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add team member.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/team/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "team"] });
      toast({ title: "Team member removed" });
    },
  });

  const handleInvite = () => {
    if (!newEmail) return;
    inviteMutation.mutate({ email: newEmail, role: newRole });
  };

  const handleRemoveMember = (member: TeamMember) => {
    deleteMutation.mutate(member.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground">Manage who has access to your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Invite Team Member
            </CardTitle>
            <CardDescription>
              Send an invitation to join your workspace dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 flex-1 min-w-48">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="colleague@restaurant.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  data-testid="input-invite-email"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v)}>
                  <SelectTrigger className="w-32" data-testid="select-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} className="gap-2" disabled={inviteMutation.isPending} data-testid="button-invite">
                <Mail className="w-4 h-4" />
                Send Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : team.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No team members yet. Invite someone above.</p>
            ) : (
              <div className="space-y-3">
                {team.map((member) => {
                  const username = member.email.split("@")[0];
                  const initials = username.slice(0, 2).toUpperCase();
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3"
                      data-testid={`team-member-${member.id}`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm sm:text-base flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-sm sm:text-base truncate">{username}</p>
                            <Badge className={`${roleColors[member.role] || roleColors.staff} text-xs`}>
                              {member.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </Badge>
                            <Badge className={`${statusColors[member.status] || statusColors.pending} text-xs`}>
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.email}</p>
                        </div>
                      </div>
                      {member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive flex-shrink-0"
                          onClick={() => handleRemoveMember(member)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-remove-${member.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Badge className={roleColors.admin}>Admin</Badge>
                <p className="text-muted-foreground">Full access to all settings, billing, and team management.</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className={roleColors.manager}>Manager</Badge>
                <p className="text-muted-foreground">Can manage bookings, view analytics, and update hours/closures.</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className={roleColors.staff}>Staff</Badge>
                <p className="text-muted-foreground">Can view and manage today's bookings only.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
