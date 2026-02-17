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
import { Plus, FileText, ExternalLink, Eye, MousePointer } from "lucide-react";
import type { BlogPost } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  if (status === "published") return <Badge variant="default" className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-status-${status}`}>{status}</Badge>;
  if (status === "scheduled") return <Badge variant="secondary" data-testid={`badge-status-${status}`}>{status}</Badge>;
  return <Badge variant="outline" data-testid={`badge-status-${status}`}>{status}</Badge>;
}

export default function ContentEngine() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const published = posts?.filter((p) => p.status === "published").length || 0;
  const drafts = posts?.filter((p) => p.status === "draft").length || 0;
  const totalClicks = posts?.reduce((sum, p) => sum + (p.clicks || 0), 0) || 0;
  const totalImpressions = posts?.reduce((sum, p) => sum + (p.impressions || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Content Engine</h1>
          <p className="text-muted-foreground mt-1">Manage and deploy programmatic SEO content</p>
        </div>
        <Button data-testid="button-add-post">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published", value: published, icon: FileText, color: "text-green-600 dark:text-green-400" },
          { label: "Drafts", value: drafts, icon: FileText, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointer, color: "text-primary" },
          { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-primary" },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-content-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className={`w-5 h-5 ${m.color}`} />
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
                <TableHead>Title</TableHead>
                <TableHead>Keyword</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Words</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No posts yet. Create your first post to get started.
                  </TableCell>
                </TableRow>
              ) : (
                posts?.map((post) => (
                  <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-xs">
                        <span className="font-medium text-sm truncate">{post.title}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {post.primaryKeyword}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      {post.wordCount?.toLocaleString() || "\u2014"}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      {post.clicks?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      {post.impressions?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      {post.position ? `#${post.position.toFixed(1)}` : "\u2014"}
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
