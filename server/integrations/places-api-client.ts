import { PLACES_API_RATE_LIMIT_PER_SECOND } from "../config/pseo-indexing-rate-limits";

export interface NearbyLandmark {
  name: string;
  type: string;
  distance: number;
  url: string;
}

let lastCallTimestamps: number[] = [];

function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  lastCallTimestamps = lastCallTimestamps.filter((ts) => now - ts < 1000);

  if (lastCallTimestamps.length >= PLACES_API_RATE_LIMIT_PER_SECOND) {
    const waitMs = 1000 - (now - lastCallTimestamps[0]);
    return new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 0)));
  }

  return Promise.resolve();
}

export async function getNearbyLandmarks(
  lat: number,
  lng: number,
  category?: string
): Promise<NearbyLandmark[]> {
  const apiKey = process.env.PLACES_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    await enforceRateLimit();
    lastCallTimestamps.push(Date.now());

    const typeParam = category ? `&type=${encodeURIComponent(category)}` : "";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000${typeParam}&key=${apiKey}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.slice(0, 5).map((place: any) => {
      const placeLat = place.geometry?.location?.lat || 0;
      const placeLng = place.geometry?.location?.lng || 0;
      const dLat = (placeLat - lat) * 111320;
      const dLng = (placeLng - lng) * 111320 * Math.cos((lat * Math.PI) / 180);
      const distanceMeters = Math.sqrt(dLat * dLat + dLng * dLng);

      return {
        name: place.name || "",
        type: place.types?.[0] || "point_of_interest",
        distance: Math.round(distanceMeters),
        url: place.url || place.website || "",
      };
    });
  } catch {
    return [];
  }
}

export function resetRateLimitState(): void {
  lastCallTimestamps = [];
}
