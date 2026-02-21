import { ReactNode, useEffect, useRef, useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { Download, X } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.webp";

function MobileInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const dismissed = sessionStorage.getItem("indexflow_install_dismissed");
    if (dismissed) return;

    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua);
    const standalone = (window.navigator as any).standalone === true || window.matchMedia("(display-mode: standalone)").matches;

    if (standalone) return;

    if (ios) {
      setIsIOS(true);
      setShowBanner(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("indexflow_install_dismissed", "1");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] sm:hidden animate-in slide-in-from-bottom duration-300">
      <div className="mx-3 mb-3 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-lg">
        <button onClick={handleDismiss} className="absolute top-3 right-3 text-muted-foreground" data-testid="install-dismiss">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <img src={indexFlowLogo} alt="indexFlow" className="w-10 h-10 rounded-xl" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">indexFlow</p>
            <p className="text-xs text-muted-foreground">Add to your home screen</p>
          </div>
          {isIOS ? (
            <div className="text-xs text-muted-foreground text-right leading-tight max-w-[140px]">
              Tap <span className="inline-block align-middle">
                <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7-7 7 7"/><rect x="4" y="18" width="16" height="2" rx="1"/></svg>
              </span> then "Add to Home Screen"
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl"
              data-testid="install-button"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 hidden sm:block"
      style={{ left: -100, top: -100 }}
    >
      <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full custom-cursor-page" data-testid="marketing-layout">
      <CustomCursor />
      <style>{`
        @media (min-width: 640px) {
          .custom-cursor-page, .custom-cursor-page * { cursor: none !important; }
        }
      `}</style>
      <Header />
      <main className="flex-1 pt-14 lg:pt-16">
        {children}
      </main>
      <Footer />
      <MobileInstallBanner />
    </div>
  );
}

export default Layout;
