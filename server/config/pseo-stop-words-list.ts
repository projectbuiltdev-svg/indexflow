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

export const STOP_WORDS_GA: Set<string> = new Set([
  "a", "ag", "agus", "an", "aon", "ar", "ár", "as", "ba", "bhí",
  "bhur", "cá", "cad", "cathain", "cé", "céard", "cén", "chomh", "chun", "chuig",
  "conas", "de", "den", "do", "don", "dá", "é", "faoi", "go", "gur",
  "i", "iad", "idir", "in", "ina", "ins", "is", "le", "leis", "lena",
  "mar", "mo", "mé", "muid", "ná", "nach", "nár", "ní", "níl", "níor",
  "nó", "nuair", "ó", "os", "sa", "san", "sé", "seo", "sí", "sin",
  "siad", "sinn", "sna", "tá", "tar", "thú", "trí", "tú", "uile",
]);

export const STOP_WORDS_FR: Set<string> = new Set([
  "a", "ai", "au", "aux", "aussi", "autre", "avant", "avec", "avait", "bien",
  "c", "car", "ce", "cela", "ces", "cet", "cette", "ci", "comme", "comment",
  "d", "dans", "de", "des", "du", "donc", "dont", "elle", "elles", "en",
  "est", "et", "eu", "fait", "il", "ils", "j", "je", "juste", "l",
  "la", "le", "les", "leur", "leurs", "lui", "là", "ma", "mais", "me",
  "mes", "même", "mon", "n", "ne", "ni", "nos", "notre", "nous", "on",
  "ont", "ou", "où", "par", "pas", "plus", "pour", "qu", "que", "quel",
  "quelle", "qui", "quoi", "s", "sa", "sans", "se", "ses", "si", "son",
  "sont", "sur", "ta", "te", "tes", "ton", "tous", "tout", "toute", "tu",
  "un", "une", "vos", "votre", "vous", "y",
]);

export const STOP_WORDS_DE: Set<string> = new Set([
  "ab", "aber", "als", "also", "am", "an", "auch", "auf", "aus", "bei",
  "bin", "bis", "bist", "da", "damit", "dann", "dar", "das", "dass", "dein",
  "deine", "deinem", "deinen", "deiner", "dem", "den", "denn", "der", "des", "die",
  "dies", "diese", "diesem", "diesen", "dieser", "doch", "du", "durch", "ein", "eine",
  "einem", "einen", "einer", "er", "es", "etwas", "euch", "euer", "eure", "für",
  "hat", "hatte", "hier", "ich", "ihm", "ihn", "ihnen", "ihr", "ihre", "ihrem",
  "ihren", "ihrer", "im", "in", "ist", "ja", "jede", "jedem", "jeden", "jeder",
  "jetzt", "kann", "kein", "keine", "keinem", "keinen", "keiner", "man", "mein", "meine",
  "meinem", "meinen", "meiner", "mir", "mit", "nach", "nicht", "noch", "nun", "nur",
  "ob", "oder", "ohne", "sehr", "sein", "seine", "seinem", "seinen", "seiner", "sich",
  "sie", "sind", "so", "soll", "über", "um", "und", "uns", "unser", "unter",
  "vom", "von", "vor", "war", "warum", "was", "weil", "wenn", "wer", "wie",
  "wir", "wird", "wo", "zu", "zum", "zur",
]);

export const STOP_WORDS_CY: Set<string> = new Set([
  "a", "ac", "am", "ar", "at", "beth", "bod", "chi", "cyn", "dan",
  "dau", "ddi", "ddo", "ddim", "dim", "dros", "dw", "dwy", "dy", "e",
  "ef", "ei", "ein", "eich", "er", "ers", "eu", "fy", "fe", "fo",
  "fod", "gan", "gyda", "heb", "hefyd", "hi", "hon", "hyn", "i", "iddo",
  "iddi", "mae", "mewn", "mi", "mo", "na", "nac", "nad", "nag", "neu",
  "nhw", "ni", "nid", "o", "oedd", "oes", "oherwydd", "os", "pa", "pan",
  "pam", "pob", "rhag", "rhai", "rhyw", "rwy", "sydd", "sy", "trwy",
  "un", "wedi", "wrth", "y", "ydy", "yma", "yn", "yr",
]);

export const STOP_WORDS_MAP: Record<string, Set<string>> = {
  en: STOP_WORDS_EN,
  ga: STOP_WORDS_GA,
  fr: STOP_WORDS_FR,
  de: STOP_WORDS_DE,
  cy: STOP_WORDS_CY,
};

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
