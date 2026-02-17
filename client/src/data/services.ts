export interface ServiceType {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const serviceTypes: ServiceType[] = [
  { name: "Restaurant Booking", slug: "restaurant-booking", description: "AI-powered reservation system for restaurants", icon: "utensils" },
  { name: "Hotel Reservations", slug: "hotel-reservations", description: "Room booking and management for hotels", icon: "building" },
  { name: "Cafe Management", slug: "cafe-management", description: "Queue and reservation management for cafes", icon: "coffee" },
  { name: "Bar Booking", slug: "bar-booking", description: "Table and event booking for bars and lounges", icon: "wine" },
  { name: "Restaurant SEO", slug: "restaurant-seo", description: "Local SEO optimization for restaurants", icon: "search" },
  { name: "Hospitality Websites", slug: "hospitality-websites", description: "Custom website design for hospitality venues", icon: "globe" },
  { name: "Restaurant Marketing", slug: "restaurant-marketing", description: "Digital marketing for food and beverage venues", icon: "megaphone" },
  { name: "Voice Booking", slug: "voice-booking", description: "AI phone booking assistant for venues", icon: "phone" },
];

export function getServiceBySlug(slug: string): ServiceType | undefined {
  return serviceTypes.find(s => s.slug === slug);
}

export const services = serviceTypes;
