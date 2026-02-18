import { Link } from "wouter";
import { MapPin, Target, Grid3X3, Users, TrendingUp, BarChart3, Crosshair, Eye, Layers, ArrowRight, CheckCircle, ChevronDown, ChevronUp, DollarSign, X as XIcon, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { useState } from "react";

const gridColors = [
  "bg-green-500", "bg-green-500", "bg-green-400", "bg-yellow-400", "bg-orange-400",
  "bg-green-500", "bg-green-500", "bg-green-400", "bg-yellow-400", "bg-red-400",
  "bg-green-400", "bg-green-400", "bg-green-500", "bg-yellow-400", "bg-orange-400",
  "bg-yellow-400", "bg-yellow-400", "bg-green-400", "bg-orange-400", "bg-red-400",
  "bg-orange-400", "bg-red-400", "bg-yellow-400", "bg-red-400", "bg-red-500",
];

const gridNumbers = [
  1, 2, 3, 5, 8,
  1, 1, 2, 6, 12,
  3, 2, 1, 4, 7,
  5, 6, 3, 9, 14,
  8, 11, 5, 13, 18,
];

const steps = [
  {
    number: 1,
    title: "Enter your location",
    description: "Add your business address and we automatically center the grid on your business. Your Google Business Profile is detected and linked instantly.",
    highlight: "Set Up in Seconds",
  },
  {
    number: 2,
    title: "Choose keywords that matter",
    description: "Select up to 25 keywords that drive foot traffic — cuisine types, 'near me' searches, occasion-based terms, and competitor brand names. We suggest high-impact keywords based on your business type.",
    highlight: "Choose the Keywords",
  },
  {
    number: 3,
    title: "Adjust the grid to your area",
    description: "Your 5x5 grid scans 25 points around your location. Adjust the distance between points to cover the neighborhoods your customers search from. Color-coded pins show exactly where you rank.",
    highlight: "See Where You Rank",
  },
  {
    number: 4,
    title: "Analyze your competitors",
    description: "See which competitors outrank you at each grid point. Identify the top 5 factors holding you back — categories, reviews, proximity, website authority, and GBP completeness.",
    highlight: "Know Your Rivals",
  },
  {
    number: 5,
    title: "Climb the local rankings",
    description: "Use the actionable insights to optimize your Google Business Profile, build citations, and improve reviews. Watch the grid turn green as your rankings rise week over week.",
    highlight: "Watch Rankings Soar",
  },
];

const features = [
  {
    icon: Grid3X3,
    title: "Geo-Grid Rank Tracking",
    description: "See your Google Maps ranking at every point across a customizable grid centered on your business.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Target,
    title: "Hyperlocal Precision",
    description: "Track rankings from exact GPS coordinates — not just city-level. See how you rank street by street.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Competitor Benchmarking",
    description: "Compare your grid performance against up to 20 local competitors at every single grid point.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "On-Demand Progress Tracking",
    description: "Scan whenever you want with pay-as-you-go credits. Compare results over time and watch green dots expand across your grid.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Eye,
    title: "Color-Coded Heatmaps",
    description: "Instantly understand performance: green (#1-3), yellow (#4-7), orange (#8-12), red (#13+). No data expertise needed.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Crosshair,
    title: "25 Keywords per Workspace",
    description: "Track up to 25 high-impact keywords across your entire grid. CSV bulk upload supported for quick setup.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Layers,
    title: "Flexible Coverage",
    description: "Your 5x5 grid covers 25 strategic points. Adjust distance between points from 0.5 to 5 miles to cover neighborhoods, suburbs, or wider areas.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: BarChart3,
    title: "Actionable Insights",
    description: "Get specific recommendations on what to improve — GBP categories, review count, citation gaps, and content opportunities.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const faqs = [
  {
    question: "What is a Local Search Grid?",
    answer: "A local search grid (also called a geo-grid rank tracker) shows how your business ranks on Google Maps across multiple geographic points around your location. Instead of checking your rank from one spot, it checks from a grid of points — giving you the full picture of your local visibility across your entire service area.",
  },
  {
    question: "How is this different from regular rank tracking?",
    answer: "Regular rank tracking checks your position from a single location (usually the city center). But Google results change dramatically based on the searcher's location. A grid tracker checks from 9 to 49 different points around your business, showing you exactly where you rank well and where you need improvement.",
  },
  {
    question: "How does this compare to BrightLocal or Whitespark?",
    answer: "BrightLocal charges $39-79/month and geo-grid scans consume credits — heavy users burn through their allowance fast. Whitespark charges $14-140/month for rank tracking, and their geo-grid product is sold separately starting at $10/month. Both have keyword limits that push you into higher tiers. With indexFlow, geo-grid tracking is built into every plan with simple pay-as-you-go credits at $10 for 5 scans — plus every new account gets a $5 starter credit. And you get a full lead management system, AI phone answering, and website management that neither platform offers.",
  },
  {
    question: "How much does Local Search Grid cost?",
    answer: "Local Search Grid is built into every indexFlow plan. Every new account gets a $5 starter credit, and additional scans are pay-as-you-go — $10 for 5 scans or $35 for 25 scans (save 30%). No monthly subscription fees for the tool itself, no tier upgrades needed.",
  },
  {
    question: "How many keywords can I track?",
    answer: "You can track up to 25 keywords per workspace. This covers all the important searches — your cuisine type, 'near me' terms, occasion-based searches (birthday dinner, date night), and competitor brand names. Most businesses find 15-20 keywords covers everything that matters.",
  },
  {
    question: "How often are rankings updated?",
    answer: "You can scan whenever you want — each scan uses 1 credit. Most businesses scan weekly or after making changes to their Google Business Profile to measure impact. You'll always see the latest scan date and can compare against previous scans to track progress.",
  },
  {
    question: "How does the grid work?",
    answer: "Every workspace uses a 5x5 grid (25 scan points) per scan. You can adjust the distance between points — from 0.5 miles for dense urban neighborhoods to 5 miles for wider suburban coverage. Each point checks your Google Maps ranking at that exact location.",
  },
  {
    question: "What do the colors on the grid mean?",
    answer: "Green means you rank in positions #1-3 (the Google Maps 3-pack — the top spot customers see). Yellow means positions #4-7 (visible but not top). Orange means #8-12 (second page territory). Red means #13 or lower (unlikely to be found). The goal is to turn every dot green across your grid.",
  },
  {
    question: "Do I need a Google Business Profile?",
    answer: "Yes — the grid tracks your ranking in Google Maps and local pack results, which requires a Google Business Profile. If you don't have one yet, we can help you set one up and optimize it as part of our Local Citations service.",
  },
  {
    question: "Can I track multiple locations?",
    answer: "Yes. Each workspace on your indexFlow account gets its own grid with up to 25 keywords. Multi-location brands can compare grid performance across all their workspaces to identify which locations need the most attention and where to focus marketing spend.",
  },
  {
    question: "Do I need SEO experience to use this?",
    answer: "Not at all. The color-coded grid makes results instantly understandable — green is good, red needs work. And because indexFlow is a fully managed platform, our team handles the technical SEO work for you. You just watch the dots turn green.",
  },
  {
    question: "How long before I see results?",
    answer: "Most businesses start seeing improvements within 4-8 weeks of optimizing their Google Business Profile, building citations, and improving reviews. The grid gives you visual proof of progress — you'll literally see red and orange dots shift to yellow and green as your rankings climb.",
  },
];

function GridVisualization() {
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-xs mx-auto">
          {gridNumbers.map((num, i) => (
            <div
              key={i}
              className={`${gridColors[i]} w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md transition-transform`}
              data-testid={`grid-point-${i}`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">#1-3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-muted-foreground">#4-7</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-muted-foreground">#8-12</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">#13+</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
        Live Preview
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-visible">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
        data-testid={`faq-${question.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`}
      >
        <span className="font-semibold text-sm sm:text-base">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </Card>
  );
}

export default function LocalSearchGridPage() {
  return (
    <Layout>
      <SEO {...seoData.localSearchGrid} />

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-4">
                <Grid3X3 className="w-3 h-3 mr-1" />
                Local Search Grid
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                See Where You{" "}
                <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  Really Rank
                </span>{" "}
                on Google Maps
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Your rank changes based on where the customer is searching from.
                Local Search Grid shows your true visibility across your entire neighborhood — not just from one point.
              </p>
              <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  See rank across the map
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Outrank competitors
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Improve visibility
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <Link href="/contact">
                  <Button size="lg" className="gap-2" data-testid="button-grid-hero-demo">
                    Book a Demo <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" data-testid="button-grid-hero-pricing">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <GridVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 5 Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See Where You Rank in Five Easy Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From setup to actionable insights in minutes — no SEO expertise required.
            </p>
          </div>

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-8 lg:py-12" data-testid={`step-${step.number}`}>
                  <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-3" data-testid={`text-step-${step.number}-title`}>{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <Card className="bg-accent/50">
                      <CardContent className="p-6 sm:p-8 flex items-center justify-center min-h-[160px]">
                        {step.number === 1 && (
                          <div className="w-full space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                              <MapPin className="w-5 h-5 text-primary shrink-0" />
                              <div className="text-sm">
                                <div className="font-medium">La Trattoria Downtown</div>
                                <div className="text-xs text-muted-foreground">123 Main Street, New York, NY 10001</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Google Business Profile detected</span>
                            </div>
                          </div>
                        )}
                        {step.number === 2 && (
                          <div className="w-full space-y-2">
                            {["italian restaurant near me", "best pasta downtown", "date night restaurant nyc", "italian food delivery"].map((kw) => (
                              <div key={kw} className="flex items-center gap-2 p-2 rounded-lg bg-background border text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="truncate">{kw}</span>
                              </div>
                            ))}
                            <div className="text-xs text-muted-foreground text-center mt-2">4 of 25 keywords selected</div>
                          </div>
                        )}
                        {step.number === 3 && (
                          <div className="space-y-4 w-full">
                            <div className="grid grid-cols-3 gap-2 max-w-[140px] mx-auto">
                              {[2, 1, 4, 1, 1, 3, 5, 2, 7].map((n, i) => {
                                const c = n <= 3 ? "bg-green-500" : n <= 7 ? "bg-yellow-400" : "bg-red-400";
                                return (
                                  <div key={i} className={`${c} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow`}>
                                    {n}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Grid: 5x5</span>
                              <span>Distance: 2 mi</span>
                            </div>
                          </div>
                        )}
                        {step.number === 4 && (
                          <div className="w-full space-y-3">
                            {[
                              { name: "Your Business", rank: 1, color: "text-green-500" },
                              { name: "Mario's Pizza", rank: 3, color: "text-green-500" },
                              { name: "Olive Garden", rank: 5, color: "text-yellow-500" },
                              { name: "Luigi's Trattoria", rank: 8, color: "text-orange-500" },
                            ].map((comp) => (
                              <div key={comp.name} className="flex items-center justify-between p-2 rounded-lg bg-background border text-sm">
                                <span className={comp.name === "Your Business" ? "font-semibold" : ""}>{comp.name}</span>
                                <span className={`font-bold ${comp.color}`}>#{comp.rank}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {step.number === 5 && (
                          <div className="w-full space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-1">
                                {["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-500"].map((c, i) => (
                                  <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-background`} />
                                ))}
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              <div className="flex -space-x-1">
                                {["bg-green-500", "bg-green-500", "bg-green-400", "bg-green-500", "bg-green-500"].map((c, i) => (
                                  <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-background`} />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Week 1</span>
                              <span className="text-green-500 font-semibold">Week 8 — 4x more green</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-6 bottom-0 w-0.5 h-8 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Proof Section */}
      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Eye className="w-3 h-3 mr-1" />
              Visual Proof That Works
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Your Rankings at a Glance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nothing makes progress clearer than watching red dots turn green across your map. Track month-over-month improvements with visual reports anyone can understand.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="grid grid-cols-3 gap-1.5">
                    {"RROOYYGGG".split("").map((c, i) => {
                      const bg = c === "R" ? "bg-red-400" : c === "O" ? "bg-orange-400" : c === "Y" ? "bg-yellow-400" : "bg-green-500";
                      return <div key={i} className={`w-5 h-5 rounded-full ${bg}`} />;
                    })}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Month 1</h3>
                <p className="text-sm text-muted-foreground">Baseline scan reveals weak spots in northern neighborhoods</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="grid grid-cols-3 gap-1.5">
                    {"OYYGYGGYG".split("").map((c, i) => {
                      const bg = c === "R" ? "bg-red-400" : c === "O" ? "bg-orange-400" : c === "Y" ? "bg-yellow-400" : "bg-green-500";
                      return <div key={i} className={`w-5 h-5 rounded-full ${bg}`} />;
                    })}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Month 3</h3>
                <p className="text-sm text-muted-foreground">Citations and GBP optimization start showing results</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="grid grid-cols-3 gap-1.5">
                    {"GGGGGGGGG".split("").map((c, i) => {
                      const bg = c === "R" ? "bg-red-400" : c === "O" ? "bg-orange-400" : c === "Y" ? "bg-yellow-400" : "bg-green-500";
                      return <div key={i} className={`w-5 h-5 rounded-full ${bg}`} />;
                    })}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Month 6</h3>
                <p className="text-sm text-muted-foreground">Full green grid — dominating local search in every direction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Dominate Locally</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for businesses that depend on local foot traffic.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Results That Matter
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Local Visibility That Fills Tables
              </h2>
              <ul className="space-y-4">
                {[
                  "See your true local ranking from every direction around your business",
                  "Identify exactly which neighborhoods need attention",
                  "Track competitor positions across your entire service area",
                  "Watch your coverage expand week over week with visual proof",
                  "Make data-driven decisions that increase foot traffic",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-grid-keywords">25</div>
                <p className="text-sm text-muted-foreground">Keywords per Workspace</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-grid-points">49</div>
                <p className="text-sm text-muted-foreground">Max Grid Points</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-grid-competitors">20</div>
                <p className="text-sm text-muted-foreground">Competitors Tracked</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-grid-frequency">7d</div>
                <p className="text-sm text-muted-foreground">Update Frequency</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <DollarSign className="w-3 h-3 mr-1" />
              Cost Comparison
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Pay-As-You-Go vs Monthly Subscriptions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Other platforms lock you into expensive monthly plans with hidden credit limits. With indexFlow, geo-grid scanning is built in — just buy credits when you need them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* BrightLocal */}
            <Card data-testid="card-compare-brightlocal">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <a href="https://www.brightlocal.com/local-seo-tools/rankings/local-search-grid/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground mb-1 hover:underline">BrightLocal</a>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">$39-79</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">+ credit top-ups for heavy usage</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Geo-grid rank tracking included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>Scans consume credits — heavy users need top-ups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>Higher tiers needed for more locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span>No location summary reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>GBP audit included — but part of $39-79/mo plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Google Search Console integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Whitespark */}
            <Card data-testid="card-compare-whitespark">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <a href="https://whitespark.ca/local-rank-tracker/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground mb-1 hover:underline">Whitespark</a>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">$24-150+</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Rank tracker + geo-grid sold separately</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Accurate local rank tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>Geo-grid is a separate product from $10/mo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>Keyword limits push you to higher tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span>No location summary reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>Basic GBP monitoring — $1/mo per location extra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Google Search Console integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* indexFlow */}
            <Card className="border-primary border-2 relative" data-testid="card-compare-resto">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="shadow-lg">Best Value</Badge>
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">indexFlow</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">$10</span>
                    <span className="text-muted-foreground text-sm">/5 scans</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pay-as-you-go + $5 starter credit</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Geo-grid tracking — up to 25 keywords, 5x5 grid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>$5 starter credit, then PAYG</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Scan on-demand — no waiting for scheduled runs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Location summary reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Credits never expire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Google Search Console integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Stop paying for expensive monthly SEO subscriptions. Get geo-grid tracking, rank tracking, citations, and a complete business platform.<br /><strong>Pay only for the scans you need — every account starts with a $5 credit.</strong>
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-grid-compare-demo">
                Discovery Call <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Who Uses Local Search Grid?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Single-Location Businesses</h3>
                <p className="text-sm text-muted-foreground">
                  Understand your real neighborhood reach. See exactly which streets and areas you dominate — and which ones your competitors own.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Multi-Location Brands</h3>
                <p className="text-sm text-muted-foreground">
                  Compare grid performance across all your locations. Identify which locations need attention and allocate marketing spend where it matters most.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Growth-Focused Owners</h3>
                <p className="text-sm text-muted-foreground">
                  You don't need a marketing degree. The color-coded grid makes it instantly clear what's working and what needs improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See Where You Really Rank?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop guessing. Start seeing the full picture of your local search visibility with a color-coded grid that anyone can understand.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-grid-bottom-demo">
                Book a Demo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/platform/rank-tracking">
              <Button size="lg" variant="outline" data-testid="button-grid-bottom-rank-tracking">
                See Rank Tracking
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
