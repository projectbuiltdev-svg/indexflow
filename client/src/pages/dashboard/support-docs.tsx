import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Search, FileText } from "lucide-react";

const mockDocs = [
  { id: 1, title: "Getting Started Guide", category: "Basics", updated: "2026-02-15" },
  { id: 2, title: "Widget Installation", category: "Integration", updated: "2026-02-12" },
  { id: 3, title: "AI Training Best Practices", category: "AI", updated: "2026-02-10" },
  { id: 4, title: "Twilio Setup Guide", category: "Integration", updated: "2026-02-08" },
  { id: 5, title: "API Reference", category: "Developer", updated: "2026-02-05" },
  { id: 6, title: "SEO Tools Overview", category: "SEO", updated: "2026-02-03" },
  { id: 7, title: "Billing & Subscriptions FAQ", category: "Billing", updated: "2026-01-28" },
  { id: 8, title: "White Label Configuration", category: "Settings", updated: "2026-01-25" },
];

export default function SupportDocs() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Documentation</h1>
          <p className="text-muted-foreground">Browse guides, tutorials, and API documentation</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-articles">8</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-categories">6</p>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-last-updated">Feb 15, 2026</p>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Articles</CardTitle>
            <CardDescription>Browse documentation by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border hover-elevate cursor-pointer flex-wrap" data-testid={`row-doc-${doc.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">Updated {doc.updated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{doc.category}</Badge>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
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
