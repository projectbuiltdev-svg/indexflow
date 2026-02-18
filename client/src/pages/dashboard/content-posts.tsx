import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Eye, Clock, CheckCircle } from "lucide-react";

const mockPosts = [
  { id: 1, title: "10 Tips for Better Customer Experience", status: "published", views: 1243, date: "2026-02-15" },
  { id: 2, title: "How to Optimize Your Booking Flow", status: "published", views: 892, date: "2026-02-12" },
  { id: 3, title: "Seasonal Menu Ideas for Spring 2026", status: "draft", views: 0, date: "2026-02-10" },
  { id: 4, title: "Why Online Reservations Matter", status: "published", views: 2104, date: "2026-02-08" },
  { id: 5, title: "Staff Training Best Practices", status: "scheduled", views: 0, date: "2026-02-20" },
];

export default function ContentPosts() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Posts</h1>
            <p className="text-muted-foreground">Manage blog posts for your workspace</p>
          </div>
          <Button data-testid="button-create-post">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-posts">5</p>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-published-posts">3</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-draft-posts">1</p>
                  <p className="text-xs text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-views">4,239</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>View and manage your blog content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-post-${post.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs">
                      {post.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{post.views} views</span>
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
