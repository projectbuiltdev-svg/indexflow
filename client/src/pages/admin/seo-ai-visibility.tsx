import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";

export default function AdminAIVisibility() {
  useWorkspace();

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">AI Visibility</h1>
        <p className="text-sm text-muted-foreground">AI search engine visibility tracking</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Visibility</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-3" data-testid="ai-visibility-coming-soon">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-medium">AI Visibility - Coming Soon</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Track how your brand appears across AI-powered search platforms like ChatGPT, Perplexity, and Google AI Overviews.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
