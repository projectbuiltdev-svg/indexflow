import { Link } from "wouter";
import logoImage from "@assets/image_1771330330596.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Bot,
  TrendingUp,
  Briefcase,
  Building2,
  Users,
  Layers,
  MessageSquare,
  FileText,
  Search,
  BarChart3,
  MapPin,
  LayoutGrid,
  Check,
  Menu,
  X,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Solutions", href: "#solutions" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const steps = [
  {
    icon: Globe,
    title: "Connect Your Clients",
    description:
      "Add your client workspaces, connect their domains, and set up keyword tracking in minutes.",
  },
  {
    icon: Bot,
    title: "AI Creates Content",
    description:
      "Our AI content engine generates SEO-optimized blog posts, meta tags, and landing pages at scale.",
  },
  {
    icon: TrendingUp,
    title: "Watch Rankings Climb",
    description:
      "Track keyword positions, monitor local search grids, and measure the impact of every campaign.",
  },
];

const solutions = [
  {
    icon: Briefcase,
    title: "Agencies",
    description:
      "Manage multiple client workspaces from one dashboard. White-label reports, automate content, and scale your SEO operations.",
  },
  {
    icon: Users,
    title: "Freelancers",
    description:
      "Deliver professional SEO services with enterprise-grade tools. Track rankings, publish content, and impress clients.",
  },
  {
    icon: Building2,
    title: "Enterprises",
    description:
      "Centralize SEO across departments and locations. Maintain brand consistency with team collaboration tools.",
  },
  {
    icon: Layers,
    title: "Multi-Location",
    description:
      "Optimize local SEO for every location. Track Google Maps rankings with our 5x5 local search grid.",
  },
];

const features = [
  {
    icon: FileText,
    title: "AI Content Engine",
    description:
      "Generate SEO-optimized blog posts, landing pages, and meta descriptions powered by AI. Publish directly or schedule ahead.",
  },
  {
    icon: Search,
    title: "Keyword Rank Tracker",
    description:
      "Monitor keyword positions across Google. Track daily changes, spot opportunities, and measure campaign impact.",
  },
  {
    icon: MapPin,
    title: "Local Search Grid",
    description:
      "Visualize your Google Maps rankings across a 5x5 grid in your service area. Identify weak spots and track improvements.",
  },
  {
    icon: BarChart3,
    title: "SEO Health Reports",
    description:
      "Automated technical SEO audits, internal linking analysis, and keyword cannibalization detection for every workspace.",
  },
  {
    icon: MessageSquare,
    title: "CRM & Lead Tracking",
    description:
      "Capture leads from your content, manage contacts through a visual pipeline, and never miss a follow-up.",
  },
  {
    icon: LayoutGrid,
    title: "White-Label Dashboard",
    description:
      "Customize branding, colors, and domains for each client. Deliver a fully branded experience under your agency name.",
  },
];

const proPlanFeatures = [
  "Unlimited workspaces",
  "AI content engine",
  "Keyword rank tracker",
  "Local search grid",
  "SEO health reports",
  "CRM & lead tracking",
  "White-label branding",
  "Priority support",
];

const starterPlanFeatures = [
  "Up to 3 workspaces",
  "AI content engine",
  "Keyword rank tracker",
  "Basic SEO reports",
  "Email support",
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950 text-white border-b border-slate-800"
        data-testid="nav-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link href="/" data-testid="link-logo" className="flex items-center gap-2">
              <img src={logoImage} alt="indexFlow" className="h-8" />
            </Link>

            <div className="hidden lg:flex items-center gap-6 flex-wrap">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 transition-colors"
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3 flex-wrap">
              <Link href="/select-workspace">
                <Button variant="outline" className="text-white border-slate-600 bg-transparent backdrop-blur-sm" data-testid="button-login">
                  Log In
                </Button>
              </Link>
              <Link href="/select-workspace">
                <Button data-testid="button-get-started-nav">Start Free Trial</Button>
              </Link>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pb-4">
            <div className="flex flex-col gap-3 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2 flex-wrap">
                <Link href="/select-workspace">
                  <Button variant="outline" className="text-white border-slate-600 bg-transparent backdrop-blur-sm" data-testid="button-login-mobile">
                    Log In
                  </Button>
                </Link>
                <Link href="/select-workspace">
                  <Button data-testid="button-get-started-mobile">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section
        className="relative pt-16 min-h-[600px] flex items-center"
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              The SEO Platform Built for Agencies
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              AI-powered content engine, keyword rank tracking, local search grid, and white-label reporting
              — everything your agency needs to scale SEO for every client.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Link href="/select-workspace">
                <Button size="lg" data-testid="button-hero-get-started">
                  Start Free Trial
                  <ArrowRight className="ml-1" />
                </Button>
              </Link>
              <a href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-slate-500 bg-white/5 backdrop-blur-sm"
                  data-testid="button-hero-demo"
                >
                  Book a Demo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 md:py-28 bg-background"
        data-testid="section-how-it-works"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to supercharge your SEO workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={step.title} data-testid={`card-step-${index + 1}`}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="w-fit mb-2 no-default-hover-elevate no-default-active-elevate">
                    Step {index + 1}
                  </Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="solutions"
        className="py-20 md:py-28 bg-muted/30"
        data-testid="section-solutions"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Built for Every Team
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're a solo freelancer or an enterprise team, indexFlow scales with your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution) => (
              <Card
                key={solution.title}
                data-testid={`card-solution-${solution.title.toLowerCase()}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <solution.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 md:py-28 bg-background"
        data-testid="section-features"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Powerful Features
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to run, report on, and scale your SEO campaigns.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-20 md:py-28 bg-muted/30"
        data-testid="section-pricing"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              No hidden fees. No long-term contracts. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card
              className="relative border-primary"
              data-testid="card-pricing-pro"
            >
              <div className="absolute -top-3 left-6">
                <Badge data-testid="badge-most-popular">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Everything you need to scale your agency's SEO operations.
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {proPlanFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/select-workspace">
                  <Button className="w-full mt-8" data-testid="button-pricing-pro">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card data-testid="card-pricing-starter">
              <CardHeader>
                <CardTitle className="text-2xl">Starter Plan</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Perfect for freelancers and small teams getting started.
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {starterPlanFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/select-workspace">
                  <Button
                    variant="outline"
                    className="w-full mt-8"
                    data-testid="button-pricing-starter"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-20 md:py-28 bg-slate-950 text-white"
        data-testid="section-contact"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Scale Your SEO?
          </h2>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
            Get in touch to learn how indexFlow can help your agency deliver
            better results for every client.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
            <a
              href="mailto:hello@indexflow.io"
              className="flex items-center gap-2 text-slate-300"
              data-testid="link-email"
            >
              <Mail className="w-5 h-5" />
              <span>hello@indexflow.io</span>
            </a>
          </div>
          <div className="mt-10">
            <a href="mailto:hello@indexflow.io">
              <Button size="lg" data-testid="button-contact-demo">
                Book a Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer
        className="bg-slate-950 text-slate-400 border-t border-slate-800 py-16"
        data-testid="footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <img src={logoImage} alt="indexFlow" className="h-6" />
              <p className="mt-3 text-sm">
                The all-in-one SEO and content platform built for agencies.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" data-testid="link-footer-features">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" data-testid="link-footer-pricing">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#solutions" data-testid="link-footer-solutions">
                    Solutions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" data-testid="link-footer-about">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-footer-blog">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" data-testid="link-footer-contact">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" data-testid="link-footer-privacy">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-footer-terms">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
            <p data-testid="text-copyright">2026 indexFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
