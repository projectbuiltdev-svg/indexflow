import { Link } from "wouter";
import { MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { Utensils, Coffee, Wine, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { locations, getAllRegions, getLocationsByRegion } from "@/data/locations";
import { serviceTypes } from "@/data/services";

const serviceIcons: Record<string, typeof Utensils> = {
  restaurants: Utensils,
  cafes: Coffee,
  bars: Wine,
  hotels: Bed,
};

export default function Locations() {
  const regions = getAllRegions();

  return (
    <Layout>
      <SEO 
        title="Restaurant Booking Software by Location"
        description={`indexFlow serves businesses in ${locations.length}+ cities worldwide. Find AI-powered booking software for restaurants, cafes, bars, and hotels in your city.`}
        canonical="/locations"
        keywords="restaurant booking software, reservation system, AI booking by city, restaurant software locations, booking technology"
      />
      <div className="min-h-screen">
        <nav className="border-b bg-muted/30 py-2 px-4" aria-label="Breadcrumb" data-testid="breadcrumb-nav">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground max-w-7xl mx-auto">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Locations</li>
          </ol>
        </nav>

        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background" data-testid="hero-section">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              {locations.length}+ Cities Worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-page-title">
              Restaurant Booking Software<br />
              <span className="text-primary">Wherever You Are</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-page-description">
              indexFlow serves businesses in major cities across North America, Europe, 
              Asia-Pacific, and beyond. Find your city and see how we can help.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {serviceTypes.map((service) => {
                const Icon = serviceIcons[service.slug] || Utensils;
                return (
                  <Badge key={service.slug} variant="outline" className="py-2 px-4">
                    <Icon className="h-4 w-4 mr-2" />
                    {service.namePlural}
                  </Badge>
                );
              })}
            </div>
          </div>
        </section>

        {regions.map((region) => {
          const regionLocations = getLocationsByRegion(region);
          return (
            <section key={region} className="py-12 border-b last:border-b-0" data-testid={`region-${region.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="container max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">{region}</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {regionLocations.map((location) => (
                    <Link key={location.slug} href={`/locations/${location.slug}`}>
                      <Card className="h-full hover-elevate cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{location.city}</h3>
                              <p className="text-sm text-muted-foreground">{location.country}</p>
                            </div>
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {location.restaurantCount} businesses
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="py-16 bg-muted/30" data-testid="cta-section">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Don't See Your City?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              indexFlow works with businesses worldwide. Even if your city isn't listed, 
              we can help you streamline reservations and grow your business.
            </p>
            <Button size="lg" asChild data-testid="button-contact">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12" data-testid="service-links-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Solutions by Business Type
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceTypes.map((service) => {
                const Icon = serviceIcons[service.slug] || Utensils;
                return (
                  <Card key={service.slug} className="h-full hover-elevate">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{service.namePlural}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{service.subheadline}</p>
                      <div className="flex flex-wrap justify-center gap-1">
                        <Link href={`/locations/new-york/${service.slug}`}>
                          <Badge variant="outline" className="text-xs hover-elevate cursor-pointer">NYC</Badge>
                        </Link>
                        <Link href={`/locations/london/${service.slug}`}>
                          <Badge variant="outline" className="text-xs hover-elevate cursor-pointer">London</Badge>
                        </Link>
                        <Link href={`/locations/paris/${service.slug}`}>
                          <Badge variant="outline" className="text-xs hover-elevate cursor-pointer">Paris</Badge>
                        </Link>
                        <Link href={`/locations/tokyo/${service.slug}`}>
                          <Badge variant="outline" className="text-xs hover-elevate cursor-pointer">Tokyo</Badge>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30" data-testid="popular-searches-section">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Popular Searches
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-3">Restaurant Booking</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/new-york/restaurants" className="hover:text-primary">New York Restaurants</Link></li>
                  <li><Link href="/locations/los-angeles/restaurants" className="hover:text-primary">Los Angeles Restaurants</Link></li>
                  <li><Link href="/locations/london/restaurants" className="hover:text-primary">London Restaurants</Link></li>
                  <li><Link href="/locations/paris/restaurants" className="hover:text-primary">Paris Restaurants</Link></li>
                  <li><Link href="/locations/tokyo/restaurants" className="hover:text-primary">Tokyo Restaurants</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Cafe Booking</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/melbourne/cafes" className="hover:text-primary">Melbourne Cafes</Link></li>
                  <li><Link href="/locations/seattle/cafes" className="hover:text-primary">Seattle Cafes</Link></li>
                  <li><Link href="/locations/amsterdam/cafes" className="hover:text-primary">Amsterdam Cafes</Link></li>
                  <li><Link href="/locations/vienna/cafes" className="hover:text-primary">Vienna Cafes</Link></li>
                  <li><Link href="/locations/copenhagen/cafes" className="hover:text-primary">Copenhagen Cafes</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Bar Booking</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/miami/bars" className="hover:text-primary">Miami Bars</Link></li>
                  <li><Link href="/locations/las-vegas/bars" className="hover:text-primary">Las Vegas Bars</Link></li>
                  <li><Link href="/locations/barcelona/bars" className="hover:text-primary">Barcelona Bars</Link></li>
                  <li><Link href="/locations/berlin/bars" className="hover:text-primary">Berlin Bars</Link></li>
                  <li><Link href="/locations/hong-kong/bars" className="hover:text-primary">Hong Kong Bars</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Hotel Booking</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/dubai/hotels" className="hover:text-primary">Dubai Hotels</Link></li>
                  <li><Link href="/locations/singapore/hotels" className="hover:text-primary">Singapore Hotels</Link></li>
                  <li><Link href="/locations/sydney/hotels" className="hover:text-primary">Sydney Hotels</Link></li>
                  <li><Link href="/locations/rome/hotels" className="hover:text-primary">Rome Hotels</Link></li>
                  <li><Link href="/locations/cape-town/hotels" className="hover:text-primary">Cape Town Hotels</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" data-testid="learn-more-section">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6">
              Learn More About indexFlow
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/how-it-works">
                <Button variant="outline">How It Works</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">Pricing</Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline">Templates</Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline">Portfolio</Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline">FAQ</Button>
              </Link>
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
