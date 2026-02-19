import { Link, useLocation } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";
import {
  FileText,
  File,
  Megaphone,
  Globe,
  HeartPulse,
  Link2,
  RefreshCw,
  ClipboardList,
  Receipt,
} from "lucide-react";

const tabs = [
  { title: "Posts", path: "/content/posts", icon: FileText },
  { title: "Pages", path: "/content/pages", icon: File },
  { title: "Campaigns", path: "/content/campaigns", icon: Megaphone },
  { title: "Domains", path: "/content/domains", icon: Globe },
  { title: "SEO Health", path: "/seo/health", icon: HeartPulse },
  { title: "Links", path: "/seo/links", icon: Link2 },
  { title: "CMS", path: "/seo/cms", icon: RefreshCw },
  { title: "Reports", path: "/seo/reports", icon: ClipboardList },
  { title: "Invoices", path: "/seo/invoices", icon: Receipt },
];

export function ContentEngineTabs() {
  const [location] = useLocation();
  const { selectedWorkspace } = useWorkspace();
  const wsId = selectedWorkspace?.id || "";

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 border-b" data-testid="content-engine-tabs">
      {tabs.map((tab) => {
        const fullPath = `/${wsId}${tab.path}`;
        const isActive = location === fullPath;
        return (
          <Link key={tab.path} href={fullPath}>
            <a
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-testid={`tab-${tab.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.title}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
