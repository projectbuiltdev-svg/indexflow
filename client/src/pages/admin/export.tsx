import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, Building2, CalendarCheck, MessageSquare, LifeBuoy } from "lucide-react";

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

interface ExportCategory {
  name: string;
  endpoint: string;
  icon: typeof Building2;
  headers: string[];
  rowMapper: (item: Record<string, unknown>) => string[];
}

const exportCategories: ExportCategory[] = [
  {
    name: "Workspaces",
    endpoint: "/api/workspaces",
    icon: Building2,
    headers: ["ID", "Name", "Type", "Plan", "Status", "Phone", "Email", "Address"],
    rowMapper: (v) => [String(v.id), String(v.name), String(v.type), String(v.plan), String(v.status), String(v.phone || ""), String(v.email || ""), String(v.address || "")],
  },
  {
    name: "Analytics",
    endpoint: "/api/analytics",
    icon: CalendarCheck,
    headers: ["ID", "Workspace ID", "Contact Name", "Email", "Phone", "Project Size", "Date", "Time", "Status"],
    rowMapper: (r) => [String(r.id), String(r.workspaceId), String(r.contactName), String(r.contactEmail || ""), String(r.contactPhone || ""), String(r.projectSize), String(r.date), String(r.time), String(r.status || "")],
  },
  {
    name: "Contact Messages",
    endpoint: "/api/contact-messages",
    icon: MessageSquare,
    headers: ["ID", "Name", "Email", "Phone", "Company", "Inquiry Type", "Message", "Date"],
    rowMapper: (m) => [String(m.id), String(m.name), String(m.email), String(m.phone || ""), String(m.company || ""), String(m.inquiryType || ""), String(m.message), String(m.createdAt || "")],
  },
  {
    name: "Support Tickets",
    endpoint: "/api/support-tickets",
    icon: LifeBuoy,
    headers: ["ID", "Workspace ID", "Subject", "Category", "Priority", "Status", "Date"],
    rowMapper: (t) => [String(t.id), String(t.workspaceId), String(t.subject), String(t.category), String(t.priority), String(t.status), String(t.createdAt || "")],
  },
];

export default function AdminExport() {
  useWorkspace();
  const { toast } = useToast();
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const handleExport = async (category: ExportCategory) => {
    setLoadingCategory(category.name);
    try {
      const res = await fetch(category.endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        toast({ title: "No data", description: `No ${category.name.toLowerCase()} to export.` });
        setLoadingCategory(null);
        return;
      }
      const rows = data.map(category.rowMapper);
      downloadCSV(`${category.name.toLowerCase().replace(/\s+/g, "_")}_export.csv`, category.headers, rows);
      toast({ title: "Export complete", description: `${data.length} ${category.name.toLowerCase()} exported.` });
    } catch (err) {
      toast({ title: "Export failed", description: String(err), variant: "destructive" });
    } finally {
      setLoadingCategory(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-export">Export Data</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportCategories.map((category) => (
          <Card key={category.name} data-testid={`card-export-${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => handleExport(category)}
                disabled={loadingCategory === category.name}
                data-testid={`button-export-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Download className="h-4 w-4 mr-2" />
                {loadingCategory === category.name ? "Exporting..." : "Download CSV"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
