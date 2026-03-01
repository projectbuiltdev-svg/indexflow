export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceType {
  name: string;
  namePlural: string;
  slug: string;
  description: string;
  headline: string;
  subheadline: string;
  icon: string;
  painPoints: string[];
  features: ServiceFeature[];
  faqs: ServiceFAQ[];
}

export const serviceTypes: ServiceType[] = [
  {
    name: "SEO Agency",
    namePlural: "SEO Agencies",
    slug: "seo-agencies",
    description: "All-in-one SEO platform for agencies",
    headline: "SEO Agency Platform",
    subheadline: "Rank tracking, local search grid, on-page audits, and white-label reporting from one dashboard",
    icon: "search",
    painPoints: [
      "Managing multiple SEO tools costs thousands per month with fragmented data across platforms",
      "Client reporting takes hours of manual work pulling data from different sources",
      "No unified view of keyword rankings, local visibility, and on-page health across all clients",
      "Scaling beyond a few clients means hiring more staff just to manage tools",
    ],
    features: [
      { title: "Rank Tracker", description: "Track unlimited keywords across all clients with automated weekly scans and on-demand checks" },
      { title: "Local Search Grid", description: "5x5 geo-grid ranking visualization to show clients their local search visibility" },
      { title: "On-Page SEO Auditor", description: "Automated content analysis with actionable recommendations for every page" },
      { title: "White-Label Reports", description: "Branded PDF reports with your logo, colors, and domain — delivered automatically" },
      { title: "CMS Integration", description: "Publish optimized content directly to WordPress, Webflow, Shopify, Ghost, or Wix" },
      { title: "AI Content Engine", description: "Generate SEO-optimized drafts in bulk with quality gates and editorial workflows" },
    ],
    faqs: [
      { question: "How does rank tracking work?", answer: "Add keywords per workspace, and we run automated weekly scans via DataForSEO. On-demand checks are credit-based with a 250-keyword cap per check." },
      { question: "Can I white-label reports?", answer: "Yes, reports use your branding — logo, colors, and custom domain. Clients never see indexFlow." },
      { question: "How many clients can I manage?", answer: "Unlimited workspaces. Each workspace is a separate client with its own keywords, content, and settings." },
    ],
  },
  {
    name: "Content Agency",
    namePlural: "Content Agencies",
    slug: "content-agencies",
    description: "Scale content production with AI and editorial workflows",
    headline: "Content Agency Platform",
    subheadline: "AI-powered bulk drafts, quality gates, CMS integration, and white-label delivery",
    icon: "pen-tool",
    painPoints: [
      "Writers can't keep up with client demand for fresh, optimized content",
      "No standardized quality control — every piece needs manual review",
      "Publishing across multiple CMS platforms is a manual, error-prone process",
      "Content calendars and campaigns are managed in spreadsheets with no visibility",
    ],
    features: [
      { title: "AI Bulk Draft Generator", description: "Generate dozens of SEO-optimized drafts from a single brief with configurable tone and style" },
      { title: "Quality Gates", description: "Automated checks for SEO score, readability, keyword density, and internal linking before publish" },
      { title: "Multi-CMS Publishing", description: "One-click publish to WordPress, Webflow, Shopify, Ghost, or Wix from the same dashboard" },
      { title: "Campaign Management", description: "Organize content into campaigns with deadlines, assignments, and progress tracking" },
      { title: "Image Pipeline", description: "AI-powered image generation and stock photo search integrated into every draft" },
      { title: "Client Workspaces", description: "Each client gets a separate workspace with their own content calendar and settings" },
    ],
    faqs: [
      { question: "Can clients review content before publishing?", answer: "Yes, content flows through configurable approval stages. Clients can review, comment, and approve directly in the platform." },
      { question: "Does the AI content pass plagiarism checks?", answer: "AI drafts are original content. We recommend running through your preferred plagiarism tool as a final check." },
    ],
  },
  {
    name: "Digital Marketing",
    namePlural: "Marketing Agencies",
    slug: "marketing-agencies",
    description: "Replace your entire MarTech stack with one platform",
    headline: "Digital Marketing Agency Platform",
    subheadline: "Content, SEO, CRM, invoicing, and reporting built for digital marketing agencies",
    icon: "megaphone",
    painPoints: [
      "Paying for 5+ different tools that don't talk to each other wastes budget and creates data silos",
      "Client onboarding takes days with manual setup across multiple platforms",
      "No single source of truth for client health — you're checking multiple dashboards daily",
      "Invoicing and reporting are disconnected from the actual work being delivered",
    ],
    features: [
      { title: "Unified Dashboard", description: "SEO, content, CRM, and invoicing in one platform — no more tab switching" },
      { title: "CRM & Pipeline", description: "Track leads, deals, and client lifecycle from prospect to long-term retainer" },
      { title: "Automated Invoicing", description: "Generate invoices from completed work with Stripe and PayPal integration" },
      { title: "Client Reports", description: "Automated monthly reports combining SEO metrics, content output, and campaign results" },
      { title: "Team Management", description: "Role-based access, task assignments, and team performance tracking" },
      { title: "AI Widget", description: "Embeddable chat widget for client websites with lead capture and appointment scheduling" },
    ],
    faqs: [
      { question: "Can I replace SEMrush/Ahrefs with this?", answer: "For most agency workflows, yes. We cover rank tracking, on-page audits, local search grids, and content optimization." },
      { question: "How does the CRM integrate with content?", answer: "Contacts and deals link directly to workspaces. When you close a deal, the workspace is ready for content and SEO work." },
    ],
  },
  {
    name: "Freelancer",
    namePlural: "Freelancers",
    slug: "freelancers",
    description: "Operate like a 5-person agency as a solo practitioner",
    headline: "Freelancer SEO & Content Platform",
    subheadline: "All-in-one platform for freelance SEO consultants and content strategists",
    icon: "user",
    painPoints: [
      "Tool costs eat into margins — SEMrush, Ahrefs, and content tools add up to $500+/month",
      "Juggling client work, invoicing, and reporting leaves no time for business development",
      "No professional reporting system makes you look less credible than larger agencies",
      "Manual processes limit you to 3-5 clients before you're overwhelmed",
    ],
    features: [
      { title: "Solo Plan", description: "Full platform access at $99/month — rank tracking, content engine, CRM, and invoicing included" },
      { title: "White-Label Output", description: "Reports, emails, and client portals branded with your name — not ours" },
      { title: "Automated Workflows", description: "Set up content calendars, rank tracking schedules, and report delivery on autopilot" },
      { title: "Client Portal", description: "Give clients their own login to view reports, approve content, and track progress" },
      { title: "Built-In Invoicing", description: "Create and send invoices directly from completed work — no separate billing tool needed" },
      { title: "BYOK AI", description: "Bring your own API keys for OpenAI, Anthropic, or other providers to control costs" },
    ],
    faqs: [
      { question: "Is the Solo plan enough for a freelancer?", answer: "Yes — it includes everything you need: rank tracking, content engine, CRM, invoicing, and up to 3 workspaces." },
      { question: "Can I upgrade later?", answer: "Absolutely. Upgrade to Pro or Agency as your client base grows." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceType | undefined {
  return serviceTypes.find(s => s.slug === slug);
}

export const services = serviceTypes;
