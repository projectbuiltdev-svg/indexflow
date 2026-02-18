import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, Mail } from "lucide-react";

const mockMembers = [
  { id: 1, name: "Alex Morgan", email: "alex@company.com", role: "owner", status: "active", joined: "2025-06-15" },
  { id: 2, name: "Jordan Lee", email: "jordan@company.com", role: "admin", status: "active", joined: "2025-08-20" },
  { id: 3, name: "Casey Rivera", email: "casey@company.com", role: "editor", status: "active", joined: "2025-11-10" },
  { id: 4, name: "Taylor Kim", email: "taylor@company.com", role: "viewer", status: "pending", joined: "2026-02-16" },
];

export default function SettingsTeam() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Team & Invites</h1>
            <p className="text-muted-foreground">Manage team members and their permissions</p>
          </div>
          <Button data-testid="button-invite-member">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-members">4</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-admins">2</p>
                  <p className="text-xs text-muted-foreground">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-pending-invites">1</p>
                  <p className="text-xs text-muted-foreground">Pending Invites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-active-members">3</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage access and roles for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-member-${member.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email} - Joined {member.joined}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs capitalize">{member.role}</Badge>
                    <Badge variant={member.status === "active" ? "default" : "secondary"} className="text-xs">
                      {member.status}
                    </Badge>
                    <Button variant="outline" size="sm" data-testid={`button-manage-member-${member.id}`}>Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
