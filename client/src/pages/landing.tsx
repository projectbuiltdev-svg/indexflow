import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FileText,
  Search,
  Grid3X3,
  BarChart3,
  Users,
  Globe,
  Zap,
  Shield,
  ArrowRight,
  Check,
  ChevronRight,
  TrendingUp,
  Target,
  Layers,
  GitBranch,
  Cloud,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import logoPath from "@assets/indexFlow_LOGO_1771286575902.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: FileText,
    title: "Programmatic Content Engine",
    description:
      "Deploy thousands of SEO-optimized articles automatically. Template-driven content generation deployed directly to client domains.",
  },
  {
    icon: Search,
    title: "Keyword Rank Tracker",
    description:
      "Monitor keyword positions across search engines in real-time. Track movement, identify opportunities, and measure impact.",
  },
  {
    icon: Grid3X3,
    title: "5x5 Local Search Grid",
    description:
      "Visualize local search visibility across a geographic grid. See exactly where your clients rank in map results.",
  },
  {
    icon: BarChart3,
    title: "GSC Ingestion Layer",
    description:
      "Automatically ingest Google Search Console data. Unified analytics across all client properties in one dashboard.",
  },
  {
    icon: Users,
    title: "Lead to Booking CRM",
    description:
      "Full-funnel attribution from organic impression to booked appointment. Track every touchpoint in the customer journey.",
  },
  {
    icon: Globe,
    title: "White-Label Deployment",
    description:
      "Deploy across unlimited client domains via Cloudflare's edge network. Custom SSL, zero downtime, global performance.",
  },
];

const stats = [
  { value: "50K+", label: "Pages Deployed" },
  { value: "2.4M", label: "Keywords Tracked" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 200ms", label: "Edge Response" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$299",
    period: "/month",
    description: "For small agencies getting started with programmatic SEO",
    features: [
      "Up to 5 client domains",
      "1,000 articles/month",
      "500 keywords tracked",
      "Basic local grid",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$799",
    period: "/month",
    description: "For growing agencies scaling their SEO operations",
    features: [
      "Up to 25 client domains",
      "10,000 articles/month",
      "5,000 keywords tracked",
      "Advanced 5x5 grid",
      "GSC integration",
      "CRM attribution",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large agencies and multi-location enterprises",
    features: [
      "Unlimited client domains",
      "Unlimited articles",
      "Unlimited keywords",
      "Full grid analytics",
      "White-label everything",
      "Twilio integration",
      "Dedicated success manager",
      "Custom SLA",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const howItWorks = [
  {
    step: "01",
    icon: Layers,
    title: "Connect Client Domains",
    description: "Add your client's domain and configure Cloudflare Custom Hostnames for instant SSL provisioning.",
  },
  {
    step: "02",
    icon: GitBranch,
    title: "Generate Content",
    description: "Use templates to generate thousands of SEO-optimized articles targeting local and long-tail keywords.",
  },
  {
    step: "03",
    icon: Cloud,
    title: "Deploy to Edge",
    description: "Content deploys via GitHub to Cloudflare Pages. Zero-config, instant global distribution.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Track & Optimize",
    description: "Monitor rankings, analyze search visibility grids, and attribute leads through the full funnel.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-24">
            <div className="flex items-center gap-2">
              <img src={logoPath} alt="IndexFlow" className="h-[4.5rem] max-h-full object-contain" data-testid="img-logo" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">How It Works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</a>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="button-login">Log In</Button>
              </Link>
              <Link href="/dashboard">
                <Button data-testid="button-get-started">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-6">
                <Zap className="w-3 h-3 mr-1" />
                Programmatic SEO at Scale
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
              data-testid="text-hero-title"
            >
              SEO Infrastructure
              <br />
              <span className="text-primary">for Agencies</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              Deploy automated blog content across unlimited client domains.
              Track rankings, visualize local search grids, and attribute leads
              to bookings — all from one platform.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="text-base px-8" data-testid="button-hero-cta">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-hero-demo">
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-y bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary" data-testid={`text-stat-${stat.label.replace(/\s+/g, '-').toLowerCase()}`}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4">
                <Target className="w-3 h-3 mr-1" />
                Core Modules
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to scale SEO
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-lg">
              Six powerful modules working together to automate your entire SEO operation.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="p-6 h-full hover-elevate">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 lg:py-32 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4">
                <GitBranch className="w-3 h-3 mr-1" />
                Pipeline
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
              How IndexFlow Works
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-lg">
              From domain connection to ranking reports in four simple steps.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {howItWorks.map((item, index) => (
              <motion.div key={item.step} variants={fadeUp} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="text-5xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 z-10">
                    <ChevronRight className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Infrastructure
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built on enterprise infrastructure
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { icon: Cloud, title: "Cloudflare Edge", desc: "Global CDN with Custom Hostnames and automatic SSL provisioning for every client domain." },
              { icon: GitBranch, title: "GitHub Pipeline", desc: "Automated Git-based deployments. Push content, it's live globally within seconds." },
              { icon: Lock, title: "Enterprise Security", desc: "SOC 2 compliant infrastructure. Data isolation per tenant, encrypted at rest and in transit." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Card className="p-6 h-full">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="py-24 lg:py-32 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-lg">
              Start free. Scale when ready. No surprises.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp}>
                <Card
                  className={`p-6 h-full flex flex-col ${
                    plan.highlighted
                      ? "border-primary ring-1 ring-primary/20"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <Badge className="self-start mb-4">Most Popular</Badge>
                  )}
                  <h3 className="font-semibold text-xl" data-testid={`text-plan-${plan.name.toLowerCase()}`}>{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard">
                    <Button
                      className="w-full mt-6"
                      variant={plan.highlighted ? "default" : "outline"}
                      data-testid={`button-plan-${plan.name.toLowerCase()}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center bg-primary text-primary-foreground border-primary-border">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to scale your SEO operations?</h2>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
              Join agencies deploying thousands of pages across client domains with IndexFlow.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="text-base px-8" data-testid="button-cta-trial">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logoPath} alt="IndexFlow" className="h-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} IndexFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
