import { Link } from "wouter";
import { MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { Search, PenTool, Megaphone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { locations, getAllRegions, getLocationsByRegion } from "@/data/locations";
import { serviceTypes } from "@/data/services";

const serviceIcons: Record<string, typeof Search> = {
  "seo-agencies": Search,
  "content-agencies": PenTool,
  "marketing-agencies": Megaphone,
  "freelancers": User,
};

export default function Locations() {
  const regions = getAllRegions();

  return (
    <Layout>
      <SEO 
        title="SEO & Marketing Platform by Location"
        description={`indexFlow serves agencies and businesses in ${locations.length}+ cities worldwide. Find the all-in-one SEO and content platform for your market.`}
        canonical="/locations"
        keywords="seo platform, content marketing platform, agency software, seo tools by city, marketing agency platform"
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
              SEO & Content Platform<br />
              <span className="text-primary">Wherever You Are</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-page-description">
              indexFlow serves agencies and businesses in major cities across North America, Europe, 
              Asia-Pacific, and beyond. Find your market and see how we can help.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {serviceTypes.map((service) => {
                const Icon = serviceIcons[service.slug] || Search;
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
                            {location.businessCount} businesses
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
              indexFlow works with agencies and businesses worldwide. Even if your city isn't listed, 
              we can help you scale your SEO and content operations.
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
                const Icon = serviceIcons[service.slug] || Search;
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
                <h3 className="font-semibold mb-3">SEO Agencies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/new-york/seo-agencies" className="hover:text-primary">New York SEO</Link></li>
                  <li><Link href="/locations/los-angeles/seo-agencies" className="hover:text-primary">Los Angeles SEO</Link></li>
                  <li><Link href="/locations/london/seo-agencies" className="hover:text-primary">London SEO</Link></li>
                  <li><Link href="/locations/paris/seo-agencies" className="hover:text-primary">Paris SEO</Link></li>
                  <li><Link href="/locations/tokyo/seo-agencies" className="hover:text-primary">Tokyo SEO</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Content Agencies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/melbourne/content-agencies" className="hover:text-primary">Melbourne Content</Link></li>
                  <li><Link href="/locations/seattle/content-agencies" className="hover:text-primary">Seattle Content</Link></li>
                  <li><Link href="/locations/amsterdam/content-agencies" className="hover:text-primary">Amsterdam Content</Link></li>
                  <li><Link href="/locations/vienna/content-agencies" className="hover:text-primary">Vienna Content</Link></li>
                  <li><Link href="/locations/copenhagen/content-agencies" className="hover:text-primary">Copenhagen Content</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Marketing Agencies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/miami/marketing-agencies" className="hover:text-primary">Miami Marketing</Link></li>
                  <li><Link href="/locations/las-vegas/marketing-agencies" className="hover:text-primary">Las Vegas Marketing</Link></li>
                  <li><Link href="/locations/barcelona/marketing-agencies" className="hover:text-primary">Barcelona Marketing</Link></li>
                  <li><Link href="/locations/berlin/marketing-agencies" className="hover:text-primary">Berlin Marketing</Link></li>
                  <li><Link href="/locations/hong-kong/marketing-agencies" className="hover:text-primary">Hong Kong Marketing</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Freelancers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/locations/dubai/freelancers" className="hover:text-primary">Dubai Freelancers</Link></li>
                  <li><Link href="/locations/singapore/freelancers" className="hover:text-primary">Singapore Freelancers</Link></li>
                  <li><Link href="/locations/sydney/freelancers" className="hover:text-primary">Sydney Freelancers</Link></li>
                  <li><Link href="/locations/rome/freelancers" className="hover:text-primary">Rome Freelancers</Link></li>
                  <li><Link href="/locations/cape-town/freelancers" className="hover:text-primary">Cape Town Freelancers</Link></li>
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
