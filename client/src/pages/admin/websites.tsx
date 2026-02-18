import { Plus, Globe, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

const websites = [
  { id: 1, name: "Acme Digital", domain: "acmedigital.com", status: "Live", template: "Elegante", lastUpdated: "Jan 28, 2026" },
  { id: 2, name: "Coastal SEO", domain: "coastalseo.com", status: "Building", template: "Coastal", lastUpdated: "Jan 27, 2026" },
  { id: 3, name: "Summit Marketing", domain: "summitmarketing.com", status: "Live", template: "Rustic", lastUpdated: "Jan 20, 2026" },
  { id: 4, name: "Pinnacle Digital", domain: "pinnacledigital.com", status: "Live", template: "Modern", lastUpdated: "Jan 15, 2026" },
];

export default function AdminWebsites() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Websites</h1>
          <p className="text-muted-foreground">Manage client websites and domains</p>
        </div>
        <Button data-testid="button-create-website">
          <Plus className="h-4 w-4 mr-2" />
          Create Website
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {websites.map((site) => (
          <Card key={site.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{site.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{site.domain}</span>
                </div>
              </div>
              <Badge variant={site.status === "Live" ? "default" : "secondary"}>
                {site.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Template: {site.template}</p>
                  <p className="text-muted-foreground">Updated: {site.lastUpdated}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" data-testid={`button-settings-${site.id}`}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" data-testid={`button-visit-${site.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
