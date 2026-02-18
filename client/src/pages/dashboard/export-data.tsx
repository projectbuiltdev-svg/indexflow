import { useState } from "react";
import { useParams } from "wouter";
import {
  Download, FileSpreadsheet, Calendar, CalendarOff, Phone, BarChart3, Bed, Filter, CheckCircle2,
  MessageSquare, MessageCircle, Users, Brain, Globe, Mail,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";

const exportTypes = [
  {
    id: "bookings",
    title: "Client Reports",
    description: "Export all client report data including contact details, campaign status, and notes",
    icon: Calendar,
    fields: ["Date", "Time", "Client Name", "Email", "Phone", "Campaign", "Status", "Notes", "Source"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "calls",
    title: "Call Logs",
    description: "Export AI call history with transcripts, durations, outcomes, and caller information",
    icon: Phone,
    fields: ["Date", "Caller", "Duration", "Outcome", "Transcript Summary", "AI Model", "Sentiment"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "analytics",
    title: "Analytics Data",
    description: "Export performance metrics including widget interactions, conversion rates, and trends",
    icon: BarChart3,
    fields: ["Date", "Widget Impressions", "Interactions", "Conversions", "Calls Answered", "Leads Generated"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "rooms",
    title: "Project Data",
    description: "Export project data including client details, project types, and timeline dates",
    icon: Bed,
    fields: ["Project ID", "Client Name", "Project Type", "Project Code", "Start Date", "End Date", "Team", "Status", "Total"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "rank-tracker",
    title: "Rank Tracker",
    description: "Export keyword rankings, positions, URLs, and AI search engine mentions",
    icon: TrendingUp,
    fields: ["Keyword", "Position", "Previous Position", "Change", "URL", "AI Mentions", "Checked At"],
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "widget-chats",
    title: "Widget Chat Logs",
    description: "Export website visitor conversations from the AI chat widget",
    icon: MessageSquare,
    fields: ["Date", "Visitor", "Message Count", "Messages", "Duration", "Outcome"],
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: "sms",
    title: "SMS Messages",
    description: "Export inbound and outbound SMS history from Twilio integration",
    icon: MessageCircle,
    fields: ["Date", "Direction", "From", "To", "Message", "Status", "Type"],
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "team",
    title: "Team Members",
    description: "Export your team directory with roles, contact details, and permissions",
    icon: Users,
    fields: ["Name", "Email", "Phone", "Role", "Status", "Added Date"],
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base",
    description: "Export AI training data including uploaded content and website scan results",
    icon: Brain,
    fields: ["Title", "Type", "Content", "Source URL", "Added Date", "Status"],
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "website-changes",
    title: "Website Changes",
    description: "Export your website change request history with statuses and details",
    icon: Globe,
    fields: ["Request ID", "Type", "Description", "Status", "Submitted", "Completed"],
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: "contacts",
    title: "Contact Messages",
    description: "Export contact form submissions from your website visitors",
    icon: Mail,
    fields: ["Date", "Name", "Email", "Phone", "Subject", "Message", "Status"],
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "closures",
    title: "Scheduled Maintenance",
    description: "Export your workspace maintenance dates for updates, migrations, and planned downtime",
    icon: CalendarOff,
    fields: ["Start Date", "End Date", "Reason", "Type", "Status", "Created"],
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
];

export default function ExportData() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("last-30");
  const [format, setFormat] = useState("csv");
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

  const getEndpointAndFilename = (typeId: string): { endpoint: string; filename: string } => {
    const date = new Date().toISOString().slice(0, 10);
    switch (typeId) {
      case "bookings":
        return { endpoint: `/api/workspaces/${workspaceId}/reservations`, filename: `bookings_${date}.csv` };
      case "calls":
        return { endpoint: `/api/workspaces/${workspaceId}/calls`, filename: `call_logs_${date}.csv` };
      case "rooms":
        return { endpoint: `/api/workspaces/${workspaceId}/room-bookings`, filename: `room_bookings_${date}.csv` };
      case "analytics":
        return { endpoint: `/api/workspaces/${workspaceId}/reservations`, filename: `analytics_${date}.csv` };
      case "rank-tracker":
        return { endpoint: `/api/workspaces/${workspaceId}/rank-tracker/latest`, filename: `rank_tracker_${date}.csv` };
      case "widget-chats":
        return { endpoint: `/api/workspaces/${workspaceId}/widget-chat-logs`, filename: `widget_chats_${date}.csv` };
      case "sms":
        return { endpoint: `/api/workspaces/${workspaceId}/calls?type=sms`, filename: `sms_messages_${date}.csv` };
      case "team":
        return { endpoint: `/api/workspaces/${workspaceId}/team`, filename: `team_members_${date}.csv` };
      case "knowledge-base":
        return { endpoint: `/api/workspaces/${workspaceId}/knowledge-base`, filename: `knowledge_base_${date}.csv` };
      case "website-changes":
        return { endpoint: `/api/workspaces/${workspaceId}/website-changes`, filename: `website_changes_${date}.csv` };
      case "contacts":
        return { endpoint: `/api/workspaces/${workspaceId}/contact-messages`, filename: `contact_messages_${date}.csv` };
      case "closures":
        return { endpoint: `/api/workspaces/${workspaceId}/closures`, filename: `closures_${date}.csv` };
      default:
        return { endpoint: "", filename: "" };
    }
  };

  const handleExport = async (typeId: string) => {
    setExporting(typeId);
    setExported(null);
    try {
      const { endpoint, filename } = getEndpointAndFilename(typeId);
      if (!endpoint) throw new Error("Unknown export type");

      const response = await fetch(endpoint, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      const rows = Array.isArray(data) ? data : data.results ? data.results : data.items ? data.items : data.keywords ? data.keywords : [];

      if (rows.length === 0) {
        toast({ title: "No Data", description: "No data available to export for the selected range.", variant: "destructive" });
        setExporting(null);
        return;
      }

      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(","),
        ...rows.map((row: Record<string, unknown>) => headers.map(h => {
          const val = row[h];
          const str = val === null || val === undefined ? "" : String(val);
          return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g, '""')}"` : str;
        }).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(typeId);
      toast({ title: "Export Complete", description: `${filename} has been downloaded.` });
      setTimeout(() => setExported(null), 3000);
    } catch (error) {
      toast({ title: "Export Failed", description: "Unable to export data. Please try again.", variant: "destructive" });
    }
    setExporting(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-export-title">Export Data</h1>
        <p className="text-muted-foreground">Download your workspace data in CSV format</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Export Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger data-testid="select-date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7">Last 7 Days</SelectItem>
                  <SelectItem value="last-30">Last 30 Days</SelectItem>
                  <SelectItem value="last-90">Last 90 Days</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" data-testid="input-start-date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" data-testid="input-end-date" />
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="format">File Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger data-testid="select-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Export Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available exports</span>
                <Badge variant="secondary">{exportTypes.length} categories</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Format</span>
                <Badge variant="secondary">{format.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date range</span>
                <Badge variant="secondary">{dateRange.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase())}</Badge>
              </div>
              <p className="text-xs text-muted-foreground pt-2" data-testid="text-exports-info">
                Exports are downloaded directly to your device.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exportTypes.map((type) => (
          <Card key={type.id} className="hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center shrink-0`}>
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base">{type.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{type.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Included fields:</p>
                <div className="flex flex-wrap gap-1">
                  {type.fields.map((field) => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => handleExport(type.id)}
                disabled={exporting !== null}
                data-testid={`button-export-${type.id}`}
              >
                {exported === type.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Exported
                  </>
                ) : exporting === type.id ? (
                  "Preparing..."
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
