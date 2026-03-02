export type SchemaOrgType =
  | "LocalBusiness"
  | "Service"
  | "Product"
  | "FAQPage"
  | "BreadcrumbList"
  | "WebPage"
  | "Organization"
  | "GeoCoordinates"
  | "AggregateRating"
  | "Review";

export interface SchemaOrgBase {
  "@context": "https://schema.org";
  "@type": SchemaOrgType | SchemaOrgType[];
}

export interface LocalBusinessSchema extends SchemaOrgBase {
  "@type": "LocalBusiness";
  name: string;
  description: string;
  url: string;
  address: SchemaAddress;
  geo: SchemaGeo;
  telephone?: string;
  openingHours?: string[];
  image?: string[];
  aggregateRating?: SchemaAggregateRating;
}

export interface ServiceSchema extends SchemaOrgBase {
  "@type": "Service";
  name: string;
  description: string;
  provider: { "@type": "Organization" | "LocalBusiness"; name: string };
  areaServed: SchemaAreaServed;
  serviceType?: string;
  url: string;
}

export interface FAQSchema extends SchemaOrgBase {
  "@type": "FAQPage";
  mainEntity: SchemaFAQItem[];
}

export interface SchemaFAQItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface BreadcrumbSchema extends SchemaOrgBase {
  "@type": "BreadcrumbList";
  itemListElement: SchemaBreadcrumbItem[];
}

export interface SchemaBreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface SchemaAddress {
  "@type": "PostalAddress";
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
}

export interface SchemaGeo {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

export interface SchemaAreaServed {
  "@type": "City" | "State" | "Country";
  name: string;
}

export interface SchemaAggregateRating {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
}

export interface SchemaGenerationInput {
  pageType: "location" | "service" | "location-service";
  locationName: string | null;
  locationState: string | null;
  locationCountry: string;
  latitude: number | null;
  longitude: number | null;
  serviceName: string | null;
  serviceCategory: string | null;
  businessName: string;
  pageUrl: string;
  breadcrumbs: Array<{ name: string; url: string }>;
}

export interface SchemaGenerationOutput {
  schemas: SchemaOrgBase[];
  jsonLd: string;
}
