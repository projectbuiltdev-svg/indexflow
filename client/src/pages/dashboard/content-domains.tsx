import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Plus, Shield, AlertTriangle } from "lucide-react";

const mockDomains = [
  { id: 1, domain: "myagency.com", status: "active", ssl: true, primary: true, expires: "2027-03-15" },
  { id: 2, domain: "www.myagency.com", status: "active", ssl: true, primary: false, expires: "2027-03-15" },
  { id: 3, domain: "blog.myagency.com", status: "pending", ssl: false, primary: false, expires: "2027-03-15" },
];

export default function ContentDomains() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Domains</h1>
            <p className="text-muted-foreground">Manage custom domains for your workspace</p>
          </div>
          <Button data-testid="button-add-domain">
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-domains">3</p>
                  <p className="text-xs text-muted-foreground">Total Domains</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-ssl-active">2</p>
                  <p className="text-xs text-muted-foreground">SSL Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-pending-domains">1</p>
                  <p className="text-xs text-muted-foreground">Pending Setup</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Domains</CardTitle>
            <CardDescription>Configure DNS and SSL for your custom domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDomains.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-domain-${d.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{d.domain}</p>
                      <p className="text-xs text-muted-foreground">Expires {d.expires}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {d.primary && <Badge className="text-xs">Primary</Badge>}
                    {d.ssl && <Badge variant="secondary" className="text-xs">SSL</Badge>}
                    <Badge variant={d.status === "active" ? "default" : "secondary"} className="text-xs">
                      {d.status}
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
