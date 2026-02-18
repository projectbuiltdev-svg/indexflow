import { useEffect } from "react";
import { CheckCircle, Clock, Globe, Bot, DollarSign, Users, Zap, ArrowRight, Phone, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { PageSubNav } from "@/components/page-sub-nav";
import { CMSPartners } from "@/components/cms-partners";
import { SEO, seoData, serviceSchema, howToSchema } from "@/components/seo";

const aboutSections = [
  { id: "explainer", label: "Watch" },
  { id: "process", label: "The Process" },
  { id: "whats-included", label: "What's Included" },
  { id: "why-resto", label: "Why indexFlow" },
  { id: "pricing-overview", label: "Pricing" },
  { id: "get-started", label: "Get Started" },
  { id: "faq", label: "FAQ" },
];

const steps = [
  {
    number: "1",
    title: "You Pay to Start",
    description: <>Pay <strong>$299</strong> (first month) to kick off the process and we start building immediately.</>,
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    number: "2",
    title: "We Build Everything",
    description: "Custom website, booking system, AI phone assistant — all tailored to your business.",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    number: "3",
    title: "You Review & Approve",
    description: "We deliver in 5-20 business days. You review and request any changes.",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    number: "4",
    title: "Go Live & Grow",
    description: "After sign-off, your site goes live and subscription begins. Never miss a booking again.",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const included = [
  { icon: Globe, title: "Custom Website", description: "Mobile-first design with your menu, photos, and branding", color: "text-blue-500", bgColor: "bg-blue-500/10", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
  { icon: Calendar, title: "Booking System", description: "24/7 online reservations synced to your operations", color: "text-green-500", bgColor: "bg-green-500/10", shadow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]" },
  { icon: Bot, title: "AI Phone Assistant", description: "Handles calls and texts automatically, books tables 24/7", color: "text-purple-500", bgColor: "bg-purple-500/10", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  { icon: Phone, title: "Twilio Integration", description: "Voice and SMS powered by Twilio — you control costs with BYOK", color: "text-cyan-500", bgColor: "bg-cyan-500/10", shadow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]" },
];

const benefits = [
  {
    icon: Users,
    title: "Done-For-You",
    description: "No tech skills needed. We handle design, development, and deployment. You just approve.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Bot,
    title: "Full Automation",
    description: "AI answers calls, takes bookings, sends confirmations — 24/7, no staff required.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: DollarSign,
    title: "Dramatic Cost Savings",
    description: "Replace expensive phone staff. Our AI costs a fraction of a full-time receptionist.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Clock,
    title: "Booking Recovery",
    description: "No more missed calls. No more after-hours losses. Every inquiry gets handled.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const pricing = [
  { label: "One-Time Setup", value: "$499", note: "Website, booking, AI configuration", icon: Zap, color: "text-primary", bgColor: "bg-primary/10", shadow: "shadow-[0_0_20px_rgba(234,179,8,0.4)]" },
  { label: "Monthly Subscription", value: "$299", valueSuffix: "/mo", note: "Hosting, support, maintenance", icon: Calendar, color: "text-blue-500", bgColor: "bg-blue-500/10", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
  { label: "Virtual Concierge", value: "$149", valueSuffix: "/mo", note: "For clients with existing websites", icon: Bot, color: "text-purple-500", bgColor: "bg-purple-500/10", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  { label: "Optional SEO", value: "$499", note: "Boost your search visibility", icon: Globe, color: "text-green-500", bgColor: "bg-green-500/10", shadow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]" },
];

export default function About() {
  return (
    <Layout>
      <SEO {...seoData.about} structuredData={[serviceSchema, howToSchema]} />
      <PageSubNav sections={aboutSections} />
      <section id="explainer" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">See How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Watch Our Explainer
            </h2>
            <p className="text-muted-foreground">
              See how indexFlow transforms your business in under 2 minutes.
            </p>
          </div>
          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://player.vimeo.com/video/1162867536?autoplay=1&title=0&byline=0&portrait=0&texttrack=en&loop=1"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="indexFlow Explainer Video"
              data-testid="video-explainer-howit"
            />
          </div>

          <div className="mt-12 relative">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 blur-xl" />
            <Card className="overflow-visible border-0 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <CardContent className="p-8 lg:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Your AI Concierge, Always On 24/7</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      The AI concierge handles live chat inquiries on your website, and it also receives phone calls via your Twilio customer service number.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      It answers, replies and books pre-paid reservations; your guests receive instant SMS confirmations + email reminders.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      Your workspace gets alerted to an RSVP confirmation, and your front desk immediately processes the booking.
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 lg:p-10 text-center border border-primary/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                      <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                        <span className="relative block w-full h-full rounded-full bg-green-500" />
                      </div>
                      <div className="mb-4 relative">
                        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-primary/20 animate-[pulse_3s_ease-in-out_infinite] blur-xl" />
                        <Bot className="w-16 h-16 mx-auto text-primary relative animate-[bounce_4s_ease-in-out_infinite]" />
                      </div>
                      <p className="text-lg lg:text-xl font-bold leading-snug animate-[pulse_5s_ease-in-out_infinite]">
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">AI Concierge never sleeps,</span><br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-primary bg-clip-text text-transparent">never gets tired &</span><br />
                        <span className="bg-gradient-to-r from-purple-500 via-primary to-blue-500 bg-clip-text text-transparent">never misses a booking!</span>
                      </p>
                      <p className="mt-4 text-sm font-semibold text-muted-foreground tracking-wide uppercase animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}>
                        Even when your front desk is closed.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="process" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">The Process</Badge>
            <h2 className="text-3xl font-bold mb-4">4 Simple Steps</h2>
            <p className="text-muted-foreground">
              Pay to start, we build, Job done.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card key={step.number} className="hover-elevate relative">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                  <div className={`w-14 h-14 rounded-full ${step.bgColor} flex items-center justify-center mx-auto mb-4 mt-4`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="whats-included" className="py-16 lg:py-20 bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">What's Included</Badge>
            <h2 className="text-3xl font-bold mb-4">Your Complete System</h2>
            <p className="text-muted-foreground">
              Focus on Hospitality. We Handle the Rest.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map((item) => (
              <Card key={item.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-4 ${item.shadow}`}>
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

      <section id="why-resto" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Why Choose indexFlow</Badge>
            <h2 className="text-3xl font-bold mb-4">The Smart Choice</h2>
            <p className="text-muted-foreground">
              Zero Tech Stress. Maximum Bookings.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${benefit.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing-overview" className="py-16 lg:py-20 bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Pricing</Badge>
            <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((item) => (
              <Card key={item.label} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-4 ${item.shadow}`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.label}</h3>
                  <p className="text-2xl font-bold mb-2">{item.value}{item.valueSuffix && <span className="text-sm font-normal text-muted-foreground">{item.valueSuffix}</span>}</p>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              <strong className="text-foreground">BYOK</strong> (Bring Your Own Keys): You control Twilio and AI usage costs directly.
            </p>
          </div>
        </div>
      </section>

      <section id="get-started" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Get Started</Badge>
            <h2 className="text-3xl font-bold mb-4">How to Get Started</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <Phone className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Contact us</h3>
                <p className="text-sm text-muted-foreground">Tell us about your business</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <DollarSign className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Pay first month ($299)</h3>
                <p className="text-sm text-muted-foreground">This triggers our build process</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <CheckCircle className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Review & approve (5-20 days)</h3>
                <p className="text-sm text-muted-foreground">We build, you review content</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">4</div>
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <Zap className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Go live!</h3>
                <p className="text-sm text-muted-foreground">Subscription starts after sign-off</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-10">
            <Link href="/contact">
              <Button className="gap-2" data-testid="button-about-cta">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-foreground/20 max-w-7xl mx-auto" />

      <section id="faq" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">FAQ</Badge>
            <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
            <div className="text-left space-y-6">
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">How long does setup take?</p>
                <p className="text-sm text-muted-foreground">5-20 business days from payment to sign-off, depending on your business's complexity.</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">What is BYOK?</p>
                <p className="text-sm text-muted-foreground">Bring Your Own Keys. You provide your Twilio and AI API keys, so you control and pay for usage directly — no markups from us.</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">Can I cancel anytime?</p>
                <p className="text-sm text-muted-foreground">Yes. Monthly subscription with no long-term contracts. Cancel whenever you need to.</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">What if I need changes after launch?</p>
                <p className="text-sm text-muted-foreground">Your subscription includes ongoing maintenance and support. We handle updates for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CMSPartners />
    </Layout>
  );
}
