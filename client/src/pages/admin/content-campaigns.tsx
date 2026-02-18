import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const campaigns = [
  { name: "Spring Content Blitz", agency: "Blue Digital Agency", workspace: "Marketing Hub", postCount: 24, status: "Active", created: "Feb 10, 2026" },
  { name: "SEO Landing Pages Q1", agency: "Northstar Media", workspace: "SEO Portal", postCount: 18, status: "Active", created: "Feb 5, 2026" },
  { name: "Product Launch Series", agency: "Cascade Creative", workspace: "Launch Pad", postCount: 12, status: "Draft", created: "Feb 1, 2026" },
  { name: "Year-End Review", agency: "Vertex Solutions", workspace: "Content Studio", postCount: 8, status: "Completed", created: "Dec 15, 2025" },
  { name: "Brand Awareness Push", agency: "Lunar Labs", workspace: "Growth Engine", postCount: 32, status: "Paused", created: "Jan 20, 2026" },
];

export default function AdminContentCampaigns() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Campaigns</h1>
        <p className="text-sm text-muted-foreground">Content campaigns across all clients</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-6">
        <Select data-testid="select-agency-filter">
          <SelectTrigger className="w-48" data-testid="filter-agency">
            <SelectValue placeholder="All Agencies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agencies</SelectItem>
            <SelectItem value="blue-digital">Blue Digital Agency</SelectItem>
            <SelectItem value="northstar">Northstar Media</SelectItem>
            <SelectItem value="cascade">Cascade Creative</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40" data-testid="filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" data-testid="filter-date-start" />
        <Input type="date" className="w-40" data-testid="filter-date-end" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead>Post Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.name} data-testid={`row-campaign-${c.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.agency}</TableCell>
                  <TableCell className="text-muted-foreground">{c.workspace}</TableCell>
                  <TableCell>{c.postCount}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Active" ? "default" : c.status === "Completed" ? "secondary" : "outline"}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.created}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm" data-testid={`button-view-campaign-${c.name.toLowerCase().replace(/\s+/g, "-")}`}>View</Button>
                      <Button variant="destructive" size="sm" data-testid={`button-delete-campaign-${c.name.toLowerCase().replace(/\s+/g, "-")}`}>Delete</Button>
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