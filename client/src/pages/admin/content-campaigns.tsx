import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Target, TrendingUp, Calendar } from "lucide-react";

const stats = [
  { label: "Total Campaigns", value: "86", icon: Megaphone },
  { label: "Active Now", value: "23", icon: Target },
  { label: "Avg. Engagement", value: "4.2%", icon: TrendingUp },
  { label: "Scheduled", value: "12", icon: Calendar },
];

const campaigns = [
  { name: "Spring Menu Launch", agency: "Hospitality Group NYC", type: "Email + Social", status: "Active", startDate: "Mar 1, 2026", engagement: "5.1%" },
  { name: "Valentine's Promo", agency: "Coastal Dining Co.", type: "Email", status: "Completed", startDate: "Feb 1, 2026", engagement: "6.8%" },
  { name: "Hotel Weekend Deals", agency: "Alpine Hotels Ltd.", type: "Social + SMS", status: "Active", startDate: "Feb 10, 2026", engagement: "3.9%" },
  { name: "New Year Celebrations", agency: "Metro Bistro Group", type: "Email + Social", status: "Completed", startDate: "Dec 15, 2025", engagement: "7.2%" },
  { name: "Loyalty Program Push", agency: "Pacific Venues Inc.", type: "Email", status: "Scheduled", startDate: "Mar 15, 2026", engagement: "--" },
];

export default function AdminContentCampaigns() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">All Campaigns</h1>
        <p className="text-muted-foreground">Marketing campaigns across all agencies</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Directory</CardTitle>
          <CardDescription>All marketing campaigns and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-campaign-${campaign.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">{campaign.agency} &middot; {campaign.type} &middot; Started {campaign.startDate}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">{campaign.engagement} eng.</span>
                  <Badge variant={campaign.status === "Active" ? "default" : campaign.status === "Completed" ? "secondary" : "outline"}>{campaign.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-campaign-${campaign.name.toLowerCase().replace(/\s+/g, "-")}`}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
