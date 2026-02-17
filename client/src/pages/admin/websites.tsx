import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, Pencil, Trash2 } from "lucide-react";
import type { Domain, Venue } from "@shared/schema";

const domainFormSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  venueId: z.string().min(1, "Venue is required"),
  isPrimary: z.boolean().optional(),
  blogTemplate: z.string().optional(),
});

type DomainFormValues = z.infer<typeof domainFormSchema>;

export default function AdminWebsites() {
  useVenue();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

  const { data: domains = [], isLoading: domainsLoading } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const createForm = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: { domain: "", venueId: "", isPrimary: false, blogTemplate: "editorial" },
  });

  const editForm = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: { domain: "", venueId: "", isPrimary: false, blogTemplate: "editorial" },
  });

  const createMutation = useMutation({
    mutationFn: async (data: DomainFormValues) => {
      const res = await apiRequest("POST", "/api/domains", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      setCreateOpen(false);
      createForm.reset();
      toast({ title: "Domain added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DomainFormValues> }) => {
      const res = await apiRequest("PATCH", `/api/domains/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      setEditingDomain(null);
      toast({ title: "Domain updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/domains/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({ title: "Domain deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const openEdit = (d: Domain) => {
    setEditingDomain(d);
    editForm.reset({
      domain: d.domain,
      venueId: d.venueId,
      isPrimary: d.isPrimary,
      blogTemplate: d.blogTemplate || "editorial",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6" />
          <h1 className="text-2xl font-semibold" data-testid="page-title-websites">Websites / Domains</h1>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-domain">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Domain</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField control={createForm.control} name="domain" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl><Input {...field} placeholder="example.com" data-testid="input-domain" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={createForm.control} name="venueId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger data-testid="select-domain-venue"><SelectValue placeholder="Select venue" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {venues.map((v) => (
                          <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={createForm.control} name="blogTemplate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Template</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger data-testid="select-domain-template"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="editorial">Editorial</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="magazine">Magazine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-domain">
                  {createMutation.isPending ? "Adding..." : "Add Domain"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingDomain} onOpenChange={(open) => { if (!open) setEditingDomain(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Domain</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => editingDomain && editMutation.mutate({ id: editingDomain.id, data }))} className="space-y-4">
              <FormField control={editForm.control} name="domain" render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl><Input {...field} data-testid="input-edit-domain" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="blogTemplate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Template</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger data-testid="select-edit-domain-template"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="editorial">Editorial</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="magazine">Magazine</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={editMutation.isPending} data-testid="button-submit-edit-domain">
                {editMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Domains</CardTitle>
        </CardHeader>
        <CardContent>
          {domainsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : domains.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-websites">
              No domains found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((d) => (
                  <TableRow key={d.id} data-testid={`row-domain-${d.id}`}>
                    <TableCell className="font-medium">{d.domain}</TableCell>
                    <TableCell className="text-muted-foreground">{venueMap.get(d.venueId)?.name || d.venueId}</TableCell>
                    <TableCell>
                      <Badge variant={d.isPrimary ? "default" : "outline"}>
                        {d.isPrimary ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.blogTemplate}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(d)} data-testid={`button-edit-domain-${d.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(d.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-domain-${d.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
