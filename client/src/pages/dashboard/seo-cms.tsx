import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, RefreshCw, Eye, RotateCcw, Plug, Unplug } from "lucide-react";

const initialCmsProviders = [
  { id: "wordpress", name: "WordPress", connected: true, lastSync: "2026-02-18 09:30", postsSynced: 45 },
  { id: "webflow", name: "Webflow", connected: true, lastSync: "2026-02-17 14:00", postsSynced: 12 },
  { id: "shopify", name: "Shopify", connected: false, lastSync: null as string | null, postsSynced: 0 },
  { id: "ghost", name: "Ghost", connected: false, lastSync: null as string | null, postsSynced: 0 },
  { id: "wix", name: "Wix", connected: false, lastSync: null as string | null, postsSynced: 0 },
];

const initialSyncLogs = [
  { id: 1, date: "2026-02-18 09:30", cms: "WordPress", postsSynced: 3, status: "Success", errors: 0 },
  { id: 2, date: "2026-02-17 14:00", cms: "Webflow", postsSynced: 2, status: "Success", errors: 0 },
  { id: 3, date: "2026-02-16 10:15", cms: "WordPress", postsSynced: 5, status: "Partial", errors: 1 },
  { id: 4, date: "2026-02-15 08:00", cms: "WordPress", postsSynced: 0, status: "Failed", errors: 3 },
];

export default function SeoCms() {
  const { toast } = useToast();
  const [cmsProviders, setCmsProviders] = useState(initialCmsProviders);
  const [syncLogs, setSyncLogs] = useState(initialSyncLogs);

  const [configureOpen, setConfigureOpen] = useState(false);
  const [selectedCms, setSelectedCms] = useState<typeof initialCmsProviders[0] | null>(null);
  const [configApiKey, setConfigApiKey] = useState("");
  const [configEndpoint, setConfigEndpoint] = useState("");

  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [disconnectCms, setDisconnectCms] = useState<typeof initialCmsProviders[0] | null>(null);

  const [viewLogOpen, setViewLogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<typeof initialSyncLogs[0] | null>(null);

  const handleSyncNow = (cmsId: string) => {
    const cms = cmsProviders.find((c) => c.id === cmsId);
    if (!cms || !cms.connected) return;
    setCmsProviders((prev) =>
      prev.map((c) => (c.id === cmsId ? { ...c, lastSync: "2026-02-18 10:00", postsSynced: c.postsSynced + 2 } : c))
    );
    const newLogId = Math.max(...syncLogs.map((l) => l.id), 0) + 1;
    setSyncLogs((prev) => [
      { id: newLogId, date: "2026-02-18 10:00", cms: cms.name, postsSynced: 2, status: "Success", errors: 0 },
      ...prev,
    ]);
    toast({ title: "Sync Complete", description: `${cms.name} posts have been synced successfully.` });
  };

  const handleConfigure = (cms: typeof initialCmsProviders[0]) => {
    setSelectedCms(cms);
    setConfigApiKey("");
    setConfigEndpoint(cms.connected ? `https://${cms.id}.example.com/api` : "");
    setConfigureOpen(true);
  };

  const handleSaveConfig = () => {
    if (!selectedCms) return;
    setCmsProviders((prev) =>
      prev.map((c) => (c.id === selectedCms.id ? { ...c, connected: true, lastSync: c.lastSync || "2026-02-18 10:00" } : c))
    );
    setConfigureOpen(false);
    toast({ title: "Configuration Saved", description: `${selectedCms.name} has been configured and connected.` });
  };

  const handleDisconnectOpen = (cms: typeof initialCmsProviders[0]) => {
    setDisconnectCms(cms);
    setDisconnectOpen(true);
  };

  const handleDisconnectConfirm = () => {
    if (!disconnectCms) return;
    setCmsProviders((prev) =>
      prev.map((c) => (c.id === disconnectCms.id ? { ...c, connected: false, lastSync: null, postsSynced: 0 } : c))
    );
    setDisconnectOpen(false);
    toast({ title: "Disconnected", description: `${disconnectCms.name} has been disconnected.` });
    setDisconnectCms(null);
  };

  const handleViewLog = (log: typeof initialSyncLogs[0]) => {
    setSelectedLog(log);
    setViewLogOpen(true);
  };

  const handleRetrySync = (logId: number) => {
    setSyncLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, status: "Success", errors: 0 } : l)));
    toast({ title: "Retry Successful", description: "The sync has been retried and completed successfully." });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">CMS Integration</h1>
      </div>

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
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Last sync: {cms.lastSync || "Never"}</p>
                <p>Posts synced: {cms.postsSynced}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => handleConfigure(cms)} data-testid={`button-configure-${cms.id}`}>
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
                {cms.connected ? (
                  <>
                    <Button size="sm" onClick={() => handleSyncNow(cms.id)} data-testid={`button-sync-${cms.id}`}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Sync Posts
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnectOpen(cms)} data-testid={`button-disconnect-${cms.id}`}>
                      <Unplug className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => handleConfigure(cms)} data-testid={`button-connect-${cms.id}`}>
                    <Plug className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sync Log</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <Button variant="ghost" size="icon" onClick={() => handleRetrySync(log.id)} data-testid={`button-retry-log-${log.id}`}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={configureOpen} onOpenChange={setConfigureOpen}>
        <DialogContent data-testid="dialog-configure-cms">
          <DialogHeader>
            <DialogTitle>Configure {selectedCms?.name}</DialogTitle>
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
            <Button onClick={handleSaveConfig} data-testid="button-save-configure">Save & Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <DialogContent data-testid="dialog-disconnect-cms">
          <DialogHeader>
            <DialogTitle>Disconnect {disconnectCms?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to disconnect <span className="font-medium text-foreground">{disconnectCms?.name}</span>? All synced data will be removed.
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
