export const TOURISM_DOMAINS: string[] = [
  "tripadvisor.com",
  "tripadvisor.co.uk",
  "tripadvisor.com.au",
  "tripadvisor.ie",
  "tripadvisor.ca",
  "tripadvisor.de",
  "tripadvisor.fr",
  "lonelyplanet.com",
  "visitbritain.com",
  "visitengland.com",
  "visitscotland.com",
  "visitwales.com",
  "discoverireland.ie",
  "ireland.com",
  "australia.com",
  "destinationcanada.com",
  "germany.travel",
  "france.fr",
  "nps.gov",
  "nationaltrust.org.uk",
  "heritageireland.ie",
  "viator.com",
  "getyourguide.com",
  "klook.com",
  "tiqets.com",
  "booking.com",
  "hotels.com",
  "expedia.com",
  "airbnb.com",
  "vrbo.com",
  "kayak.com",
  "skyscanner.com",
  "rome2rio.com",
  "timeout.com",
  "atlasobscura.com",
  "culture trip.com",
  "fodors.com",
  "frommers.com",
  "roughguides.com",
];

export const LOCAL_TOURISM_PATTERNS: RegExp[] = [
  /^visit[a-z]+\.com$/,
  /^visit[a-z]+\.org$/,
  /^discover[a-z]+\.com$/,
  /^explore[a-z]+\.com$/,
  /\.travel$/,
  /tourism\./,
  /^travel[a-z]*\.gov/,
];

export function isTourismDomain(domain: string): boolean {
  const normalized = domain.replace(/^www\./, "").toLowerCase();
  if (TOURISM_DOMAINS.some((d) => normalized === d || normalized.endsWith(`.${d}`))) {
    return true;
  }
  return LOCAL_TOURISM_PATTERNS.some((p) => p.test(normalized));
}
