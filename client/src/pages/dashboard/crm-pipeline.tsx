import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kanban, Plus, DollarSign, Users, TrendingUp } from "lucide-react";

const mockPipeline = {
  lead: [
    { id: 1, name: "John Smith", company: "Acme Corp", value: 5000, date: "2026-02-18" },
    { id: 2, name: "Sarah Johnson", company: "Tech Inc", value: 3200, date: "2026-02-17" },
  ],
  qualified: [
    { id: 3, name: "Mike Davis", company: "Global Ltd", value: 8500, date: "2026-02-15" },
  ],
  proposal: [
    { id: 4, name: "Emily Chen", company: "StartUp Co", value: 12000, date: "2026-02-12" },
    { id: 5, name: "Robert Wilson", company: "Enterprise", value: 25000, date: "2026-02-10" },
  ],
  closed: [
    { id: 6, name: "Lisa Brown", company: "Retail Plus", value: 7500, date: "2026-02-08" },
  ],
};

export default function CrmPipeline() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Pipeline</h1>
            <p className="text-muted-foreground">Manage your sales pipeline and deals</p>
          </div>
          <Button data-testid="button-add-deal">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Kanban className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-deals">6</p>
                  <p className="text-xs text-muted-foreground">Total Deals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-pipeline-value">$61,200</p>
                  <p className="text-xs text-muted-foreground">Pipeline Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-new-leads">2</p>
                  <p className="text-xs text-muted-foreground">New Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-win-rate">42%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(mockPipeline).map(([stage, deals]) => (
            <Card key={stage}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm capitalize flex items-center justify-between gap-2 flex-wrap">
                  {stage}
                  <Badge variant="secondary" className="text-xs">{deals.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div key={deal.id} className="p-3 rounded-lg border hover-elevate cursor-pointer" data-testid={`card-deal-${deal.id}`}>
                      <p className="font-medium text-sm">{deal.name}</p>
                      <p className="text-xs text-muted-foreground">{deal.company}</p>
                      <p className="text-sm font-semibold mt-1">${deal.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
