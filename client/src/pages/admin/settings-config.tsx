import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function AdminSettingsConfig() {
  const [companyName, setCompanyName] = useState("IndexFlow");
  const [supportEmail, setSupportEmail] = useState("support@indexflow.cloud");
  const [supportPhone, setSupportPhone] = useState("+1 (555) 000-0000");
  const [setupFee, setSetupFee] = useState("499");
  const [monthlyFee, setMonthlyFee] = useState("299");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Settings</h1>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Platform and client configuration</p>
          </div>
          <Button data-testid="button-save-changes">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList data-testid="tabs-settings">
            <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
            <TabsTrigger value="venue" data-testid="tab-venue">Venue Settings</TabsTrigger>
            <TabsTrigger value="api-keys" data-testid="tab-api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
            <TabsTrigger value="ai-providers" data-testid="tab-ai-providers">AI Providers</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        data-testid="input-company-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        data-testid="input-support-email"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="support-phone">Support Phone</Label>
                      <Input
                        id="support-phone"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        data-testid="input-support-phone"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Default Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="setup-fee">Setup Fee ($)</Label>
                      <Input
                        id="setup-fee"
                        value={setupFee}
                        onChange={(e) => setSetupFee(e.target.value)}
                        data-testid="input-setup-fee"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthly-fee">Monthly Fee ($)</Label>
                      <Input
                        id="monthly-fee"
                        value={monthlyFee}
                        onChange={(e) => setMonthlyFee(e.target.value)}
                        data-testid="input-monthly-fee"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="venue">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-venue-empty">Venue settings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-api-keys-empty">API key configuration will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-seo-empty">SEO settings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-providers">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-ai-providers-empty">AI provider configuration will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground" data-testid="text-notifications-empty">Notification settings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
