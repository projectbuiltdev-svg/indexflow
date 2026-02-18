import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, Plus, ExternalLink, AlertCircle } from "lucide-react";

const mockLinks = [
  { id: 1, source: "/services", target: "/pricing", anchor: "View pricing", status: "active", type: "internal" },
  { id: 2, source: "/blog/seo-tips", target: "/services", anchor: "View our services", status: "active", type: "internal" },
  { id: 3, source: "/about", target: "/contact", anchor: "Get in touch", status: "active", type: "internal" },
  { id: 4, source: "/solutions", target: "/case-studies", anchor: "View case studies", status: "broken", type: "internal" },
  { id: 5, source: "/blog/tips", target: "https://example.com/article", anchor: "Read more", status: "active", type: "external" },
];

export default function SeoLinks() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Internal Links</h1>
            <p className="text-muted-foreground">Manage internal and external link structure</p>
          </div>
          <Button data-testid="button-add-link">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-links">5</p>
                  <p className="text-xs text-muted-foreground">Total Links</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-internal-links">4</p>
                  <p className="text-xs text-muted-foreground">Internal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-external-links">1</p>
                  <p className="text-xs text-muted-foreground">External</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-broken-links">1</p>
                  <p className="text-xs text-muted-foreground">Broken</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Link Inventory</CardTitle>
            <CardDescription>Monitor and optimize your link structure for SEO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-link-${link.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{link.source} &rarr; {link.target}</p>
                    <p className="text-xs text-muted-foreground">Anchor: "{link.anchor}"</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{link.type}</Badge>
                    <Badge variant={link.status === "active" ? "default" : "destructive"} className="text-xs">
                      {link.status}
                    </Badge>
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
