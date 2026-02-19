import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronRight, Loader2, MapPin, Search, ChevronLeft, ChevronsLeft, ChevronsRight, Briefcase, User, Store, Globe } from "lucide-react";
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

const WORKSPACES_PER_PAGE = 6;

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "agency", label: "Agency" },
  { value: "solo-founder", label: "Solo Founder" },
  { value: "local-business", label: "Local Business" },
  { value: "enterprise", label: "Enterprise" },
  { value: "white-label", label: "White Label" },
] as const;

export default function SelectWorkspace() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: workspaces = [], isLoading } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces"],
  });

  useEffect(() => {
    document.title = "My Workspaces - indexFlow";
  }, []);

  const filteredWorkspaces = useMemo(() => {
    let result = workspaces;
    if (typeFilter !== "all") {
      result = result.filter(v => v.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.address?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.type?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [workspaces, searchQuery, typeFilter]);

  const availableTypes = useMemo(() => {
    const types = new Set(workspaces.map(w => w.type));
    return TYPE_FILTERS.filter(f => f.value === "all" || types.has(f.value));
  }, [workspaces]);

  const totalPages = Math.ceil(filteredWorkspaces.length / WORKSPACES_PER_PAGE);
  const paginatedWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * WORKSPACES_PER_PAGE,
    currentPage * WORKSPACES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

  const handleSelectWorkspace = (workspaceId: string) => {
    localStorage.setItem("indexflow_workspace_id", workspaceId);
    setLocation(`/${workspaceId}/today`);
  };

  const typeConfig: Record<string, { label: string; icon: typeof Building2; bg: string; text: string; badge: string }> = {
    agency: {
      label: "Agency",
      icon: Briefcase,
      bg: "bg-blue-500/10 dark:bg-blue-400/15",
      text: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    "solo-founder": {
      label: "Solo Founder",
      icon: User,
      bg: "bg-violet-500/10 dark:bg-violet-400/15",
      text: "text-violet-600 dark:text-violet-400",
      badge: "bg-violet-500/10 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    },
    "local-business": {
      label: "Local Business",
      icon: Store,
      bg: "bg-emerald-500/10 dark:bg-emerald-400/15",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    enterprise: {
      label: "Enterprise",
      icon: Globe,
      bg: "bg-amber-500/10 dark:bg-amber-400/15",
      text: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    "white-label": {
      label: "White Label",
      icon: Building2,
      bg: "bg-rose-500/10 dark:bg-rose-400/15",
      text: "text-rose-600 dark:text-rose-400",
      badge: "bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    },
  };

  const getTypeConfig = (type: string) => typeConfig[type] || {
    label: type,
    icon: Building2,
    bg: "bg-muted",
    text: "text-muted-foreground",
    badge: "",
  };

  const getWorkspaceTypeLabel = (type: string) => getTypeConfig(type).label;

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
          <div className="mb-4 space-y-3">
            <div className="flex items-center gap-3">
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
            {availableTypes.length > 2 && (
              <div className="flex items-center gap-1.5 flex-wrap" data-testid="filter-workspace-types">
                {availableTypes.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={typeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter(filter.value)}
                    data-testid={`button-filter-${filter.value}`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12" data-testid="loading-workspaces">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Loading workspaces...</p>
            </div>
          ) : paginatedWorkspaces.length === 0 && (searchQuery || typeFilter !== "all") ? (
            <div className="text-center py-12" data-testid="no-search-results">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchQuery && typeFilter !== "all"
                  ? `No ${getWorkspaceTypeLabel(typeFilter)} workspaces match "${searchQuery}"`
                  : searchQuery
                    ? `No workspaces match "${searchQuery}"`
                    : `No ${getWorkspaceTypeLabel(typeFilter)} workspaces found`}
              </p>
            </div>
          ) : paginatedWorkspaces.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-workspaces">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No workspaces found</p>
              <p className="text-muted-foreground text-sm mt-1">Contact us to add your first workspace.</p>
            </div>
          ) : (
            paginatedWorkspaces.map((workspace) => {
              const config = getTypeConfig(workspace.type);
              const TypeIcon = config.icon;
              return (
                <Card
                  key={workspace.id}
                  className="cursor-pointer hover-elevate transition-all group"
                  onClick={() => handleSelectWorkspace(workspace.id)}
                  data-testid={`card-workspace-${workspace.id}`}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                        <TypeIcon className={`w-5 h-5 ${config.text}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate group-hover:text-foreground transition-colors">{workspace.name}</span>
                          <Badge variant="outline" className={`text-xs shrink-0 ${config.badge}`}>{config.label}</Badge>
                        </div>
                        {(workspace.address || workspace.city) && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {[workspace.address, workspace.city, workspace.state].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6" data-testid="pagination-workspaces">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              data-testid="button-first-page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                data-testid={`button-page-${page}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              data-testid="button-last-page"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        {totalPages > 1 && (
          <p className="text-center text-xs text-muted-foreground mt-2" data-testid="text-page-info">
            Showing {(currentPage - 1) * WORKSPACES_PER_PAGE + 1}–{Math.min(currentPage * WORKSPACES_PER_PAGE, filteredWorkspaces.length)} of {filteredWorkspaces.length} workspaces
          </p>
        )}

      </div>
    </div>
  );
}
