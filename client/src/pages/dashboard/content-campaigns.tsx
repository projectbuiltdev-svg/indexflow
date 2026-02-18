import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, TrendingUp, Mail, MousePointer } from "lucide-react";

const mockCampaigns = [
  { id: 1, name: "Spring Launch 2026", type: "Email", status: "active", sent: 2400, opened: 1680, clicks: 312 },
  { id: 2, name: "Valentine's Day Special", type: "Email", status: "completed", sent: 1800, opened: 1260, clicks: 245 },
  { id: 3, name: "Weekend Brunch Promo", type: "Social", status: "active", sent: 0, opened: 0, clicks: 890 },
  { id: 4, name: "New Menu Announcement", type: "Email", status: "draft", sent: 0, opened: 0, clicks: 0 },
];

export default function ContentCampaigns() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Campaigns</h1>
            <p className="text-muted-foreground">Create and manage marketing campaigns</p>
          </div>
          <Button data-testid="button-create-campaign">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-campaigns">4</p>
                  <p className="text-xs text-muted-foreground">Total Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-active-campaigns">2</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-emails-sent">4,200</p>
                  <p className="text-xs text-muted-foreground">Emails Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MousePointer className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-clicks">1,447</p>
                  <p className="text-xs text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>Track and manage your marketing efforts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-campaign-${campaign.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{campaign.type}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {campaign.sent > 0 && <span className="text-sm text-muted-foreground">{campaign.sent} sent</span>}
                    {campaign.clicks > 0 && <span className="text-sm text-muted-foreground">{campaign.clicks} clicks</span>}
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="text-xs">
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
