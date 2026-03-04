import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Copy, Check, Loader2, AlertTriangle, Shield, Info, Trash2, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface WEDomainSettingsProps {
  venueId: string;
  projectId: string;
  tier: string;
  isOnTrial: boolean;
  whitelabelDomain?: string;
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      data-testid="btn-copy-txt"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CountdownTimer({ lastCheckedAt }: { lastCheckedAt: string | null }) {
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  if (!lastCheckedAt) return <span className="text-muted-foreground text-xs">Waiting for first check...</span>;

  const lastMs = new Date(lastCheckedAt).getTime();
  const elapsed = Math.floor((now - lastMs) / 1000);
  const nextIn = Math.max(0, 60 - elapsed);
  const lastAgo = elapsed < 60 ? `${elapsed}s ago` : `${Math.floor(elapsed / 60)}m ago`;

  return (
    <div className="text-xs text-muted-foreground space-y-0.5" data-testid="dns-countdown">
      <div>Last checked: {lastAgo}</div>
      <div>Next check in: {nextIn}s</div>
    </div>
  );
}

export default function WEDomainSettings({ venueId, projectId, tier, isOnTrial, whitelabelDomain }: WEDomainSettingsProps) {
  const queryClient = useQueryClient();
  const [newDomain, setNewDomain] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  const { data: domains, isLoading } = useQuery<any[]>({
    queryKey: ["/api/we/domains", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/domains?venueId=${venueId}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const currentDomain = domains?.[0];

  const { data: dnsStatus } = useQuery<{
    isPolling: boolean;
    startedAt: string | null;
    lastCheckedAt: string | null;
    expiresAt: string | null;
    verified: boolean;
  }>({
    queryKey: ["/api/we/deploy", projectId, "dns-status", currentDomain?.id, venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/deploy/${projectId}/dns-status/${currentDomain.id}?venueId=${venueId}`);
      if (!res.ok) return { isPolling: false, startedAt: null, lastCheckedAt: null, expiresAt: null, verified: false };
      return res.json();
    },
    refetchInterval: currentDomain?.verificationStatus === "pending" ? 5000 : false,
    enabled: !!currentDomain && currentDomain.verificationStatus === "pending",
  });

  const connectMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/domains?venueId=${venueId}`, { domain: newDomain, venueId });
      return res.json();
    },
    onSuccess: () => {
      setNewDomain("");
      queryClient.invalidateQueries({ queryKey: ["/api/we/domains", venueId] });
    },
  });

  const removeMut = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/we/domains/${currentDomain.id}?venueId=${venueId}`, {});
    },
    onSuccess: () => {
      setConfirmRemove(false);
      queryClient.invalidateQueries({ queryKey: ["/api/we/domains", venueId] });
    },
  });

  const regenerateMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/domains/${currentDomain.id}/regenerate-txt?venueId=${venueId}`, {});
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/domains", venueId] }),
  });

  const hoursElapsed = currentDomain?.createdAt
    ? (Date.now() - new Date(currentDomain.createdAt).getTime()) / (1000 * 60 * 60)
    : 0;
  const hoursRemaining = Math.max(0, 72 - hoursElapsed);
  const showExpiryWarning = currentDomain?.verificationStatus === "pending" && hoursElapsed > 48;

  const isPro = tier === "pro" || tier === "agency" || tier === "enterprise";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl" data-testid="we-domain-settings">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5" /> Domain Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Connect a custom domain to your website.</p>
      </div>

      {currentDomain ? (
        <div className="border rounded-lg p-5 space-y-4" data-testid="we-current-domain">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{currentDomain.domain}</div>
              <div className="mt-1">
                {currentDomain.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700" data-testid="badge-verified">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
                {currentDomain.verificationStatus === "pending" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700" data-testid="badge-pending">
                    <Loader2 className="w-3 h-3 animate-spin" /> Verifying DNS...
                  </span>
                )}
                {currentDomain.verificationStatus === "failed" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700" data-testid="badge-failed">
                    <AlertTriangle className="w-3 h-3" /> Verification failed
                  </span>
                )}
              </div>
            </div>

            {!confirmRemove ? (
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setConfirmRemove(true)} data-testid="btn-remove-domain">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            ) : (
              <div className="space-y-2 text-right">
                <p className="text-xs text-muted-foreground max-w-[240px]">
                  Remove {currentDomain.domain}? Your live site will continue running but you cannot redeploy until a new domain is connected.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(false)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={() => removeMut.mutate()} disabled={removeMut.isPending} data-testid="btn-confirm-remove">
                    {removeMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>

          {currentDomain.verificationStatus === "pending" && currentDomain.txtRecord && (
            <div className="border rounded-lg p-4 bg-muted/30 space-y-3" data-testid="we-dns-verification">
              <h4 className="font-medium text-sm">DNS Verification Steps</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">1</span>
                  <span>Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">2</span>
                  <div>
                    <span>Add a TXT record to your DNS settings:</span>
                    <div className="mt-2 bg-background border rounded p-3 space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Record name:</span>
                        <span>@ <span className="text-muted-foreground font-sans">(or {currentDomain.domain})</span></span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Record value:</span>
                        <div className="flex items-center gap-2">
                          <code className="break-all">{currentDomain.txtRecord}</code>
                          <CopyValue value={currentDomain.txtRecord} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">3</span>
                  <span>DNS changes can take up to 72 hours to propagate. We check every 60 seconds.</span>
                </li>
              </ol>

              <div className="flex items-center justify-between pt-2 border-t">
                <CountdownTimer lastCheckedAt={dnsStatus?.lastCheckedAt || null} />
                <div className="flex items-center gap-1">
                  {dnsStatus?.isPolling && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Polling active
                    </span>
                  )}
                </div>
              </div>

              {showExpiryWarning && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-sm" data-testid="dns-expiry-warning">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 dark:text-amber-200">
                      Verification expires in {Math.round(hoursRemaining)} hours. If not verified by then you will need to regenerate the TXT record.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => regenerateMut.mutate()}
                      disabled={regenerateMut.isPending}
                      data-testid="btn-regenerate-txt"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Regenerate TXT Record
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-5 space-y-4" data-testid="we-connect-domain">
          <h4 className="font-medium text-sm">Connect a Domain</h4>
          <div className="flex gap-2">
            <Input
              placeholder="mybusiness.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              data-testid="input-domain"
            />
            <Button
              onClick={() => connectMut.mutate()}
              disabled={!newDomain.trim() || connectMut.isPending}
              data-testid="btn-connect-domain"
            >
              {connectMut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Connect Domain
            </Button>
          </div>
          {connectMut.isError && (
            <p className="text-sm text-red-600" data-testid="domain-error">{(connectMut.error as any)?.message || "Failed to connect domain"}</p>
          )}
          <p className="text-xs text-muted-foreground">
            One domain per workspace. Subdomains count as separate domains and require separate workspaces.
          </p>
        </div>
      )}

      <div className="border rounded-lg p-4 bg-muted/20 flex items-start gap-3" data-testid="we-ssl-notice">
        <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">SSL Certificate</p>
          <p className="mt-1">
            SSL certificate setup is your responsibility. IndexFlow deploys your files — SSL is configured at your hosting provider or domain registrar. Most registrars offer free SSL via Let's Encrypt.
          </p>
        </div>
      </div>

      {isPro && !isOnTrial && whitelabelDomain && (
        <div className="border rounded-lg p-4 bg-primary/5 flex items-start gap-3" data-testid="we-whitelabel-notice">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">White Label Domain</p>
            <p className="mt-1 text-muted-foreground">
              Your staging URL uses your white label domain: <strong>staging.{whitelabelDomain}</strong>
            </p>
            <p className="text-muted-foreground mt-1">
              Configure your white label domain in workspace settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
