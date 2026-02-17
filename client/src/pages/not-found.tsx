import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Phone, Calendar, HelpCircle } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import restoLogo from "@/assets/images/resto-logo.webp";

const quickLinks = [
  { href: "/", label: "Home", icon: Home, description: "Back to homepage" },
  { href: "/pricing", label: "Pricing", icon: Calendar, description: "View our plans" },
  { href: "/faq", label: "FAQ", icon: HelpCircle, description: "Common questions" },
  { href: "/contact", label: "Contact", icon: Phone, description: "Get in touch" },
];

export default function NotFound() {
  return (
    <Layout>
      <SEO 
        title="Page Not Found" 
        description="The page you're looking for doesn't exist. Browse our restaurant booking software, pricing, or contact us for help."
        canonical="/404"
      />
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img 
              src={restoLogo} 
              alt="Resto.Restaurant" 
              className="h-16 mx-auto mb-6"
            />
            <h1 className="text-6xl lg:text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <link.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Link href="/">
            <Button size="lg" data-testid="button-back-home">
              Back to Homepage
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
