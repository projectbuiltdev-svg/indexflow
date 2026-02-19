import { Link } from "wouter";
import { Check, ArrowRight, Users, Layers, Building2, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { PageSubNav } from "@/components/page-sub-nav";
import { SEO, seoData } from "@/components/seo";

const pricingSections = [
  { id: "plans", label: "Plans" },
  { id: "included", label: "What's Included" },
  { id: "compare", label: "Compare" },
  { id: "faq", label: "FAQ" },
];

const sharedFeatures = [
  "40 AI-generated posts per workspace/month",
  "Content grading on all posts",
  "Rank Tracker (1,000 keywords/workspace)",
  "1 free weekly rank refresh (auto-applied)",
  "Local Search Grid (5x5, weekly scan)",
  "Google Search Console integration",
  "Full CRM per workspace",
  "All 5 CMS integrations",
  "Link Builder + Post Validator",
  "On-Page SEO Auditor",
  "Site Profiler",
  "Schema Markup (20+ types, auto-detect)",
  "AI Widget per workspace",
  "Twilio voice & SMS per workspace",
  "Domain mapping per workspace",
  "Invoicing per workspace",
  "Link Health monitoring (auto-applied)",
  "BYOK for all providers",
  "Multi-language support",
];

const plans = [
  {
    name: "Solo",
    price: "$99",
    annualPrice: "$83",
    description: "For solo founders, freelancers, and consultants",
    users: "1 user",
    workspaces: "1 workspace",
    highlight: false,
    features: [
      "1 user",
      "1 workspace",
      "40 AI posts/month",
      "All core SEO tools",
      "Full CRM",
      "All 5 CMS integrations",
      "AI Widget",
      "Twilio integration",
      "BYOK for all providers",
      "Email support",
    ],
    cta: "Get Started",
    icon: Users,
  },
  {
    name: "Professional",
    price: "$299",
    annualPrice: "$249",
    description: "For growing agencies and teams",
    users: "3 users",
    workspaces: "3 workspaces (up to 50)",
    highlight: true,
    features: [
      "3 users",
      "3 workspaces (buy up to 50)",
      "40 AI posts/workspace/month",
      "Bulk content campaigns",
      "Team roles & permissions",
      "All core SEO tools",
      "Full CRM per workspace",
      "All 5 CMS integrations",
      "Advanced reports with snapshots",
      "Email + ticket support",
    ],
    cta: "Get Started",
    icon: Layers,
  },
  {
    name: "White Label Agency",
    price: "$499",
    annualPrice: "$416",
    description: "For agencies reselling under their own brand",
    users: "6 users",
    workspaces: "100 workspaces (up to 150)",
    highlight: false,
    features: [
      "6 users",
      "100 workspaces (up to 150)",
      "Full white label branding",
      "Custom domain",
      "Content moderation tools",
      "Bulk content campaigns",
      "All core SEO tools",
      "Dedicated account manager",
      "Advanced reports with snapshots",
      "Email + tickets + chat support",
    ],
    cta: "Get Started",
    icon: Building2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    annualPrice: "Custom",
    description: "For large agencies and reseller networks",
    users: "Unlimited users",
    workspaces: "Unlimited workspaces",
    highlight: false,
    features: [
      "Unlimited users & workspaces",
      "Super Admin Dashboard",
      "Multi-tenant reseller mode",
      "API access",
      "Custom feature flags",
      "SSO / SAML authentication",
      "Dedicated infrastructure",
      "SLA with uptime guarantee",
      "Onboarding & training",
      "Full support (email, tickets, chat, phone)",
    ],
    cta: "Contact Sales",
    icon: Crown,
  },
];

const compareRows = [
  { feature: "Users", solo: "1", pro: "3", whiteLabel: "6", enterprise: "Unlimited" },
  { feature: "Workspaces", solo: "1", pro: "3 (up to 50)", whiteLabel: "100 (up to 150)", enterprise: "Unlimited" },
  { feature: "White label", solo: false, pro: false, whiteLabel: true, enterprise: true },
  { feature: "Custom domain", solo: false, pro: false, whiteLabel: true, enterprise: true },
  { feature: "Super Admin Dashboard", solo: false, pro: false, whiteLabel: false, enterprise: true },
  { feature: "Multi-tenant reseller", solo: false, pro: false, whiteLabel: false, enterprise: true },
  { feature: "Team roles", solo: false, pro: true, whiteLabel: true, enterprise: true },
  { feature: "Bulk campaigns", solo: false, pro: true, whiteLabel: true, enterprise: true },
  { feature: "Content moderation", solo: false, pro: false, whiteLabel: true, enterprise: true },
  { feature: "API access", solo: false, pro: false, whiteLabel: false, enterprise: true },
  { feature: "SSO / SAML", solo: false, pro: false, whiteLabel: false, enterprise: true },
  { feature: "Dedicated infrastructure", solo: false, pro: false, whiteLabel: false, enterprise: true },
  { feature: "SLA guarantee", solo: false, pro: false, whiteLabel: false, enterprise: true },
];

const faqs = [
  {
    q: "What's the same across all plans?",
    a: "Every plan includes 40 AI posts per workspace per month, Rank Tracker (1,000 keywords), Local Search Grid (5x5), Google Search Console, full CRM, all 5 CMS integrations, Link Builder, Post Validator, On-Page Auditor, Site Profiler, Schema Markup, AI Widget, Twilio, domain mapping, invoicing, Link Health monitoring, BYOK, and multi-language support.",
  },
  {
    q: "Can I buy additional workspaces?",
    a: "Yes. On the Professional plan, you can purchase additional workspaces up to 50 total. White Label supports up to 150. Enterprise is unlimited.",
  },
  {
    q: "How do Rank Tracker credits work?",
    a: "Every workspace gets 1 free keyword refresh per calendar week, auto-applied every Monday. Need instant refreshes? Buy credits: 5 for $10 or 25 for $35.",
  },
  {
    q: "How does the Local Search Grid work?",
    a: "Each workspace gets 1 free weekly 5x5 grid scan, auto-applied. Buy instant scan credits: 5 for $10 or 25 for $35.",
  },
  {
    q: "What does white label include?",
    a: "Upload your logo, set your brand name, pick brand colors, configure a custom domain, and set your support email. Your clients see your brand everywhere - IndexFlow branding is completely hidden.",
  },
  {
    q: "What is BYOK?",
    a: "Bring Your Own Key. Connect your own API keys for AI providers (OpenAI, Anthropic, Google AI, Grok, Mistral, Cohere, Perplexity), image banks (Unsplash, Pexels, Pixabay), payment processors (Stripe, PayPal), and Twilio. All keys encrypted with AES-256-GCM.",
  },
  {
    q: "Is there annual pricing?",
    a: "Yes. Pay annually and get 2 months free (pay for 10, get 12). Solo drops to $83/mo, Professional to $249/mo, and White Label to $416/mo.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. Cancel your subscription at any time.",
  },
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
                Pricing
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-pricing-title">
                One Platform, Transparent Pricing
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-pricing-subtitle">
                Every plan includes the full SEO and content toolkit. Pick the tier that matches your team size and client count.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Annual billing: 2 months free (pay for 10, get 12)
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative overflow-visible ${plan.highlight ? "shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""}`}
                  data-testid={`card-pricing-${plan.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-black border-0 shadow-[0_0_20px_rgba(234,179,8,0.5)]" data-testid="badge-popular">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8 pb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <plan.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl" data-testid={`text-plan-name-${plan.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent" data-testid={`text-price-${plan.name.toLowerCase().replace(/\s+/g, "-")}`}>
                          {plan.price}
                        </span>
                        {plan.price !== "Custom" && <span className="text-muted-foreground text-sm">/mo</span>}
                      </div>
                      {plan.annualPrice !== "Custom" && (
                        <p className="text-xs text-muted-foreground mt-1">{plan.annualPrice}/mo billed annually</p>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm" data-testid={`feature-${plan.name.toLowerCase().replace(/\s+/g, "-")}-${index}`}>
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <Link href="/contact" className="w-full">
                      <Button
                        className="w-full"
                        size="default"
                        variant={plan.highlight ? "default" : "outline"}
                        data-testid={`button-get-started-${plan.name.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="included" className="py-16 lg:py-24 bg-accent/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4" data-testid="badge-included">
                Every Plan
              </Badge>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-included-title">
                What's Included in Every Tier
              </h2>
              <p className="text-muted-foreground">
                The full toolkit, no matter which plan you choose.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {sharedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2" data-testid={`shared-feature-${index}`}>
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-lg bg-card border">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Rank Tracker & Grid Credits</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Every workspace gets 1 free weekly rank refresh and 1 free weekly grid scan, auto-applied.
                    Need more? Buy instant credits: 5 for $10 or 25 for $35.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="compare" className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4" data-testid="badge-compare">
                Compare Plans
              </Badge>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-compare-title">
                What Changes Between Tiers
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-compare">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Feature</th>
                    <th className="text-center py-3 px-2 font-medium">Solo</th>
                    <th className="text-center py-3 px-2 font-medium">Professional</th>
                    <th className="text-center py-3 px-2 font-medium">White Label</th>
                    <th className="text-center py-3 px-2 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 px-2 font-medium">{row.feature}</td>
                      {(["solo", "pro", "whiteLabel", "enterprise"] as const).map((tier) => (
                        <td key={tier} className="text-center py-3 px-2">
                          {typeof row[tier] === "boolean" ? (
                            row[tier] ? (
                              <Check className="w-4 h-4 text-primary mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : (
                            <span>{row[tier]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 lg:py-24 bg-accent/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4" data-testid="badge-faq">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-faq-title">
                Common Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i} data-testid={`card-faq-${i}`}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Link href="/contact">
                <Button variant="outline" size="default" data-testid="button-contact-pricing">
                  Contact Us <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
