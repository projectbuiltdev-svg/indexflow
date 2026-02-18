import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const flaggedContent = [
  { title: "10 Ways to Boost Rankings Fast", agency: "Northstar Media", reason: "Misleading claims", flaggedBy: "Auto-filter", date: "Feb 17, 2026" },
  { title: "Guaranteed #1 Rankings", agency: "Cascade Creative", reason: "Spam content", flaggedBy: "User report", date: "Feb 16, 2026" },
  { title: "Buy Backlinks Cheap", agency: "Vertex Solutions", reason: "Policy violation", flaggedBy: "Auto-filter", date: "Feb 15, 2026" },
  { title: "Duplicate Product Page", agency: "Blue Digital Agency", reason: "Duplicate content", flaggedBy: "Auto-filter", date: "Feb 14, 2026" },
  { title: "Hidden Keyword Stuffing", agency: "Lunar Labs", reason: "SEO manipulation", flaggedBy: "Admin review", date: "Feb 13, 2026" },
];

const abuseReports = [
  { id: "RPT-001", agency: "Cascade Creative", reporter: "admin@northstar.io", description: "Copied our content without attribution", status: "Open", date: "Feb 17, 2026" },
  { id: "RPT-002", agency: "Vertex Solutions", reporter: "legal@bluedigital.com", description: "Using trademarked brand names", status: "Under Review", date: "Feb 15, 2026" },
  { id: "RPT-003", agency: "Lunar Labs", reporter: "support@cascadecreative.com", description: "Automated spam submissions", status: "Resolved", date: "Feb 12, 2026" },
  { id: "RPT-004", agency: "Northstar Media", reporter: "ops@vertexsolutions.co", description: "Scraping competitor data", status: "Open", date: "Feb 10, 2026" },
  { id: "RPT-005", agency: "Blue Digital Agency", reporter: "info@lunarlabs.dev", description: "Fake review generation", status: "Dismissed", date: "Feb 8, 2026" },
];

export default function AdminContentModeration() {
  return (
    <AdminLayout>
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Content Moderation</h1>
          <p className="text-sm text-muted-foreground">Review flagged content and abuse reports</p>
        </div>
        <Badge variant="destructive" data-testid="badge-flagged-count">12 flagged</Badge>
      </div>

      <Tabs defaultValue="flagged">
        <TabsList data-testid="tabs-moderation">
          <TabsTrigger value="flagged" data-testid="tab-flagged">Flagged Content</TabsTrigger>
          <TabsTrigger value="abuse" data-testid="tab-abuse">Abuse Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="flagged" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post Title</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Flagged By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedContent.map((item, i) => (
                    <TableRow key={i} data-testid={`row-flagged-${i}`}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.agency}</TableCell>
                      <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                      <TableCell className="text-muted-foreground">{item.flaggedBy}</TableCell>
                      <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button size="sm" data-testid={`button-review-${i}`}>Review</Button>
                          <Button variant="outline" size="sm" data-testid={`button-dismiss-${i}`}>Dismiss</Button>
                          <Button variant="destructive" size="sm" data-testid={`button-remove-${i}`}>Remove</Button>
                          <Button variant="outline" size="sm" data-testid={`button-suspend-${i}`}>Suspend</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abuse" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Abuse Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report #</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abuseReports.map((report) => (
                    <TableRow key={report.id} data-testid={`row-abuse-${report.id}`}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.agency}</TableCell>
                      <TableCell className="text-muted-foreground">{report.reporter}</TableCell>
                      <TableCell className="text-muted-foreground">{report.description}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "Open" ? "destructive" : report.status === "Under Review" ? "default" : report.status === "Resolved" ? "secondary" : "outline"}>{report.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{report.date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" data-testid={`button-view-report-${report.id}`}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}