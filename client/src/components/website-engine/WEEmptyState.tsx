import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Globe, Key, AlertTriangle, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

const WE_UI_STRINGS: Record<string, { headline: string; subline: string; placeholder: string; buildingIn: string; noLanguage: string; selectLanguage: string; connectKey: string; startBuilding: string }> = {
  en: {
    headline: "Let's build your first website",
    subline: "Describe your business and we'll build it for you in minutes.",
    placeholder: "e.g. I run a plumbing business in Dublin. I need a professional website with a contact form and a list of my services...",
    buildingIn: "Building in",
    noLanguage: "No language selected — defaulting to English",
    selectLanguage: "Select Language",
    connectKey: "Connect your AI key before building",
    startBuilding: "Start Building",
  },
  es: {
    headline: "Construyamos tu primer sitio web",
    subline: "Describe tu negocio y lo construiremos para ti en minutos.",
    placeholder: "ej. Tengo un negocio de fontanería en Madrid. Necesito un sitio web profesional con formulario de contacto...",
    buildingIn: "Construyendo en",
    noLanguage: "No se seleccionó idioma — predeterminado en inglés",
    selectLanguage: "Seleccionar idioma",
    connectKey: "Conecta tu clave de IA antes de construir",
    startBuilding: "Empezar a construir",
  },
  fr: {
    headline: "Construisons votre premier site web",
    subline: "Décrivez votre entreprise et nous le construirons pour vous en quelques minutes.",
    placeholder: "ex. Je gère une entreprise de plomberie à Paris. J'ai besoin d'un site web professionnel avec un formulaire de contact...",
    buildingIn: "Construction en",
    noLanguage: "Aucune langue sélectionnée — anglais par défaut",
    selectLanguage: "Choisir la langue",
    connectKey: "Connectez votre clé IA avant de construire",
    startBuilding: "Commencer la construction",
  },
  de: {
    headline: "Erstellen wir Ihre erste Website",
    subline: "Beschreiben Sie Ihr Unternehmen und wir erstellen es für Sie in Minuten.",
    placeholder: "z.B. Ich betreibe ein Sanitärgeschäft in Berlin. Ich brauche eine professionelle Website mit Kontaktformular...",
    buildingIn: "Erstellen in",
    noLanguage: "Keine Sprache ausgewählt — Standard ist Englisch",
    selectLanguage: "Sprache wählen",
    connectKey: "Verbinden Sie Ihren KI-Schlüssel vor dem Erstellen",
    startBuilding: "Bau starten",
  },
};

const LANGUAGE_FLAGS: Record<string, string> = {
  en: "🇬🇧", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", pt: "🇵🇹", nl: "🇳🇱", ja: "🇯🇵", ko: "🇰🇷", zh: "🇨🇳", ar: "🇸🇦", hi: "🇮🇳", ru: "🇷🇺", pl: "🇵🇱", sv: "🇸🇪",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese", nl: "Dutch", ja: "Japanese", ko: "Korean", zh: "Chinese", ar: "Arabic", hi: "Hindi", ru: "Russian", pl: "Polish", sv: "Swedish",
};

const EXAMPLE_PROMPTS = [
  "A local restaurant in Edinburgh with an online menu and booking form",
  "A freelance graphic designer portfolio with a project gallery and contact page",
  "A SaaS product landing page with pricing table and free trial signup",
];

interface WEEmptyStateProps {
  venueId: string;
  projectLanguage: string;
  hasByokKey: boolean;
  onProjectCreated: (project: any) => void;
  onSelectLanguage?: () => void;
}

export default function WEEmptyState({ venueId, projectLanguage, hasByokKey, onProjectCreated, onSelectLanguage }: WEEmptyStateProps) {
  const [prompt, setPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const strings = WE_UI_STRINGS[projectLanguage] || WE_UI_STRINGS.en;

  useEffect(() => {
    textareaRef.current?.focus();
    const timer = setTimeout(() => setShowArrow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim() || !hasByokKey || isCreating) return;
    setIsCreating(true);
    try {
      const res = await apiRequest("POST", `/api/we/projects?venueId=${venueId}`, {
        name: prompt.trim().slice(0, 60),
        projectLanguage,
        intakeAnswers: { prompt: prompt.trim() },
      });
      const project = await res.json();

      await apiRequest("POST", `/api/we/build/${project.id}/start?venueId=${venueId}`, {});

      onProjectCreated(project);
    } catch (e) {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8" data-testid="we-empty-state">
      <div className="max-w-lg w-full space-y-6 text-center">
        <svg viewBox="0 0 200 140" className="w-48 h-32 mx-auto text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="20" width="160" height="100" rx="8" />
          <line x1="20" y1="44" x2="180" y2="44" />
          <circle cx="36" cy="32" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="50" cy="32" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="64" cy="32" r="4" fill="currentColor" opacity="0.3" />
          <rect x="40" y="58" width="120" height="8" rx="2" opacity="0.2" fill="currentColor" />
          <rect x="60" y="74" width="80" height="6" rx="2" opacity="0.15" fill="currentColor" />
          <rect x="70" y="90" width="60" height="20" rx="4" opacity="0.2" fill="currentColor" />
        </svg>

        <div>
          <h2 className="text-xl font-semibold" data-testid="text-empty-headline">{strings.headline}</h2>
          <p className="text-sm text-muted-foreground mt-1" data-testid="text-empty-subline">{strings.subline}</p>
        </div>

        {projectLanguage && projectLanguage !== "en" ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium dark:bg-green-900/30 dark:text-green-400" data-testid="badge-language">
            <Check className="w-3 h-3" />
            {strings.buildingIn} {LANGUAGE_FLAGS[projectLanguage] || ""} {LANGUAGE_NAMES[projectLanguage] || projectLanguage}
          </div>
        ) : projectLanguage === "en" ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium dark:bg-green-900/30 dark:text-green-400" data-testid="badge-language">
            <Check className="w-3 h-3" />
            {strings.buildingIn} {LANGUAGE_FLAGS.en} {LANGUAGE_NAMES.en}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-amber-50 border border-amber-200 text-amber-700 text-xs dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300" data-testid="banner-no-language">
            <AlertTriangle className="w-3 h-3" />
            {strings.noLanguage}
            {onSelectLanguage && (
              <button onClick={onSelectLanguage} className="underline font-medium" data-testid="btn-select-language">{strings.selectLanguage}</button>
            )}
          </div>
        )}

        {!hasByokKey && (
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-amber-50 border border-amber-200 text-amber-700 text-xs dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300" data-testid="banner-no-byok">
            <Key className="w-3 h-3" />
            {strings.connectKey}
            <Link href={`/${venueId}/connections/ai-providers`}>
              <button className="underline font-medium" data-testid="btn-connect-key">Connect API Key</button>
            </Link>
          </div>
        )}

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={strings.placeholder}
            className="min-h-[120px] text-sm resize-none"
            disabled={isCreating}
            data-testid="input-empty-prompt"
          />
          {showArrow && (
            <div className="absolute -left-8 top-6 text-muted-foreground/40 animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || !hasByokKey || isCreating}
          className="w-full"
          data-testid="btn-start-building"
        >
          {isCreating ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Building...</>
          ) : (
            <><Globe className="w-4 h-4 mr-2" /> {strings.startBuilding}</>
          )}
        </Button>

        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_PROMPTS.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className="px-3 py-1.5 rounded-full border text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              data-testid={`btn-example-${i}`}
            >
              {ex.length > 50 ? ex.slice(0, 50) + "…" : ex}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">Ctrl+Enter to submit</p>
      </div>
    </div>
  );
}
