import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

const mockIssues = [
  { id: 1, page: "/services", issue: "Missing meta description", severity: "warning", category: "Meta Tags" },
  { id: 2, page: "/about", issue: "Images missing alt text (3 images)", severity: "warning", category: "Accessibility" },
  { id: 3, page: "/case-studies", issue: "Page load time exceeds 3s", severity: "error", category: "Performance" },
  { id: 4, page: "/blog/seo-guide", issue: "Duplicate H1 tag", severity: "error", category: "Content" },
  { id: 5, page: "/contact", issue: "No structured data found", severity: "info", category: "Schema" },
];

export default function SeoHealth() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">SEO Health</h1>
            <p className="text-muted-foreground">Audit and monitor your website's SEO performance</p>
          </div>
          <Button data-testid="button-run-audit">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-health-score">72</p>
                  <p className="text-xs text-muted-foreground">Health Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-passed-checks">18</p>
                  <p className="text-xs text-muted-foreground">Passed Checks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-warnings">3</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-errors">2</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Issues Found</CardTitle>
            <CardDescription>Address these issues to improve your SEO score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-issue-${issue.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {issue.severity === "error" && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {issue.severity === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />}
                    {issue.severity === "info" && <Activity className="w-4 h-4 text-blue-500 shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{issue.issue}</p>
                      <p className="text-xs text-muted-foreground">{issue.page}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{issue.category}</Badge>
                    <Button variant="outline" size="sm" data-testid={`button-fix-issue-${issue.id}`}>Fix</Button>
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
