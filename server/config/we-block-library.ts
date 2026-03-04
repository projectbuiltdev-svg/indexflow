export interface Block {
  id: string;
  name: string;
  category: string;
  version: number;
  responsive: boolean;
  defaultContent: Record<string, any>;
}

const BLOCKS: Block[] = [
  { id: "hero-centered", name: "Hero Centered", category: "HERO", version: 1, responsive: true, defaultContent: { headline: "Your Headline", subheadline: "Your subheadline text", ctaLabel: "Get Started", ctaUrl: "#" } },
  { id: "hero-split", name: "Hero Split", category: "HERO", version: 1, responsive: true, defaultContent: { headline: "Your Headline", subheadline: "Your subheadline text", ctaLabel: "Learn More", imageUrl: "" } },
  { id: "hero-video-bg", name: "Hero Video Background", category: "HERO", version: 1, responsive: true, defaultContent: { headline: "Your Headline", subheadline: "Your subheadline text", videoUrl: "", ctaLabel: "Watch Now" } },
  { id: "hero-minimal", name: "Hero Minimal", category: "HERO", version: 1, responsive: true, defaultContent: { headline: "Your Headline", ctaLabel: "Get Started" } },
  { id: "nav-standard", name: "Navigation Standard", category: "NAVIGATION", version: 1, responsive: true, defaultContent: { logo: "", links: [] } },
  { id: "nav-sticky", name: "Navigation Sticky", category: "NAVIGATION", version: 1, responsive: true, defaultContent: { logo: "", links: [] } },
  { id: "nav-minimal", name: "Navigation Minimal", category: "NAVIGATION", version: 1, responsive: true, defaultContent: { logo: "", links: [] } },
  { id: "nav-mega", name: "Navigation Mega", category: "NAVIGATION", version: 1, responsive: true, defaultContent: { logo: "", links: [], megaMenuGroups: [] } },
  { id: "content-text-image", name: "Text + Image", category: "CONTENT", version: 1, responsive: true, defaultContent: { heading: "Section Title", body: "Section body text", imageUrl: "", imageAlt: "" } },
  { id: "content-text-only", name: "Text Only", category: "CONTENT", version: 1, responsive: true, defaultContent: { heading: "Section Title", body: "Section body text" } },
  { id: "content-columns-2", name: "Two Columns", category: "CONTENT", version: 1, responsive: true, defaultContent: { columns: [{ heading: "Column 1", body: "Text" }, { heading: "Column 2", body: "Text" }] } },
  { id: "content-columns-3", name: "Three Columns", category: "CONTENT", version: 1, responsive: true, defaultContent: { columns: [{ heading: "Col 1", body: "Text" }, { heading: "Col 2", body: "Text" }, { heading: "Col 3", body: "Text" }] } },
  { id: "content-accordion", name: "Accordion", category: "CONTENT", version: 1, responsive: true, defaultContent: { items: [{ title: "Item 1", body: "Content" }] } },
  { id: "content-tabs", name: "Tabs", category: "CONTENT", version: 1, responsive: true, defaultContent: { tabs: [{ label: "Tab 1", body: "Content" }] } },
  { id: "content-timeline", name: "Timeline", category: "CONTENT", version: 1, responsive: true, defaultContent: { entries: [{ date: "2024", title: "Event", description: "Description" }] } },
  { id: "media-gallery-grid", name: "Gallery Grid", category: "MEDIA", version: 1, responsive: true, defaultContent: { images: [], columns: 3 } },
  { id: "media-gallery-masonry", name: "Gallery Masonry", category: "MEDIA", version: 1, responsive: true, defaultContent: { images: [], columns: 3 } },
  { id: "media-video-embed", name: "Video Embed", category: "MEDIA", version: 1, responsive: true, defaultContent: { videoUrl: "", caption: "" } },
  { id: "media-image-full", name: "Full Width Image", category: "MEDIA", version: 1, responsive: true, defaultContent: { imageUrl: "", alt: "", caption: "" } },
  { id: "social-testimonials-grid", name: "Testimonials Grid", category: "SOCIAL_PROOF", version: 1, responsive: true, defaultContent: { testimonials: [{ quote: "Great service!", author: "Client", role: "CEO" }] } },
  { id: "social-testimonials-carousel", name: "Testimonials Carousel", category: "SOCIAL_PROOF", version: 1, responsive: true, defaultContent: { testimonials: [{ quote: "Great service!", author: "Client", role: "CEO" }] } },
  { id: "social-logos-strip", name: "Logos Strip", category: "SOCIAL_PROOF", version: 1, responsive: true, defaultContent: { logos: [], heading: "Trusted By" } },
  { id: "social-reviews-stars", name: "Reviews Stars", category: "SOCIAL_PROOF", version: 1, responsive: true, defaultContent: { reviews: [{ rating: 5, text: "Excellent!", author: "User" }] } },
  { id: "social-case-study", name: "Case Study", category: "SOCIAL_PROOF", version: 1, responsive: true, defaultContent: { title: "Case Study", client: "", challenge: "", solution: "", result: "" } },
  { id: "cta-banner-centered", name: "CTA Banner Centered", category: "CTA", version: 1, responsive: true, defaultContent: { headline: "Ready to get started?", ctaLabel: "Sign Up", ctaUrl: "#" } },
  { id: "cta-banner-split", name: "CTA Banner Split", category: "CTA", version: 1, responsive: true, defaultContent: { headline: "Ready to get started?", body: "Join us today.", ctaLabel: "Sign Up", ctaUrl: "#" } },
  { id: "cta-sticky-bar", name: "CTA Sticky Bar", category: "CTA", version: 1, responsive: true, defaultContent: { text: "Limited offer!", ctaLabel: "Claim Now", ctaUrl: "#" } },
  { id: "form-contact", name: "Contact Form", category: "FORMS", version: 1, responsive: true, defaultContent: { title: "Contact Us", fields: ["name", "email", "message"], submitLabel: "Send" } },
  { id: "form-newsletter", name: "Newsletter Form", category: "FORMS", version: 1, responsive: true, defaultContent: { title: "Subscribe", placeholder: "Enter your email", submitLabel: "Subscribe" } },
  { id: "form-booking", name: "Booking Form", category: "FORMS", version: 1, responsive: true, defaultContent: { title: "Book Now", fields: ["name", "email", "date", "time"], submitLabel: "Book" } },
  { id: "pricing-table-2col", name: "Pricing 2 Columns", category: "PRICING", version: 1, responsive: true, defaultContent: { plans: [{ name: "Basic", price: "$9/mo", features: [] }, { name: "Pro", price: "$29/mo", features: [] }] } },
  { id: "pricing-table-3col", name: "Pricing 3 Columns", category: "PRICING", version: 1, responsive: true, defaultContent: { plans: [{ name: "Basic", price: "$9/mo", features: [] }, { name: "Pro", price: "$29/mo", features: [] }, { name: "Enterprise", price: "Custom", features: [] }] } },
  { id: "pricing-toggle", name: "Pricing Toggle", category: "PRICING", version: 1, responsive: true, defaultContent: { monthly: [], annual: [], defaultView: "monthly" } },
  { id: "team-grid", name: "Team Grid", category: "TEAM", version: 1, responsive: true, defaultContent: { members: [{ name: "Name", role: "Role", photo: "" }] } },
  { id: "team-list", name: "Team List", category: "TEAM", version: 1, responsive: true, defaultContent: { members: [{ name: "Name", role: "Role", bio: "", photo: "" }] } },
  { id: "stats-counters", name: "Stats Counters", category: "STATS", version: 1, responsive: true, defaultContent: { counters: [{ value: "100+", label: "Clients" }] } },
  { id: "stats-bar-chart", name: "Stats Bar Chart", category: "STATS", version: 1, responsive: true, defaultContent: { bars: [{ label: "Metric", value: 75 }] } },
  { id: "footer-standard", name: "Footer Standard", category: "FOOTER", version: 1, responsive: true, defaultContent: { columns: [], copyright: "© 2026 Company" } },
  { id: "footer-minimal", name: "Footer Minimal", category: "FOOTER", version: 1, responsive: true, defaultContent: { copyright: "© 2026 Company", links: [] } },
  { id: "footer-mega", name: "Footer Mega", category: "FOOTER", version: 1, responsive: true, defaultContent: { columns: [], socialLinks: [], copyright: "© 2026 Company" } },
  { id: "utility-spacer", name: "Spacer", category: "UTILITY", version: 1, responsive: true, defaultContent: { height: "40px" } },
  { id: "utility-divider", name: "Divider", category: "UTILITY", version: 1, responsive: true, defaultContent: { style: "solid", color: "#e5e7eb" } },
  { id: "utility-custom-code", name: "Custom Code", category: "UTILITY", version: 1, responsive: true, defaultContent: { html: "", css: "", js: "" } },
  { id: "utility-embed", name: "Embed", category: "UTILITY", version: 1, responsive: true, defaultContent: { src: "", width: "100%", height: "400px" } },
];

export function getBlock(id: string): Block | undefined {
  return BLOCKS.find((b) => b.id === id);
}

export function getBlocksByCategory(category: string): Block[] {
  return BLOCKS.filter((b) => b.category === category);
}

export function getAllBlocks(): Block[] {
  return BLOCKS;
}
