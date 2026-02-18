import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function BookingDetail() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    document.title = "Page Not Found - indexFlow Dashboard";
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href={`/${workspaceId}/today`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Page Not Found</h1>
            <p className="text-sm text-muted-foreground">This page is no longer available.</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" data-testid="text-not-found">Page Not Found</h3>
            <p className="text-muted-foreground mb-4">
              This page is no longer available in the current platform.
            </p>
            <Link href={`/${workspaceId}/today`}>
              <Button data-testid="button-go-dashboard">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
