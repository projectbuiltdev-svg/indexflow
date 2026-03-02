import { storage } from "../storage";

const IMAGE_BANK_RATE_LIMIT_PER_SECOND = 5;
let lastCallTimestamps: number[] = [];

export interface ImageResult {
  url: string;
  thumbnailUrl: string;
  alt: string;
  source: string;
  photographer?: string;
  width: number;
  height: number;
}

export async function searchImages(
  query: string,
  workspaceId: string,
  limit: number = 5
): Promise<ImageResult[]> {
  const providers = await storage.getAiProviderSettings(workspaceId);

  const unsplash = providers.find((p) => p.provider === "unsplash" && p.isEnabled && p.apiKey);
  const pexels = providers.find((p) => p.provider === "pexels" && p.isEnabled && p.apiKey);
  const pixabay = providers.find((p) => p.provider === "pixabay" && p.isEnabled && p.apiKey);

  let results: ImageResult[] = [];

  if (unsplash?.apiKey) {
    await enforceRateLimit();
    const imgs = await searchUnsplash(unsplash.apiKey, query, limit);
    results.push(...imgs);
  }

  if (results.length < limit && pexels?.apiKey) {
    await enforceRateLimit();
    const imgs = await searchPexels(pexels.apiKey, query, limit - results.length);
    results.push(...imgs);
  }

  if (results.length < limit && pixabay?.apiKey) {
    await enforceRateLimit();
    const imgs = await searchPixabay(pixabay.apiKey, query, limit - results.length);
    results.push(...imgs);
  }

  if (results.length === 0) {
    const genericQuery = query.split(",")[0]?.trim() || query;
    if (genericQuery !== query) {
      return searchImages(genericQuery, workspaceId, limit);
    }
  }

  return results.slice(0, limit);
}

async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  lastCallTimestamps = lastCallTimestamps.filter((t) => now - t < 1000);
  if (lastCallTimestamps.length >= IMAGE_BANK_RATE_LIMIT_PER_SECOND) {
    const oldest = lastCallTimestamps[0];
    const waitMs = 1000 - (now - oldest);
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  lastCallTimestamps.push(Date.now());
}

async function searchUnsplash(apiKey: string, query: string, perPage: number): Promise<ImageResult[]> {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${apiKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((img: any) => ({
      url: img.urls?.regular || img.urls?.full,
      thumbnailUrl: img.urls?.thumb || img.urls?.small,
      alt: img.alt_description || img.description || query,
      source: "unsplash",
      photographer: img.user?.name,
      width: img.width,
      height: img.height,
    }));
  } catch {
    return [];
  }
}

async function searchPexels(apiKey: string, query: string, perPage: number): Promise<ImageResult[]> {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos || []).map((img: any) => ({
      url: img.src?.large || img.src?.original,
      thumbnailUrl: img.src?.small || img.src?.tiny,
      alt: img.alt || query,
      source: "pexels",
      photographer: img.photographer,
      width: img.width,
      height: img.height,
    }));
  } catch {
    return [];
  }
}

async function searchPixabay(apiKey: string, query: string, perPage: number): Promise<ImageResult[]> {
  try {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}&image_type=photo&orientation=horizontal`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.hits || []).map((img: any) => ({
      url: img.largeImageURL || img.webformatURL,
      thumbnailUrl: img.previewURL || img.webformatURL,
      alt: img.tags || query,
      source: "pixabay",
      photographer: img.user,
      width: img.imageWidth || img.webformatWidth,
      height: img.imageHeight || img.webformatHeight,
    }));
  } catch {
    return [];
  }
}
