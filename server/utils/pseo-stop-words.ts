import { STOP_WORDS_MAP, STOP_WORDS_EN } from "../config/pseo-stop-words-list";

export function getStopWords(languageCode: string): Set<string> {
  const code = languageCode.toLowerCase().split("-")[0];
  return STOP_WORDS_MAP[code] || STOP_WORDS_EN;
}

export function removeStopWordsForLanguage(text: string, languageCode: string): string {
  const stopWords = getStopWords(languageCode);
  return text
    .split(/\s+/)
    .filter((word) => !stopWords.has(word.toLowerCase()))
    .join(" ");
}
