import { Link, useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const segmentLabels: Record<string, string> = {
  "platform": "Product",
  "solutions": "Solutions",
  "comparisons": "Compare",
  "features": "Features",
  "docs": "Documentation",
  "blog": "Blog",
  "pricing": "Pricing",
  "contact": "Contact",
  "templates": "Templates",
  "case-studies": "Case Studies",
  "faq": "FAQ",
  "testimonials": "Testimonials",
  "gallery": "Gallery",
  "privacy": "Privacy Policy",
  "terms": "Terms of Service",
  "cookies": "Cookie Policy",
  "gdpr": "GDPR",
  "dpa": "DPA",
  "roadmap": "Roadmap",
  "founder-statement": "Founder Statement",
  "how-it-works": "How It Works",
  "select-workspace": "My Workspaces",
  "content-engine": "Content Engine",
  "schema-markup": "Schema Markup",
  "link-builder": "Link Builder",
  "seo-audit": "On-Page SEO Audit",
  "cms-integration": "CMS Integration",
  "crm-pipeline": "CRM & Pipeline",
  "invoices-reports": "Invoicing & Reports",
  "white-label": "White Label",
  "content-marketing": "Content Marketing",
  "byok": "BYOK",
  "rank-tracking": "Rank Tracker",
  "local-search-grid": "Local Search Grid",
  "search-console": "Search Console",
  "ai-widget-voice": "AI Widget",
  "twilio": "Twilio SMS & Voice",
  "seo": "SEO Tools",
  "seo-tools": "SEO Tools",
  "seo-agencies": "SEO Agencies",
  "content-agencies": "Content Agencies",
  "marketing-agencies": "Marketing Agencies",
  "freelancers": "Freelancers",
  "enterprise": "Enterprise",
  "white-label-resellers": "White-Label Resellers",
  "best-seo-platforms": "Best SEO Platforms",
  "api": "API Reference",
  "voice-assistant": "AI Voice Assistant",
  "sms-notifications": "SMS & Notifications",
  "multi-language": "Multi-Language",
  "analytics": "Analytics",
  "local-citations": "Local Citations",
  "dashboard": "Client Dashboard",
  "integrations": "Integrations",
};

function getLabel(segment: string): string {
  return segmentLabels[segment] || segment.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function Breadcrumbs() {
  const [location] = useLocation();

  if (location === "/" || location === "") return null;

  const segments = location.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: getLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indexflow.cloud" },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 2,
        "name": c.label,
        "item": `https://indexflow.cloud${c.href}`,
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" data-testid="breadcrumbs">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors" data-testid="breadcrumb-home">
              <ChevronLeft className="w-3.5 h-3.5" />
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              {crumb.isLast ? (
                <span className="font-medium text-foreground" data-testid={`breadcrumb-${crumb.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors" data-testid={`breadcrumb-${crumb.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
