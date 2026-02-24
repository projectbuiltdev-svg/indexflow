import { type Request, type Response, type NextFunction } from "express";

const BASE_URL = "https://indexflow.cloud";

const routeMeta: Record<string, { title: string; description: string; canonical?: string; ogType?: string }> = {
  "/": {
    title: "indexFlow - Done-For-You SEO and Content Marketing Platform",
    description: "All-in-one SEO, content marketing, and AI-powered platform for agencies. Get more clients with zero effort.",
    canonical: BASE_URL,
    ogType: "website",
  },
  "/founder-statement": {
    title: "Founder Statement - indexFlow",
    description: "Learn how indexFlow helps agencies automate content creation, boost SEO, and engage clients with AI-powered tools.",
    canonical: `${BASE_URL}/founder-statement`,
  },
  "/how-it-works": {
    title: "How It Works - indexFlow",
    description: "Learn how indexFlow helps agencies automate content creation, boost SEO, and engage clients with AI-powered tools.",
    canonical: `${BASE_URL}/how-it-works`,
  },
  "/pricing": {
    title: "Pricing - indexFlow",
    description: "Simple, transparent pricing for agencies and businesses. Start free, scale as you grow.",
    canonical: `${BASE_URL}/pricing`,
  },
  "/contact": {
    title: "Contact Us - indexFlow",
    description: "Get in touch with the indexFlow team. We're here to help your business succeed.",
    canonical: `${BASE_URL}/contact`,
  },
  "/book-demo": {
    title: "Book a Demo - indexFlow",
    description: "Book a demo with the indexFlow team and see our platform in action.",
    canonical: `${BASE_URL}/book-demo`,
  },
  "/faq": {
    title: "FAQ - indexFlow",
    description: "Frequently asked questions about indexFlow's SEO and content marketing platform.",
    canonical: `${BASE_URL}/faq`,
  },
  "/portfolio": {
    title: "Portfolio & Gallery - indexFlow",
    description: "See real examples of agencies powered by indexFlow.",
    canonical: `${BASE_URL}/portfolio`,
  },
  "/templates": {
    title: "Website Templates - indexFlow",
    description: "Professional website templates for agencies and businesses.",
    canonical: `${BASE_URL}/templates`,
  },
  "/blog": {
    title: "Blog - indexFlow",
    description: "SEO tips, content marketing strategies, and agency growth insights from indexFlow.",
    canonical: `${BASE_URL}/blog`,
  },
  "/privacy": {
    title: "Privacy Policy - indexFlow",
    description: "indexFlow privacy policy. Learn how we handle your data.",
    canonical: `${BASE_URL}/privacy`,
  },
  "/terms": {
    title: "Terms of Service - indexFlow",
    description: "indexFlow terms of service and usage agreement.",
    canonical: `${BASE_URL}/terms`,
  },
  "/docs": {
    title: "Platform Documentation - indexFlow",
    description: "Complete documentation for the indexFlow platform.",
    canonical: `${BASE_URL}/docs`,
  },
  "/solutions/seo-agencies": {
    title: "SEO Agencies - IndexFlow",
    description: "All-in-one SEO platform for agencies. Rank tracking, local search grid, on-page audits, link building, and white-label reporting from one dashboard.",
    canonical: `${BASE_URL}/solutions/seo-agencies`,
  },
  "/solutions/content-agencies": {
    title: "Content Marketing Agencies - IndexFlow",
    description: "Scale your content agency with AI-powered bulk drafts, quality gates, CMS integration, and white-label delivery.",
    canonical: `${BASE_URL}/solutions/content-agencies`,
  },
  "/solutions/marketing-agencies": {
    title: "Digital Marketing Agencies - IndexFlow",
    description: "Replace your entire MarTech stack with one platform. Content, SEO, CRM, invoicing, and reporting built for digital marketing agencies.",
    canonical: `${BASE_URL}/solutions/marketing-agencies`,
  },
  "/solutions/freelancers": {
    title: "Freelancers & Consultants - IndexFlow",
    description: "Operate like a 5-person agency with one platform. SEO, content, CRM, invoicing, and reporting — all for $99/month.",
    canonical: `${BASE_URL}/solutions/freelancers`,
  },
  "/solutions/enterprise": {
    title: "White-Label Resellers - IndexFlow",
    description: "Resell IndexFlow as your own SaaS product. White-label branding, custom domain, BYOK support, and flexible pricing for recurring revenue.",
    canonical: `${BASE_URL}/solutions/enterprise`,
  },
  "/platform/ai-widget": {
    title: "AI Widget & Voice - indexFlow Platform",
    description: "Embeddable AI chat widget and voice assistant for agency client sites.",
    canonical: `${BASE_URL}/platform/ai-widget`,
  },
  "/platform/ai-widget-voice": {
    title: "AI Widget & Voice - indexFlow Platform",
    description: "Embeddable AI chat widget and voice assistant for agency client sites.",
    canonical: `${BASE_URL}/platform/ai-widget-voice`,
  },
  "/platform/byok": {
    title: "Bring Your Own Keys (BYOK) - indexFlow Platform",
    description: "Use your own API keys for AI providers. Full control over your AI infrastructure.",
    canonical: `${BASE_URL}/platform/byok`,
  },
  "/platform/content-engine": {
    title: "Content Engine - indexFlow Platform",
    description: "AI-powered content creation and blog management for agencies.",
    canonical: `${BASE_URL}/platform/content-engine`,
  },
  "/platform/content-marketing": {
    title: "Content Engine - indexFlow Platform",
    description: "AI-powered content creation and blog management for agencies.",
    canonical: `${BASE_URL}/platform/content-marketing`,
  },
  "/platform/dashboard": {
    title: "Client Dashboard - indexFlow Platform",
    description: "Powerful dashboard to manage your workspace's content, analytics, and SEO.",
    canonical: `${BASE_URL}/platform/dashboard`,
  },
  "/platform/cms-integration": {
    title: "CMS Integration - indexFlow Platform",
    description: "Publish directly to WordPress, Webflow, Shopify, Ghost, and Wix from one dashboard.",
    canonical: `${BASE_URL}/platform/cms-integration`,
  },
  "/platform/hospitality-websites": {
    title: "CMS Integration - indexFlow Platform",
    description: "Publish directly to WordPress, Webflow, Shopify, Ghost, and Wix from one dashboard.",
    canonical: `${BASE_URL}/platform/hospitality-websites`,
  },
  "/platform/crm-pipeline": {
    title: "CRM & Pipeline - indexFlow Platform",
    description: "Client relationship management and sales pipeline built for agencies.",
    canonical: `${BASE_URL}/platform/crm-pipeline`,
  },
  "/platform/integrations": {
    title: "CRM & Pipeline - indexFlow Platform",
    description: "Client relationship management and sales pipeline built for agencies.",
    canonical: `${BASE_URL}/platform/integrations`,
  },
  "/platform/local-search-grid": {
    title: "Local Search Grid - indexFlow Platform",
    description: "Visualize your local search rankings across a geographic grid.",
    canonical: `${BASE_URL}/platform/local-search-grid`,
  },
  "/platform/rank-tracking": {
    title: "Rank Tracking - indexFlow Platform",
    description: "Monitor search engine rankings and track keyword performance.",
    canonical: `${BASE_URL}/platform/rank-tracking`,
  },
  "/platform/search-console": {
    title: "Search Console Integration - indexFlow Platform",
    description: "Google Search Console integration for deep SEO insights.",
    canonical: `${BASE_URL}/platform/search-console`,
  },
  "/platform/seo-tools": {
    title: "SEO Toolkit - indexFlow Platform",
    description: "Advanced SEO tools to improve your online visibility.",
    canonical: `${BASE_URL}/platform/seo-tools`,
  },
  "/platform/seo-audit": {
    title: "SEO Audit - indexFlow Platform",
    description: "On-page SEO auditing and site profiling tools.",
    canonical: `${BASE_URL}/platform/seo-audit`,
  },
  "/platform/seo": {
    title: "SEO Tools - indexFlow Platform",
    description: "Comprehensive SEO toolkit designed for agencies.",
    canonical: `${BASE_URL}/platform/seo`,
  },
  "/platform/schema-markup": {
    title: "Schema Markup Generator - indexFlow Platform",
    description: "Generate structured data markup for better search engine visibility.",
    canonical: `${BASE_URL}/platform/schema-markup`,
  },
  "/platform/link-builder": {
    title: "Link Builder - indexFlow Platform",
    description: "Internal and external link building tools for SEO.",
    canonical: `${BASE_URL}/platform/link-builder`,
  },
  "/platform/white-label": {
    title: "White Label - indexFlow Platform",
    description: "White-label the entire platform with your own branding, domain, and pricing.",
    canonical: `${BASE_URL}/platform/white-label`,
  },
  "/platform/invoices-reports": {
    title: "Invoices & Reports - indexFlow Platform",
    description: "Professional invoicing and reporting tools for agencies.",
    canonical: `${BASE_URL}/platform/invoices-reports`,
  },
  "/services/local-citations": {
    title: "Local Citations - indexFlow Services",
    description: "Build and manage local citations to improve local search presence.",
    canonical: `${BASE_URL}/services/local-citations`,
  },
  "/comparisons/semrush": {
    title: "indexFlow vs SEMrush - Comparison",
    description: "See how indexFlow compares to SEMrush for agency SEO and content management.",
    canonical: `${BASE_URL}/comparisons/semrush`,
  },
  "/comparisons/ahrefs": {
    title: "indexFlow vs Ahrefs - Comparison",
    description: "Compare indexFlow and Ahrefs for agency SEO workflows and rank tracking.",
    canonical: `${BASE_URL}/comparisons/ahrefs`,
  },
  "/comparisons/best-seo-platforms": {
    title: "Best SEO Platforms Compared - indexFlow",
    description: "Compare the best SEO and marketing platforms side by side.",
    canonical: `${BASE_URL}/comparisons/best-seo-platforms`,
  },
  "/comparisons/pricing": {
    title: "SEO Platform Pricing Comparison - indexFlow",
    description: "Compare pricing across leading SEO and marketing platforms.",
    canonical: `${BASE_URL}/comparisons/pricing`,
  },
  "/comparisons/platform": {
    title: "Platform Comparison - indexFlow",
    description: "Feature-by-feature comparison of leading SEO platforms.",
    canonical: `${BASE_URL}/comparisons/platform`,
  },
  "/comparisons/opentable": {
    title: "indexFlow vs SEMrush - Comparison",
    description: "See how indexFlow compares to SEMrush for agency SEO and content management.",
    canonical: `${BASE_URL}/comparisons/opentable`,
  },
  "/comparisons/resy": {
    title: "indexFlow vs Ahrefs - Comparison",
    description: "Compare indexFlow and Ahrefs for agency SEO workflows and rank tracking.",
    canonical: `${BASE_URL}/comparisons/resy`,
  },
  "/comparisons/best-booking-systems": {
    title: "Best SEO Platforms Compared - indexFlow",
    description: "Compare the best SEO and marketing platforms side by side.",
    canonical: `${BASE_URL}/comparisons/best-booking-systems`,
  },
  "/features/analytics": {
    title: "Analytics - indexFlow Features",
    description: "Deep analytics and reporting for your agency.",
    canonical: `${BASE_URL}/features/analytics`,
  },
  "/features/multi-language": {
    title: "Multi-Language Support - indexFlow Features",
    description: "Serve clients in their preferred language with automatic translation.",
    canonical: `${BASE_URL}/features/multi-language`,
  },
  "/features/sms-confirmations": {
    title: "SMS Notifications - indexFlow Features",
    description: "Automated SMS notifications and reminders for clients.",
    canonical: `${BASE_URL}/features/sms-confirmations`,
  },
  "/features/voice-booking": {
    title: "Voice AI - indexFlow Features",
    description: "AI-powered voice assistant for phone inquiries and scheduling.",
    canonical: `${BASE_URL}/features/voice-booking`,
  },
  "/features/waitlist": {
    title: "Lead Queue Management - indexFlow Features",
    description: "Smart lead queue management to maximize conversions.",
    canonical: `${BASE_URL}/features/waitlist`,
  },
  "/features/prepaid-reservations": {
    title: "Prepaid Services - indexFlow Features",
    description: "Secure payments upfront with prepaid and deposit-based service options.",
    canonical: `${BASE_URL}/features/prepaid-reservations`,
  },
  "/testimonials": {
    title: "Testimonials - indexFlow",
    description: "Hear from agencies and freelancers who use indexFlow to grow their business.",
    canonical: `${BASE_URL}/testimonials`,
  },
  "/case-studies": {
    title: "Case Studies - indexFlow",
    description: "Real results from agencies using indexFlow for SEO and content marketing.",
    canonical: `${BASE_URL}/case-studies`,
  },
  "/solutions/restaurants": {
    title: "SEO Agencies - IndexFlow",
    description: "All-in-one SEO platform for agencies.",
    canonical: `${BASE_URL}/solutions/restaurants`,
  },
  "/solutions/cafes": {
    title: "Content Marketing Agencies - IndexFlow",
    description: "Scale your content agency with AI-powered bulk drafts.",
    canonical: `${BASE_URL}/solutions/cafes`,
  },
  "/solutions/bars": {
    title: "Digital Marketing Agencies - IndexFlow",
    description: "Replace your entire MarTech stack with one platform.",
    canonical: `${BASE_URL}/solutions/bars`,
  },
  "/solutions/hotels": {
    title: "Freelancers & Consultants - IndexFlow",
    description: "Operate like a 5-person agency with one platform.",
    canonical: `${BASE_URL}/solutions/hotels`,
  },
  "/solutions/multi-location": {
    title: "White-Label Resellers - IndexFlow",
    description: "Resell IndexFlow as your own SaaS product.",
    canonical: `${BASE_URL}/solutions/multi-location`,
  },
  "/locations": {
    title: "Locations - indexFlow",
    description: "Find indexFlow agencies and partners near you.",
    canonical: `${BASE_URL}/locations`,
  },
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function injectMeta(html: string, meta: { title: string; description: string; canonical?: string; ogType?: string }): string {
  if (meta.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
    );
  }
  if (meta.description) {
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
    );
  }
  if (meta.canonical) {
    const canonicalTag = `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`;
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, canonicalTag);
    } else {
      html = html.replace("</head>", `  ${canonicalTag}\n  </head>`);
    }
  }
  if (meta.ogType) {
    html = html.replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="${escapeHtml(meta.ogType)}" />`
    );
  }
  return html;
}

export function ssrMetaMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const urlPath = req.path.replace(/\/$/, "") || "/";

    if (urlPath.startsWith("/api") || urlPath.startsWith("/vite-hmr") || urlPath.includes(".")) {
      return next();
    }

    const meta = routeMeta[urlPath];
    if (!meta) {
      return next();
    }

    const originalEnd = res.end.bind(res);
    res.end = function(chunk?: any, ...args: any[]) {
      const contentType = res.getHeader("content-type");
      if (contentType && typeof contentType === "string" && contentType.includes("text/html") && chunk) {
        try {
          const html = typeof chunk === "string" ? chunk : chunk.toString("utf-8");
          const modified = injectMeta(html, meta);
          res.setHeader("content-length", Buffer.byteLength(modified));
          return originalEnd(modified, ...args);
        } catch {
          return originalEnd(chunk, ...args);
        }
      }
      return originalEnd(chunk, ...args);
    } as any;

    next();
  };
}
