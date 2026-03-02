import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Settings, RefreshCw, Eye, RotateCcw, Plug, Unplug, HelpCircle, X, ExternalLink, Download } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWorkspace } from "@/lib/workspace-context";

interface CmsFormat {
  value: string;
  label: string;
}

interface ApiKey {
  id: number;
  workspaceId: string;
  platform: string;
  label: string;
  key: string;
  createdAt: string;
}

interface SyncLog {
  id: number;
  date: string;
  cms: string;
  postsSynced: number;
  status: string;
  errors: number;
}

interface CmsProvider {
  id: string;
  name: string;
  connected: boolean;
  apiKeyId: number | null;
}

const cmsSetupSteps: Record<string, { step: string; link?: string }[]> = {
  wordpress: [
    { step: "Install WordPress REST API plugin" },
    { step: "Go to Settings > General and copy your Site URL" },
    { step: "Navigate to Users > Profile and generate an Application Password" },
    { step: "Enter your site URL and Application Password in the Configure dialog" },
  ],
  webflow: [
    { step: "Log into Webflow and go to Site Settings > Integrations" },
    { step: "Generate a new API token with CMS access" },
    { step: "Copy the API token" },
    { step: "Enter it in the Configure dialog along with your Webflow site URL" },
  ],
  ghost: [
    { step: "Log into Ghost Admin and go to Settings > Integrations" },
    { step: "Click 'Add custom integration'" },
    { step: "Copy the Admin API Key" },
    { step: "Enter it in the Configure dialog along with your Ghost admin URL" },
  ],
  hubspot: [
    { step: "Log into HubSpot and navigate to Settings > Integrations > Private Apps" },
    { step: "Create a new private app with Blog access scope" },
    { step: "Copy the access token" },
    { step: "Enter it in the Configure dialog" },
  ],
  contentful: [
    { step: "Log into Contentful and go to Settings > API keys" },
    { step: "Create a new Content Management API key" },
    { step: "Copy the management token and Space ID" },
    { step: "Enter them in the Configure dialog" },
  ],
};

export default function SeoCms() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [selectedCmsId, setSelectedCmsId] = useState<string | null>(null);
  const [configApiKey, setConfigApiKey] = useState("");
  const [configEndpoint, setConfigEndpoint] = useState("");
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [disconnectCmsId, setDisconnectCmsId] = useState<string | null>(null);
  const [viewLogOpen, setViewLogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);
  const [exportFormat, setExportFormat] = useState<string>("wordpress");

  const { data: cmsFormats = [], isLoading: formatsLoading } = useQuery<CmsFormat[]>({
    queryKey: ["/api/blog/cms-formats"],
  });

  const { data: apiKeys = [], isLoading: keysLoading } = useQuery<ApiKey[]>({
    queryKey: [`/api/blog/cms/api-keys?workspaceId=${workspaceId}`],
  });

  const { data: syncLogs = [], isLoading: logsLoading } = useQuery<SyncLog[]>({
    queryKey: [`/api/blog/cms/sync-logs?workspaceId=${workspaceId}`],
  });

  const cmsProviders: CmsProvider[] = cmsFormats.map((f) => {
    const matchingKey = apiKeys.find((k) => k.platform.toLowerCase() === f.value.toLowerCase());
    return {
      id: f.value,
      name: f.label,
      connected: !!matchingKey,
      apiKeyId: matchingKey?.id || null,
    };
  });

  const generateKeyMutation = useMutation({
    mutationFn: async (data: { platform: string; label: string; endpoint: string }) => {
      const res = await apiRequest("POST", "/api/blog/cms/generate-key", {
        workspaceId,
        platform: data.platform,
        label: data.label,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/cms/api-keys?workspaceId=${workspaceId}`] });
      setConfigureOpen(false);
      toast({ title: "Configuration Saved", description: `${variables.platform} has been configured and connected.` });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkExportMutation = useMutation({
    mutationFn: async (data: { format: string; cmsName: string }) => {
      const res = await apiRequest("POST", "/api/blog/export-cms-bulk", {
        workspaceId,
        format: data.format,
      });
      return res.json();
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/cms/sync-logs?workspaceId=${workspaceId}`] });
      toast({
        title: "Export Complete",
        description: `Exported ${result.exported} posts in ${variables.cmsName} format.`,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Export Failed", description: err.message, variant: "destructive" });
    },
  });

  const handleSyncNow = (cmsId: string) => {
    const provider = cmsProviders.find((c) => c.id === cmsId);
    if (!provider || !provider.connected) return;
    bulkExportMutation.mutate({ format: cmsId, cmsName: provider.name });
  };

  const handleConfigure = (cmsId: string) => {
    setSelectedCmsId(cmsId);
    setConfigApiKey("");
    setConfigEndpoint("");
    setConfigureOpen(true);
  };

  const handleSaveConfig = () => {
    if (!selectedCmsId) return;
    const provider = cmsProviders.find((c) => c.id === selectedCmsId);
    generateKeyMutation.mutate({
      platform: selectedCmsId,
      label: provider?.name || selectedCmsId,
      endpoint: configEndpoint,
    });
  };

  const handleDisconnectOpen = (cmsId: string) => {
    setDisconnectCmsId(cmsId);
    setDisconnectOpen(true);
  };

  const handleDisconnectConfirm = () => {
    if (!disconnectCmsId) return;
    const provider = cmsProviders.find((c) => c.id === disconnectCmsId);
    setDisconnectOpen(false);
    toast({ title: "Disconnected", description: `${provider?.name || disconnectCmsId} has been disconnected.` });
    setDisconnectCmsId(null);
  };

  const handleViewLog = (log: SyncLog) => {
    setSelectedLog(log);
    setViewLogOpen(true);
  };

  const handleRetrySync = (log: SyncLog) => {
    bulkExportMutation.mutate({ format: log.cms.toLowerCase(), cmsName: log.cms });
  };

  const selectedCmsProvider = cmsProviders.find((c) => c.id === selectedCmsId);
  const disconnectCmsProvider = cmsProviders.find((c) => c.id === disconnectCmsId);
  const isLoading = formatsLoading || keysLoading;

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">CMS Integration</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-40" data-testid="select-export-format">
              <SelectValue placeholder="Export format" />
            </SelectTrigger>
            <SelectContent>
              {cmsFormats.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              const fmt = cmsFormats.find((f) => f.value === exportFormat);
              bulkExportMutation.mutate({ format: exportFormat, cmsName: fmt?.label || exportFormat });
            }}
            disabled={bulkExportMutation.isPending || !workspaceId}
            data-testid="button-bulk-export"
          >
            <Download className="w-4 h-4 mr-1" />
            {bulkExportMutation.isPending ? "Exporting..." : "Bulk Export"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cmsProviders.map((cms) => (
            <Card key={cms.id} data-testid={`card-cms-${cms.id}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-bold">{cms.name}</h3>
                  <Badge variant={cms.connected ? "default" : "secondary"} data-testid={`badge-cms-status-${cms.id}`}>
                    {cms.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleConfigure(cms.id)} data-testid={`button-configure-${cms.id}`}>
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                  {cms.connected ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSyncNow(cms.id)}
                        disabled={bulkExportMutation.isPending}
                        data-testid={`button-sync-${cms.id}`}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Export Posts
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDisconnectOpen(cms.id)} data-testid={`button-disconnect-${cms.id}`}>
                        <Unplug className="w-4 h-4 mr-1" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConfigure(cms.id)} data-testid={`button-connect-${cms.id}`}>
                      <Plug className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
                {cmsSetupSteps[cms.id] && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-semibold">Setup Guide</span>
                      <Button variant="outline" size="sm" onClick={() => setExpandedGuide(expandedGuide === cms.id ? null : cms.id)} data-testid={`button-toggle-guide-${cms.id}`}>
                        {expandedGuide === cms.id ? <X className="h-3 w-3 mr-1" /> : <HelpCircle className="h-3 w-3 mr-1" />}
                        {expandedGuide === cms.id ? "Close" : "Show Steps"}
                      </Button>
                    </div>
                    {expandedGuide === cms.id && (
                      <ol className="mt-2 space-y-1.5">
                        {cmsSetupSteps[cms.id].map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px] font-medium">{i + 1}</span>
                            <div className="pt-0.5">
                              <span className="text-muted-foreground">{s.step}</span>
                              {s.link && (
                                <a href={s.link} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex items-center text-muted-foreground text-xs underline hover:text-foreground">
                                  Open <ExternalLink className="w-3 h-3 ml-0.5" />
                                </a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sync Log</CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : syncLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4" data-testid="text-no-logs">No sync logs yet. Export posts to a CMS to see activity here.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>CMS</TableHead>
                  <TableHead>Posts Synced</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncLogs.map((log) => (
                  <TableRow key={log.id} data-testid={`row-sync-log-${log.id}`}>
                    <TableCell className="text-muted-foreground">{log.date}</TableCell>
                    <TableCell className="font-medium">{log.cms}</TableCell>
                    <TableCell data-testid={`text-synced-${log.id}`}>{log.postsSynced}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.status === "Success" ? "default" : log.status === "Failed" ? "destructive" : "secondary"}
                        data-testid={`badge-sync-status-${log.id}`}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.errors}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button variant="ghost" size="icon" onClick={() => handleViewLog(log)} data-testid={`button-view-log-${log.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRetrySync(log)} data-testid={`button-retry-log-${log.id}`}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={configureOpen} onOpenChange={setConfigureOpen}>
        <DialogContent data-testid="dialog-configure-cms">
          <DialogHeader>
            <DialogTitle>Configure {selectedCmsProvider?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="config-api-key">API Key</Label>
              <Input id="config-api-key" type="password" value={configApiKey} onChange={(e) => setConfigApiKey(e.target.value)} placeholder="Enter API key" data-testid="input-config-api-key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="config-endpoint">API Endpoint</Label>
              <Input id="config-endpoint" value={configEndpoint} onChange={(e) => setConfigEndpoint(e.target.value)} placeholder="https://yoursite.com/api" data-testid="input-config-endpoint" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigureOpen(false)} data-testid="button-cancel-configure">Cancel</Button>
            <Button onClick={handleSaveConfig} disabled={generateKeyMutation.isPending} data-testid="button-save-configure">
              {generateKeyMutation.isPending ? "Saving..." : "Save & Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <DialogContent data-testid="dialog-disconnect-cms">
          <DialogHeader>
            <DialogTitle>Disconnect {disconnectCmsProvider?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to disconnect <span className="font-medium text-foreground">{disconnectCmsProvider?.name}</span>? All synced data will be removed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectOpen(false)} data-testid="button-cancel-disconnect">Cancel</Button>
            <Button variant="destructive" onClick={handleDisconnectConfirm} data-testid="button-confirm-disconnect">Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewLogOpen} onOpenChange={setViewLogOpen}>
        <DialogContent data-testid="dialog-view-log">
          <DialogHeader>
            <DialogTitle>Sync Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Date</Label>
                <span>{selectedLog.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">CMS</Label>
                <span className="font-medium">{selectedLog.cms}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Posts Synced</Label>
                <span>{selectedLog.postsSynced}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Status</Label>
                <Badge variant={selectedLog.status === "Success" ? "default" : selectedLog.status === "Failed" ? "destructive" : "secondary"}>
                  {selectedLog.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Errors</Label>
                <span>{selectedLog.errors}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewLogOpen(false)} data-testid="button-close-log-detail">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
