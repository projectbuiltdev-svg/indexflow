import { Link } from "wouter";
import { SiLinkedin, SiX, SiGithub } from "react-icons/si";
import indexFlowLogo from "@assets/image_1771351451425.webp";

const productLinks = [
  { href: "/platform/content-engine", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/status", label: "Status" },
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
  { href: "/docs/api", label: "API Reference" },
  { href: "/blog", label: "Blog" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/community", label: "Community" },
];

const companyLinks = [
  { href: "/founder-statement", label: "Founder Statement" },
  { href: "/contact", label: "Contact" },
  { href: "/partners", label: "Partners" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Solutions" links={solutionLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link href="/" className="shrink-0" data-testid="link-footer-logo">
                <img
                  src={indexFlowLogo}
                  alt="indexFlow - SEO & Content Platform"
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} indexFlow. All rights reserved.
              </p>
            </div>

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
        </div>
      </div>
    </footer>
  );
}
