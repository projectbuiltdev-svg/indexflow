export interface Attraction {
  name: string;
  type: string;
}

export interface Location {
  name: string;
  slug: string;
  state: string;
  region: string;
  description: string;
  population: string;
  restaurants: number;
  metaTitle: string;
  metaDescription: string;
  attractions: Attraction[];
  neighborhoods: string[];
}

export const locations: Location[] = [
  {
    name: "New York",
    slug: "new-york",
    state: "NY",
    region: "Northeast",
    description: "The restaurant capital of the world with over 27,000 dining establishments spanning every cuisine imaginable.",
    population: "8.3M",
    restaurants: 27000,
    metaTitle: "Restaurant Booking Software for New York Venues | indexFlow",
    metaDescription: "Streamline reservations for your New York restaurant with AI-powered booking, SEO tools, and guest management.",
    attractions: [
      { name: "Times Square", type: "landmark" },
      { name: "Central Park", type: "park" },
      { name: "Brooklyn Bridge", type: "landmark" },
    ],
    neighborhoods: ["Manhattan", "Brooklyn", "Queens", "SoHo", "Williamsburg"],
  },
  {
    name: "Los Angeles",
    slug: "los-angeles",
    state: "CA",
    region: "West",
    description: "Diverse dining scene spanning every cuisine from farm-to-table to international fusion.",
    population: "3.9M",
    restaurants: 15000,
    metaTitle: "Restaurant Booking Software for Los Angeles | indexFlow",
    metaDescription: "AI-powered reservation system for LA restaurants. Boost bookings and local SEO.",
    attractions: [
      { name: "Hollywood", type: "landmark" },
      { name: "Santa Monica Pier", type: "landmark" },
      { name: "Venice Beach", type: "beach" },
    ],
    neighborhoods: ["Hollywood", "Santa Monica", "Downtown LA", "Silver Lake", "West Hollywood"],
  },
  {
    name: "Chicago",
    slug: "chicago",
    state: "IL",
    region: "Midwest",
    description: "Deep dish and beyond - a culinary powerhouse with award-winning restaurants.",
    population: "2.7M",
    restaurants: 7300,
    metaTitle: "Restaurant Booking Software for Chicago | indexFlow",
    metaDescription: "Manage reservations and boost your Chicago restaurant's online presence.",
    attractions: [
      { name: "Millennium Park", type: "park" },
      { name: "Navy Pier", type: "landmark" },
      { name: "Willis Tower", type: "landmark" },
    ],
    neighborhoods: ["River North", "Wicker Park", "Lincoln Park", "West Loop", "Old Town"],
  },
  {
    name: "Houston",
    slug: "houston",
    state: "TX",
    region: "South",
    description: "Tex-Mex, BBQ, and international flavors make Houston a food lover's paradise.",
    population: "2.3M",
    restaurants: 10000,
    metaTitle: "Restaurant Booking Software for Houston | indexFlow",
    metaDescription: "Smart booking and SEO tools for Houston's diverse restaurant scene.",
    attractions: [
      { name: "Space Center Houston", type: "museum" },
      { name: "Museum District", type: "cultural" },
      { name: "Buffalo Bayou Park", type: "park" },
    ],
    neighborhoods: ["Montrose", "The Heights", "Midtown", "River Oaks", "EaDo"],
  },
  {
    name: "Miami",
    slug: "miami",
    state: "FL",
    region: "South",
    description: "Latin-inspired cuisine meets oceanfront dining in America's tropical paradise.",
    population: "470K",
    restaurants: 4500,
    metaTitle: "Restaurant Booking Software for Miami | indexFlow",
    metaDescription: "Boost reservations for your Miami restaurant with AI-powered booking tools.",
    attractions: [
      { name: "South Beach", type: "beach" },
      { name: "Art Deco District", type: "landmark" },
      { name: "Wynwood Walls", type: "cultural" },
    ],
    neighborhoods: ["South Beach", "Wynwood", "Brickell", "Little Havana", "Coral Gables"],
  },
  {
    name: "San Francisco",
    slug: "san-francisco",
    state: "CA",
    region: "West",
    description: "Farm-to-table innovation at its finest with world-renowned dining establishments.",
    population: "870K",
    restaurants: 4500,
    metaTitle: "Restaurant Booking Software for San Francisco | indexFlow",
    metaDescription: "Smart reservation management for San Francisco restaurants.",
    attractions: [
      { name: "Golden Gate Bridge", type: "landmark" },
      { name: "Fisherman's Wharf", type: "landmark" },
      { name: "Chinatown", type: "neighborhood" },
    ],
    neighborhoods: ["Mission District", "North Beach", "SOMA", "Hayes Valley", "Marina"],
  },
  {
    name: "Las Vegas",
    slug: "las-vegas",
    state: "NV",
    region: "West",
    description: "World-class dining and entertainment with celebrity chef restaurants on every corner.",
    population: "650K",
    restaurants: 3500,
    metaTitle: "Restaurant Booking Software for Las Vegas | indexFlow",
    metaDescription: "Streamline your Las Vegas restaurant reservations with AI-powered tools.",
    attractions: [
      { name: "The Strip", type: "landmark" },
      { name: "Fremont Street", type: "landmark" },
      { name: "Red Rock Canyon", type: "nature" },
    ],
    neighborhoods: ["The Strip", "Downtown", "Summerlin", "Henderson", "Arts District"],
  },
  {
    name: "Seattle",
    slug: "seattle",
    state: "WA",
    region: "West",
    description: "Pacific Northwest flavors and coffee culture with fresh seafood and farm ingredients.",
    population: "740K",
    restaurants: 3500,
    metaTitle: "Restaurant Booking Software for Seattle | indexFlow",
    metaDescription: "Manage reservations and boost online presence for Seattle restaurants.",
    attractions: [
      { name: "Pike Place Market", type: "market" },
      { name: "Space Needle", type: "landmark" },
      { name: "Pioneer Square", type: "neighborhood" },
    ],
    neighborhoods: ["Capitol Hill", "Ballard", "Fremont", "Queen Anne", "Georgetown"],
  },
  {
    name: "Boston",
    slug: "boston",
    state: "MA",
    region: "Northeast",
    description: "Historic dining with modern innovation - from seafood to fine dining.",
    population: "690K",
    restaurants: 3000,
    metaTitle: "Restaurant Booking Software for Boston | indexFlow",
    metaDescription: "AI-powered booking solutions for Boston restaurants and cafes.",
    attractions: [
      { name: "Freedom Trail", type: "landmark" },
      { name: "Faneuil Hall", type: "landmark" },
      { name: "Boston Common", type: "park" },
    ],
    neighborhoods: ["Back Bay", "North End", "Seaport", "South End", "Cambridge"],
  },
  {
    name: "Atlanta",
    slug: "atlanta",
    state: "GA",
    region: "South",
    description: "Southern hospitality meets culinary creativity in the heart of the South.",
    population: "500K",
    restaurants: 4000,
    metaTitle: "Restaurant Booking Software for Atlanta | indexFlow",
    metaDescription: "Smart reservation tools for Atlanta's thriving restaurant scene.",
    attractions: [
      { name: "Georgia Aquarium", type: "attraction" },
      { name: "Piedmont Park", type: "park" },
      { name: "Ponce City Market", type: "market" },
    ],
    neighborhoods: ["Midtown", "Buckhead", "Inman Park", "Old Fourth Ward", "Decatur"],
  },
  {
    name: "Denver",
    slug: "denver",
    state: "CO",
    region: "West",
    description: "Mountain-fresh ingredients and craft dining at the foot of the Rockies.",
    population: "720K",
    restaurants: 3000,
    metaTitle: "Restaurant Booking Software for Denver | indexFlow",
    metaDescription: "Boost your Denver restaurant's bookings with AI-powered reservation management.",
    attractions: [
      { name: "Red Rocks Amphitheatre", type: "landmark" },
      { name: "Denver Art Museum", type: "museum" },
      { name: "Union Station", type: "landmark" },
    ],
    neighborhoods: ["RiNo", "LoDo", "Cherry Creek", "Highland", "Capitol Hill"],
  },
  {
    name: "Nashville",
    slug: "nashville",
    state: "TN",
    region: "South",
    description: "Hot chicken and beyond - a food city on the rise with Southern flair.",
    population: "690K",
    restaurants: 2500,
    metaTitle: "Restaurant Booking Software for Nashville | indexFlow",
    metaDescription: "Manage your Nashville restaurant's reservations with smart booking tools.",
    attractions: [
      { name: "Broadway", type: "entertainment" },
      { name: "Grand Ole Opry", type: "landmark" },
      { name: "The Gulch", type: "neighborhood" },
    ],
    neighborhoods: ["East Nashville", "The Gulch", "12 South", "Germantown", "Midtown"],
  },
  {
    name: "Austin",
    slug: "austin",
    state: "TX",
    region: "South",
    description: "BBQ, tacos, and food trucks galore in the live music capital of the world.",
    population: "980K",
    restaurants: 3500,
    metaTitle: "Restaurant Booking Software for Austin | indexFlow",
    metaDescription: "AI-powered booking and SEO for Austin restaurants and food venues.",
    attractions: [
      { name: "6th Street", type: "entertainment" },
      { name: "Barton Springs", type: "nature" },
      { name: "South Congress", type: "neighborhood" },
    ],
    neighborhoods: ["East Austin", "South Congress", "Rainey Street", "Hyde Park", "Mueller"],
  },
  {
    name: "Portland",
    slug: "portland",
    state: "OR",
    region: "West",
    description: "Indie food scene with sustainable practices and innovative cuisine.",
    population: "650K",
    restaurants: 2500,
    metaTitle: "Restaurant Booking Software for Portland | indexFlow",
    metaDescription: "Smart booking solutions for Portland's unique dining establishments.",
    attractions: [
      { name: "Powell's Books", type: "landmark" },
      { name: "Portland Japanese Garden", type: "garden" },
      { name: "Pearl District", type: "neighborhood" },
    ],
    neighborhoods: ["Pearl District", "Alberta Arts", "Hawthorne", "Division", "Mississippi"],
  },
  {
    name: "New Orleans",
    slug: "new-orleans",
    state: "LA",
    region: "South",
    description: "Cajun, Creole, and soul food traditions that define American culinary heritage.",
    population: "390K",
    restaurants: 1800,
    metaTitle: "Restaurant Booking Software for New Orleans | indexFlow",
    metaDescription: "Streamline reservations for your New Orleans restaurant with AI tools.",
    attractions: [
      { name: "French Quarter", type: "neighborhood" },
      { name: "Bourbon Street", type: "landmark" },
      { name: "Garden District", type: "neighborhood" },
    ],
    neighborhoods: ["French Quarter", "Garden District", "Bywater", "Marigny", "Uptown"],
  },
  {
    name: "Philadelphia",
    slug: "philadelphia",
    state: "PA",
    region: "Northeast",
    description: "From cheesesteaks to fine dining - a diverse food scene with deep roots.",
    population: "1.6M",
    restaurants: 4000,
    metaTitle: "Restaurant Booking Software for Philadelphia | indexFlow",
    metaDescription: "Boost your Philly restaurant's reservations with smart booking management.",
    attractions: [
      { name: "Reading Terminal Market", type: "market" },
      { name: "Independence Hall", type: "landmark" },
      { name: "Philadelphia Museum of Art", type: "museum" },
    ],
    neighborhoods: ["Rittenhouse", "Fishtown", "Old City", "Northern Liberties", "Passyunk"],
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getLocationsByRegion(region: string): Location[] {
  return locations.filter((l) => l.region === region);
}

export function getAllRegions(): string[] {
  return Array.from(new Set(locations.map((l) => l.region)));
}

export function getCityBySlug(slug: string): Location | undefined {
  return getLocationBySlug(slug);
}
