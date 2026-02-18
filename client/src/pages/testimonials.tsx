import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Marco R.", business: "The Golden Fork", role: "Owner", text: "indexFlow transformed our online presence. Reservations increased by 40% within the first month.", rating: 5 },
  { name: "Sarah L.", business: "Skyline Rooftop Bar", role: "Manager", text: "The AI booking widget handles 80% of our phone inquiries automatically. Our staff can focus on guests.", rating: 5 },
  { name: "James T.", business: "Hotel Marigold", role: "GM", text: "Room bookings went up 35% after switching to indexFlow. The SEO tools are incredible.", rating: 5 },
  { name: "Elena P.", business: "Café Lumière", role: "Owner", text: "Finally a platform that understands our business. The content engine saves us hours every week.", rating: 5 },
  { name: "David K.", business: "The Velvet Lounge", role: "Owner", text: "Our Google ranking improved dramatically. We're now on the first page for all our key terms.", rating: 5 },
  { name: "Lisa M.", business: "Harbor View Restaurant", role: "Director", text: "The local search grid showed us exactly where we needed to improve. Game changer for local SEO.", rating: 5 },
];

export default function Testimonials() {
  return (
    <div className="min-h-screen flex flex-col" data-testid="page-testimonials">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-testimonials-title">What Our Clients Say</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real stories from businesses that transformed their operations with indexFlow.</p>
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
                    <p className="text-muted-foreground mb-4 italic">"{t.text}"</p>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}, {t.business}</p>
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
