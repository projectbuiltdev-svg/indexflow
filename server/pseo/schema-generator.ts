export interface SchemaContext {
  serviceName: string;
  serviceCategory?: string;
  primaryKeyword: string;
  locationName: string;
  locationState: string | null;
  locationCountry: string;
  lat: number;
  lng: number;
  canonicalUrl: string;
  domainName: string;
  metaDescription: string;
  telephone?: string | null;
  openingHours?: string[] | null;
  priceRange?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const CATEGORY_TYPE_MAP: Record<string, string> = {
  plumber: "Plumber",
  plumbing: "Plumber",
  electrician: "Electrician",
  dentist: "Dentist",
  dental: "Dentist",
  lawyer: "LegalService",
  legal: "LegalService",
  attorney: "Attorney",
  doctor: "Physician",
  physician: "Physician",
  locksmith: "Locksmith",
  roofing: "RoofingContractor",
  roofer: "RoofingContractor",
  hvac: "HVACBusiness",
  moving: "MovingCompany",
  painter: "HousePainter",
  cleaning: "CleaningBusiness",
  auto: "AutoRepair",
  mechanic: "AutoRepair",
  restaurant: "Restaurant",
  salon: "BeautySalon",
  spa: "DaySpa",
  gym: "ExerciseGym",
  hotel: "Hotel",
  veterinary: "VeterinaryCare",
  vet: "VeterinaryCare",
  accounting: "AccountingService",
  insurance: "InsuranceAgency",
  realtor: "RealEstateAgent",
  "real estate": "RealEstateAgent",
};

function resolveSchemaType(category?: string): string {
  if (!category) return "LocalBusiness";
  const lower = category.toLowerCase();
  for (const [key, type] of Object.entries(CATEGORY_TYPE_MAP)) {
    if (lower.includes(key)) return type;
  }
  return "LocalBusiness";
}

export function generateLocalBusinessSchema(ctx: SchemaContext): Record<string, any> {
  const schemaType = resolveSchemaType(ctx.serviceCategory);

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: `${ctx.serviceName} in ${ctx.locationName}`,
    description: ctx.metaDescription,
    url: ctx.canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: ctx.locationName,
      addressCountry: ctx.locationCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ctx.lat,
      longitude: ctx.lng,
    },
    areaServed: {
      "@type": "City",
      name: ctx.locationName,
    },
  };

  if (ctx.locationState) {
    schema.address.addressRegion = ctx.locationState;
  }
  if (ctx.streetAddress) {
    schema.address.streetAddress = ctx.streetAddress;
  }
  if (ctx.postalCode) {
    schema.address.postalCode = ctx.postalCode;
  }
  if (ctx.telephone) {
    schema.telephone = ctx.telephone;
  }
  if (ctx.openingHours && ctx.openingHours.length > 0) {
    schema.openingHoursSpecification = ctx.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h,
    }));
  }
  if (ctx.priceRange) {
    schema.priceRange = ctx.priceRange;
  }

  return schema;
}

export function generateServiceSchema(ctx: SchemaContext): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: ctx.primaryKeyword,
    serviceType: ctx.serviceCategory || ctx.serviceName,
    provider: {
      "@type": resolveSchemaType(ctx.serviceCategory),
      name: `${ctx.serviceName} in ${ctx.locationName}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: ctx.locationName,
        addressRegion: ctx.locationState || undefined,
        addressCountry: ctx.locationCountry,
      },
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: ctx.locationState
        ? `${ctx.locationName}, ${ctx.locationState}`
        : ctx.locationName,
    },
  };
}

export function generateFaqSchema(faqs: FaqItem[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function combineSchemas(schemas: Record<string, any>[]): string {
  if (schemas.length === 0) return "";
  const payload = schemas.length === 1 ? schemas[0] : schemas;
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}
