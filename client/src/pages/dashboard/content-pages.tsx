import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout, Plus, Globe, FileText } from "lucide-react";

const mockPages = [
  { id: 1, title: "Home", slug: "/", status: "published", lastUpdated: "2026-02-14" },
  { id: 2, title: "About Us", slug: "/about", status: "published", lastUpdated: "2026-02-10" },
  { id: 3, title: "Services", slug: "/services", status: "published", lastUpdated: "2026-02-08" },
  { id: 4, title: "Contact", slug: "/contact", status: "published", lastUpdated: "2026-02-05" },
  { id: 5, title: "Case Studies", slug: "/case-studies", status: "draft", lastUpdated: "2026-02-16" },
  { id: 6, title: "Pricing", slug: "/pricing", status: "draft", lastUpdated: "2026-02-17" },
];

export default function ContentPages() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Pages</h1>
            <p className="text-muted-foreground">Manage website pages for your workspace</p>
          </div>
          <Button data-testid="button-create-page">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-pages">6</p>
                  <p className="text-xs text-muted-foreground">Total Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-live-pages">4</p>
                  <p className="text-xs text-muted-foreground">Live Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-draft-pages">2</p>
                  <p className="text-xs text-muted-foreground">Draft Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>View and edit your website pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-page-${page.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{page.title}</p>
                    <p className="text-xs text-muted-foreground">{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={page.status === "published" ? "default" : "secondary"} className="text-xs">
                      {page.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{page.lastUpdated}</span>
                    <Button variant="outline" size="sm" data-testid={`button-edit-page-${page.id}`}>Edit</Button>
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
