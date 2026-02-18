import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Search,
  Phone,
  MessageSquare,
  Kanban,
  BarChart3,
  Plug,
  Brain,
  Settings,
  LifeBuoy,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useWorkspace } from "@/lib/workspace-context";

export function ClientSidebar() {
  const [location] = useLocation();
  const { workspaces, selectedWorkspace, selectWorkspace } = useWorkspace();

  const base = selectedWorkspace ? `/${selectedWorkspace.id}` : "";

  const isActive = (path: string) => {
    const fullPath = `${base}${path}`;
    if (path.endsWith("/today")) return location === fullPath;
    return location.startsWith(fullPath);
  };

  // Dashboard section
  const dashboardItems = [
    { title: "Overview", path: "/today", icon: LayoutDashboard },
  ];

  // Content Engine
  const contentEngineItems = [
    { title: "Posts", path: "/content/posts" },
    { title: "Pages", path: "/content/pages" },
    { title: "Campaigns", path: "/content/campaigns" },
    { title: "Domains", path: "/content/domains" },
  ];

  // SEO
  const seoItems = [
    { title: "Links", path: "/seo/links" },
    { title: "Health", path: "/seo/health" },
    { title: "CMS", path: "/seo/cms" },
    { title: "Reports", path: "/seo/reports" },
    { title: "Invoices", path: "/seo/invoices" },
  ];

  // Rank Tracker nested items
  const rankTrackerItems = [
    { title: "Track Keywords", path: "/rank-tracker/track-keywords" },
    { title: "Local Search Grid", path: "/rank-tracker/local-search-grid" },
    { title: "Google Search Console", path: "/rank-tracker/google-search-console" },
  ];

  // Twilio
  const twilioItems = [
    { title: "Call Logs", path: "/twilio/call-logs" },
    { title: "Voice Settings", path: "/twilio/voice" },
    { title: "SMS Settings", path: "/twilio/sms" },
  ];

  // Widget
  const widgetItems = [
    { title: "Monitoring", path: "/widget/monitoring" },
    { title: "Widget Code", path: "/widget/code" },
  ];

  // CRM
  const crmItems = [
    { title: "Pipeline", path: "/crm/pipeline" },
    { title: "Contacts", path: "/crm/contacts" },
  ];

  // Analytics
  const analyticsItems = [
    { title: "Overview", path: "/analytics/overview" },
    { title: "Export Data", path: "/analytics/export" },
  ];

  // Connections
  const connectionsItems = [
    { title: "AI Providers", path: "/connections/ai-providers" },
    { title: "Image Banks", path: "/connections/image-banks" },
    { title: "Payments", path: "/connections/payments" },
    { title: "Twilio Account", path: "/connections/twilio" },
  ];

  // AI Training
  const aiTrainingItems = [
    { title: "Knowledge Base", path: "/ai-training/knowledge-base" },
    { title: "Channels", path: "/ai-training/channels" },
  ];

  // Settings
  const settingsItems = [
    { title: "Team & Invites", path: "/settings/team" },
    { title: "White Label", path: "/settings/white-label" },
    { title: "Billing & Usage", path: "/settings/billing" },
    { title: "Setup Guide", path: "/settings/setup-guide" },
  ];

  // Support
  const supportItems = [
    { title: "Documentation", path: "/support/documentation" },
    { title: "Support Tickets", path: "/support/tickets" },
  ];

  // Determine which sections are active
  const isSeoActive = location.startsWith(`${base}/seo`) || location.startsWith(`${base}/rank-tracker`);
  const isRankTrackerActive = location.startsWith(`${base}/rank-tracker`);
  const isContentEngineActive = location.startsWith(`${base}/content`);
  const isTwilioActive = location.startsWith(`${base}/twilio`);
  const isWidgetActive = location.startsWith(`${base}/widget`);
  const isCrmActive = location.startsWith(`${base}/crm`);
  const isAnalyticsActive = location.startsWith(`${base}/analytics`);
  const isConnectionsActive = location.startsWith(`${base}/connections`);
  const isAiTrainingActive = location.startsWith(`${base}/ai-training`);
  const isSettingsActive = location.startsWith(`${base}/settings`);
  const isSupportActive = location.startsWith(`${base}/support`);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-sm font-semibold truncate" data-testid="text-client-title">
            {selectedWorkspace?.name ?? "indexFlow"}
          </span>
        </div>
        <Select
          value={selectedWorkspace?.id ?? ""}
          onValueChange={(val) => {
            const workspace = workspaces.find((w) => w.id === val) ?? null;
            selectWorkspace(workspace);
          }}
        >
          <SelectTrigger data-testid="select-workspace" className="w-full bg-sidebar border-sidebar-border text-sidebar-foreground text-xs h-8">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {workspaces.map((workspace) => (
              <SelectItem
                key={workspace.id}
                value={workspace.id}
                data-testid={`select-workspace-option-${workspace.id}`}
              >
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    data-testid={`link-dashboard-${item.title.toLowerCase()}`}
                  >
                    <Link href={`${base}${item.path}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Engine */}
        <SidebarGroup>
          <Collapsible defaultOpen={isContentEngineActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isContentEngineActive}
                  tooltip="Content Engine"
                  data-testid="link-content-engine"
                >
                  <FileText />
                  <span>Content Engine</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {contentEngineItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-content-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* SEO */}
        <SidebarGroup>
          <Collapsible defaultOpen={isSeoActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isSeoActive}
                  tooltip="SEO"
                  data-testid="link-seo"
                >
                  <Search />
                  <span>SEO</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {seoItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-seo-${item.title.toLowerCase()}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  {/* Rank Tracker nested */}
                  <SidebarMenuSubItem>
                    <Collapsible defaultOpen={isRankTrackerActive} className="group/rank-collapsible w-full">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuSubButton
                          isActive={isRankTrackerActive}
                          data-testid="link-seo-rank-tracker"
                        >
                          <span>Rank Tracker</span>
                          <ChevronDown className="ml-auto h-3 w-3 transition-transform group-data-[state=open]/rank-collapsible:rotate-180" />
                        </SidebarMenuSubButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-0 border-l-0 pl-4">
                          {rankTrackerItems.map((item) => (
                            <SidebarMenuSubItem key={item.path}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(item.path)}
                                data-testid={`link-rank-tracker-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                <Link href={`${base}${item.path}`}>
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Twilio */}
        <SidebarGroup>
          <Collapsible defaultOpen={isTwilioActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isTwilioActive}
                  tooltip="Twilio"
                  data-testid="link-twilio"
                >
                  <Phone />
                  <span>Twilio</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {twilioItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-twilio-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Widget */}
        <SidebarGroup>
          <Collapsible defaultOpen={isWidgetActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isWidgetActive}
                  tooltip="Widget"
                  data-testid="link-widget"
                >
                  <MessageSquare />
                  <span>Widget</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {widgetItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-widget-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* CRM */}
        <SidebarGroup>
          <Collapsible defaultOpen={isCrmActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isCrmActive}
                  tooltip="CRM"
                  data-testid="link-crm"
                >
                  <Kanban />
                  <span>CRM</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {crmItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-crm-${item.title.toLowerCase()}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Analytics */}
        <SidebarGroup>
          <Collapsible defaultOpen={isAnalyticsActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isAnalyticsActive}
                  tooltip="Analytics"
                  data-testid="link-analytics"
                >
                  <BarChart3 />
                  <span>Analytics</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {analyticsItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-analytics-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Connections */}
        <SidebarGroup>
          <Collapsible defaultOpen={isConnectionsActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isConnectionsActive}
                  tooltip="Connections"
                  data-testid="link-connections"
                >
                  <Plug />
                  <span>Connections</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {connectionsItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-connections-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* AI Training */}
        <SidebarGroup>
          <Collapsible defaultOpen={isAiTrainingActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isAiTrainingActive}
                  tooltip="AI Training"
                  data-testid="link-ai-training"
                >
                  <Brain />
                  <span>AI Training</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {aiTrainingItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-ai-training-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <Collapsible defaultOpen={isSettingsActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isSettingsActive}
                  tooltip="Settings"
                  data-testid="link-settings"
                >
                  <Settings />
                  <span>Settings</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {settingsItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-settings-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          <Collapsible defaultOpen={isSupportActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isSupportActive}
                  tooltip="Support"
                  data-testid="link-support"
                >
                  <LifeBuoy />
                  <span>Support</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {supportItems.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.path)}
                        data-testid={`link-support-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground" data-testid="text-client-footer">
          indexFlow Platform
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
