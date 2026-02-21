import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.png";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO, seoData, combinedHomeSchema } from "@/components/seo";

function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900" />
      {showVideo && (
        <div className="absolute inset-0" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1165788581?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "177.78vh", minWidth: "100%", height: "56.25vw", minHeight: "100%", border: 0 }}
            title="indexFlow"
            data-testid="hero-video"
          />
        </div>
      )}
    </div>
  );
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </div>
  );
}

const marqueeItems = [
  "Programmatic Content Engine",
  "Rank Tracker · 1,000 keywords",
  "Local Search Grid (5x5)",
  "Lead to Booking CRM",
  "Invoice Builder",
  "AI Widget",
  "Twilio Voice & SMS",
  "True White Label",
  "GSC Ingestion Layer",
  "Cloudflare Edge Deployment",
  "SOC 2 Compliant",
  "BYOK",
];

const painCards = [
  { icon: "🗂️", title: "12 Browser Tabs Open", desc: "You're juggling Ahrefs, Jasper, HubSpot, FreshBooks, and 8 other tools just to do your job." },
  { icon: "📋", title: "Copy-Pasting Between Tools", desc: "Write in Google Docs, paste into WordPress, reformat, re-add images, manually paste JSON-LD." },
  { icon: "📊", title: "Spreadsheet CRM", desc: "Tracking leads in Google Sheets. Losing deals because you forgot to follow up." },
  { icon: "🔗", title: "Manual Internal Links", desc: "Going back to add links to old posts. No system for orphan pages or broken links." },
  { icon: "📑", title: "Building Reports Manually", desc: "Spending Friday pulling data from four tools into a PowerPoint for client presentations." },
  { icon: "🔑", title: "Juggling API Keys", desc: "Hunting through five dashboards to update an expired key or check usage." },
];

const solutionCards = [
  { icon: "✍️", title: "Programmatic Content Engine", desc: "Bulk AI drafts with quality gates, stock images with auto alt text, schema markup auto-detection. Deploy thousands of SEO-optimised articles automatically to client domains." },
  { icon: "🔍", title: "SEO Tools Suite", desc: "Rank Tracker, Local Search Grid (5x5), On-Page Auditor, Link Builder, Post Validator — all built in. 1,000 keywords tracked weekly." },
  { icon: "🚀", title: "CMS Integration", desc: "Publish to WordPress, Shopify, Webflow, Ghost, or Wix with one click. Formatted perfectly. No copy-paste, no reformatting." },
  { icon: "👥", title: "Lead to Booking CRM", desc: "Full-funnel attribution from organic impression to booked appointment. Contacts, deals, customisable kanban stages. Every workspace has its own isolated CRM." },
  { icon: "🧾", title: "Invoicing & Reports", desc: "Line items, multi-currency, status tracking. Content and SEO reports with saved snapshots. Client-ready in minutes, not hours." },
  { icon: "🏷️", title: "White-Label Deployment", desc: "Deploy across unlimited client domains via Cloudflare's edge network. Custom SSL, zero downtime. Your logo, your domain, your brand. Bring your own API keys." },
];

const toolCategories = [
  {
    label: "✍️ Programmatic Content Engine",
    items: [
      { text: "AI Post Generator", bold: true, suffix: " — bulk drafts at scale" },
      { text: "Post Editor" },
      { text: "Pages Builder" },
      { text: "Campaign Manager" },
      { text: "Content Moderation & Quality Gates" },
      { text: "Stock Images with auto alt text" },
      { text: "CMS Integration", bold: true, suffix: " — WordPress, Webflow, Shopify, Ghost, Wix" },
    ],
  },
  {
    label: "🔍 SEO Tools",
    items: [
      { text: "Internal Link Builder" },
      { text: "Link Health Monitor" },
      { text: "Post Validator — per-post SEO scoring" },
      { text: "On-Page Auditor" },
      { text: "Site Profiler" },
      { text: "Schema Markup Generator" },
      { text: "SEO Health Dashboard" },
      { text: "SEO Reports" },
    ],
  },
  {
    label: "📈 Rank Tracker",
    items: [
      { text: "Rank Tracker", bold: true, suffix: " — 1,000 keywords weekly" },
      { text: "Local Search Grid (5x5)", bold: true, suffix: " — see where you rank" },
      { text: "GSC Ingestion Layer" },
      { text: "Competitor Keyword Spy" },
      { text: "SERP Preview Tool" },
      { text: "Keyword Gap Analysis" },
    ],
  },
  {
    label: "👥 CRM & Pipeline",
    items: [
      { text: "Lead to Booking CRM" },
      { text: "Contacts Manager" },
      { text: "Deal Pipeline (Kanban)" },
      { text: "Full-Funnel Attribution" },
    ],
  },
  {
    label: "🤖 AI & Communications",
    items: [
      { text: "AI Widget — website chat" },
      { text: "Widget Monitoring" },
      { text: "Widget Code Generator" },
      { text: "Twilio Voice" },
      { text: "Twilio SMS" },
      { text: "Twilio Call Logs" },
    ],
  },
  {
    label: "🔌 Connections (BYOK)",
    items: [
      { text: "AI Provider Connections" },
      { text: "Image Bank Connections" },
      { text: "Payment Connections" },
      { text: "Twilio Account Connection" },
    ],
  },
  {
    label: "📊 Analytics & Reporting",
    items: [
      { text: "Analytics Overview" },
      { text: "Export Data" },
      { text: "SEO Reports with snapshots" },
      { text: "Invoicing — line items, multi-currency" },
    ],
  },
  {
    label: "⚙️ Settings & Admin",
    items: [
      { text: "Team & Invites" },
      { text: "White Label Branding" },
      { text: "Billing & Usage" },
      { text: "Setup Guide" },
      { text: "AI Training / Knowledge Base" },
      { text: "AI Channels" },
    ],
  },
];

const replaceItems = [
  { before: "Ahrefs / SEMrush", after: "Rank Tracker + Local Search Grid" },
  { before: "SurferSEO / Clearscope", after: "Quality Gates + Post Validator" },
  { before: "Jasper / Copy.ai", after: "Content Engine with GPT-4o" },
  { before: "HubSpot / Pipedrive", after: "Lead to Booking CRM" },
  { before: "FreshBooks / QuickBooks", after: "Invoice Builder" },
  { before: "Intercom / Drift", after: "AI Widget" },
  { before: "LinkWhisper", after: "Cross-Post Link Builder" },
  { before: "Screaming Frog", after: "On-Page SEO Auditor" },
];

const serveCards = [
  { icon: "📈", title: "SEO Agencies", desc: "Rank tracking, local search grids, on-page audits, GSC Ingestion Layer" },
  { icon: "✍️", title: "Content Agencies", desc: "Bulk AI drafts, quality gates, CMS publishing, content reporting" },
  { icon: "📣", title: "Digital Marketing Agencies", desc: "Full-service SEO, content, CRM, invoicing and reporting" },
  { icon: "🧑‍💻", title: "Freelancers & Consultants", desc: "Professional tools at solo pricing. White label from day one." },
];

const steps = [
  { num: "01", title: "Connect Client Domains", desc: "Add your client's domain and configure Cloudflare Custom Hostnames for instant SSL provisioning." },
  { num: "02", title: "Generate Content", desc: "Use templates or import your HTML design to generate thousands of SEO-optimised service pages or blog articles targeting local and long-tail keywords." },
  { num: "03", title: "Deploy to Edge", desc: "Content deploys via GitHub to Cloudflare Pages. Zero-config, instant global distribution." },
  { num: "04", title: "Track & Optimise", desc: "Monitor rankings, analyse Local Search Grids, and attribute leads through the full funnel." },
];

const lifecycleSteps = [
  { icon: "✍️", title: "Create", desc: "AI-powered bulk content generation with quality gates" },
  { icon: "🔍", title: "Optimise", desc: "On-page SEO audits, schema markup, internal linking" },
  { icon: "🚀", title: "Publish", desc: "One-click publish to 5 CMS platforms" },
  { icon: "📈", title: "Monitor", desc: "Rank tracking, local search grid, GSC ingestion" },
  { icon: "📊", title: "Report", desc: "Content & SEO reports with saved snapshots" },
];

const infraCards = [
  { icon: "🌐", title: "Cloudflare Edge", desc: "Global CDN with Custom Hostnames and automatic SSL provisioning for every client domain. Zero downtime, global performance." },
  { icon: "⚙️", title: "GitHub Pipeline", desc: "Automated Git-based deployments. Push content, it's live globally within seconds. No config, no DevOps required." },
  { icon: "🔒", title: "Enterprise Security", desc: "SOC 2 compliant infrastructure. Data isolation per tenant, encrypted at rest and in transit." },
];

const whyCards = [
  { icon: "🔌", title: "One Platform", desc: "Stop juggling tools. Content, SEO, CRM, invoicing, publishing — all connected. All in a single place." },
  { icon: "🏷️", title: "White Label Ready", desc: "Your brand, your domain, your clients. They never see IndexFlow. 100% of the revenue chain belongs to you." },
  { icon: "🤖", title: "AI-Powered at Scale", desc: "Generate 40 service pages/posts per workspace = one domain every month. Quality gates enforce standards automatically." },
  { icon: "🔄", title: "Full Lifecycle Coverage", desc: "Create, optimise, publish, monitor, report. Before and after publishing." },
];

const testimonials = [
  { quote: "We replaced 8 separate tools with IndexFlow. Our team's output doubled and we cut costs by 60%.", author: "Sarah Mitchell", role: "Founder, Apex Digital Marketing" },
  { quote: "The white-label feature let us launch our own SEO platform in a week. Our clients think we built it.", author: "David Park", role: "CEO, Greenline Agency" },
  { quote: "Bulk content generation with quality gates changed everything. We went from 10 posts a week to 50.", author: "Rachel Torres", role: "Content Director, BrightPath Media" },
];

const pricingPlans = [
  {
    tier: "Solo",
    price: "$99",
    period: "per month",
    tagline: '"Stop paying for 6 tools. Pay for one."',
    features: ["1 user", "1 workspace", "40 AI posts/month", "All 40+ tools included", "Google Indexing Automation", "Rank Tracker — 1,000 keywords", "Email support"],
    cta: "Get Started →",
    featured: false,
  },
  {
    tier: "Pro",
    price: "$199",
    period: "per month",
    tagline: '"Turn your SEO service into a product."',
    features: ["5 users", "50 white label workspaces", "Bulk campaigns", "Everything in Solo", "Full white-label branding", "Client-facing dashboards", "Reseller licence included", "Priority support"],
    cta: "Start Free 30-Day Trial →",
    featured: true,
  },
  {
    tier: "Agency",
    price: "$349",
    period: "per month",
    tagline: '"Infrastructure for agencies that mean business."',
    features: ["10 users", "100 white label workspaces", "Full white label", "Everything in Pro", "Advanced API access", "Priority onboarding call", "Dedicated account manager"],
    cta: "Get Started →",
    featured: false,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "contact us",
    tagline: '"You\'ve outgrown tools. You need infrastructure."',
    features: ["Unlimited everything", "Super Admin Dashboard", "Dedicated support", "Custom contracts", "White glove onboarding", "SLA guarantees", "Co-marketing options"],
    cta: "Talk To Us →",
    featured: false,
    isCustom: true,
  },
];

const compareOld = [
  "$297–$497/month, use 40% of features",
  "SEO is an afterthought — pages don't get indexed",
  '"White label" means their brand stays',
  "They take a cut of your reseller revenue",
  "Learning curve that never ends",
  "Built on their terms, their roadmap",
  "Price hike? Your margin shrinks.",
];

const compareNew = [
  "$99–$499/month. Pay for what you use.",
  "Google Indexing Automation built in",
  "True white label — Cloudflare edge deployment",
  "100% of client revenue stays with you",
  "Works with CMS platforms you already use",
  "You own the client relationship entirely",
  "You set the price. You keep every penny.",
];

const faqItemsCol1 = [
  { q: "What's the same across all plans?", a: "Every plan includes 40 AI posts per workspace per month, Rank Tracker (1,000 keywords), Local Search Grid (5x5), Google Search Console, full CRM, all 5 CMS integrations, Link Builder, Post Validator, On-Page Auditor, Site Profiler, Schema Markup, AI Widget, Twilio, domain mapping, invoicing, Link Health monitoring, BYOK, and multi-language support." },
  { q: "Can I buy additional workspaces?", a: "Yes. On the Professional plan, you can purchase additional workspaces up to 50 total. White Label supports up to 150. Enterprise is unlimited." },
  { q: "How do Rank Tracker credits work?", a: "Every workspace gets 1 free keyword refresh per calendar week, auto-applied every Monday. Need instant refreshes? Buy credits: 5 for $10 or 25 for $35." },
  { q: "How does the Local Search Grid work?", a: "Each workspace gets 1 free weekly 5x5 grid scan, auto-applied. Buy instant scan credits: 5 for $10 or 25 for $35. The grid maps your client's Google Maps ranking across 25 geographic points — the clearest way to show local SEO progress and one of the most compelling things to include in a monthly report." },
  { q: "What does white label include?", a: "Upload your logo, set your brand name, pick brand colors, configure a custom domain, and set your support email. Your clients see your brand everywhere — IndexFlow branding is completely hidden across all dashboards, reports, emails, and URLs." },
  { q: "What is BYOK?", a: "Bring Your Own Key. Connect your own API keys for AI providers (OpenAI, Anthropic, Google AI, Grok, Mistral, Cohere, Perplexity), image banks (Unsplash, Pexels, Pixabay), payment processors (Stripe, PayPal), and Twilio. All keys encrypted with AES-256-GCM. Your keys, your costs, your control." },
  { q: "Is there annual pricing?", a: "Yes. Pay annually and get 2 months free (pay for 10, get 12). Solo drops to $83/mo, Professional to $249/mo, and White Label to $416/mo. The easiest way to reduce your costs without changing anything else." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no lock-in. Cancel your subscription at any time. We believe the product should earn your renewal every month — not trap it." },
  { q: "Do I need to move my existing website or content?", a: "No. IndexFlow is a delivery and optimisation layer — not a website builder. Your content stays exactly where it is. We connect to it, optimise it, and make sure Google finds it. No migration, no downtime, no rebuilding anything from scratch." },
  { q: "Does it work with GoHighLevel?", a: "Yes. IndexFlow works alongside GHL, not against it. If your clients are on GHL, IndexFlow connects to their domains and handles the SEO layer that GHL consistently fails to deliver — indexing, rank tracking, on-page audits, and reporting. You keep GHL for what it does okay. You use IndexFlow for what it does brilliantly." },
  { q: "What CMS platforms does it publish to?", a: "WordPress, Shopify, Webflow, Ghost, and Wix. One-click publishing with automatic formatting, image alt text, and schema markup. No copy-paste, no reformatting, no broken layouts." },
  { q: "What happens after the $1 trial?", a: "After 30 days you choose the plan that fits — Solo at $99, Pro at $199, or Agency at $349. No automatic charges at a higher rate, no surprise fees. If you decide it's not for you, cancel before day 30 and you pay nothing more. We'd rather earn your business than trap it." },
  { q: "Is the white label actually white label?", a: "Completely. Your logo, your domain, your colour scheme, your brand name. Clients log into what looks like your platform. IndexFlow is invisible to them — it never appears in URLs, emails, reports, or dashboards. You own the client relationship 100%." },
  { q: "What is a workspace?", a: "A workspace is an isolated client environment — their own dashboard, their own content, their own rank tracking, their own reports. Each workspace is completely separate from the others. On Pro you get 50 workspaces, meaning you can manage up to 50 clients from one login under your brand." },
  { q: "Can I charge my clients more than I pay for IndexFlow?", a: "That's exactly the point. At $199/month for 50 workspaces, each workspace costs you $3.99. Most agencies charge $99–$299/month per client for SEO tooling. Two clients at $100/month and you've broken even. The remaining 48 workspaces are pure margin. IndexFlow is designed to be a profit centre, not a cost." },
  { q: "How does the $1 trial work exactly?", a: "Pay $1 today and get full access to the Pro tier for 30 days — all 40+ tools, all 50 white label workspaces, full white label branding. No feature restrictions, no watermarks, no sandbox mode. The real thing from day one so you can set up client workspaces and see the value immediately." },
  { q: "What does GSC Ingestion Layer mean?", a: "It means IndexFlow automatically pulls all your clients' Google Search Console data into one unified dashboard. Impressions, clicks, indexing status, crawl errors — all properties, all in one place. No logging into 10 different GSC accounts. No exporting CSVs. Everything consolidated and ready to report on." },
  { q: "Is IndexFlow SOC 2 compliant?", a: "Yes. IndexFlow runs on SOC 2 compliant infrastructure with data isolation per tenant, encryption at rest and in transit, and Cloudflare edge security across all deployments. Enterprise clients regularly ask about this — the answer is yes, documented, and available on request." },
  { q: "Can I use IndexFlow as a solo freelancer?", a: "The Solo plan at $99/month is built exactly for you — one workspace, one domain, all 40+ tools. You get the same rank tracker, content engine, on-page auditor, and reporting suite that agencies use, at a price that makes sense for a single operator. When you land your first client, upgrade to Pro." },
  { q: "How many keywords can I track?", a: "1,000 keywords per workspace, tracked weekly. That's significantly more generous than Ahrefs Lite (750 total) or Semrush Starter, both of which cost more than IndexFlow Solo on their own — before you count the 39 other tools you're not paying for separately." },
  { q: "Can I run audits across all client domains at once?", a: "Yes. The SEO Health Dashboard gives you a cross-workspace overview so you can spot which clients have critical issues without logging into each workspace individually. From there you can drill into any domain for a full site crawl, broken link report, redirect chain analysis, and Core Web Vitals breakdown." },
  { q: "What's the difference between Post Validator and On-Page Auditor?", a: "Post Validator scores individual pieces of content before or after publishing — checking keyword density, readability, meta tags, internal links, and schema on a per-post basis. On-Page Auditor runs a broader site-level crawl, identifying issues across all pages at once. Use Post Validator when creating or editing content. Use On-Page Auditor to find what needs fixing across an entire domain." },
];

const faqItemsCol2 = [
  { q: "How many keywords can I track?", a: "1,000 keywords per workspace, tracked weekly. That's significantly more generous than Ahrefs Lite (750 total) or Semrush Starter, both of which cost more than IndexFlow Solo on their own — before you count the 39 other tools you're not paying for separately." },
  { q: "What's the difference between Pro and Agency?", a: "Scale and team size. Pro gives you 3 users and 50 workspaces — ideal for a solo operator or small team managing up to 50 clients. Agency gives you 6 users and 100 workspaces with advanced API access, a dedicated account manager, and priority onboarding — built for teams running serious volume." },
  { q: "Do my clients need their own IndexFlow account?", a: "No. You manage everything from your single login. Each client gets access to their own white-labelled workspace — which looks like your platform to them. They never create an IndexFlow account, never see IndexFlow branding, and never know what infrastructure is running underneath." },
  { q: "How long does it take to set up a client workspace?", a: "Most workspaces are live in under 10 minutes. Connect the domain, configure white label branding, connect Google Search Console, and you're ready to run audits, track keywords, and generate content. The setup guide walks you through every step. No guesswork." },
  { q: "Do I need technical skills or a developer?", a: "No. IndexFlow is built for agency owners and freelancers, not developers. The Cloudflare and GitHub pipeline runs automatically in the background — you never touch code. If you can use a dashboard, you can run IndexFlow. The only exception is Enterprise custom integrations, which may involve developer configuration." },
  { q: "Is there an onboarding guide or setup wizard?", a: "Yes. Every account includes a built-in Setup Guide that walks you through connecting your first domain, configuring white label branding, linking Google Search Console, setting up your rank tracker, and generating your first content batch. Pro and Agency plans also get a priority onboarding call with the team." },
  { q: "Can I import existing content or keywords?", a: "Yes. You can import keyword lists directly into the Rank Tracker via CSV — up to 1,000 keywords per workspace. Existing content on connected CMS platforms is automatically detected and available for auditing, optimisation, and internal link building from day one." },
  { q: "What AI models power the content engine?", a: "IndexFlow supports multiple AI providers via BYOK — OpenAI (GPT-4o), Anthropic (Claude), Google AI, Grok, Mistral, Cohere, and Perplexity. Connect your own API key for whichever provider you prefer. No lock-in to a single model — use the one that suits your content quality and cost requirements." },
  { q: "Can I set a brand voice or tone for each client?", a: "Yes. Each workspace supports its own AI training via the Knowledge Base — upload brand guidelines, tone of voice documents, example content, or industry-specific context. The AI uses this to generate content that sounds like your client, not like a generic language model." },
  { q: "What are quality gates and how do they work?", a: "Quality gates are automatic checks that run on every piece of AI-generated content before it's published. They verify minimum word count, keyword inclusion, readability score, meta title and description presence, image alt text, and schema markup. Content that doesn't pass is flagged for review rather than published automatically. It's the difference between bulk content and bulk quality content." },
  { q: "Can I use my own HTML templates for content?", a: "Yes. Import your own HTML design and use it as the template for programmatic content generation — your layout, your styling, your structure. IndexFlow populates it with AI-generated, SEO-optimised content at scale. Perfect for service area pages, location pages, and product descriptions." },
  { q: "Does it generate images automatically?", a: "Yes. Connect your image bank via BYOK — Unsplash, Pexels, or Pixabay — and IndexFlow automatically selects and inserts contextually relevant images into generated content. Alt text is written automatically based on image context and keyword targeting. No manual image sourcing, no missing alt tags." },
  { q: "What does Enterprise include?", a: "Unlimited workspaces, unlimited domains, custom API integrations, dedicated infrastructure, Super Admin dashboard, named account manager, SLA guarantees, custom contracts, and co-marketing options. Pricing starts around $1,200/month on annual contracts." },
  { q: "Can team members have different permission levels?", a: "Yes. You control what each team member can see and do across workspaces. Assign roles so staff can manage their own client accounts without accessing others. The Agency plan supports 6 users, Enterprise is unlimited with full Super Admin controls." },
  { q: "Can I manage different clients without them seeing each other's data?", a: "Completely. Every client lives in their own isolated workspace — separate content, separate rankings, separate CRM, separate reports. There is zero crossover between workspaces. One client can never see, access, or be affected by another." },
  { q: "What reporting can I send to clients automatically?", a: "You can schedule automated branded reports covering rank tracking, local search grid results, on-page SEO health, indexing status, content performance, and GSC data. Reports go out under your brand on your schedule — weekly, monthly, or on demand. Clients get a polished PDF that looks like you spent hours on it. You didn't." },
  { q: "Can clients log into their own IndexFlow dashboard?", a: "No — and that's intentional. Only you control the IndexFlow workspace. If you're deploying programmatic content via IndexFlow's LLM engine, you manage what gets published. If your client's domain is on WordPress, Shopify, Wix, or another CMS, they already have back-end access to their own website as normal — IndexFlow just handles the SEO delivery layer on top of it." },
  { q: "How fast does Google index content published through IndexFlow?", a: "Typically within hours, not weeks. IndexFlow includes Google Indexing Automation that submits new and updated pages directly to Google's indexing API on publish. Most platforms leave pages to be discovered by Googlebot on its own schedule — which can take weeks. IndexFlow skips the queue." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 cursor-pointer" onClick={() => setOpen(!open)} data-testid={`faq-item-${q.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}>
      <div className="flex items-start justify-between gap-4 py-5">
        <span className="font-bold text-sm text-foreground leading-snug">{q}</span>
        <span className={`text-primary text-xl font-light flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      <div className={`text-sm text-muted-foreground leading-relaxed overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] pb-5" : "max-h-0"}`}>
        {a}
      </div>
    </div>
  );
}

export default function Home2() {
  useEffect(() => {
    document.title = "IndexFlow — The Agency Operating System";
  }, []);

  return (
    <Layout>
      <SEO {...seoData.home} structuredData={combinedHomeSchema} />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12 py-32 overflow-hidden" data-testid="hero-section">
        <HeroVideo />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 border border-yellow-300/40 text-yellow-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide mb-9 animate-[pulse_4s_ease-in-out_infinite] backdrop-blur-sm shadow-lg shadow-yellow-400/20" data-testid="hero-badge">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            40+ SEO Tools · One Platform · Zero Middlemen
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-2xl px-8 sm:px-14 py-10 sm:py-14">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-none tracking-tight max-w-4xl mb-7 text-white" data-testid="hero-heading">
              The revenue chain<br />
              <span className="text-primary">belongs to you.</span><br />
              <span className="text-white/40">Not your tools.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light mx-auto" data-testid="hero-sub">
              IndexFlow is the <strong className="text-white font-semibold">white label agency operating system</strong> built for solo founders and agency owners who are done feeding margin to platforms that take a cut of everything. <strong className="font-semibold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">One login. 40+ tools.</strong> Your brand. Your price. Your profit.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <Link href="/contact">
                <Button size="lg" className="text-base px-8 py-4 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 font-bold" data-testid="btn-hero-trial">
                  30 Day Trial — $1 &nbsp;→&nbsp; I Want This!
                </Button>
              </Link>
              <Link href="#tools">
                <Button size="lg" variant="outline" className="text-base px-8 py-4 border-white/30 text-white hover:border-primary/50 hover:bg-white/10" data-testid="btn-hero-tools">
                  See All 40+ Tools
                </Button>
              </Link>
            </div>
            <p className="text-xs text-white/50" data-testid="hero-note">No contracts · No setup fees · Cancel anytime</p>
            <p className="text-sm text-white/60 italic mt-3" data-testid="hero-strapline">Try the full platform for 30 days. Just $1 today — then choose your plan.</p>
          </div>

          {/* Hero Stats */}
          <FadeIn className="mt-14 w-full max-w-3xl">
            <div className="flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-lg flex-wrap sm:flex-nowrap gap-6 sm:gap-0" data-testid="hero-stats">
              {[
                { num: "11+", label: "Tools Replaced" },
                { num: "40+", label: "Built-in Tools" },
                { num: "5", label: "CMS Integrations" },
                { num: "1 Login", label: "Everything Connected" },
              ].map((s, i, arr) => (
                <div key={i} className="flex items-center">
                  <div className="text-center px-4 sm:px-6">
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{s.num}</div>
                    <div className="text-[11px] text-white/50 font-medium uppercase tracking-wide mt-1">{s.label}</div>
                  </div>
                  {i < arr.length - 1 && <div className="hidden sm:block w-px h-10 bg-white/20 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-t border-b border-border bg-accent/20 py-4 overflow-hidden" data-testid="marquee-section">
        <div className="flex gap-14 animate-[marquee_28s_linear_infinite] whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] flex items-center gap-2.5 flex-shrink-0">
              <span className="text-red-500 text-[9px]">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* DASHBOARD SCREENSHOT */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-background via-accent/5 to-background" data-testid="dashboard-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">The Platform</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Everything in <em className="text-muted-foreground/50 italic">one dashboard.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">
              Content Score. Keyword Rankings. Pipeline Value. AI Interactions. Health Scores. Recent Activity. All your clients — one login, your brand.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="bg-muted/50 px-4 py-3 flex items-center gap-3 border-b border-border">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-card border border-border rounded-md px-4 py-1 text-xs text-muted-foreground max-w-xs">
                  app.youragency.com/dashboard
                </div>
              </div>
              <div className="bg-card p-8 sm:p-12 text-center">
                <div className="text-muted-foreground text-sm">
                  <img src={indexFlowLogo} alt="IndexFlow Dashboard" className="h-10 mx-auto mb-4 opacity-60" />
                  <p>Dashboard preview — your brand, your data, your clients</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="dash-callouts">
              {[
                { num: "92/100", label: "Content Score — quality gated, auto-tracked", color: "bg-primary/10 text-primary" },
                { num: "#6", label: "Keyword Rank Avg — 1,000 keywords weekly", color: "bg-green-500/10 text-green-600" },
                { num: "$34.2k", label: "Pipeline Value — full funnel CRM tracking", color: "bg-purple-500/10 text-purple-600" },
                { num: "194", label: "AI Interactions — widget chats + Twilio calls", color: "bg-orange-500/10 text-orange-600" },
              ].map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
                  <span className={`font-extrabold text-xl px-3 py-2 rounded-lg flex-shrink-0 ${c.color}`}>{c.num}</span>
                  <span className="text-xs text-muted-foreground leading-snug">{c.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* PAIN */}
      <section className="py-20 lg:py-24 bg-accent/20" data-testid="pain-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">The Pain Problem</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">Sound familiar?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Most agencies waste hours every day dealing with these problems. There's a better way.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {painCards.map((c, i) => (
                <div key={i} className="bg-card p-8 sm:p-10 hover:bg-accent/30 transition-colors" data-testid={`pain-card-${i}`}>
                  <span className="text-3xl mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 lg:py-24" data-testid="solution-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">The Solution</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              One platform, <em className="text-muted-foreground/50 italic">everything connected.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Stop switching between tools. IndexFlow brings it all together — content, SEO, CRM, invoicing, publishing, and reporting in one dashboard under your brand.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {solutionCards.map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 transition-all shadow-sm" data-testid={`solution-card-${i}`}>
                  <span className="text-2xl mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn className="text-center mt-12">
            <p className="text-muted-foreground text-base mb-6">Ready to consolidate your stack? One platform. One bill. Everything connected.</p>
            <Link href="/contact">
              <Button size="lg" className="text-base px-8 py-4">Start Your Free Trial →</Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* 40+ TOOLS */}
      <section className="py-20 lg:py-24 bg-accent/20" id="tools" data-testid="tools-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">Everything In The Box</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              40+ tools. <em className="text-muted-foreground/50 italic">One subscription.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">No feature gating. Every tier gets the full suite. Here's exactly what you get from day one.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {toolCategories.map((cat, i) => (
                <div key={i} className="bg-card p-7 hover:bg-accent/30 transition-colors" data-testid={`tools-cat-${i}`}>
                  <div className="font-bold text-sm mb-4 pb-3 border-b border-border">{cat.label}</div>
                  <ul className="space-y-0">
                    {cat.items.map((item, j) => (
                      <li key={j} className="text-xs text-muted-foreground py-1.5 border-b border-border/30 last:border-b-0 flex items-start gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                        <span>{item.bold ? <strong className="text-foreground font-medium">{item.text}</strong> : item.text}{item.suffix || ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn className="mt-3">
            <div className="flex items-center gap-5 bg-primary/5 border border-primary/20 rounded-xl p-6" data-testid="tools-total">
              <span className="text-5xl font-extrabold text-primary tracking-tight leading-none">40+</span>
              <span className="text-sm text-muted-foreground leading-snug">
                tools across 8 categories — content · SEO · CRM · AI · comms · analytics · white label · admin
                <span className="text-xs mt-1 block">Solo · Pro · Agency · Enterprise — every plan, full access</span>
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHAT YOU REPLACE */}
      <section className="py-20 lg:py-24" data-testid="replace-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">What You Replace</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              One login <em className="text-muted-foreground/50 italic">instead of eleven.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">See exactly what IndexFlow replaces in your current stack.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {replaceItems.map((r, i) => (
                <div key={i} className="bg-card p-6 hover:bg-accent/30 transition-colors" data-testid={`replace-card-${i}`}>
                  <span className="text-xs text-muted-foreground line-through block mb-1.5">{r.before}</span>
                  <span className="text-sm font-semibold text-foreground">
                    <span className="text-primary mr-1">→</span>{r.after}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* WHO WE SERVE */}
      <section className="py-20 lg:py-24 bg-accent/20" data-testid="serve-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">Who We Serve</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Built for agencies <em className="text-muted-foreground/50 italic">& teams.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Whether you're a solo freelancer or a 50-person agency — IndexFlow scales with you.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {serveCards.map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-7 text-center hover:border-primary/40 hover:shadow-md transition-all" data-testid={`serve-card-${i}`}>
                  <span className="text-3xl mb-3 block">{c.icon}</span>
                  <h3 className="font-bold text-base mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-24" data-testid="steps-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">Pipeline</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              How IndexFlow <em className="text-muted-foreground/50 italic">works.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">From domain connection to ranking reports in four simple steps.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {steps.map((s, i) => (
                <div key={i} className="bg-card p-8 sm:p-10 hover:bg-accent/30 transition-colors" data-testid={`step-card-${i}`}>
                  <div className="text-5xl font-extrabold text-primary/15 tracking-tight mb-4 leading-none">{s.num}</div>
                  <h3 className="font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* CONTENT LIFECYCLE */}
      <section className="py-20 lg:py-24 bg-accent/20" data-testid="lifecycle-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">End-to-End</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              The complete <em className="text-muted-foreground/50 italic">content lifecycle.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">From first draft to performance report — every stage managed in one platform.</p>
          </FadeIn>
          <FadeIn>
            <div className="flex flex-col lg:flex-row items-stretch gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {lifecycleSteps.map((s, i) => (
                <div key={i} className="bg-card p-7 flex-1 text-center hover:bg-accent/30 transition-colors relative" data-testid={`lifecycle-step-${i}`}>
                  <span className="text-2xl mb-3 block">{s.icon}</span>
                  <h3 className="font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  {i < lifecycleSteps.length - 1 && (
                    <span className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-lg z-10">→</span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="py-20 lg:py-24 bg-[#0D1B2A]" data-testid="infra-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Infrastructure</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 text-white">
              Built on enterprise <em className="text-white/30 italic">infrastructure.</em>
            </h2>
            <p className="text-lg text-white/50 max-w-xl mb-14 leading-relaxed">SOC 2 compliant. Cloudflare edge. GitHub pipeline. The infrastructure Fortune 500 companies pay millions for — available from $99/month.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {infraCards.map((c, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-8" data-testid={`infra-card-${i}`}>
                  <span className="text-2xl mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2 text-white">{c.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY INDEXFLOW */}
      <section className="py-20 lg:py-24" id="compare" data-testid="why-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">Why Choose IndexFlow</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              The agency <em className="text-muted-foreground/50 italic">operating system.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Everything you need to run content, SEO, and client management from one place.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyCards.map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-7 text-center hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all shadow-sm" data-testid={`why-card-${i}`}>
                  <span className="text-3xl mb-3 block">{c.icon}</span>
                  <h3 className="font-bold text-base mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* COMPARE */}
          <FadeIn className="mt-20">
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">The Honest Comparison</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Not a competitor. <em className="text-muted-foreground/50 italic">A correction.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">The revenue chain belongs to you — not your tools, not your platform, not anyone upstream.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px rounded-2xl overflow-hidden" data-testid="compare-section">
              <div className="bg-red-500/5 border border-red-500/15 p-8 sm:p-10 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                <p className="text-[11px] font-bold tracking-[3px] uppercase text-red-500 mb-5">The Old Way</p>
                <h3 className="font-bold text-xl mb-5">All-in-one platforms</h3>
                <ul className="space-y-3">
                  {compareOld.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground border-b border-border/20 pb-3 last:border-b-0">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-8 sm:p-10 rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none lg:border-l-0">
                <p className="text-[11px] font-bold tracking-[3px] uppercase text-primary mb-5">IndexFlow</p>
                <h3 className="font-bold text-xl mb-5">The agency operating system</h3>
                <ul className="space-y-3">
                  {compareNew.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground border-b border-border/20 pb-3 last:border-b-0">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-24 bg-accent/20" data-testid="testimonials-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">Results</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-14">
              What our clients <em className="text-muted-foreground/50 italic">say.</em>
            </h2>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-7 shadow-sm hover:shadow-lg transition-shadow" data-testid={`testi-card-${i}`}>
                  <div className="text-yellow-400 text-base tracking-wider mb-4">★★★★★</div>
                  <p className="text-sm text-foreground leading-relaxed italic mb-5">{t.quote}</p>
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground block font-semibold not-italic">{t.author}</strong>
                    {t.role}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 lg:py-24" id="pricing" data-testid="pricing-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">Simple Pricing</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Plans that scale <em className="text-muted-foreground/50 italic">with you.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Start small, grow without limits. No contracts, cancel anytime. Every plan includes all 40+ tools.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pricingPlans.map((p, i) => (
                <div key={i} className={`relative bg-card border rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${p.featured ? "border-primary bg-primary/5 shadow-md" : "border-border shadow-sm"}`} data-testid={`pricing-card-${p.tier.toLowerCase()}`}>
                  {p.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-[2px] px-3 py-1 rounded-full uppercase">Most Popular</span>
                  )}
                  <p className={`text-xs font-bold tracking-[3px] uppercase mb-3 ${p.featured ? "text-primary" : "text-muted-foreground"}`}>{p.tier}</p>
                  <div className={`text-5xl font-extrabold tracking-tight leading-none mb-1 ${p.isCustom ? "text-3xl" : ""}`}>
                    {!p.isCustom && <sup className="text-xl align-top">$</sup>}
                    {p.isCustom ? "Custom" : p.price.replace("$", "")}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{p.period}</p>
                  <p className="text-xs italic text-muted-foreground mb-5 pb-5 border-b border-border leading-snug">{p.tagline}</p>
                  <ul className="space-y-0 mb-6">
                    {p.features.map((f, j) => (
                      <li key={j} className="text-xs text-muted-foreground py-2 border-b border-border/30 last:border-b-0 flex items-start gap-2">
                        <span className="text-primary text-[11px] mt-0.5 flex-shrink-0">→</span>
                        <span dangerouslySetInnerHTML={{ __html: f.replace(/^([^—]+)/, (m) => m.includes("user") || m.includes("workspace") || m.includes("AI posts") || m.includes("Unlimited") || m.includes("Bulk") || m.includes("Full white") ? `<strong class="text-foreground font-medium">${m}</strong>` : m) }} />
                      </li>
                    ))}
                  </ul>
                  <Link href={p.tier === "Enterprise" ? "/contact" : "/contact"}>
                    <button className={`w-full text-center py-3 rounded-lg text-sm font-semibold transition-all ${p.featured ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30" : "border border-primary/30 text-primary hover:bg-primary/5 hover:border-primary"}`} data-testid={`pricing-btn-${p.tier.toLowerCase()}`}>
                      {p.cta}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn className="text-center mt-8">
            <Link href="/contact">
              <Button size="lg" className="text-base px-8 py-4">Start Free Trial →</Button>
            </Link>
            <p className="text-muted-foreground text-xs mt-4">No contracts. No setup fees. Start your free trial today.</p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24 bg-accent/20" id="faq" data-testid="faq-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-red-500 mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Common <em className="text-muted-foreground/50 italic">questions.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">
              Everything you need to know before you start. Still have questions? <Link href="/contact" className="text-primary hover:underline">Ask us directly →</Link>
            </p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
              <div>
                {faqItemsCol1.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
              </div>
              <div>
                {faqItemsCol2.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 lg:py-40 text-center relative overflow-hidden bg-gradient-to-br from-[#0D1B2A] to-[#1A3A52]" data-testid="cta-section">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Get Started</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 text-white">
              Stop feeding the machine.<br />
              <em className="text-white/30 italic">Start owning the revenue.</em>
            </h2>
            <p className="text-lg text-white/50 max-w-md mx-auto mb-12">
              30-day free trial on Pro. No credit card. No commitment. Just 30 days to prove it pays for itself.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact">
                <Button size="lg" className="text-base px-8 py-4 shadow-lg shadow-primary/30">Start Free Trial — Pro Tier →</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-base px-8 py-4 border-white/20 text-white hover:bg-white/5">Book a Demo</Button>
              </Link>
            </div>
          </FadeIn>
          <FadeIn className="mt-14">
            <div className="flex flex-wrap justify-center gap-12">
              {[
                { num: "40+", label: "Built-in tools" },
                { num: "$99", label: "Starting price" },
                { num: "5 CMS", label: "Integrations" },
                { num: "30 days", label: "Free trial" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-extrabold text-primary tracking-tight">{s.num}</div>
                  <div className="text-xs text-white/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MARQUEE KEYFRAMES */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </Layout>
  );
}
