import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { CalendarX, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Closure {
  id: number;
  workspaceId: string;
  date: string;
  reason: string | null;
  createdAt: string;
}

export default function SettingsClosures() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Closures - indexFlow Dashboard";
  }, []);

  const { data: closures = [], isLoading } = useQuery<Closure[]>({
    queryKey: ["/api/workspaces", workspaceId, "closures"],
  });

  const addMutation = useMutation({
    mutationFn: (data: { date: string; reason: string }) =>
      apiRequest("POST", `/api/workspaces/${workspaceId}/closures`, { ...data, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "closures"] });
      setNewDate("");
      setNewReason("");
      toast({
        title: "Closure added",
        description: "Your workspace will be marked as unavailable on the selected date.",
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add closure.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/closures/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "closures"] });
      toast({ title: "Closure removed" });
    },
  });

  const handleAddClosure = () => {
    if (!newDate) return;
    addMutation.mutate({ date: newDate, reason: newReason || "Closed" });
  };

  const handleRemoveClosure = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Closures</h1>
          <p className="text-muted-foreground">Mark dates when your workspace is unavailable</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Closure
            </CardTitle>
            <CardDescription>
              The system will block scheduling on these dates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-48"
                  data-testid="input-closure-date"
                />
              </div>
              <div className="space-y-2 flex-1 min-w-48">
                <Label>Reason (optional)</Label>
                <Input
                  placeholder="e.g., Holiday, Private Event"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  data-testid="input-closure-reason"
                />
              </div>
              <Button onClick={handleAddClosure} className="gap-2" disabled={addMutation.isPending} data-testid="button-add-closure">
                <Plus className="w-4 h-4" />
                Add Closure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarX className="w-5 h-5" />
              Scheduled Closures
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : closures.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No closures scheduled. Add a closure above.
              </p>
            ) : (
              <div className="space-y-3">
                {closures.map((closure) => (
                  <div 
                    key={closure.id} 
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3"
                    data-testid={`closure-${closure.id}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="text-center min-w-[60px] sm:min-w-20 flex-shrink-0">
                        <p className="font-bold text-sm sm:text-base">
                          {new Date(closure.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(closure.date).getFullYear()}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{closure.reason}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive flex-shrink-0"
                      onClick={() => handleRemoveClosure(closure.id)}
                      data-testid={`button-remove-${closure.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
