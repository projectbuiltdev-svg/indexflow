import { Link } from "wouter";
import { SiLinkedin, SiX, SiGithub } from "react-icons/si";
import indexFlowLogo from "@assets/image_1771351451425.webp";

const contentSeoLinks = [
  { href: "/platform/content-engine", label: "Content Engine" },
  { href: "/platform/schema-markup", label: "Schema Markup" },
  { href: "/platform/link-builder", label: "Link Builder" },
  { href: "/platform/seo-audit", label: "On-Page SEO Audit" },
  { href: "/platform/cms-integration", label: "CMS Integration" },
];

const rankIntelLinks = [
  { href: "/platform/rank-tracking", label: "Track Keywords" },
  { href: "/platform/local-search-grid", label: "Local Search Grid" },
  { href: "/platform/search-console", label: "Google Search Console" },
];

const businessToolLinks = [
  { href: "/platform/crm-pipeline", label: "CRM & Pipeline" },
  { href: "/platform/invoices-reports", label: "Invoicing & Reports" },
  { href: "/platform/ai-widget-voice", label: "AI Widget" },
  { href: "/platform/white-label", label: "White Label" },
  { href: "/platform/byok", label: "BYOK" },
  { href: "/platform/twilio", label: "Twilio SMS & Voice" },
];

const solutionLinks = [
  { href: "/solutions/seo-agencies", label: "SEO Agencies" },
  { href: "/solutions/content-agencies", label: "Content Agencies" },
  { href: "/solutions/marketing-agencies", label: "Marketing Agencies" },
  { href: "/solutions/freelancers", label: "Freelancers" },
  { href: "/solutions/enterprise", label: "Enterprise" },
];

const resourceLinks = [
  { href: "/docs", label: "Documentation" },
  { href: "/blog", label: "Blog" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
  { href: "/founder-statement", label: "Founder Statement" },
  { href: "/pricing", label: "Pricing" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/gdpr", label: "GDPR" },
  { href: "/dpa", label: "DPA" },
];

interface FooterLink {
  href: string;
  label: string;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-sm text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-muted/40 dark:bg-muted/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-10 lg:gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <Link href="/" className="inline-block mb-4" data-testid="link-footer-logo">
              <img
                src={indexFlowLogo}
                alt="indexFlow - SEO & Content Platform"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              White-label agency operating system. 40+ SEO tools, one subscription, keep 100% of the revenue chain.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X (Twitter)" data-testid="link-footer-x">
                <SiX className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn" data-testid="link-footer-linkedin">
                <SiLinkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub" data-testid="link-footer-github">
                <SiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Content & SEO" links={contentSeoLinks} />
          <FooterColumn title="Rank Intelligence" links={rankIntelLinks} />
          <FooterColumn title="Business Tools" links={businessToolLinks} />
          <FooterColumn title="Solutions" links={solutionLinks} />

          <div>
            <FooterColumn title="Resources" links={resourceLinks} />
            <div className="mt-8">
              <FooterColumn title="Legal" links={legalLinks} />
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-6">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} indexFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
