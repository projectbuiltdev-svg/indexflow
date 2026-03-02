export const MAX_LOCATIONS_PER_CAMPAIGN = 2000;
export const MIN_RADIUS_MILES = 5;

export const TIER_CAMPAIGN_LIMITS: Record<string, number> = {
  solo: 1,
  pro: 25,
  agency: 50,
  enterprise: -1,
};

export interface GeoZone {
  name: string;
  states: string[];
}

export interface GeoMarket {
  country: string;
  code: string;
  zones: GeoZone[];
}

export const GEO_MARKETS: GeoMarket[] = [
  {
    country: "United States",
    code: "US",
    zones: [
      { name: "Northeast", states: ["Connecticut", "Delaware", "Maine", "Maryland", "Massachusetts", "New Hampshire", "New Jersey", "New York", "Pennsylvania", "Rhode Island", "Vermont"] },
      { name: "Southeast", states: ["Alabama", "Arkansas", "Florida", "Georgia", "Kentucky", "Louisiana", "Mississippi", "North Carolina", "South Carolina", "Tennessee", "Virginia", "West Virginia"] },
      { name: "Midwest", states: ["Illinois", "Indiana", "Iowa", "Kansas", "Michigan", "Minnesota", "Missouri", "Nebraska", "North Dakota", "Ohio", "South Dakota", "Wisconsin"] },
      { name: "Southwest", states: ["Arizona", "New Mexico", "Oklahoma", "Texas"] },
      { name: "West", states: ["Alaska", "California", "Colorado", "Hawaii", "Idaho", "Montana", "Nevada", "Oregon", "Utah", "Washington", "Wyoming"] },
      { name: "Capital", states: ["District of Columbia"] },
    ],
  },
  {
    country: "United Kingdom",
    code: "GB",
    zones: [
      { name: "England — South East", states: ["Berkshire", "Buckinghamshire", "East Sussex", "Hampshire", "Isle of Wight", "Kent", "Oxfordshire", "Surrey", "West Sussex"] },
      { name: "England — London", states: ["Greater London"] },
      { name: "England — South West", states: ["Bristol", "Cornwall", "Devon", "Dorset", "Gloucestershire", "Somerset", "Wiltshire"] },
      { name: "England — East", states: ["Bedfordshire", "Cambridgeshire", "Essex", "Hertfordshire", "Norfolk", "Suffolk"] },
      { name: "England — Midlands", states: ["Derbyshire", "Herefordshire", "Leicestershire", "Lincolnshire", "Northamptonshire", "Nottinghamshire", "Rutland", "Shropshire", "Staffordshire", "Warwickshire", "West Midlands", "Worcestershire"] },
      { name: "England — North West", states: ["Cheshire", "Cumbria", "Greater Manchester", "Lancashire", "Merseyside"] },
      { name: "England — North East", states: ["County Durham", "Northumberland", "Tyne and Wear"] },
      { name: "England — Yorkshire", states: ["East Riding of Yorkshire", "North Yorkshire", "South Yorkshire", "West Yorkshire"] },
      { name: "Scotland", states: ["Highlands", "Lowlands", "Central Belt", "North East Scotland", "South Scotland"] },
      { name: "Wales", states: ["North Wales", "Mid Wales", "South Wales", "West Wales"] },
      { name: "Northern Ireland", states: ["Antrim", "Armagh", "Down", "Fermanagh", "Londonderry", "Tyrone"] },
    ],
  },
  {
    country: "Ireland",
    code: "IE",
    zones: [
      { name: "Leinster", states: ["Carlow", "Dublin", "Kildare", "Kilkenny", "Laois", "Longford", "Louth", "Meath", "Offaly", "Westmeath", "Wexford", "Wicklow"] },
      { name: "Munster", states: ["Clare", "Cork", "Kerry", "Limerick", "Tipperary", "Waterford"] },
      { name: "Connacht", states: ["Galway", "Leitrim", "Mayo", "Roscommon", "Sligo"] },
      { name: "Ulster (ROI)", states: ["Cavan", "Donegal", "Monaghan"] },
    ],
  },
  {
    country: "Australia",
    code: "AU",
    zones: [
      { name: "New South Wales", states: ["New South Wales"] },
      { name: "Victoria", states: ["Victoria"] },
      { name: "Queensland", states: ["Queensland"] },
      { name: "Western Australia", states: ["Western Australia"] },
      { name: "South Australia", states: ["South Australia"] },
      { name: "Tasmania", states: ["Tasmania"] },
      { name: "Northern Territory", states: ["Northern Territory"] },
      { name: "Australian Capital Territory", states: ["Australian Capital Territory"] },
    ],
  },
  {
    country: "Canada",
    code: "CA",
    zones: [
      { name: "Atlantic", states: ["New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Prince Edward Island"] },
      { name: "Central", states: ["Ontario", "Quebec"] },
      { name: "Prairies", states: ["Alberta", "Manitoba", "Saskatchewan"] },
      { name: "West Coast", states: ["British Columbia"] },
      { name: "North", states: ["Northwest Territories", "Nunavut", "Yukon"] },
    ],
  },
  {
    country: "Germany",
    code: "DE",
    zones: [
      { name: "North", states: ["Bremen", "Hamburg", "Lower Saxony", "Mecklenburg-Vorpommern", "Schleswig-Holstein"] },
      { name: "East", states: ["Berlin", "Brandenburg", "Saxony", "Saxony-Anhalt", "Thuringia"] },
      { name: "West", states: ["Hesse", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland"] },
      { name: "South", states: ["Baden-Württemberg", "Bavaria"] },
    ],
  },
  {
    country: "France",
    code: "FR",
    zones: [
      { name: "Île-de-France", states: ["Paris", "Seine-et-Marne", "Yvelines", "Essonne", "Hauts-de-Seine", "Seine-Saint-Denis", "Val-de-Marne", "Val-d'Oise"] },
      { name: "Nord", states: ["Nord", "Pas-de-Calais", "Somme", "Aisne", "Oise"] },
      { name: "Grand Est", states: ["Bas-Rhin", "Haut-Rhin", "Moselle", "Meurthe-et-Moselle", "Meuse", "Vosges", "Ardennes", "Aube", "Marne", "Haute-Marne"] },
      { name: "Ouest", states: ["Finistère", "Côtes-d'Armor", "Morbihan", "Ille-et-Vilaine", "Loire-Atlantique", "Maine-et-Loire", "Mayenne", "Sarthe", "Vendée"] },
      { name: "Sud-Ouest", states: ["Gironde", "Landes", "Lot-et-Garonne", "Dordogne", "Pyrénées-Atlantiques", "Hautes-Pyrénées", "Gers", "Haute-Garonne", "Ariège", "Tarn", "Tarn-et-Garonne", "Lot", "Aveyron"] },
      { name: "Sud-Est", states: ["Bouches-du-Rhône", "Var", "Alpes-Maritimes", "Vaucluse", "Gard", "Hérault", "Aude", "Pyrénées-Orientales"] },
      { name: "Auvergne-Rhône-Alpes", states: ["Rhône", "Loire", "Ain", "Isère", "Drôme", "Ardèche", "Savoie", "Haute-Savoie", "Puy-de-Dôme", "Allier", "Cantal", "Haute-Loire"] },
      { name: "Centre", states: ["Loiret", "Eure-et-Loir", "Loir-et-Cher", "Indre", "Indre-et-Loire", "Cher"] },
    ],
  },
];

export function getMarketByCode(code: string): GeoMarket | undefined {
  return GEO_MARKETS.find((m) => m.code === code);
}

export function getZonesForCountry(countryCode: string): GeoZone[] {
  return getMarketByCode(countryCode)?.zones ?? [];
}

export function getZoneForState(countryCode: string, stateName: string): string | null {
  const market = getMarketByCode(countryCode);
  if (!market) return null;
  for (const zone of market.zones) {
    if (zone.states.includes(stateName)) return zone.name;
  }
  return null;
}
