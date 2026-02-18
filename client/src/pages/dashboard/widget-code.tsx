import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ExternalLink, Code, Monitor, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WidgetCode() {
  const { toast } = useToast();

  const embedCode = `<script
  src="https://widget.indexflow.cloud/v2/chat.js"
  data-workspace-id="ws_abc123"
  data-position="bottom-right"
  data-color="#3B82F6"
  data-welcome="Hi! How can we help?"
  async>
</script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({ title: "Copied!", description: "Embed code copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy to clipboard.", variant: "destructive" });
    }
  };

  const handleOpenDemo = () => {
    window.open("/widget-demo", "_blank");
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Widget Code</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Add the AI widget to your website</p>
        </div>

        <Card data-testid="card-code-snippet">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Embed Code</h3>
              </div>
              <Button variant="outline" onClick={handleCopyCode} data-testid="button-copy-code">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
            <Textarea
              readOnly
              value={embedCode}
              className="font-mono text-sm min-h-[180px]"
              data-testid="textarea-embed-code"
            />
          </CardContent>
        </Card>

        <Card data-testid="card-installation">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Installation Instructions</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3" data-testid="step-1">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">1</span>
                <p className="text-muted-foreground">Copy the embed code above using the "Copy Code" button.</p>
              </div>
              <div className="flex gap-3" data-testid="step-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">2</span>
                <p className="text-muted-foreground">Paste the code just before the closing <code className="bg-muted px-1 rounded text-xs">&lt;/body&gt;</code> tag on every page where you want the widget to appear.</p>
              </div>
              <div className="flex gap-3" data-testid="step-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">3</span>
                <p className="text-muted-foreground">Save and publish your website. The chat widget will appear in the bottom-right corner.</p>
              </div>
              <div className="flex gap-3" data-testid="step-4">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">4</span>
                <p className="text-muted-foreground">Works with WordPress, Wix, Squarespace, Webflow, Shopify, and any custom HTML site.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-preview">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold">Preview</h3>
              <Button variant="outline" onClick={handleOpenDemo} data-testid="button-open-demo">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Full Demo
              </Button>
            </div>
            <div className="border rounded-md p-8 bg-muted/30 min-h-[200px] flex items-center justify-center" data-testid="preview-area">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <Monitor className="w-8 h-8" />
                  <Smartphone className="w-6 h-6" />
                </div>
                <p className="text-sm text-muted-foreground">Widget preview — open the full demo to see it in action</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
