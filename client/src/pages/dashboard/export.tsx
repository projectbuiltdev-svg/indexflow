import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CalendarCheck, Phone, Ticket } from "lucide-react";

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return "";
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

const exportItems = [
  { label: "Contacts", endpoint: "contacts", icon: CalendarCheck },
  { label: "Call Logs", endpoint: "call-logs", icon: Phone },
  { label: "Support Tickets", endpoint: "support-tickets", icon: Ticket },
];

export default function DashboardExport() {
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  if (!selectedWorkspace?.id) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a workspace from the sidebar to export data.</div>;
  }

  const handleExport = async (item: typeof exportItems[0]) => {
    setLoading(item.endpoint);
    try {
      const res = await fetch(`/api/${item.endpoint}?workspaceId=${selectedWorkspace.id}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        toast({ title: "No data", description: `No ${item.label.toLowerCase()} to export.` });
        return;
      }
      const csv = convertToCSV(data);
      downloadCSV(csv, `${item.endpoint}-${selectedWorkspace.id}.csv`);
      toast({ title: "Export complete", description: `${item.label} exported successfully.` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Export Data</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportItems.map((item) => (
          <Card key={item.endpoint} data-testid={`export-card-${item.endpoint}`}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => handleExport(item)}
                disabled={loading === item.endpoint}
                data-testid={`button-export-${item.endpoint}`}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading === item.endpoint ? "Exporting..." : "Export CSV"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
