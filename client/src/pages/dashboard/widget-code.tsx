import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Copy, CheckCircle } from "lucide-react";

const embedCode = `<script
  src="https://widget.indexflow.cloud/v2/chat.js"
  data-workspace-id="ws_abc123"
  data-position="bottom-right"
  data-theme="auto"
  async>
</script>`;

export default function WidgetCode() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Widget Code</h1>
          <p className="text-muted-foreground">Get the embed code to add the chat widget to your website</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-widget-version">v2.4.1</p>
                  <p className="text-xs text-muted-foreground">Widget Version</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-widget-status">Active</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-position">Bottom Right</p>
                  <p className="text-xs text-muted-foreground">Position</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>Copy and paste this code snippet into your website's HTML, just before the closing &lt;/body&gt; tag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="p-4 rounded-lg border bg-muted/50 overflow-x-auto text-sm" data-testid="text-embed-code">
                <code>{embedCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                data-testid="button-copy-code"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Configuration Options</CardTitle>
            <CardDescription>Customize widget behavior with data attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { attr: "data-workspace-id", desc: "Your workspace identifier (required)", value: "ws_abc123" },
                { attr: "data-position", desc: "Widget position on screen", value: "bottom-right | bottom-left" },
                { attr: "data-theme", desc: "Color theme preference", value: "auto | light | dark" },
                { attr: "data-language", desc: "Default language", value: "en | es | fr | de" },
              ].map((opt) => (
                <div key={opt.attr} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-option-${opt.attr}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono font-medium text-sm">{opt.attr}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-mono">{opt.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
