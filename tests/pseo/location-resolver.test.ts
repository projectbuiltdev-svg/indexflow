import { describe, it, expect, vi } from "vitest";

import {
  resolveLocation,
  resolveRadius,
  resolveRegion,
  validateLocation,
  type LocationResult,
  type LocationResolverStorage,
  type GeocodingClient,
  type PlacesClient,
} from "../../server/pseo/location-resolver";

function makeMockStorage(overrides: Partial<LocationResolverStorage> = {}): LocationResolverStorage {
  return {
    getGeoReferencesWithinRadius: vi.fn().mockResolvedValue([]),
    getGeoReferencesByRegion: vi.fn().mockResolvedValue([]),
    getCampaignLocationCount: vi.fn().mockResolvedValue(0),
    getCampaignLocations: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

function makeMockGeocodingClient(result: any = null): GeocodingClient {
  return {
    geocode: vi.fn().mockResolvedValue(result),
  };
}

function makeMockPlacesClient(landmarks: any[] = []): PlacesClient {
  return {
    getNearbyLandmarks: vi.fn().mockResolvedValue(landmarks),
  };
}

const DUBLIN_GEOCODE = {
  lat: 53.3498,
  lng: -6.2603,
  formattedAddress: "Dublin, Ireland",
  addressComponents: [
    { longName: "Dublin", shortName: "Dublin", types: ["locality"] },
    { longName: "Dublin City", shortName: "Dublin City", types: ["administrative_area_level_2"] },
    { longName: "Leinster", shortName: "L", types: ["administrative_area_level_1"] },
    { longName: "Ireland", shortName: "IE", types: ["country"] },
  ],
};

const PARTIAL_GEOCODE = {
  lat: 53.0,
  lng: -6.0,
  formattedAddress: "Ireland",
  addressComponents: [
    { longName: "Ireland", shortName: "IE", types: ["country"] },
  ],
};

describe("location-resolver: resolveLocation", () => {
  it("resolves full location hierarchy", async () => {
    const storage = makeMockStorage();
    const geocoding = makeMockGeocodingClient(DUBLIN_GEOCODE);
    const places = makeMockPlacesClient([
      { name: "Trinity College", type: "university", distance: 500, url: "https://tcd.ie" },
    ]);

    const result = await resolveLocation("Dublin, Ireland", "ws-1", storage, geocoding, places, "plumber");

    expect(result.resolved).toBe(true);
    expect(result.partial).toBe(false);
    expect(result.lat).toBe(53.3498);
    expect(result.lng).toBe(-6.2603);
    expect(result.town).toBe("Dublin");
    expect(result.county).toBe("Dublin City");
    expect(result.state).toBe("Leinster");
    expect(result.country).toBe("Ireland");
    expect(result.countryCode).toBe("IE");
    expect(result.formattedAddress).toBe("Dublin, Ireland");
    expect(result.commercialIntentScore).toBeGreaterThan(0);
    expect(result.landmarks).toHaveLength(1);
    expect(result.landmarks[0].name).toBe("Trinity College");
    expect(result.imageSearchTerms.length).toBeGreaterThan(0);
  });

  it("returns unresolved when geocoding fails", async () => {
    const storage = makeMockStorage();
    const geocoding = makeMockGeocodingClient(null);
    const places = makeMockPlacesClient();

    const result = await resolveLocation("Nonexistent Place", "ws-1", storage, geocoding, places);

    expect(result.resolved).toBe(false);
    expect(result.lat).toBeNull();
    expect(result.lng).toBeNull();
  });

  it("flags partial resolution when town is missing", async () => {
    const storage = makeMockStorage();
    const geocoding = makeMockGeocodingClient(PARTIAL_GEOCODE);
    const places = makeMockPlacesClient();

    const result = await resolveLocation("Ireland", "ws-1", storage, geocoding, places);

    expect(result.resolved).toBe(true);
    expect(result.partial).toBe(true);
    expect(result.country).toBe("Ireland");
    expect(result.town).toBeNull();
  });

  it("finds neighbours from geo reference database", async () => {
    const storage = makeMockStorage({
      getGeoReferencesWithinRadius: vi.fn().mockResolvedValue([
        { id: "n1", name: "Dun Laoghaire", latitude: 53.2946, longitude: -6.1336 },
        { id: "n2", name: "Swords", latitude: 53.4597, longitude: -6.2181 },
      ]),
    });
    const geocoding = makeMockGeocodingClient(DUBLIN_GEOCODE);
    const places = makeMockPlacesClient();

    const result = await resolveLocation("Dublin", "ws-1", storage, geocoding, places);

    expect(result.neighbours.length).toBeGreaterThan(0);
    expect(result.neighbours[0]).toHaveProperty("id");
    expect(result.neighbours[0]).toHaveProperty("name");
    expect(result.neighbours[0]).toHaveProperty("distanceMiles");
  });

  it("places API failure does not block resolution", async () => {
    const storage = makeMockStorage();
    const geocoding = makeMockGeocodingClient(DUBLIN_GEOCODE);
    const places: PlacesClient = {
      getNearbyLandmarks: vi.fn().mockRejectedValue(new Error("API down")),
    };

    const result = await resolveLocation("Dublin", "ws-1", storage, geocoding, places);

    expect(result.resolved).toBe(true);
    expect(result.landmarks).toEqual([]);
    expect(result.town).toBe("Dublin");
  });
});

describe("location-resolver: resolveRadius", () => {
  it("returns locations within radius sorted by population", async () => {
    const storage = makeMockStorage({
      getGeoReferencesWithinRadius: vi.fn().mockResolvedValue([
        { id: "1", name: "Small Town", latitude: 53.35, longitude: -6.26, population: 5000 },
        { id: "2", name: "Big City", latitude: 53.36, longitude: -6.27, population: 500000 },
        { id: "3", name: "Medium Town", latitude: 53.34, longitude: -6.25, population: 50000 },
      ]),
    });

    const locations = await resolveRadius({ lat: 53.35, lng: -6.26 }, 25, storage);

    expect(locations.length).toBe(3);
    expect((locations[0] as any).population).toBe(500000);
    expect((locations[2] as any).population).toBe(5000);
  });

  it("enforces minimum radius of 5 miles", async () => {
    const storage = makeMockStorage();

    await resolveRadius({ lat: 53.35, lng: -6.26 }, 1, storage);

    expect(storage.getGeoReferencesWithinRadius).toHaveBeenCalledWith(53.35, -6.26, 5);
  });

  it("uses requested radius when above minimum", async () => {
    const storage = makeMockStorage();

    await resolveRadius({ lat: 53.35, lng: -6.26 }, 50, storage);

    expect(storage.getGeoReferencesWithinRadius).toHaveBeenCalledWith(53.35, -6.26, 50);
  });
});

describe("location-resolver: resolveRegion", () => {
  it("delegates to storage with country and zones", async () => {
    const mockLocations = [
      { id: "1", name: "Dublin", latitude: 53.35, longitude: -6.26 },
    ];
    const storage = makeMockStorage({
      getGeoReferencesByRegion: vi.fn().mockResolvedValue(mockLocations),
    });

    const result = await resolveRegion("IE", ["Leinster", "Munster"], storage);

    expect(storage.getGeoReferencesByRegion).toHaveBeenCalledWith("IE", ["Leinster", "Munster"]);
    expect(result).toEqual(mockLocations);
  });
});

describe("location-resolver: validateLocation", () => {
  function makeLocationResult(overrides: Partial<LocationResult> = {}): LocationResult {
    return {
      input: "Dublin",
      resolved: true,
      partial: false,
      lat: 53.3498,
      lng: -6.2603,
      formattedAddress: "Dublin, Ireland",
      town: "Dublin",
      county: "Dublin City",
      state: "Leinster",
      country: "Ireland",
      countryCode: "IE",
      population: 500000,
      commercialIntentScore: 75,
      neighbours: [],
      landmarks: [],
      imageSearchTerms: [],
      ...overrides,
    };
  }

  it("rejects when lat/lng cannot be resolved", async () => {
    const storage = makeMockStorage();
    const loc = makeLocationResult({ lat: null, lng: null });

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("latitude/longitude");
  });

  it("rejects duplicate within same campaign", async () => {
    const storage = makeMockStorage({
      getCampaignLocations: vi.fn().mockResolvedValue([
        { lat: 53.3498, lng: -6.2603, name: "Dublin" },
      ]),
    });
    const loc = makeLocationResult();

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Duplicate");
    expect(result.reason).toContain("Dublin");
  });

  it("allows locations that are far enough apart", async () => {
    const storage = makeMockStorage({
      getCampaignLocations: vi.fn().mockResolvedValue([
        { lat: 51.8985, lng: -8.4756, name: "Cork" },
      ]),
    });
    const loc = makeLocationResult();

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(true);
  });

  it("enforces MAX_LOCATIONS_PER_CAMPAIGN", async () => {
    const storage = makeMockStorage({
      getCampaignLocationCount: vi.fn().mockResolvedValue(2000),
    });
    const loc = makeLocationResult();

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("2000");
  });

  it("allows location when under the limit", async () => {
    const storage = makeMockStorage({
      getCampaignLocationCount: vi.fn().mockResolvedValue(1999),
    });
    const loc = makeLocationResult();

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(true);
  });

  it("flags partial resolution for confirmation", async () => {
    const storage = makeMockStorage();
    const loc = makeLocationResult({ partial: true });

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(true);
    expect(result.partial).toBe(true);
    expect(result.reason).toContain("Partial");
  });

  it("valid location with no issues returns clean result", async () => {
    const storage = makeMockStorage();
    const loc = makeLocationResult();

    const result = await validateLocation(loc, "campaign-1", storage);

    expect(result.valid).toBe(true);
    expect(result.partial).toBe(false);
    expect(result.reason).toBeUndefined();
  });
});
