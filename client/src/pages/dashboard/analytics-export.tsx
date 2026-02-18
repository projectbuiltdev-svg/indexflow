import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Calendar, Database } from "lucide-react";

const mockExports = [
  { id: 1, name: "February 2026 - Full Report", format: "CSV", size: "2.4 MB", date: "2026-02-15", status: "ready" },
  { id: 2, name: "January 2026 - Full Report", format: "CSV", size: "2.1 MB", date: "2026-01-31", status: "ready" },
  { id: 3, name: "Q4 2025 Summary", format: "XLSX", size: "4.8 MB", date: "2025-12-31", status: "ready" },
  { id: 4, name: "Custom: Bookings Data", format: "CSV", size: "1.2 MB", date: "2026-02-10", status: "ready" },
];

export default function AnalyticsExport() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Export Data</h1>
            <p className="text-muted-foreground">Download analytics and business data</p>
          </div>
          <Button data-testid="button-new-export">
            <Download className="w-4 h-4 mr-2" />
            New Export
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-exports">4</p>
                  <p className="text-xs text-muted-foreground">Available Exports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-size">10.5 MB</p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-last-export">Feb 15, 2026</p>
                  <p className="text-xs text-muted-foreground">Last Export</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>Download previously generated data exports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExports.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-export-${exp.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{exp.name}</p>
                      <p className="text-xs text-muted-foreground">{exp.date} - {exp.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{exp.format}</Badge>
                    <Button variant="outline" size="sm" data-testid={`button-download-export-${exp.id}`}>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
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
