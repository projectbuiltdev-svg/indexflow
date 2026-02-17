export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceType {
  name: string;
  namePlural: string;
  slug: string;
  description: string;
  headline: string;
  subheadline: string;
  icon: string;
  painPoints: string[];
  features: ServiceFeature[];
  faqs: ServiceFAQ[];
}

export const serviceTypes: ServiceType[] = [
  {
    name: "Restaurant Booking",
    namePlural: "Restaurants",
    slug: "restaurants",
    description: "AI-powered reservation system for restaurants",
    headline: "Restaurant Booking Software",
    subheadline: "Streamline reservations and grow your restaurant business with AI-powered booking",
    icon: "utensils",
    painPoints: [
      "No-shows and last-minute cancellations cost restaurants thousands in lost revenue every month",
      "Managing reservations across phone, email, and walk-ins leads to double bookings and confusion",
      "Outdated booking systems don't integrate with your website or social media presence",
      "Staff spend hours on the phone taking reservations instead of serving customers",
    ],
    features: [
      { title: "AI Concierge Widget", description: "24/7 automated booking through your website with smart recommendations based on party size and preferences" },
      { title: "Smart Table Management", description: "Optimize seating with AI that considers party size, dining duration, and special requirements" },
      { title: "Automated Confirmations", description: "SMS and email confirmations reduce no-shows by up to 60% with timely reminders" },
      { title: "Prepaid Deposits", description: "Secure bookings with optional deposits that protect against costly no-shows" },
      { title: "Custom Website", description: "Professional, SEO-optimized website designed specifically for your restaurant" },
      { title: "Voice & SMS Booking", description: "AI phone assistant handles calls and texts to capture bookings around the clock" },
    ],
    faqs: [
      { question: "How does the AI booking widget work?", answer: "Our widget embeds on your website and uses AI to guide guests through the reservation process, answering questions about your menu, hours, and availability in real-time." },
      { question: "Can I customize the booking flow?", answer: "Yes, you can customize party size limits, time slots, special occasion options, seating preferences, and more through your dashboard." },
      { question: "How do prepaid deposits work?", answer: "You set a deposit amount per cover or per booking. Guests pay securely during reservation, and the deposit is applied to their bill or refunded per your policy." },
    ],
  },
  {
    name: "Cafe Booking",
    namePlural: "Cafes",
    slug: "cafes",
    description: "Queue and reservation management for cafes",
    headline: "Cafe Booking & Queue Management",
    subheadline: "Smart queue management and reservations designed for cafes and coffee shops",
    icon: "coffee",
    painPoints: [
      "Long wait times during peak hours drive customers to competitors",
      "No way to predict busy periods leads to understaffing or overstaffing",
      "Walk-in only model means you can't plan for large groups or events",
      "Manual tracking of loyalty customers misses opportunities for repeat business",
    ],
    features: [
      { title: "Virtual Queue System", description: "Let customers join your queue remotely and get notified when their table is ready" },
      { title: "Peak Hour Predictions", description: "AI analyzes patterns to help you staff appropriately and manage capacity" },
      { title: "Group & Event Booking", description: "Accept reservations for study groups, meetings, and private events" },
      { title: "Loyalty Integration", description: "Track regular customers and offer personalized promotions to drive repeat visits" },
      { title: "Custom Cafe Website", description: "Showcase your menu, atmosphere, and booking options with a professional website" },
      { title: "Online Ordering", description: "Integrated ordering for pickup and dine-in to streamline operations" },
    ],
    faqs: [
      { question: "Is the queue system suitable for small cafes?", answer: "Absolutely. Our system scales from small neighborhood cafes to multi-location chains, helping you manage wait times efficiently." },
      { question: "Can customers order ahead?", answer: "Yes, customers can browse your menu and place orders before arriving, reducing wait times and increasing throughput." },
    ],
  },
  {
    name: "Bar Booking",
    namePlural: "Bars",
    slug: "bars",
    description: "Table and event booking for bars and lounges",
    headline: "Bar & Lounge Booking Software",
    subheadline: "Table reservations and event management for bars, lounges, and nightlife venues",
    icon: "wine",
    painPoints: [
      "Overcrowding on weekends while weekday tables sit empty",
      "No structured way to manage VIP bookings and bottle service reservations",
      "Event promotion relies on social media with no integrated booking system",
      "Managing capacity limits and age verification adds complexity to operations",
    ],
    features: [
      { title: "VIP Table Management", description: "Dedicated booking flow for VIP tables, bottle service, and premium experiences" },
      { title: "Event Booking", description: "Create and manage events with ticket sales, guest lists, and capacity controls" },
      { title: "Happy Hour Promotions", description: "Automated promotions to drive traffic during slow periods" },
      { title: "Capacity Management", description: "Real-time tracking of venue capacity with automated waitlist when full" },
      { title: "Custom Bar Website", description: "Showcase your vibe, events, and drink menu with a stunning website" },
      { title: "Group Reservations", description: "Handle birthday parties, corporate events, and group bookings seamlessly" },
    ],
    faqs: [
      { question: "Can I manage bottle service separately?", answer: "Yes, you can create dedicated booking flows for bottle service with minimum spend requirements and VIP perks." },
      { question: "How does event management work?", answer: "Create events, set capacity limits, sell tickets, and manage guest lists all from one dashboard." },
    ],
  },
  {
    name: "Hotel Booking",
    namePlural: "Hotels",
    slug: "hotels",
    description: "Room booking and management for hotels and accommodations",
    headline: "Hotel Booking & Concierge Software",
    subheadline: "AI-powered room booking and guest management for hotels and accommodations",
    icon: "building",
    painPoints: [
      "OTA commissions eat into margins with fees of 15-25% per booking",
      "Managing availability across multiple booking channels leads to overbooking",
      "Guest communication before, during, and after stays requires constant attention",
      "Legacy property management systems are expensive and difficult to update",
    ],
    features: [
      { title: "Direct Booking Engine", description: "Reduce OTA dependency with a branded booking engine that saves on commission fees" },
      { title: "AI Concierge", description: "24/7 guest assistance for check-in, local recommendations, and service requests" },
      { title: "Channel Management", description: "Sync availability across OTAs, your website, and direct booking channels" },
      { title: "Guest Communication", description: "Automated pre-arrival, during-stay, and post-stay messaging" },
      { title: "Custom Hotel Website", description: "Showcase rooms, amenities, and local attractions with a professional website" },
      { title: "Review Management", description: "Collect and respond to guest reviews to maintain your online reputation" },
    ],
    faqs: [
      { question: "Will this replace my PMS?", answer: "Our platform complements your existing PMS by adding AI-powered booking, guest communication, and website management capabilities." },
      { question: "How much can I save on OTA fees?", answer: "Hotels using our direct booking engine typically see 20-40% of bookings shift from OTAs to direct, saving thousands in commission fees." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceType | undefined {
  return serviceTypes.find(s => s.slug === slug);
}

export const services = serviceTypes;
