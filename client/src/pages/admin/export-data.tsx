import { useState } from "react";
import { 
  Download, FileSpreadsheet, Building2, Calendar, CalendarOff, Phone, BarChart3, 
  Bed, Users, Globe, CreditCard, Filter, CheckCircle2,
  MessageSquare, MessageCircle, Brain, Mail, TrendingUp, FileEdit,
} from "lucide-react";
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
import { AdminLayout } from "@/components/admin-layout";

const exportTypes = [
  {
    id: "clients",
    title: "Client Data",
    description: "Export all client accounts with plan details, status, and contact information",
    icon: Building2,
    fields: ["Client Name", "Plan", "Status", "MRR", "Website", "Created", "Contact Email"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "leads",
    title: "All Leads",
    description: "Export platform-wide lead data across all clients",
    icon: Calendar,
    fields: ["Client", "Date", "Time", "Contact Name", "Project Size", "Status", "Source"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "projects",
    title: "Active Projects",
    description: "Export all active projects across all clients",
    icon: BarChart3,
    fields: ["Client", "Contact", "Project Type", "Start Date", "End Date", "Team Size", "Status", "Total"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "calls",
    title: "AI Call Logs",
    description: "Export all AI voice call data across the platform with outcomes and transcripts",
    icon: Phone,
    fields: ["Client", "Date", "Caller", "Duration", "Outcome", "AI Model", "Transcript Summary"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "sms",
    title: "SMS Messages",
    description: "Export inbound and outbound SMS history across all clients",
    icon: MessageCircle,
    fields: ["Client", "Date", "Direction", "From", "To", "Message", "Status", "Type"],
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "widget-chats",
    title: "Widget Chat Logs",
    description: "Export website visitor chat conversations from AI widgets across all clients",
    icon: MessageSquare,
    fields: ["Client", "Date", "Visitor", "Message Count", "Messages", "Duration", "Outcome"],
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: "rank-tracker",
    title: "Rank Tracker",
    description: "Export keyword rankings, positions, URLs, and AI search engine mentions across all clients",
    icon: TrendingUp,
    fields: ["Client", "Keyword", "Position", "Previous", "Change", "URL", "AI Mentions", "Checked At"],
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "website-changes",
    title: "Website Changes",
    description: "Export all website change requests and their statuses across all clients",
    icon: FileEdit,
    fields: ["Client", "Request ID", "Type", "Description", "Status", "Priority", "Submitted", "Completed"],
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: "billing",
    title: "Billing & Revenue",
    description: "Export transaction history, subscription data, and revenue metrics",
    icon: CreditCard,
    fields: ["Client", "Date", "Amount", "Type", "Status", "Plan", "Payment Method"],
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "users",
    title: "User Accounts",
    description: "Export all user accounts with roles, permissions, and activity data",
    icon: Users,
    fields: ["Name", "Email", "Role", "Client", "Last Active", "Created", "Status"],
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base",
    description: "Export AI training data across all clients including content and scan results",
    icon: Brain,
    fields: ["Client", "Title", "Type", "Content", "Source URL", "Added Date", "Status"],
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "contacts",
    title: "Contact Messages",
    description: "Export contact form submissions received by all client websites",
    icon: Mail,
    fields: ["Client", "Date", "Name", "Email", "Phone", "Subject", "Message", "Status"],
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "websites",
    title: "Website Data",
    description: "Export website configurations, domains, templates, and deployment status",
    icon: Globe,
    fields: ["Client", "Domain", "Template", "Status", "Last Updated", "SSL", "Analytics"],
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    id: "closures",
    title: "Scheduled Closures",
    description: "Export workspace closure dates for holidays and special events across all clients",
    icon: CalendarOff,
    fields: ["Client", "Start Date", "End Date", "Reason", "Type", "Status", "Created"],
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  {
    id: "analytics",
    title: "Platform Analytics",
    description: "Export platform-wide performance metrics and usage statistics",
    icon: BarChart3,
    fields: ["Date", "Total Leads", "AI Calls", "Widget Interactions", "Active Users", "Revenue"],
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
  },
];

const recentExports = [
  { name: "all_clients_feb_2026.csv", type: "Client Data", date: "Feb 10, 2026", rows: 47 },
  { name: "platform_leads_feb_2026.csv", type: "All Leads", date: "Feb 9, 2026", rows: 2847 },
  { name: "rank_tracker_feb_2026.csv", type: "Rank Tracker", date: "Feb 8, 2026", rows: 342 },
  { name: "website_changes_feb_2026.csv", type: "Website Changes", date: "Feb 7, 2026", rows: 89 },
  { name: "billing_q1_2026.csv", type: "Billing & Revenue", date: "Feb 5, 2026", rows: 516 },
  { name: "call_logs_jan_2026.csv", type: "AI Call Logs", date: "Jan 28, 2026", rows: 1293 },
];

export default function AdminExportData() {
  const [dateRange, setDateRange] = useState("last-30");
  const [format, setFormat] = useState("csv");
  const [clientFilter, setClientFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = (typeId: string) => {
    setExporting(true);
    setExported(null);
    setTimeout(() => {
      setExporting(false);
      setExported(typeId);
      setTimeout(() => setExported(null), 3000);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-admin-export-title">Export Data</h1>
        <p className="text-muted-foreground">Download platform-wide data for reporting and analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger data-testid="select-admin-date-range">
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
                  <Label>Start Date</Label>
                  <Input type="date" data-testid="input-admin-start-date" />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input type="date" data-testid="input-admin-end-date" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Client Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Client</Label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger data-testid="select-admin-client-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="acme-digital">Acme Digital</SelectItem>
                  <SelectItem value="dragon-media">Dragon Media</SelectItem>
                  <SelectItem value="coastal-seo">Coastal SEO</SelectItem>
                  <SelectItem value="summit-marketing">Summit Marketing</SelectItem>
                  <SelectItem value="metro-creative">Metro Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>File Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger data-testid="select-admin-format">
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
              Recent Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExports.map((exp) => (
                <div key={exp.name} className="flex items-center justify-between text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{exp.name}</p>
                    <p className="text-xs text-muted-foreground">{exp.rows} rows</p>
                  </div>
                  <Button size="icon" variant="ghost" data-testid={`button-redownload-${exp.name}`}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {exportTypes.map((type) => (
          <Card key={type.id} className="hover-elevate">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center`}>
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <div>
                  <CardTitle className="text-sm">{type.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-xs mt-2">{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {type.fields.slice(0, 4).map((field) => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                  {type.fields.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{type.fields.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                className="w-full"
                size="sm"
                onClick={() => handleExport(type.id)}
                disabled={exporting}
                data-testid={`button-export-${type.id}`}
              >
                {exported === type.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Done
                  </>
                ) : exporting ? (
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
    </AdminLayout>
  );
}
