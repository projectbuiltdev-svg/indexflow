import { Link } from "wouter";
import { Globe, Smartphone, Search, MessageSquare, UtensilsCrossed, Image, MapPin, Zap, Link2, CheckCircle, ArrowRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First Responsive Design",
    description: "Every website is built mobile-first, ensuring a flawless experience on phones, tablets, and desktops.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built with structured data, fast load times, and keyword-rich content to rank higher on Google.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: MessageSquare,
    title: "Integrated Booking Widget",
    description: "Our AI booking widget is built right into your site, letting guests book without leaving the page.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: UtensilsCrossed,
    title: "Menu & Room Displays",
    description: "Beautiful, easy-to-update menu pages for restaurants or room galleries for hotels and B&Bs.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Image,
    title: "Photo Galleries",
    description: "Showcase your business with stunning, optimized photo galleries that load fast and look incredible.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: MapPin,
    title: "Google Maps Integration",
    description: "Embedded maps with directions, helping guests find your business effortlessly.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Zap,
    title: "Fast Loading Speed",
    description: "Optimized images, lazy loading, and modern frameworks deliver sub-second page loads.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Link2,
    title: "Custom Domain",
    description: "Your website on your own domain — professionally branded and fully managed by our team.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

const benefits = [
  "Professional online presence that reflects your brand identity",
  "Built to convert visitors into paying guests with clear CTAs",
  "Fully managed for you — we handle hosting, updates, and security",
  "Regular updates via change requests — just tell us what you need",
];

export default function HospitalityWebsitesPage() {
  return (
    <Layout>
      <SEO {...seoData.businessWebsites} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Palette className="w-3 h-3 mr-1" />
              Custom Websites
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Bespoke Websites{" "}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Built to Convert
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Custom-designed websites that drive reservations.
              Beautiful, fast, and SEO-optimized — with integrated AI booking built in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/templates">
                <Button size="lg" className="gap-2" data-testid="button-websites-templates">
                  View Templates <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-websites-demo">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for the Hospitality Industry</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed to help venues look professional and convert visitors.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
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

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Globe className="w-3 h-3 mr-1" />
                Why Choose Us
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                More Than Just a Website
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <p className="text-sm text-muted-foreground">Websites Launched</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">&lt;2s</div>
                <p className="text-sm text-muted-foreground">Page Load Time</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">SSL</div>
                <p className="text-sm text-muted-foreground">Secure by Default</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for a Website That Works as Hard as You Do?</h2>
          <p className="text-muted-foreground mb-8">
            Get a bespoke website designed and built specifically for your business.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/templates">
              <Button size="lg" className="gap-2" data-testid="button-websites-bottom-templates">
                View Templates <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" data-testid="button-websites-bottom-demo">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
