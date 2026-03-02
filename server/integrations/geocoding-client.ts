export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  addressComponents: AddressComponent[];
}

export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

export async function geocode(address: string): Promise<GeocodingResult | null> {
  const apiKey = process.env.GEOCODING_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const encoded = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      addressComponents: (result.address_components || []).map((c: any) => ({
        longName: c.long_name,
        shortName: c.short_name,
        types: c.types,
      })),
    };
  } catch {
    return null;
  }
}

export function extractComponent(
  components: AddressComponent[],
  type: string
): string | null {
  const comp = components.find((c) => c.types.includes(type));
  return comp ? comp.longName : null;
}
