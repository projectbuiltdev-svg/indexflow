import { useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function CalendarView() {
  useEffect(() => {
    document.title = "Content Calendar - indexFlow Dashboard";
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your content publishing</p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" data-testid="text-calendar-placeholder">Content Calendar</h3>
            <p className="text-muted-foreground">
              Plan and schedule your content publishing across all channels. Coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
