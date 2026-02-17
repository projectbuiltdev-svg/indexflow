import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserPlus, CalendarCheck, Phone, Mail, Plus } from "lucide-react";
import type { Lead } from "@shared/schema";

function LeadStatusBadge({ status }: { status: string }) {
  if (status === "booked") return <Badge variant="default" className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-lead-${status}`}>{status}</Badge>;
  if (status === "qualified") return <Badge variant="default" data-testid={`badge-lead-${status}`}>{status}</Badge>;
  if (status === "lost") return <Badge variant="destructive" data-testid={`badge-lead-${status}`}>{status}</Badge>;
  return <Badge variant="outline" data-testid={`badge-lead-${status}`}>{status}</Badge>;
}

function SourceBadge({ source }: { source: string }) {
  return <Badge variant="secondary" data-testid={`badge-source-${source}`}>{source}</Badge>;
}

export default function LeadsCRM() {
  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter((l) => l.status === "new").length || 0;
  const booked = leads?.filter((l) => l.status === "booked").length || 0;
  const conversionRate = totalLeads > 0 ? ((booked / totalLeads) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Leads & CRM</h1>
          <p className="text-muted-foreground mt-1">Track leads from organic search to booking</p>
        </div>
        <Button data-testid="button-add-lead">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: totalLeads, icon: Users },
          { label: "New", value: newLeads, icon: UserPlus },
          { label: "Booked", value: booked, icon: CalendarCheck },
          { label: "Conversion", value: `${conversionRate}%`, icon: CalendarCheck },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-lead-${m.label.toLowerCase()}`}>{m.value}</p>
              </div>
              <m.icon className="w-5 h-5 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Keyword</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No leads yet. Leads will appear here as they come in.
                  </TableCell>
                </TableRow>
              ) : (
                leads?.map((lead) => (
                  <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                    <TableCell className="font-medium text-sm">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {lead.email && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <SourceBadge source={lead.source} />
                    </TableCell>
                    <TableCell>
                      {lead.keyword ? (
                        <Badge variant="secondary" className="text-xs font-normal">
                          {lead.keyword}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">{"\u2014"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <LeadStatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "\u2014"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
