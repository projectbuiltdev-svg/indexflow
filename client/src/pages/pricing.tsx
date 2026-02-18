import { Link } from "wouter";
import { Check, Phone, Globe, Bot, Calendar, Clock, Users, Code, TrendingUp, Search, MapPin, Grid3X3, PenTool, FileText, Building2, ArrowRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { PageSubNav } from "@/components/page-sub-nav";
import indexFlowLogo from "@assets/image_1771351451425.png";
import { SEO, seoData } from "@/components/seo";

const pricingSections = [
  { id: "plans", label: "Plans" },
  { id: "add-ons", label: "Add-Ons" },
  { id: "questions", label: "Questions" },
];

const addOns = [
  {
    title: "Custom Websites",
    description: "Custom-designed websites built for restaurants, hotels, and businesses",
    icon: Globe,
    href: "/platform/hospitality-websites",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "SEO",
    description: "Search engine optimization to drive organic traffic and visibility",
    icon: Search,
    href: "/platform/seo",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Content Marketing",
    description: "Strategic content creation to engage customers and build authority",
    icon: PenTool,
    href: "/platform/content-marketing",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Local Citations",
    description: "Build local search presence via trusted partners Whitespark and BrightLocal",
    icon: MapPin,
    href: "/services/local-citations",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Multiple Location Pages",
    description: "Dedicated pages and dashboards for each of your business locations",
    icon: Building2,
    href: "/solutions/multi-location",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Built-in SEO Tools",
    description: "Rank Tracker, Local Search Grid, and Google Search Console — built into every plan",
    icon: TrendingUp,
    href: "/platform/seo-tools",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "Free",
  },
];

const fullServiceFeatures = [
  { icon: Globe, text: "Custom-designed website" },
  { icon: Calendar, text: "Website & Twilio RSVP" },
  { icon: Calendar, text: "Automated booking system" },
  { icon: Bot, text: <>Virtual Concierge 24/7</> },
  { icon: Phone, text: <>Twilio integration <span className="text-sm italic text-muted-foreground">(customer service #)</span></> },
  { icon: Clock, text: "Real-time availability sync" },
  { icon: Users, text: "Client dashboard access" },
  { icon: Calendar, text: "Pre-paid Reservations" },
  { icon: TrendingUp, text: <>Rank Tracker <span className="text-sm italic text-muted-foreground">(1,000 keywords, free weekly scans)</span></> },
  { icon: Search, text: <>Search Console <span className="text-sm italic text-muted-foreground">(auto tracked)</span></> },
  { icon: Grid3X3, text: <>Local Search Grid <span className="text-sm italic text-muted-foreground">(weekly scans, 25 keywords)</span></> },
  { icon: Globe, text: "Website Changes" },
];

const widgetFeatures = [
  { icon: Calendar, text: "Website Reservation Widget" },
  { icon: Calendar, text: "Automated booking system" },
  { icon: Bot, text: "Virtual Concierge" },
  { icon: Clock, text: "Real-time availability sync" },
  { icon: Users, text: "Client dashboard access" },
  { icon: Calendar, text: "Pre-paid Reservations" },
  { icon: TrendingUp, text: <>Rank Tracker <span className="text-sm italic text-muted-foreground">(1,000 keywords, free weekly scans)</span></> },
  { icon: Search, text: <>Search Console <span className="text-sm italic text-muted-foreground">(auto tracked)</span></> },
  { icon: Grid3X3, text: <>Local Search Grid <span className="text-sm italic text-muted-foreground">(weekly scans, 25 keywords)</span></> },
  { icon: Globe, text: "Website Changes" },
];


export default function Pricing() {
  return (
    <Layout>
      <SEO {...seoData.pricing} />
    <PageSubNav sections={pricingSections} />
    <div className="min-h-screen">
      <section id="plans" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]" data-testid="badge-pricing">
              Simple Pricing
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-pricing-title">
              Everything You Need, One Price
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0 text-center" data-testid="text-pricing-subtitle">
              No hidden fees. No per-booking charges. No contracts. Done for you setup.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            <Card className="relative overflow-visible" data-testid="card-pricing-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black border-0 shadow-[0_0_20px_rgba(234,179,8,0.5)]" data-testid="badge-popular">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <img src={indexFlowLogo} alt="indexFlow Restaurant Booking Platform" className="h-8 mx-auto mb-2" />
                <CardTitle className="text-2xl" data-testid="text-plan-name-full">Complete Solution</CardTitle>
                <CardDescription className="text-xs" data-testid="text-payment-note">$499 one-time setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent" data-testid="text-monthly-price-full">$299</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <Link href="/contact" className="inline-block mt-3">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 border border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.3)]">
                      <span className="text-sm font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent dark:from-yellow-300 dark:via-orange-300 dark:to-yellow-300">I Want This!</span>
                    </div>
                  </Link>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Everything included</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
                  </div>
                  <ul className="space-y-3">
                    {fullServiceFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3" data-testid={`feature-full-${index}`}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">5-20 business days website turn-around</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bring Your Own Keys (BYOK) AI for Twilio - you control your costs. We host your website and assign browser SSL FREE, <Link href="/contact" className="text-primary hover:underline">Contact our sales team</Link>.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/contact" className="w-full">
                  <Button className="w-full" size="lg" data-testid="button-get-started-full">
                    Book a Discovery Call
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="relative overflow-visible" data-testid="card-pricing-widget">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]" data-testid="badge-virtual-concierge">
                  Virtual Concierge
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <img src={indexFlowLogo} alt="indexFlow Restaurant Booking Platform" className="h-8 mx-auto mb-2" />
                <CardTitle className="text-2xl" data-testid="text-plan-name-widget">Widget Only</CardTitle>
                <CardDescription className="text-xs" data-testid="text-widget-note">No setup fee required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent" data-testid="text-monthly-price-widget">$149</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.2)]" data-testid="text-widget-trial">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">7 Day Trial</span>
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">$1</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">What's included</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
                  </div>
                  <ul className="space-y-3">
                    {widgetFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3" data-testid={`feature-widget-${index}`}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-blue-500" />
                        </div>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Single line of code integration</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add our booking widget to your existing website instantly
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Bring Your Own Keys (BYOK) AI for Twilio (optional) - you control your costs
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pb-6">
                <Link href="/contact" className="w-full">
                  <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white" size="lg" data-testid="button-get-started-widget">
                    Book a Discovery Call
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div id="add-ons" className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4" data-testid="badge-add-ons">
                Add-Ons
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-addons-title">
                Grow Your Online Presence
              </h2>
              <p className="text-muted-foreground">
                Available with any plan. Managed by our team.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addOns.map((addon) => (
                <Link key={addon.title} href={addon.href}>
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-addon-${addon.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${addon.bg} flex items-center justify-center shrink-0`}>
                          <addon.icon className={`w-4 h-4 ${addon.color}`} />
                        </div>
                        <CardTitle className="text-base">{addon.title}</CardTitle>
                        {"badge" in addon && addon.badge && (
                          <Badge className="bg-green-500 text-white border-0 text-xs ml-auto shrink-0">{addon.badge}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                      <div className="flex items-center gap-1 text-sm font-medium text-primary">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div id="questions" className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4" data-testid="text-questions-title">
              Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Schedule a call with our team to discuss your specific needs.
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg" data-testid="button-contact">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
}
