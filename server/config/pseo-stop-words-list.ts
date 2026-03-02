export const STOP_WORDS_EN: Set<string> = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
  "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
  "during", "each", "few", "for", "from", "further", "get", "got", "had", "hadn't",
  "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's",
  "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how",
  "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
  "it", "it's", "its", "itself", "just", "let's", "me", "might", "more", "most",
  "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only",
  "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
  "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
  "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
  "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't",
  "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves",
]);

export const SLUG_STOP_WORDS: Set<string> = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "has",
  "he", "in", "is", "it", "its", "of", "on", "or", "she", "that", "the", "to",
  "was", "were", "will", "with",
]);

export const SEO_FILLER_PHRASES: Set<string> = new Set([
  "click here",
  "read more",
  "learn more",
  "find out more",
  "check it out",
  "see more",
  "visit us",
  "contact us today",
  "call now",
  "buy now",
  "order now",
  "sign up now",
  "get started",
  "don't miss out",
  "limited time offer",
  "act now",
  "best in class",
  "world class",
  "cutting edge",
  "state of the art",
  "second to none",
  "industry leading",
  "top rated",
  "number one",
  "#1",
]);

export function isStopWord(word: string): boolean {
  return STOP_WORDS_EN.has(word.toLowerCase());
}

export function isSlugStopWord(word: string): boolean {
  return SLUG_STOP_WORDS.has(word.toLowerCase());
}

export function containsFillerPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  for (const phrase of SEO_FILLER_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
}

export function removeStopWords(words: string[]): string[] {
  return words.filter((w) => !isStopWord(w));
}

export function removeSlugStopWords(words: string[]): string[] {
  return words.filter((w) => !isSlugStopWord(w));
}
