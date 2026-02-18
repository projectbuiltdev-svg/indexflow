import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO, seoData, faqSchema } from "@/components/seo";

const faqs = [
  {
    question: "What's included in the Complete Solution?",
    answer: "The Complete Solution includes a custom-designed website, AI-powered booking system, phone assistant with Twilio integration, real-time availability sync, client dashboard access, and ongoing support. We handle everything from design to deployment.",
  },
  {
    question: "How long does setup take?",
    answer: "Typical setup takes 5-20 business days depending on your requirements. We build your custom website and booking system, configure your AI phone assistant, and ensure everything is working perfectly before going live.",
  },
  {
    question: "What is BYOK (Bring Your Own Key)?",
    answer: "BYOK means you use your own API keys for services like Twilio and OpenAI. This gives you full control over usage costs and ensures transparent billing directly from the service providers.",
  },
  {
    question: "Can I use the Widget Only without a custom website?",
    answer: "Yes! The Widget Only plan at $149/month is perfect if you already have a website. We provide the booking widget that integrates seamlessly with your existing site, plus the AI phone assistant.",
  },
  {
    question: "What types of venues do you work with?",
    answer: "We work with restaurants, cafes, bars, guest houses, hotels, and other businesses that need booking and SEO solutions. Our system is designed for any business that needs online booking and visibility.",
  },
  {
    question: "How does the AI phone assistant work?",
    answer: "Our AI assistant answers calls 24/7, handles booking requests, answers common questions about your business, and can send confirmation texts. It's powered by advanced AI and integrates with your booking system in real-time.",
  },
  {
    question: "What happens if I need changes after launch?",
    answer: "We provide ongoing support as part of your monthly subscription. Minor updates and adjustments are included. For larger changes, we'll discuss scope and timeline with you.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "After your initial setup, the subscription is month-to-month. You can cancel anytime, though we're confident you'll love the results once you see how many bookings you're capturing.",
  },
  {
    question: "How do pre-paid reservations work?",
    answer: "You can require deposits or full payment at booking time to reduce no-shows. Payments are processed securely and funds go directly to your account. Simply add your Stripe or PayPal ID in your client dashboard.",
  },
  {
    question: "What's the optional SEO package?",
    answer: "Our one-time SEO package ($499 flat fee, zero recurring charges) helps improve your business's visibility in search results. It includes keyword optimization, local SEO setup, Google Business Profile optimization, and schema mark-up. Get 100% visibility on Google and all search engines. Contact our sales team for details.",
  },
];

export default function FAQ() {
  const faqStructuredData = faqSchema(faqs);
  
  return (
    <Layout>
      <SEO {...seoData.faq} structuredData={faqStructuredData} />
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">FAQ</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Everything you need to know about indexflow.io
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
