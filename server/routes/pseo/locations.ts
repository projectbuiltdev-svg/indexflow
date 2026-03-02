import { Router, Request, Response } from "express";
import {
  resolveLocation,
  resolveRadius,
  resolveRegion,
  type LocationResolverStorage,
} from "../../pseo/location-resolver";
import { GEO_MARKETS } from "../../config/pseo-geographic-divisions";

const router = Router();

const stubStorage: LocationResolverStorage = {
  async getGeoReferencesWithinRadius() {
    return [];
  },
  async getGeoReferencesByRegion() {
    return [];
  },
  async getCampaignLocationCount() {
    return 0;
  },
  async getCampaignLocations() {
    return [];
  },
};

router.get("/markets", (_req: Request, res: Response) => {
  res.json({
    markets: GEO_MARKETS.map((m) => ({
      country: m.country,
      code: m.code,
      zones: m.zones,
    })),
  });
});

router.post("/resolve-radius", async (req: Request, res: Response) => {
  try {
    const { address, radiusMiles, lat, lng } = req.body;

    if (!address && (lat == null || lng == null)) {
      return res.status(400).json({ error: "Provide address or lat/lng coordinates" });
    }

    let centreLat = lat;
    let centreLng = lng;
    let formattedAddress = address;

    if (centreLat == null || centreLng == null) {
      const resolved = await resolveLocation(address, "", stubStorage);
      if (!resolved.resolved || !resolved.lat || !resolved.lng) {
        return res.json({ error: "Could not resolve that address. Try a more specific location.", locations: [] });
      }
      centreLat = resolved.lat;
      centreLng = resolved.lng;
      formattedAddress = resolved.formattedAddress || address;
    }

    const locations = await resolveRadius(
      { lat: centreLat, lng: centreLng },
      radiusMiles || 25,
      stubStorage
    );

    return res.json({
      centre: { lat: centreLat, lng: centreLng, formattedAddress },
      locations,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Radius resolution failed" });
  }
});

router.post("/resolve-region", async (req: Request, res: Response) => {
  try {
    const { countryCode, zones } = req.body;

    if (!countryCode || !Array.isArray(zones) || zones.length === 0) {
      return res.status(400).json({ error: "Provide countryCode and at least one zone" });
    }

    const locations = await resolveRegion(countryCode, zones, stubStorage);

    return res.json({ locations });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Region resolution failed" });
  }
});

router.post("/resolve-manual", async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Provide an input string" });
    }

    const result = await resolveLocation(input, "", stubStorage);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Manual resolution failed" });
  }
});

export default router;
