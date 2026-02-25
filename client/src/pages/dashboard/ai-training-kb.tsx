import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { KnowledgeBaseItem } from "@shared/schema";

function statusIcon(status: string | null) {
  if (status === "trained") return <CheckCircle className="w-4 h-4 text-emerald-600" />;
  if (status === "processing") return <Clock className="w-4 h-4 text-amber-500" />;
  return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
}

function statusBadge(status: string | null) {
  if (status === "trained") return <Badge variant="default" className="bg-emerald-600 text-white">Trained</Badge>;
  if (status === "processing") return <Badge variant="secondary">Processing</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date?: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export default function AiTrainingKb() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id || "";
  const [isDragging, setIsDragging] = useState(false);

  const { data: docs = [], isLoading } = useQuery<KnowledgeBaseItem[]>({
    queryKey: ["/api/workspaces", workspaceId, "knowledge-base"],
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: async (file: File) => {
      const res = await apiRequest("POST", `/api/workspaces/${workspaceId}/knowledge-base`, {
        workspaceId,
        type: "document",
        title: file.name,
        fileName: file.name,
        fileType: file.type || file.name.split(".").pop()?.toUpperCase() || "FILE",
        status: "pending",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "knowledge-base"] });
      toast({ title: "File received", description: "Processing your document for AI training..." });
    },
    onError: () => {
      toast({ title: "Upload failed", description: "Could not upload the document.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/knowledge-base/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "knowledge-base"] });
    },
    onError: () => {
      toast({ title: "Delete failed", description: "Could not remove the document.", variant: "destructive" });
    },
  });

  const trainedCount = docs.filter((d) => d.status === "trained").length;
  const processingCount = docs.filter((d) => d.status === "processing").length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      createMutation.mutate(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      createMutation.mutate(file);
    }
    e.target.value = "";
  };

  const handleDelete = (doc: KnowledgeBaseItem) => {
    deleteMutation.mutate(doc.id);
    toast({ title: "Document removed", description: `"${doc.title || doc.fileName}" has been removed.` });
  };

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Select a workspace to manage AI training documents</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Teach the AI about your business</p>
        </div>

        <Card data-testid="card-training-status">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-medium text-sm" data-testid="text-training-status">Training Status: Active</p>
                  <p className="text-xs text-muted-foreground">{trainedCount} documents trained, {processingCount} processing</p>
                </div>
              </div>
              <Badge variant="default" data-testid="badge-total-docs">{docs.length} Documents</Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-upload-area">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Upload Training Documents</h3>
            <p className="text-sm text-muted-foreground">Upload PDFs, text files, or documents to train the AI on your business information.</p>
            <div
              className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("kb-file-input")?.click()}
              data-testid="dropzone-documents"
            >
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drag & drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF, TXT, DOCX, CSV (Max 10MB per file)</p>
              <input
                id="kb-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.txt,.docx,.csv"
                multiple
                onChange={handleFileInput}
                data-testid="input-file-upload"
              />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-documents-list">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Uploaded Documents</h3>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : docs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-documents">No documents uploaded yet. Upload files above to get started.</p>
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-md border" data-testid={`doc-item-${doc.id}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" data-testid={`text-doc-name-${doc.id}`}>{doc.title || doc.fileName || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground">{(doc.fileType || doc.type || "").toUpperCase()} - {formatDate(doc.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusIcon(doc.status)}
                      {statusBadge(doc.status)}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)} disabled={deleteMutation.isPending} data-testid={`button-delete-doc-${doc.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
