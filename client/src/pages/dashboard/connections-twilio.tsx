import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Key, DollarSign, Shield } from "lucide-react";

export default function ConnectionsTwilio() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Twilio Account</h1>
          <p className="text-muted-foreground">Connect and manage your Twilio account integration</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Badge data-testid="text-twilio-status">Connected</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Account Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-account-sid">AC***...x7f3</p>
                  <p className="text-xs text-muted-foreground">Account SID</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold" data-testid="text-phone-numbers">2</p>
                  <p className="text-xs text-muted-foreground">Phone Numbers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-balance">$48.52</p>
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your Twilio account configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Account SID", value: "AC***...x7f3" },
                  { label: "Auth Token", value: "********...4a2b" },
                  { label: "Account Type", value: "Standard" },
                  { label: "Region", value: "US East" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium" data-testid={`text-detail-${i}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4" data-testid="button-update-credentials">
                Update Credentials
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Phone Numbers</CardTitle>
              <CardDescription>Twilio phone numbers linked to this workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { number: "+1 (555) 987-6543", label: "Main Line", capabilities: ["Voice", "SMS"] },
                  { number: "+1 (555) 987-6544", label: "Support Line", capabilities: ["Voice"] },
                ].map((phone, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-phone-${i}`}>
                    <div>
                      <p className="font-medium text-sm">{phone.number}</p>
                      <p className="text-xs text-muted-foreground">{phone.label}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {phone.capabilities.map((cap) => (
                        <Badge key={cap} variant="secondary" className="text-xs">{cap}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
