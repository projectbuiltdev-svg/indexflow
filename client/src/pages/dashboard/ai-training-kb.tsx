import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, FileText, Upload, Database } from "lucide-react";

const mockDocuments = [
  { id: 1, name: "Menu & Pricing Guide", type: "PDF", size: "2.4 MB", entries: 45, lastUpdated: "2026-02-15" },
  { id: 2, name: "FAQ Database", type: "JSON", size: "156 KB", entries: 120, lastUpdated: "2026-02-14" },
  { id: 3, name: "Business Hours & Policies", type: "Text", size: "12 KB", entries: 8, lastUpdated: "2026-02-10" },
  { id: 4, name: "Staff & Services Info", type: "PDF", size: "890 KB", entries: 22, lastUpdated: "2026-02-08" },
  { id: 5, name: "Location & Directions", type: "Text", size: "4 KB", entries: 5, lastUpdated: "2026-02-05" },
];

export default function AiTrainingKb() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Knowledge Base</h1>
            <p className="text-muted-foreground">Train your AI assistant with custom knowledge</p>
          </div>
          <Button data-testid="button-add-document">
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-docs">5</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-entries">200</p>
                  <p className="text-xs text-muted-foreground">Knowledge Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-size">3.5 MB</p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-training-status">Trained</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Training Documents</CardTitle>
            <CardDescription>Upload and manage documents that power your AI assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-document-${doc.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.entries} entries - {doc.size} - Updated {doc.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                    <Button variant="outline" size="sm" data-testid={`button-edit-doc-${doc.id}`}>Edit</Button>
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
