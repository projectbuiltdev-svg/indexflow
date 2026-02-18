import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Building2, Plus, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Resource {
  id: string;
  workspaceId: string;
  name: string;
  type: string;
  capacity: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function SettingsResources() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Resources - indexFlow Dashboard";
  }, []);

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/workspaces", workspaceId, "resources"],
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; capacity: number; type: string }) =>
      apiRequest("POST", `/api/workspaces/${workspaceId}/resources`, { ...data, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "resources"] });
      setNewName("");
      setNewCapacity("");
      toast({ title: "Resource added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add resource.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/resources/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "resources"] });
      toast({ title: "Resource removed" });
    },
  });

  const totalCapacity = resources.reduce((sum, r) => sum + r.capacity, 0);

  const handleAddResource = () => {
    if (!newName || !newCapacity) return;
    addMutation.mutate({ name: newName, capacity: parseInt(newCapacity), type: "area" });
  };

  const handleRemoveResource = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Resources</h1>
            <p className="text-sm text-muted-foreground">Manage tables, rooms, and seating areas</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resources.length}</p>
                <p className="text-sm text-muted-foreground">Total Resources</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCapacity}</p>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Resource
            </CardTitle>
            <CardDescription>
              Define areas where guests can be seated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 flex-1 min-w-48">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Rooftop Terrace"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  data-testid="input-resource-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-24"
                  data-testid="input-resource-capacity"
                />
              </div>
              <Button onClick={handleAddResource} className="gap-2" disabled={addMutation.isPending} data-testid="button-add-resource">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Venue Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3"
                  data-testid={`resource-${resource.id}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{resource.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {resource.capacity}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive flex-shrink-0"
                    onClick={() => handleRemoveResource(resource.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-remove-${resource.id}`}
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
