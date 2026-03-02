import { describe, it, expect } from "vitest";
import {
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
  combineSchemas,
  type SchemaContext,
  type FaqItem,
  type BreadcrumbItem,
} from "../../server/pseo/schema-generator";

const baseCtx: SchemaContext = {
  serviceName: "Emergency Plumber",
  serviceCategory: "plumbing",
  primaryKeyword: "emergency plumber dublin",
  locationName: "Dublin",
  locationState: "Leinster",
  locationCountry: "IE",
  lat: 53.3498,
  lng: -6.2603,
  canonicalUrl: "https://example.com/dublin/emergency-plumber",
  domainName: "example.com",
  metaDescription: "Find emergency plumber services in Dublin.",
  telephone: "+353 1 234 5678",
  openingHours: ["Monday-Friday 08:00-18:00"],
  priceRange: "$$",
  streetAddress: "123 Main St",
  postalCode: "D01 AB12",
};

describe("schema-generator: LocalBusiness", () => {
  it("has all required fields", () => {
    const schema = generateLocalBusinessSchema(baseCtx);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Plumber");
    expect(schema.name).toBe("Emergency Plumber in Dublin");
    expect(schema.description).toBe(baseCtx.metaDescription);
    expect(schema.url).toBe(baseCtx.canonicalUrl);
    expect(schema.address).toBeDefined();
    expect(schema.address["@type"]).toBe("PostalAddress");
    expect(schema.address.addressLocality).toBe("Dublin");
    expect(schema.address.addressRegion).toBe("Leinster");
    expect(schema.address.addressCountry).toBe("IE");
    expect(schema.geo).toBeDefined();
    expect(schema.geo["@type"]).toBe("GeoCoordinates");
    expect(schema.geo.latitude).toBe(53.3498);
    expect(schema.geo.longitude).toBe(-6.2603);
    expect(schema.areaServed).toBeDefined();
    expect(schema.areaServed.name).toBe("Dublin");
  });

  it("uses correct schema type for known categories", () => {
    const dentist = generateLocalBusinessSchema({ ...baseCtx, serviceCategory: "dental care" });
    expect(dentist["@type"]).toBe("Dentist");

    const lawyer = generateLocalBusinessSchema({ ...baseCtx, serviceCategory: "legal services" });
    expect(lawyer["@type"]).toBe("LegalService");

    const hvac = generateLocalBusinessSchema({ ...baseCtx, serviceCategory: "hvac repair" });
    expect(hvac["@type"]).toBe("HVACBusiness");
  });

  it("defaults to LocalBusiness for unknown categories", () => {
    const schema = generateLocalBusinessSchema({ ...baseCtx, serviceCategory: "custom widgets" });
    expect(schema["@type"]).toBe("LocalBusiness");
  });

  it("defaults to LocalBusiness when no category", () => {
    const schema = generateLocalBusinessSchema({ ...baseCtx, serviceCategory: undefined });
    expect(schema["@type"]).toBe("LocalBusiness");
  });

  it("includes optional telephone", () => {
    const schema = generateLocalBusinessSchema(baseCtx);
    expect(schema.telephone).toBe("+353 1 234 5678");
  });

  it("includes optional openingHours", () => {
    const schema = generateLocalBusinessSchema(baseCtx);
    expect(schema.openingHoursSpecification).toBeDefined();
    expect(schema.openingHoursSpecification).toHaveLength(1);
  });

  it("includes optional priceRange", () => {
    const schema = generateLocalBusinessSchema(baseCtx);
    expect(schema.priceRange).toBe("$$");
  });

  it("includes street address and postal code", () => {
    const schema = generateLocalBusinessSchema(baseCtx);
    expect(schema.address.streetAddress).toBe("123 Main St");
    expect(schema.address.postalCode).toBe("D01 AB12");
  });

  it("omits optional fields when null", () => {
    const schema = generateLocalBusinessSchema({
      ...baseCtx,
      telephone: null,
      openingHours: null,
      priceRange: null,
      streetAddress: null,
      postalCode: null,
      locationState: null,
    });
    expect(schema.telephone).toBeUndefined();
    expect(schema.openingHoursSpecification).toBeUndefined();
    expect(schema.priceRange).toBeUndefined();
    expect(schema.address.streetAddress).toBeUndefined();
    expect(schema.address.postalCode).toBeUndefined();
    expect(schema.address.addressRegion).toBeUndefined();
  });
});

describe("schema-generator: Service schema", () => {
  it("has correct structure with nested provider", () => {
    const schema = generateServiceSchema(baseCtx);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Service");
    expect(schema.name).toBe("emergency plumber dublin");
    expect(schema.serviceType).toBe("plumbing");
    expect(schema.provider).toBeDefined();
    expect(schema.provider["@type"]).toBe("Plumber");
    expect(schema.provider.name).toBe("Emergency Plumber in Dublin");
    expect(schema.provider.address.addressLocality).toBe("Dublin");
  });

  it("uses service name as serviceType when no category", () => {
    const schema = generateServiceSchema({ ...baseCtx, serviceCategory: undefined });
    expect(schema.serviceType).toBe("Emergency Plumber");
  });

  it("includes area served with state", () => {
    const schema = generateServiceSchema(baseCtx);
    expect(schema.areaServed.name).toBe("Dublin, Leinster");
  });

  it("area served without state uses location only", () => {
    const schema = generateServiceSchema({ ...baseCtx, locationState: null });
    expect(schema.areaServed.name).toBe("Dublin");
  });
});

describe("schema-generator: FAQ schema", () => {
  const faqs: FaqItem[] = [
    { question: "How much does a plumber cost?", answer: "Prices vary from €50 to €200." },
    { question: "Do you offer emergency services?", answer: "Yes, 24/7 emergency service." },
  ];

  it("has FAQPage type with mainEntity array", () => {
    const schema = generateFaqSchema(faqs);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toBeDefined();
    expect(Array.isArray(schema.mainEntity)).toBe(true);
    expect(schema.mainEntity).toHaveLength(2);
  });

  it("each item has Question type with acceptedAnswer", () => {
    const schema = generateFaqSchema(faqs);
    const first = schema.mainEntity[0];
    expect(first["@type"]).toBe("Question");
    expect(first.name).toBe("How much does a plumber cost?");
    expect(first.acceptedAnswer["@type"]).toBe("Answer");
    expect(first.acceptedAnswer.text).toBe("Prices vary from €50 to €200.");
  });

  it("handles empty FAQ array", () => {
    const schema = generateFaqSchema([]);
    expect(schema.mainEntity).toHaveLength(0);
  });
});

describe("schema-generator: Breadcrumb schema", () => {
  const crumbs: BreadcrumbItem[] = [
    { name: "Home", url: "https://example.com" },
    { name: "Plumbing", url: "https://example.com/plumbing" },
    { name: "Dublin", url: "https://example.com/plumbing/dublin" },
  ];

  it("has BreadcrumbList type with itemListElement", () => {
    const schema = generateBreadcrumbSchema(crumbs);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);
  });

  it("positions are 1-indexed and sequential", () => {
    const schema = generateBreadcrumbSchema(crumbs);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
    expect(schema.itemListElement[2].position).toBe(3);
  });

  it("each item has correct ListItem type", () => {
    const schema = generateBreadcrumbSchema(crumbs);
    for (const item of schema.itemListElement) {
      expect(item["@type"]).toBe("ListItem");
      expect(item.name).toBeDefined();
      expect(item.item).toBeDefined();
    }
  });
});

describe("schema-generator: combineSchemas", () => {
  it("wraps single schema in script tag", () => {
    const schema = { "@type": "LocalBusiness", name: "Test" };
    const result = combineSchemas([schema]);
    expect(result).toContain('<script type="application/ld+json">');
    expect(result).toContain('"@type":"LocalBusiness"');
  });

  it("wraps multiple schemas as array", () => {
    const schemas = [
      { "@type": "LocalBusiness", name: "Test" },
      { "@type": "Service", name: "Plumbing" },
    ];
    const result = combineSchemas(schemas);
    expect(result).toContain('<script type="application/ld+json">');
    const parsed = JSON.parse(result.replace(/<[^>]+>/g, ""));
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
  });

  it("returns empty string for empty array", () => {
    expect(combineSchemas([])).toBe("");
  });
});
