import { useState, useMemo } from "react";
import { FileEdit, Clock, CheckCircle2, AlertCircle, Search, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin-layout";

const changeRequests = [
  { id: 1, client: "Acme Digital", type: "Text Update", description: "Update service pricing on the main page", status: "pending", priority: "high", submitted: "Feb 10, 2026" },
  { id: 2, client: "Summit Marketing", type: "Image Change", description: "Replace hero banner with new campaign photos", status: "in_progress", priority: "medium", submitted: "Feb 9, 2026" },
  { id: 3, client: "Dragon Media", type: "Pricing Update", description: "Add new package prices to the services section", status: "pending", priority: "medium", submitted: "Feb 8, 2026" },
  { id: 4, client: "Coastal SEO", type: "Domain Change", description: "Switch from coastalseo.net to coastalseo.com", status: "pending", priority: "high", submitted: "Feb 7, 2026" },
  { id: 5, client: "Sakura Digital", type: "Text Update", description: "Update business hours and add holiday schedule", status: "completed", priority: "low", submitted: "Feb 5, 2026" },
  { id: 6, client: "Acme Digital", type: "Image Change", description: "Add new photos of the team workspace", status: "in_progress", priority: "low", submitted: "Feb 4, 2026" },
  { id: 7, client: "Acme Agency", type: "Text Update", description: "Rewrite the About Us section with new team info", status: "completed", priority: "medium", submitted: "Feb 3, 2026" },
  { id: 8, client: "Summit Marketing", type: "Pricing Update", description: "Update retainer rates for spring quarter", status: "in_progress", priority: "high", submitted: "Feb 2, 2026" },
  { id: 9, client: "Dragon Media", type: "Image Change", description: "Replace portfolio images with professional shots", status: "pending", priority: "low", submitted: "Feb 1, 2026" },
  { id: 10, client: "Coastal SEO", type: "Text Update", description: "Add new case study details", status: "completed", priority: "medium", submitted: "Jan 30, 2026" },
  { id: 11, client: "Sakura Digital", type: "Pricing Update", description: "Seasonal campaign pricing adjustments", status: "completed", priority: "high", submitted: "Jan 28, 2026" },
  { id: 12, client: "Rustic Creative", type: "Image Change", description: "New team photo for Meet the Team page", status: "pending", priority: "medium", submitted: "Jan 27, 2026" },
  { id: 13, client: "Metro Creative", type: "Text Update", description: "Update service descriptions for new offerings", status: "in_progress", priority: "medium", submitted: "Jan 26, 2026" },
  { id: 14, client: "Pinnacle Digital", type: "Domain Change", description: "Add SSL certificate for new custom domain", status: "completed", priority: "high", submitted: "Jan 25, 2026" },
  { id: 15, client: "Summit Marketing", type: "Text Update", description: "Update services page with new capabilities", status: "completed", priority: "low", submitted: "Jan 24, 2026" },
  { id: 16, client: "Acme Digital", type: "Pricing Update", description: "Update enterprise pricing for corporate clients", status: "pending", priority: "medium", submitted: "Jan 23, 2026" },
  { id: 17, client: "Dragon Media", type: "Text Update", description: "Add compliance information to all service pages", status: "in_progress", priority: "high", submitted: "Jan 22, 2026" },
  { id: 18, client: "Coastal SEO", type: "Image Change", description: "Update results gallery with new client screenshots", status: "completed", priority: "low", submitted: "Jan 21, 2026" },
  { id: 19, client: "Sakura Digital", type: "Domain Change", description: "Redirect old .net domain to new .com", status: "completed", priority: "medium", submitted: "Jan 20, 2026" },
  { id: 20, client: "Metro Creative", type: "Image Change", description: "Replace portfolio images with new project screenshots", status: "pending", priority: "low", submitted: "Jan 19, 2026" },
  { id: 21, client: "Pinnacle Digital", type: "Pricing Update", description: "Update starter package pricing", status: "pending", priority: "medium", submitted: "Jan 18, 2026" },
  { id: 22, client: "Acme Agency", type: "Domain Change", description: "Set up blog subdomain for content hub", status: "completed", priority: "high", submitted: "Jan 17, 2026" },
  { id: 23, client: "Acme Digital", type: "Text Update", description: "Add testimonials to the services page", status: "completed", priority: "low", submitted: "Jan 16, 2026" },
  { id: 24, client: "Summit Marketing", type: "Image Change", description: "Add virtual office tour 360 images", status: "in_progress", priority: "high", submitted: "Jan 15, 2026" },
  { id: 25, client: "Dragon Media", type: "Text Update", description: "Rewrite service area description and coverage zones", status: "completed", priority: "medium", submitted: "Jan 14, 2026" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const priorityStyles: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

const typeStyles: Record<string, string> = {
  "Text Update": "text-blue-600 dark:text-blue-400 border-blue-500/30",
  "Image Change": "text-purple-600 dark:text-purple-400 border-purple-500/30",
  "Pricing Update": "text-green-600 dark:text-green-400 border-green-500/30",
  "Domain Change": "text-orange-600 dark:text-orange-400 border-orange-500/30",
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 25];

const statusTabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function AdminWebsiteChanges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = useMemo(() => {
    return changeRequests.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        r.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const stats = useMemo(() => {
    const total = changeRequests.length;
    const pending = changeRequests.filter((r) => r.status === "pending").length;
    const inProgress = changeRequests.filter((r) => r.status === "in_progress").length;
    const completed = changeRequests.filter((r) => r.status === "completed").length;
    return [
      { label: "Total Requests", value: String(total), change: "All time", icon: FileEdit },
      { label: "Pending Review", value: String(pending), change: "Needs attention", icon: AlertCircle },
      { label: "In Progress", value: String(inProgress), change: "Being implemented", icon: Clock },
      { label: "Completed", value: String(completed), change: "This quarter", icon: CheckCircle2 },
    ];
  }, []);

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-admin-website-changes-title">Website Changes</h1>
        <p className="text-muted-foreground">Manage website change requests from all clients</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Change Requests</CardTitle>
              <CardDescription>All website modification requests from clients</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                data-testid="input-search-changes"
              />
            </div>
          </div>
          <div className="flex gap-1 pt-2 flex-wrap">
            {statusTabs.map((tab) => (
              <Button
                key={tab.value}
                variant={statusFilter === tab.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleStatusFilter(tab.value)}
                data-testid={`button-filter-${tab.value}`}
              >
                {tab.label}
                {tab.value !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    {changeRequests.filter((r) => r.status === tab.value).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Description</th>
                  <th className="pb-3 font-medium text-muted-foreground">Priority</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Submitted</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                      No change requests match your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((request) => (
                    <tr key={request.id} className="border-b last:border-0" data-testid={`row-change-${request.id}`}>
                      <td className="py-3 font-medium text-sm">{request.client}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={`text-xs ${typeStyles[request.type] || ""}`}>
                          {request.type}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground max-w-[250px] truncate">{request.description}</td>
                      <td className="py-3">
                        <Badge className={`text-xs ${priorityStyles[request.priority]}`}>
                          {request.priority}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge className={`text-xs ${statusStyles[request.status]}`}>
                          {request.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{request.submitted}</td>
                      <td className="py-3">
                        <Button variant="ghost" size="icon" data-testid={`button-view-change-${request.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filtered.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, filtered.length)} of {filtered.length} results</span>
              <span className="mx-1">|</span>
              <span>Rows per page</span>
              <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[70px]" data-testid="select-page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground mr-2">
                Page {safePage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={safePage <= 1}
                data-testid="button-first-page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage >= totalPages}
                data-testid="button-last-page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
