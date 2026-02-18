import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Star, Calendar, Phone, CheckCircle, Utensils, Wine, Coffee, Building2, Globe, PhoneCall, BarChart3, Bot, Zap, Clock, DollarSign, Users, MessageSquare, Puzzle, Wrench, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { CMSPartners } from "@/components/cms-partners";
import { SEO, seoData, combinedHomeSchema } from "@/components/seo";

const problems = [
  {
    icon: PhoneCall,
    title: "Staff Tied Up on Phones",
    description: "Your team spends hours answering calls instead of serving guests.",
  },
  {
    icon: Calendar,
    title: "Missed Bookings",
    description: "After-hours calls and busy signals mean lost reservations and revenue.",
  },
  {
    icon: Globe,
    title: "Outdated Website",
    description: "No online booking, hard to update, doesn't reflect your brand.",
  },
  {
    icon: MessageSquare,
    title: "Repetitive Questions",
    description: "Staff time wasted answering the same questions over and over.",
  },
  {
    icon: Puzzle,
    title: "Fragmented Tools",
    description: "Website, phone, bookings, and analytics don't talk to each other.",
  },
  {
    icon: Wrench,
    title: "Tech Complexity",
    description: "Operators don't want DIY software or complicated tech setups.",
  },
];

const solutions = [
  {
    icon: Phone,
    title: "Never Miss a Call, or a Guest",
    description: "Every call is answered, ensuring you capture every reservation and welcome every guest—no more lost opportunities.",
  },
  {
    icon: DollarSign,
    title: "Boost Guest Visits & Revenue",
    description: "Turn every conversation into a connection. Welcome new guests and cultivate regulars, directly increasing your revenue.",
  },
  {
    icon: Utensils,
    title: "Built by Hospitality Experts",
    description: "Designed by operators who understand the pace, pressure, and heart of the industry—with genuine empathy for your team.",
  },
  {
    icon: BarChart3,
    title: "Complete Visibility & Control",
    description: "See who's calling, monitor conversations in real time, and retain full ownership of your guest data and history.",
  },
  {
    icon: Users,
    title: "Enhance Staff Productivity",
    description: "Free your team from the phone. Let them focus on guests while indexFlow manages your calls 24/7 and web reservations.",
  },
  {
    icon: Zap,
    title: "Quick Setup & Dedicated Support",
    description: "Get started fast and enjoy reliable, ongoing support from people who truly know the booking and SEO business inside and out.",
  },
];

const stats = [
  { value: "40%", label: "More Bookings" },
  { value: "24/7", label: "Availability" },
  { value: "5-20", label: "Days to Launch" },
  { value: "0", label: "Missed Calls" },
];

const venueTypes = [
  { icon: Utensils, title: "Restaurants", description: "Fine dining to Urban eatery" },
  { icon: Coffee, title: "Cafes", description: "Coffee shops & bakeries" },
  { icon: Wine, title: "Bars", description: "Lounges & pubs" },
  { icon: Building2, title: "Hotels", description: "Rooms & amenities" },
];

const testimonials = [
  {
    quote: "We stopped missing after-hours calls. The AI books tables while we sleep. Revenue is up 40%.",
    author: "Maria Santos",
    role: "Owner, La Bella Italia",
    rating: 5,
  },
  {
    quote: "Setup was painless. They built everything, we just approved it. Now the phone practically runs itself.",
    author: "James Chen",
    role: "Manager, The Golden Dragon",
    rating: 5,
  },
  {
    quote: "We cut front desk time in half. Staff focus on guests, not answering the same questions all day.",
    author: "Sophie Laurent",
    role: "Director, Café de Paris",
    rating: 5,
  },
];

const pricingFeatures = [
  "AI Virtual Concierge",
  "AI-powered booking system",
  "Voice/text assistant (Twilio)",
  "Client dashboard",
  "Priority ticket support",
  "Booking recovery automation",
  "Pre-paid reservations",
  "SMS & email confirmations",
];

const whyUs = [
  {
    icon: Users,
    title: "Done-For-You Setup",
    description: "We build everything. You approve and go live. No tech skills needed.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Bot,
    title: "Full Automation",
    description: "AI handles calls, texts & bookings 24/7 so you don't have to.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: DollarSign,
    title: "Dramatically Reduced Costs",
    description: "Replace phone staff with AI. Pay a fraction of what an HR hire costs.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Clock,
    title: "Booking Recovery",
    description: "Never lose a reservation to a missed call or after-hours inquiry.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
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
  const [currentVenueIndex, setCurrentVenueIndex] = useState(0);

  useEffect(() => {
    document.title = "indexFlow - Managed Booking & Website Platform for Hospitality";
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.onload = () => {
      if (!(window as any).Vimeo) return;
      const iframe2 = document.querySelector('[data-testid="explainer-video-2"]') as HTMLIFrameElement;
      if (iframe2) {
        const player2 = new (window as any).Vimeo.Player(iframe2);
        player2.on("play", () => {
          const el = document.querySelector(".hotel-video-title") as HTMLElement;
          if (el) el.style.opacity = "0";
        });
      }
      const iframe3 = document.querySelector('[data-testid="explainer-video-3"]') as HTMLIFrameElement;
      if (iframe3) {
        const player3 = new (window as any).Vimeo.Player(iframe3);
        player3.on("play", () => {
          const el = document.querySelector(".resto-video-title") as HTMLElement;
          if (el) el.style.opacity = "0";
        });
      }
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVenueIndex((prev) => (prev + 1) % venueTypes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <SEO {...seoData.home} structuredData={combinedHomeSchema} />
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/15 z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <div className="inline-block backdrop-blur-sm bg-black/15 rounded-2xl px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-14 mx-2">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              One SEO tool to<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">rule them all.</span>
            </h1>
            <p className="text-[15px] sm:text-lg lg:text-xl max-w-3xl mx-auto mb-4 font-semibold text-white drop-shadow-lg">
              Why juggle 10 different platforms<br />
              when one does it all?
            </p>
            <p className="text-[15px] sm:text-lg lg:text-xl max-w-3xl mx-auto mb-4">
              <span className="text-white/90 drop-shadow-lg">Create content. Track rankings. Generate leads.</span><br />
              <span className="text-white/90 drop-shadow-lg">Push to any LLM or CMS. Resell to your clients.</span><br />
              <span className="text-white/90 drop-shadow-lg">All from one AI-powered platform.</span>
            </p>
            <p className="inline-block mb-8 font-bold text-[17px] sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-[pulse_5s_ease-in-out_infinite]">
              Agencies · SaaS · Ecommerce · Local Business
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Link href="/contact">
                <Button size="default" className="gap-2 sm:text-base text-sm sm:px-4 px-3" data-testid="button-hero-demo">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="default" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 sm:text-base text-sm sm:px-4 px-3" data-testid="button-hero-templates">
                  <span className="italic">from</span> <span className="font-bold">$99</span> p/mo
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-[13px] sm:text-sm font-medium bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-lg">
              IndexFlow handles infrastructure & agencies handle client relationships.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 relative overflow-hidden bg-accent/40">
        {/* Animated background */}
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
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent animate-[fadeInUp_0.6s_ease-out_forwards]" style={{ animationDelay: `${index * 0.15}s`, opacity: 0 }}>{stat.value}</p>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</p>
                </div>
                {index < stats.length - 1 && (
                  <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">The Pain Problem</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sound Familiar?
            </h2>
            <p className="text-muted-foreground">
              Most businesses lose bookings every single day to these common issues.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <Card key={problem.title} className="hover-elevate border-destructive/20">
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

      <section className="py-16 lg:py-24 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">The Solution</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Virtual Concierge</h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-4">(AI) website booking widget</p>
            <p className="text-muted-foreground">
              Transform your business with indexFlow
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Card key={solution.title} className="hover-elevate">
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
              Ready to fill more seats and streamline? <span className="font-semibold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Zero Tech Stress. Maximum Bookings.</span>
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-solution-cta">
                I Want This! <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-border" />
      </div>


      <section className="pt-16 pb-16 lg:pt-24 lg:pb-24 relative overflow-hidden bg-accent/40">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Who We Serve</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built for Hospitality
            </h2>
            <p className="text-muted-foreground">
              Whether you run a restaurant, cafe, bar, guest house or hotel — we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {venueTypes.map((type) => (
              <Card key={type.title} className="text-center hover-elevate">
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

      <section className="py-16 lg:py-24 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">See How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Watch Our Explainer</h2>
            <p className="text-muted-foreground">
              See how indexFlow transforms your business in under 2 minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border" style={{ padding: "0", position: "relative" }}>
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <div className="absolute top-0 left-0 right-0 z-10 text-center pt-3 transition-opacity duration-1000 hotel-video-title">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full">Hotels Explainer</span>
                </div>
                <iframe
                  src="https://player.vimeo.com/video/1163746208?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  title="indexFlow Video 2"
                  data-testid="explainer-video-2"
                />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border" style={{ padding: "0", position: "relative" }}>
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <div className="absolute top-0 left-0 right-0 z-10 text-center pt-3 transition-opacity duration-1000 resto-video-title">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full">Restaurant, Cafe & Bars</span>
                </div>
                <iframe
                  src="https://player.vimeo.com/video/1163806770?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  title="Restaurant Cafe Bars Explainer"
                  data-testid="explainer-video-3"
                />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border" style={{ padding: "0", position: "relative" }}>
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <iframe
                  src="https://player.vimeo.com/video/1163536827?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  title="RESTO WEBSITE VIDEO EXPLAINER"
                  data-testid="explainer-video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Simple Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get Started Today
            </h2>
            <p className="text-muted-foreground">
              Choose the plan that fits your business.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Complete Solution */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 lg:p-10 relative overflow-visible border shadow-[0_0_25px_rgba(147,197,253,0.25)]">
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-400 text-black border-0 shadow-[0_0_15px_rgba(234,179,8,0.6)]">Most Popular</Badge>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Complete Solution</p>
              <h3 className="text-2xl font-bold mb-4">Website + AI Booking</h3>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">$299</span>
                  <span className="text-muted-foreground text-sm">p/mo</span>
                </div>
                <p className="text-muted-foreground mt-1">+ $499 one-time setup fee</p>
              </div>
              
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Hospitality website</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Virtual Concierge <span className="text-xs">(AI booking widget)</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Real-time AI responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Twilio voice & SMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Pre-paid reservations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Multi-language support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">SMS & email confirmations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Calendar integrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Waitlist management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Guest preferences tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Automated reminders</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Analytics & insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Special requests handling</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Cancel anytime, no contracts</span>
                </div>
              </div>
              
              <Link href="/contact">
                <Button size="lg" className="w-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500" data-testid="button-pricing-complete">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Virtual Concierge - Widget Only */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 lg:p-10 relative overflow-visible border shadow-[0_0_25px_rgba(147,197,253,0.25)]">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500 text-white border-0 shadow-[0_0_15px_rgba(59,130,246,0.6)]">Great Value</Badge>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Widget Only</p>
              <h3 className="text-2xl font-bold mb-4">Virtual Concierge</h3>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">$149</span>
                  <span className="text-muted-foreground text-sm">p/mo</span>
                </div>
                <p className="text-muted-foreground mt-1">No setup fee</p>
              </div>
              
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">AI booking widget</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Embed on your website <span className="text-xs">in 3mins</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Real-time AI responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Client dashboard access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Pre-paid reservations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Multi-language support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Calendar integrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Waitlist management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Guest preferences tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Automated reminders</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Analytics & insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Special requests handling</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/90 text-sm">Cancel anytime, no contracts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Twilio upgrade <span className="text-xs">(optional)</span></span>
                </div>
              </div>
              
              <Link href="/contact">
                <Button size="lg" className="w-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500" data-testid="button-pricing-widget">
                  I Want This! <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div className="mb-4 pb-4 border-b">
                  <h3 className="text-lg font-bold text-muted-foreground">Both Plans Include</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  {pricingFeatures.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 py-4 border-t border-b">
                  <div className="flex items-center gap-2 flex-1">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm">Full Automation</span>
                    <span className="text-xs text-muted-foreground">— AI handles calls, texts & bookings 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm">BYOK (AI)</span>
                    <span className="text-xs text-muted-foreground">— Bring your own API key</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground pt-4">
                  <span className="font-semibold">Included:</span> Rank Tracker with up to 1,000 keywords (type or upload CSV). Free weekly scans of all keywords across Google & AI search engines. 5 free on-demand credits to get started (250 keyword cap per credit scan). <span className="font-semibold">Optional:</span> One-time SEO package available for additional visibility. <a href="/contact" className="underline hover:text-foreground">Contact our sales team</a>
                </p>
              </div>

              <div>
                <div className="mb-4 pb-4 border-b">
                  <h3 className="text-lg font-bold text-muted-foreground">How AI Concierge Works</h3>
                </div>
                
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    The AI concierge handles live chat inquiries on your website, and it also receives phone calls via your Twilio customer service number.
                  </p>
                  <p>
                    It answers, replies and books pre-paid reservations; your guests receive instant SMS confirmations + email reminders.
                  </p>
                  <p>
                    Your workspace gets alerted to an RSVP confirmation, and your front desk immediately processes the booking.
                  </p>
                  <p className="font-semibold text-foreground">
                    AI Concierge never sleeps, never gets tired & never misses a booking! Even when your front desk is closed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Why Choose indexFlow</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              The Smart Choice
            </h2>
            <p className="text-muted-foreground">
              Zero Tech Stress. Maximum Bookings.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <Card key={item.title} className="hover-elevate shadow-[0_0_20px_rgba(59,130,246,0.15)]">
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

      <section className="py-16 lg:py-24 relative overflow-hidden bg-accent/40">
        {/* Animated background */}
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
              <Card key={testimonial.author} className="hover-elevate">
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

      {/* Bespoke Web Design Section */}
      <section className="py-16 lg:py-24 border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Custom Sites</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Bespoke Web Design
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your business is unique and your website should be too. We craft custom designs that capture your brand's personality, and sets you apart from the competition.
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary via-blue-500 to-purple-500 hover:from-primary/90 hover:via-blue-500/90 hover:to-purple-500/90 text-white px-8 py-6 text-lg font-semibold shadow-lg" data-testid="button-bespoke-design">
                Build My Custom Site <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Shooting stars */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Star 1 */}
          <div className="absolute top-[10%] animate-[shootingStar_8s_ease-in_infinite]" style={{ left: '-150px' }}>
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[120px] h-[2px] bg-gradient-to-l from-white via-yellow-200 to-transparent" />
            </div>
          </div>
          {/* Star 2 */}
          <div className="absolute top-[25%] animate-[shootingStar_10s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '3s' }}>
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full shadow-[0_0_8px_3px_rgba(255,255,200,0.7)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[80px] h-[1.5px] bg-gradient-to-l from-yellow-100 via-yellow-300/50 to-transparent" />
            </div>
          </div>
          {/* Star 3 */}
          <div className="absolute top-[45%] animate-[shootingStar_9s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '1.5s' }}>
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_5px_rgba(255,255,255,0.9)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[150px] h-[2px] bg-gradient-to-l from-white via-amber-100 to-transparent" />
            </div>
          </div>
          {/* Star 4 */}
          <div className="absolute top-[60%] animate-[shootingStar_12s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '5s' }}>
            <div className="relative">
              <div className="w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_6px_2px_rgba(255,255,180,0.6)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[60px] h-[1px] bg-gradient-to-l from-yellow-200 to-transparent" />
            </div>
          </div>
          {/* Star 5 */}
          <div className="absolute top-[75%] animate-[shootingStar_11s_ease-in_infinite]" style={{ left: '-150px', animationDelay: '7s' }}>
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />
              <div className="absolute top-1/2 right-full -translate-y-1/2 w-[100px] h-[2px] bg-gradient-to-l from-white via-yellow-100 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main headline */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">Every Call Answered.<br className="sm:hidden" /> Every Seat Booked.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The Booking Engine That Never Sleeps.
            </p>
          </div>
          
          {/* Pricing cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                <div className="text-3xl font-bold text-white mb-2">$299</div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">/mo subscription</div>
                <div className="mt-3 text-gray-400 text-sm">+ $499 One-time Setup</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                <div className="text-3xl font-bold text-white mb-2">5-20 Days</div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">To Go Live</div>
                <div className="mt-3 text-gray-400 text-sm">Fast implementation</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                <div className="text-3xl font-bold text-white mb-2">No Lock-in</div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">Cancel Anytime</div>
                <div className="mt-3 text-gray-400 text-sm">Zero contracts</div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2 bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl" data-testid="button-cta-demo">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg" data-testid="button-cta-portfolio">
                View Website Designs
              </Button>
            </Link>
          </div>
          
          {/* Trust badge */}
          <p className="mt-8 text-gray-400 text-sm">
            Subscription begins only after client sign off.
          </p>
        </div>
      </section>

      <section className="py-20 bg-muted/30" data-testid="locations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              Global Coverage
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Serving Hospitality Businesses Worldwide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From New York to Tokyo, London to Sydney—indexFlow powers reservations for venues in 50+ major cities.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link href="/locations/new-york">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">New York</h3>
                    <p className="text-sm text-muted-foreground">USA</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/london">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">London</h3>
                    <p className="text-sm text-muted-foreground">United Kingdom</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/paris">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Paris</h3>
                    <p className="text-sm text-muted-foreground">France</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/tokyo">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Tokyo</h3>
                    <p className="text-sm text-muted-foreground">Japan</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/sydney">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Sydney</h3>
                    <p className="text-sm text-muted-foreground">Australia</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/dubai">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Dubai</h3>
                    <p className="text-sm text-muted-foreground">UAE</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/singapore">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Singapore</h3>
                    <p className="text-sm text-muted-foreground">Singapore</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/locations/miami">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Miami</h3>
                    <p className="text-sm text-muted-foreground">USA</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="text-center">
            <Button variant="outline" asChild data-testid="button-view-locations">
              <Link href="/locations">
                View All 50+ Cities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CMSPartners />
    </Layout>
  );
}
