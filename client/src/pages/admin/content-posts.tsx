import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Clock, CheckCircle } from "lucide-react";

const stats = [
  { label: "Total Posts", value: "1,284", icon: FileText },
  { label: "Published", value: "1,102", icon: CheckCircle },
  { label: "Drafts", value: "147", icon: Clock },
  { label: "Total Views", value: "89.4K", icon: Eye },
];

const posts = [
  { title: "Top SEO Trends for 2026", agency: "Digital Growth NYC", workspace: "Acme Digital", status: "Published", date: "Feb 16, 2026", views: "2,341" },
  { title: "Complete Guide to Local SEO", agency: "Coastal Marketing Co.", workspace: "Coastal SEO", status: "Published", date: "Feb 15, 2026", views: "1,892" },
  { title: "Content Strategy for B2B Growth", agency: "Metro Creative Group", workspace: "Metro Creative", status: "Draft", date: "Feb 14, 2026", views: "0" },
  { title: "Link Building Best Practices", agency: "Alpine Digital Ltd.", workspace: "Summit Marketing", status: "Published", date: "Feb 13, 2026", views: "4,567" },
  { title: "Technical SEO Audit Checklist", agency: "Pacific Media Inc.", workspace: "Pinnacle Digital", status: "Published", date: "Feb 12, 2026", views: "987" },
  { title: "Core Web Vitals Optimization Guide", agency: "Urban Content Network", workspace: "Content Hub", status: "Draft", date: "Feb 11, 2026", views: "0" },
];

export default function AdminContentPosts() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">All Posts</h1>
        <p className="text-muted-foreground">Content published across all agencies</p>
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
          <CardTitle>Post Directory</CardTitle>
          <CardDescription>All blog posts and articles across agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.title} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-post-${post.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">{post.agency} &middot; {post.workspace} &middot; {post.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">{post.views} views</span>
                  <Badge variant={post.status === "Published" ? "default" : "secondary"}>{post.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-post-${post.title.toLowerCase().replace(/\s+/g, "-")}`}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
