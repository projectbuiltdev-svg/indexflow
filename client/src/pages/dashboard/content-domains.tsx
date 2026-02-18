import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CheckCircle, Pencil, Trash2, Search } from "lucide-react";

const initialDomains = [
  { id: 1, domain: "example.com", status: "Verified", postsPublished: 42, added: "2025-09-10" },
  { id: 2, domain: "blog.example.com", status: "Pending", postsPublished: 0, added: "2026-02-05" },
  { id: 3, domain: "shop.example.com", status: "Failed", postsPublished: 0, added: "2026-01-20" },
];

type Domain = typeof initialDomains[number];

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "Verified") return "default";
  if (status === "Pending") return "secondary";
  return "destructive";
}

export default function ContentDomains() {
  const { toast } = useToast();
  const [domains, setDomains] = useState(initialDomains);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [addOpen, setAddOpen] = useState(false);
  const [addDomain, setAddDomain] = useState("");
  const [addNotes, setAddNotes] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editDomainItem, setEditDomainItem] = useState<Domain | null>(null);
  const [editDomainName, setEditDomainName] = useState("");

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeDomain, setRemoveDomain] = useState<Domain | null>(null);

  const filtered = domains.filter((d) => {
    if (search && !d.domain.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    return true;
  });

  const handleAddDomain = () => {
    if (!addDomain.trim()) return;
    const newId = Math.max(...domains.map((d) => d.id), 0) + 1;
    setDomains([...domains, {
      id: newId,
      domain: addDomain,
      status: "Pending",
      postsPublished: 0,
      added: new Date().toISOString().split("T")[0],
    }]);
    setAddOpen(false);
    setAddDomain("");
    setAddNotes("");
    toast({ title: "Domain added", description: `"${addDomain}" has been added and is pending verification.` });
  };

  const handleVerify = (domain: Domain) => {
    setDomains(domains.map((d) => (d.id === domain.id ? { ...d, status: "Verified" } : d)));
    toast({ title: "Verification initiated", description: `DNS verification started for "${domain.domain}".` });
  };

  const handleEditDomain = (domain: Domain) => {
    setEditDomainItem(domain);
    setEditDomainName(domain.domain);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editDomainItem || !editDomainName.trim()) return;
    setDomains(domains.map((d) => (d.id === editDomainItem.id ? { ...d, domain: editDomainName } : d)));
    setEditOpen(false);
    setEditDomainItem(null);
    toast({ title: "Domain updated", description: `Domain has been updated to "${editDomainName}".` });
  };

  const handleRemoveConfirm = () => {
    if (!removeDomain) return;
    setDomains(domains.filter((d) => d.id !== removeDomain.id));
    const domainName = removeDomain.domain;
    setRemoveOpen(false);
    setRemoveDomain(null);
    toast({ title: "Domain removed", description: `"${domainName}" has been removed.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Domains</h1>
        <Button data-testid="button-add-domain" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Domain
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-domains"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posts Published</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id} data-testid={`row-domain-${d.id}`}>
                  <TableCell className="font-medium" data-testid={`text-domain-${d.id}`}>{d.domain}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(d.status)} data-testid={`badge-domain-status-${d.id}`}>{d.status}</Badge>
                  </TableCell>
                  <TableCell data-testid={`text-posts-published-${d.id}`}>{d.postsPublished}</TableCell>
                  <TableCell className="text-muted-foreground">{d.added}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="icon" data-testid={`button-verify-domain-${d.id}`} onClick={() => handleVerify(d)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-edit-domain-${d.id}`} onClick={() => handleEditDomain(d)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-remove-domain-${d.id}`} onClick={() => { setRemoveDomain(d); setRemoveOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="dialog-add-domain">
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-domain-name">Domain Name</Label>
              <Input id="add-domain-name" placeholder="example.com" value={addDomain} onChange={(e) => setAddDomain(e.target.value)} data-testid="input-add-domain-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-domain-notes">Notes</Label>
              <Textarea id="add-domain-notes" placeholder="Optional notes..." value={addNotes} onChange={(e) => setAddNotes(e.target.value)} data-testid="input-add-domain-notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-domain">Cancel</Button>
            <Button onClick={handleAddDomain} data-testid="button-save-add-domain">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-domain">
          <DialogHeader>
            <DialogTitle>Edit Domain</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-domain-name">Domain Name</Label>
              <Input id="edit-domain-name" value={editDomainName} onChange={(e) => setEditDomainName(e.target.value)} data-testid="input-edit-domain-name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-domain">Cancel</Button>
            <Button onClick={handleEditSave} data-testid="button-save-edit-domain">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent data-testid="dialog-remove-domain">
          <DialogHeader>
            <DialogTitle>Remove Domain</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove "{removeDomain?.domain}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)} data-testid="button-cancel-remove-domain">Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveConfirm} data-testid="button-confirm-remove-domain">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
