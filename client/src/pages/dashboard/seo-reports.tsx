import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react";

const mockReports = [
  { id: 1, name: "Monthly SEO Report - February 2026", date: "2026-02-01", type: "Monthly", status: "ready" },
  { id: 2, name: "Monthly SEO Report - January 2026", date: "2026-01-01", type: "Monthly", status: "ready" },
  { id: 3, name: "Keyword Rankings Q4 2025", date: "2025-12-31", type: "Quarterly", status: "ready" },
  { id: 4, name: "Competitor Analysis - Feb 2026", date: "2026-02-10", type: "Custom", status: "generating" },
  { id: 5, name: "Backlink Audit Report", date: "2026-02-15", type: "Custom", status: "ready" },
];

export default function SeoReports() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">SEO Reports</h1>
            <p className="text-muted-foreground">View and download SEO performance reports</p>
          </div>
          <Button data-testid="button-generate-report">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-reports">5</p>
                  <p className="text-xs text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-avg-score">78</p>
                  <p className="text-xs text-muted-foreground">Avg. SEO Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-last-report">Feb 15, 2026</p>
                  <p className="text-xs text-muted-foreground">Last Report</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Report History</CardTitle>
            <CardDescription>Access and download past SEO reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-report-${report.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{report.type}</Badge>
                    <Badge variant={report.status === "ready" ? "default" : "secondary"} className="text-xs">
                      {report.status}
                    </Badge>
                    {report.status === "ready" && (
                      <Button variant="outline" size="sm" data-testid={`button-download-report-${report.id}`}>
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
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
