import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info, Upload, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/lib/workspace-context";

export default function SettingsWhiteLabel() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();

  const plan = selectedWorkspace?.plan?.toLowerCase() || "solo";
  const isAgencyOrEnterprise = plan === "agency" || plan === "white_label" || plan === "white-label" || plan === "enterprise" || plan === "complete";

  const [brandName, setBrandName] = useState("My Agency");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [customDomain, setCustomDomain] = useState("app.myagency.com");
  const [supportEmail, setSupportEmail] = useState("support@myagency.com");
  const [customLogin, setCustomLogin] = useState(false);
  const [removeWidgetBranding, setRemoveWidgetBranding] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">White Label</h1>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground" data-testid="text-upgrade-note">
            Upgrade to White Label plan to access branding customization
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Brand Name</Label>
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} data-testid="input-brand-name" />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div
              className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer"
              data-testid="upload-logo"
              onClick={() => toast({ title: "Upload logo", description: "Logo upload dialog would open here" })}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <div
              className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer"
              data-testid="upload-favicon"
              onClick={() => toast({ title: "Upload favicon", description: "Favicon upload dialog would open here" })}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload favicon</p>
              <p className="text-xs text-muted-foreground">ICO, PNG 32x32 or 16x16</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} data-testid="input-primary-color" />
          </div>

          <div className="space-y-2">
            <Label>Custom Domain</Label>
            <Input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} data-testid="input-custom-domain" />
            <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground space-y-1" data-testid="text-dns-instructions">
              <p className="font-medium">DNS Configuration:</p>
              <p>Add a CNAME record pointing to: cname.indexflow.cloud</p>
              <p>TTL: 3600 (or Auto)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} data-testid="input-support-email" />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <Label htmlFor="custom-login">Custom Login Page</Label>
              <p className="text-xs text-muted-foreground">Use your branding on the login page</p>
            </div>
            <Switch id="custom-login" checked={customLogin} onCheckedChange={setCustomLogin} data-testid="switch-custom-login" />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="remove-widget-branding">Remove Widget Branding</Label>
                  {!isAgencyOrEnterprise && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                      <Lock className="w-3 h-3" />
                      Agency & Enterprise
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hide the "powered by indexFlow" badge from your AI widget
                </p>
              </div>
              {isAgencyOrEnterprise ? (
                <Switch
                  id="remove-widget-branding"
                  checked={removeWidgetBranding}
                  onCheckedChange={setRemoveWidgetBranding}
                  data-testid="switch-remove-widget-branding"
                />
              ) : (
                <Switch
                  id="remove-widget-branding"
                  checked={false}
                  disabled
                  data-testid="switch-remove-widget-branding"
                />
              )}
            </div>
            {!isAgencyOrEnterprise && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2" data-testid="text-branding-upgrade">
                Upgrade to White Label Agency ($499/mo) or Enterprise to remove indexFlow branding from your widget.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              data-testid="button-save-white-label"
              onClick={() => toast({ title: "White label settings saved", description: "Your branding configuration has been updated" })}
            >
              Save
            </Button>
            <Button
              variant="outline"
              data-testid="button-preview"
              onClick={() => toast({ title: "Preview mode", description: "Opening preview of your white label branding..." })}
            >
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
