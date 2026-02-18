import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Sparkles } from "lucide-react";

export default function AdminContentPosts() {
  const [workspace, setWorkspace] = useState("all");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Content Engine</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">White-label blog management for client workspaces</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={workspace} onValueChange={setWorkspace}>
            <SelectTrigger className="w-[220px]" data-testid="select-workspace">
              <SelectValue placeholder="Select Workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workspaces</SelectItem>
              <SelectItem value="bella-cucina">Bella Cucina</SelectItem>
              <SelectItem value="grand-meridian">Grand Meridian Hotel</SelectItem>
              <SelectItem value="sakura-dining">Sakura Dining</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList data-testid="tabs-content">
            <TabsTrigger value="posts" data-testid="tab-posts">Posts</TabsTrigger>
            <TabsTrigger value="pages" data-testid="tab-pages">Pages</TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="domains" data-testid="tab-domains">Domains</TabsTrigger>
            <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
            <TabsTrigger value="links" data-testid="tab-links">Links</TabsTrigger>
            <TabsTrigger value="health" data-testid="tab-health">Health</TabsTrigger>
            <TabsTrigger value="cms" data-testid="tab-cms">CMS</TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
            <TabsTrigger value="invoices" data-testid="tab-invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold" data-testid="text-section-posts">Posts</h2>
                <span className="text-sm text-muted-foreground">(0)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" data-testid="button-bulk-generate">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Bulk Generate
                </Button>
                <Button data-testid="button-new-post">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium" data-testid="text-empty-state">No posts yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first post or use bulk generate to get started.</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Button variant="outline" data-testid="button-empty-bulk-generate">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Bulk Generate
                  </Button>
                  <Button data-testid="button-empty-new-post">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-pages-empty">No pages yet</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-campaigns-empty">No campaigns yet</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-domains-empty">No domains configured</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-seo-empty">SEO settings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-links-empty">No links configured</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-health-empty">Health checks will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cms">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-cms-empty">CMS integration settings</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-reports-empty">No reports available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-invoices-empty">No invoices yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
