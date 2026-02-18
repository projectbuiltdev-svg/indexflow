import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const pendingAgencies = [
  { name: "Spark Digital Co.", owner: "Liam Torres", email: "liam@sparkdigital.com", plan: "Professional", domain: "sparkdigital.com", submitted: "Feb 16, 2026" },
  { name: "Northstar Media", owner: "Ava Nguyen", email: "ava@northstarmedia.io", plan: "Enterprise", domain: "northstarmedia.io", submitted: "Feb 15, 2026" },
  { name: "Cascade Creative", owner: "Ethan Brooks", email: "ethan@cascadecreative.com", plan: "Starter", domain: "cascadecreative.com", submitted: "Feb 14, 2026" },
  { name: "Vertex Solutions", owner: "Mia Ramirez", email: "mia@vertexsolutions.co", plan: "Professional", domain: "vertexsolutions.co", submitted: "Feb 13, 2026" },
  { name: "Lunar Labs", owner: "Noah Kim", email: "noah@lunarlabs.dev", plan: "Starter", domain: "lunarlabs.dev", submitted: "Feb 12, 2026" },
];

export default function AdminAgenciesPending() {
  return (
    <AdminLayout>
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">Review and approve new client applications</p>
        </div>
        <Badge data-testid="badge-pending-count">8</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Agency Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested Plan</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAgencies.map((agency) => (
                <TableRow key={agency.email} data-testid={`row-pending-${agency.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <TableCell className="font-medium">{agency.name}</TableCell>
                  <TableCell>{agency.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{agency.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agency.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{agency.domain}</TableCell>
                  <TableCell className="text-muted-foreground">{agency.submitted}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" data-testid={`button-approve-${agency.name.toLowerCase().replace(/\s+/g, "-")}`}>Approve</Button>
                      <Button variant="destructive" size="sm" data-testid={`button-reject-${agency.name.toLowerCase().replace(/\s+/g, "-")}`}>Reject</Button>
                      <Button variant="outline" size="sm" data-testid={`button-view-details-${agency.name.toLowerCase().replace(/\s+/g, "-")}`}>View Details</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}