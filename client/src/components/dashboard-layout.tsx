import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar, Phone, BarChart3, Settings, Clock, Users, CreditCard, X as XIcon,
  Building2, Bed, BookOpen, HelpCircle, Download, Search, Globe, FileText,
  Home, ChevronRight, Menu, Bot, Code, Key, MessageSquare
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import indexFlowLogo from "@assets/image_1771351451425.png";
import { useState } from "react";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Today", href: "/dashboard", icon: Home },
      { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
      { label: "Calls", href: "/dashboard/calls", icon: Phone },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Projects",
    items: [
      { label: "Project Types", href: "/dashboard/room-types", icon: Building2 },
      { label: "Projects", href: "/dashboard/rooms", icon: Bed },
      { label: "Project Details", href: "/dashboard/room-bookings", icon: BookOpen },
    ],
  },
  {
    label: "SEO & Marketing",
    items: [
      { label: "Google Search Console", href: "/dashboard/google-search-console", icon: Search },
      { label: "Rank Tracker", href: "/dashboard/rank-tracker", icon: BarChart3 },
      { label: "Local Search Grid", href: "/dashboard/local-search-grid", icon: Globe },
      { label: "Website Changes", href: "/dashboard/website-changes", icon: FileText },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Hours", href: "/dashboard/settings/hours", icon: Clock },
      { label: "Closures", href: "/dashboard/settings/closures", icon: XIcon },
      { label: "Resources", href: "/dashboard/settings/resources", icon: Settings },
      { label: "Team", href: "/dashboard/settings/team", icon: Users },
      { label: "Payments", href: "/dashboard/settings/payments", icon: CreditCard },
      { label: "Train Widget", href: "/dashboard/settings/train-widget", icon: Bot },
      { label: "Widget Code", href: "/dashboard/settings/widget-code", icon: Code },
      { label: "Twilio Setup", href: "/dashboard/settings/twilio-setup", icon: Phone },
      { label: "Twilio Voice", href: "/dashboard/settings/twilio-voice", icon: MessageSquare },
      { label: "Twilio SMS", href: "/dashboard/settings/twilio-sms", icon: MessageSquare },
    ],
  },
  {
    label: "AI Keys (BYOK)",
    items: [
      { label: "OpenAI", href: "/dashboard/byok/openai", icon: Key },
      { label: "Anthropic", href: "/dashboard/byok/anthropic", icon: Key },
      { label: "Google AI", href: "/dashboard/byok/google", icon: Key },
      { label: "Grok", href: "/dashboard/byok/grok", icon: Key },
      { label: "Mistral", href: "/dashboard/byok/mistral", icon: Key },
      { label: "Cohere", href: "/dashboard/byok/cohere", icon: Key },
      { label: "Perplexity", href: "/dashboard/byok/perplexity", icon: Key },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Documentation", href: "/dashboard/documentation", icon: BookOpen },
      { label: "Support", href: "/dashboard/support", icon: HelpCircle },
      { label: "Export Data", href: "/dashboard/export-data", icon: Download },
    ],
  },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { selectedWorkspace, selectWorkspace, workspaces } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full" data-testid="dashboard-layout">
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-64 h-full bg-sidebar border-r flex flex-col transition-transform`}>
        <div className="p-4 border-b flex items-center gap-2">
          <img src={indexFlowLogo} alt="indexFlow" className="h-8 w-8" />
          <span className="font-bold text-lg">indexFlow</span>
        </div>
        <div className="p-3 border-b">
          <Select value={selectedWorkspace?.id || ""} onValueChange={(id) => { const w = workspaces.find(v => v.id === id) || null; selectWorkspace(w); }}>
            <SelectTrigger data-testid="select-workspace">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-2">
              <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.label}</p>
              {section.items.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-2 px-4 py-1.5 mx-2 rounded-md text-sm cursor-pointer ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground hover-elevate'}`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-2 p-3 border-b sticky top-0 z-20 bg-background">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} data-testid="button-mobile-menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
