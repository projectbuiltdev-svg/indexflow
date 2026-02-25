import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Upload, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WorkspaceSiteProfile } from "@shared/schema";

export default function SettingsWhiteLabel() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  const plan = selectedWorkspace?.plan?.toLowerCase() || "solo";
  const isAgencyOrEnterprise = plan === "agency" || plan === "white_label" || plan === "white-label" || plan === "enterprise" || plan === "complete";

  const { data: profile, isLoading } = useQuery<WorkspaceSiteProfile | null>({
    queryKey: ["/api/workspaces", workspaceId, "site-profile"],
    enabled: !!workspaceId,
  });

  const [siteName, setSiteName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [siteUrl, setSiteUrl] = useState("");
  const [customLogin, setCustomLogin] = useState(false);
  const [removeWidgetBranding, setRemoveWidgetBranding] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setSiteName(profile.siteName || "");
      setPrimaryColor(profile.primaryColor || "#3B82F6");
      setSiteUrl(profile.siteUrl || "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PUT", `/api/workspaces/${workspaceId}/site-profile`, {
        siteName,
        primaryColor,
        siteUrl,
        logoUrl: profile?.logoUrl || null,
        faviconUrl: profile?.faviconUrl || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "site-profile"] });
      toast({ title: "White label settings saved", description: "Your branding configuration has been updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    },
  });

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Logo must be under 2MB", variant: "destructive" });
      return;
    }
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    toast({ title: "Logo selected", description: `${file.name} ready to upload on save` });
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Favicon must be under 2MB", variant: "destructive" });
      return;
    }
    setFaviconFile(file);
    const url = URL.createObjectURL(file);
    setFaviconPreview(url);
    toast({ title: "Favicon selected", description: `${file.name} ready to upload on save` });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

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
            <Label>Brand / Site Name</Label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} data-testid="input-brand-name" />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoSelect}
            />
            <div
              className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer"
              data-testid="upload-logo"
              onClick={() => logoInputRef.current?.click()}
            >
              {logoPreview || profile?.logoUrl ? (
                <img
                  src={logoPreview || profile?.logoUrl || ""}
                  alt="Logo preview"
                  className="h-12 mx-auto mb-2 object-contain"
                  data-testid="img-logo-preview"
                />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/png,image/x-icon,image/vnd.microsoft.icon"
              className="hidden"
              onChange={handleFaviconSelect}
            />
            <div
              className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer"
              data-testid="upload-favicon"
              onClick={() => faviconInputRef.current?.click()}
            >
              {faviconPreview || profile?.faviconUrl ? (
                <img
                  src={faviconPreview || profile?.faviconUrl || ""}
                  alt="Favicon preview"
                  className="h-8 mx-auto mb-2 object-contain"
                  data-testid="img-favicon-preview"
                />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground">Click to upload favicon</p>
              <p className="text-xs text-muted-foreground">ICO, PNG 32x32 or 16x16</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} data-testid="input-primary-color" />
          </div>

          <div className="space-y-2">
            <Label>Custom Domain / Site URL</Label>
            <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} data-testid="input-custom-domain" placeholder="app.myagency.com" />
            <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground space-y-1" data-testid="text-dns-instructions">
              <p className="font-medium">DNS Configuration:</p>
              <p>Add a CNAME record pointing to: cname.indexflow.cloud</p>
              <p>TTL: 3600 (or Auto)</p>
            </div>
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
              disabled={saveMutation.isPending || !workspaceId}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
            <Button
              variant="outline"
              data-testid="button-preview"
              onClick={() => {
                if (siteUrl) {
                  window.open(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`, "_blank");
                } else {
                  toast({ title: "No custom domain set", description: "Enter a custom domain / site URL first" });
                }
              }}
            >
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
