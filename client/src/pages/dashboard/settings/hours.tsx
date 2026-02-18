import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Clock, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface BusinessHour {
  id: number;
  workspaceId: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultHours = {
  Monday: { open: true, start: "11:00", end: "22:00" },
  Tuesday: { open: true, start: "11:00", end: "22:00" },
  Wednesday: { open: true, start: "11:00", end: "22:00" },
  Thursday: { open: true, start: "11:00", end: "23:00" },
  Friday: { open: true, start: "11:00", end: "23:00" },
  Saturday: { open: true, start: "10:00", end: "23:00" },
  Sunday: { open: true, start: "10:00", end: "21:00" },
};

export default function SettingsHours() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [hours, setHours] = useState(defaultHours);
  const { toast } = useToast();

  const { data: savedHours = [], isLoading } = useQuery<BusinessHour[]>({
    queryKey: ["/api/workspaces", workspaceId, "hours"],
  });

  useEffect(() => {
    document.title = "Business Hours - indexFlow Dashboard";
  }, []);

  useEffect(() => {
    if (savedHours.length > 0) {
      const hoursMap: typeof defaultHours = { ...defaultHours };
      savedHours.forEach(h => {
        const dayName = days[h.dayOfWeek];
        if (dayName) {
          hoursMap[dayName as keyof typeof hoursMap] = {
            open: !h.isClosed,
            start: h.openTime || "11:00",
            end: h.closeTime || "22:00",
          };
        }
      });
      setHours(hoursMap);
    }
  }, [savedHours]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const hoursArray = days.map((day, index) => ({
        workspaceId,
        dayOfWeek: index,
        openTime: hours[day as keyof typeof hours].start,
        closeTime: hours[day as keyof typeof hours].end,
        isClosed: !hours[day as keyof typeof hours].open,
      }));
      return apiRequest("PUT", `/api/workspaces/${workspaceId}/hours`, hoursArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "hours"] });
      toast({ title: "Hours saved", description: "Your business hours have been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save hours.", variant: "destructive" });
    },
  });

  const handleToggleDay = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], open: !prev[day as keyof typeof prev].open }
    }));
  };

  const handleTimeChange = (day: string, field: "start" | "end", value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value }
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Business Hours</h1>
            <p className="text-sm text-muted-foreground">Set your business hours</p>
          </div>
          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            data-testid="button-save-hours"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Operating Hours
            </CardTitle>
            <CardDescription>
              The AI assistant will only accept inquiries during these hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : (
              <div className="space-y-3">
                {days.map((day) => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <div className="w-20 sm:w-28">
                        <Label className="font-medium text-sm sm:text-base">{day}</Label>
                      </div>
                      <Switch
                        checked={hours[day as keyof typeof hours].open}
                        onCheckedChange={() => handleToggleDay(day)}
                        data-testid={`switch-${day.toLowerCase()}`}
                      />
                    </div>
                    {hours[day as keyof typeof hours].open ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={hours[day as keyof typeof hours].start}
                          onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                          className="flex-1 sm:w-32 sm:flex-none"
                          data-testid={`input-${day.toLowerCase()}-start`}
                        />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Input
                          type="time"
                          value={hours[day as keyof typeof hours].end}
                          onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                          className="flex-1 sm:w-32 sm:flex-none"
                          data-testid={`input-${day.toLowerCase()}-end`}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
