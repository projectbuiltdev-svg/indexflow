import { Link } from "wouter";
import { ExternalLink, ArrowRight, Utensils, Coffee, Wine, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const templates = [
  {
    id: 1,
    name: "Fine Dining",
    category: "restaurant",
    description: "Elegant design for upscale restaurants with reservation focus",
    color: "from-amber-500/30 to-orange-600/30",
    features: ["Online Booking", "Menu Display", "Gallery", "AI Phone"],
  },
  {
    id: 2,
    name: "Casual Eatery",
    category: "restaurant",
    description: "Friendly, approachable design for family restaurants",
    color: "from-green-500/30 to-emerald-600/30",
    features: ["Quick Booking", "Daily Specials", "Reviews", "AI Phone"],
  },
  {
    id: 3,
    name: "Coffee House",
    category: "cafe",
    description: "Warm, inviting design for cafes and coffee shops",
    color: "from-yellow-500/30 to-amber-600/30",
    features: ["Menu Board", "Location Map", "Hours", "Contact Form"],
  },
  {
    id: 4,
    name: "Artisan Bakery",
    category: "cafe",
    description: "Rustic charm for bakeries and patisseries",
    color: "from-orange-400/30 to-red-500/30",
    features: ["Product Gallery", "Pre-Orders", "Catering", "AI Phone"],
  },
  {
    id: 5,
    name: "Cocktail Lounge",
    category: "bar",
    description: "Sophisticated dark theme for upscale bars",
    color: "from-purple-500/30 to-pink-600/30",
    features: ["Drink Menu", "Events", "Reservations", "AI Phone"],
  },
  {
    id: 6,
    name: "Sports Bar",
    category: "bar",
    description: "Energetic design for sports bars and pubs",
    color: "from-blue-500/30 to-indigo-600/30",
    features: ["Game Schedule", "Specials", "Table Booking", "AI Phone"],
  },
  {
    id: 7,
    name: "Boutique Hotel",
    category: "hotel",
    description: "Luxurious design for boutique hotels and inns",
    color: "from-slate-500/30 to-zinc-600/30",
    features: ["Room Booking", "Amenities", "Gallery", "Concierge AI"],
  },
  {
    id: 8,
    name: "Resort & Spa",
    category: "hotel",
    description: "Relaxing design for resorts and spa hotels",
    color: "from-cyan-500/30 to-teal-600/30",
    features: ["Room Types", "Spa Booking", "Packages", "Concierge AI"],
  },
];

const categoryIcons: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  cafe: Coffee,
  bar: Wine,
  hotel: Building2,
};

export default function Templates() {
  return (
    <Layout>
      <SEO {...seoData.templates} />
      <section className="bg-gradient-to-b from-accent/30 to-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Template Library</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Choose Your <span className="text-primary">Starting Point</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of professionally designed templates. We'll customize any of these to match your brand perfectly.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => {
              const Icon = categoryIcons[template.category];
              return (
                <Card key={template.id} className="hover-elevate group overflow-hidden" data-testid={`template-${template.id}`}>
                  <div className={`aspect-[4/3] bg-gradient-to-br ${template.color} flex flex-col items-center justify-center p-4 relative`}>
                    <Icon className="w-12 h-12 text-foreground/70 mb-2" />
                    <p className="font-bold text-lg text-foreground/90">{template.name}</p>
                    <Badge variant="outline" className="mt-2 capitalize text-xs">{template.category}</Badge>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Don't See What You Need?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Every template is fully customizable. Tell us about your business and we'll create a design that perfectly matches your brand.
              </p>
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-templates-cta">
                  Get a Custom Design <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Every Template Includes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-card rounded-lg border">
              <p className="font-semibold">Mobile-First Design</p>
              <p className="text-sm text-muted-foreground">Looks great on every device</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <p className="font-semibold">Booking System</p>
              <p className="text-sm text-muted-foreground">24/7 online reservations</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <p className="font-semibold">AI Phone Assistant</p>
              <p className="text-sm text-muted-foreground">Never miss a call</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <p className="font-semibold">Fast Loading</p>
              <p className="text-sm text-muted-foreground">Optimized for speed</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
