import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Phone, Plus, LifeBuoy, MessageSquare, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const infoCards = [
  { label: "Response Time", value: "2-3 Hours", icon: Clock },
  { label: "Email Support", value: "support@indexflow.cloud", icon: Mail },
  { label: "Phone Support", value: "Premium Plans Only", icon: Phone },
];

interface Ticket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  created: string;
}

export default function SupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateTicket = () => {
    if (!newSubject.trim()) return;
    const ticket: Ticket = {
      id: `TKT-${1000 + tickets.length + 1}`,
      subject: newSubject.trim(),
      priority: newPriority,
      status: "Open",
      created: new Date().toISOString().split("T")[0],
    };
    setTickets([ticket, ...tickets]);
    toast({ title: "Ticket created", description: `${ticket.id}: ${ticket.subject}` });
    setNewSubject("");
    setNewPriority("Medium");
    setNewDescription("");
    setNewTicketOpen(false);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Support Center</h1>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Get help with your questions and issues</p>
          </div>
          <Button onClick={() => setNewTicketOpen(true)} data-testid="button-new-ticket">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {infoCards.map((card) => (
            <Card key={card.label} data-testid={`card-info-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-sm font-semibold mt-1" data-testid={`text-info-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>{card.value}</p>
                  </div>
                  <card.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="my-tickets" data-testid="tabs-support">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="my-tickets" data-testid="tab-my-tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="quick-help" data-testid="tab-quick-help">Quick Help</TabsTrigger>
          </TabsList>

          <TabsContent value="my-tickets" className="mt-4">
            {tickets.length === 0 ? (
              <Card data-testid="card-empty-tickets">
                <CardContent className="p-8 text-center space-y-4">
                  <LifeBuoy className="w-12 h-12 mx-auto text-muted-foreground" />
                  <h3 className="font-semibold text-lg" data-testid="text-no-tickets">No Support Tickets</h3>
                  <p className="text-sm text-muted-foreground">You haven't created any support tickets yet.</p>
                  <Button onClick={() => setNewTicketOpen(true)} data-testid="button-create-first-ticket">
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <Card key={t.id} data-testid={`card-ticket-${t.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                          <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate" data-testid={`text-ticket-subject-${t.id}`}>{t.subject}</p>
                            <p className="text-xs text-muted-foreground">{t.id} - {t.created}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={t.priority === "High" ? "destructive" : "secondary"} data-testid={`badge-priority-${t.id}`}>{t.priority}</Badge>
                          <Badge variant="default" data-testid={`badge-status-${t.id}`}>{t.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quick-help" className="mt-4">
            <Card data-testid="card-quick-help">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold">Frequently Asked Questions</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { q: "How do I add keywords to the rank tracker?", a: "Go to Rank Tracker and use the Add Keywords section." },
                    { q: "How do I connect my payment provider?", a: "Navigate to Connections > Payments and enter your API credentials." },
                    { q: "Where can I find the widget embed code?", a: "Go to Widget Code from the sidebar to copy your embed snippet." },
                    { q: "How do I train the AI widget?", a: "Visit Knowledge Base to add training content and documents." },
                  ].map((faq, idx) => (
                    <div key={idx} className="space-y-1" data-testid={`faq-item-${idx}`}>
                      <p className="text-sm font-medium">{faq.q}</p>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Brief description of your issue"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  data-testid="input-ticket-subject"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger data-testid="select-ticket-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="input-ticket-description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTicketOpen(false)} data-testid="button-cancel-ticket">Cancel</Button>
              <Button onClick={handleCreateTicket} data-testid="button-submit-ticket">Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
