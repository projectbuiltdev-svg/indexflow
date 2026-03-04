export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", rtl: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", rtl: false },
];

export const DEFAULT_LANGUAGE = "en";

export function isSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

export function getLanguage(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code);
}
