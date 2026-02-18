import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialProviders = [
  { id: "unsplash", name: "Unsplash", connected: true, usage: "245 downloads this month", status: "Connected" },
  { id: "pexels", name: "Pexels", connected: true, usage: "132 downloads this month", status: "Connected" },
  { id: "pixabay", name: "Pixabay", connected: false, usage: "No usage", status: "Not Connected" },
];

export default function ConnectionsImages() {
  const { toast } = useToast();
  const [imageProviders] = useState(initialProviders);

  const handleSave = (providerName: string) => {
    toast({ title: "Settings Saved", description: `${providerName} API key has been saved.` });
  };

  const handleTest = (providerName: string) => {
    toast({ title: "Connection Test", description: `${providerName} connection tested successfully!` });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Image Banks</h1>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground" data-testid="text-note">Leave blank to use platform defaults</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {imageProviders.map((p) => (
          <Card key={p.id} data-testid={`card-image-provider-${p.id}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <Badge variant={p.connected ? "default" : "secondary"} data-testid={`badge-image-status-${p.id}`}>
                {p.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder={`Enter ${p.name} API key`}
                  defaultValue={p.connected ? "••••••••••••" : ""}
                  data-testid={`input-api-key-${p.id}`}
                />
              </div>

              <p className="text-xs text-muted-foreground" data-testid={`text-usage-${p.id}`}>{p.usage}</p>

              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" data-testid={`button-save-${p.id}`} onClick={() => handleSave(p.name)}>Save</Button>
                <Button variant="outline" size="sm" data-testid={`button-test-${p.id}`} onClick={() => handleTest(p.name)}>Test</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
