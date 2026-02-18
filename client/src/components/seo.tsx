import { useEffect } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export function SEO({ title, description, canonical, canonicalUrl, keywords, ogImage, ogType = "website", noindex, structuredData }: SEOProps) {
  const resolvedCanonical = canonical || canonicalUrl;
  useEffect(() => {
    if (title) document.title = title;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    if (description) setMeta("description", description);
    if (description) setMeta("og:description", description);
    if (title) setMeta("og:title", title);
    if (ogType) setMeta("og:type", ogType);
    if (ogImage) setMeta("og:image", ogImage);
    if (keywords) setMeta("keywords", keywords);
    if (resolvedCanonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = resolvedCanonical;
    }
    if (noindex) setMeta("robots", "noindex,nofollow");
    if (structuredData) {
      const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];
      const existing = document.querySelectorAll('script[data-seo-schema]');
      existing.forEach(el => el.remove());
      schemas.forEach((schema, i) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-schema", `${i}`);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }
  }, [title, description, resolvedCanonical, keywords, ogImage, ogType, noindex, structuredData]);
  return null;
}

const BASE_URL = "https://indexflow.site";

export const seoData: Record<string, SEOProps> = {
  home: {
    title: "indexFlow - Done-For-You SEO and Content Marketing Platform",
    description: "All-in-one SEO, content marketing, and AI-powered platform for agencies. Get more clients with zero effort.",
    canonical: BASE_URL,
    ogType: "website",
  },
  about: {
    title: "How It Works - indexFlow",
    description: "Learn how indexFlow helps agencies automate content creation, boost SEO, and engage clients with AI-powered tools.",
    canonical: `${BASE_URL}/how-it-works`,
  },
  pricing: {
    title: "Pricing - indexFlow",
    description: "Simple, transparent pricing for agencies and businesses. Start free, scale as you grow.",
    canonical: `${BASE_URL}/pricing`,
  },
  contact: {
    title: "Contact Us - indexFlow",
    description: "Get in touch with the indexFlow team. We're here to help your business succeed.",
    canonical: `${BASE_URL}/contact`,
  },
  faq: {
    title: "FAQ - indexFlow",
    description: "Frequently asked questions about indexFlow's SEO and content marketing platform.",
    canonical: `${BASE_URL}/faq`,
  },
  portfolio: {
    title: "Portfolio & Gallery - indexFlow",
    description: "See real examples of agencies powered by indexFlow.",
    canonical: `${BASE_URL}/gallery`,
  },
  templates: {
    title: "Website Templates - indexFlow",
    description: "Professional website templates for agencies and businesses.",
    canonical: `${BASE_URL}/templates`,
  },
  restaurants: {
    title: "Restaurant SEO Solutions - indexFlow",
    description: "Complete SEO and content marketing platform designed for restaurant businesses.",
    canonical: `${BASE_URL}/solutions/restaurants`,
  },
  cafes: {
    title: "Cafe SEO Solutions - indexFlow",
    description: "Streamline online visibility and marketing for your cafe with indexFlow.",
    canonical: `${BASE_URL}/solutions/cafes`,
  },
  bars: {
    title: "Bar SEO Solutions - indexFlow",
    description: "Manage online presence, events marketing, and local SEO for bars with indexFlow.",
    canonical: `${BASE_URL}/solutions/bars`,
  },
  hotels: {
    title: "Hotel SEO Solutions - indexFlow",
    description: "All-in-one hotel SEO and digital marketing platform.",
    canonical: `${BASE_URL}/solutions/hotels`,
  },
  multiLocation: {
    title: "Multi-Location Management - indexFlow",
    description: "Manage multiple client workspaces from one dashboard.",
    canonical: `${BASE_URL}/solutions/multi-location`,
  },
  aiConcierge: {
    title: "AI Assistant - indexFlow Platform",
    description: "24/7 AI-powered assistant that handles inquiries, answers questions, and provides personalized recommendations.",
    canonical: `${BASE_URL}/platform/ai-concierge`,
  },
  byok: {
    title: "Bring Your Own Keys (BYOK) - indexFlow Platform",
    description: "Use your own API keys for AI providers. Full control over your AI infrastructure.",
    canonical: `${BASE_URL}/platform/byok`,
  },
  contentMarketing: {
    title: "Content Marketing - indexFlow Platform",
    description: "AI-powered content creation and blog management for businesses.",
    canonical: `${BASE_URL}/platform/content-marketing`,
  },
  clientDashboard: {
    title: "Client Dashboard - indexFlow Platform",
    description: "Powerful dashboard to manage your workspace's content, analytics, and SEO.",
    canonical: `${BASE_URL}/platform/dashboard`,
  },
  businessWebsites: {
    title: "Website Builder - indexFlow Platform",
    description: "Beautiful, conversion-optimized websites built for businesses.",
    canonical: `${BASE_URL}/platform/business-websites`,
  },
  integrations: {
    title: "Integrations - indexFlow Platform",
    description: "Connect indexFlow with your favorite tools and platforms.",
    canonical: `${BASE_URL}/platform/integrations`,
  },
  localSearchGrid: {
    title: "Local Search Grid - indexFlow Platform",
    description: "Visualize your local search rankings across a geographic grid.",
    canonical: `${BASE_URL}/platform/local-search-grid`,
  },
  rankTracking: {
    title: "Rank Tracking - indexFlow Platform",
    description: "Monitor your workspace's search engine rankings and track keyword performance.",
    canonical: `${BASE_URL}/platform/rank-tracking`,
  },
  searchConsole: {
    title: "Search Console Integration - indexFlow Platform",
    description: "Google Search Console integration for deep SEO insights.",
    canonical: `${BASE_URL}/platform/search-console`,
  },
  seo: {
    title: "SEO Tools - indexFlow Platform",
    description: "Comprehensive SEO toolkit designed for businesses.",
    canonical: `${BASE_URL}/platform/seo`,
  },
  seoTools: {
    title: "SEO Toolkit - indexFlow Platform",
    description: "Advanced SEO tools to improve your workspace's online visibility.",
    canonical: `${BASE_URL}/platform/seo-tools`,
  },
  localCitations: {
    title: "Local Citations - indexFlow Services",
    description: "Build and manage local citations to improve your workspace's local search presence.",
    canonical: `${BASE_URL}/services/local-citations`,
  },
  compareOpenTable: {
    title: "indexFlow vs OpenTable - Comparison",
    description: "See how indexFlow compares to OpenTable for restaurant marketing and SEO.",
    canonical: `${BASE_URL}/comparisons/opentable`,
  },
  compareResy: {
    title: "indexFlow vs Resy - Comparison",
    description: "Compare indexFlow and Resy for SEO and marketing management.",
    canonical: `${BASE_URL}/comparisons/resy`,
  },
  bestPlatforms: {
    title: "Best SEO Platforms Compared - indexFlow",
    description: "Compare the best SEO and marketing platforms for businesses side by side.",
    canonical: `${BASE_URL}/comparisons/best-platforms`,
  },
  comparePricing: {
    title: "SEO Platform Pricing Comparison - indexFlow",
    description: "Compare pricing across leading SEO and marketing platforms.",
    canonical: `${BASE_URL}/comparisons/pricing`,
  },
  comparePlatform: {
    title: "Platform Comparison - indexFlow",
    description: "Feature-by-feature comparison of leading SEO platforms.",
    canonical: `${BASE_URL}/comparisons/platform`,
  },
  analytics: {
    title: "Analytics - indexFlow Features",
    description: "Deep analytics and reporting for your workspace.",
    canonical: `${BASE_URL}/features/analytics`,
  },
  multiLanguage: {
    title: "Multi-Language Support - indexFlow Features",
    description: "Serve clients in their preferred language with automatic translation.",
    canonical: `${BASE_URL}/features/multi-language`,
  },
  prepaidServices: {
    title: "Prepaid Services - indexFlow Features",
    description: "Secure payments upfront with prepaid and deposit-based service options.",
    canonical: `${BASE_URL}/features/prepaid-services`,
  },
  smsConfirmations: {
    title: "SMS Notifications - indexFlow Features",
    description: "Automated SMS notifications and reminders for clients.",
    canonical: `${BASE_URL}/features/sms-confirmations`,
  },
  voiceAI: {
    title: "Voice AI - indexFlow Features",
    description: "AI-powered voice assistant for phone inquiries and scheduling.",
    canonical: `${BASE_URL}/features/voice-ai`,
  },
  waitlist: {
    title: "Lead Queue Management - indexFlow Features",
    description: "Smart lead queue management to maximize conversions.",
    canonical: `${BASE_URL}/features/waitlist`,
  },
};

export const combinedHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "indexFlow",
      url: BASE_URL,
      description: "Done-for-you SEO and content marketing platform",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      name: "indexFlow",
      url: BASE_URL,
    },
    {
      "@type": "SoftwareApplication",
      name: "indexFlow",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Set Up indexFlow for Your Workspace",
  description: "Step-by-step guide to getting started with indexFlow platform",
  step: [
    {
      "@type": "HowToStep",
      name: "Sign Up",
      text: "Create your indexFlow account and add your workspace details.",
    },
    {
      "@type": "HowToStep",
      name: "Configure Your Widget",
      text: "Customize your AI tools and dashboard with your branding and preferences.",
    },
    {
      "@type": "HowToStep",
      name: "Go Live",
      text: "Launch your workspace and start tracking rankings and publishing content.",
    },
  ],
};

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "indexFlow Platform",
  provider: {
    "@type": "Organization",
    name: "indexFlow",
  },
  description: "All-in-one SEO, content marketing, and AI-powered platform for businesses.",
  serviceType: "SaaS",
  areaServed: "Worldwide",
};

export default SEO;
