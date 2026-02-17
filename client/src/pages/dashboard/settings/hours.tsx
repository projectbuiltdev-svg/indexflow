import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save } from "lucide-react";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface HourRow {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export default function SettingsHours() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();

  const { data: hoursData = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/business-hours", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/business-hours?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  const [hours, setHours] = useState<HourRow[]>([]);

  useEffect(() => {
    if (hoursData.length > 0) {
      setHours(
        DAY_NAMES.map((_, i) => {
          const existing = hoursData.find((h: any) => h.dayOfWeek === i);
          return {
            dayOfWeek: i,
            openTime: existing?.openTime || "09:00",
            closeTime: existing?.closeTime || "22:00",
            isClosed: existing?.isClosed ?? false,
          };
        })
      );
    } else {
      setHours(
        DAY_NAMES.map((_, i) => ({
          dayOfWeek: i,
          openTime: "09:00",
          closeTime: "22:00",
          isClosed: false,
        }))
      );
    }
  }, [hoursData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/api/business-hours", { venueId, hours });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-hours"] });
      toast({ title: "Business hours saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Business Hours</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  const updateHour = (dayOfWeek: number, field: keyof HourRow, value: any) => {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold" data-testid="page-title">Business Hours</h1>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-hours">
          <Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Hours"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hours.map((h) => (
            <div key={h.dayOfWeek} className="flex items-center gap-4 flex-wrap" data-testid={`hours-row-${h.dayOfWeek}`}>
              <div className="w-28 font-medium">{DAY_NAMES[h.dayOfWeek]}</div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={!h.isClosed}
                  onCheckedChange={(checked) => updateHour(h.dayOfWeek, "isClosed", !checked)}
                  data-testid={`switch-closed-${h.dayOfWeek}`}
                />
                <Label className="text-sm text-muted-foreground">{h.isClosed ? "Closed" : "Open"}</Label>
              </div>
              {!h.isClosed && (
                <>
                  <Input
                    type="time"
                    value={h.openTime}
                    onChange={(e) => updateHour(h.dayOfWeek, "openTime", e.target.value)}
                    className="w-32"
                    data-testid={`input-open-${h.dayOfWeek}`}
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={h.closeTime}
                    onChange={(e) => updateHour(h.dayOfWeek, "closeTime", e.target.value)}
                    className="w-32"
                    data-testid={`input-close-${h.dayOfWeek}`}
                  />
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
