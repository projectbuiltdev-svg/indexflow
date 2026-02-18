import { useEffect } from "react";
import { FileText, Scale, CreditCard, Ban, AlertTriangle, HelpCircle, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";

const sections = [
  {
    icon: FileText,
    title: "1. Service Agreement",
    content: `By engaging indexFlow to build and manage your business's booking website, you agree to these Terms of Service. These terms govern the relationship between indexFlow ("we", "us", "our") and your business ("you", "your", "client").

Our services include website design and development, booking system integration, voice and text widget deployment, hosting, maintenance, and ongoing support as specified in your service agreement.`,
  },
  {
    icon: Scale,
    title: "2. Client Responsibilities",
    content: `As a client, you agree to:

• Provide accurate business information for website content and configuration
• Maintain valid payment methods for subscription and usage-based fees
• Respond to reasonable requests for information or approvals in a timely manner
• Comply with applicable laws regarding your business's operations and guest data
• Notify us promptly of any issues or required changes to your booking system
• Not use our services for any unlawful purposes`,
  },
  {
    icon: CreditCard,
    title: "3. Pricing & Payment",
    content: `Our service operates on a monthly subscription model. Your subscription includes website hosting, booking system, and standard support as detailed in your agreement.

Usage-based costs (such as Twilio for voice/SMS) are billed separately based on actual usage. With our AI BYOK model, you maintain your own API keys and are responsible for usage costs directly with those providers.

Invoices are issued monthly and due within 30 days. Late payments may result in service suspension after a 15-day grace period with notice.`,
  },
  {
    icon: Clock,
    title: "4. Service Level & Support",
    content: `We commit to 99.9% uptime for hosted websites and booking systems, excluding scheduled maintenance windows which will be communicated in advance.

Support is available during business hours (9am-6pm EST, Mon-Fri) for standard inquiries. Critical issues affecting booking functionality are addressed 24/7 for active clients.

Response times: Critical issues within 2 hours, standard issues within 1 business day, feature requests within 5 business days.`,
  },
  {
    icon: Shield,
    title: "5. Data & Intellectual Property",
    content: `Your business's content (menus, photos, descriptions) remains your property. We retain ownership of our platform, templates, and technology.

You grant us a license to use your content and branding to build and display your website. We grant you a license to use the booking system and widgets for the duration of our agreement.

Upon termination, we can provide an export of your booking data in standard formats. Custom website designs built for you can be transferred upon request with applicable fees.`,
  },
  {
    icon: Ban,
    title: "6. Acceptable Use",
    content: `You agree not to use our services to:

• Host content that is illegal, defamatory, or infringes on others' rights
• Attempt to gain unauthorized access to our systems or other clients' data
• Interfere with the operation of our platform or other clients' services
• Resell or redistribute our services without written authorization
• Use our voice/text systems for spam, harassment, or unsolicited marketing`,
  },
  {
    icon: AlertTriangle,
    title: "7. Limitation of Liability",
    content: `indexFlow is not liable for indirect, incidental, or consequential damages arising from use of our services, including lost revenue from booking system downtime.

Our total liability is limited to fees paid in the 12 months preceding any claim. We are not responsible for third-party services (Twilio, payment processors) beyond reasonable integration efforts.

We maintain reasonable backups but recommend clients maintain their own records of critical business data.`,
  },
  {
    icon: HelpCircle,
    title: "8. Termination & Changes",
    content: `Either party may terminate with 30 days written notice. We may terminate immediately for material breach, non-payment beyond 45 days, or violation of acceptable use policies.

Upon termination, your website will be taken offline. We will provide data exports upon request for 30 days following termination.

We may update these terms with 30 days notice. Continued use after changes take effect constitutes acceptance. Material changes will be communicated via email.`,
  },
];

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service | indexFlow - Hospitality Booking Platform";
  }, []);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-accent/30 to-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These terms govern the relationship between indexFlow and our business clients.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Questions About Our Terms?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> legal@indexflow.io</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              By engaging indexFlow for your business's booking infrastructure, 
              you acknowledge that you have read, understood, and agree to these Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
