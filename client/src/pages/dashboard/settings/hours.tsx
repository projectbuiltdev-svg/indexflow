import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const hourSchema = z.object({
  day: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  closed: z.boolean(),
});

const hoursFormSchema = z.object({
  hours: z.array(hourSchema),
});

type HoursFormValues = z.infer<typeof hoursFormSchema>;

export default function SettingsHours() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;
  const { toast } = useToast();

  const form = useForm<HoursFormValues>({
    resolver: zodResolver(hoursFormSchema),
    defaultValues: {
      hours: DAYS.map((day) => ({ day, openTime: "09:00", closeTime: "22:00", closed: false })),
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: "hours" });

  const { data: hoursData, isLoading } = useQuery<any>({
    queryKey: [`/api/business-hours?venueId=${venueId}`],
    enabled: !!venueId,
  });

  useEffect(() => {
    if (hoursData) {
      const existingHours = Array.isArray(hoursData) ? hoursData : hoursData.hours || [];
      if (existingHours.length > 0) {
        const merged = DAYS.map((day) => {
          const found = existingHours.find((h: any) => h.day === day || h.dayOfWeek === DAYS.indexOf(day));
          return found
            ? { day, openTime: found.openTime || "09:00", closeTime: found.closeTime || "22:00", closed: !!(found.closed || found.isClosed) }
            : { day, openTime: "09:00", closeTime: "22:00", closed: false };
        });
        form.reset({ hours: merged });
      }
    }
  }, [hoursData, form]);

  const saveMutation = useMutation({
    mutationFn: async (values: HoursFormValues) => {
      await apiRequest("PUT", "/api/business-hours", { venueId, hours: values.hours });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/business-hours?venueId=${venueId}`] });
      toast({ title: "Business hours saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to manage business hours.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Business Hours</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Business Hours</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 flex-wrap" data-testid={`hours-row-${DAYS[index]}`}>
                  <div className="w-28 font-medium">{DAYS[index]}</div>
                  <FormField control={form.control} name={`hours.${index}.closed`} render={({ field: f }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="text-sm text-muted-foreground">Closed</FormLabel>
                      <FormControl>
                        <Switch checked={f.value} onCheckedChange={f.onChange} data-testid={`switch-closed-${DAYS[index]}`} />
                      </FormControl>
                    </FormItem>
                  )} />
                  {!form.watch(`hours.${index}.closed`) && (
                    <>
                      <FormField control={form.control} name={`hours.${index}.openTime`} render={({ field: f }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormLabel className="text-sm text-muted-foreground">Open</FormLabel>
                          <FormControl><Input type="time" className="w-32" data-testid={`input-open-${DAYS[index]}`} {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`hours.${index}.closeTime`} render={({ field: f }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormLabel className="text-sm text-muted-foreground">Close</FormLabel>
                          <FormControl><Input type="time" className="w-32" data-testid={`input-close-${DAYS[index]}`} {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </>
                  )}
                </div>
              ))}
              <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save-hours">
                <Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Hours"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
