import { useEffect } from "react";
import { Shield, Lock, Eye, Database, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Business contact information (name, email, phone) when you inquire about our services",
      "Company and business information to understand your needs and provide tailored solutions",
      "Communication history when you interact with our sales and support teams",
      "Usage data from client dashboards to improve our platform and services",
      "Technical data necessary to deploy and maintain your business's website and scheduling system",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "Responding to inquiries and providing demos of our platform",
      "Setting up and managing your business's website and business infrastructure",
      "Providing technical support and maintenance for your systems",
      "Sending updates about new features, improvements, and relevant industry news",
      "Improving our services based on aggregated usage patterns and feedback",
    ],
  },
  {
    icon: Lock,
    title: "Data Protection & Security",
    content: [
      "All data transmissions are encrypted using industry-standard SSL/TLS protocols",
      "Client business data is stored securely with access controls and regular backups",
      "We implement strict access controls - only authorized team members access client data",
      "Regular security audits and vulnerability assessments are conducted",
      "We never sell your business information or your clients' data to third parties",
    ],
  },
  {
    icon: Shield,
    title: "Your Rights as a Client",
    content: [
      "Access and receive a copy of your business data stored on our platform",
      "Request corrections to any inaccurate or incomplete information",
      "Request data export in standard formats if you choose to leave our service",
      "Opt-out of marketing communications at any time",
      "Request deletion of your data (subject to contractual and legal requirements)",
    ],
  },
];

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | indexFlow - SEO & Agency Platform";
  }, []);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-accent/30 to-background pt-4 pb-16 lg:pt-8 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We take the privacy of our clients and their business data seriously. This policy explains how we collect, use, and protect information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Summary</h3>
                <p className="text-sm text-muted-foreground">
                  indexFlow collects information necessary to provide our website building 
                  and business management services. We protect your business data with industry-standard 
                  security and never sell your information to third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                      <ul className="space-y-2">
                        {section.content.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Client Data Processing</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      When we build and manage scheduling systems for your business, client appointment data 
                      is collected and processed on your behalf. You remain the data controller for 
                      your clients' information, and we act as a data processor.
                    </p>
                    <p>
                      <strong className="text-foreground">Your responsibilities:</strong> Ensure your business's privacy policy informs clients about data collection
                    </p>
                    <p>
                      <strong className="text-foreground">Our responsibilities:</strong> Securely store and process client data only as instructed by you
                    </p>
                    <p>
                      <strong className="text-foreground">Data retention:</strong> Client data is retained according to your preferences and applicable regulations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Us About Privacy</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or how we handle data, please contact us:
              </p>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> privacy@indexflow.io</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
