import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, CheckCircle, Link2 } from "lucide-react";

const mockIntegrations = [
  { id: 1, name: "WordPress", status: "connected", lastSync: "2026-02-18 09:30", pages: 12 },
  { id: 2, name: "Shopify", status: "disconnected", lastSync: "Never", pages: 0 },
  { id: 3, name: "Webflow", status: "disconnected", lastSync: "Never", pages: 0 },
  { id: 4, name: "Custom CMS", status: "connected", lastSync: "2026-02-17 14:20", pages: 6 },
];

export default function SeoCms() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">CMS Integration</h1>
          <p className="text-muted-foreground">Connect your content management system for SEO optimization</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-cms-count">4</p>
                  <p className="text-xs text-muted-foreground">CMS Platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-connected">2</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-synced-pages">18</p>
                  <p className="text-xs text-muted-foreground">Synced Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>CMS Platforms</CardTitle>
            <CardDescription>Manage your CMS connections for automated SEO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {mockIntegrations.map((cms) => (
                <Card key={cms.id} data-testid={`card-cms-${cms.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                      <h3 className="font-semibold">{cms.name}</h3>
                      <Badge variant={cms.status === "connected" ? "default" : "secondary"} className="text-xs">
                        {cms.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <p>Last sync: {cms.lastSync}</p>
                      <p>Pages: {cms.pages}</p>
                    </div>
                    <Button
                      variant={cms.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      data-testid={`button-cms-${cms.id}`}
                    >
                      {cms.status === "connected" ? (
                        <><RefreshCw className="w-4 h-4 mr-2" />Sync Now</>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
