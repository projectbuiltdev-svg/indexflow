export const colorShadows = [
  "shadow-[0_6px_24px_-6px_rgba(234,179,8,0.18)]",
  "shadow-[0_6px_24px_-6px_rgba(59,130,246,0.18)]",
  "shadow-[0_6px_24px_-6px_rgba(244,63,94,0.16)]",
  "shadow-[0_6px_24px_-6px_rgba(148,163,184,0.22)]",
];

export function getColorShadow(index: number): string {
  return colorShadows[index % colorShadows.length];
}
