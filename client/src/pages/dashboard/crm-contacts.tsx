import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Mail, Phone, Building } from "lucide-react";

const mockContacts = [
  { id: 1, name: "John Smith", email: "john@acmecorp.com", phone: "+1 (555) 111-2222", company: "Acme Corp", tag: "customer" },
  { id: 2, name: "Sarah Johnson", email: "sarah@techinc.com", phone: "+1 (555) 222-3333", company: "Tech Inc", tag: "lead" },
  { id: 3, name: "Mike Davis", email: "mike@globalltd.com", phone: "+1 (555) 333-4444", company: "Global Ltd", tag: "prospect" },
  { id: 4, name: "Emily Chen", email: "emily@startup.co", phone: "+1 (555) 444-5555", company: "StartUp Co", tag: "customer" },
  { id: 5, name: "Robert Wilson", email: "robert@enterprise.io", phone: "+1 (555) 555-6666", company: "Enterprise", tag: "lead" },
  { id: 6, name: "Lisa Brown", email: "lisa@retailplus.com", phone: "+1 (555) 666-7777", company: "Retail Plus", tag: "customer" },
];

export default function CrmContacts() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Contacts</h1>
            <p className="text-muted-foreground">Manage your CRM contacts and leads</p>
          </div>
          <Button data-testid="button-add-contact">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-contacts">6</p>
                  <p className="text-xs text-muted-foreground">Total Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-customers">3</p>
                  <p className="text-xs text-muted-foreground">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-leads">2</p>
                  <p className="text-xs text-muted-foreground">Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-companies">6</p>
                  <p className="text-xs text-muted-foreground">Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Contacts</CardTitle>
            <CardDescription>View and manage your contact database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-contact-${contact.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>
                      <span className="flex items-center gap-1"><Building className="w-3 h-3" />{contact.company}</span>
                    </div>
                  </div>
                  <Badge variant={contact.tag === "customer" ? "default" : "secondary"} className="text-xs">
                    {contact.tag}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
