export const GOVERNMENT_TLDS: string[] = [
  ".gov",
  ".gov.uk",
  ".gov.au",
  ".gov.ca",
  ".gov.ie",
  ".gov.nz",
  ".gov.in",
  ".gov.za",
  ".gov.sg",
  ".bundesregierung.de",
  ".gouv.fr",
  ".gobierno.es",
  ".governo.it",
  ".mil",
  ".mil.uk",
];

export const GOVERNMENT_DOMAINS: string[] = [
  "usa.gov",
  "data.gov",
  "census.gov",
  "bls.gov",
  "sba.gov",
  "irs.gov",
  "nhs.uk",
  "service.gov.uk",
  "gov.uk",
  "canada.ca",
  "australia.gov.au",
  "citizensinformation.ie",
  "revenue.ie",
  "service-public.fr",
  "bundesregierung.de",
];

export function isGovernmentUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (GOVERNMENT_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
      return true;
    }
    return GOVERNMENT_TLDS.some((tld) => hostname.endsWith(tld));
  } catch {
    return false;
  }
}
