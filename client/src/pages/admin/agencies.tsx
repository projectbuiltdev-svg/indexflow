import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Search } from "lucide-react";

const agencies = [
  { id: 1, name: "Blue Digital Agency", ownerEmail: "jessica@bluedigital.com", plan: "Enterprise", workspaces: 18, posts: 342, users: 27, status: "Active" },
  { id: 2, name: "Peak SEO Group", ownerEmail: "martin@peakseo.com", plan: "Pro", workspaces: 9, posts: 186, users: 14, status: "Active" },
  { id: 3, name: "Horizon Marketing Co", ownerEmail: "rachel@horizonmktg.com", plan: "White Label", workspaces: 24, posts: 512, users: 38, status: "Active" },
  { id: 4, name: "Spark Content Studio", ownerEmail: "alex@sparkcontent.io", plan: "Solo", workspaces: 2, posts: 45, users: 3, status: "Suspended" },
  { id: 5, name: "Evergreen Digital", ownerEmail: "nina@evergreendigital.com", plan: "Pro", workspaces: 6, posts: 98, users: 9, status: "Pending" },
];

const statusVariant = (status: string) => {
  if (status === "Active") return "default" as const;
  if (status === "Suspended") return "destructive" as const;
  return "secondary" as const;
};

export default function AdminAgencies() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = agencies.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.ownerEmail.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || a.plan === planFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage all client workspaces</p>
        </div>
        <Button data-testid="button-add-agency">
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-agencies"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-plan-filter">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="Solo">Solo</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="White Label">White Label</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Owner Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Workspaces</TableHead>
                <TableHead className="text-right">Posts</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((agency) => (
                <TableRow key={agency.id} data-testid={`row-agency-${agency.id}`}>
                  <TableCell className="font-medium">{agency.name}</TableCell>
                  <TableCell className="text-muted-foreground">{agency.ownerEmail}</TableCell>
                  <TableCell>
                    <Badge variant="outline" data-testid={`badge-plan-${agency.id}`}>{agency.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{agency.workspaces}</TableCell>
                  <TableCell className="text-right">{agency.posts}</TableCell>
                  <TableCell className="text-right">{agency.users}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(agency.status)} data-testid={`badge-status-${agency.id}`}>
                      {agency.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-agency-${agency.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`action-view-agency-${agency.id}`}>View</DropdownMenuItem>
                        <DropdownMenuItem data-testid={`action-edit-agency-${agency.id}`}>Edit</DropdownMenuItem>
                        <DropdownMenuItem data-testid={`action-suspend-agency-${agency.id}`}>Suspend</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" data-testid={`action-delete-agency-${agency.id}`}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
