import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Filter,
} from "lucide-react";
import { useVenue } from "@/lib/venue-context";
import type { BlogPost } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "published":
      return <Badge className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-status-${status}`}><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
    case "scheduled":
      return <Badge variant="secondary" data-testid={`badge-status-${status}`}><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    case "review":
      return <Badge variant="secondary" className="bg-blue-600/10 text-blue-700 dark:text-blue-400" data-testid={`badge-status-${status}`}><Eye className="w-3 h-3 mr-1" />review</Badge>;
    case "rejected":
      return <Badge variant="destructive" data-testid={`badge-status-${status}`}><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
    default:
      return <Badge variant="outline" data-testid={`badge-status-${status}`}><Pencil className="w-3 h-3 mr-1" />{status}</Badge>;
  }
}

export default function ClientContent() {
  const { selectedVenue } = useVenue();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: allPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const posts = (allPosts || []).filter((p) => {
    if (selectedVenue && p.venueId !== selectedVenue.id) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">My Content</h1>
        <p className="text-muted-foreground mt-1">
          View your published and scheduled content
          {selectedVenue && (
            <span className="ml-1">
              for <span className="font-medium text-foreground">{selectedVenue.name}</span>
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Published", value: published, icon: FileText, color: "text-green-600 dark:text-green-400" },
          { label: "Drafts", value: drafts, icon: FileText, color: "text-yellow-600 dark:text-yellow-400" },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-client-content-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32" data-testid="select-client-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          {sortedPosts.length} post{sortedPosts.length !== 1 ? "s" : ""}
        </span>
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
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No content available yet.
                  </TableCell>
                </TableRow>
              ) : (
                sortedPosts.map((post) => (
                  <TableRow key={post.id} data-testid={`row-client-post-${post.id}`}>
                    <TableCell>
                      <span className="font-medium text-sm">{post.title}</span>
                    </TableCell>
                    <TableCell>
                      {post.primaryKeyword && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          {post.primaryKeyword}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "\u2014"}
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
