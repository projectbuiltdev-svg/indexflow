import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
  Building,
  MapPin,
  Quote,
  ChevronDown,
  ChevronUp,
  Utensils,
  Hotel,
  Coffee,
  Wine,
  Zap,
  Phone,
  Globe,
  Target,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

interface CaseStudy {
  slug: string;
  business: string;
  category: "Restaurant" | "Hotel" | "Cafe" | "Bar";
  location: string;
  heroStat: string;
  heroLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  solutionBullets: string[];
  results: { label: string; value: string; icon: typeof TrendingUp }[];
  quote: string;
  quotePerson: string;
  quoteRole: string;
  timeline: string;
  productsUsed: string[];
}

const categoryConfig = {
  Restaurant: { icon: Utensils, gradient: "from-orange-500 to-red-500", bg: "bg-orange-500/10 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-500/20" },
  Hotel: { icon: Hotel, gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-500/10 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/20" },
  Cafe: { icon: Coffee, gradient: "from-amber-500 to-yellow-600", bg: "bg-amber-500/10 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20" },
  Bar: { icon: Wine, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400", ring: "ring-purple-500/20" },
};

const caseStudies: CaseStudy[] = [
  {
    slug: "la-bella-italia",
    business: "La Bella Italia",
    category: "Restaurant",
    location: "New York, NY",
    heroStat: "+40%",
    heroLabel: "Revenue Increase",
    summary: "A family-run Italian restaurant in Manhattan turned missed after-hours calls into booked tables with indexFlow's AI phone assistant and online booking system.",
    challenge: "La Bella Italia was losing an estimated 15-20 reservation calls per week outside business hours. Their paper-based booking system led to frequent double bookings, and staff spent over 2 hours daily managing phone enquiries instead of serving guests.",
    solution: "indexFlow deployed the Complete Solution package including a custom website, AI-powered phone assistant, and online booking widget.",
    solutionBullets: [
      "AI phone assistant handles calls 24/7 in English and Italian",
      "Prepaid reservation feature reduced weekend no-shows",
      "Custom website with integrated booking widget",
      "SMS confirmations and automated reminders",
    ],
    results: [
      { label: "Revenue Growth", value: "+40%", icon: TrendingUp },
      { label: "After-Hours Bookings", value: "85/mo", icon: Phone },
      { label: "No-Show Rate", value: "-75%", icon: Target },
      { label: "Staff Hours Saved", value: "14h/wk", icon: Clock },
    ],
    quote: "We stopped missing after-hours calls. The AI books tables while we sleep. Revenue is up 40%.",
    quotePerson: "Maria Santos",
    quoteRole: "Owner, La Bella Italia",
    timeline: "5 days",
    productsUsed: ["AI Phone", "Website", "Booking Widget", "SMS"],
  },
  {
    slug: "sakura-grand-hotel",
    business: "Sakura Grand Hotel",
    category: "Hotel",
    location: "Tokyo, Japan",
    heroStat: "+35%",
    heroLabel: "Direct Bookings",
    summary: "A 45-room boutique hotel in Shibuya increased direct bookings by 35% and reduced OTA dependency by building a modern website with real-time room availability and an AI concierge.",
    challenge: "Sakura Grand was paying 15-22% commission on over 80% of bookings through OTAs. Their outdated website had no real-time availability and phone staff couldn't handle enquiries in both Japanese and English during peak tourist season.",
    solution: "indexFlow built a bilingual website with real-time room booking, integrated an AI phone concierge, and implemented SEO targeting tourist search terms.",
    solutionBullets: [
      "Bilingual website with real-time room availability",
      "AI phone concierge fluent in Japanese and English",
      "SEO targeting tourist search terms",
      "Rank tracker monitoring 200+ keywords weekly",
    ],
    results: [
      { label: "Direct Bookings", value: "+35%", icon: TrendingUp },
      { label: "Commission Saved", value: "$4.2K/mo", icon: BarChart3 },
      { label: "Phone Coverage", value: "24/7", icon: Phone },
      { label: "Google Rankings", value: "12 Page 1", icon: Globe },
    ],
    quote: "Our direct bookings increased by 35%, reducing our reliance on OTAs. The AI concierge answers in Japanese and English flawlessly.",
    quotePerson: "Yuki Tanaka",
    quoteRole: "Hotel Manager, Sakura Grand",
    timeline: "8 days",
    productsUsed: ["AI Concierge", "Room Booking", "SEO", "Rank Tracker"],
  },
  {
    slug: "spice-route",
    business: "Spice Route",
    category: "Restaurant",
    location: "Dubai, UAE",
    heroStat: "+70%",
    heroLabel: "Booking Efficiency",
    summary: "A multi-location restaurant group across Dubai unified booking management and AI phone handling across three venues, improving efficiency by 70%.",
    challenge: "Managing reservations across three locations with separate systems was chaotic. Staff at each location spent hours coordinating, and guests calling the wrong location were often lost entirely. The brand had no unified online presence.",
    solution: "indexFlow's multi-location setup gave Spice Route a single dashboard managing all three locations with intelligent call routing.",
    solutionBullets: [
      "Single dashboard managing all three locations",
      "AI phone system routes calls to correct location",
      "Arabic and English language support",
      "Individual location pages driving bookings to each workspace",
    ],
    results: [
      { label: "Booking Efficiency", value: "+70%", icon: Zap },
      { label: "Lost Calls", value: "-90%", icon: Phone },
      { label: "Venues Managed", value: "3 in 1", icon: Building },
      { label: "Languages", value: "AR + EN", icon: Globe },
    ],
    quote: "One dashboard to manage all venues, separate analytics for each, and the AI phone system handles Arabic and English.",
    quotePerson: "Fatima Al-Rashid",
    quoteRole: "Managing Director, Spice Route",
    timeline: "10 days",
    productsUsed: ["Multi-Location", "AI Phone", "Website", "Analytics"],
  },
  {
    slug: "rooftop-social",
    business: "Rooftop Social",
    category: "Bar",
    location: "Sydney, Australia",
    heroStat: "0%",
    heroLabel: "No-Show Rate",
    summary: "A premium rooftop bar eliminated no-shows entirely with prepaid bookings and resource-based capacity management for different zones.",
    challenge: "Rooftop Social lost an estimated $3,000 per month from no-shows on premium terrace tables. Their booking system couldn't handle different capacity zones (indoor bar, covered terrace, open rooftop) or weather-dependent availability changes.",
    solution: "indexFlow configured resource management for three distinct zones with independent capacities and prepaid booking for premium areas.",
    solutionBullets: [
      "Three distinct zones with independent capacities",
      "Prepaid bookings for premium terrace tables",
      "AI phone system with real-time zone availability",
      "Weather-dependent availability management",
    ],
    results: [
      { label: "No-Show Rate", value: "0%", icon: Target },
      { label: "Revenue Recovered", value: "$3K/mo", icon: TrendingUp },
      { label: "Zones Managed", value: "3", icon: Building },
      { label: "Weekend Bookings", value: "+45%", icon: BarChart3 },
    ],
    quote: "The prepaid booking feature for our premium terrace tables eliminated no-shows completely. Game changer.",
    quotePerson: "Ben Walker",
    quoteRole: "Co-Owner, Rooftop Social",
    timeline: "4 days",
    productsUsed: ["Prepaid Booking", "Resource Mgmt", "AI Phone", "SMS"],
  },
  {
    slug: "fika-stockholm",
    business: "Fika Stockholm",
    category: "Cafe",
    location: "Singapore",
    heroStat: "~0%",
    heroLabel: "No-Show Rate",
    summary: "A specialty Scandinavian caf\u00e9 with limited seating transformed morning rush operations with pre-orders and SMS confirmations, reducing no-shows to near zero.",
    challenge: "With only 24 seats, every empty reserved table cost Fika real revenue. Morning rushes were chaotic with phone orders mixed with walk-ins, and the single staff member couldn't answer calls while making coffee.",
    solution: "indexFlow's widget enabled online pre-ordering for pickup alongside table reservations with smart SMS-based attendance management.",
    solutionBullets: [
      "Online pre-ordering for pickup alongside reservations",
      "SMS confirmations and automated reminders",
      "AI phone assistant during busy periods",
      "Waitlist management for walk-ins",
    ],
    results: [
      { label: "No-Shows", value: "~0%", icon: Target },
      { label: "Pre-Orders", value: "40+/day", icon: Zap },
      { label: "Phone Interruptions", value: "-95%", icon: Phone },
      { label: "Morning Revenue", value: "+25%", icon: TrendingUp },
    ],
    quote: "Having the AI handle calls and bookings has been life-changing. SMS confirmations reduced no-shows to nearly zero.",
    quotePerson: "Lisa Andersson",
    quoteRole: "Owner, Fika Stockholm",
    timeline: "3 days",
    productsUsed: ["Booking Widget", "SMS", "AI Phone", "Waitlist"],
  },
];

const heroStats = [
  { value: "40%", label: "Avg. Revenue Increase" },
  { value: "5", label: "Industries Served" },
  { value: "3-10", label: "Days to Go Live" },
  { value: "0%", label: "Best No-Show Rate" },
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = categoryConfig[study.category];
  const CategoryIcon = config.icon;

  return (
    <Card className="overflow-visible" data-testid={`card-case-study-${index}`}>
      <CardContent className="p-0">
        <div
          className="cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          data-testid={`button-toggle-study-${index}`}
        >
          <div className={`h-1.5 rounded-t-md bg-gradient-to-r ${config.gradient}`} />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <CategoryIcon className={`w-6 h-6 ${config.text}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-bold">{study.business}</h2>
                      <Badge variant="secondary">{study.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {study.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Live in {study.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {study.heroStat}
                      </div>
                      <div className="text-xs text-muted-foreground">{study.heroLabel}</div>
                    </div>
                    <div className="text-muted-foreground">
                      {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{study.summary}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="border-t" />

          <div className="grid sm:grid-cols-4 border-b">
            {study.results.map((r, i) => {
              const ResultIcon = r.icon;
              return (
                <div
                  key={i}
                  className={`p-4 sm:p-5 text-center ${i < study.results.length - 1 ? "sm:border-r" : ""} ${i < study.results.length - 1 ? "border-b sm:border-b-0" : ""}`}
                >
                  <ResultIcon className={`w-5 h-5 mx-auto mb-2 ${config.text}`} />
                  <div className="text-xl sm:text-2xl font-bold">{r.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.label}</div>
                </div>
              );
            })}
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-destructive text-xs font-bold">!</span>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Challenge</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed pl-7">{study.challenge}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Zap className={`w-3 h-3 ${config.text}`} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Solution</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed pl-7 mb-3">{study.solution}</p>
              <ul className="space-y-2 pl-7">
                {study.solutionBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.text}`} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 rounded-md bg-muted/50 p-5 relative">
            <Quote className={`w-8 h-8 absolute -top-3 -left-1 ${config.text} opacity-30`} />
            <blockquote className="text-sm sm:text-base italic text-foreground/80 leading-relaxed pl-4">
              "{study.quote}"
            </blockquote>
            <div className="flex items-center gap-3 mt-4 pl-4">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {study.quotePerson.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{study.quotePerson}</div>
                <div className="text-xs text-muted-foreground">{study.quoteRole}</div>
              </div>
            </div>
          </div>

          <div className="border-t px-5 sm:px-6 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Products used:</span>
              {study.productsUsed.map((product) => (
                <Badge key={product} variant="outline" className="text-xs">
                  {product}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="Case Studies | indexFlow"
        description="In-depth success stories from restaurants, cafes, bars, and hotels using indexFlow. See the real numbers behind our clients' growth."
        canonicalUrl="/case-studies"
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:to-primary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Success Stories
            </Badge>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight"
              data-testid="text-page-title"
            >
              Real Results.{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Real Businesses.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              See how businesses around the world transformed their operations,
              increased revenue, and eliminated no-shows with indexFlow.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {heroStats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {caseStudies.length} case studies across {Object.keys(categoryConfig).length} industries
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(categoryConfig).map(([cat, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <Badge key={cat} variant="outline" className="gap-1">
                    <Icon className={`w-3 h-3 ${cfg.text}`} />
                    {cat}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {caseStudies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Ready to become our next success story?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Join hundreds of businesses already growing with indexFlow.
                Your first consultation is free.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/book-demo">
                  <Button size="lg" data-testid="button-book-demo">
                    Book a Demo
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" data-testid="button-view-pricing">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
