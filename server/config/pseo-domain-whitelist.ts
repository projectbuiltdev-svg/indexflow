export const AUTHORITY_DOMAINS: string[] = [
  "wikipedia.org",
  "bbb.org",
  "yelp.com",
  "trustpilot.com",
  "glassdoor.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "youtube.com",
  "maps.google.com",
  "apple.com/maps",
  "tripadvisor.com",
  "foursquare.com",
  "healthgrades.com",
  "zocdoc.com",
  "avvo.com",
  "lawyers.com",
  "findlaw.com",
  "homeadvisor.com",
  "angi.com",
  "thumbtack.com",
  "houzz.com",
  "realtor.com",
  "zillow.com",
  "cars.com",
  "autotrader.com",
  "nerdwallet.com",
  "bankrate.com",
];

export const CITATION_DIRECTORIES: string[] = [
  "yelp.com",
  "bbb.org",
  "yellowpages.com",
  "superpages.com",
  "manta.com",
  "citysearch.com",
  "local.com",
  "hotfrog.com",
  "brownbook.net",
  "spoke.com",
  "merchantcircle.com",
  "chamberofcommerce.com",
  "angieslist.com",
  "kudzu.com",
  "dexknows.com",
  "mapquest.com",
  "foursquare.com",
  "facebook.com",
  "apple.com/maps",
  "bingplaces.com",
];

export const BLOCKED_LINK_DOMAINS: string[] = [
  "example.com",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "test.com",
  "placeholder.com",
];

export function isAuthorityDomain(domain: string): boolean {
  const normalized = domain.replace(/^www\./, "").toLowerCase();
  return AUTHORITY_DOMAINS.some((d) => normalized === d || normalized.endsWith(`.${d}`));
}

export function isCitationDirectory(domain: string): boolean {
  const normalized = domain.replace(/^www\./, "").toLowerCase();
  return CITATION_DIRECTORIES.some((d) => normalized === d || normalized.endsWith(`.${d}`));
}

export function isBlockedDomain(domain: string): boolean {
  const normalized = domain.replace(/^www\./, "").toLowerCase();
  return BLOCKED_LINK_DOMAINS.some((d) => normalized === d || normalized.endsWith(`.${d}`));
}
