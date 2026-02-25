import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrmContact } from "@shared/schema";

export default function CrmContacts() {
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSource, setFormSource] = useState("Website");

  const queryKey = selectedWorkspace
    ? ["/api/crm/contacts", `?workspaceId=${selectedWorkspace.id}`]
    : ["/api/crm/contacts"];

  const { data: contacts = [], isLoading } = useQuery<CrmContact[]>({
    queryKey,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/crm/contacts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts"] });
      setAddOpen(false);
      toast({ title: "Contact Added", description: `${formName} has been added to your contacts.` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
      const res = await apiRequest("PATCH", `/api/crm/contacts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts"] });
      setEditOpen(false);
      toast({ title: "Contact Updated", description: `${formName} has been updated.` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/crm/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts"] });
      setDeleteOpen(false);
      toast({ title: "Contact Deleted", description: `${selectedContact?.name} has been removed.` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags || [])));
  const allSources = Array.from(new Set(contacts.map((c) => c.source).filter(Boolean)));

  const filtered = contacts.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !(c.email || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (tagFilter !== "all" && !(c.tags || []).includes(tagFilter)) return false;
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
    return true;
  });

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormCompany("");
    setFormPhone("");
    setFormSource("Website");
  };

  const handleAddOpen = () => {
    resetForm();
    setAddOpen(true);
  };

  const handleAddContact = () => {
    createMutation.mutate({
      name: formName,
      email: formEmail || null,
      company: formCompany || null,
      phone: formPhone || null,
      source: formSource,
      tags: ["Prospect"],
      workspaceId: selectedWorkspace?.id || null,
    });
  };

  const handleViewOpen = (contact: CrmContact) => {
    setSelectedContact(contact);
    setViewOpen(true);
  };

  const handleEditOpen = (contact: CrmContact) => {
    setSelectedContact(contact);
    setFormName(contact.name);
    setFormEmail(contact.email || "");
    setFormCompany(contact.company || "");
    setFormPhone(contact.phone || "");
    setFormSource(contact.source || "Website");
    setEditOpen(true);
  };

  const handleEditContact = () => {
    if (!selectedContact) return;
    updateMutation.mutate({
      id: selectedContact.id,
      data: {
        name: formName,
        email: formEmail || null,
        company: formCompany || null,
        phone: formPhone || null,
        source: formSource,
      },
    });
  };

  const handleDeleteOpen = (contact: CrmContact) => {
    setSelectedContact(contact);
    setDeleteOpen(true);
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;
    deleteMutation.mutate(selectedContact.id);
  };

  const contactForm = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Full name" data-testid="input-contact-name" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="Email address" data-testid="input-contact-email" />
      </div>
      <div className="space-y-2">
        <Label>Company</Label>
        <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Company name" data-testid="input-contact-company" />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Phone number" data-testid="input-contact-phone" />
      </div>
      <div className="space-y-2">
        <Label>Source</Label>
        <Select value={formSource} onValueChange={setFormSource}>
          <SelectTrigger data-testid="select-contact-source">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
            <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Skeleton className="h-9 flex-1 min-w-[200px]" />
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-9 w-[160px]" />
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Contacts</h1>
          <Badge variant="secondary" data-testid="badge-contact-count">{contacts.length} contacts</Badge>
        </div>
        <Button data-testid="button-add-contact" onClick={handleAddOpen}>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-contacts"
          />
        </div>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-tag-filter">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-source-filter">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {allSources.map((source) => (
              <SelectItem key={source} value={source!}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((contact) => (
                  <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                    <TableCell className="font-medium" data-testid={`text-contact-name-${contact.id}`}>
                      {contact.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-contact-email-${contact.id}`}>
                      {contact.email || "-"}
                    </TableCell>
                    <TableCell data-testid={`text-contact-company-${contact.id}`}>{contact.company || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm" data-testid={`text-contact-phone-${contact.id}`}>
                      {contact.phone || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        {(contact.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" data-testid={`badge-tag-${contact.id}-${tag.replace(/\s+/g, "-").toLowerCase()}`}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm" data-testid={`text-contact-source-${contact.id}`}>
                      {contact.source || "-"}
                    </TableCell>
                    <TableCell data-testid={`text-contact-status-${contact.id}`}>
                      <Badge variant={contact.status === "active" ? "secondary" : "outline"}>
                        {contact.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-contact-actions-${contact.id}`}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem data-testid={`action-view-${contact.id}`} onClick={() => handleViewOpen(contact)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-edit-${contact.id}`} onClick={() => handleEditOpen(contact)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" data-testid={`action-delete-${contact.id}`} onClick={() => handleDeleteOpen(contact)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          {contactForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-contact">Cancel</Button>
            <Button onClick={handleAddContact} disabled={createMutation.isPending} data-testid="button-confirm-add-contact">
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {contactForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-contact">Cancel</Button>
            <Button onClick={handleEditContact} disabled={updateMutation.isPending} data-testid="button-confirm-edit-contact">
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <span className="font-medium">{selectedContact?.name}</span>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-contact">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteContact} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-contact">
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedContact.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{selectedContact.company || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedContact.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{selectedContact.source || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">{selectedContact.status || "active"}</p>
                </div>
              </div>
              {selectedContact.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedContact.notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {(selectedContact.tags || []).length > 0 ? (
                    (selectedContact.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
