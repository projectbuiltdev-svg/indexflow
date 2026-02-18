import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, CheckCircle, Flag } from "lucide-react";

const stats = [
  { label: "Flagged Content", value: "8", icon: Flag },
  { label: "Pending Review", value: "5", icon: AlertTriangle },
  { label: "Resolved Today", value: "3", icon: CheckCircle },
  { label: "Auto-Blocked", value: "12", icon: ShieldAlert },
];

const flaggedItems = [
  { content: "Blog post contains promotional spam links", agency: "Urban Content Network", workspace: "Content Hub", type: "Blog Post", severity: "High", date: "Feb 17, 2026" },
  { content: "Service description with inappropriate language", agency: "Pacific Media Inc.", workspace: "Pinnacle Digital", type: "Service Page", severity: "Medium", date: "Feb 16, 2026" },
  { content: "Fake review detected by AI filter", agency: "Digital Growth NYC", workspace: "Acme Digital", type: "Review", severity: "High", date: "Feb 16, 2026" },
  { content: "Image violates brand guidelines", agency: "Coastal Marketing Co.", workspace: "Coastal SEO", type: "Image", severity: "Low", date: "Feb 15, 2026" },
  { content: "Duplicate content across workspaces", agency: "Alpine Digital Ltd.", workspace: "Summit Marketing", type: "Page Content", severity: "Medium", date: "Feb 14, 2026" },
];

export default function AdminContentModeration() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Content Moderation</h1>
        <p className="text-muted-foreground">Review and manage flagged content across the platform</p>
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
          <CardTitle>Flagged Content</CardTitle>
          <CardDescription>Content items requiring moderation review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flaggedItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-flagged-${i}`}>
                <div className="min-w-0">
                  <p className="font-medium">{item.content}</p>
                  <p className="text-sm text-muted-foreground">{item.agency} &middot; {item.workspace} &middot; {item.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{item.type}</Badge>
                  <Badge variant={item.severity === "High" ? "destructive" : item.severity === "Medium" ? "default" : "secondary"}>{item.severity}</Badge>
                  <Button size="sm" data-testid={`button-review-${i}`}>Review</Button>
                  <Button variant="outline" size="sm" data-testid={`button-dismiss-${i}`}>Dismiss</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
