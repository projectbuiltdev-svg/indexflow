import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminExport() {
  const { toast } = useToast();
  const { data: venues } = useQuery<any[]>({ queryKey: ["/api/venues"] });
  const { data: users } = useQuery<any[]>({ queryKey: ["/api/users"] });
  const { data: posts } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });
  const { data: messages } = useQuery<any[]>({ queryKey: ["/api/contact-messages"] });
  const { data: callLogs } = useQuery<any[]>({ queryKey: ["/api/admin/call-logs"] });
  const { data: tickets } = useQuery<any[]>({ queryKey: ["/api/admin/support-tickets"] });

  const exports = [
    { title: "Venues", description: "Export all venue/client data", data: venues, filename: "venues.csv" },
    { title: "Users", description: "Export all user accounts", data: users, filename: "users.csv" },
    { title: "Blog Posts", description: "Export all blog posts", data: posts, filename: "blog-posts.csv" },
    { title: "Contact Messages", description: "Export all CRM messages", data: messages, filename: "contact-messages.csv" },
    { title: "Call Logs", description: "Export all call logs", data: callLogs, filename: "call-logs.csv" },
    { title: "Support Tickets", description: "Export all support tickets", data: tickets, filename: "support-tickets.csv" },
  ];

  const handleExport = (data: any[] | undefined, filename: string, title: string) => {
    if (!data?.length) {
      toast({ title: "No data", description: `No ${title.toLowerCase()} data to export.` });
      return;
    }
    downloadCSV(data, filename);
    toast({ title: "Exported", description: `${title} exported successfully.` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-export-title">Export Data</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exports.map((e) => (
          <Card key={e.title}>
            <CardHeader>
              <CardTitle className="text-lg">{e.title}</CardTitle>
              <CardDescription>{e.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport(e.data, e.filename, e.title)}
                data-testid={`button-export-${e.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
