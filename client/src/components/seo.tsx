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
    title: "indexFlow - Done-For-You Hospitality Booking Platform",
    description: "All-in-one booking, SEO, and AI concierge platform for restaurants, hotels, bars, and cafes. Get more reservations with zero effort.",
    canonical: BASE_URL,
    ogType: "website",
  },
  about: {
    title: "How It Works - indexFlow",
    description: "Learn how indexFlow helps hospitality venues automate bookings, boost SEO, and engage guests with AI-powered tools.",
    canonical: `${BASE_URL}/how-it-works`,
  },
  pricing: {
    title: "Pricing - indexFlow",
    description: "Simple, transparent pricing for restaurants, hotels, bars, and cafes. Start free, scale as you grow.",
    canonical: `${BASE_URL}/pricing`,
  },
  contact: {
    title: "Contact Us - indexFlow",
    description: "Get in touch with the indexFlow team. We're here to help your venue succeed.",
    canonical: `${BASE_URL}/contact`,
  },
  faq: {
    title: "FAQ - indexFlow",
    description: "Frequently asked questions about indexFlow's hospitality booking and marketing platform.",
    canonical: `${BASE_URL}/faq`,
  },
  portfolio: {
    title: "Portfolio & Gallery - indexFlow",
    description: "See real examples of hospitality venues powered by indexFlow.",
    canonical: `${BASE_URL}/gallery`,
  },
  templates: {
    title: "Website Templates - indexFlow",
    description: "Professional hospitality website templates for restaurants, hotels, bars, and cafes.",
    canonical: `${BASE_URL}/templates`,
  },
  restaurants: {
    title: "Restaurant Booking Solutions - indexFlow",
    description: "Complete booking and marketing platform designed specifically for restaurants.",
    canonical: `${BASE_URL}/solutions/restaurants`,
  },
  cafes: {
    title: "Cafe Booking Solutions - indexFlow",
    description: "Streamline reservations and marketing for your cafe with indexFlow.",
    canonical: `${BASE_URL}/solutions/cafes`,
  },
  bars: {
    title: "Bar Booking Solutions - indexFlow",
    description: "Manage bar reservations, events, and marketing with indexFlow.",
    canonical: `${BASE_URL}/solutions/bars`,
  },
  hotels: {
    title: "Hotel Booking Solutions - indexFlow",
    description: "All-in-one hotel reservation and guest management platform.",
    canonical: `${BASE_URL}/solutions/hotels`,
  },
  multiLocation: {
    title: "Multi-Location Management - indexFlow",
    description: "Manage multiple hospitality venues from one dashboard.",
    canonical: `${BASE_URL}/solutions/multi-location`,
  },
  aiConcierge: {
    title: "AI Concierge - indexFlow Platform",
    description: "24/7 AI-powered guest assistant that handles bookings, answers questions, and provides personalized recommendations.",
    canonical: `${BASE_URL}/platform/ai-concierge`,
  },
  byok: {
    title: "Bring Your Own Keys (BYOK) - indexFlow Platform",
    description: "Use your own API keys for AI providers. Full control over your AI infrastructure.",
    canonical: `${BASE_URL}/platform/byok`,
  },
  contentMarketing: {
    title: "Content Marketing - indexFlow Platform",
    description: "AI-powered content creation and blog management for hospitality venues.",
    canonical: `${BASE_URL}/platform/content-marketing`,
  },
  clientDashboard: {
    title: "Client Dashboard - indexFlow Platform",
    description: "Powerful dashboard to manage your venue's bookings, analytics, and marketing.",
    canonical: `${BASE_URL}/platform/dashboard`,
  },
  hospitalityWebsites: {
    title: "Hospitality Websites - indexFlow Platform",
    description: "Beautiful, conversion-optimized websites built for hospitality venues.",
    canonical: `${BASE_URL}/platform/hospitality-websites`,
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
    description: "Monitor your venue's search engine rankings and track keyword performance.",
    canonical: `${BASE_URL}/platform/rank-tracking`,
  },
  searchConsole: {
    title: "Search Console Integration - indexFlow Platform",
    description: "Google Search Console integration for deep SEO insights.",
    canonical: `${BASE_URL}/platform/search-console`,
  },
  seo: {
    title: "SEO Tools - indexFlow Platform",
    description: "Comprehensive SEO toolkit designed for hospitality businesses.",
    canonical: `${BASE_URL}/platform/seo`,
  },
  seoTools: {
    title: "SEO Toolkit - indexFlow Platform",
    description: "Advanced SEO tools to improve your venue's online visibility.",
    canonical: `${BASE_URL}/platform/seo-tools`,
  },
  localCitations: {
    title: "Local Citations - indexFlow Services",
    description: "Build and manage local citations to improve your venue's local search presence.",
    canonical: `${BASE_URL}/services/local-citations`,
  },
  compareOpenTable: {
    title: "indexFlow vs OpenTable - Comparison",
    description: "See how indexFlow compares to OpenTable for restaurant reservations.",
    canonical: `${BASE_URL}/comparisons/opentable`,
  },
  compareResy: {
    title: "indexFlow vs Resy - Comparison",
    description: "Compare indexFlow and Resy for restaurant booking management.",
    canonical: `${BASE_URL}/comparisons/resy`,
  },
  bestBookingSystems: {
    title: "Best Booking Systems Compared - indexFlow",
    description: "Compare the best restaurant and hospitality booking systems side by side.",
    canonical: `${BASE_URL}/comparisons/best-booking-systems`,
  },
  comparePricing: {
    title: "Booking Platform Pricing Comparison - indexFlow",
    description: "Compare pricing across leading hospitality booking platforms.",
    canonical: `${BASE_URL}/comparisons/pricing`,
  },
  comparePlatform: {
    title: "Platform Comparison - indexFlow",
    description: "Feature-by-feature comparison of hospitality booking platforms.",
    canonical: `${BASE_URL}/comparisons/platform`,
  },
  analytics: {
    title: "Analytics - indexFlow Features",
    description: "Deep analytics and reporting for your hospitality venue.",
    canonical: `${BASE_URL}/features/analytics`,
  },
  multiLanguage: {
    title: "Multi-Language Support - indexFlow Features",
    description: "Serve guests in their preferred language with automatic translation.",
    canonical: `${BASE_URL}/features/multi-language`,
  },
  prepaidReservations: {
    title: "Prepaid Reservations - indexFlow Features",
    description: "Reduce no-shows with prepaid and deposit-based reservations.",
    canonical: `${BASE_URL}/features/prepaid-reservations`,
  },
  smsConfirmations: {
    title: "SMS Confirmations - indexFlow Features",
    description: "Automated SMS booking confirmations and reminders.",
    canonical: `${BASE_URL}/features/sms-confirmations`,
  },
  voiceBooking: {
    title: "Voice Booking - indexFlow Features",
    description: "AI-powered voice booking for phone reservations.",
    canonical: `${BASE_URL}/features/voice-booking`,
  },
  waitlist: {
    title: "Waitlist Management - indexFlow Features",
    description: "Smart waitlist management to fill every seat.",
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
      description: "Done-for-you hospitality booking and marketing platform",
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
  name: "How to Set Up indexFlow for Your Venue",
  description: "Step-by-step guide to getting started with indexFlow hospitality platform",
  step: [
    {
      "@type": "HowToStep",
      name: "Sign Up",
      text: "Create your indexFlow account and add your venue details.",
    },
    {
      "@type": "HowToStep",
      name: "Configure Your Widget",
      text: "Customize your AI booking widget with your branding and preferences.",
    },
    {
      "@type": "HowToStep",
      name: "Go Live",
      text: "Embed the widget on your website and start accepting bookings.",
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
  name: "indexFlow Hospitality Platform",
  provider: {
    "@type": "Organization",
    name: "indexFlow",
  },
  description: "All-in-one booking, SEO, and AI concierge platform for hospitality venues.",
  serviceType: "SaaS",
  areaServed: "Worldwide",
};

export default SEO;
