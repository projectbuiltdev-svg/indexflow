import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Circle, Clock, CheckCircle2, Search, TicketIcon } from "lucide-react";

const stats = [
  { label: "Total Tickets", value: "0", icon: ClipboardList, iconColor: "text-muted-foreground" },
  { label: "Open", value: "0", icon: Circle, iconColor: "text-amber-500" },
  { label: "In Progress", value: "0", icon: Clock, iconColor: "text-blue-500" },
  { label: "Resolved", value: "0", icon: CheckCircle2, iconColor: "text-emerald-600" },
];

export default function AdminSupportTickets() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <TicketIcon className="h-6 w-6" />
            <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Support Tickets</h1>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Manage client support requests</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-tickets"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-priority-filter">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium" data-testid="text-empty-state">No support tickets yet</h3>
            <p className="text-sm text-muted-foreground mt-1">When clients submit support requests, they will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
