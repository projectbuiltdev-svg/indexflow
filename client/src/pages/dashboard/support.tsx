import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupportTicket } from "@shared/schema";
import { 
  Headset, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Plus,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiRequest } from "@/lib/queryClient";

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details (at least 20 characters)"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["technical", "billing", "feature", "general"])
});

type TicketFormData = z.infer<typeof ticketSchema>;

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
};

const statusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
};

export default function Support() {
  const [, params] = useRoute("/:workspaceId/support");
  const workspaceId = params?.workspaceId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/workspaces", workspaceId, "support-tickets"],
    enabled: !!workspaceId
  });

  useEffect(() => {
    document.title = "Support - indexFlow Dashboard";
  }, []);

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
      category: "general"
    }
  });

  const submitTicket = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const response = await apiRequest("POST", `/api/workspaces/${workspaceId}/support-tickets`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket Submitted",
        description: "We'll respond within 2-3 hours or next business day."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "support-tickets"] });
      form.reset();
      setShowNewTicket(false);
    },
    onError: () => {
      toast({
        title: "Failed to Submit Ticket",
        description: "Please try again or email support@indexflow.io directly.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: TicketFormData) => {
    submitTicket.mutate(data);
  };

  const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Headset className="w-6 h-6" />
              Support Center
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">Get help with your questions and issues</p>
          </div>
          <Button 
            onClick={() => setShowNewTicket(true)}
            className="w-full sm:w-auto"
            data-testid="button-new-ticket"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="font-semibold">2-3 Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Support</p>
                  <p className="font-semibold">support@indexflow.io</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Support</p>
                  <p className="font-semibold">Premium Plans Only</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets" data-testid="tab-tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="faq" data-testid="tab-faq">Quick Help</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {showNewTicket && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Create Support Ticket</CardTitle>
                  <CardDescription>Describe your issue and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brief summary of your issue" 
                                {...field} 
                                data-testid="input-ticket-subject"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-ticket-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="technical">Technical Issue</SelectItem>
                                  <SelectItem value="billing">Billing Question</SelectItem>
                                  <SelectItem value="feature">Feature Request</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-ticket-priority">
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your issue in detail. Include any relevant information like error messages, steps to reproduce, or screenshots."
                                className="min-h-[120px]"
                                {...field}
                                data-testid="textarea-ticket-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowNewTicket(false)}
                          data-testid="button-cancel-ticket"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={submitTicket.isPending}
                          data-testid="button-submit-ticket"
                        >
                          {submitTicket.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Ticket
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {tickets.length === 0 && !showNewTicket ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any support tickets yet.
                  </p>
                  <Button onClick={() => setShowNewTicket(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className="cursor-pointer hover-elevate"
                    onClick={() => setSelectedTicket(ticket)}
                    data-testid={`ticket-${ticket.id}`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{ticket.subject}</p>
                            <Badge className={priorityColors[ticket.priority]} variant="secondary">
                              {ticket.priority}
                            </Badge>
                            <Badge className={statusColors[ticket.status]} variant="secondary">
                              {ticket.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {ticket.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {formatDate(ticket.createdAt)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">How do I install the AI widget?</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings &gt; Widget Code and copy the embed code for your website.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">How do I train the AI assistant?</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings &gt; AI Training to add your business info, knowledge base, and FAQs.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">How do I set up payments?</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings &gt; Stripe/PayPal to connect your payment processor.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">How do I add team members?</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings &gt; Team to invite staff with different access levels.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Need more help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Check our full documentation for detailed guides on all features.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href={`/${workspaceId}/support/documentation`}>
                      View Documentation
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
