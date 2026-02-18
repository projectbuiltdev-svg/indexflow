import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image, Key, Download } from "lucide-react";

const imageProviders = [
  { id: "unsplash", name: "Unsplash", status: "connected", downloads: 245, quota: "50/hr" },
  { id: "pexels", name: "Pexels", status: "connected", downloads: 132, quota: "200/hr" },
  { id: "pixabay", name: "Pixabay", status: "disconnected", downloads: 0, quota: "-" },
];

export default function ConnectionsImages() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Image Banks</h1>
          <p className="text-muted-foreground">Connect stock image providers for content creation</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-providers">3</p>
                  <p className="text-xs text-muted-foreground">Providers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-connected-images">2</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-downloads">377</p>
                  <p className="text-xs text-muted-foreground">Total Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Image Providers</CardTitle>
            <CardDescription>Connect your API keys for stock image access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {imageProviders.map((provider) => (
                <Card key={provider.id} data-testid={`card-image-provider-${provider.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">{provider.name}</h3>
                      </div>
                      <Badge variant={provider.status === "connected" ? "default" : "secondary"} className="text-xs">
                        {provider.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      <p>Downloads: {provider.downloads}</p>
                      <p>Rate Limit: {provider.quota}</p>
                    </div>
                    <Button
                      variant={provider.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      data-testid={`button-image-${provider.id}`}
                    >
                      {provider.status === "connected" ? "Manage" : "Connect"}
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
