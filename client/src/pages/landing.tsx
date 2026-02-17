import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Bot,
  TrendingUp,
  UtensilsCrossed,
  Building2,
  Coffee,
  Wine,
  MessageSquare,
  FileText,
  Search,
  Phone,
  MapPin,
  CalendarCheck,
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
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
  { label: "Portfolio", href: "#portfolio" },
];

const steps = [
  {
    icon: Globe,
    title: "We Build Your Website",
    description:
      "Our team designs and launches a stunning, conversion-optimized website tailored to your venue.",
  },
  {
    icon: Bot,
    title: "AI Books Your Guests",
    description:
      "Our AI-powered booking widget handles reservations 24/7, reducing no-shows and maximizing covers.",
  },
  {
    icon: TrendingUp,
    title: "You Grow Your Business",
    description:
      "Focus on what you do best while our SEO engine and marketing tools drive more guests to your door.",
  },
];

const solutions = [
  {
    icon: UtensilsCrossed,
    title: "Restaurants",
    description:
      "Streamline table reservations, manage peak hours, and fill every seat with AI-driven booking.",
  },
  {
    icon: Building2,
    title: "Hotels",
    description:
      "Maximize room occupancy with seamless online booking, upsells, and guest communication tools.",
  },
  {
    icon: Coffee,
    title: "Cafes",
    description:
      "Accept walk-in queues and reservations, promote daily specials, and build a loyal customer base.",
  },
  {
    icon: Wine,
    title: "Bars",
    description:
      "Manage event bookings, VIP tables, and private hire requests with an intelligent booking system.",
  },
];

const features = [
  {
    icon: MessageSquare,
    title: "AI Booking Widget",
    description:
      "Conversational AI that handles reservations, answers FAQs, and guides guests through the booking flow.",
  },
  {
    icon: FileText,
    title: "Content Engine",
    description:
      "Automated blog posts, landing pages, and social content generated to attract and convert visitors.",
  },
  {
    icon: Search,
    title: "SEO & Rankings",
    description:
      "On-page optimization, schema markup, and keyword tracking to dominate local search results.",
  },
  {
    icon: Phone,
    title: "Twilio Voice Integration",
    description:
      "AI-powered phone answering that takes reservations, handles enquiries, and never misses a call.",
  },
  {
    icon: MapPin,
    title: "Local Search Grid",
    description:
      "Visualize your Google Maps ranking across your service area and track improvements over time.",
  },
  {
    icon: CalendarCheck,
    title: "Reservation Management",
    description:
      "Full dashboard to view, edit, and manage all bookings with automated confirmations and reminders.",
  },
];

const completePlanFeatures = [
  "Custom website",
  "AI booking widget",
  "SEO content engine",
  "Rank tracker",
  "Local search grid",
  "Twilio voice",
  "Email support",
];

const widgetPlanFeatures = [
  "AI booking widget",
  "Basic analytics",
  "Email support",
];

const templateCategories = [
  {
    title: "Restaurant",
    count: 4,
    description: "Fine dining, casual, fast-casual, and family restaurant templates.",
  },
  {
    title: "Hotel",
    count: 4,
    description: "Boutique, resort, business, and luxury hotel templates.",
  },
  {
    title: "Cafe",
    count: 4,
    description: "Coffee shop, bakery, brunch spot, and tea house templates.",
  },
  {
    title: "Bar",
    count: 4,
    description: "Cocktail bar, pub, wine bar, and rooftop lounge templates.",
  },
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
            <Link href="/" data-testid="link-logo">
              <span className="text-xl font-bold tracking-tight">Resto</span>
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
              <Link href="/dashboard">
                <Button variant="outline" className="text-white border-slate-600 bg-transparent backdrop-blur-sm" data-testid="button-login">
                  Login
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button data-testid="button-get-started-nav">Get Started</Button>
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
                <Link href="/dashboard">
                  <Button variant="outline" className="text-white border-slate-600 bg-transparent backdrop-blur-sm" data-testid="button-login-mobile">
                    Login
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button data-testid="button-get-started-mobile">Get Started</Button>
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
              Done-For-You Hospitality Booking Platform
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              AI-powered booking widgets, SEO content engine, and complete
              website management for restaurants, hotels, cafes, and bars.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Link href="/dashboard">
                <Button size="lg" data-testid="button-hero-get-started">
                  Get Started - $299/mo
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
              Three simple steps to transform your hospitality business online.
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
              Solutions for Every Venue
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Tailored booking and marketing tools for the hospitality industry.
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
              Everything you need to attract, convert, and retain guests online.
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
              data-testid="card-pricing-complete"
            >
              <div className="absolute -top-3 left-6">
                <Badge data-testid="badge-most-popular">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Complete Plan</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$299</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Everything included to grow your venue online.
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {completePlanFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button className="w-full mt-8" data-testid="button-pricing-complete">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card data-testid="card-pricing-widget">
              <CardHeader>
                <CardTitle className="text-2xl">Widget Only</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Just the booking widget for your existing site.
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {widgetPlanFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full mt-8"
                    data-testid="button-pricing-widget"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="portfolio"
        className="py-20 md:py-28 bg-background"
        data-testid="section-portfolio"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              16 Stunning Templates
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Professionally designed, conversion-optimized templates for every type of venue.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templateCategories.map((category) => (
              <Card
                key={category.title}
                data-testid={`card-template-${category.title.toLowerCase()}`}
              >
                <CardHeader>
                  <div className="w-full h-32 rounded-md bg-muted flex items-center justify-center mb-3">
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {category.count} Templates
                    </span>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
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
            Ready to Transform Your Venue?
          </h2>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
            Get in touch to learn how Resto can fill your tables, rooms, and
            seats with AI-powered booking technology.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
            <a
              href="mailto:hello@resto.restaurant"
              className="flex items-center gap-2 text-slate-300"
              data-testid="link-email"
            >
              <Mail className="w-5 h-5" />
              <span>hello@resto.restaurant</span>
            </a>
            <a
              href="tel:+18005551234"
              className="flex items-center gap-2 text-slate-300"
              data-testid="link-phone"
            >
              <Phone className="w-5 h-5" />
              <span>+1 (800) 555-1234</span>
            </a>
          </div>
          <div className="mt-10">
            <a href="mailto:hello@resto.restaurant">
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
              <span className="text-lg font-bold text-white">Resto</span>
              <p className="mt-3 text-sm">
                The all-in-one hospitality booking platform powered by AI.
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
                  <a href="#portfolio" data-testid="link-footer-templates">
                    Templates
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
            <p data-testid="text-copyright">2026 Resto.Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
