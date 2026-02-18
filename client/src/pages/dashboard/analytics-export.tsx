import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Search, Users, Receipt, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const exportOptions = [
  { id: "content", title: "Content", description: "Export all posts and pages", icon: FileText },
  { id: "keywords", title: "Keywords", description: "Rank tracker data and keyword positions", icon: Search },
  { id: "contacts", title: "Contacts", description: "CRM contacts and lead data", icon: Users },
  { id: "invoices", title: "Invoices", description: "Billing invoices and payment history", icon: Receipt },
  { id: "analytics", title: "Analytics", description: "Traffic and performance analytics", icon: BarChart3 },
];

export default function AnalyticsExport() {
  const { toast } = useToast();
  const [formats, setFormats] = useState<Record<string, string>>(
    Object.fromEntries(exportOptions.map((o) => [o.id, "csv"]))
  );

  const handleExport = (optId: string, title: string) => {
    const format = formats[optId] || "csv";
    toast({
      title: "Export Started",
      description: `Exporting ${title} data as ${format.toUpperCase()}. Your download will begin shortly.`,
    });
  };

  const handleFormatChange = (optId: string, value: string) => {
    setFormats((prev) => ({ ...prev, [optId]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Export Data</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {exportOptions.map((opt) => (
          <Card key={opt.id} data-testid={`card-export-${opt.id}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <opt.icon className="w-5 h-5 text-muted-foreground" />
                {opt.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{opt.description}</p>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={formats[opt.id]} onValueChange={(v) => handleFormatChange(opt.id, v)}>
                  <SelectTrigger data-testid={`select-format-${opt.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Input type="date" className="flex-1" data-testid={`input-date-from-${opt.id}`} />
                  <Input type="date" className="flex-1" data-testid={`input-date-to-${opt.id}`} />
                </div>
              </div>

              <Button className="w-full" data-testid={`button-export-${opt.id}`} onClick={() => handleExport(opt.id, opt.title)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
