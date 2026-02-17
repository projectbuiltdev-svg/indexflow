import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function GscAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">GSC Analytics</h1>
        <p className="text-muted-foreground mt-1">Google Search Console integration</p>
      </div>

      <Card className="p-8 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2" data-testid="text-gsc-coming-soon">GSC Analytics - Coming Soon</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Google Search Console analytics integration is currently being developed. Check back soon for detailed search performance data.
        </p>
      </Card>
    </div>
  );
}
