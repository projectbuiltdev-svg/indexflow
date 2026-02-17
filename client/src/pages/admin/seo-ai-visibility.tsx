import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";

export default function AdminAIVisibility() {
  useVenue();

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-ai-visibility">
          AI Visibility
        </h1>
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
