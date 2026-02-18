import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function RoomTypes() {
  useEffect(() => {
    document.title = "Page Not Available - indexFlow Dashboard";
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" data-testid="text-page-unavailable">Page Not Available</h3>
            <p className="text-muted-foreground">
              This page is no longer available.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
