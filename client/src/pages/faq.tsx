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
    question: "What is IndexFlow?",
    answer: "IndexFlow is a white-label SEO, content, and client management SaaS built for agencies. It combines a Content Engine, rank tracker, local search grid, CRM, invoicing, and white-label delivery into one platform — so you can replace your entire MarTech stack.",
  },
  {
    question: "How does pricing work?",
    answer: "Four tiers: Solo at $99/mo (1 user, 1 workspace), Professional at $299/mo (3 users, 3 workspaces), White Label Agency at $499/mo (6 users, 100 workspaces, full white-label branding), and Enterprise (custom pricing, unlimited everything). All plans are month-to-month with no long-term contracts. Pay annually and get 2 months free.",
  },
  {
    question: "What's included in every plan?",
    answer: "Every plan includes the Content Engine for AI-powered article generation, rank tracking, on-page SEO audit, schema markup, link builder, CRM pipeline, and access to the AI widget. Higher plans unlock white-label branding, additional workspaces, and priority support.",
  },
  {
    question: "How does white label work?",
    answer: "On the White Label Agency plan ($499/mo) and Enterprise, you can apply your own branding, logo, colors, and custom domain to the entire platform. Your clients see your brand — not IndexFlow. You can also white-label reports and invoices.",
  },
  {
    question: "What is BYOK (Bring Your Own Key)?",
    answer: "BYOK means you use your own API keys for AI providers (OpenAI, Anthropic, Google, etc.) and Twilio. This gives you full control over usage costs with no markups. You pay the providers directly at their rates.",
  },
  {
    question: "How do rank tracker credits work?",
    answer: "Each plan includes a monthly allocation of rank tracker credits. One credit equals one keyword check for one location. You can track keywords daily, weekly, or on-demand. Additional credits can be purchased if needed.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. All plans are month-to-month with no cancellation fees. You can downgrade or cancel at any time from your dashboard. Your data is retained for 30 days after cancellation.",
  },
  {
    question: "What CMS platforms do you support?",
    answer: "IndexFlow integrates with WordPress, Wix, Squarespace, Shopify, Webflow, Drupal, Magento, BigCommerce, Joomla, and any custom CMS via our REST API. Content is published directly from the platform.",
  },
  {
    question: "How does the Content Engine work?",
    answer: "The Content Engine uses your BYOK AI provider to generate SEO-optimized articles in bulk. You set the topic, keywords, tone, and length — then the engine drafts, applies quality gates, and publishes to your connected CMS. It supports campaigns, scheduling, and multi-language output.",
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
