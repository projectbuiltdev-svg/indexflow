import { useState } from "react";
import { X, ExternalLink, Palette, LayoutGrid, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

function getPreviewUrl(category: string, style: string): string {
  return `/preview/${category.slice(0, -1)}-${style}`;
}

// Import template images (WebP for faster loading)
import restaurantBold from "@/assets/images/templates/restaurant-bold.webp";
import restaurantVibrant from "@/assets/images/templates/restaurant-vibrant.webp";
import restaurantSimple from "@/assets/images/templates/restaurant-simple.webp";
import restaurantMinimalistic from "@/assets/images/templates/restaurant-minimalistic.webp";
import cafeBold from "@/assets/images/templates/cafe-bold.webp";
import cafeVibrant from "@/assets/images/templates/cafe-vibrant.webp";
import cafeSimple from "@/assets/images/templates/cafe-simple.webp";
import cafeMinimalistic from "@/assets/images/templates/cafe-minimalistic.webp";
import barBold from "@/assets/images/templates/bar-bold.webp";
import barVibrant from "@/assets/images/templates/bar-vibrant.webp";
import barSimple from "@/assets/images/templates/bar-simple.webp";
import barMinimalistic from "@/assets/images/templates/bar-minimalistic.webp";
import hotelBold from "@/assets/images/templates/hotel-bold.webp";
import hotelVibrant from "@/assets/images/templates/hotel-vibrant.webp";
import hotelSimple from "@/assets/images/templates/hotel-simple.webp";
import hotelMinimalistic from "@/assets/images/templates/hotel-minimalistic.webp";

const categoryFilters = [
  { id: "all", label: "All Venues" },
  { id: "restaurants", label: "Restaurants" },
  { id: "cafes", label: "Cafes" },
  { id: "bars", label: "Bars" },
  { id: "hotels", label: "Hotels" },
];

const styleFilters = [
  { id: "all", label: "All Styles" },
  { id: "bold", label: "Bold" },
  { id: "vibrant", label: "Vibrant" },
  { id: "simple", label: "Simple" },
  { id: "minimalistic", label: "Minimalistic" },
];

const styleColors = {
  bold: {
    gradient: "from-emerald-600 to-emerald-900",
    accent: "#059669",
    bg: "bg-emerald-600",
    text: "Dramatic & Powerful"
  },
  vibrant: {
    gradient: "from-orange-500 to-rose-600",
    accent: "#F97316",
    bg: "bg-orange-500",
    text: "Energetic & Dynamic"
  },
  simple: {
    gradient: "from-amber-600 to-orange-700",
    accent: "#DC7F5A",
    bg: "bg-amber-700",
    text: "Clean & Approachable"
  },
  minimalistic: {
    gradient: "from-zinc-800 to-zinc-950",
    accent: "#D4AF37",
    bg: "bg-zinc-900",
    text: "Refined & Subtle"
  }
};

const portfolioItems = [
  // RESTAURANTS
  {
    id: 1,
    category: "restaurants",
    style: "bold",
    title: "Ember & Oak Steakhouse",
    tagline: "Premium Cuts, Bold Flavors",
    description: "A dramatic dining experience with rich textures and powerful branding.",
    features: ["Online Reservations", "Private Dining Rooms", "Wine Pairing Menu"],
    image: restaurantBold,
  },
  {
    id: 2,
    category: "restaurants",
    style: "vibrant",
    title: "Fiesta Kitchen",
    tagline: "Taste the Energy",
    description: "Bright, energetic design that captures the spirit of modern fusion cuisine.",
    features: ["Real-time Table Booking", "Event Catering", "Loyalty Program"],
    image: restaurantVibrant,
  },
  {
    id: 3,
    category: "restaurants",
    style: "simple",
    title: "The Garden Table",
    tagline: "Farm Fresh, Simply Served",
    description: "Warm and inviting design focusing on fresh ingredients and honest cooking.",
    features: ["Seasonal Menu Display", "Reservation System", "Gift Cards"],
    image: restaurantSimple,
  },
  {
    id: 4,
    category: "restaurants",
    style: "minimalistic",
    title: "Noir Fine Dining",
    tagline: "Elegance in Every Detail",
    description: "Ultra-refined design with subtle gold accents for upscale dining.",
    features: ["Tasting Menu Booking", "Chef's Table Experience", "Valet Integration"],
    image: restaurantMinimalistic,
  },

  // CAFES
  {
    id: 5,
    category: "cafes",
    style: "bold",
    title: "Roast Revolution",
    tagline: "Coffee with Character",
    description: "Strong visual identity for specialty coffee roasters and artisan cafes.",
    features: ["Coffee Subscriptions", "Bean Shop", "Cafe Reservations"],
    image: cafeBold,
  },
  {
    id: 6,
    category: "cafes",
    style: "vibrant",
    title: "Sunshine Bakery & Cafe",
    tagline: "Baked with Joy",
    description: "Cheerful, welcoming design perfect for family-friendly bakery cafes.",
    features: ["Order Ahead", "Birthday Cake Booking", "Catering Menu"],
    image: cafeVibrant,
  },
  {
    id: 7,
    category: "cafes",
    style: "simple",
    title: "Morning Ritual",
    tagline: "Your Daily Escape",
    description: "Clean, calming aesthetic for neighborhood coffee spots.",
    features: ["Mobile Ordering", "Loyalty Rewards", "Event Space Booking"],
    image: cafeSimple,
  },
  {
    id: 8,
    category: "cafes",
    style: "minimalistic",
    title: "Blanc Coffee House",
    tagline: "Pure Coffee Experience",
    description: "Sophisticated minimalism for premium specialty coffee destinations.",
    features: ["Brew Class Bookings", "Private Tastings", "Membership Program"],
    image: cafeMinimalistic,
  },

  // BARS
  {
    id: 9,
    category: "bars",
    style: "bold",
    title: "The Vault Speakeasy",
    tagline: "Secrets Worth Keeping",
    description: "Dramatic, mysterious design for exclusive cocktail lounges.",
    features: ["Table Reservations", "Private Events", "Cocktail Masterclasses"],
    image: barBold,
  },
  {
    id: 10,
    category: "bars",
    style: "vibrant",
    title: "Electric Nights",
    tagline: "Where the Party Starts",
    description: "High-energy design for modern bars and nightlife venues.",
    features: ["VIP Booth Booking", "Event Calendar", "Guest List Management"],
    image: barVibrant,
  },
  {
    id: 11,
    category: "bars",
    style: "simple",
    title: "The Local Tap",
    tagline: "Good Beer, Great Company",
    description: "Friendly, approachable design for craft beer bars and pubs.",
    features: ["Happy Hour Alerts", "Beer Menu", "Private Party Booking"],
    image: barSimple,
  },
  {
    id: 12,
    category: "bars",
    style: "minimalistic",
    title: "Onyx Cocktail Bar",
    tagline: "Refined Drinking Culture",
    description: "Sleek, sophisticated design for upscale cocktail destinations.",
    features: ["Sommelier Bookings", "Tasting Flights", "Corporate Events"],
    image: barMinimalistic,
  },

  // HOTELS & GUEST HOUSES (Small-Medium, Boutique Focus)
  {
    id: 13,
    category: "hotels",
    style: "bold",
    title: "Mountain View Lodge",
    tagline: "Adventure Awaits",
    description: "Dramatic boutique retreat design for mountain lodges and adventure stays.",
    features: ["Room Booking", "Activity Packages", "Restaurant Reservations"],
    image: hotelBold,
  },
  {
    id: 14,
    category: "hotels",
    style: "vibrant",
    title: "Sunset Guest House",
    tagline: "Warmth & Welcome",
    description: "Bright, welcoming design for family-run B&Bs and guest houses.",
    features: ["Room Availability", "Breakfast Options", "Local Tours Booking"],
    image: hotelVibrant,
  },
  {
    id: 15,
    category: "hotels",
    style: "simple",
    title: "Harbor Inn",
    tagline: "Coastal Comfort",
    description: "Clean, relaxed design for seaside inns and coastal retreats.",
    features: ["Check-in/Check-out", "Room Types Display", "Amenities Guide"],
    image: hotelSimple,
  },
  {
    id: 16,
    category: "hotels",
    style: "minimalistic",
    title: "The White House B&B",
    tagline: "Timeless Elegance",
    description: "Refined countryside stay with sophisticated, understated design.",
    features: ["Suite Booking", "Spa Appointments", "Private Dining"],
    image: hotelMinimalistic,
  },
];

export default function Gallery() {
  const [categoryTab, setCategoryTab] = useState("all");
  const [styleTab, setStyleTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);

  const filteredItems = portfolioItems.filter(item => {
    const categoryMatch = categoryTab === "all" || item.category === categoryTab;
    const styleMatch = styleTab === "all" || item.style === styleTab;
    return categoryMatch && styleMatch;
  });

  return (
    <Layout>
      <SEO {...seoData.portfolio} />
      <section className="bg-gradient-to-b from-blue-500/20 to-background pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Template Gallery</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Browse <span className="text-primary">Styles</span>, We Build Custom
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Preview and explore our website designs across different styles and business types. 
            Every site we deliver is custom-built for your unique brand. You just tell us what 
            style best suits and fits or supply us website examples that you like.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md">
            <Palette className="w-4 h-4" />
            Design Guides Only — Your site will be uniquely yours
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <LayoutGrid className="w-4 h-4" />
                <span>Filter by Venue</span>
              </div>
              <Tabs value={categoryTab} onValueChange={setCategoryTab}>
                <TabsList className="flex-wrap h-auto">
                  {categoryFilters.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      data-testid={`category-tab-${cat.id}`}
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Palette className="w-4 h-4" />
                <span>Filter by Style</span>
              </div>
              <Tabs value={styleTab} onValueChange={setStyleTab}>
                <TabsList className="flex-wrap h-auto">
                  {styleFilters.map((style) => (
                    <TabsTrigger
                      key={style.id}
                      value={style.id}
                      data-testid={`style-tab-${style.id}`}
                    >
                      {style.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const styleConfig = styleColors[item.style as keyof typeof styleColors];
              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover-elevate border-0 shadow-lg"
                  data-testid={`portfolio-item-${item.id}`}
                >
                  <div 
                    className="aspect-[4/3] relative overflow-hidden cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img 
                      src={item.image} 
                      alt={`${item.title} website template for ${item.category} - indexFlow`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-white/90 text-zinc-900 text-xs font-medium hover:bg-white/90">
                        Design Guide
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant="outline" 
                        className="bg-black/40 border-white/30 text-white text-xs capitalize backdrop-blur-sm"
                      >
                        {item.style}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-bold text-lg drop-shadow-lg">{item.title}</p>
                      <p className="text-white/80 text-sm drop-shadow">{item.tagline}</p>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 rounded-full p-3 shadow-xl">
                        <ExternalLink className="w-5 h-5 text-zinc-900" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-card">
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between gap-2 mt-3">
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.category}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5"
                        onClick={() => window.open(getPreviewUrl(item.category, item.style), '_blank')}
                        data-testid={`button-live-preview-${item.id}`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        Live Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No templates match your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setCategoryTab("all"); setStyleTab("all"); }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="mt-16 text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Love a Style?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              These are just starting points. We'll customize every detail — colors, fonts, 
              layout, and features — to match your business's unique personality.
            </p>
            <Button asChild size="lg">
              <a href="/contact" data-testid="button-portfolio-contact">
                Let's Build Your Custom Site
              </a>
            </Button>
          </div>
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative flex-1 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar with close button */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/90 text-zinc-900 font-medium hover:bg-white/90">
                  Design Guide
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-black/60 border-white/30 text-white capitalize backdrop-blur-sm"
                >
                  {selectedItem.style}
                </Badge>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/60 hover:bg-black/80 text-white"
                onClick={() => setSelectedItem(null)}
                data-testid="button-close-lightbox"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            {/* Live preview iframe */}
            <div className="flex-1 relative overflow-hidden pt-16">
              <iframe
                src={getPreviewUrl(selectedItem.category, selectedItem.style)}
                className="w-full h-full border-0 bg-white"
                title={`${selectedItem.title} live preview`}
                data-testid="template-preview-iframe"
              />
            </div>

            {/* Bottom info bar */}
            <div className="bg-card border-t p-4 lg:p-6">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl lg:text-2xl font-bold">{selectedItem.title}</h2>
                      <Badge variant="secondary" className="capitalize shrink-0">
                        {selectedItem.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm lg:text-base">{selectedItem.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedItem.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:items-end shrink-0">
                    <p className="text-xs text-muted-foreground text-center lg:text-right">
                      Your site will be custom-designed for your brand
                    </p>
                    <Button asChild size="lg">
                      <a href="/contact">
                        Build My Custom Site
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
