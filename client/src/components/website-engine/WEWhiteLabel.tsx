import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, Check, Copy, AlertTriangle, Palette, Mail, Globe, Eye, Upload, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface WEWhiteLabelProps {
  venueId: string;
  tier: string;
  isOnTrial: boolean;
  userEmail?: string;
}

function CopyVal({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      data-testid="btn-copy-val"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function WEWhiteLabel({ venueId, tier, isOnTrial, userEmail }: WEWhiteLabelProps) {
  const queryClient = useQueryClient();
  const isPro = (tier === "pro" || tier === "agency" || tier === "enterprise") && !isOnTrial;

  const { data: config, isLoading } = useQuery<{
    agencyName: string; agencyLogo: string;
    brandColours: { primary: string; secondary: string };
    stagingDomain: string | null; smtpConfigured: boolean;
    fromName: string; fromEmail: string;
  }>({
    queryKey: ["/api/we/whitelabel", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/whitelabel?venueId=${venueId}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: isPro,
  });

  const [agencyName, setAgencyName] = useState("");
  const [primaryColour, setPrimaryColour] = useState("#0284c7");
  const [secondaryColour, setSecondaryColour] = useState("#64748b");

  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");
  const [smtpTestSent, setSmtpTestSent] = useState(false);
  const [confirmRemoveSmtp, setConfirmRemoveSmtp] = useState(false);

  const [stagingInput, setStagingInput] = useState("");
  const [dnsInfo, setDnsInfo] = useState<{ cnameRecord: string; cnameTarget: string; txtRecord: string; txtValue: string } | null>(null);

  useEffect(() => {
    if (config) {
      setAgencyName(config.agencyName);
      setPrimaryColour(config.brandColours?.primary || "#0284c7");
      setSecondaryColour(config.brandColours?.secondary || "#64748b");
    }
  }, [config]);

  const saveBranding = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/we/whitelabel/config?venueId=${venueId}`, {
        agencyName,
        brandColours: { primary: primaryColour, secondary: secondaryColour },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/whitelabel"] }),
  });

  const testSmtp = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/we/whitelabel/smtp?venueId=${venueId}`, {
        host: smtpHost, port: parseInt(smtpPort), username: smtpUser,
        password: smtpPass, fromName: smtpFromName, fromEmail: smtpFromEmail,
      });
    },
    onSuccess: () => setSmtpTestSent(true),
  });

  const confirmSmtp = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/we/whitelabel/smtp/confirm?venueId=${venueId}`, {});
    },
    onSuccess: () => {
      setSmtpTestSent(false);
      queryClient.invalidateQueries({ queryKey: ["/api/we/whitelabel"] });
    },
  });

  const removeSmtp = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/we/whitelabel/smtp?venueId=${venueId}`, {});
    },
    onSuccess: () => {
      setConfirmRemoveSmtp(false);
      queryClient.invalidateQueries({ queryKey: ["/api/we/whitelabel"] });
    },
  });

  const connectStaging = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/whitelabel/staging-domain?venueId=${venueId}`, { domain: stagingInput });
      return res.json();
    },
    onSuccess: (data) => setDnsInfo(data),
  });

  const verifyStaging = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/we/whitelabel/staging-domain/verify?venueId=${venueId}`, {});
    },
    onSuccess: () => {
      setDnsInfo(null);
      queryClient.invalidateQueries({ queryKey: ["/api/we/whitelabel"] });
    },
  });

  const removeStaging = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/we/whitelabel/staging-domain?venueId=${venueId}`, {});
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/whitelabel"] }),
  });

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="we-whitelabel-locked">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">White Label</h2>
        <p className="text-sm text-muted-foreground mb-4">White label is available on Pro and above.</p>
        <Button data-testid="btn-upgrade-wl">Upgrade Plan</Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-2xl" data-testid="we-whitelabel">
      <div>
        <h2 className="text-lg font-semibold">White Label Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize your agency branding, email, and staging domain.</p>
      </div>

      <div className="border rounded-lg p-5 space-y-4" data-testid="wl-branding">
        <h3 className="font-medium flex items-center gap-2"><Palette className="w-4 h-4" /> Branding</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Agency Name</label>
            <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} data-testid="input-agency-name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Primary Colour</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={primaryColour} onChange={(e) => setPrimaryColour(e.target.value)} className="w-8 h-8 rounded cursor-pointer" data-testid="input-primary-colour" />
                <Input value={primaryColour} onChange={(e) => setPrimaryColour(e.target.value)} className="flex-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Secondary Colour</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={secondaryColour} onChange={(e) => setSecondaryColour(e.target.value)} className="w-8 h-8 rounded cursor-pointer" data-testid="input-secondary-colour" />
                <Input value={secondaryColour} onChange={(e) => setSecondaryColour(e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>
          <Button onClick={() => saveBranding.mutate()} disabled={saveBranding.isPending} data-testid="btn-save-branding">
            {saveBranding.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Save Branding
          </Button>
          {saveBranding.isSuccess && <p className="text-xs text-green-600">Saved</p>}
        </div>
      </div>

      <div className="border rounded-lg p-5 space-y-4" data-testid="wl-email">
        <h3 className="font-medium flex items-center gap-2"><Mail className="w-4 h-4" /> Email</h3>
        <div className="flex items-center gap-2">
          {config?.smtpConfigured ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700" data-testid="smtp-active">
              <Check className="w-3 h-3" /> Using your email domain
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700" data-testid="smtp-default">
              <AlertTriangle className="w-3 h-3" /> Using IndexFlow email
            </span>
          )}
        </div>

        {!smtpTestSent ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">SMTP Host</label>
              <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.example.com" data-testid="input-smtp-host" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Port</label>
              <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" data-testid="input-smtp-port" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Username</label>
              <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} data-testid="input-smtp-user" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <Input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} data-testid="input-smtp-pass" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">From Name</label>
              <Input value={smtpFromName} onChange={(e) => setSmtpFromName(e.target.value)} placeholder="Bolt Agency" data-testid="input-smtp-from-name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">From Email</label>
              <Input value={smtpFromEmail} onChange={(e) => setSmtpFromEmail(e.target.value)} placeholder="hello@boltagency.com" data-testid="input-smtp-from-email" />
            </div>
            <div className="col-span-2 flex gap-2">
              <Button onClick={() => testSmtp.mutate()} disabled={testSmtp.isPending || !smtpHost || !smtpUser || !smtpPass || !smtpFromEmail} data-testid="btn-test-smtp">
                {testSmtp.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Mail className="w-4 h-4 mr-1" />}
                Send Test Email
              </Button>
              {config?.smtpConfigured && !confirmRemoveSmtp && (
                <Button variant="ghost" className="text-red-600" onClick={() => setConfirmRemoveSmtp(true)} data-testid="btn-remove-smtp">
                  <Trash2 className="w-4 h-4 mr-1" /> Remove SMTP
                </Button>
              )}
              {confirmRemoveSmtp && (
                <>
                  <Button variant="destructive" size="sm" onClick={() => removeSmtp.mutate()} disabled={removeSmtp.isPending} data-testid="btn-confirm-remove-smtp">Confirm Remove</Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRemoveSmtp(false)}>Cancel</Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-muted/30 rounded p-4" data-testid="smtp-confirm-panel">
            <p className="text-sm">Test email sent to <strong>{userEmail || "your inbox"}</strong>. Check your inbox then confirm below.</p>
            <Button onClick={() => confirmSmtp.mutate()} disabled={confirmSmtp.isPending} data-testid="btn-confirm-smtp">
              {confirmSmtp.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
              Yes, I received the test email
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSmtpTestSent(false)}>Back to settings</Button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-5 space-y-4" data-testid="wl-staging">
        <h3 className="font-medium flex items-center gap-2"><Globe className="w-4 h-4" /> Staging Domain</h3>
        <div className="text-sm text-muted-foreground">
          Current: <strong>{config?.stagingDomain || `${venueId}.indexflow.cloud`}</strong>
        </div>

        {config?.stagingDomain ? (
          <Button variant="ghost" className="text-red-600" onClick={() => removeStaging.mutate()} disabled={removeStaging.isPending} data-testid="btn-remove-staging">
            <Trash2 className="w-4 h-4 mr-1" /> Remove custom domain
          </Button>
        ) : dnsInfo ? (
          <div className="bg-muted/30 rounded p-4 space-y-3 text-sm" data-testid="staging-dns-panel">
            <p className="font-medium">DNS Configuration Required</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-background border rounded px-3 py-2">
                <div>
                  <span className="text-muted-foreground text-xs">CNAME Record:</span>
                  <div className="font-mono text-xs">{dnsInfo.cnameRecord} → {dnsInfo.cnameTarget}</div>
                </div>
                <CopyVal value={dnsInfo.cnameTarget} />
              </div>
              <div className="flex justify-between items-center bg-background border rounded px-3 py-2">
                <div>
                  <span className="text-muted-foreground text-xs">TXT Record:</span>
                  <div className="font-mono text-xs break-all">{dnsInfo.txtValue}</div>
                </div>
                <CopyVal value={dnsInfo.txtValue} />
              </div>
            </div>
            <Button size="sm" onClick={() => verifyStaging.mutate()} disabled={verifyStaging.isPending} data-testid="btn-verify-staging">
              {verifyStaging.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Verify DNS
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input value={stagingInput} onChange={(e) => setStagingInput(e.target.value)} placeholder="staging.youragency.com" data-testid="input-staging-domain" />
            <Button onClick={() => connectStaging.mutate()} disabled={!stagingInput.trim() || connectStaging.isPending} data-testid="btn-connect-staging">
              {connectStaging.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Connect
            </Button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-5 space-y-3" data-testid="wl-preview">
        <h3 className="font-medium flex items-center gap-2"><Eye className="w-4 h-4" /> Preview</h3>
        <div className="text-sm space-y-1.5 text-muted-foreground">
          <div>Preview URL: <span className="font-mono text-xs text-foreground">{config?.stagingDomain ? `https://${config.stagingDomain}/project-slug` : `https://${venueId}.indexflow.cloud/project-slug`}</span></div>
          <div>Email sender: <span className="text-foreground">{config?.smtpConfigured ? `${config.fromName} <${config.fromEmail}>` : "IndexFlow <noreply@indexflow.cloud>"}</span></div>
          <div>Export filename: <span className="font-mono text-xs text-foreground">{agencyName ? agencyName.toLowerCase().replace(/\s+/g, "-") : "project"}-export-{new Date().toISOString().split("T")[0]}.zip</span></div>
        </div>
      </div>
    </div>
  );
}
