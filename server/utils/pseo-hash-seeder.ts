import { createHash } from "crypto";

export function hashSeed(locationId: string, serviceId: string): number {
  const hash = createHash("sha256")
    .update(locationId + serviceId)
    .digest("hex");
  return parseInt(hash.slice(0, 8), 16);
}

export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function seededSelect<T>(seed: number, array: T[]): T {
  if (array.length === 0) throw new Error("Cannot select from empty array");
  const index = seededSelectIndex(seed, array.length);
  return array[index];
}

export function seededSelectIndex(seed: number, arrayLength: number): number {
  if (arrayLength <= 0) throw new Error("Array length must be positive");
  const r = seededRandom(seed);
  return Math.floor(r * arrayLength) % arrayLength;
}
