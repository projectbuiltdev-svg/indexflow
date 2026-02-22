import { Link } from "wouter";
import { ArrowRight, Phone, Wrench, Lightbulb, FileText, BarChart3, Grid3X3, ClipboardList, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";
import { DoubleTicker } from "@/components/double-ticker";

export default function About() {
  return (
    <Layout>
      <SEO {...seoData.about} />

      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-6" data-testid="text-label">IndexFlow Founder Statement</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8" data-testid="text-heading">
            Built from <span className="text-muted-foreground/50 italic">frustration.</span> Refined by <span className="text-muted-foreground/50 italic">necessity.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12" data-testid="text-intro">
            IndexFlow wasn't built to disrupt an industry — it was built to fix a real agency problem, by someone who was tired of waiting for a better tool to exist.
          </p>

          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://player.vimeo.com/video/1165788581?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="eager"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              title="indexFlow"
              data-testid="hero-video-founder"
            />
            <div className="absolute inset-0 flex items-end justify-center z-10 pointer-events-none pb-6 sm:pb-10">
              <div className="bg-black/15 sm:bg-black/35 backdrop-blur-[1px] sm:backdrop-blur-[3px] rounded-xl px-6 py-4 sm:px-8 sm:py-5 text-center shadow-[0_0_20px_rgba(234,179,8,0.18)]">
                <p className="text-white text-base sm:text-lg font-semibold tracking-tight leading-snug">
                  The revenue chain <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent font-extrabold">belongs to you.</span>
                </p>
                <p className="text-white/40 text-sm sm:text-base font-normal italic mt-1">
                  Not your Seo tools.
                </p>
                <div className="flex items-center justify-center gap-3 mt-3 text-white/50 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
                  <span>40+ SEO Tools</span>
                  <span className="text-amber-400/40">·</span>
                  <span>One Platform</span>
                  <span className="text-amber-400/40">·</span>
                  <span>Zero Middlemen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DoubleTicker cmsFirst />

      <section className="py-16 lg:py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 01 — Origin</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            Running an SEO agency means managing a growing, fragmented stack of expensive tools — content platforms, rank trackers, local grid scanners, reporting suites. Tools that each do one thing, billed separately, and never quite talk to each other.
          </p>
          <p className="text-lg text-foreground leading-relaxed mb-10">
            I got tired of it. So I built an in-house system to solve it.
          </p>

          <blockquote className="border-l-4 border-primary pl-6 py-2 mb-10">
            <p className="text-xl sm:text-2xl font-semibold italic text-foreground/80 leading-snug">
              "The best products are often accidental discoveries."
            </p>
          </blockquote>

          <p className="text-base text-muted-foreground leading-relaxed">
            IndexFlow wasn't created to disrupt an industry. It was built to remove the manual, time-consuming SEO workflows that agencies deal with every day — because I was dealing with them myself.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 02 — Insight</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            When you step back, you realise something: every SEO agency has the same problem.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            The same fragmented stack. The same repetitive production work. The same tools promising AI-powered results that don't deliver. The same Monday morning of copy-pasting data between dashboards that should never have been separate.
          </p>

          <p className="text-sm font-semibold text-foreground mb-4">Sound familiar?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {[
              { icon: FileText, label: "Content Platforms +++" },
              { icon: BarChart3, label: "Rank Tracker Costs $$" },
              { icon: Grid3X3, label: "Local Grid Search $$ cost" },
              { icon: ClipboardList, label: "Reporting Tools + $$ p/mo" },
              { icon: Sparkles, label: "Agency Overheads + $$" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl text-center shadow-[0_6px_24px_-6px_rgba(148,163,184,0.22)]">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 03 — Philosophy</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            Every feature inside IndexFlow exists for a reason. Every workflow solves a real production bottleneck — because I was the first IndexFlow customer.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            It was built to fix my agency's problems first. That's not a marketing line. That's just what happened when I got frustrated enough to build rather than wait.
          </p>

          <blockquote className="border-l-4 border-purple-500 pl-6 py-2">
            <p className="text-xl sm:text-2xl font-semibold italic text-foreground/80 leading-snug">
              "IndexFlow simply became the solution I wish existed years ago."
            </p>
          </blockquote>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 04 — For Who</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            If you're tired of the same fragmented SEO tool stack — or experimenting with AI tools that simply do not work — then you're exactly who IndexFlow was built for.
          </p>
          <p className="text-xl font-bold text-foreground mb-6">
            You don't need more tools. You need the right system.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            40+ tools. One platform. Built by an agency, for agencies.
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-[0_6px_24px_-6px_rgba(59,130,246,0.18)]">
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Built for solo founders and agency owners who are done feeding margin to platforms that take a cut of everything.
            </p>
            <p className="text-base text-foreground leading-relaxed mb-8 italic">
              I hope your teams get as much value from IndexFlow as we do in-house.
            </p>

            <div className="flex items-center gap-4 mb-8 pt-6 border-t border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-xl italic">
                d
              </div>
              <div>
                <p className="font-bold text-sm">dENVER</p>
                <p className="text-xs text-muted-foreground">Founder, IndexFlow</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pricing">
                <Button className="gap-2 w-full sm:w-auto" data-testid="button-trial">
                  30 Day Trial $1 <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-discovery-call">
                  <Phone className="w-4 h-4" /> Discovery Call
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No contracts · No setup fees · Cancel anytime</p>
          </div>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
