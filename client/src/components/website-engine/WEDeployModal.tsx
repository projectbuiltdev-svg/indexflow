import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Globe, Copy, Loader2, Lock, ExternalLink, AlertTriangle, RotateCcw, Check, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface WEDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  venueId: string;
  projectName: string;
  tierAllowsDeploy: boolean;
  isOnTrial: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      data-testid="btn-copy-url"
    >
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
    </Button>
  );
}

export default function WEDeployModal({
  isOpen,
  onClose,
  projectId,
  venueId,
  projectName,
  tierAllowsDeploy,
  isOnTrial,
}: WEDeployModalProps) {
  const queryClient = useQueryClient();
  const [showHistory, setShowHistory] = useState(false);
  const [stagingConfirmed, setStagingConfirmed] = useState(false);
  const [rollbackTarget, setRollbackTarget] = useState<number | null>(null);

  const { data: history } = useQuery<{ deployments: any[]; total: number }>({
    queryKey: ["/api/we/deploy", projectId, "history", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/deploy/${projectId}/history?venueId=${venueId}`);
      if (!res.ok) return { deployments: [], total: 0 };
      return res.json();
    },
    enabled: isOpen && !!projectId,
  });

  const { data: dnsStatus } = useQuery<{ isPolling: boolean; verified: boolean }>({
    queryKey: ["/api/we/deploy", projectId, "dns-status", venueId],
    queryFn: async () => {
      const domains = history?.deployments?.filter((d: any) => d.deploymentType === "live");
      if (!domains?.length) return { isPolling: false, verified: false };
      return { isPolling: false, verified: false };
    },
    enabled: false,
  });

  const testDeploy = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/deploy/${projectId}/test?venueId=${venueId}`, {});
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/deploy", projectId, "history"] }),
  });

  const stagingDeploy = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/deploy/${projectId}/staging?venueId=${venueId}`, {});
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/deploy", projectId, "history"] }),
  });

  const liveDeploy = useMutation({
    mutationFn: async (domainId: number) => {
      const res = await apiRequest("POST", `/api/we/deploy/${projectId}/live?venueId=${venueId}`, { domainId, stagingConfirmed });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/deploy", projectId, "history"] }),
  });

  const rollbackMut = useMutation({
    mutationFn: async (deploymentId: number) => {
      const res = await apiRequest("POST", `/api/we/deploy/${projectId}/rollback?venueId=${venueId}`, { deploymentId });
      return res.json();
    },
    onSuccess: () => {
      setRollbackTarget(null);
      queryClient.invalidateQueries({ queryKey: ["/api/we/deploy", projectId, "history"] });
    },
  });

  if (!isOpen) return null;

  const latestTest = history?.deployments?.find((d: any) => d.deploymentType === "test");
  const latestStaging = history?.deployments?.find((d: any) => d.deploymentType === "staging");
  const latestLive = history?.deployments?.find((d: any) => d.deploymentType === "live");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" data-testid="we-deploy-modal">
      <div className="bg-background rounded-lg p-6 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-lg">Publish — {projectName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-deploy">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-5">
          <div className="border rounded-lg p-4 space-y-3" data-testid="we-deploy-test">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" /> Test URL
            </h4>
            {latestTest?.domain && (
              <div className="flex items-center gap-2 text-sm bg-muted/50 rounded px-3 py-1.5">
                <a href={`https://${latestTest.domain}`} target="_blank" rel="noopener" className="text-primary hover:underline truncate flex-1">
                  {latestTest.domain}
                </a>
                <CopyButton text={`https://${latestTest.domain}`} />
                <a href={`https://${latestTest.domain}`} target="_blank" rel="noopener"><ExternalLink className="w-3 h-3" /></a>
              </div>
            )}
            <Button
              size="sm"
              className="w-full"
              onClick={() => testDeploy.mutate()}
              disabled={testDeploy.isPending}
              data-testid="btn-deploy-test"
            >
              {testDeploy.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Deploy to Test URL
            </Button>
            {testDeploy.isSuccess && <p className="text-xs text-green-600">Deployed successfully</p>}
          </div>

          <div className="border rounded-lg p-4 space-y-3" data-testid="we-deploy-staging">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" /> Staging
            </h4>
            {isOnTrial ? (
              <div className="text-center py-2 space-y-2">
                <Lock className="w-6 h-6 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Staging is available on paid plans.</p>
              </div>
            ) : (
              <>
                {latestStaging?.domain && (
                  <div className="flex items-center gap-2 text-sm bg-muted/50 rounded px-3 py-1.5">
                    <a href={`https://${latestStaging.domain}`} target="_blank" rel="noopener" className="text-primary hover:underline truncate flex-1">
                      {latestStaging.domain}
                    </a>
                    <CopyButton text={`https://${latestStaging.domain}`} />
                  </div>
                )}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => stagingDeploy.mutate()}
                  disabled={stagingDeploy.isPending}
                  data-testid="btn-deploy-staging"
                >
                  {stagingDeploy.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Deploy to Staging
                </Button>
                {stagingDeploy.isSuccess && <p className="text-xs text-green-600">Deployed successfully</p>}
              </>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3" data-testid="we-deploy-live">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" /> Live
            </h4>
            {isOnTrial ? (
              <div className="text-center py-2 space-y-2">
                <Lock className="w-6 h-6 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Live deployment is not available during trial.</p>
              </div>
            ) : !latestLive && !latestStaging ? (
              <p className="text-sm text-muted-foreground">Deploy to staging first, then connect a domain to go live.</p>
            ) : (
              <>
                {latestLive?.domain && (
                  <div className="flex items-center gap-2 text-sm bg-muted/50 rounded px-3 py-1.5">
                    <a href={`https://${latestLive.domain}`} target="_blank" rel="noopener" className="text-primary hover:underline truncate flex-1">
                      {latestLive.domain}
                    </a>
                    <CopyButton text={`https://${latestLive.domain}`} />
                  </div>
                )}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stagingConfirmed}
                    onChange={(e) => setStagingConfirmed(e.target.checked)}
                    data-testid="chk-staging-confirmed"
                  />
                  I have reviewed the staging preview
                </label>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!stagingConfirmed || liveDeploy.isPending}
                  onClick={() => {
                    if (latestLive?.domain) liveDeploy.mutate(0);
                  }}
                  data-testid="btn-deploy-live"
                >
                  {liveDeploy.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Deploy to Live
                </Button>
                {liveDeploy.isSuccess && <p className="text-xs text-green-600">Live deployment successful</p>}
              </>
            )}
          </div>

          <div className="border rounded-lg" data-testid="we-deploy-history">
            <button
              className="w-full p-3 flex items-center justify-between text-sm font-medium"
              onClick={() => setShowHistory(!showHistory)}
              data-testid="btn-toggle-history"
            >
              <span>Deployment History ({history?.total || 0})</span>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showHistory && (
              <div className="border-t p-3 space-y-2 max-h-60 overflow-y-auto">
                {(!history?.deployments?.length) && (
                  <p className="text-sm text-muted-foreground text-center py-2">No deployments yet</p>
                )}
                {history?.deployments?.slice(0, 10).map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                        d.deploymentType === "live" ? "bg-green-100 text-green-700" :
                        d.deploymentType === "staging" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{d.deploymentType}</span>
                      <span className="text-muted-foreground truncate max-w-[160px]">{d.domain || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {d.deployedAt ? new Date(d.deployedAt).toLocaleDateString() : "—"}
                      </span>
                      {rollbackTarget === d.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => rollbackMut.mutate(d.id)}
                            disabled={rollbackMut.isPending}
                            data-testid={`btn-confirm-rollback-${d.id}`}
                          >
                            Confirm
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setRollbackTarget(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setRollbackTarget(d.id)}
                          data-testid={`btn-rollback-${d.id}`}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
