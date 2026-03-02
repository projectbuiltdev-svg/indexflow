const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export interface LocationWithCoords {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

export interface NearbyResult {
  location: LocationWithCoords;
  distanceMiles: number;
}

export function findNearest(
  origin: { latitude: number; longitude: number },
  locations: LocationWithCoords[],
  maxDistanceMiles: number
): NearbyResult[] {
  const results: NearbyResult[] = [];

  for (const loc of locations) {
    const dist = haversineDistance(
      origin.latitude,
      origin.longitude,
      loc.latitude,
      loc.longitude
    );

    if (dist <= maxDistanceMiles) {
      results.push({ location: loc, distanceMiles: dist });
    }
  }

  results.sort((a, b) => a.distanceMiles - b.distanceMiles);
  return results;
}
