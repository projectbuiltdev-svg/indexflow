import path from "path";
import fs from "fs";

export interface OptimisedImage {
  original: string;
  optimised: string;
  srcset: string[];
  savings: number;
}

export function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export function minifyJs(js: string): string {
  return js
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, "$1")
    .trim();
}

export async function optimiseImage(filePath: string): Promise<OptimisedImage> {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  const widths = [400, 800, 1200, 1600];
  const srcset: string[] = [];

  for (const w of widths) {
    const variant = path.join(dir, `${base}-${w}w.webp`);
    srcset.push(variant);
  }

  const optimised = path.join(dir, `${base}.webp`);

  return {
    original: filePath,
    optimised,
    srcset,
    savings: 0,
  };
}

export function inlineCriticalCss(html: string, css: string): string {
  const rules = css.split("}").filter(Boolean).slice(0, 20);
  const critical = rules.join("}") + "}";

  const styleTag = `<style>${minifyCss(critical)}</style>`;
  const deferredLink = `<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">`;
  const noscript = `<noscript><link rel="stylesheet" href="styles.css"></noscript>`;

  if (html.includes("</head>")) {
    return html.replace("</head>", `${styleTag}\n${deferredLink}\n${noscript}\n</head>`);
  }
  return `${styleTag}\n${deferredLink}\n${noscript}\n${html}`;
}

export function generateSrcsets(html: string): string {
  let imgIndex = 0;
  return html.replace(/<img([^>]*)>/g, (match, attrs) => {
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (!srcMatch) return match;

    const src = srcMatch[1];
    const ext = path.extname(src);
    const base = src.replace(ext, "");

    const srcset = [400, 800, 1200, 1600].map((w) => `${base}-${w}w.webp ${w}w`).join(", ");
    const sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
    const loading = imgIndex === 0 ? 'loading="eager"' : 'loading="lazy"';

    imgIndex++;

    if (attrs.includes("srcset")) return match;
    return `<img${attrs} srcset="${srcset}" sizes="${sizes}" ${loading}>`;
  });
}

export async function bundleFonts(html: string, projectId: string, venueId: string): Promise<string> {
  const fontRegex = /https:\/\/fonts\.googleapis\.com\/css2[^"'\s)]+/g;
  const matches = html.match(fontRegex);
  if (!matches) return html;

  let result = html;
  const preloads: string[] = [];

  for (const fontUrl of matches) {
    const fontName = fontUrl.match(/family=([^&:]+)/)?.[1] || "font";
    const localPath = `/uploads/we-assets/${venueId}/${projectId}/fonts/${fontName.toLowerCase().replace(/\+/g, "-")}.woff2`;

    result = result.replace(fontUrl, localPath);
    preloads.push(`<link rel="preload" href="${localPath}" as="font" type="font/woff2" crossorigin>`);
  }

  if (result.includes("</head>")) {
    result = result.replace("</head>", `${preloads.join("\n")}\n</head>`);
  }

  return result;
}
