import { ReactNode, useEffect, useRef } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { Breadcrumbs } from "./breadcrumbs";

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
      <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
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
      <main className="flex-1 pt-14 lg:pt-24">
        <Breadcrumbs />
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
