import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogIn, ArrowRight, ChevronDown, FileText, Search, TrendingUp, Grid3X3, Code, Link2, ClipboardCheck, Layout, Users, Receipt, Bot, Palette, Briefcase, Building2, Rocket, User, Globe, Mail, Handshake, GraduationCap, BookOpen, HelpCircle, Newspaper, BarChart3, Radio, Moon, Sun, Mic, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import indexFlowLogo from "@assets/image_1771351451425.webp";

const contentEngineItems = [
  { href: "/platform/content-engine", label: "Content Engine", icon: FileText, desc: "AI-powered blog & content creation" },
  { href: "/platform/schema-markup", label: "Schema Markup", icon: Code, desc: "Structured data for rich results" },
  { href: "/platform/link-builder", label: "Link Builder", icon: Link2, desc: "Internal & external link management" },
  { href: "/platform/seo-audit", label: "On-Page SEO Audit", icon: ClipboardCheck, desc: "Automated page-level SEO checks" },
  { href: "/platform/cms-integration", label: "CMS Integration", icon: Layout, desc: "Connect your existing CMS" },
  { href: "/platform/crm-pipeline", label: "CRM & Pipeline", icon: Users, desc: "Manage leads and deals" },
  { href: "/platform/invoices-reports", label: "Invoices & Reports", icon: Receipt, desc: "Billing and performance reports" },
  { href: "/platform/white-label", label: "White Label", icon: Palette, desc: "Your brand, your platform" },
  { href: "/platform/content-marketing", label: "Content Marketing", icon: FileText, desc: "Plan & execute content strategy" },
  { href: "/platform/byok", label: "BYOK", icon: Code, desc: "Bring your own API keys" },
];

const rankTrackerItems = [
  { href: "/platform/rank-tracking", label: "Track Keywords", icon: TrendingUp, desc: "Monitor 1000+ keywords on Google" },
  { href: "/platform/local-search-grid", label: "Local Search Grid", icon: Grid3X3, desc: "See where you rank across the map" },
  { href: "/platform/search-console", label: "GSC", icon: Search, desc: "Google Search Console integration" },
];

const voiceSmsWebItems = [
  { href: "/platform/ai-widget-voice", label: "Website Widget (AI)", icon: Bot, desc: "AI-powered website chat widget" },
  { href: "/platform/twilio", label: "Twilio SMS Voice", icon: Phone, desc: "SMS & voice automation" },
];

const featureItems = [...contentEngineItems, ...rankTrackerItems, ...voiceSmsWebItems];

const platformItems = [
  { href: "/platform/cms-integration", label: "CMS Integration", icon: Layout, desc: "Connect your existing CMS" },
  { href: "/platform/crm-pipeline", label: "CRM & Pipeline", icon: Users, desc: "Manage leads and deals" },
  { href: "/platform/invoices-reports", label: "Invoices & Reports", icon: Receipt, desc: "Billing and performance reports" },
  { href: "/platform/white-label", label: "White Label", icon: Palette, desc: "Your brand, your platform" },
];

const solutionItems = [
  { href: "/solutions/seo-agencies", label: "For SEO Agencies", icon: Search, desc: "Scale SEO delivery for clients" },
  { href: "/solutions/content-agencies", label: "For Content Agencies", icon: FileText, desc: "Streamline content production" },
  { href: "/solutions/marketing-agencies", label: "For Marketing Agencies", icon: Briefcase, desc: "Full-stack marketing toolkit" },
  { href: "/solutions/freelancers", label: "For Freelancers", icon: User, desc: "Professional tools at freelancer pricing" },
  { href: "/solutions/enterprise", label: "For Enterprise", icon: Building2, desc: "Custom solutions at scale" },
];

const resourceItems = [
  { href: "/docs", label: "Documentation", icon: BookOpen, desc: "Setup guides & platform docs" },
  { href: "/docs/api", label: "API Reference", icon: Code, desc: "REST API documentation" },
  { href: "/blog", label: "Blog", icon: Newspaper, desc: "Industry insights & tips" },
  { href: "/case-studies", label: "Case Studies", icon: BarChart3, desc: "Client success stories" },
  { href: "/changelog", label: "Changelog", icon: Rocket, desc: "Latest updates & releases" },
  { href: "/status", label: "Status Page", icon: Radio, desc: "System uptime & incidents" },
];

const companyItems = [
  { href: "/about", label: "Founder Statement", icon: Globe, desc: "Our mission & story" },
  { href: "/contact", label: "Contact", icon: Mail, desc: "Get in touch with us" },
];

interface NavItem {
  href: string;
  label: string;
  icon: any;
  desc?: string;
}

interface MegaColumn {
  label: string;
  items: NavItem[];
}

interface NavDropdownProps {
  label: string;
  items: NavItem[];
  location: string;
  testId: string;
  align?: "start" | "end";
  columns?: MegaColumn[];
  footer?: { label: string; href: string };
}

function MegaMenuItem({ item, location, testId, onClick }: { item: NavItem; location: string; testId: string; onClick: () => void }) {
  const active = location === item.href;
  return (
    <Link href={item.href}>
      <div
        className={`flex items-start gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${active ? "bg-primary/10 dark:bg-primary/20" : "hover-elevate"}`}
        data-testid={testId}
        onClick={onClick}
      >
        <div className={`mt-0.5 p-1.5 rounded-md shrink-0 ${active ? "bg-primary/20 dark:bg-primary/30" : "bg-muted dark:bg-muted/50"}`}>
          <item.icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`text-sm font-medium leading-tight ${active ? "text-primary" : ""}`}>{item.label}</span>
          {item.desc && <span className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</span>}
        </div>
      </div>
    </Link>
  );
}

function NavDropdown({ label, items, location, testId, align = "start", columns, footer }: NavDropdownProps) {
  const allItems = columns ? columns.flatMap(c => c.items) : items;
  const isActive = allItems.some((item) => location === item.href || location.startsWith(item.href + "/"));
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  const isMega = columns && columns.length > 0;

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-2 rounded-md outline-none ${
          isActive
            ? "text-primary dark:text-primary"
            : "text-foreground/70 hover:text-foreground dark:text-gray-300 dark:hover:text-white"
        }`}
        data-testid={testId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute top-full pt-2 z-50 ${align === "end" ? "right-0" : isMega ? "left-1/2 -translate-x-1/2" : "left-0"}`}>
          {isMega ? (
            <div className="rounded-lg border border-border/50 bg-white dark:bg-popover shadow-lg">
              <div className="flex p-2 gap-0">
                {columns.map((col, idx) => (
                  <div key={col.label} className={`min-w-[240px] ${idx > 0 ? "border-l border-border/30 pl-2" : ""}`}>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{col.label}</div>
                    <div className="space-y-0.5">
                      {col.items.map((item) => (
                        <MegaMenuItem
                          key={item.label}
                          item={item}
                          location={location}
                          testId={`${testId}-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {footer && (
                <div className="border-t border-border/30 px-4 py-3 bg-muted/30 dark:bg-muted/10 rounded-b-lg">
                  <Link href={footer.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      data-testid={`${testId}-footer-cta`}
                      onClick={() => setOpen(false)}
                    >
                      {footer.label}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="min-w-[280px] rounded-lg border border-border/50 bg-white dark:bg-popover shadow-lg p-2">
              <div className="space-y-0.5">
                {items.map((item) => (
                  <MegaMenuItem
                    key={item.label}
                    item={item}
                    location={location}
                    testId={`${testId}-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
              {footer && (
                <div className="border-t border-border/30 mt-1 pt-2">
                  <Link href={footer.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      data-testid={`${testId}-footer-cta`}
                      onClick={() => setOpen(false)}
                    >
                      {footer.label}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MobileDropdownProps {
  label: string;
  items: NavItem[];
  location: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  testId: string;
  sections?: { label: string; items: NavItem[] }[];
}

function MobileDropdown({ label, items, location, isOpen, onToggle, onNavigate, testId, sections }: MobileDropdownProps) {
  const allItems = sections ? sections.flatMap(s => s.items) : items;
  return (
    <div>
      <button
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
          isOpen || allItems.some((i) => location === i.href || location.startsWith(i.href + "/"))
            ? "text-primary bg-primary/5"
            : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
        }`}
        onClick={onToggle}
        data-testid={testId}
      >
        {label}
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="pl-3 py-1 space-y-0.5">
          {sections ? (
            sections.map((section) => (
              <div key={section.label}>
                <div className="px-3 py-1.5 mt-1 first:mt-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.label}
                </div>
                {section.items.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <button
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        location === item.href || location.startsWith(item.href + "/")
                          ? "text-primary bg-primary/5"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      }`}
                      onClick={onNavigate}
                      data-testid={`${testId}-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            ))
          ) : (
            items.map((item) => (
              <Link key={item.label} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    location === item.href || location.startsWith(item.href + "/")
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={onNavigate}
                  data-testid={`${testId}-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col items-start">
                    <span>{item.label}</span>
                    {item.desc && <span className="text-xs text-muted-foreground">{item.desc}</span>}
                  </div>
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, label, location, testId }: { href: string; label: string; location: string; testId: string }) {
  const isActive = location === href;
  return (
    <Link
      href={href}
      className={`flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md relative ${
        isActive
          ? "text-primary dark:text-primary"
          : "text-foreground/70 hover:text-foreground dark:text-gray-300 dark:hover:text-white"
      }`}
      data-testid={testId}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <Link href="/" className="flex items-center flex-shrink-0" data-testid="link-home-logo">
              <img
                src={indexFlowLogo}
                alt="indexFlow - SEO & Content Platform for Agencies"
                className="h-10 lg:h-12 w-auto"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              <NavDropdown
                label="Features"
                items={[]}
                location={location}
                testId="link-nav-features"
                columns={[
                  { label: "Content Engine", items: contentEngineItems },
                  { label: "Rank Tracker & Voice", items: [...rankTrackerItems, ...voiceSmsWebItems] },
                ]}
                footer={{ label: "View all features", href: "/platform/content-engine" }}
              />
              <NavDropdown
                label="Platform"
                items={platformItems}
                location={location}
                testId="link-nav-platform"
                footer={{ label: "View all platform features", href: "/platform/seo" }}
              />
              <NavDropdown
                label="Solutions"
                items={solutionItems}
                location={location}
                testId="link-nav-solutions"
                footer={{ label: "Compare plans", href: "/pricing" }}
              />
              <NavLink href="/pricing" label="Pricing" location={location} testId="link-nav-pricing" />
              <NavDropdown
                label="Resources"
                items={resourceItems}
                location={location}
                testId="link-nav-resources"
              />
              <NavDropdown
                label="Why IndexFlow"
                items={companyItems}
                location={location}
                testId="link-nav-company"
              />
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => {
                  const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
                  const next = current === "light" ? "dark" : "light";
                  document.documentElement.classList.toggle("dark", next === "dark");
                  localStorage.setItem("theme", next);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors outline-none focus:outline-none"
                data-testid="button-theme-toggle"
              >
                <Moon className="w-4 h-4 dark:hidden" />
                <Sun className="w-4 h-4 hidden dark:block" />
              </button>
              <Link href="/select-workspace">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5" data-testid="link-login">
                  <LogIn className="w-4 h-4" />
                  Log In
                </span>
              </Link>
              <Link href="/pricing">
                <Button data-testid="button-start-trial">Start Free Trial</Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => {
                  const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
                  const next = current === "light" ? "dark" : "light";
                  document.documentElement.classList.toggle("dark", next === "dark");
                  localStorage.setItem("theme", next);
                }}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors outline-none"
                data-testid="button-theme-toggle-mobile"
              >
                <Moon className="w-4 h-4 dark:hidden" />
                <Sun className="w-4 h-4 hidden dark:block" />
              </button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                data-testid="button-mobile-menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[calc(100vh-3.5rem)] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white dark:bg-gray-900 border-b border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="py-3 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-0.5">
              <MobileDropdown
                label="Features"
                items={[]}
                location={location}
                isOpen={openMobileDropdown === "features"}
                onToggle={() => toggleMobileDropdown("features")}
                onNavigate={() => setIsOpen(false)}
                testId="link-mobile-features"
                sections={[
                  { label: "Content Engine", items: contentEngineItems },
                  { label: "Rank Tracker", items: rankTrackerItems },
                  { label: "Voice, SMS & Web", items: voiceSmsWebItems },
                ]}
              />
              <MobileDropdown
                label="Platform"
                items={platformItems}
                location={location}
                isOpen={openMobileDropdown === "platform"}
                onToggle={() => toggleMobileDropdown("platform")}
                onNavigate={() => setIsOpen(false)}
                testId="link-mobile-platform"
              />
              <MobileDropdown
                label="Solutions"
                items={solutionItems}
                location={location}
                isOpen={openMobileDropdown === "solutions"}
                onToggle={() => toggleMobileDropdown("solutions")}
                onNavigate={() => setIsOpen(false)}
                testId="link-mobile-solutions"
              />
              <Link href="/pricing">
                <button
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location === "/pricing"
                      ? "text-primary bg-primary/5"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                  data-testid="link-mobile-pricing"
                >
                  Pricing
                </button>
              </Link>
              <MobileDropdown
                label="Resources"
                items={resourceItems}
                location={location}
                isOpen={openMobileDropdown === "resources"}
                onToggle={() => toggleMobileDropdown("resources")}
                onNavigate={() => setIsOpen(false)}
                testId="link-mobile-resources"
              />
              <MobileDropdown
                label="Why IndexFlow"
                items={companyItems}
                location={location}
                isOpen={openMobileDropdown === "company"}
                onToggle={() => toggleMobileDropdown("company")}
                onNavigate={() => setIsOpen(false)}
                testId="link-mobile-company"
              />

              <div className="border-t border-border/30 my-2" />

              <div className="flex flex-col gap-2 px-3 py-2">
                <Link href="/select-workspace">
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2"
                    onClick={() => setIsOpen(false)}
                    data-testid="link-mobile-login"
                  >
                    <LogIn className="w-4 h-4" />
                    Log In
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    className="w-full justify-center"
                    onClick={() => setIsOpen(false)}
                    data-testid="link-mobile-start-trial"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
