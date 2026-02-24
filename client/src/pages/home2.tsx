import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, X, ChevronDown, FolderOpen, ClipboardList, BarChart3, Link2, FileText, Key, PenTool, Search, Rocket, Users, Receipt, Tag, Globe, Settings, Lock, Plug, Bot, TrendingUp, Megaphone, Laptop, RefreshCw, Wrench, Layers, ShieldCheck, Phone } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.webp";
import clientDashImg from "@assets/client_dash_1771696909138.webp";
import wixLogo from "@assets/image_1771707999263.png";
import { colorShadows } from "@/lib/color-shadows";
import { SiWordpress, SiShopify, SiSquarespace, SiWebflow, SiGhost, SiReplit, SiCloudflare, SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO, seoData, combinedHomeSchema } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

function HeroVideo() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <img
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div
        className="absolute inset-0"
        style={{ opacity: iframeLoaded ? 1 : 0, transition: "opacity 4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <iframe
          src="https://player.vimeo.com/video/1165788581?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1&playsinline=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          loading="eager"
          onLoad={() => setTimeout(() => setIframeLoaded(true), 2000)}
          className="absolute"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "177.78vh", minWidth: "100%", height: "56.25vw", minHeight: "100%", border: 0 }}
          title="indexFlow"
          data-testid="hero-video"
        />
      </div>
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
  "Content Engine | Deploy to LLM | CMS instantly",
  "Pages | Posts | Articles | Listicles",
  "Link Builder | Internal | External",
  "Post Validator | On-Page Auditor | Site Profiler",
  "Schema Markup Generator",
  "Rank Tracker | Local Search Grid | GSC Ingestion Layer",
  "Competitor Keyword Spy",
  "SERP Preview Tool",
  "Keyword Gap Analysis",
  "CRM | Pipeline | Lead to Booking",
  "AI Website Widget",
  "Twilio Voice SMS",
  "BYOK AI Connections",
  "Image Bank (ai)",
  "White Label Branding",
  "Client Reports",
  "Invoice engine powered by Stripe/Paypal",
];

const painCards = [
  { icon: <FolderOpen className="w-7 h-7 text-rose-500" />, title: "12 Browser Tabs Open", desc: "You're juggling Ahrefs, Jasper, HubSpot, FreshBooks, and 8 other tools just to do your job." },
  { icon: <ClipboardList className="w-7 h-7 text-amber-500" />, title: "Copy-Pasting Between Tools", desc: "Write in Google Docs, paste into WordPress, reformat, re-add images, manually paste JSON-LD." },
  { icon: <BarChart3 className="w-7 h-7 text-emerald-500" />, title: "Spreadsheet CRM", desc: "Tracking leads in Google Sheets. Losing deals because you forgot to follow up." },
  { icon: <Link2 className="w-7 h-7 text-violet-500" />, title: "Manual Internal Links", desc: "Going back to add links to old posts. No system for orphan pages or broken links." },
  { icon: <FileText className="w-7 h-7 text-sky-500" />, title: "Building Reports Manually", desc: "Spending Friday pulling data from four tools into a PowerPoint for client presentations." },
  { icon: <Key className="w-7 h-7 text-orange-500" />, title: "Juggling API Keys", desc: "Hunting through five dashboards to update an expired key or check usage." },
];

const solutionCards = [
  { icon: <PenTool className="w-7 h-7 text-primary" />, title: "Programmatic Content Engine", desc: "Bulk AI drafts with quality gates, stock images with auto alt text, schema markup auto-detection. Deploy thousands of SEO-optimised articles automatically to client domains." },
  { icon: <Search className="w-7 h-7 text-primary" />, title: "SEO Tools Suite", desc: "Rank Tracker, Local Search Grid (5x5), On-Page Auditor, Link Builder, Post Validator — all built in. 1,000 keywords tracked weekly." },
  { icon: <Rocket className="w-7 h-7 text-primary" />, title: "CMS Integration", desc: "Publish to WordPress, Shopify, Webflow, Ghost, or Wix with one click. Formatted perfectly. No copy-paste, no reformatting." },
  { icon: <Users className="w-7 h-7 text-primary" />, title: "Lead to Booking CRM", desc: "Full-funnel attribution from organic impression to booked appointment. Contacts, deals, customisable kanban stages. Every workspace has its own isolated CRM." },
  { icon: <Receipt className="w-7 h-7 text-primary" />, title: "Invoicing & Reports", desc: "Line items, multi-currency, status tracking. Content and SEO reports with saved snapshots. Client-ready in minutes, not hours." },
  { icon: <Tag className="w-7 h-7 text-primary" />, title: "White-Label Deployment", desc: "Deploy across unlimited client domains via Cloudflare's edge network. Custom SSL, zero downtime. Your logo, your domain, your brand. Bring your own API keys." },
];

const toolCategories = [
  {
    icon: <PenTool className="w-4 h-4 inline-block mr-1.5" />, label: "Programmatic Content Engine",
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
    icon: <Search className="w-4 h-4 inline-block mr-1.5" />, label: "SEO Tools",
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
    icon: <TrendingUp className="w-4 h-4 inline-block mr-1.5" />, label: "Rank Tracker",
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
    icon: <Users className="w-4 h-4 inline-block mr-1.5" />, label: "CRM & Pipeline",
    items: [
      { text: "Lead to Booking CRM" },
      { text: "Contacts Manager" },
      { text: "Deal Pipeline (Kanban)" },
      { text: "Full-Funnel Attribution" },
    ],
  },
  {
    icon: <Bot className="w-4 h-4 inline-block mr-1.5" />, label: "AI & Communications",
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
    icon: <Plug className="w-4 h-4 inline-block mr-1.5" />, label: "Connections (BYOK)",
    items: [
      { text: "AI Provider Connections" },
      { text: "Image Bank Connections" },
      { text: "Payment Connections" },
      { text: "Twilio Account Connection" },
    ],
  },
  {
    icon: <BarChart3 className="w-4 h-4 inline-block mr-1.5" />, label: "Analytics & Reporting",
    items: [
      { text: "Analytics Overview" },
      { text: "Export Data" },
      { text: "SEO Reports with snapshots" },
      { text: "Invoicing — line items, multi-currency" },
    ],
  },
  {
    icon: <Settings className="w-4 h-4 inline-block mr-1.5" />, label: "Settings & Admin",
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
  { icon: <TrendingUp className="w-7 h-7 text-primary" />, title: "SEO Agencies", desc: "Rank tracking, local search grids, on-page audits, GSC Ingestion Layer" },
  { icon: <PenTool className="w-7 h-7 text-primary" />, title: "Content Agencies", desc: "Bulk AI drafts, quality gates, CMS publishing, content reporting" },
  { icon: <Megaphone className="w-7 h-7 text-primary" />, title: "Digital Marketing Agencies", desc: "Full-service SEO, content, CRM, invoicing and reporting" },
  { icon: <Laptop className="w-7 h-7 text-primary" />, title: "Freelancers & Consultants", desc: "Professional tools at solo pricing. White label from day one." },
];

const steps = [
  { num: "01", title: "Connect Client Domains", desc: "Add your client's domain and configure Cloudflare Custom Hostnames for instant SSL provisioning." },
  { num: "02", title: "Generate Content", desc: "Use templates or import your HTML design to generate thousands of SEO-optimised service pages or blog articles targeting local and long-tail keywords." },
  { num: "03", title: "Deploy to Edge", desc: "Content deploys via GitHub to Cloudflare Pages. Zero-config, instant global distribution." },
  { num: "04", title: "Track & Optimise", desc: "Monitor rankings, analyse Local Search Grids, and attribute leads through the full funnel." },
];

const lifecycleSteps = [
  { icon: <PenTool className="w-6 h-6 text-primary" />, title: "Create", desc: "AI-powered bulk content generation with quality gates" },
  { icon: <Search className="w-6 h-6 text-primary" />, title: "Optimise", desc: "On-page SEO audits, schema markup, internal linking" },
  { icon: <Rocket className="w-6 h-6 text-primary" />, title: "Publish", desc: "One-click publish to 5 CMS platforms" },
  { icon: <TrendingUp className="w-6 h-6 text-primary" />, title: "Monitor", desc: "Rank tracking, local search grid, GSC ingestion" },
  { icon: <BarChart3 className="w-6 h-6 text-primary" />, title: "Report", desc: "Content & SEO reports with saved snapshots" },
];

const infraCards = [
  { icon: <SiCloudflare className="w-7 h-7 text-[#F6821F]" />, title: "Cloudflare Edge", desc: "Global CDN with Custom Hostnames and automatic SSL provisioning for every client domain. Zero downtime, global performance." },
  { icon: <SiGithub className="w-7 h-7 text-white" />, title: "GitHub Pipeline", desc: "Automated Git-based deployments. Push content, it's live globally within seconds. No config, no DevOps required." },
  { icon: <Lock className="w-7 h-7 text-primary" />, title: "Enterprise Security", desc: "SOC 2 compliant infrastructure. Data isolation per tenant, encrypted at rest and in transit." },
];

const whyCards = [
  { icon: <Plug className="w-7 h-7 text-primary" />, title: "One Platform", desc: "Stop juggling tools. Content, SEO, CRM, invoicing, publishing — all connected. All in a single place." },
  { icon: <Tag className="w-7 h-7 text-primary" />, title: "White Label Ready", desc: "Your brand, your domain, your clients. They never see IndexFlow. 100% of the revenue chain belongs to you." },
  { icon: <Bot className="w-7 h-7 text-primary" />, title: "AI-Powered at Scale", desc: "Generate 40 service pages/posts per workspace = one domain every month. Quality gates enforce standards automatically." },
  { icon: <RefreshCw className="w-7 h-7 text-primary" />, title: "Full Lifecycle Coverage", desc: "Create, optimise, publish, monitor, report. Before and after publishing." },
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

function DashboardPreview() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10" data-testid="dashboard-preview">
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
      <div className="relative bg-card">
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[2000px]" : "max-h-[400px]"}`}>
          <img src={clientDashImg} alt="IndexFlow Client Dashboard" className="w-full h-auto" />
        </div>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
        )}
        <div className={`${expanded ? "mt-0" : "absolute bottom-4 left-0 right-0"} flex justify-center z-10`}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            data-testid="btn-expand-dashboard"
          >
            {expanded ? "Collapse" : "Expand Full Dashboard"}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
        {expanded && <div className="h-4" />}
      </div>
    </div>
  );
}

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
      <section className="relative flex flex-col items-center justify-center text-center px-6 sm:px-12 pt-12 sm:py-32 pb-4 sm:pb-32 overflow-hidden" data-testid="hero-section">
        <HeroVideo />

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="bg-black/12 sm:bg-black/25 backdrop-blur-sm sm:backdrop-blur-md rounded-2xl px-6 sm:px-14 py-6 sm:py-14 w-full max-w-4xl text-center mx-auto">
            <h1 className="text-[1.5rem] sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] sm:leading-none tracking-tight max-w-4xl mx-auto mb-4 sm:mb-7 text-white" data-testid="hero-heading">
              The revenue chain<br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">belongs to you.</span><br />
              <span className="text-white/40">Not your Seo tools.</span>
            </h1>

            <p className="text-[13px] sm:text-xl text-white/70 max-w-xl mb-4 sm:mb-6 leading-snug sm:leading-relaxed font-light mx-auto" data-testid="hero-sub">
              <strong className="text-white font-semibold">White Label operating system</strong><br /><em className="italic">for</em> Solo teams & Agency owners.
            </p>

            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Link href="/contact">
                <Button size="sm" className="text-[11px] sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-400 hover:via-blue-400 hover:to-indigo-400 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5 font-bold h-auto gap-1.5" data-testid="btn-hero-trial">
                  <Rocket className="w-3.5 h-3.5" /> 30 Day Trial $1
                </Button>
              </Link>
              <Link href="#tools">
                <Button size="sm" variant="outline" className="text-[11px] sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 border-white/30 text-white bg-white/15 backdrop-blur-sm hover:bg-white/25 hover:border-white/50 gap-1.5 h-auto" data-testid="btn-hero-tools">
                  <Phone className="w-3.5 h-3.5" /> Discovery Call
                </Button>
              </Link>
            </div>
            <p className="text-[11px] sm:text-sm text-white font-medium mb-3 sm:mb-5" data-testid="hero-note">No contracts · No setup fees · Cancel anytime</p>

            <FadeIn className="w-full">
              <div className="flex justify-center w-full" data-testid="hero-stats-slim">
                <div className="relative border border-white/15 rounded-full px-4 sm:px-8 py-1.5 sm:py-2.5 inline-flex">
                  <div className="flex items-center justify-center gap-x-2 sm:gap-x-5 text-[9px] sm:text-[13px] font-semibold tracking-wider sm:tracking-[0.15em] text-white whitespace-nowrap uppercase">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]" />
                      40+ SEO Tools
                    </span>
                    <span className="text-white/20 text-[6px] sm:text-[8px]">|</span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-sky-300 drop-shadow-[0_0_4px_rgba(125,211,252,0.6)]" />
                      One Subscription
                    </span>
                    <span className="text-white/20 text-[6px] sm:text-[8px]">|</span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                      Zero Middlemen
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="pt-10 sm:pt-14 pb-20 lg:pb-24 bg-gradient-to-br from-background via-accent/5 to-background" data-testid="dashboard-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">The Platform</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Everything in <em className="text-muted-foreground/50 italic">one dashboard.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">
              Content Score. Keyword Rankings. Pipeline Value. AI Interactions. Health Scores. Recent Activity. All your clients — one login, your brand.
            </p>
          </FadeIn>

          <FadeIn>
            <DashboardPreview />
          </FadeIn>

          <FadeIn className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="dash-callouts">
              {[
                { num: "92/100", label: "Content Score — quality gated, auto-tracked", color: "bg-primary/10 text-primary" },
                { num: "#6", label: "Keyword Rank Avg — 1,000 keywords weekly", color: "bg-green-500/10 text-green-600" },
                { num: "$34.2k", label: "Pipeline Value — full funnel CRM tracking", color: "bg-purple-500/10 text-purple-600" },
                { num: "194", label: "AI Interactions — widget chats + Twilio calls", color: "bg-orange-500/10 text-orange-600" },
              ].map((c, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all ${colorShadows[i % colorShadows.length]}`}>
                  <span className={`font-extrabold text-xl px-3 py-2 rounded-lg flex-shrink-0 ${c.color}`}>{c.num}</span>
                  <span className="text-xs text-muted-foreground leading-snug">{c.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-t border-b border-border bg-accent/20 py-3 overflow-hidden" data-testid="marquee-section">
        <div className="flex flex-col gap-3">
          <div className="home-ticker-row-1 flex whitespace-nowrap will-change-transform">
            {[...marqueeItems.slice(0, 9), ...marqueeItems.slice(0, 9), ...marqueeItems.slice(0, 9), ...marqueeItems.slice(0, 9)].map((item, i) => (
              <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] inline-flex items-center flex-shrink-0 mx-7">
                <span className="text-primary text-[9px] mr-2.5">●</span>
                {item}
              </span>
            ))}
          </div>
          <div className="home-ticker-row-2 flex whitespace-nowrap will-change-transform">
            {[...marqueeItems.slice(9), ...marqueeItems.slice(9), ...marqueeItems.slice(9), ...marqueeItems.slice(9)].map((item, i) => (
              <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] inline-flex items-center flex-shrink-0 mx-7">
                <span className="text-primary text-[9px] mr-2.5">●</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* PAIN */}
      <section className="py-20 lg:py-24 bg-accent/20" data-testid="pain-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">The Pain Problem</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">Sound familiar?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">Multiple tools. Infinite logins. Spiralling costs. 100% Frustration.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
              {[
                { icon: <PenTool className="w-5 h-5 text-muted-foreground" />, label: "Multi Platforms" },
                { icon: <Search className="w-5 h-5 text-muted-foreground" />, label: "Rank Tracking" },
                { icon: <Globe className="w-5 h-5 text-muted-foreground" />, label: "Local Grid Search" },
                { icon: <BarChart3 className="w-5 h-5 text-muted-foreground" />, label: "Reporting Tools" },
                { icon: <Receipt className="w-5 h-5 text-muted-foreground" />, label: "Agency Overheads" },
                { icon: <Key className="w-5 h-5 text-muted-foreground" />, label: "Track Metrics" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-border/50">
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {painCards.map((c, i) => (
                <div key={i} className={`bg-card rounded-xl p-8 sm:p-10 hover:-translate-y-1 transition-all border border-border/50 ${colorShadows[i % colorShadows.length]}`} data-testid={`pain-card-${i}`}>
                  <span className="mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* SOLUTION */}
      <section className="py-20 lg:py-24" data-testid="solution-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">The Solution</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              One platform, <em className="text-muted-foreground/50 italic">everything connected.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Stop switching between tools. IndexFlow brings it all together — content, SEO, CRM, invoicing, publishing, and reporting in one dashboard under your brand.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {solutionCards.map((c, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-8 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`solution-card-${i}`}>
                  <span className="mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* 40+ TOOLS */}
      <section className="py-20 lg:py-24 bg-accent/20" id="tools" data-testid="tools-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Everything In The Box</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              40+ tools. <em className="text-muted-foreground/50 italic">One subscription.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">No feature gating. Every tier gets the full suite. Here's exactly what you get from day one.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {toolCategories.map((cat, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-7 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`tools-cat-${i}`}>
                  <div className="font-bold text-sm mb-4 pb-3 border-b border-border flex items-center">{cat.icon}{cat.label}</div>
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

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* WHAT YOU REPLACE */}
      <section className="py-20 lg:py-24" data-testid="replace-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">What You Replace</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              One login <em className="text-muted-foreground/50 italic">instead of eleven.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">See exactly what IndexFlow replaces in your current stack.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {replaceItems.map((r, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-6 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`replace-card-${i}`}>
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
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Who We Serve</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Built for agencies <em className="text-muted-foreground/50 italic">& solo teams.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Whether you're a solo freelancer or a 50-person agency — IndexFlow scales with you.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serveCards.map((c, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-7 text-center hover:-translate-y-1 transition-all flex flex-col items-center ${colorShadows[i % colorShadows.length]}`} data-testid={`serve-card-${i}`}>
                  <span className="mb-3 block">{c.icon}</span>
                  <h3 className="font-bold text-base mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-24" data-testid="steps-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Pipeline</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              How IndexFlow <em className="text-muted-foreground/50 italic">works.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">From domain connection to ranking reports in four simple steps.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-8 sm:p-10 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`step-card-${i}`}>
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
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">End-to-End</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              The complete <em className="text-muted-foreground/50 italic">content lifecycle.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">From first draft to performance report — every stage managed in one platform.</p>
          </FadeIn>
          <FadeIn>
            <div className="flex flex-col lg:flex-row items-stretch gap-5">
              {lifecycleSteps.map((s, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-7 flex-1 text-center hover:-translate-y-1 transition-all relative flex flex-col items-center ${colorShadows[i % colorShadows.length]}`} data-testid={`lifecycle-step-${i}`}>
                  <span className="mb-3 block">{s.icon}</span>
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

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* CMS PUBLISH */}
      <section className="py-16 lg:py-20" data-testid="cms-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Publish</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
                Instantly to <em className="text-muted-foreground/50 italic">any LLM or CMS.</em>
              </h2>
              <div className="overflow-hidden mt-10">
                <div className="home-ticker-cms flex whitespace-nowrap will-change-transform">
                  {[...Array(6)].flatMap((_, setIndex) => [
                    <span key={`wp-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiWordpress className="w-8 h-8 opacity-40 grayscale" /></span>,
                    <span key={`sh-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiShopify className="w-8 h-8 opacity-40 grayscale" /></span>,
                    <span key={`sq-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiSquarespace className="w-8 h-8 opacity-40 grayscale" /></span>,
                    <span key={`wix-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><img src={wixLogo} alt="Wix" className="w-8 h-8 opacity-40 grayscale object-contain" /></span>,
                    <span key={`wf-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiWebflow className="w-8 h-8 opacity-40 grayscale" /></span>,
                    <span key={`gh-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiGhost className="w-8 h-8 opacity-40 grayscale" /></span>,
                    <span key={`rp-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiReplit className="w-8 h-8 opacity-40 grayscale" /></span>,
                    <span key={`lv-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><svg className="w-8 h-8 opacity-40 grayscale" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></span>,
                  ])}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* INFRASTRUCTURE */}
      <section className="py-20 lg:py-24 bg-[#0D1B2A]" data-testid="infra-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Infrastructure</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 text-white">
              Built on enterprise <em className="text-white/30 italic">infrastructure.</em>
            </h2>
            <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">SOC 2 compliant. Cloudflare edge. GitHub pipeline. The infrastructure Fortune 500 companies pay millions for — available from $99/month.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {infraCards.map((c, i) => (
                <div key={i} className={`bg-white/5 border border-white/10 rounded-xl p-8 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`infra-card-${i}`}>
                  <span className="mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2 text-white">{c.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* WHY INDEXFLOW */}
      <section className="py-20 lg:py-24" id="compare" data-testid="why-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Why Choose IndexFlow</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              The agency <em className="text-muted-foreground/50 italic">operating system.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Everything you need to run content, SEO, and client management from one place.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyCards.map((c, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-7 text-center hover:-translate-y-1 transition-all flex flex-col items-center ${colorShadows[i % colorShadows.length]}`} data-testid={`why-card-${i}`}>
                  <span className="mb-3 block">{c.icon}</span>
                  <h3 className="font-bold text-base mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* COMPARE */}
          <FadeIn className="mt-20">
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">The Honest Comparison</p>
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
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Results</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-14">
              What our clients <em className="text-muted-foreground/50 italic">say.</em>
            </h2>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-7 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`testi-card-${i}`}>
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

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* PRICING */}
      <section className="py-20 lg:py-24" id="pricing" data-testid="pricing-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">Simple Pricing</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Plans that scale <em className="text-muted-foreground/50 italic">with you.</em>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-14 leading-relaxed">Start small, grow without limits. No contracts, cancel anytime. Every plan includes all 40+ tools.</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {pricingPlans.map((p, i) => (
                <div key={i} className={`relative bg-card border rounded-2xl p-7 transition-all hover:-translate-y-1 ${p.featured ? "border-primary bg-primary/5" : "border-border"} ${colorShadows[i % colorShadows.length]}`} data-testid={`pricing-card-${p.tier.toLowerCase()}`}>
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
          <FadeIn className="text-center mt-12">
            <p className="text-muted-foreground text-base mb-6">Ready to consolidate your stack? One platform. One bill. Everything connected.</p>
            <Link href="/contact">
              <Button size="lg" className="text-base px-8 py-4">Start Your Free Trial →</Button>
            </Link>
            <p className="text-muted-foreground text-xs mt-4">No contracts. No setup fees. Start your free trial today.</p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* FAQ */}
      <section className="py-20 lg:py-24 bg-accent/20" id="faq" data-testid="faq-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-4">FAQ</p>
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

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* CTA */}
      <section className="py-32 lg:py-40 text-center relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#112940] to-[#1A3A52]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-8 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-6">Get Started</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
              Stop feeding the machine.<br />
              <span className="bg-gradient-to-r from-primary via-sky-300 to-primary bg-clip-text text-transparent">Start owning the revenue.</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/60 max-w-lg mx-auto mb-12 leading-relaxed font-light">
              30-day free trial on Pro. No credit card. No commitment. Just 30 days to prove it pays for itself.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="text-base px-10 py-5 shadow-xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 transition-all font-bold rounded-xl">
                  Start Free Trial — Pro Tier →
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-base px-10 py-5 border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/40 hover:-translate-y-1 transition-all rounded-xl">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn className="mt-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { num: "40+", label: "Built-in tools", shadow: colorShadows[0] },
                { num: "$99", label: "Starting price", shadow: colorShadows[1] },
                { num: "5 CMS", label: "Integrations", shadow: colorShadows[2] },
                { num: "30 days", label: "Free trial", shadow: colorShadows[3] },
              ].map((s, i) => (
                <div key={i} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:-translate-y-1 transition-all ${s.shadow}`}>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-none">{s.num}</div>
                  <div className="text-[11px] text-white/50 font-medium uppercase tracking-wide mt-2">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-lg text-muted-foreground text-center mt-8">
              Every plan includes the full suite. No feature gating.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* REPLACEMENTS */}
      <section className="py-20 lg:py-24 bg-accent/20">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">What You Replace</h2>
              <p className="text-lg text-muted-foreground">One login instead of eleven.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {replaceItems.map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-all">
                  <span className="text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/40">{r.before}</span>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{r.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-border" />

      {/* WHO WE SERVE */}
      <section className="py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">Who We Serve — IndexFlow scales with you.</h2>
              <p className="text-lg text-muted-foreground">Built for agencies & solo teams.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serveCards.map((c, i) => (
                <div key={i} className={`bg-card border border-border rounded-xl p-8 hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`}>
                  <span className="mb-4 block">{c.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <ClosingCTA />

      {/* MARQUEE KEYFRAMES */}
      <style>{`
        @keyframes homeMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        @keyframes homeMarqueeReverse {
          0% { transform: translate3d(-25%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes homeMarqueeCms {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-16.667%, 0, 0); }
        }
        .home-ticker-row-1 { animation: homeMarquee 40s linear infinite; }
        .home-ticker-row-2 { animation: homeMarqueeReverse 40s linear infinite; }
        .home-ticker-cms { animation: homeMarqueeCms 20s linear infinite; }
        @media (max-width: 640px) {
          .home-ticker-row-1 { animation-duration: 12s; }
          .home-ticker-row-2 { animation-duration: 12s; }
          .home-ticker-cms { animation-duration: 8s; }
        }
      `}</style>
    </Layout>
  );
}
