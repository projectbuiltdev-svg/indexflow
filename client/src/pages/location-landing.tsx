import { useRoute, Link } from "wouter";
import { ArrowRight, CheckCircle, MapPin, Phone, Calendar, Star, Users, Clock, ChevronRight, Compass, Building2, TreePine, Sparkles, UtensilsCrossed, Play } from "lucide-react";
import { Utensils, Coffee, Wine, Bed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { LocationMap } from "@/components/location-map";
import { locations, getLocationBySlug, type Location, type Attraction } from "@/data/locations";
import { serviceTypes, getServiceBySlug, type ServiceType } from "@/data/services";
import NotFound from "./not-found";

const attractionIcons: Record<Attraction["type"], typeof Compass> = {
  landmark: Building2,
  neighborhood: MapPin,
  dining: UtensilsCrossed,
  entertainment: Sparkles,
  nature: TreePine,
};

const serviceIcons: Record<string, typeof Utensils> = {
  restaurants: Utensils,
  cafes: Coffee,
  bars: Wine,
  hotels: Bed,
};

function getNearbyLocations(currentLocation: Location, limit: number = 8): Location[] {
  return locations
    .filter(loc => loc.slug !== currentLocation.slug && loc.region === currentLocation.region)
    .slice(0, limit);
}

function getOtherServices(currentService: string): ServiceType[] {
  return serviceTypes.filter(s => s.slug !== currentService);
}

const popularCities = [
  { slug: "new-york", city: "New York", country: "USA" },
  { slug: "los-angeles", city: "Los Angeles", country: "USA" },
  { slug: "chicago", city: "Chicago", country: "USA" },
  { slug: "miami", city: "Miami", country: "USA" },
  { slug: "london", city: "London", country: "UK" },
  { slug: "paris", city: "Paris", country: "France" },
  { slug: "berlin", city: "Berlin", country: "Germany" },
  { slug: "amsterdam", city: "Amsterdam", country: "Netherlands" },
  { slug: "tokyo", city: "Tokyo", country: "Japan" },
  { slug: "singapore", city: "Singapore", country: "Singapore" },
  { slug: "hong-kong", city: "Hong Kong", country: "China" },
  { slug: "sydney", city: "Sydney", country: "Australia" },
  { slug: "dubai", city: "Dubai", country: "UAE" },
  { slug: "toronto", city: "Toronto", country: "Canada" },
  { slug: "barcelona", city: "Barcelona", country: "Spain" },
  { slug: "rome", city: "Rome", country: "Italy" },
];

const regionCities: Record<string, Array<{ slug: string; city: string }>> = {
  "North America": [
    { slug: "new-york", city: "New York" },
    { slug: "los-angeles", city: "Los Angeles" },
    { slug: "chicago", city: "Chicago" },
    { slug: "miami", city: "Miami" },
    { slug: "san-francisco", city: "San Francisco" },
    { slug: "las-vegas", city: "Las Vegas" },
    { slug: "seattle", city: "Seattle" },
    { slug: "boston", city: "Boston" },
    { slug: "toronto", city: "Toronto" },
    { slug: "vancouver", city: "Vancouver" },
  ],
  "Europe": [
    { slug: "london", city: "London" },
    { slug: "paris", city: "Paris" },
    { slug: "berlin", city: "Berlin" },
    { slug: "amsterdam", city: "Amsterdam" },
    { slug: "barcelona", city: "Barcelona" },
    { slug: "rome", city: "Rome" },
    { slug: "madrid", city: "Madrid" },
    { slug: "vienna", city: "Vienna" },
    { slug: "prague", city: "Prague" },
    { slug: "copenhagen", city: "Copenhagen" },
  ],
  "Asia-Pacific": [
    { slug: "tokyo", city: "Tokyo" },
    { slug: "singapore", city: "Singapore" },
    { slug: "hong-kong", city: "Hong Kong" },
    { slug: "sydney", city: "Sydney" },
    { slug: "melbourne", city: "Melbourne" },
    { slug: "seoul", city: "Seoul" },
    { slug: "bangkok", city: "Bangkok" },
    { slug: "mumbai", city: "Mumbai" },
  ],
  "Middle East & Africa": [
    { slug: "dubai", city: "Dubai" },
    { slug: "cape-town", city: "Cape Town" },
    { slug: "tel-aviv", city: "Tel Aviv" },
  ],
};

interface LocationLandingProps {
  location: Location;
  service?: ServiceType;
}

function LocationLandingContent({ location, service }: LocationLandingProps) {
  const displayService = service || serviceTypes[0];
  const ServiceIcon = serviceIcons[displayService.slug] || Utensils;
  const nearbyLocations = getNearbyLocations(location);
  const otherServices = getOtherServices(displayService.slug);

  const pageTitle = service 
    ? `${displayService.headline} in ${location.city}`
    : `SEO & Marketing Platform Software in ${location.city}`;
  
  const pageDescription = service
    ? `${displayService.subheadline}. Serving ${location.restaurantCount} businesses in ${location.city}, ${location.country}.`
    : `AI-powered content management platform for businesses in ${location.city}. ${location.description}`;

  const canonicalUrl = service 
    ? `/locations/${location.slug}/${service.slug}`
    : `/locations/${location.slug}`;

  const seoKeywords = service
    ? `${displayService.name.toLowerCase()} booking software ${location.city}, ${displayService.name.toLowerCase()} reservation system ${location.city}, AI booking ${location.city}, booking software ${location.country}`
    : `SEO platform ${location.city}, marketing automation ${location.city}, AI assistant ${location.city}, content management ${location.country}`;

  return (
    <Layout>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        keywords={seoKeywords}
      />
      <div className="min-h-screen">
        <nav className="border-b bg-muted/30 py-2 px-4" aria-label="Breadcrumb" data-testid="breadcrumb-nav">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground max-w-7xl mx-auto">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link href="/locations" className="hover:text-foreground">Locations</Link></li>
            <ChevronRight className="h-3 w-3" />
            {service ? (
              <>
                <li><Link href={`/locations/${location.slug}`} className="hover:text-foreground">{location.city}</Link></li>
                <ChevronRight className="h-3 w-3" />
                <li className="text-foreground font-medium">{displayService.namePlural}</li>
              </>
            ) : (
              <li className="text-foreground font-medium">{location.city}</li>
            )}
          </ol>
        </nav>

        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background" data-testid="hero-section">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {location.city}, {location.country}
              </Badge>
              {service && (
                <Badge variant="outline" className="gap-1">
                  <ServiceIcon className="h-3 w-3" />
                  {displayService.namePlural}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-page-title">
              {pageTitle}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mb-8" data-testid="text-page-description">
              {pageDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" asChild data-testid="button-get-started">
                <Link href="/contact">
                  Get Started in {location.city}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-view-pricing">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary">{location.restaurantCount}</div>
                <div className="text-sm text-muted-foreground">Businesses in {location.city}</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Availability</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary">60%</div>
                <div className="text-sm text-muted-foreground">Fewer No-Shows</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary">5 Days</div>
                <div className="text-sm text-muted-foreground">Average Setup</div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" data-testid="video-section">
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
            <video
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              poster="/hero-poster.jpg"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full object-cover pointer-events-none"
              data-testid="video-player"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
            <div className="inline-block backdrop-blur-md bg-black/35 rounded-2xl px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-14 mx-2">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-2 sm:px-4 rounded-full bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-white shadow-lg text-sm sm:text-base">
                <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </span>
                <span className="font-semibold">Done-for-you</span> <span className="font-light">content automation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
                Dominate Your Market!<br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Start Growing Revenue.</span>
              </h2>
              <p className="text-lg lg:text-xl max-w-3xl mx-auto mb-8">
                <span className="font-semibold text-white drop-shadow-lg">AI-Powered Marketing Platform</span> <em className="text-primary">&</em><br />
                <span className="font-semibold text-white drop-shadow-lg">Custom Websites for {location.city} {displayService.namePlural}</span><br />
                <span className="inline-block mt-2 font-bold text-xl lg:text-2xl bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-[pulse_5s_ease-in-out_infinite]">Agencies · SaaS · Ecommerce · Local Business</span><br />
                <span className="inline-block mt-2 text-lg font-medium text-white drop-shadow-lg">We Boss the tech, you focus on Biz!</span>
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <Link href="/contact">
                  <Button size="default" className="gap-2 sm:text-base text-sm sm:px-4 px-3" data-testid="button-video-demo">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="default" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 sm:text-base text-sm sm:px-4 px-3" data-testid="button-video-pricing">
                    <span className="italic">from</span> <span className="font-bold">$149</span> p/mo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="pain-points-section">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Challenges {location.city} {displayService.namePlural} Face
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Running a {displayService.name.toLowerCase()} in {location.city} comes with unique challenges. We're here to solve them.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {displayService.painPoints.map((pain, index) => (
                <Card key={index} className="border-destructive/20">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-destructive font-bold">{index + 1}</span>
                    </div>
                    <p className="text-foreground">{pain}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" data-testid="features-section">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                How indexFlow Helps {displayService.namePlural} in {location.city}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered platform is designed specifically for all businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {displayService.features.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="local-guide-section">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Explore {location.city}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the best places to visit and things to do in {location.city}. Perfect for businesses looking to attract customers.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  Top Attractions
                </h3>
                {location.attractions.map((attraction, index) => {
                  const AttractionIcon = attractionIcons[attraction.type] || MapPin;
                  const attractionUrl = `https://www.google.com/maps/search/${encodeURIComponent(attraction.name + ', ' + location.city)}`;
                  return (
                    <Card key={index} className="hover-elevate">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <AttractionIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <a 
                            href={attractionUrl}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {attraction.name}
                          </a>
                          <p className="text-sm text-muted-foreground">{attraction.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs capitalize">
                            {attraction.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </h3>
                <LocationMap 
                  city={location.city}
                  latitude={location.latitude}
                  longitude={location.longitude}
                  className="h-[400px]"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {location.city}, {location.country} • Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" data-testid="pricing-section">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Pricing for {location.city} {displayService.namePlural}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transparent, flat-rate pricing with no hidden fees. Choose the plan that fits your business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-lg mb-2">AI Assistant Widget</h3>
                    <p className="text-sm text-muted-foreground mb-4">AI widget for your website</p>
                    <div className="text-4xl font-bold text-primary">$149</div>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">AI chat widget for your site</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">24/7 automated responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Reservation capture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Custom training on your menu</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" asChild data-testid="button-pricing-widget">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary hover-elevate relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-lg mb-2">Complete Solution</h3>
                    <p className="text-sm text-muted-foreground mb-4">Full booking infrastructure</p>
                    <div className="text-4xl font-bold text-primary">$299</div>
                    <p className="text-sm text-muted-foreground">/month + $499 setup</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Everything in AI Assistant Widget</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Custom website design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">AI voice & SMS integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Full reservation management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Pre-paid deposit support</span>
                    </li>
                  </ul>
                  <Button className="w-full" asChild data-testid="button-pricing-complete">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-lg mb-2">SEO Add-On</h3>
                    <p className="text-sm text-muted-foreground mb-4">Boost your online visibility</p>
                    <div className="text-4xl font-bold text-primary">$499</div>
                    <p className="text-sm text-muted-foreground">one-time</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Local SEO optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Google Business setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Schema markup for {location.city}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Monthly ranking reports</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" asChild data-testid="button-pricing-seo">
                    <Link href="/contact">Add to Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              No long-term contracts • Cancel anytime • Setup in 5-20 days
            </p>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="pricing-cta-section">
          <div className="container max-w-6xl mx-auto px-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your {location.city} {displayService.name}?
                </h2>
                <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                  Join hundreds of businesses using indexFlow to streamline operations, 
                  reduce no-shows, and grow revenue.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild data-testid="button-cta-get-started">
                    <Link href="/contact">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild data-testid="button-cta-pricing">
                    <Link href="/pricing">Full Pricing Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="faq-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {displayService.faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {!service && (
          <section className="py-16" data-testid="services-section">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4">
                Solutions by Business Type
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Explore our specialized solutions for different types of businesses in {location.city}.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {serviceTypes.map((svc) => {
                  const Icon = serviceIcons[svc.slug] || Utensils;
                  return (
                    <Link key={svc.slug} href={`/locations/${location.slug}/${svc.slug}`}>
                      <Card className="h-full hover-elevate cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-2">{svc.namePlural}</h3>
                          <p className="text-sm text-muted-foreground">{svc.subheadline}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {service && otherServices.length > 0 && (
          <section className="py-16" data-testid="other-services-section">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">
                Other Solutions in {location.city}
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {otherServices.map((svc) => {
                  const Icon = serviceIcons[svc.slug] || Utensils;
                  return (
                    <Link key={svc.slug} href={`/locations/${location.slug}/${svc.slug}`}>
                      <Card className="hover-elevate cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{svc.namePlural}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {nearbyLocations.length > 0 && (
          <section className="py-16 bg-muted/30" data-testid="nearby-locations-section">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">
                Also Serving Nearby
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {nearbyLocations.map((loc) => (
                  <Link key={loc.slug} href={service ? `/locations/${loc.slug}/${service.slug}` : `/locations/${loc.slug}`}>
                    <Badge variant="secondary" className="text-sm py-2 px-4 hover-elevate cursor-pointer">
                      <MapPin className="h-3 w-3 mr-1" />
                      {loc.city}
                    </Badge>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" asChild data-testid="button-view-all-locations">
                  <Link href="/locations">
                    View All Locations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="py-16" data-testid="learn-more-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Learn More About indexFlow
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/how-it-works">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-5 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">How It Works</h3>
                    <p className="text-sm text-muted-foreground">See our simple 3-step process</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/pricing">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-5 text-center">
                    <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Pricing Plans</h3>
                    <p className="text-sm text-muted-foreground">Transparent, flat-rate pricing</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/templates">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-5 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Website Templates</h3>
                    <p className="text-sm text-muted-foreground">Beautiful designs for your business</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/faq">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-5 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">FAQ</h3>
                    <p className="text-sm text-muted-foreground">Common questions answered</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary underline">
                View Our Portfolio
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary underline">
                Contact Us
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary underline">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30" data-testid="all-services-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              All Booking Solutions in {location.city}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceTypes.map((svc) => {
                const Icon = serviceIcons[svc.slug] || Utensils;
                const isCurrentService = service?.slug === svc.slug;
                return (
                  <Link key={svc.slug} href={`/locations/${location.slug}/${svc.slug}`}>
                    <Card className={`h-full hover-elevate cursor-pointer ${isCurrentService ? 'border-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{svc.namePlural}</h3>
                            <p className="text-xs text-muted-foreground">{location.city}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{svc.subheadline}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12" data-testid="popular-cities-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Popular Cities Worldwide
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {popularCities
                .filter(c => c.slug !== location.slug)
                .map((city) => (
                  <Link key={city.slug} href={service ? `/locations/${city.slug}/${service.slug}` : `/locations/${city.slug}`}>
                    <Badge variant="secondary" className="py-2 px-3 hover-elevate cursor-pointer">
                      <MapPin className="h-3 w-3 mr-1" />
                      {city.city}
                    </Badge>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30" data-testid="browse-by-region-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Browse by Region
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(regionCities).map(([region, cities]) => (
                <div key={region}>
                  <h3 className="font-semibold mb-3 text-primary">{region}</h3>
                  <ul className="space-y-1.5">
                    {cities.map((city) => (
                      <li key={city.slug}>
                        <Link 
                          href={service ? `/locations/${city.slug}/${service.slug}` : `/locations/${city.slug}`}
                          className={`text-sm hover:text-primary ${city.slug === location.slug ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                        >
                          {city.city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/locations">
                  View All 51 Cities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12" data-testid="service-city-matrix-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Quick Links by City & Service
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" />
                  Restaurant Booking
                </h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li><Link href="/locations/new-york/restaurants" className="hover:text-primary">New York Restaurants</Link></li>
                  <li><Link href="/locations/london/restaurants" className="hover:text-primary">London Restaurants</Link></li>
                  <li><Link href="/locations/paris/restaurants" className="hover:text-primary">Paris Restaurants</Link></li>
                  <li><Link href="/locations/tokyo/restaurants" className="hover:text-primary">Tokyo Restaurants</Link></li>
                  <li><Link href="/locations/los-angeles/restaurants" className="hover:text-primary">LA Restaurants</Link></li>
                  <li><Link href="/locations/sydney/restaurants" className="hover:text-primary">Sydney Restaurants</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-primary" />
                  Cafe Booking
                </h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li><Link href="/locations/melbourne/cafes" className="hover:text-primary">Melbourne Cafes</Link></li>
                  <li><Link href="/locations/seattle/cafes" className="hover:text-primary">Seattle Cafes</Link></li>
                  <li><Link href="/locations/amsterdam/cafes" className="hover:text-primary">Amsterdam Cafes</Link></li>
                  <li><Link href="/locations/vienna/cafes" className="hover:text-primary">Vienna Cafes</Link></li>
                  <li><Link href="/locations/copenhagen/cafes" className="hover:text-primary">Copenhagen Cafes</Link></li>
                  <li><Link href="/locations/berlin/cafes" className="hover:text-primary">Berlin Cafes</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Wine className="h-4 w-4 text-primary" />
                  Bar Booking
                </h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li><Link href="/locations/miami/bars" className="hover:text-primary">Miami Bars</Link></li>
                  <li><Link href="/locations/las-vegas/bars" className="hover:text-primary">Las Vegas Bars</Link></li>
                  <li><Link href="/locations/barcelona/bars" className="hover:text-primary">Barcelona Bars</Link></li>
                  <li><Link href="/locations/berlin/bars" className="hover:text-primary">Berlin Bars</Link></li>
                  <li><Link href="/locations/hong-kong/bars" className="hover:text-primary">Hong Kong Bars</Link></li>
                  <li><Link href="/locations/chicago/bars" className="hover:text-primary">Chicago Bars</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Bed className="h-4 w-4 text-primary" />
                  Hotel Booking
                </h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li><Link href="/locations/dubai/hotels" className="hover:text-primary">Dubai Hotels</Link></li>
                  <li><Link href="/locations/singapore/hotels" className="hover:text-primary">Singapore Hotels</Link></li>
                  <li><Link href="/locations/rome/hotels" className="hover:text-primary">Rome Hotels</Link></li>
                  <li><Link href="/locations/bangkok/hotels" className="hover:text-primary">Bangkok Hotels</Link></li>
                  <li><Link href="/locations/sydney/hotels" className="hover:text-primary">Sydney Hotels</Link></li>
                  <li><Link href="/locations/cape-town/hotels" className="hover:text-primary">Cape Town Hotels</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default function LocationLanding() {
  const [, paramsCity] = useRoute("/locations/:city");
  const [, paramsService] = useRoute("/locations/:city/:service");
  
  const citySlug = paramsService?.city || paramsCity?.city;
  const serviceSlug = paramsService?.service;

  if (!citySlug) {
    return <NotFound />;
  }

  const location = getLocationBySlug(citySlug);
  if (!location) {
    return <NotFound />;
  }

  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  if (serviceSlug && !service) {
    return <NotFound />;
  }

  return <LocationLandingContent location={location} service={service} />;
}
