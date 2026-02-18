import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronRight, Loader2, Plus, MapPin, Search, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import indexFlowLogo from "@assets/image_1771351451425.png";

interface Workspace {
  id: string;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  state: string | null;
  status: string;
}

const WORKSPACES_PER_PAGE = 10;

export default function SelectWorkspace() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: workspaces = [], isLoading } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces"],
  });

  useEffect(() => {
    document.title = "My Workspaces - indexFlow";
  }, []);

  const filteredWorkspaces = useMemo(() => {
    if (!searchQuery.trim()) return workspaces;
    const q = searchQuery.toLowerCase();
    return workspaces.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.address?.toLowerCase().includes(q) ||
      v.city?.toLowerCase().includes(q) ||
      v.type?.toLowerCase().includes(q)
    );
  }, [workspaces, searchQuery]);

  const totalPages = Math.ceil(filteredWorkspaces.length / WORKSPACES_PER_PAGE);
  const paginatedWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * WORKSPACES_PER_PAGE,
    currentPage * WORKSPACES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSelectWorkspace = (workspaceId: string) => {
    localStorage.setItem("indexflow_workspace_id", workspaceId);
    setLocation(`/${workspaceId}/today`);
  };

  const getWorkspaceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      agency: "Agency",
      client: "Client",
      project: "Project",
      enterprise: "Enterprise",
      other: "Workspace",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <img src={indexFlowLogo} alt="indexFlow Workspace Management Dashboard" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold" data-testid="text-workspaces-title">My Workspaces</h1>
          <p className="text-muted-foreground">
            {workspaces.length === 0
              ? "You don't have any workspaces yet"
              : `Managing ${workspaces.length} workspace${workspaces.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>

        {workspaces.length > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-workspaces"
              />
            </div>
            <Badge variant="secondary" data-testid="badge-workspace-count">
              {filteredWorkspaces.length} of {workspaces.length}
            </Badge>
          </div>
        )}
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12" data-testid="loading-workspaces">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Loading workspaces...</p>
            </div>
          ) : paginatedWorkspaces.length === 0 && searchQuery ? (
            <div className="text-center py-12" data-testid="no-search-results">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No workspaces match "{searchQuery}"</p>
            </div>
          ) : paginatedWorkspaces.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-workspaces">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No workspaces found</p>
              <p className="text-muted-foreground text-sm mt-1">Contact us to add your first workspace.</p>
            </div>
          ) : (
            paginatedWorkspaces.map((workspace) => (
              <Card 
                key={workspace.id} 
                className="cursor-pointer hover-elevate transition-all"
                onClick={() => handleSelectWorkspace(workspace.id)}
                data-testid={`card-workspace-${workspace.id}`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{workspace.name}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">{getWorkspaceTypeLabel(workspace.type)}</Badge>
                      </div>
                      {(workspace.address || workspace.city) && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {[workspace.address, workspace.city, workspace.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-1" data-testid="pagination-workspaces">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground" data-testid="text-page-info">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              data-testid="button-next-page"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {workspaces.length > 0 && (
          <div className="mt-8 p-4 rounded-md border border-dashed text-center" data-testid="card-add-workspace">
            <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">Need another workspace?</p>
            <p className="text-xs text-muted-foreground mb-3">
              Add unlimited workspaces for just $25/month each
            </p>
            <a href="/contact">
              <Button variant="outline" size="sm" data-testid="button-add-workspace">
                <Plus className="w-4 h-4 mr-1" />
                Add Workspace
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
