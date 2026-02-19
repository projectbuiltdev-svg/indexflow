import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Star, CheckCircle, Globe, BarChart3, Zap, Users, FileText, Link2, Layers, Target, PenTool, Shield, Repeat, Search, DollarSign, Eye, ClipboardList, Key } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { CMSPartners } from "@/components/cms-partners";
import { SEO, seoData, combinedHomeSchema } from "@/components/seo";

const problems = [
  {
    icon: Layers,
    title: "12 Browser Tabs Open",
    description: "You're juggling Ahrefs, Jasper, HubSpot, FreshBooks, and 8 other tools just to do your job.",
  },
  {
    icon: Repeat,
    title: "Copy-Pasting Between Tools",
    description: "Write in Google Docs, paste into WordPress, reformat, re-add images, manually paste JSON-LD.",
  },
  {
    icon: ClipboardList,
    title: "Spreadsheet CRM",
    description: "Tracking leads in Google Sheets. Losing deals because you forgot to follow up.",
  },
  {
    icon: Link2,
    title: "Manual Internal Links",
    description: "Going back to add links to old posts. No system for orphan pages or broken links.",
  },
  {
    icon: BarChart3,
    title: "Building Reports Manually",
    description: "Spending Friday pulling data from four tools into a PowerPoint for client presentations.",
  },
  {
    icon: Key,
    title: "Juggling API Keys",
    description: "Hunting through five dashboards to update an expired key or check usage.",
  },
];

const solutions = [
  {
    icon: PenTool,
    title: "Content Engine",
    description: "Bulk AI drafts with quality gates, stock images with auto alt text, schema markup auto-detection.",
  },
  {
    icon: Target,
    title: "SEO Tools Suite",
    description: "Rank Tracker, Local Search Grid, On-Page Auditor, Link Builder, Post Validator — all built in.",
  },
  {
    icon: Globe,
    title: "CMS Integration",
    description: "Publish to WordPress, Shopify, Webflow, Ghost, or Wix with one click. Formatted perfectly.",
  },
  {
    icon: Users,
    title: "CRM & Pipeline",
    description: "Contacts, deals, customizable stages, kanban board. Every workspace has its own isolated CRM.",
  },
  {
    icon: DollarSign,
    title: "Invoicing & Reports",
    description: "Line items, multi-currency, status tracking. Content and SEO reports with saved snapshots.",
  },
  {
    icon: Shield,
    title: "White Label & BYOK",
    description: "Your logo, your domain, your brand. Bring your own API keys for AI, images, and payments.",
  },
];

const stats = [
  { value: "11+", label: "Tools Replaced" },
  { value: "40+", label: "AI Posts/Month" },
  { value: "5", label: "CMS Platforms" },
  { value: "1", label: "Login For Everything" },
];

const audienceTypes = [
  { icon: Search, title: "SEO Agencies", description: "Rank tracking, local search, audits" },
  { icon: FileText, title: "Content Agencies", description: "Bulk AI drafts, quality gates" },
  { icon: BarChart3, title: "Digital Marketing Agencies", description: "Full-service SEO & content" },
  { icon: Users, title: "Freelancers & Consultants", description: "Professional tools, solo pricing" },
];

const replacements = [
  { before: "Ahrefs / SEMrush", after: "Rank Tracker + Local Search Grid" },
  { before: "SurferSEO / Clearscope", after: "Quality Gates + Post Validator" },
  { before: "Jasper / Copy.ai", after: "Content Engine with GPT-4o" },
  { before: "HubSpot / Pipedrive", after: "CRM with Pipeline" },
  { before: "FreshBooks / QuickBooks", after: "Invoicing" },
  { before: "Intercom / Drift", after: "AI Widget" },
  { before: "LinkWhisper", after: "Cross-Post Link Builder" },
  { before: "Screaming Frog", after: "On-Page SEO Auditor" },
];

const pricingTiers = [
  {
    name: "Solo",
    price: "$99",
    period: "/mo",
    features: ["1 user", "1 workspace", "40 AI posts/mo"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "/mo",
    features: ["3 users", "3 workspaces", "Bulk campaigns"],
    highlight: true,
  },
  {
    name: "White Label",
    price: "$499",
    period: "/mo",
    features: ["6 users", "100 workspaces", "Full white label"],
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited everything", "Super Admin Dashboard", "Dedicated support"],
    highlight: false,
  },
];

const testimonials = [
  {
    quote: "We replaced 8 separate tools with IndexFlow. Our team's output doubled and we cut costs by 60%.",
    author: "Sarah Mitchell",
    role: "Founder, Apex Digital Marketing",
    rating: 5,
  },
  {
    quote: "The white-label feature let us launch our own SEO platform in a week. Our clients think we built it.",
    author: "David Park",
    role: "CEO, Greenline Agency",
    rating: 5,
  },
  {
    quote: "Bulk content generation with quality gates changed everything. We went from 10 posts a week to 50.",
    author: "Rachel Torres",
    role: "Content Director, BrightPath Media",
    rating: 5,
  },
];

const whyUs = [
  {
    icon: Layers,
    title: "One Platform",
    description: "Replace 11+ tools. Content, SEO, CRM, invoicing, publishing — all connected.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "White Label Ready",
    description: "Your brand, your domain, your clients. They never see IndexFlow.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "AI-Powered at Scale",
    description: "Generate 40 posts/month per workspace. Quality gates enforce standards automatically.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Repeat,
    title: "Full Lifecycle Coverage",
    description: "Create, optimize, publish, monitor, report. Before and after publishing.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const lifecycleSteps = [
  { icon: PenTool, title: "Create", description: "AI-powered bulk content generation with quality gates" },
  { icon: Target, title: "Optimize", description: "On-page SEO audits, schema markup, internal linking" },
  { icon: Globe, title: "Publish", description: "One-click publish to 5 CMS platforms" },
  { icon: Eye, title: "Monitor", description: "Rank tracking, local search grid, search console" },
  { icon: BarChart3, title: "Report", description: "Content & SEO reports with saved snapshots" },
];


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

export default function Home() {
  useEffect(() => {
    document.title = "indexFlow - All-in-One SEO & Content Platform for Agencies";
  }, []);

  return (
    <Layout>
      <SEO {...seoData.home} structuredData={combinedHomeSchema} />
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/15 z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <div className="inline-block backdrop-blur-sm bg-black/15 rounded-2xl px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-14 mx-2">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-1 bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent drop-shadow-lg">
              Still Paying for 10+ SEO Tools
            </h1>
            <div className="mx-auto w-32 sm:w-40 lg:w-52 h-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 mb-1" />
            <img src={indexFlowLogo} alt="IndexFlow" className="h-7 sm:h-8 lg:h-10 mx-auto mt-8 mb-6 drop-shadow-lg" data-testid="hero-logo" />
            <div className="max-w-3xl mx-auto mb-6 space-y-1">
              <p className="text-[14px] sm:text-base lg:text-lg text-white/90 drop-shadow-lg">
                Create Posts & Pages · On-Page SEO Audits · Automated Schema
              </p>
              <p className="text-[14px] sm:text-base lg:text-lg text-white/90 drop-shadow-lg">
                Deploy to any LLM or CMS Instantly · Resell or power your business
              </p>
              <p className="text-[14px] sm:text-base lg:text-lg text-white/90 drop-shadow-lg">
                Google +AI search (OpenAI · Gemini · Perplexity) · BYOK
              </p>
              <p className="text-[14px] sm:text-base lg:text-lg text-white/90 drop-shadow-lg">
                Smart Internal Linking · Client Reports · Rank Tracking
              </p>
              <p className="text-[14px] sm:text-base lg:text-lg text-white/90 drop-shadow-lg">
                Local SEO Grid · CRM + Pipeline · Stripe & PayPal
              </p>
              <p className="text-[14px] sm:text-base lg:text-lg text-white/90 drop-shadow-lg">
                Twilio Voice · SMS · Website Widget (AI) · Books appt. 24/7
              </p>
            </div>
            <p className="text-[15px] sm:text-lg lg:text-xl max-w-3xl mx-auto mb-4 font-semibold text-white drop-shadow-lg">
              Whitelabel infrastructure · You handle clients
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <Link href="/contact">
                <Button size="default" className="gap-2 sm:text-base text-sm sm:px-4 px-3" data-testid="button-hero-demo">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="default" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 sm:text-base text-sm sm:px-4 px-3" data-testid="button-hero-templates">
                  <span className="italic">from</span> <span className="font-bold">$99</span>/month
                </Button>
              </Link>
            </div>
            <p className="inline-block font-bold text-[17px] sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-[pulse_5s_ease-in-out_infinite]">
              Agencies · SaaS · Ecommerce · Local Businesses · Solo Founders
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 relative overflow-hidden bg-accent/40" data-testid="stats-section">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-0">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center group">
                <div className="text-center px-4 sm:px-8 lg:px-12 transition-transform duration-300 hover:scale-110">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent animate-[fadeInUp_0.6s_ease-out_forwards]" style={{ animationDelay: `${index * 0.15}s`, opacity: 0 }} data-testid={`stat-value-${index}`}>{stat.value}</p>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mt-2" data-testid={`stat-label-${index}`}>{stat.label}</p>
                </div>
                {index < stats.length - 1 && (
                  <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" data-testid="problems-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">The Pain Problem</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sound Familiar?
            </h2>
            <p className="text-muted-foreground">
              Most agencies waste hours every day dealing with these problems.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <Card key={problem.title} className="hover-elevate border-destructive/20" data-testid={`problem-card-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <problem.icon className="w-6 h-6 text-destructive animate-[wiggle_2s_ease-in-out_infinite]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground text-sm">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-accent/40" data-testid="solutions-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">The Solution</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">One Platform, Everything Connected</h2>
            <p className="text-lg lg:text-xl text-muted-foreground mt-4">
              Stop switching between tools. IndexFlow brings it all together.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Card key={solution.title} className="hover-elevate" data-testid={`solution-card-${solution.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <solution.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to consolidate your stack? <span className="font-semibold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">One platform. One bill. Everything connected.</span>
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-solution-cta">
                Start Your Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-border" />
      </div>

      <section className="pt-16 pb-16 lg:pt-24 lg:pb-24 relative overflow-hidden bg-accent/40" data-testid="audience-section">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Who We Serve</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built for Agencies & Teams
            </h2>
            <p className="text-muted-foreground">
              Whether you're a solo freelancer or a 50-person agency — IndexFlow scales with you.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceTypes.map((type) => (
              <Card key={type.title} className="text-center hover-elevate" data-testid={`audience-card-${type.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                    <type.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" data-testid="replacements-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">What You Replace</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">One Login Instead of Eleven</h2>
            <p className="text-muted-foreground">
              See exactly what IndexFlow replaces in your current stack.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {replacements.map((item) => (
              <Card key={item.before} className="hover-elevate" data-testid={`replacement-card-${item.before.toLowerCase().replace(/[\s\/]+/g, '-')}`}>
                <CardContent className="p-5">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs text-destructive border-destructive/30 no-default-hover-elevate no-default-active-elevate">Before</Badge>
                  </div>
                  <p className="text-sm font-medium line-through text-muted-foreground mb-4">{item.before}</p>
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs text-primary border-primary/30 no-default-hover-elevate no-default-active-elevate">After</Badge>
                  </div>
                  <p className="text-sm font-semibold">{item.after}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-accent/40" data-testid="pricing-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Simple Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Plans That Scale With You
            </h2>
            <p className="text-muted-foreground">
              Start small, grow without limits. No contracts, cancel anytime.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={`hover-elevate ${tier.highlight ? 'shadow-[0_0_25px_rgba(147,197,253,0.25)] border-primary/30' : ''}`} data-testid={`pricing-card-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6 text-center">
                  {tier.highlight && (
                    <Badge className="mb-3 bg-yellow-400 text-black border-0 shadow-[0_0_15px_rgba(234,179,8,0.6)]">Most Popular</Badge>
                  )}
                  <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 justify-center">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button size="lg" className="gap-2" data-testid="button-view-pricing">
                View Full Pricing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-t" data-testid="why-us-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Why Choose indexFlow</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              The Agency Operating System
            </h2>
            <p className="text-muted-foreground">
              Everything you need to run content, SEO, and client management from one place.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <Card key={item.title} className="hover-elevate shadow-[0_0_20px_rgba(59,130,246,0.15)]" data-testid={`why-card-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 relative overflow-hidden bg-accent/40" data-testid="testimonials-section">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Results</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="hover-elevate" data-testid={`testimonial-card-${testimonial.author.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-t" data-testid="lifecycle-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">End-to-End</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              The Complete Content Lifecycle
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From first draft to performance report — every stage managed in one platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {lifecycleSteps.map((step, index) => (
              <div key={step.title} className="flex items-center">
                <div className="text-center px-3 sm:px-4" data-testid={`lifecycle-step-${step.title.toLowerCase()}`}>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground max-w-[140px] mx-auto">{step.description}</p>
                </div>
                {index < lifecycleSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" data-testid="final-cta-section">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] animate-[shootingStar_8s_ease-in_infinite]" style={{ left: '-150px' }}>
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[120px] h-[2px] bg-gradient-to-l from-white via-yellow-200 to-transparent" />
            </div>
          </div>
          <div className="absolute top-[25%] animate-[shootingStar_10s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '3s' }}>
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full shadow-[0_0_8px_3px_rgba(255,255,200,0.7)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[80px] h-[1.5px] bg-gradient-to-l from-yellow-100 via-yellow-300/50 to-transparent" />
            </div>
          </div>
          <div className="absolute top-[45%] animate-[shootingStar_9s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '1.5s' }}>
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_5px_rgba(255,255,255,0.9)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[150px] h-[2px] bg-gradient-to-l from-white via-amber-100 to-transparent" />
            </div>
          </div>
          <div className="absolute top-[60%] animate-[shootingStar_12s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '5s' }}>
            <div className="relative">
              <div className="w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_6px_2px_rgba(255,255,180,0.6)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[60px] h-[1px] bg-gradient-to-l from-yellow-200 to-transparent" />
            </div>
          </div>
          <div className="absolute top-[75%] animate-[shootingStar_11s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '7s' }}>
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[100px] h-[2px] bg-gradient-to-l from-white via-yellow-100 to-transparent" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">One Platform. One Login.<br className="sm:hidden" /> One Bill. Everything Connected.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From content creation to rank tracking, CRM to invoicing — IndexFlow is the agency operating system.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                <div className="text-3xl font-bold text-white mb-2">$99/mo</div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">Starting Price</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                <div className="text-3xl font-bold text-white mb-2">Minutes</div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">To Set Up</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                <div className="text-3xl font-bold text-white mb-2">Cancel</div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">Anytime</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2 bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl" data-testid="button-cta-demo">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg" data-testid="button-cta-pricing">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-gray-400 text-sm">
            No contracts. No setup fees. Start your free trial today.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16" data-testid="cms-partners-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Publish to</p>
          </div>
          <CMSPartners />
        </div>
      </section>
    </Layout>
  );
}
