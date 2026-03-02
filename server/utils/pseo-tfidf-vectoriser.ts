import { getStopWords } from "./pseo-stop-words";

export function tokenise(text: string, languageCode: string = "en"): string[] {
  const stopWords = getStopWords(languageCode);
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !stopWords.has(t));
}

export function termFrequency(tokens: string[]): Record<string, number> {
  if (tokens.length === 0) return {};

  const counts: Record<string, number> = {};
  for (const token of tokens) {
    counts[token] = (counts[token] || 0) + 1;
  }

  const total = tokens.length;
  const tf: Record<string, number> = {};
  for (const [term, count] of Object.entries(counts)) {
    tf[term] = count / total;
  }

  return tf;
}

export function buildTfIdfVector(text: string, languageCode: string = "en"): Record<string, number> {
  const tokens = tokenise(text, languageCode);
  return termFrequency(tokens);
}
