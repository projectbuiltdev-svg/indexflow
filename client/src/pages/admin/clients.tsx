import { Link } from "wouter";
import { Building2, Plus, Search, Filter, MoreVertical, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

const clients = [
  { id: 1, name: "Acme Digital", plan: "Complete Solution", status: "Active", mrr: "$299", website: "acmedigital.com", twilioConnected: true, keywords: 28, gscConnected: true, created: "Jan 15, 2026" },
  { id: 2, name: "Dragon Media", plan: "Virtual Concierge", status: "Active", mrr: "$149", website: "-", twilioConnected: true, keywords: 18, gscConnected: true, created: "Jan 20, 2026" },
  { id: 3, name: "Coastal SEO", plan: "Complete Solution", status: "Pending Setup", mrr: "$299", website: "coastalseo.com", twilioConnected: false, keywords: 22, gscConnected: false, created: "Jan 24, 2026" },
  { id: 4, name: "Summit Marketing", plan: "Complete Solution", status: "Active", mrr: "$299", website: "summitmarketing.com", twilioConnected: true, keywords: 35, gscConnected: true, created: "Jan 10, 2026" },
  { id: 5, name: "Metro Creative", plan: "Virtual Concierge", status: "Active", mrr: "$149", website: "-", twilioConnected: true, keywords: 10, gscConnected: false, created: "Jan 5, 2026" },
];

export default function AdminClients() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage all client accounts</p>
        </div>
        <Button data-testid="button-add-client">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search clients..." className="pl-9" data-testid="input-search-clients" />
            </div>
            <Button variant="outline" size="icon" data-testid="button-filter">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Plan</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">MRR</th>
                  <th className="pb-3 font-medium text-muted-foreground">Twilio</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Keywords</th>
                  <th className="pb-3 font-medium text-muted-foreground">GSC</th>
                  <th className="pb-3 font-medium text-muted-foreground">Website</th>
                  <th className="pb-3 font-medium text-muted-foreground">Created</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{client.plan}</td>
                    <td className="py-4">
                      <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="py-4">{client.mrr}</td>
                    <td className="py-4">
                      {client.twilioConnected ? (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs" data-testid={`badge-twilio-${client.id}`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs" data-testid={`badge-twilio-${client.id}`}>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Set Up
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 text-right text-sm">{client.keywords}</td>
                    <td className="py-4">
                      {client.gscConnected ? (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs" data-testid={`badge-gsc-${client.id}`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs" data-testid={`badge-gsc-${client.id}`}>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Set Up
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 text-muted-foreground">{client.website}</td>
                    <td className="py-4 text-muted-foreground">{client.created}</td>
                    <td className="py-4">
                      <Button variant="ghost" size="icon" data-testid={`button-more-${client.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
