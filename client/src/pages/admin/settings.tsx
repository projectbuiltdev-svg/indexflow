import { Save, Clock, Calendar, Users, LayoutGrid, Code, Phone, Brain, CreditCard, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin-layout";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Settings</h1>
          <p className="text-sm text-muted-foreground">Platform and client configuration</p>
        </div>
        <Button data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="workspace" data-testid="tab-workspace">Workspace Settings</TabsTrigger>
          <TabsTrigger value="api" data-testid="tab-api">API Keys</TabsTrigger>
          <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
          <TabsTrigger value="ai" data-testid="tab-ai">AI Providers</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="indexFlow" data-testid="input-company-name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" defaultValue="support@indexflow.io" data-testid="input-support-email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input id="support-phone" defaultValue="+1 (555) 123-4567" data-testid="input-support-phone" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Pricing</CardTitle>
              <CardDescription>Default pricing for new clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="complete-setup">Complete Solution - Setup Fee</Label>
                  <Input id="complete-setup" defaultValue="$499" data-testid="input-complete-setup" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complete-monthly">Complete Solution - Monthly</Label>
                  <Input id="complete-monthly" defaultValue="$299" data-testid="input-complete-monthly" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="widget-setup">AI Widget - Setup Fee</Label>
                  <Input id="widget-setup" defaultValue="$0" data-testid="input-widget-setup" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="widget-monthly">AI Widget - Monthly</Label>
                  <Input id="widget-monthly" defaultValue="$149" data-testid="input-widget-monthly" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Default business hours for new workspaces</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Use Default Hours Template</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri 11am-10pm, Sat-Sun 10am-11pm</p>
                </div>
                <Switch defaultChecked data-testid="switch-default-hours" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Custom Hours Per Workspace</p>
                  <p className="text-sm text-muted-foreground">Clients can set their own business hours</p>
                </div>
                <Switch defaultChecked data-testid="switch-custom-hours" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Closures & Holidays</CardTitle>
                <CardDescription>Default closure settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-add Major Holidays</p>
                  <p className="text-sm text-muted-foreground">Automatically add US holidays as closures</p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-holidays" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client Closures</p>
                  <p className="text-sm text-muted-foreground">Clients can add their own closure dates</p>
                </div>
                <Switch defaultChecked data-testid="switch-client-closures" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Resources & Tables</CardTitle>
                <CardDescription>Table and seating configuration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="default-tables">Default Resources per Workspace</Label>
                  <Input id="default-tables" type="number" defaultValue="15" data-testid="input-default-tables" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-party">Max Party Size</Label>
                  <Input id="max-party" type="number" defaultValue="12" data-testid="input-max-party" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Table Management</p>
                  <p className="text-sm text-muted-foreground">Clients can configure their own tables/areas</p>
                </div>
                <Switch defaultChecked data-testid="switch-table-mgmt" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Staff and team settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="max-team">Max Team Members per Workspace</Label>
                <Input id="max-team" type="number" defaultValue="10" data-testid="input-max-team" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Team Invites</p>
                  <p className="text-sm text-muted-foreground">Clients can invite their own team members</p>
                </div>
                <Switch defaultChecked data-testid="switch-team-invites" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Code className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Widget Code</CardTitle>
                <CardDescription>Embed widget settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Widget Customization</p>
                  <p className="text-sm text-muted-foreground">Clients can customize widget appearance</p>
                </div>
                <Switch defaultChecked data-testid="switch-widget-custom" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show "Powered By" Badge</p>
                  <p className="text-sm text-muted-foreground">Display indexFlow branding on widget</p>
                </div>
                <Switch defaultChecked data-testid="switch-powered-by" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Stripe</CardTitle>
                <CardDescription>Payment processing configuration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="stripe-pk">Stripe Publishable Key</Label>
                <Input id="stripe-pk" type="password" defaultValue="pk_live_xxxxx" data-testid="input-stripe-pk" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripe-sk">Stripe Secret Key</Label>
                <Input id="stripe-sk" type="password" defaultValue="sk_live_xxxxx" data-testid="input-stripe-sk" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client BYOK</p>
                  <p className="text-sm text-muted-foreground">Clients can use their own Stripe keys</p>
                </div>
                <Switch data-testid="switch-stripe-byok" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Twilio</CardTitle>
                <CardDescription>Voice and SMS configuration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="twilio-sid">Account SID</Label>
                <Input id="twilio-sid" type="password" defaultValue="AC_xxxxx" data-testid="input-twilio-sid" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twilio-token">Auth Token</Label>
                <Input id="twilio-token" type="password" defaultValue="xxxxx" data-testid="input-twilio-token" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twilio-phone">Default Phone Number</Label>
                <Input id="twilio-phone" defaultValue="+1 (555) 000-0000" data-testid="input-twilio-phone" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client BYOK</p>
                  <p className="text-sm text-muted-foreground">Clients can use their own Twilio credentials</p>
                </div>
                <Switch defaultChecked data-testid="switch-twilio-byok" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>DataForSEO</CardTitle>
                <CardDescription>Rank Tracker API credentials (Platform-managed, shared across all clients)</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="dataforseo-login">DataForSEO Login</Label>
                <Input id="dataforseo-login" type="password" defaultValue="configured" data-testid="input-dataforseo-login" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataforseo-password">DataForSEO Password</Label>
                <Input id="dataforseo-password" type="password" defaultValue="configured" data-testid="input-dataforseo-password" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Rank Tracker for All Clients</p>
                  <p className="text-sm text-muted-foreground">Allow clients to add keywords and check rankings</p>
                </div>
                <Switch defaultChecked data-testid="switch-rank-tracker" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="max-keywords">Max Keywords per Client</Label>
                  <Input id="max-keywords" type="number" defaultValue="1000" data-testid="input-max-keywords" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="check-frequency">Check Frequency</Label>
                  <Input id="check-frequency" defaultValue="Weekly (free)" disabled data-testid="input-check-frequency" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="starter-credits">Free Starter Credits</Label>
                  <Input id="starter-credits" type="number" defaultValue="5" data-testid="input-starter-credits" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credit-keyword-cap">Credit Keyword Cap</Label>
                  <Input id="credit-keyword-cap" type="number" defaultValue="250" disabled data-testid="input-credit-keyword-cap" />
                </div>
              </div>
              <div className="rounded-md border p-3 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Credit pricing:</span> $10/5 checks, $40/25 checks (250 keyword cap per credit scan). Free weekly scans cover all keywords up to 1,000. Each client gets 5 free starter credits.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Google Search Console</CardTitle>
                <CardDescription>OAuth settings for client GSC integration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable GSC for Clients</p>
                  <p className="text-sm text-muted-foreground">Allow clients to connect their Google Search Console via OAuth</p>
                </div>
                <Switch defaultChecked data-testid="switch-gsc-enabled" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI Search Visibility Tracking</p>
                  <p className="text-sm text-muted-foreground">Track client mentions in ChatGPT, Perplexity, Claude, and Google AI</p>
                </div>
                <Switch defaultChecked data-testid="switch-ai-visibility" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>OpenAI</CardTitle>
                <CardDescription>Primary AI provider</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="openai-key">API Key</Label>
                <Input id="openai-key" type="password" defaultValue="sk-xxxxx" data-testid="input-openai-key" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="openai-model">Default Model</Label>
                <Input id="openai-model" defaultValue="gpt-4o" data-testid="input-openai-model" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client BYOK</p>
                  <p className="text-sm text-muted-foreground">Clients can use their own OpenAI keys</p>
                </div>
                <Switch defaultChecked data-testid="switch-openai-byok" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anthropic (Claude)</CardTitle>
              <CardDescription>Alternative AI provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="anthropic-key">API Key</Label>
                <Input id="anthropic-key" type="password" placeholder="sk-ant-xxxxx" data-testid="input-anthropic-key" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client BYOK</p>
                  <p className="text-sm text-muted-foreground">Clients can use their own Anthropic keys</p>
                </div>
                <Switch defaultChecked data-testid="switch-anthropic-byok" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google AI (Gemini)</CardTitle>
              <CardDescription>Google AI provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="google-key">API Key</Label>
                <Input id="google-key" type="password" placeholder="AIza..." data-testid="input-google-key" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client BYOK</p>
                  <p className="text-sm text-muted-foreground">Clients can use their own Google AI keys</p>
                </div>
                <Switch defaultChecked data-testid="switch-google-byok" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other AI Providers</CardTitle>
              <CardDescription>Grok, Mistral, Cohere, Perplexity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grok-key">Grok API Key</Label>
                  <Input id="grok-key" type="password" placeholder="xai-xxxxx" data-testid="input-grok-key" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mistral-key">Mistral API Key</Label>
                  <Input id="mistral-key" type="password" placeholder="xxxxx" data-testid="input-mistral-key" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cohere-key">Cohere API Key</Label>
                  <Input id="cohere-key" type="password" placeholder="xxxxx" data-testid="input-cohere-key" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="perplexity-key">Perplexity API Key</Label>
                  <Input id="perplexity-key" type="password" placeholder="pplx-xxxxx" data-testid="input-perplexity-key" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Client BYOK for All Providers</p>
                  <p className="text-sm text-muted-foreground">Clients can bring their own keys for any provider</p>
                </div>
                <Switch defaultChecked data-testid="switch-all-byok" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>Configure which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Client Signups</p>
                  <p className="text-sm text-muted-foreground">Get notified when a new client signs up</p>
                </div>
                <Switch defaultChecked data-testid="switch-new-signups" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Failures</p>
                  <p className="text-sm text-muted-foreground">Get notified when a payment fails</p>
                </div>
                <Switch defaultChecked data-testid="switch-payment-failures" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High Call Volume</p>
                  <p className="text-sm text-muted-foreground">Get notified when a client has high call volume</p>
                </div>
                <Switch data-testid="switch-high-volume" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Website Deployments</p>
                  <p className="text-sm text-muted-foreground">Get notified when a website is published</p>
                </div>
                <Switch defaultChecked data-testid="switch-deployments" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Client Support Requests</p>
                  <p className="text-sm text-muted-foreground">Get notified when clients submit support tickets</p>
                </div>
                <Switch defaultChecked data-testid="switch-support" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email notification delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input id="notification-email" defaultValue="admin@indexflow.io" data-testid="input-notification-email" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Digest</p>
                  <p className="text-sm text-muted-foreground">Receive a daily summary instead of individual emails</p>
                </div>
                <Switch data-testid="switch-daily-digest" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
