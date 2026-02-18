import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah Mitchell", business: "Apex Digital Marketing", role: "Founder", text: "We replaced 8 separate tools with IndexFlow and doubled our team's output while cutting costs by 60%. It's the all-in-one platform we always wanted.", rating: 5 },
  { name: "David Park", business: "Greenline Agency", role: "CEO", text: "The white-label feature let us launch our own branded SEO platform in under a week. Our clients think we built it ourselves.", rating: 5 },
  { name: "Rachel Torres", business: "BrightPath Media", role: "Content Director", text: "Bulk content generation changed everything for us. We went from producing 10 posts per week to 50 without adding a single team member.", rating: 5 },
  { name: "Marcus Chen", business: "Freelance SEO Consultant", role: "Solo Consultant", text: "IndexFlow lets me run like a 5-person agency as a solo freelancer. The CRM, rank tracker, and content engine are all I need.", rating: 5 },
  { name: "Emily Rodriguez", business: "ScaleUp Digital", role: "VP of Operations", text: "The rank tracker credits model is brilliant. We only pay for what we use, and the reporting alone has saved us 15 hours a week.", rating: 5 },
  { name: "Thomas Wright", business: "Horizon Marketing Group", role: "Managing Director", text: "The CRM pipeline transformed how we manage clients. From lead to invoice, everything flows through one dashboard now.", rating: 5 },
];

export default function Testimonials() {
  return (
    <div className="min-h-screen flex flex-col" data-testid="page-testimonials">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-testimonials-title">What Agencies Are Saying</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-subtitle">Real stories from agencies and consultants who scaled their operations with IndexFlow.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Card key={i} className="hover-elevate" data-testid={`card-testimonial-${i}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic" data-testid={`text-testimonial-quote-${i}`}>"{t.text}"</p>
                    <div>
                      <p className="font-semibold" data-testid={`text-testimonial-name-${i}`}>{t.name}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${i}`}>{t.role}, {t.business}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
