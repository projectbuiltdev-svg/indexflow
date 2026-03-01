export interface Attraction {
  name: string;
  type: string;
  description: string;
}

export interface Location {
  name: string;
  city: string;
  slug: string;
  state: string;
  country: string;
  region: string;
  description: string;
  population: string;
  latitude: number;
  longitude: number;
  metaTitle: string;
  metaDescription: string;
  attractions: Attraction[];
  neighborhoods: string[];
}

export const locations: Location[] = [
  // ═══════════════════════════════════════════════
  // UNITED STATES — All 50 States
  // ═══════════════════════════════════════════════

  // Alabama
  {
    name: "Birmingham",
    city: "Birmingham",
    slug: "birmingham-al",
    state: "AL",
    country: "USA",
    region: "North America",
    description: "Alabama's largest city with a growing tech and startup ecosystem, serving agencies and local businesses across the Southeast.",
    population: "200K",
    latitude: 33.5207,
    longitude: -86.8025,
    metaTitle: "SEO & Content Platform for Birmingham AL Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content automation for marketing agencies and businesses in Birmingham, Alabama.",
    attractions: [
      { name: "Innovation Depot", type: "landmark", description: "Alabama's largest startup incubator and tech accelerator" },
      { name: "UAB District", type: "neighborhood", description: "University-adjacent area with growing digital agency presence" },
    ],
    neighborhoods: ["Southside", "Avondale", "Homewood", "Mountain Brook", "Five Points South"],
  },

  // Alaska
  {
    name: "Anchorage",
    city: "Anchorage",
    slug: "anchorage",
    state: "AK",
    country: "USA",
    region: "North America",
    description: "Alaska's largest city where local businesses rely heavily on digital marketing to reach customers across the state's vast geography.",
    population: "290K",
    latitude: 61.2181,
    longitude: -149.9003,
    metaTitle: "SEO & Content Platform for Anchorage Agencies | indexFlow",
    metaDescription: "SEO tools and content management for agencies and businesses serving the Anchorage, Alaska market.",
    attractions: [
      { name: "Downtown Anchorage", type: "landmark", description: "Business hub with concentrated local service providers" },
    ],
    neighborhoods: ["Downtown", "Midtown", "South Anchorage", "Eagle River"],
  },

  // Arizona
  {
    name: "Phoenix",
    city: "Phoenix",
    slug: "phoenix",
    state: "AZ",
    country: "USA",
    region: "North America",
    description: "One of the fastest-growing metros in the US, driving strong demand for SEO and digital marketing across real estate, healthcare, and tech.",
    population: "1.6M",
    latitude: 33.4484,
    longitude: -112.0740,
    metaTitle: "SEO & Content Platform for Phoenix Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in Phoenix and the greater Arizona market.",
    attractions: [
      { name: "Scottsdale", type: "neighborhood", description: "Affluent suburb with concentrated marketing and tech firms" },
      { name: "Tempe", type: "neighborhood", description: "ASU-adjacent tech corridor with startup agencies" },
      { name: "Downtown Phoenix", type: "landmark", description: "Revitalized business core with growing digital sector" },
    ],
    neighborhoods: ["Scottsdale", "Tempe", "Mesa", "Chandler", "Gilbert"],
  },

  // Arkansas
  {
    name: "Little Rock",
    city: "Little Rock",
    slug: "little-rock",
    state: "AR",
    country: "USA",
    region: "North America",
    description: "Arkansas's capital and business hub with agencies serving healthcare, logistics, and local businesses statewide.",
    population: "200K",
    latitude: 34.7465,
    longitude: -92.2896,
    metaTitle: "SEO & Content Platform for Little Rock Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies and businesses in Little Rock, Arkansas.",
    attractions: [
      { name: "River Market District", type: "landmark", description: "Downtown business and entertainment hub" },
    ],
    neighborhoods: ["River Market", "Hillcrest", "The Heights", "West Little Rock"],
  },

  // California
  {
    name: "Los Angeles",
    city: "Los Angeles",
    slug: "los-angeles",
    state: "CA",
    country: "USA",
    region: "North America",
    description: "The entertainment capital drives massive demand for SEO, content, and digital marketing across media, ecommerce, and local business.",
    population: "3.9M",
    latitude: 34.0522,
    longitude: -118.2437,
    metaTitle: "SEO & Content Platform for Los Angeles Agencies | indexFlow",
    metaDescription: "AI-powered SEO, content automation, and white-label reporting for LA-based agencies and marketing teams.",
    attractions: [
      { name: "Santa Monica", type: "neighborhood", description: "Tech-forward neighborhood with numerous digital marketing agencies" },
      { name: "Silicon Beach", type: "neighborhood", description: "LA's tech hub home to hundreds of startups and agencies" },
      { name: "Downtown LA", type: "landmark", description: "Growing center for creative agencies and enterprise marketing" },
    ],
    neighborhoods: ["Hollywood", "Santa Monica", "Downtown LA", "Silver Lake", "West Hollywood", "Beverly Hills"],
  },
  {
    name: "San Francisco",
    city: "San Francisco",
    slug: "san-francisco",
    state: "CA",
    country: "USA",
    region: "North America",
    description: "The epicenter of SaaS and technology, where agencies serve some of the world's most competitive digital markets.",
    population: "870K",
    latitude: 37.7749,
    longitude: -122.4194,
    metaTitle: "SEO & Content Platform for San Francisco Agencies | indexFlow",
    metaDescription: "Enterprise-grade SEO and content automation for agencies in the Bay Area tech ecosystem.",
    attractions: [
      { name: "SOMA", type: "neighborhood", description: "Startup hub with dense concentration of tech and marketing firms" },
      { name: "Financial District", type: "landmark", description: "Corporate marketing teams and enterprise SEO demand" },
    ],
    neighborhoods: ["Mission District", "North Beach", "SOMA", "Hayes Valley", "Marina"],
  },
  {
    name: "San Diego",
    city: "San Diego",
    slug: "san-diego",
    state: "CA",
    country: "USA",
    region: "North America",
    description: "Biotech, defense, and tourism industries fuel a growing digital marketing scene with strong local SEO demand.",
    population: "1.4M",
    latitude: 32.7157,
    longitude: -117.1611,
    metaTitle: "SEO & Content Platform for San Diego Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies and businesses in San Diego, California.",
    attractions: [
      { name: "Downtown San Diego", type: "landmark", description: "Business core with growing startup and agency presence" },
      { name: "UTC", type: "neighborhood", description: "Tech corridor near UCSD with SaaS and marketing firms" },
    ],
    neighborhoods: ["Gaslamp Quarter", "La Jolla", "North Park", "Pacific Beach", "Hillcrest"],
  },

  // Colorado
  {
    name: "Denver",
    city: "Denver",
    slug: "denver",
    state: "CO",
    country: "USA",
    region: "North America",
    description: "Fast-growing tech hub with a strong startup ecosystem and increasing demand for digital marketing and SEO services.",
    population: "720K",
    latitude: 39.7392,
    longitude: -104.9903,
    metaTitle: "SEO & Content Platform for Denver Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for marketing agencies in the Denver metro area.",
    attractions: [
      { name: "RiNo", type: "neighborhood", description: "River North Art District with creative agencies and tech startups" },
      { name: "LoDo", type: "neighborhood", description: "Lower Downtown tech hub with coworking and agency spaces" },
      { name: "Denver Tech Center", type: "landmark", description: "Major business park with enterprise marketing demand" },
    ],
    neighborhoods: ["RiNo", "LoDo", "Cherry Creek", "Highland", "Capitol Hill"],
  },

  // Connecticut
  {
    name: "Hartford",
    city: "Hartford",
    slug: "hartford",
    state: "CT",
    country: "USA",
    region: "North America",
    description: "Insurance capital of the US with enterprise B2B marketing demand and agencies serving financial services and healthcare.",
    population: "120K",
    latitude: 41.7658,
    longitude: -72.6734,
    metaTitle: "SEO & Content Platform for Hartford Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies serving Hartford's insurance and financial services market.",
    attractions: [
      { name: "Downtown Hartford", type: "landmark", description: "Insurance industry HQ cluster with B2B marketing demand" },
    ],
    neighborhoods: ["West End", "Downtown", "Asylum Hill", "South End"],
  },

  // Delaware
  {
    name: "Wilmington",
    city: "Wilmington",
    slug: "wilmington-de",
    state: "DE",
    country: "USA",
    region: "North America",
    description: "Corporate hub between Philadelphia and Baltimore with strong demand for B2B SEO and financial services marketing.",
    population: "70K",
    latitude: 39.7391,
    longitude: -75.5398,
    metaTitle: "SEO & Content Platform for Wilmington DE Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies and businesses in Wilmington, Delaware.",
    attractions: [
      { name: "Wilmington Riverfront", type: "landmark", description: "Revitalized business district with growing tech presence" },
    ],
    neighborhoods: ["Riverfront", "Trolley Square", "Downtown", "Greenville"],
  },

  // Florida
  {
    name: "Miami",
    city: "Miami",
    slug: "miami",
    state: "FL",
    country: "USA",
    region: "North America",
    description: "Gateway to Latin America with a fast-growing tech scene and high demand for bilingual SEO, content marketing, and ecommerce optimization.",
    population: "470K",
    latitude: 25.7617,
    longitude: -80.1918,
    metaTitle: "SEO & Content Platform for Miami Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in Miami and South Florida.",
    attractions: [
      { name: "Brickell", type: "neighborhood", description: "Miami's financial district with a booming startup ecosystem" },
      { name: "Wynwood", type: "neighborhood", description: "Creative district home to digital agencies and tech companies" },
    ],
    neighborhoods: ["South Beach", "Wynwood", "Brickell", "Little Havana", "Coral Gables"],
  },
  {
    name: "Tampa",
    city: "Tampa",
    slug: "tampa",
    state: "FL",
    country: "USA",
    region: "North America",
    description: "Growing tech corridor on Florida's Gulf Coast with strong demand for local SEO, healthcare marketing, and financial services.",
    population: "400K",
    latitude: 27.9506,
    longitude: -82.4572,
    metaTitle: "SEO & Content Platform for Tampa Agencies | indexFlow",
    metaDescription: "SEO and content automation for marketing agencies in the Tampa Bay area.",
    attractions: [
      { name: "Water Street Tampa", type: "landmark", description: "New mixed-use district attracting tech and marketing firms" },
    ],
    neighborhoods: ["Downtown", "Ybor City", "SoHo", "Channelside", "Westshore"],
  },
  {
    name: "Jacksonville",
    city: "Jacksonville",
    slug: "jacksonville",
    state: "FL",
    country: "USA",
    region: "North America",
    description: "Florida's largest city by area with a growing business services sector and demand for local SEO across diverse industries.",
    population: "950K",
    latitude: 30.3322,
    longitude: -81.6557,
    metaTitle: "SEO & Content Platform for Jacksonville Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies and businesses in Jacksonville, Florida.",
    attractions: [
      { name: "Downtown Jacksonville", type: "landmark", description: "Financial services hub with marketing agency presence" },
    ],
    neighborhoods: ["Downtown", "San Marco", "Riverside", "Five Points", "Jacksonville Beach"],
  },

  // Georgia
  {
    name: "Atlanta",
    city: "Atlanta",
    slug: "atlanta",
    state: "GA",
    country: "USA",
    region: "North America",
    description: "The business capital of the Southeast, home to major corporations and a growing digital marketing agency scene.",
    population: "500K",
    latitude: 33.7490,
    longitude: -84.3880,
    metaTitle: "SEO & Content Platform for Atlanta Agencies | indexFlow",
    metaDescription: "Manage SEO, content, and client reporting for your Atlanta marketing agency with indexFlow.",
    attractions: [
      { name: "Midtown", type: "neighborhood", description: "Tech and startup center with coworking spaces and agencies" },
      { name: "Buckhead", type: "neighborhood", description: "Corporate district with enterprise marketing demand" },
      { name: "Atlanta Tech Village", type: "landmark", description: "Largest tech hub in the Southeast for startups" },
    ],
    neighborhoods: ["Midtown", "Buckhead", "Inman Park", "Old Fourth Ward", "Decatur"],
  },

  // Hawaii
  {
    name: "Honolulu",
    city: "Honolulu",
    slug: "honolulu",
    state: "HI",
    country: "USA",
    region: "North America",
    description: "Tourism-driven economy where local businesses compete intensely for search visibility and need strong digital marketing support.",
    population: "350K",
    latitude: 21.3069,
    longitude: -157.8583,
    metaTitle: "SEO & Content Platform for Honolulu Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies serving Honolulu's tourism and local business market.",
    attractions: [
      { name: "Waikiki", type: "neighborhood", description: "Tourism hotspot with intense local SEO competition" },
    ],
    neighborhoods: ["Waikiki", "Downtown", "Kailua", "Kakaako", "Ala Moana"],
  },

  // Idaho
  {
    name: "Boise",
    city: "Boise",
    slug: "boise",
    state: "ID",
    country: "USA",
    region: "North America",
    description: "One of the fastest-growing cities in the US, attracting tech companies and agencies from more expensive markets.",
    population: "230K",
    latitude: 43.6150,
    longitude: -116.2023,
    metaTitle: "SEO & Content Platform for Boise Agencies | indexFlow",
    metaDescription: "SEO and content management for agencies and businesses in Boise, Idaho.",
    attractions: [
      { name: "Downtown Boise", type: "landmark", description: "Growing tech corridor attracting remote-friendly companies" },
    ],
    neighborhoods: ["Downtown", "North End", "Boise Bench", "Eagle", "Meridian"],
  },

  // Illinois
  {
    name: "Chicago",
    city: "Chicago",
    slug: "chicago",
    state: "IL",
    country: "USA",
    region: "North America",
    description: "A major business hub with a thriving agency scene serving Fortune 500 companies, SaaS brands, and local businesses across the Midwest.",
    population: "2.7M",
    latitude: 41.8781,
    longitude: -87.6298,
    metaTitle: "SEO & Content Platform for Chicago Agencies | indexFlow",
    metaDescription: "Manage SEO, content production, and client reporting for your Chicago-based marketing agency from one platform.",
    attractions: [
      { name: "The Loop", type: "landmark", description: "Chicago's business core with major agency headquarters" },
      { name: "River North", type: "neighborhood", description: "Dense cluster of advertising and digital marketing firms" },
      { name: "West Loop", type: "neighborhood", description: "Growing tech and startup scene with coworking spaces" },
    ],
    neighborhoods: ["River North", "Wicker Park", "Lincoln Park", "West Loop", "Old Town"],
  },

  // Indiana
  {
    name: "Indianapolis",
    city: "Indianapolis",
    slug: "indianapolis",
    state: "IN",
    country: "USA",
    region: "North America",
    description: "Central location and low cost of living attract agencies serving healthcare, insurance, and Midwest businesses.",
    population: "880K",
    latitude: 39.7684,
    longitude: -86.1581,
    metaTitle: "SEO & Content Platform for Indianapolis Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for marketing agencies in Indianapolis, Indiana.",
    attractions: [
      { name: "Downtown Indy", type: "landmark", description: "Business district with marketing and tech firm presence" },
    ],
    neighborhoods: ["Downtown", "Broad Ripple", "Mass Ave", "Fountain Square", "Carmel"],
  },

  // Iowa
  {
    name: "Des Moines",
    city: "Des Moines",
    slug: "des-moines",
    state: "IA",
    country: "USA",
    region: "North America",
    description: "Iowa's capital with a strong insurance and financial services sector driving B2B marketing and SEO demand.",
    population: "215K",
    latitude: 41.5868,
    longitude: -93.6250,
    metaTitle: "SEO & Content Platform for Des Moines Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Des Moines, Iowa.",
    attractions: [
      { name: "East Village", type: "neighborhood", description: "Revitalized district with creative agencies and startups" },
    ],
    neighborhoods: ["East Village", "Downtown", "West Des Moines", "Ankeny"],
  },

  // Kansas
  {
    name: "Kansas City",
    city: "Kansas City",
    slug: "kansas-city",
    state: "KS",
    country: "USA",
    region: "North America",
    description: "Emerging tech hub straddling two states with a growing startup scene and affordable operating costs for agencies.",
    population: "500K",
    latitude: 39.0997,
    longitude: -94.5786,
    metaTitle: "SEO & Content Platform for Kansas City Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in the Kansas City metro area.",
    attractions: [
      { name: "Crossroads Arts District", type: "neighborhood", description: "Creative hub with digital agencies and tech startups" },
    ],
    neighborhoods: ["Crossroads", "Westport", "Country Club Plaza", "River Market", "Brookside"],
  },

  // Kentucky
  {
    name: "Louisville",
    city: "Louisville",
    slug: "louisville",
    state: "KY",
    country: "USA",
    region: "North America",
    description: "Kentucky's largest city with a growing tech scene and agencies serving healthcare, manufacturing, and hospitality sectors.",
    population: "630K",
    latitude: 38.2527,
    longitude: -85.7585,
    metaTitle: "SEO & Content Platform for Louisville Agencies | indexFlow",
    metaDescription: "SEO and content management for marketing agencies in Louisville, Kentucky.",
    attractions: [
      { name: "NuLu", type: "neighborhood", description: "New Louisville arts and innovation district" },
    ],
    neighborhoods: ["NuLu", "Highlands", "Downtown", "St. Matthews", "Germantown"],
  },

  // Louisiana
  {
    name: "New Orleans",
    city: "New Orleans",
    slug: "new-orleans",
    state: "LA",
    country: "USA",
    region: "North America",
    description: "Tourism and hospitality industries create unique local SEO challenges, with agencies serving a vibrant small business ecosystem.",
    population: "390K",
    latitude: 29.9511,
    longitude: -90.0715,
    metaTitle: "SEO & Content Platform for New Orleans Agencies | indexFlow",
    metaDescription: "Local SEO and content tools for marketing agencies serving New Orleans businesses.",
    attractions: [
      { name: "French Quarter", type: "neighborhood", description: "High-competition local SEO market with dense small businesses" },
      { name: "Warehouse District", type: "neighborhood", description: "Growing tech and creative agency presence" },
    ],
    neighborhoods: ["French Quarter", "Garden District", "Bywater", "Marigny", "Uptown"],
  },

  // Maine
  {
    name: "Portland ME",
    city: "Portland",
    slug: "portland-me",
    state: "ME",
    country: "USA",
    region: "North America",
    description: "New England's creative hub with boutique agencies serving tourism, craft industries, and local businesses across Maine.",
    population: "68K",
    latitude: 43.6591,
    longitude: -70.2568,
    metaTitle: "SEO & Content Platform for Portland ME Agencies | indexFlow",
    metaDescription: "SEO and content platform for marketing agencies and businesses in Portland, Maine.",
    attractions: [
      { name: "Old Port", type: "neighborhood", description: "Historic waterfront district with small business concentration" },
    ],
    neighborhoods: ["Old Port", "East End", "West End", "Munjoy Hill"],
  },

  // Maryland
  {
    name: "Baltimore",
    city: "Baltimore",
    slug: "baltimore",
    state: "MD",
    country: "USA",
    region: "North America",
    description: "Healthcare, education, and government sectors drive specialized SEO demand in the Baltimore-DC corridor.",
    population: "580K",
    latitude: 39.2904,
    longitude: -76.6122,
    metaTitle: "SEO & Content Platform for Baltimore Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in the Baltimore metro area.",
    attractions: [
      { name: "Harbor East", type: "neighborhood", description: "Revitalized waterfront with tech and creative firms" },
      { name: "Federal Hill", type: "neighborhood", description: "Growing startup and small agency presence" },
    ],
    neighborhoods: ["Harbor East", "Federal Hill", "Fells Point", "Canton", "Mount Vernon"],
  },

  // Massachusetts
  {
    name: "Boston",
    city: "Boston",
    slug: "boston",
    state: "MA",
    country: "USA",
    region: "North America",
    description: "Education and biotech industries drive specialized SEO demand, with agencies serving academic institutions, startups, and healthcare brands.",
    population: "690K",
    latitude: 42.3601,
    longitude: -71.0589,
    metaTitle: "SEO & Content Platform for Boston Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content management for marketing agencies in the Boston metro area.",
    attractions: [
      { name: "Seaport District", type: "neighborhood", description: "Innovation district with a growing tech and startup ecosystem" },
      { name: "Cambridge/Kendall Square", type: "neighborhood", description: "MIT-adjacent hub for biotech and SaaS marketing" },
    ],
    neighborhoods: ["Back Bay", "North End", "Seaport", "South End", "Cambridge"],
  },

  // Michigan
  {
    name: "Detroit",
    city: "Detroit",
    slug: "detroit",
    state: "MI",
    country: "USA",
    region: "North America",
    description: "Motor City's tech renaissance is creating new demand for digital marketing, with agencies serving automotive, manufacturing, and startups.",
    population: "640K",
    latitude: 42.3314,
    longitude: -83.0458,
    metaTitle: "SEO & Content Platform for Detroit Agencies | indexFlow",
    metaDescription: "SEO and content platform for marketing agencies in Detroit and Southeast Michigan.",
    attractions: [
      { name: "Downtown Detroit", type: "landmark", description: "Revitalized business core with growing tech scene" },
      { name: "Corktown", type: "neighborhood", description: "Startup neighborhood near Ford's mobility campus" },
    ],
    neighborhoods: ["Downtown", "Corktown", "Midtown", "Ferndale", "Royal Oak"],
  },

  // Minnesota
  {
    name: "Minneapolis",
    city: "Minneapolis",
    slug: "minneapolis",
    state: "MN",
    country: "USA",
    region: "North America",
    description: "Twin Cities metro with major corporate headquarters driving enterprise marketing demand and a strong agency ecosystem.",
    population: "430K",
    latitude: 44.9778,
    longitude: -93.2650,
    metaTitle: "SEO & Content Platform for Minneapolis Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in the Minneapolis-St. Paul metro.",
    attractions: [
      { name: "North Loop", type: "neighborhood", description: "Warehouse district turned startup and creative agency hub" },
    ],
    neighborhoods: ["North Loop", "Uptown", "Northeast", "Downtown", "St. Paul"],
  },

  // Mississippi
  {
    name: "Jackson",
    city: "Jackson",
    slug: "jackson-ms",
    state: "MS",
    country: "USA",
    region: "North America",
    description: "Mississippi's capital serving as the state's business and government hub with growing digital marketing needs.",
    population: "150K",
    latitude: 32.2988,
    longitude: -90.1848,
    metaTitle: "SEO & Content Platform for Jackson MS Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies and businesses in Jackson, Mississippi.",
    attractions: [
      { name: "Fondren District", type: "neighborhood", description: "Creative neighborhood with small business cluster" },
    ],
    neighborhoods: ["Fondren", "Downtown", "Belhaven", "Madison"],
  },

  // Missouri
  {
    name: "St. Louis",
    city: "St. Louis",
    slug: "st-louis",
    state: "MO",
    country: "USA",
    region: "North America",
    description: "Gateway to the West with a diversified economy and agencies serving healthcare, biotech, and enterprise clients.",
    population: "300K",
    latitude: 38.6270,
    longitude: -90.1994,
    metaTitle: "SEO & Content Platform for St. Louis Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in St. Louis, Missouri.",
    attractions: [
      { name: "Cortex Innovation Community", type: "landmark", description: "Tech and innovation district with startup agencies" },
    ],
    neighborhoods: ["Central West End", "Soulard", "The Grove", "Clayton", "Maplewood"],
  },

  // Montana
  {
    name: "Billings",
    city: "Billings",
    slug: "billings",
    state: "MT",
    country: "USA",
    region: "North America",
    description: "Montana's largest city where local agencies serve energy, agriculture, and tourism businesses across the state.",
    population: "120K",
    latitude: 45.7833,
    longitude: -108.5007,
    metaTitle: "SEO & Content Platform for Billings Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies and businesses in Billings, Montana.",
    attractions: [
      { name: "Downtown Billings", type: "landmark", description: "Business center for Montana's largest metro area" },
    ],
    neighborhoods: ["Downtown", "Heights", "West End"],
  },

  // Nebraska
  {
    name: "Omaha",
    city: "Omaha",
    slug: "omaha",
    state: "NE",
    country: "USA",
    region: "North America",
    description: "Home to Berkshire Hathaway and a growing tech scene, with agencies serving finance, insurance, and Midwest businesses.",
    population: "490K",
    latitude: 41.2565,
    longitude: -95.9345,
    metaTitle: "SEO & Content Platform for Omaha Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for marketing agencies in Omaha, Nebraska.",
    attractions: [
      { name: "Old Market", type: "neighborhood", description: "Historic district with creative and digital agency presence" },
    ],
    neighborhoods: ["Old Market", "Midtown", "Dundee", "Benson", "Aksarben"],
  },

  // Nevada
  {
    name: "Las Vegas",
    city: "Las Vegas",
    slug: "las-vegas",
    state: "NV",
    country: "USA",
    region: "North America",
    description: "Hospitality, entertainment, and tourism drive massive local SEO demand with thousands of businesses competing for visibility.",
    population: "650K",
    latitude: 36.1699,
    longitude: -115.1398,
    metaTitle: "SEO & Content Platform for Las Vegas Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies serving Las Vegas hospitality, entertainment, and local businesses.",
    attractions: [
      { name: "The Strip", type: "landmark", description: "High-competition local SEO market for hospitality businesses" },
      { name: "Downtown Arts District", type: "neighborhood", description: "Growing tech startup community with creative agencies" },
    ],
    neighborhoods: ["The Strip", "Downtown", "Summerlin", "Henderson", "Arts District"],
  },

  // New Hampshire
  {
    name: "Manchester",
    city: "Manchester",
    slug: "manchester-nh",
    state: "NH",
    country: "USA",
    region: "North America",
    description: "New Hampshire's largest city with a growing tech sector and agencies serving businesses across Northern New England.",
    population: "115K",
    latitude: 42.9956,
    longitude: -71.4548,
    metaTitle: "SEO & Content Platform for Manchester NH Agencies | indexFlow",
    metaDescription: "SEO and content management for agencies and businesses in Manchester, New Hampshire.",
    attractions: [
      { name: "Millyard", type: "landmark", description: "Historic mill complex transformed into tech and startup campus" },
    ],
    neighborhoods: ["Millyard", "Downtown", "South Side", "North End"],
  },

  // New Jersey
  {
    name: "Newark",
    city: "Newark",
    slug: "newark",
    state: "NJ",
    country: "USA",
    region: "North America",
    description: "New Jersey's largest city, benefiting from NYC proximity with lower costs, attracting agencies and tech startups.",
    population: "310K",
    latitude: 40.7357,
    longitude: -74.1724,
    metaTitle: "SEO & Content Platform for Newark Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content tools for agencies in Newark and Northern New Jersey.",
    attractions: [
      { name: "Ironbound District", type: "neighborhood", description: "Diverse business district with entrepreneurial energy" },
    ],
    neighborhoods: ["Ironbound", "Downtown", "University Heights", "North Ward"],
  },

  // New Mexico
  {
    name: "Albuquerque",
    city: "Albuquerque",
    slug: "albuquerque",
    state: "NM",
    country: "USA",
    region: "North America",
    description: "New Mexico's largest city with a growing tech and film industry creating new demand for digital marketing services.",
    population: "560K",
    latitude: 35.0844,
    longitude: -106.6504,
    metaTitle: "SEO & Content Platform for Albuquerque Agencies | indexFlow",
    metaDescription: "SEO and content platform for marketing agencies and businesses in Albuquerque, New Mexico.",
    attractions: [
      { name: "Downtown Albuquerque", type: "landmark", description: "Business hub with growing startup and tech presence" },
    ],
    neighborhoods: ["Downtown", "Nob Hill", "Old Town", "North Valley", "Uptown"],
  },

  // New York
  {
    name: "New York",
    city: "New York",
    slug: "new-york",
    state: "NY",
    country: "USA",
    region: "North America",
    description: "The largest digital marketing hub in the US, home to thousands of agencies, startups, and enterprise brands competing for search visibility.",
    population: "8.3M",
    latitude: 40.7128,
    longitude: -74.0060,
    metaTitle: "SEO & Content Platform for New York Agencies | indexFlow",
    metaDescription: "All-in-one SEO, content management, and client reporting platform for agencies and businesses in New York City.",
    attractions: [
      { name: "Midtown Manhattan", type: "landmark", description: "Dense concentration of agencies and corporate marketing teams" },
      { name: "Silicon Alley", type: "neighborhood", description: "NYC's tech startup corridor with hundreds of digital agencies" },
      { name: "Flatiron District", type: "neighborhood", description: "Hub for SaaS companies, ad-tech firms, and marketing agencies" },
    ],
    neighborhoods: ["Manhattan", "Brooklyn", "Queens", "SoHo", "Williamsburg", "Greenwich Village"],
  },

  // North Carolina
  {
    name: "Charlotte",
    city: "Charlotte",
    slug: "charlotte",
    state: "NC",
    country: "USA",
    region: "North America",
    description: "Major banking and fintech hub with agencies serving financial services, healthcare, and the rapidly growing Charlotte metro.",
    population: "880K",
    latitude: 35.2271,
    longitude: -80.8431,
    metaTitle: "SEO & Content Platform for Charlotte Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for marketing agencies in Charlotte, North Carolina.",
    attractions: [
      { name: "South End", type: "neighborhood", description: "Trendy neighborhood with tech startups and creative agencies" },
      { name: "Uptown Charlotte", type: "landmark", description: "Financial district with banking and enterprise marketing teams" },
    ],
    neighborhoods: ["South End", "NoDa", "Uptown", "Plaza Midwood", "Dilworth"],
  },

  // North Dakota
  {
    name: "Fargo",
    city: "Fargo",
    slug: "fargo",
    state: "ND",
    country: "USA",
    region: "North America",
    description: "Surprisingly strong startup scene for its size, with agencies serving agriculture, energy, and tech businesses across the Dakotas.",
    population: "125K",
    latitude: 46.8772,
    longitude: -96.7898,
    metaTitle: "SEO & Content Platform for Fargo Agencies | indexFlow",
    metaDescription: "SEO and content management for agencies and businesses in Fargo, North Dakota.",
    attractions: [
      { name: "Downtown Fargo", type: "landmark", description: "Startup-friendly downtown with growing tech ecosystem" },
    ],
    neighborhoods: ["Downtown", "West Fargo", "South Fargo"],
  },

  // Ohio
  {
    name: "Columbus",
    city: "Columbus",
    slug: "columbus",
    state: "OH",
    country: "USA",
    region: "North America",
    description: "Ohio's capital with a booming tech scene, home to major retail brands and a growing pool of digital marketing agencies.",
    population: "900K",
    latitude: 39.9612,
    longitude: -82.9988,
    metaTitle: "SEO & Content Platform for Columbus Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in Columbus, Ohio.",
    attractions: [
      { name: "Short North", type: "neighborhood", description: "Arts district with creative agencies and tech startups" },
    ],
    neighborhoods: ["Short North", "German Village", "Downtown", "Grandview", "Clintonville"],
  },

  // Oklahoma
  {
    name: "Oklahoma City",
    city: "Oklahoma City",
    slug: "oklahoma-city",
    state: "OK",
    country: "USA",
    region: "North America",
    description: "Energy sector drives enterprise marketing demand, complemented by a growing small business and startup community.",
    population: "680K",
    latitude: 35.4676,
    longitude: -97.5164,
    metaTitle: "SEO & Content Platform for Oklahoma City Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Oklahoma City.",
    attractions: [
      { name: "Automobile Alley", type: "neighborhood", description: "Revitalized district with creative and digital firms" },
    ],
    neighborhoods: ["Automobile Alley", "Midtown", "Bricktown", "Paseo", "Nichols Hills"],
  },

  // Oregon
  {
    name: "Portland",
    city: "Portland",
    slug: "portland",
    state: "OR",
    country: "USA",
    region: "North America",
    description: "Independent and sustainability-focused businesses create strong demand for boutique SEO and content marketing services.",
    population: "650K",
    latitude: 45.5152,
    longitude: -122.6784,
    metaTitle: "SEO & Content Platform for Portland Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content management for marketing agencies and freelancers in Portland, Oregon.",
    attractions: [
      { name: "Pearl District", type: "neighborhood", description: "Upscale neighborhood with creative agencies and tech firms" },
      { name: "Central Eastside", type: "neighborhood", description: "Industrial-creative hub with growing startup presence" },
    ],
    neighborhoods: ["Pearl District", "Alberta Arts", "Hawthorne", "Division", "Mississippi"],
  },

  // Pennsylvania
  {
    name: "Philadelphia",
    city: "Philadelphia",
    slug: "philadelphia",
    state: "PA",
    country: "USA",
    region: "North America",
    description: "A cost-effective East Coast hub for agencies, with strong demand from healthcare, education, and local businesses.",
    population: "1.6M",
    latitude: 39.9526,
    longitude: -75.1652,
    metaTitle: "SEO & Content Platform for Philadelphia Agencies | indexFlow",
    metaDescription: "AI-powered SEO, content automation, and client management for Philadelphia marketing agencies.",
    attractions: [
      { name: "Center City", type: "landmark", description: "Downtown business core with major agency headquarters" },
      { name: "University City", type: "neighborhood", description: "Innovation hub near UPenn and Drexel with startup agencies" },
    ],
    neighborhoods: ["Rittenhouse", "Fishtown", "Old City", "Northern Liberties", "Passyunk"],
  },
  {
    name: "Pittsburgh",
    city: "Pittsburgh",
    slug: "pittsburgh",
    state: "PA",
    country: "USA",
    region: "North America",
    description: "Transformed from steel to tech, with CMU and major tech companies driving demand for sophisticated digital marketing services.",
    population: "300K",
    latitude: 40.4406,
    longitude: -79.9959,
    metaTitle: "SEO & Content Platform for Pittsburgh Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Pittsburgh, Pennsylvania.",
    attractions: [
      { name: "Strip District", type: "neighborhood", description: "Tech hub with startups and creative agency spaces" },
    ],
    neighborhoods: ["Strip District", "Lawrenceville", "Shadyside", "Oakland", "South Side"],
  },

  // Rhode Island
  {
    name: "Providence",
    city: "Providence",
    slug: "providence",
    state: "RI",
    country: "USA",
    region: "North America",
    description: "Creative capital of New England with RISD and Brown driving innovation in design, tech, and digital marketing.",
    population: "190K",
    latitude: 41.8240,
    longitude: -71.4128,
    metaTitle: "SEO & Content Platform for Providence Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies and businesses in Providence, Rhode Island.",
    attractions: [
      { name: "Downtown Providence", type: "landmark", description: "Creative and tech hub near major universities" },
    ],
    neighborhoods: ["Downtown", "Federal Hill", "East Side", "Fox Point"],
  },

  // South Carolina
  {
    name: "Charleston",
    city: "Charleston",
    slug: "charleston-sc",
    state: "SC",
    country: "USA",
    region: "North America",
    description: "Tech-forward Southern city attracting agencies and startups with a thriving tourism and hospitality market to serve.",
    population: "150K",
    latitude: 32.7765,
    longitude: -79.9311,
    metaTitle: "SEO & Content Platform for Charleston SC Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Charleston, South Carolina.",
    attractions: [
      { name: "Upper King Street", type: "neighborhood", description: "Growing tech and creative district" },
    ],
    neighborhoods: ["Downtown", "Upper King", "Mount Pleasant", "West Ashley", "James Island"],
  },

  // South Dakota
  {
    name: "Sioux Falls",
    city: "Sioux Falls",
    slug: "sioux-falls",
    state: "SD",
    country: "USA",
    region: "North America",
    description: "South Dakota's largest city with a pro-business environment and agencies serving financial services and local businesses.",
    population: "200K",
    latitude: 43.5460,
    longitude: -96.7313,
    metaTitle: "SEO & Content Platform for Sioux Falls Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Sioux Falls, South Dakota.",
    attractions: [
      { name: "Downtown Sioux Falls", type: "landmark", description: "Business hub with growing digital marketing sector" },
    ],
    neighborhoods: ["Downtown", "East Side", "West Side"],
  },

  // Tennessee
  {
    name: "Nashville",
    city: "Nashville",
    slug: "nashville",
    state: "TN",
    country: "USA",
    region: "North America",
    description: "Rapid growth in healthcare, entertainment, and small business is fueling demand for SEO and content marketing agencies.",
    population: "690K",
    latitude: 36.1627,
    longitude: -86.7816,
    metaTitle: "SEO & Content Platform for Nashville Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in Nashville, Tennessee.",
    attractions: [
      { name: "The Gulch", type: "neighborhood", description: "Trendy business district with digital agencies and startups" },
      { name: "East Nashville", type: "neighborhood", description: "Creative neighborhood attracting freelancers and small agencies" },
    ],
    neighborhoods: ["East Nashville", "The Gulch", "12 South", "Germantown", "Midtown"],
  },

  // Texas
  {
    name: "Houston",
    city: "Houston",
    slug: "houston",
    state: "TX",
    country: "USA",
    region: "North America",
    description: "Energy sector, healthcare, and a booming small business landscape drive strong demand for SEO and digital marketing services.",
    population: "2.3M",
    latitude: 29.7604,
    longitude: -95.3698,
    metaTitle: "SEO & Content Platform for Houston Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies serving Houston's diverse business market.",
    attractions: [
      { name: "Energy Corridor", type: "landmark", description: "Major business district with enterprise marketing demand" },
      { name: "Midtown", type: "neighborhood", description: "Growing hub for startups and digital agencies" },
    ],
    neighborhoods: ["Montrose", "The Heights", "Midtown", "River Oaks", "EaDo"],
  },
  {
    name: "Austin",
    city: "Austin",
    slug: "austin",
    state: "TX",
    country: "USA",
    region: "North America",
    description: "Texas tech capital with a booming startup scene, attracting agencies and freelancers who need powerful, affordable SEO tools.",
    population: "980K",
    latitude: 30.2672,
    longitude: -97.7431,
    metaTitle: "SEO & Content Platform for Austin Agencies | indexFlow",
    metaDescription: "White-label SEO and content automation for agencies and freelancers in Austin, Texas.",
    attractions: [
      { name: "East Austin", type: "neighborhood", description: "Startup-dense area with coworking spaces and digital agencies" },
      { name: "Domain", type: "neighborhood", description: "Tech campus area home to major SaaS companies" },
    ],
    neighborhoods: ["East Austin", "South Congress", "Rainey Street", "Hyde Park", "Mueller"],
  },
  {
    name: "Dallas",
    city: "Dallas",
    slug: "dallas",
    state: "TX",
    country: "USA",
    region: "North America",
    description: "Major corporate hub with Fortune 500 headquarters driving enterprise marketing demand and a strong agency ecosystem.",
    population: "1.3M",
    latitude: 32.7767,
    longitude: -96.7970,
    metaTitle: "SEO & Content Platform for Dallas Agencies | indexFlow",
    metaDescription: "Enterprise-grade SEO and content automation for agencies in the Dallas-Fort Worth metro.",
    attractions: [
      { name: "Uptown Dallas", type: "neighborhood", description: "Business and entertainment district with agency headquarters" },
      { name: "Deep Ellum", type: "neighborhood", description: "Creative district with boutique digital agencies" },
    ],
    neighborhoods: ["Uptown", "Deep Ellum", "Bishop Arts", "Downtown", "Design District"],
  },
  {
    name: "San Antonio",
    city: "San Antonio",
    slug: "san-antonio",
    state: "TX",
    country: "USA",
    region: "North America",
    description: "Second-largest city in Texas with military, healthcare, and tourism sectors driving local SEO and marketing demand.",
    population: "1.5M",
    latitude: 29.4241,
    longitude: -98.4936,
    metaTitle: "SEO & Content Platform for San Antonio Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies and businesses in San Antonio, Texas.",
    attractions: [
      { name: "Pearl District", type: "neighborhood", description: "Revitalized brewery district with creative business presence" },
    ],
    neighborhoods: ["Pearl", "Southtown", "Downtown", "Alamo Heights", "Stone Oak"],
  },

  // Utah
  {
    name: "Salt Lake City",
    city: "Salt Lake City",
    slug: "salt-lake-city",
    state: "UT",
    country: "USA",
    region: "North America",
    description: "Silicon Slopes tech corridor makes SLC one of the fastest-growing tech hubs, with strong demand for SaaS and digital marketing.",
    population: "200K",
    latitude: 40.7608,
    longitude: -111.8910,
    metaTitle: "SEO & Content Platform for Salt Lake City Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Utah's Silicon Slopes.",
    attractions: [
      { name: "Silicon Slopes", type: "landmark", description: "Utah's tech corridor with major SaaS companies and agencies" },
    ],
    neighborhoods: ["Downtown", "Sugar House", "9th & 9th", "Lehi", "Provo"],
  },

  // Vermont
  {
    name: "Burlington",
    city: "Burlington",
    slug: "burlington-vt",
    state: "VT",
    country: "USA",
    region: "North America",
    description: "Vermont's largest city with a creative, sustainability-focused business community and boutique agency presence.",
    population: "45K",
    latitude: 44.4759,
    longitude: -73.2121,
    metaTitle: "SEO & Content Platform for Burlington VT Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies and businesses in Burlington, Vermont.",
    attractions: [
      { name: "Church Street", type: "landmark", description: "Pedestrian marketplace hub for local businesses" },
    ],
    neighborhoods: ["Downtown", "Old North End", "South End", "New North End"],
  },

  // Virginia
  {
    name: "Richmond",
    city: "Richmond",
    slug: "richmond",
    state: "VA",
    country: "USA",
    region: "North America",
    description: "Virginia's capital with agencies serving government, defense, financial services, and a growing startup ecosystem.",
    population: "230K",
    latitude: 37.5407,
    longitude: -77.4360,
    metaTitle: "SEO & Content Platform for Richmond Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for marketing agencies in Richmond, Virginia.",
    attractions: [
      { name: "Scott's Addition", type: "neighborhood", description: "Revitalized neighborhood with creative and tech firms" },
    ],
    neighborhoods: ["Scott's Addition", "The Fan", "Shockoe Bottom", "Carytown", "Downtown"],
  },

  // Washington
  {
    name: "Seattle",
    city: "Seattle",
    slug: "seattle",
    state: "WA",
    country: "USA",
    region: "North America",
    description: "Tech-forward city anchored by Amazon and Microsoft, with a thriving agency ecosystem serving SaaS, ecommerce, and enterprise clients.",
    population: "740K",
    latitude: 47.6062,
    longitude: -122.3321,
    metaTitle: "SEO & Content Platform for Seattle Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content automation for agencies in Seattle's competitive tech market.",
    attractions: [
      { name: "South Lake Union", type: "neighborhood", description: "Amazon HQ area with dense tech and marketing demand" },
      { name: "Capitol Hill", type: "neighborhood", description: "Creative hub for freelancers and boutique digital agencies" },
    ],
    neighborhoods: ["Capitol Hill", "Ballard", "Fremont", "Queen Anne", "Georgetown"],
  },

  // West Virginia
  {
    name: "Charleston WV",
    city: "Charleston",
    slug: "charleston-wv",
    state: "WV",
    country: "USA",
    region: "North America",
    description: "West Virginia's capital where agencies serve energy, healthcare, and government sectors across the state.",
    population: "47K",
    latitude: 38.3498,
    longitude: -81.6326,
    metaTitle: "SEO & Content Platform for Charleston WV Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Charleston, West Virginia.",
    attractions: [
      { name: "Capitol Street", type: "landmark", description: "Downtown business corridor with professional services firms" },
    ],
    neighborhoods: ["Downtown", "East End", "South Hills", "Kanawha City"],
  },

  // Wisconsin
  {
    name: "Milwaukee",
    city: "Milwaukee",
    slug: "milwaukee",
    state: "WI",
    country: "USA",
    region: "North America",
    description: "Manufacturing heritage meets tech growth, with agencies serving industrial B2B clients and a thriving small business scene.",
    population: "580K",
    latitude: 43.0389,
    longitude: -87.9065,
    metaTitle: "SEO & Content Platform for Milwaukee Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for marketing agencies in Milwaukee, Wisconsin.",
    attractions: [
      { name: "Third Ward", type: "neighborhood", description: "Historic warehouse district with creative agencies and startups" },
    ],
    neighborhoods: ["Third Ward", "Bay View", "East Side", "Walker's Point", "Downtown"],
  },

  // Wyoming
  {
    name: "Cheyenne",
    city: "Cheyenne",
    slug: "cheyenne",
    state: "WY",
    country: "USA",
    region: "North America",
    description: "Wyoming's capital with a business-friendly environment and agencies serving energy, agriculture, and tourism sectors.",
    population: "65K",
    latitude: 41.1400,
    longitude: -104.8202,
    metaTitle: "SEO & Content Platform for Cheyenne Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies and businesses in Cheyenne, Wyoming.",
    attractions: [
      { name: "Downtown Cheyenne", type: "landmark", description: "State capital business district" },
    ],
    neighborhoods: ["Downtown", "South Cheyenne"],
  },

  // ═══════════════════════════════════════════════
  // CANADA
  // ═══════════════════════════════════════════════
  {
    name: "Toronto",
    city: "Toronto",
    slug: "toronto",
    state: "ON",
    country: "Canada",
    region: "North America",
    description: "Canada's largest city and business capital, with a massive agency ecosystem serving finance, tech, and enterprise clients.",
    population: "2.9M",
    latitude: 43.6532,
    longitude: -79.3832,
    metaTitle: "SEO & Content Platform for Toronto Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content automation for marketing agencies in Toronto, Canada.",
    attractions: [
      { name: "King West", type: "neighborhood", description: "Toronto's tech and startup corridor" },
      { name: "Liberty Village", type: "neighborhood", description: "Creative agency hub in converted industrial space" },
    ],
    neighborhoods: ["King West", "Liberty Village", "Yorkville", "Leslieville", "Queen West"],
  },
  {
    name: "Vancouver",
    city: "Vancouver",
    slug: "vancouver",
    state: "BC",
    country: "Canada",
    region: "North America",
    description: "West Coast tech hub with strong ties to Silicon Valley and Asia-Pacific markets, home to a vibrant agency community.",
    population: "630K",
    latitude: 49.2827,
    longitude: -123.1207,
    metaTitle: "SEO & Content Platform for Vancouver Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for agencies in Vancouver, British Columbia.",
    attractions: [
      { name: "Gastown", type: "neighborhood", description: "Historic district with tech startups and creative agencies" },
      { name: "Mount Pleasant", type: "neighborhood", description: "Growing tech and digital agency neighborhood" },
    ],
    neighborhoods: ["Gastown", "Yaletown", "Mount Pleasant", "Kitsilano", "Commercial Drive"],
  },
  {
    name: "Montreal",
    city: "Montreal",
    slug: "montreal",
    state: "QC",
    country: "Canada",
    region: "North America",
    description: "Bilingual metropolis with a thriving creative and tech sector, strong in AI research and digital marketing innovation.",
    population: "1.8M",
    latitude: 45.5017,
    longitude: -73.5673,
    metaTitle: "SEO & Content Platform for Montreal Agencies | indexFlow",
    metaDescription: "SEO and content tools for bilingual marketing agencies in Montreal, Quebec.",
    attractions: [
      { name: "Mile End", type: "neighborhood", description: "Creative hub with tech startups and design agencies" },
    ],
    neighborhoods: ["Mile End", "Old Montreal", "Plateau", "Griffintown", "Downtown"],
  },
  {
    name: "Calgary",
    city: "Calgary",
    slug: "calgary",
    state: "AB",
    country: "Canada",
    region: "North America",
    description: "Energy capital of Canada with agencies serving oil & gas, fintech, and growing tech sectors.",
    population: "1.3M",
    latitude: 51.0447,
    longitude: -114.0719,
    metaTitle: "SEO & Content Platform for Calgary Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in Calgary, Alberta.",
    attractions: [
      { name: "East Village", type: "neighborhood", description: "Revitalized district with tech and innovation hub" },
    ],
    neighborhoods: ["East Village", "Beltline", "Kensington", "Inglewood", "Downtown"],
  },
  {
    name: "Ottawa",
    city: "Ottawa",
    slug: "ottawa",
    state: "ON",
    country: "Canada",
    region: "North America",
    description: "Canada's capital with a strong government and tech sector (Silicon Valley North), creating demand for B2B and enterprise marketing.",
    population: "1.0M",
    latitude: 45.4215,
    longitude: -75.6972,
    metaTitle: "SEO & Content Platform for Ottawa Agencies | indexFlow",
    metaDescription: "SEO and content management for agencies serving Ottawa's government and tech sectors.",
    attractions: [
      { name: "Kanata", type: "neighborhood", description: "Ottawa's tech park with Shopify HQ and SaaS firms" },
    ],
    neighborhoods: ["Kanata", "ByWard Market", "Westboro", "Glebe", "Downtown"],
  },

  // ═══════════════════════════════════════════════
  // UNITED KINGDOM
  // ═══════════════════════════════════════════════
  {
    name: "London",
    city: "London",
    slug: "london",
    state: "",
    country: "UK",
    region: "Europe",
    description: "One of the world's largest agency markets, with thousands of SEO, content, and digital marketing firms serving global clients.",
    population: "9.0M",
    latitude: 51.5074,
    longitude: -0.1278,
    metaTitle: "SEO & Content Platform for London Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content automation for marketing agencies in London, UK.",
    attractions: [
      { name: "Shoreditch", type: "neighborhood", description: "London's tech and creative agency hub" },
      { name: "Soho", type: "neighborhood", description: "Advertising and media agency district" },
      { name: "Canary Wharf", type: "landmark", description: "Financial district with enterprise marketing demand" },
    ],
    neighborhoods: ["Shoreditch", "Soho", "Canary Wharf", "King's Cross", "Clerkenwell"],
  },
  {
    name: "Manchester",
    city: "Manchester",
    slug: "manchester",
    state: "",
    country: "UK",
    region: "Europe",
    description: "The UK's second-largest digital hub, with a fast-growing agency scene and lower operating costs than London.",
    population: "550K",
    latitude: 53.4808,
    longitude: -2.2426,
    metaTitle: "SEO & Content Platform for Manchester Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Manchester, UK.",
    attractions: [
      { name: "Northern Quarter", type: "neighborhood", description: "Creative hub with digital agencies and startups" },
      { name: "MediaCityUK", type: "landmark", description: "Major media and tech campus at Salford Quays" },
    ],
    neighborhoods: ["Northern Quarter", "Ancoats", "Spinningfields", "Deansgate", "Salford"],
  },
  {
    name: "Birmingham UK",
    city: "Birmingham",
    slug: "birmingham-uk",
    state: "",
    country: "UK",
    region: "Europe",
    description: "UK's second-largest city with a growing tech and digital sector, serving businesses across the Midlands.",
    population: "1.1M",
    latitude: 52.4862,
    longitude: -1.8904,
    metaTitle: "SEO & Content Platform for Birmingham UK Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Birmingham, United Kingdom.",
    attractions: [
      { name: "Digbeth", type: "neighborhood", description: "Creative quarter with tech startups and digital agencies" },
    ],
    neighborhoods: ["Digbeth", "Jewellery Quarter", "City Centre", "Edgbaston"],
  },
  {
    name: "Edinburgh",
    city: "Edinburgh",
    slug: "edinburgh",
    state: "",
    country: "UK",
    region: "Europe",
    description: "Scotland's capital with a strong fintech and festival-driven tourism economy creating diverse marketing demand.",
    population: "540K",
    latitude: 55.9533,
    longitude: -3.1883,
    metaTitle: "SEO & Content Platform for Edinburgh Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for agencies in Edinburgh, Scotland.",
    attractions: [
      { name: "Old Town", type: "landmark", description: "Historic center with concentrated business services" },
    ],
    neighborhoods: ["Old Town", "New Town", "Leith", "Stockbridge", "Haymarket"],
  },
  {
    name: "Glasgow",
    city: "Glasgow",
    slug: "glasgow",
    state: "",
    country: "UK",
    region: "Europe",
    description: "Scotland's largest city with a creative economy and agencies serving media, tech, and public sector clients.",
    population: "630K",
    latitude: 55.8642,
    longitude: -4.2518,
    metaTitle: "SEO & Content Platform for Glasgow Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Glasgow, Scotland.",
    attractions: [
      { name: "Merchant City", type: "neighborhood", description: "Business and creative quarter with agency presence" },
    ],
    neighborhoods: ["Merchant City", "West End", "Finnieston", "City Centre"],
  },
  {
    name: "Bristol",
    city: "Bristol",
    slug: "bristol",
    state: "",
    country: "UK",
    region: "Europe",
    description: "Creative tech city in Southwest England with a strong independent agency scene and growing startup ecosystem.",
    population: "470K",
    latitude: 51.4545,
    longitude: -2.5879,
    metaTitle: "SEO & Content Platform for Bristol Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies and businesses in Bristol, UK.",
    attractions: [
      { name: "Harbourside", type: "landmark", description: "Waterfront business district with creative firms" },
    ],
    neighborhoods: ["Harbourside", "Stokes Croft", "Clifton", "Old Market", "Redland"],
  },
  {
    name: "Leeds",
    city: "Leeds",
    slug: "leeds",
    state: "",
    country: "UK",
    region: "Europe",
    description: "Major financial and legal services hub in Northern England with a growing digital marketing sector.",
    population: "810K",
    latitude: 53.8008,
    longitude: -1.5491,
    metaTitle: "SEO & Content Platform for Leeds Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for marketing agencies in Leeds, UK.",
    attractions: [
      { name: "Leeds Dock", type: "landmark", description: "Digital and tech hub with agency offices" },
    ],
    neighborhoods: ["Leeds Dock", "City Centre", "Chapel Allerton", "Headingley"],
  },

  // ═══════════════════════════════════════════════
  // IRELAND
  // ═══════════════════════════════════════════════
  {
    name: "Dublin",
    city: "Dublin",
    slug: "dublin",
    state: "",
    country: "Ireland",
    region: "Europe",
    description: "European HQ for Google, Meta, and major tech companies, creating a massive demand for digital marketing talent and agencies.",
    population: "1.4M",
    latitude: 53.3498,
    longitude: -6.2603,
    metaTitle: "SEO & Content Platform for Dublin Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Dublin's thriving tech ecosystem.",
    attractions: [
      { name: "Silicon Docks", type: "neighborhood", description: "European HQ of Google, Meta, and major tech firms" },
      { name: "Digital Hub", type: "landmark", description: "Ireland's center for digital enterprise" },
    ],
    neighborhoods: ["Silicon Docks", "Temple Bar", "IFSC", "Rathmines", "Ranelagh"],
  },
  {
    name: "Cork",
    city: "Cork",
    slug: "cork",
    state: "",
    country: "Ireland",
    region: "Europe",
    description: "Ireland's second city with a growing pharma and tech sector and agencies serving Munster businesses.",
    population: "210K",
    latitude: 51.8985,
    longitude: -8.4756,
    metaTitle: "SEO & Content Platform for Cork Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Cork, Ireland.",
    attractions: [
      { name: "City Centre", type: "landmark", description: "Compact business hub with growing digital sector" },
    ],
    neighborhoods: ["City Centre", "Douglas", "Ballincollig", "Mahon"],
  },
  {
    name: "Galway",
    city: "Galway",
    slug: "galway",
    state: "",
    country: "Ireland",
    region: "Europe",
    description: "West of Ireland tech and creative hub with medtech and tourism sectors driving digital marketing demand.",
    population: "85K",
    latitude: 53.2707,
    longitude: -9.0568,
    metaTitle: "SEO & Content Platform for Galway Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies and businesses in Galway, Ireland.",
    attractions: [
      { name: "Galway City Innovation District", type: "landmark", description: "Tech and innovation cluster" },
    ],
    neighborhoods: ["City Centre", "Salthill", "Westside", "Knocknacarra"],
  },

  // ═══════════════════════════════════════════════
  // AUSTRALIA
  // ═══════════════════════════════════════════════
  {
    name: "Sydney",
    city: "Sydney",
    slug: "sydney",
    state: "NSW",
    country: "Australia",
    region: "Asia-Pacific",
    description: "Australia's largest city and business capital with a mature agency market serving finance, tech, and enterprise clients.",
    population: "5.3M",
    latitude: -33.8688,
    longitude: 151.2093,
    metaTitle: "SEO & Content Platform for Sydney Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content automation for marketing agencies in Sydney, Australia.",
    attractions: [
      { name: "Surry Hills", type: "neighborhood", description: "Creative hub with digital agencies and tech startups" },
      { name: "Barangaroo", type: "landmark", description: "New business precinct with enterprise marketing demand" },
    ],
    neighborhoods: ["Surry Hills", "Barangaroo", "Pyrmont", "North Sydney", "Bondi"],
  },
  {
    name: "Melbourne",
    city: "Melbourne",
    slug: "melbourne",
    state: "VIC",
    country: "Australia",
    region: "Asia-Pacific",
    description: "Australia's creative capital with a strong design and tech culture, home to many boutique and mid-size agencies.",
    population: "5.0M",
    latitude: -37.8136,
    longitude: 144.9631,
    metaTitle: "SEO & Content Platform for Melbourne Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content tools for agencies in Melbourne, Australia.",
    attractions: [
      { name: "Collingwood", type: "neighborhood", description: "Creative neighborhood with digital agencies and studios" },
      { name: "South Melbourne", type: "neighborhood", description: "Growing tech and co-working hub" },
    ],
    neighborhoods: ["Collingwood", "Fitzroy", "South Melbourne", "Richmond", "St Kilda"],
  },
  {
    name: "Brisbane",
    city: "Brisbane",
    slug: "brisbane",
    state: "QLD",
    country: "Australia",
    region: "Asia-Pacific",
    description: "Queensland's capital with a rapidly growing tech sector and agencies serving mining, tourism, and professional services.",
    population: "2.5M",
    latitude: -27.4698,
    longitude: 153.0251,
    metaTitle: "SEO & Content Platform for Brisbane Agencies | indexFlow",
    metaDescription: "SEO and content platform for marketing agencies in Brisbane, Queensland.",
    attractions: [
      { name: "Fortitude Valley", type: "neighborhood", description: "Brisbane's creative and startup hub" },
    ],
    neighborhoods: ["Fortitude Valley", "South Bank", "New Farm", "West End", "CBD"],
  },
  {
    name: "Perth",
    city: "Perth",
    slug: "perth",
    state: "WA",
    country: "Australia",
    region: "Asia-Pacific",
    description: "Western Australia's capital with mining sector wealth driving demand for B2B marketing and professional services SEO.",
    population: "2.1M",
    latitude: -31.9505,
    longitude: 115.8605,
    metaTitle: "SEO & Content Platform for Perth Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Perth, Western Australia.",
    attractions: [
      { name: "Perth CBD", type: "landmark", description: "Business center with mining sector marketing demand" },
    ],
    neighborhoods: ["CBD", "Northbridge", "Subiaco", "Fremantle", "Leederville"],
  },

  // ═══════════════════════════════════════════════
  // NEW ZEALAND
  // ═══════════════════════════════════════════════
  {
    name: "Auckland",
    city: "Auckland",
    slug: "auckland",
    state: "",
    country: "New Zealand",
    region: "Asia-Pacific",
    description: "New Zealand's largest city and business hub with agencies serving tourism, agriculture, and a growing tech sector.",
    population: "1.7M",
    latitude: -36.8485,
    longitude: 174.7633,
    metaTitle: "SEO & Content Platform for Auckland Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for marketing agencies in Auckland, New Zealand.",
    attractions: [
      { name: "Britomart", type: "neighborhood", description: "Downtown precinct with tech and creative firms" },
    ],
    neighborhoods: ["Britomart", "Ponsonby", "Parnell", "Newmarket", "Grey Lynn"],
  },
  {
    name: "Wellington",
    city: "Wellington",
    slug: "wellington",
    state: "",
    country: "New Zealand",
    region: "Asia-Pacific",
    description: "New Zealand's capital with a strong government and creative sector, known for film, games, and tech innovation.",
    population: "215K",
    latitude: -41.2865,
    longitude: 174.7762,
    metaTitle: "SEO & Content Platform for Wellington Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies in Wellington, New Zealand.",
    attractions: [
      { name: "Te Aro", type: "neighborhood", description: "Creative and tech hub in central Wellington" },
    ],
    neighborhoods: ["Te Aro", "Cuba Street", "Lambton Quay", "Thorndon"],
  },

  // ═══════════════════════════════════════════════
  // SOUTH AMERICA & MEXICO
  // ═══════════════════════════════════════════════
  {
    name: "São Paulo",
    city: "São Paulo",
    slug: "sao-paulo",
    state: "",
    country: "Brazil",
    region: "South America",
    description: "Latin America's largest city and economic powerhouse, with a massive digital marketing ecosystem serving Portuguese-speaking markets.",
    population: "12.3M",
    latitude: -23.5505,
    longitude: -46.6333,
    metaTitle: "SEO & Content Platform for São Paulo Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for agencies in São Paulo, Brazil.",
    attractions: [
      { name: "Faria Lima", type: "neighborhood", description: "Financial district and startup hub" },
    ],
    neighborhoods: ["Faria Lima", "Vila Madalena", "Pinheiros", "Itaim Bibi", "Jardins"],
  },
  {
    name: "Buenos Aires",
    city: "Buenos Aires",
    slug: "buenos-aires",
    state: "",
    country: "Argentina",
    region: "South America",
    description: "Creative capital of South America with a thriving tech and design community and affordable talent for digital marketing.",
    population: "3.1M",
    latitude: -34.6037,
    longitude: -58.3816,
    metaTitle: "SEO & Content Platform for Buenos Aires Agencies | indexFlow",
    metaDescription: "SEO and content tools for marketing agencies in Buenos Aires, Argentina.",
    attractions: [
      { name: "Palermo Soho", type: "neighborhood", description: "Tech and creative agency hub" },
    ],
    neighborhoods: ["Palermo Soho", "Puerto Madero", "San Telmo", "Recoleta", "Belgrano"],
  },
  {
    name: "Bogotá",
    city: "Bogotá",
    slug: "bogota",
    state: "",
    country: "Colombia",
    region: "South America",
    description: "Colombia's capital and growing tech hub with agencies serving Latin American markets and US-based clients.",
    population: "7.4M",
    latitude: 4.7110,
    longitude: -74.0721,
    metaTitle: "SEO & Content Platform for Bogotá Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Bogotá, Colombia.",
    attractions: [
      { name: "Chapinero", type: "neighborhood", description: "Startup and tech hub with coworking spaces" },
    ],
    neighborhoods: ["Chapinero", "Usaquén", "La Candelaria", "Zona T"],
  },
  {
    name: "Mexico City",
    city: "Mexico City",
    slug: "mexico-city",
    state: "",
    country: "Mexico",
    region: "South America",
    description: "Latin America's largest Spanish-speaking market with a booming startup scene and agencies serving both domestic and US markets.",
    population: "9.2M",
    latitude: 19.4326,
    longitude: -99.1332,
    metaTitle: "SEO & Content Platform for Mexico City Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for marketing agencies in Mexico City.",
    attractions: [
      { name: "Roma Norte", type: "neighborhood", description: "Trendy district with startups and creative agencies" },
      { name: "Polanco", type: "neighborhood", description: "Business district with corporate marketing teams" },
    ],
    neighborhoods: ["Roma Norte", "Condesa", "Polanco", "Santa Fe", "Coyoacán"],
  },
  {
    name: "Lima",
    city: "Lima",
    slug: "lima",
    state: "",
    country: "Peru",
    region: "South America",
    description: "Peru's capital with a growing tech and startup ecosystem and agencies serving Andean region markets.",
    population: "10.0M",
    latitude: -12.0464,
    longitude: -77.0428,
    metaTitle: "SEO & Content Platform for Lima Agencies | indexFlow",
    metaDescription: "SEO and content platform for marketing agencies in Lima, Peru.",
    attractions: [
      { name: "Miraflores", type: "neighborhood", description: "Business district with tech and startup presence" },
    ],
    neighborhoods: ["Miraflores", "San Isidro", "Barranco", "Surco"],
  },
  {
    name: "Santiago",
    city: "Santiago",
    slug: "santiago",
    state: "",
    country: "Chile",
    region: "South America",
    description: "Chile's capital and most stable economy in South America, with agencies serving mining, finance, and tech sectors.",
    population: "6.8M",
    latitude: -33.4489,
    longitude: -70.6693,
    metaTitle: "SEO & Content Platform for Santiago Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content tools for marketing agencies in Santiago, Chile.",
    attractions: [
      { name: "Las Condes", type: "neighborhood", description: "Business and financial district" },
    ],
    neighborhoods: ["Las Condes", "Providencia", "Vitacura", "Santiago Centro", "Ñuñoa"],
  },

  // ═══════════════════════════════════════════════
  // SPAIN
  // ═══════════════════════════════════════════════
  {
    name: "Madrid",
    city: "Madrid",
    slug: "madrid",
    state: "",
    country: "Spain",
    region: "Europe",
    description: "Spain's capital and largest business market, with agencies serving enterprise clients and the broader Spanish-speaking world.",
    population: "3.3M",
    latitude: 40.4168,
    longitude: -3.7038,
    metaTitle: "SEO & Content Platform for Madrid Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for agencies in Madrid, Spain.",
    attractions: [
      { name: "Salamanca", type: "neighborhood", description: "Business district with corporate and agency offices" },
    ],
    neighborhoods: ["Salamanca", "Malasaña", "Chamberí", "Retiro", "La Latina"],
  },
  {
    name: "Barcelona",
    city: "Barcelona",
    slug: "barcelona",
    state: "",
    country: "Spain",
    region: "Europe",
    description: "Europe's startup capital with a thriving tech and creative scene, attracting agencies from across the Mediterranean.",
    population: "1.6M",
    latitude: 41.3874,
    longitude: 2.1686,
    metaTitle: "SEO & Content Platform for Barcelona Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content tools for agencies in Barcelona, Spain.",
    attractions: [
      { name: "22@", type: "neighborhood", description: "Barcelona's innovation district with tech and creative firms" },
    ],
    neighborhoods: ["22@", "Eixample", "El Born", "Gràcia", "Poblenou"],
  },

  // ═══════════════════════════════════════════════
  // FRANCE
  // ═══════════════════════════════════════════════
  {
    name: "Paris",
    city: "Paris",
    slug: "paris",
    state: "",
    country: "France",
    region: "Europe",
    description: "France's capital and one of Europe's largest agency markets, with a growing tech scene centered around Station F and La Défense.",
    population: "2.2M",
    latitude: 48.8566,
    longitude: 2.3522,
    metaTitle: "SEO & Content Platform for Paris Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content automation for agencies in Paris, France.",
    attractions: [
      { name: "Station F", type: "landmark", description: "World's largest startup campus" },
      { name: "Le Marais", type: "neighborhood", description: "Creative and tech startup district" },
    ],
    neighborhoods: ["Le Marais", "La Défense", "Sentier", "Bastille", "Oberkampf"],
  },
  {
    name: "Lyon",
    city: "Lyon",
    slug: "lyon",
    state: "",
    country: "France",
    region: "Europe",
    description: "France's second-largest metro with a strong biotech and gaming industry creating specialized marketing demand.",
    population: "520K",
    latitude: 45.7640,
    longitude: 4.8357,
    metaTitle: "SEO & Content Platform for Lyon Agencies | indexFlow",
    metaDescription: "SEO and content platform for marketing agencies in Lyon, France.",
    attractions: [
      { name: "Part-Dieu", type: "landmark", description: "Major business district in central Lyon" },
    ],
    neighborhoods: ["Part-Dieu", "Confluence", "Presqu'île", "Vieux Lyon"],
  },

  // ═══════════════════════════════════════════════
  // GERMANY
  // ═══════════════════════════════════════════════
  {
    name: "Berlin",
    city: "Berlin",
    slug: "berlin",
    state: "",
    country: "Germany",
    region: "Europe",
    description: "Europe's startup capital with the highest concentration of VC-backed companies and a massive international agency scene.",
    population: "3.6M",
    latitude: 52.5200,
    longitude: 13.4050,
    metaTitle: "SEO & Content Platform for Berlin Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Berlin, Germany.",
    attractions: [
      { name: "Kreuzberg", type: "neighborhood", description: "Startup and creative agency hub" },
      { name: "Mitte", type: "neighborhood", description: "Central Berlin with tech companies and coworking spaces" },
    ],
    neighborhoods: ["Kreuzberg", "Mitte", "Prenzlauer Berg", "Friedrichshain", "Neukölln"],
  },
  {
    name: "Munich",
    city: "Munich",
    slug: "munich",
    state: "",
    country: "Germany",
    region: "Europe",
    description: "Bavaria's capital and Germany's enterprise tech hub, with agencies serving automotive, industrial, and SaaS clients.",
    population: "1.5M",
    latitude: 48.1351,
    longitude: 11.5820,
    metaTitle: "SEO & Content Platform for Munich Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Munich, Germany.",
    attractions: [
      { name: "Schwabing", type: "neighborhood", description: "Tech and creative district near the university" },
    ],
    neighborhoods: ["Schwabing", "Maxvorstadt", "Haidhausen", "Glockenbachviertel"],
  },
  {
    name: "Hamburg",
    city: "Hamburg",
    slug: "hamburg",
    state: "",
    country: "Germany",
    region: "Europe",
    description: "Germany's media capital with strong advertising, publishing, and ecommerce industries driving agency demand.",
    population: "1.9M",
    latitude: 53.5511,
    longitude: 9.9937,
    metaTitle: "SEO & Content Platform for Hamburg Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies in Hamburg, Germany.",
    attractions: [
      { name: "Schanzenviertel", type: "neighborhood", description: "Creative quarter with media and digital agencies" },
    ],
    neighborhoods: ["Schanzenviertel", "HafenCity", "Altona", "St. Pauli", "Eimsbüttel"],
  },

  // ═══════════════════════════════════════════════
  // ITALY
  // ═══════════════════════════════════════════════
  {
    name: "Rome",
    city: "Rome",
    slug: "rome",
    state: "",
    country: "Italy",
    region: "Europe",
    description: "Italy's capital with agencies serving tourism, fashion, and government sectors in one of Europe's most competitive local markets.",
    population: "2.8M",
    latitude: 41.9028,
    longitude: 12.4964,
    metaTitle: "SEO & Content Platform for Rome Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Rome, Italy.",
    attractions: [
      { name: "EUR", type: "neighborhood", description: "Business district with corporate offices" },
    ],
    neighborhoods: ["EUR", "Trastevere", "Prati", "Testaccio", "San Lorenzo"],
  },
  {
    name: "Milan",
    city: "Milan",
    slug: "milan",
    state: "",
    country: "Italy",
    region: "Europe",
    description: "Italy's business and fashion capital with the country's strongest digital marketing ecosystem and agency scene.",
    population: "1.4M",
    latitude: 45.4642,
    longitude: 9.1900,
    metaTitle: "SEO & Content Platform for Milan Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Milan, Italy.",
    attractions: [
      { name: "Porta Nuova", type: "landmark", description: "Modern business district and tech hub" },
    ],
    neighborhoods: ["Porta Nuova", "Navigli", "Brera", "Isola", "Tortona"],
  },

  // ═══════════════════════════════════════════════
  // NETHERLANDS
  // ═══════════════════════════════════════════════
  {
    name: "Amsterdam",
    city: "Amsterdam",
    slug: "amsterdam",
    state: "",
    country: "Netherlands",
    region: "Europe",
    description: "Major European tech hub with a strong international agency community serving clients across the EU and beyond.",
    population: "870K",
    latitude: 52.3676,
    longitude: 4.9041,
    metaTitle: "SEO & Content Platform for Amsterdam Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for agencies in Amsterdam, Netherlands.",
    attractions: [
      { name: "Amsterdam Startup Village", type: "landmark", description: "Tech incubator and startup campus" },
    ],
    neighborhoods: ["De Pijp", "Jordaan", "Zuidas", "Oost", "Noord"],
  },

  // ═══════════════════════════════════════════════
  // BELGIUM
  // ═══════════════════════════════════════════════
  {
    name: "Brussels",
    city: "Brussels",
    slug: "brussels",
    state: "",
    country: "Belgium",
    region: "Europe",
    description: "EU capital with agencies serving European institutions, international organizations, and multilingual markets.",
    population: "1.2M",
    latitude: 50.8503,
    longitude: 4.3517,
    metaTitle: "SEO & Content Platform for Brussels Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies serving the Brussels and EU market.",
    attractions: [
      { name: "EU Quarter", type: "landmark", description: "European institutions district with B2B marketing demand" },
    ],
    neighborhoods: ["EU Quarter", "Ixelles", "Saint-Gilles", "Louise", "Flagey"],
  },

  // ═══════════════════════════════════════════════
  // PORTUGAL
  // ═══════════════════════════════════════════════
  {
    name: "Lisbon",
    city: "Lisbon",
    slug: "lisbon",
    state: "",
    country: "Portugal",
    region: "Europe",
    description: "Europe's fastest-growing startup hub with affordable costs attracting remote agencies and tech companies from around the world.",
    population: "550K",
    latitude: 38.7223,
    longitude: -9.1393,
    metaTitle: "SEO & Content Platform for Lisbon Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Lisbon, Portugal.",
    attractions: [
      { name: "Web Summit HQ", type: "landmark", description: "Home of Web Summit, Europe's largest tech conference" },
    ],
    neighborhoods: ["Baixa", "Bairro Alto", "Santos", "Príncipe Real", "Alfama"],
  },

  // ═══════════════════════════════════════════════
  // AUSTRIA
  // ═══════════════════════════════════════════════
  {
    name: "Vienna",
    city: "Vienna",
    slug: "vienna",
    state: "",
    country: "Austria",
    region: "Europe",
    description: "Central European business hub serving as a gateway to Eastern European markets with a growing tech and agency scene.",
    population: "1.9M",
    latitude: 48.2082,
    longitude: 16.3738,
    metaTitle: "SEO & Content Platform for Vienna Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Vienna, Austria.",
    attractions: [
      { name: "Innere Stadt", type: "landmark", description: "City center business district" },
    ],
    neighborhoods: ["Innere Stadt", "Neubau", "Leopoldstadt", "Mariahilf"],
  },

  // ═══════════════════════════════════════════════
  // SCANDINAVIA
  // ═══════════════════════════════════════════════
  {
    name: "Stockholm",
    city: "Stockholm",
    slug: "stockholm",
    state: "",
    country: "Sweden",
    region: "Europe",
    description: "Scandinavia's startup capital, birthplace of Spotify and Klarna, with a thriving digital marketing and SaaS ecosystem.",
    population: "980K",
    latitude: 59.3293,
    longitude: 18.0686,
    metaTitle: "SEO & Content Platform for Stockholm Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Stockholm, Sweden.",
    attractions: [
      { name: "Södermalm", type: "neighborhood", description: "Creative and tech startup hub" },
    ],
    neighborhoods: ["Södermalm", "Norrmalm", "Kungsholmen", "Östermalm"],
  },
  {
    name: "Copenhagen",
    city: "Copenhagen",
    slug: "copenhagen",
    state: "",
    country: "Denmark",
    region: "Europe",
    description: "Denmark's capital with a strong design culture and growing fintech scene driving demand for specialized digital marketing.",
    population: "800K",
    latitude: 55.6761,
    longitude: 12.5683,
    metaTitle: "SEO & Content Platform for Copenhagen Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies in Copenhagen, Denmark.",
    attractions: [
      { name: "Vesterbro", type: "neighborhood", description: "Creative and startup neighborhood" },
    ],
    neighborhoods: ["Vesterbro", "Nørrebro", "Østerbro", "Islands Brygge"],
  },
  {
    name: "Oslo",
    city: "Oslo",
    slug: "oslo",
    state: "",
    country: "Norway",
    region: "Europe",
    description: "Norway's capital with high purchasing power and agencies serving energy, maritime, and tech sectors.",
    population: "700K",
    latitude: 59.9139,
    longitude: 10.7522,
    metaTitle: "SEO & Content Platform for Oslo Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Oslo, Norway.",
    attractions: [
      { name: "Grünerløkka", type: "neighborhood", description: "Creative and tech district" },
    ],
    neighborhoods: ["Grünerløkka", "Majorstua", "Aker Brygge", "Frogner"],
  },
  {
    name: "Helsinki",
    city: "Helsinki",
    slug: "helsinki",
    state: "",
    country: "Finland",
    region: "Europe",
    description: "Finland's capital and gateway to Nordic markets, known for gaming, tech innovation, and startup-friendly ecosystem.",
    population: "660K",
    latitude: 60.1699,
    longitude: 24.9384,
    metaTitle: "SEO & Content Platform for Helsinki Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies in Helsinki, Finland.",
    attractions: [
      { name: "Kallio", type: "neighborhood", description: "Helsinki's startup and creative hub" },
    ],
    neighborhoods: ["Kallio", "Kamppi", "Kruununhaka", "Punavuori"],
  },

  // ═══════════════════════════════════════════════
  // POLAND
  // ═══════════════════════════════════════════════
  {
    name: "Warsaw",
    city: "Warsaw",
    slug: "warsaw",
    state: "",
    country: "Poland",
    region: "Europe",
    description: "Poland's capital and Central Europe's fastest-growing tech hub with a massive pool of skilled developers and marketers.",
    population: "1.8M",
    latitude: 52.2297,
    longitude: 21.0122,
    metaTitle: "SEO & Content Platform for Warsaw Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content platform for agencies in Warsaw, Poland.",
    attractions: [
      { name: "Praga", type: "neighborhood", description: "Creative and tech district on the east bank" },
    ],
    neighborhoods: ["Praga", "Mokotów", "Wola", "Śródmieście", "Żoliborz"],
  },
  {
    name: "Krakow",
    city: "Krakow",
    slug: "krakow",
    state: "",
    country: "Poland",
    region: "Europe",
    description: "Poland's tech outsourcing capital with a strong university pipeline and growing number of digital agencies.",
    population: "780K",
    latitude: 50.0647,
    longitude: 19.9450,
    metaTitle: "SEO & Content Platform for Krakow Agencies | indexFlow",
    metaDescription: "SEO and content tools for agencies in Krakow, Poland.",
    attractions: [
      { name: "Zabłocie", type: "neighborhood", description: "Tech and creative startup district" },
    ],
    neighborhoods: ["Zabłocie", "Kazimierz", "Podgórze", "Old Town"],
  },

  // ═══════════════════════════════════════════════
  // CZECH REPUBLIC
  // ═══════════════════════════════════════════════
  {
    name: "Prague",
    city: "Prague",
    slug: "prague",
    state: "",
    country: "Czech Republic",
    region: "Europe",
    description: "Central European hub attracting international agencies with affordable talent, strong tech infrastructure, and EU market access.",
    population: "1.3M",
    latitude: 50.0755,
    longitude: 14.4378,
    metaTitle: "SEO & Content Platform for Prague Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content platform for agencies in Prague, Czech Republic.",
    attractions: [
      { name: "Karlín", type: "neighborhood", description: "Prague's modern tech and startup district" },
    ],
    neighborhoods: ["Karlín", "Vinohrady", "Holešovice", "Smíchov", "Old Town"],
  },

  // ═══════════════════════════════════════════════
  // SWITZERLAND
  // ═══════════════════════════════════════════════
  {
    name: "Zurich",
    city: "Zurich",
    slug: "zurich",
    state: "",
    country: "Switzerland",
    region: "Europe",
    description: "Switzerland's financial capital and Google's largest European engineering hub, with high-value agency clients in finance and pharma.",
    population: "430K",
    latitude: 47.3769,
    longitude: 8.5417,
    metaTitle: "SEO & Content Platform for Zurich Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content tools for agencies in Zurich, Switzerland.",
    attractions: [
      { name: "Europaallee", type: "landmark", description: "Modern business district near Google Zurich" },
    ],
    neighborhoods: ["Europaallee", "Langstrasse", "Zurich West", "Seefeld"],
  },

  // ═══════════════════════════════════════════════
  // GREECE
  // ═══════════════════════════════════════════════
  {
    name: "Athens",
    city: "Athens",
    slug: "athens",
    state: "",
    country: "Greece",
    region: "Europe",
    description: "Greece's capital with a growing startup scene and agencies serving tourism, shipping, and the broader Southeast European market.",
    population: "660K",
    latitude: 37.9838,
    longitude: 23.7275,
    metaTitle: "SEO & Content Platform for Athens Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies in Athens, Greece.",
    attractions: [
      { name: "Kolonaki", type: "neighborhood", description: "Business and creative district" },
    ],
    neighborhoods: ["Kolonaki", "Psyrri", "Monastiraki", "Exarchia", "Kifissia"],
  },

  // ═══════════════════════════════════════════════
  // ROMANIA
  // ═══════════════════════════════════════════════
  {
    name: "Bucharest",
    city: "Bucharest",
    slug: "bucharest",
    state: "",
    country: "Romania",
    region: "Europe",
    description: "Romania's capital and one of Eastern Europe's fastest-growing tech hubs with a skilled, affordable digital marketing workforce.",
    population: "1.8M",
    latitude: 44.4268,
    longitude: 26.1025,
    metaTitle: "SEO & Content Platform for Bucharest Agencies | indexFlow",
    metaDescription: "All-in-one SEO and content tools for agencies in Bucharest, Romania.",
    attractions: [
      { name: "Floreasca", type: "neighborhood", description: "Business district with tech and startup companies" },
    ],
    neighborhoods: ["Floreasca", "Aviatorilor", "Old Town", "Pipera", "Dorobanți"],
  },

  // ═══════════════════════════════════════════════
  // HUNGARY
  // ═══════════════════════════════════════════════
  {
    name: "Budapest",
    city: "Budapest",
    slug: "budapest",
    state: "",
    country: "Hungary",
    region: "Europe",
    description: "Central European tech hub popular with digital nomads and remote agencies, offering skilled talent at competitive rates.",
    population: "1.7M",
    latitude: 47.4979,
    longitude: 19.0402,
    metaTitle: "SEO & Content Platform for Budapest Agencies | indexFlow",
    metaDescription: "SEO and content platform for agencies in Budapest, Hungary.",
    attractions: [
      { name: "District VII", type: "neighborhood", description: "Creative and startup district" },
    ],
    neighborhoods: ["District VII", "District V", "District XIII", "Buda Hills"],
  },

  // ═══════════════════════════════════════════════
  // CROATIA
  // ═══════════════════════════════════════════════
  {
    name: "Zagreb",
    city: "Zagreb",
    slug: "zagreb",
    state: "",
    country: "Croatia",
    region: "Europe",
    description: "Croatia's capital and newest EU member state hub, with a growing tech scene and agencies serving Adriatic and Southeast European markets.",
    population: "810K",
    latitude: 45.8150,
    longitude: 15.9819,
    metaTitle: "SEO & Content Platform for Zagreb Agencies | indexFlow",
    metaDescription: "AI-powered SEO and content tools for agencies in Zagreb, Croatia.",
    attractions: [
      { name: "Lower Town", type: "neighborhood", description: "Business center with tech and creative firms" },
    ],
    neighborhoods: ["Lower Town", "Upper Town", "Maksimir", "Trnje"],
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
