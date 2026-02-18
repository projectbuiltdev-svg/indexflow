import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  status: "trained" | "processing" | "pending";
  uploaded: string;
}

const initialDocs: Document[] = [
  { id: 1, name: "Business Hours & Policies.pdf", type: "PDF", size: "245 KB", status: "trained", uploaded: "2026-02-15" },
  { id: 2, name: "Product Catalog.pdf", type: "PDF", size: "1.2 MB", status: "trained", uploaded: "2026-02-12" },
  { id: 3, name: "FAQs.txt", type: "TXT", size: "18 KB", status: "trained", uploaded: "2026-02-10" },
  { id: 4, name: "Pricing Guide 2026.pdf", type: "PDF", size: "380 KB", status: "processing", uploaded: "2026-02-18" },
  { id: 5, name: "Return Policy.docx", type: "DOCX", size: "52 KB", status: "pending", uploaded: "2026-02-18" },
];

function statusIcon(status: string) {
  if (status === "trained") return <CheckCircle className="w-4 h-4 text-emerald-600" />;
  if (status === "processing") return <Clock className="w-4 h-4 text-amber-500" />;
  return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
}

function statusBadge(status: string) {
  if (status === "trained") return <Badge variant="default" className="bg-emerald-600 text-white">Trained</Badge>;
  if (status === "processing") return <Badge variant="secondary">Processing</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

export default function AiTrainingKb() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [isDragging, setIsDragging] = useState(false);

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
    toast({ title: "File received", description: "Processing your document for AI training..." });
  };

  const handleDelete = (doc: Document) => {
    setDocs(docs.filter((d) => d.id !== doc.id));
    toast({ title: "Document removed", description: `"${doc.name}" has been removed.` });
  };

  return (
    <ClientLayout>
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
              data-testid="dropzone-documents"
            >
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF, TXT, DOCX, CSV (Max 10MB per file)</p>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-documents-list">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-md border" data-testid={`doc-item-${doc.id}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" data-testid={`text-doc-name-${doc.id}`}>{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} - {doc.size} - {doc.uploaded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusIcon(doc.status)}
                    {statusBadge(doc.status)}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)} data-testid={`button-delete-doc-${doc.id}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
