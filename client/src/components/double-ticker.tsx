import { SiWordpress, SiShopify, SiSquarespace, SiWebflow, SiGhost, SiReplit } from "react-icons/si";
import wixLogo from "@assets/image_1771707999263.png";

const row1Items = [
  "Content Engine | Deploy to LLM | CMS instantly",
  "Pages | Posts | Listicles",
  "Link Builder | Internal | External",
  "Post Validator | On-Page Auditor | Site Profiler",
  "Schema Markup Generator",
  "Rank Tracker | Local Search Grid | GSC Ingestion Layer",
  "Competitor Keyword Spy",
  "SERP Preview Tool",
  "Keyword Gap Analysis",
];

const row2Items = [
  "CRM | Pipeline | Lead to Booking",
  "AI Website Widget",
  "Twilio Voice SMS",
  "BYOK AI Connections",
  "Image Bank (ai)",
  "White Label Branding",
  "Client Reports",
  "Invoice engine powered by Stripe/Paypal",
  "Multi-Location Analytics",
];

function TextTicker() {
  return (
    <div className="border-t border-b border-border bg-accent/20 py-3 overflow-hidden">
      <div className="flex flex-col gap-3">
        <div className="ticker-row-1 flex whitespace-nowrap will-change-transform">
          {[...row1Items, ...row1Items, ...row1Items, ...row1Items].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] inline-flex items-center flex-shrink-0 mx-7">
              <span className="text-red-500 text-[9px] mr-2.5">●</span>
              {item}
            </span>
          ))}
        </div>
        <div className="ticker-row-2 flex whitespace-nowrap will-change-transform">
          {[...row2Items, ...row2Items, ...row2Items, ...row2Items].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] inline-flex items-center flex-shrink-0 mx-7">
              <span className="text-blue-500 text-[9px] mr-2.5">●</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TickerDivider() {
  return <div className="max-w-5xl mx-auto h-px bg-border/50 my-2" />;
}

function CmsTicker() {
  return (
    <div className="text-center py-8">
      <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-2">Publish</p>
      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-6">
        Instantly to <em className="text-muted-foreground/50 italic">any LLM or CMS.</em>
      </h3>
      <div className="overflow-hidden">
        <div className="ticker-cms flex whitespace-nowrap will-change-transform">
          {[...Array(6)].flatMap((_, setIndex) => [
            <span key={`wp-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiWordpress className="w-8 h-8 opacity-40 grayscale" /></span>,
            <span key={`sh-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiShopify className="w-8 h-8 opacity-40 grayscale" /></span>,
            <span key={`sq-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiSquarespace className="w-8 h-8 opacity-40 grayscale" /></span>,
            <span key={`wix-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><img src={wixLogo} alt="Wix" className="w-8 h-8 opacity-40 grayscale object-contain" /></span>,
            <span key={`wf-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiWebflow className="w-8 h-8 opacity-40 grayscale" /></span>,
            <span key={`gh-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiGhost className="w-8 h-8 opacity-40 grayscale" /></span>,
            <span key={`rp-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><SiReplit className="w-8 h-8 opacity-40 grayscale" /></span>,
            <span key={`lv-${setIndex}`} className="inline-flex items-center justify-center flex-shrink-0 mx-6"><svg className="w-8 h-8 opacity-40 grayscale" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></span>,
          ])}
        </div>
      </div>
    </div>
  );
}

export function DoubleTicker({ cmsFirst = false }: { cmsFirst?: boolean }) {
  return (
    <>
      {cmsFirst ? (
        <>
          <CmsTicker />
          <TickerDivider />
          <TextTicker />
        </>
      ) : (
        <>
          <TextTicker />
          <TickerDivider />
          <CmsTicker />
        </>
      )}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        @keyframes marqueeReverse {
          0% { transform: translate3d(-25%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes marqueeCms {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-16.667%, 0, 0); }
        }
        .ticker-row-1 { animation: marquee 40s linear infinite; }
        .ticker-row-2 { animation: marqueeReverse 40s linear infinite; }
        .ticker-cms { animation: marqueeCms 20s linear infinite; }
        @media (max-width: 640px) {
          .ticker-row-1 { animation-duration: 12s; }
          .ticker-row-2 { animation-duration: 12s; }
          .ticker-cms { animation-duration: 8s; }
        }
      `}</style>
    </>
  );
}
