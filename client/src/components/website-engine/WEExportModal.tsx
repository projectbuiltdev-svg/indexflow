import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Loader2, AlertTriangle, Lock, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface WEExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  venueId: string;
  projectName: string;
  tierAllowsExport: boolean;
}

export default function WEExportModal({
  isOpen,
  onClose,
  projectId,
  venueId,
  projectName,
  tierAllowsExport,
}: WEExportModalProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "complete" | "failed">("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startExport = useCallback(async () => {
    setStatus("generating");
    setError(null);
    try {
      const res = await apiRequest("POST", `/api/we/export/${projectId}?venueId=${venueId}`, {});
      const data = await res.json();
      setJobId(data.jobId);
    } catch (e: any) {
      setStatus("failed");
      setError(e.message || "Export failed");
    }
  }, [projectId, venueId]);

  useEffect(() => {
    if (!jobId || status !== "generating") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/we/export/${projectId}/status/${jobId}?venueId=${venueId}`);
        const data = await res.json();
        if (data.status === "complete") {
          setStatus("complete");
          setDownloadUrl(data.downloadUrl);
          setExpiresAt(data.expiresAt);
          clearInterval(interval);
        } else if (data.status === "failed") {
          setStatus("failed");
          setError(data.error || "Export failed");
          clearInterval(interval);
        }
      } catch {
        setStatus("failed");
        setError("Failed to check export status");
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [jobId, status, projectId, venueId]);

  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setJobId(null);
      setDownloadUrl(null);
      setExpiresAt(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];
  const zipName = `${projectName.toLowerCase().replace(/\s+/g, "-")}-export-${today}.zip`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" data-testid="we-export-modal">
      <div className="bg-background rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Export Code</h3>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-export">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!tierAllowsExport ? (
          <div className="text-center space-y-3 py-4" data-testid="we-export-locked">
            <Lock className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Code export is available on Pro and above.</p>
            <Button data-testid="btn-upgrade-export">Upgrade Plan</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {status === "idle" && (
              <>
                <div className="text-sm text-muted-foreground">
                  Export <strong>{projectName}</strong> as optimised HTML/CSS/JS with assets, sitemap, and robots.txt.
                </div>
                <Button className="w-full" onClick={startExport} data-testid="btn-generate-export">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Export
                </Button>
              </>
            )}

            {status === "generating" && (
              <div className="text-center py-6 space-y-3" data-testid="we-export-generating">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Generating optimised export...</p>
              </div>
            )}

            {status === "complete" && (
              <div className="text-center py-4 space-y-3" data-testid="we-export-complete">
                <Check className="w-10 h-10 mx-auto text-green-600" />
                <p className="font-medium">Export ready!</p>
                <Button className="w-full" asChild data-testid="btn-download-export">
                  <a href={downloadUrl || "#"} download={zipName}>
                    <Download className="w-4 h-4 mr-2" />
                    Download — {zipName}
                  </a>
                </Button>
                {expiresAt && (
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(expiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {status === "failed" && (
              <div className="text-center py-4 space-y-3" data-testid="we-export-failed">
                <AlertTriangle className="w-10 h-10 mx-auto text-red-500" />
                <p className="text-sm text-red-600">{error || "Export failed. Try again."}</p>
                <Button onClick={startExport} data-testid="btn-retry-export">Retry</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
