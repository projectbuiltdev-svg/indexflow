import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Globe, UserPlus } from "lucide-react";

const stats = [
  { label: "Pending Signups", value: "6", icon: UserPlus },
  { label: "Domain Verifications", value: "3", icon: Globe },
  { label: "Awaiting Review", value: "4", icon: Clock },
  { label: "Approved Today", value: "2", icon: ShieldCheck },
];

const pendingSignups = [
  { name: "Downtown Dining LLC", email: "info@downtowndining.com", date: "Feb 17, 2026", type: "New Agency" },
  { name: "Riviera Restaurant Group", email: "admin@rivieragroup.com", date: "Feb 16, 2026", type: "New Agency" },
  { name: "East Side Eats", email: "hello@eastsideeats.com", date: "Feb 15, 2026", type: "New Agency" },
];

const domainVerifications = [
  { domain: "coastaldining.com", agency: "Coastal Dining Co.", submitted: "Feb 14, 2026", status: "DNS Pending" },
  { domain: "alpinehotels.ch", agency: "Alpine Hotels Ltd.", submitted: "Feb 13, 2026", status: "Under Review" },
  { domain: "metrobistro.nyc", agency: "Metro Bistro Group", submitted: "Feb 12, 2026", status: "DNS Pending" },
];

export default function AdminAgenciesPending() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Pending Approvals</h1>
        <p className="text-muted-foreground">Review and approve pending agency signups and domain verifications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Signups</CardTitle>
            <CardDescription>New agency registrations awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSignups.map((signup) => (
                <div key={signup.email} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-pending-signup-${signup.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div>
                    <p className="font-medium">{signup.name}</p>
                    <p className="text-sm text-muted-foreground">{signup.email} &middot; {signup.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{signup.type}</Badge>
                    <Button size="sm" data-testid={`button-approve-${signup.name.toLowerCase().replace(/\s+/g, "-")}`}>Approve</Button>
                    <Button variant="outline" size="sm" data-testid={`button-reject-${signup.name.toLowerCase().replace(/\s+/g, "-")}`}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Verifications</CardTitle>
            <CardDescription>Custom domains pending DNS verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domainVerifications.map((domain) => (
                <div key={domain.domain} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-domain-${domain.domain}`}>
                  <div>
                    <p className="font-medium">{domain.domain}</p>
                    <p className="text-sm text-muted-foreground">{domain.agency} &middot; Submitted {domain.submitted}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{domain.status}</Badge>
                    <Button variant="outline" size="sm" data-testid={`button-verify-${domain.domain}`}>Verify</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
