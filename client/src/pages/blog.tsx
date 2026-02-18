import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";

export type BlogCategory =
  | "Booking Systems"
  | "AI & Automation"
  | "Voice & SMS"
  | "Website & Design"
  | "Payments & Deposits"
  | "Comparisons"
  | "Pricing & Cost"
  | "Industry Guides"
  | "Local Guides"
  | "Operations & Management";

export const blogCategories: { label: BlogCategory; slug: string; description: string }[] = [
  { label: "Booking Systems", slug: "booking-systems", description: "Reservation platforms, booking software, and system reviews for all businesses." },
  { label: "AI & Automation", slug: "ai-automation", description: "How AI and automation are transforming restaurant, cafe, bar, and hotel bookings." },
  { label: "Voice & SMS", slug: "voice-sms", description: "Voice booking, SMS confirmations, reminders, and communication automation." },
  { label: "Website & Design", slug: "website-design", description: "Restaurant website design, builders, templates, and online presence tips." },
  { label: "Payments & Deposits", slug: "payments-deposits", description: "Prepaid reservations, deposit systems, and payment integration for your business." },
  { label: "Comparisons", slug: "comparisons", description: "Side-by-side comparisons, alternatives, and reviews of booking platforms." },
  { label: "Pricing & Cost", slug: "pricing-cost", description: "Cost breakdowns, pricing guides, and ROI analysis for booking solutions." },
  { label: "Industry Guides", slug: "industry-guides", description: "In-depth guides for restaurants, cafes, bars, hotels, and multi-location businesses." },
  { label: "Local Guides", slug: "local-guides", description: "City-specific booking and business technology guides." },
  { label: "Operations & Management", slug: "operations-management", description: "Booking management, table management, and operational efficiency." },
];

const SLUG_TO_LABEL: Record<string, BlogCategory> = {};
blogCategories.forEach(c => { SLUG_TO_LABEL[c.slug] = c.label; });

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: BlogCategory;
  categorySlug: string;
  featured: boolean;
}

type BlogStyle = "editorial" | "magazine" | "minimal" | "classic" | "grid" | "brutalist";

interface ApiPostsResponse {
  blogTemplate: string;
  accentColor: string | null;
  accentForeground: string | null;
  posts: Array<{
    slug: string;
    title: string;
    description: string | null;
    category: string;
    tags: string[] | null;
    publishedAt: string | null;
  }>;
}

function apiPostToBlogPost(p: ApiPostsResponse["posts"][number], idx: number): BlogPost {
  const catSlug = p.category || "general";
  const catLabel = SLUG_TO_LABEL[catSlug] || ("General" as BlogCategory);
  const pubDate = p.publishedAt ? new Date(p.publishedAt) : new Date();
  const wordEstimate = (p.description || "").length > 100 ? 2000 : 1200;
  const readMin = Math.max(3, Math.round(wordEstimate / 250));
  return {
    id: p.slug + "-" + idx,
    slug: p.slug,
    title: p.title,
    excerpt: p.description || `Read our latest insights on ${catLabel.toLowerCase()} for your business.`,
    author: "indexFlow Editorial",
    date: pubDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    readTime: `${readMin} min read`,
    category: catLabel,
    categorySlug: catSlug,
    featured: idx < 3,
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Voice & SMS": "text-rose-600 dark:text-rose-400",
  "Comparisons": "text-violet-600 dark:text-violet-400",
  "Pricing & Cost": "text-amber-600 dark:text-amber-400",
  "Website & Design": "text-sky-600 dark:text-sky-400",
  "Industry Guides": "text-emerald-600 dark:text-emerald-400",
  "Booking Systems": "text-indigo-600 dark:text-indigo-400",
  "Local Guides": "text-teal-600 dark:text-teal-400",
  "AI & Automation": "text-fuchsia-600 dark:text-fuchsia-400",
  "Payments & Deposits": "text-orange-600 dark:text-orange-400",
  "Operations & Management": "text-cyan-600 dark:text-cyan-400",
};

function CategoryLabel({ category, className = "" }: { category: string; className?: string }) {
  const color = CATEGORY_COLORS[category] || "text-primary";
  return (
    <span className={`text-xs font-semibold uppercase tracking-widest ${color} ${className}`} data-testid={`text-category-${category}`}>
      {category}
    </span>
  );
}

function PostMeta({ author, date, readTime, subtle = false }: { author: string; date: string; readTime: string; subtle?: boolean }) {
  const base = subtle ? "text-xs text-muted-foreground/70" : "text-sm text-muted-foreground";
  return (
    <div className={`flex items-center gap-1.5 ${base} flex-wrap`}>
      <span>{author}</span>
      <span className="text-muted-foreground/40">|</span>
      <span>{date}</span>
      <span className="text-muted-foreground/40">|</span>
      <span>{readTime}</span>
    </div>
  );
}

function postHref(post: BlogPost): string {
  return `/blog/${post.categorySlug}/${post.slug}`;
}


function EditorialStyle({ posts, activeCategory }: { posts: BlogPost[]; activeCategory: string }) {
  const featured = posts.filter(p => p.featured);
  const hero = featured[0];
  const sidePosts = featured.slice(1, 3);
  const rest = posts.filter(p => p !== hero && !sidePosts.includes(p));

  return (
    <div className="bg-stone-50/50 dark:bg-transparent min-h-[60vh]">
      <section className="border-b border-stone-200 dark:border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-2">
            <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-testid="text-blog-heading">
              The indexFlow Journal
            </h1>
          </div>
        </div>
      </section>

      {hero && activeCategory === "All" && (
        <section className="border-b border-stone-200 dark:border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-start">
              <Link href={postHref(hero)} className="block group" data-testid="link-hero-post">
                <CategoryLabel category={hero.category} className="mb-4 block" />
                <h2 className="text-3xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight mb-5 group-hover:text-primary transition-colors" data-testid="text-hero-title">
                  {hero.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-5 max-w-2xl">
                  {hero.excerpt}
                </p>
                <PostMeta author={hero.author} date={hero.date} readTime={hero.readTime} />
              </Link>
              {sidePosts.length > 0 && (
                <div className="space-y-0 divide-y divide-stone-200 dark:divide-border border-l border-stone-200 dark:border-border pl-8 hidden lg:block">
                  {sidePosts.map((post) => (
                    <Link key={post.id} href={postHref(post)} className="block py-6 first:pt-0 last:pb-0 group" data-testid={`link-side-post-${post.id}`}>
                      <CategoryLabel category={post.category} className="mb-2 block" />
                      <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <PostMeta author={post.author} date={post.date} readTime={post.readTime} subtle />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory !== "All" && (
            <div className="mb-10 pb-6 border-b border-stone-200 dark:border-border">
              <h2 className="text-2xl font-bold tracking-tight">{activeCategory}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {blogCategories.find(c => c.label === activeCategory)?.description}
              </p>
            </div>
          )}
          <div className="space-y-0 divide-y divide-stone-200 dark:divide-border">
            {rest.map((post) => (
              <Link key={post.id} href={postHref(post)} className="block py-7 first:pt-0 group" data-testid={`link-post-${post.id}`}>
                <div className="max-w-3xl">
                  <CategoryLabel category={post.category} className="mb-2.5 block" />
                  <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <PostMeta author={post.author} date={post.date} readTime={post.readTime} subtle />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


function MagazineStyle({ posts, activeCategory }: { posts: BlogPost[]; activeCategory: string }) {
  const featured = posts.filter(p => p.featured);
  const hero = featured[0];
  const rest = posts.filter(p => p !== hero);

  return (
    <div className="min-h-[60vh]">
      <section className="bg-zinc-900 dark:bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold tracking-tight" data-testid="text-blog-heading">indexFlow / Insights</h1>
          <span className="text-xs opacity-50 uppercase tracking-widest">Hospitality Intelligence</span>
        </div>
      </section>

      {hero && activeCategory === "All" && (
        <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900 text-white pb-12 lg:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={postHref(hero)} className="block group max-w-3xl" data-testid="link-hero-post">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-4 block">Featured</span>
              <h2 className="text-3xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-5 group-hover:opacity-80 transition-opacity" data-testid="text-hero-title">
                {hero.title}
              </h2>
              <p className="text-lg opacity-60 leading-relaxed mb-5">{hero.excerpt}</p>
              <div className="flex items-center gap-1.5 text-sm opacity-40">
                <span>{hero.author}</span><span>|</span><span>{hero.date}</span><span>|</span><span>{hero.readTime}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-10 lg:py-14 bg-zinc-50 dark:bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory !== "All" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold tracking-tight">{activeCategory}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{blogCategories.find(c => c.label === activeCategory)?.description}</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-0">
            {rest.map((post, i) => (
              <Link
                key={post.id}
                href={postHref(post)}
                className={`block py-7 group border-b border-zinc-200 dark:border-border ${i % 2 === 0 ? "md:border-r md:border-r-zinc-200 dark:md:border-r-border md:pr-12" : "md:pl-0"}`}
                data-testid={`link-post-${post.id}`}
              >
                <CategoryLabel category={post.category} className="mb-2.5 block" />
                <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                <PostMeta author={post.author} date={post.date} readTime={post.readTime} subtle />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


function MinimalStyle({ posts, activeCategory }: { posts: BlogPost[]; activeCategory: string }) {
  const featured = posts.filter(p => p.featured);
  const hero = featured[0];
  const rest = posts.filter(p => p !== hero);

  return (
    <div className="bg-white dark:bg-transparent min-h-[60vh]">
      <section className="py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-3" data-testid="text-blog-heading">Writing</h1>
          <p className="text-muted-foreground text-sm">Ideas and analysis on booking systems and SEO</p>
        </div>
      </section>

      {hero && activeCategory === "All" && (
        <section className="pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <Link href={postHref(hero)} className="block border-t-2 border-foreground dark:border-foreground/50 pt-8 group" data-testid="link-hero-post">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">{hero.category}</span>
              <h2 className="text-2xl lg:text-3xl font-semibold leading-snug mt-2 mb-3 group-hover:text-primary transition-colors" data-testid="text-hero-title">
                {hero.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{hero.excerpt}</p>
              <div className="text-xs text-muted-foreground/60">{hero.author} -- {hero.date}</div>
            </Link>
          </div>
        </section>
      )}

      <section className="pb-16 lg:pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {activeCategory !== "All" && (
            <div className="mb-8 border-t-2 border-foreground dark:border-foreground/50 pt-6">
              <h2 className="text-xl font-semibold">{activeCategory}</h2>
              <p className="text-muted-foreground text-sm mt-1">{blogCategories.find(c => c.label === activeCategory)?.description}</p>
            </div>
          )}
          <div className="space-y-0">
            {rest.map((post) => (
              <Link key={post.id} href={postHref(post)} className="block py-6 border-t border-border group" data-testid={`link-post-${post.id}`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">{post.category}</span>
                    <h3 className="text-base font-semibold leading-snug mt-1 mb-1.5 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  </div>
                  <div className="text-xs text-muted-foreground/50 whitespace-nowrap pt-5 hidden sm:block">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


function ClassicStyle({ posts, activeCategory }: { posts: BlogPost[]; activeCategory: string }) {
  const featured = posts.filter(p => p.featured);
  const hero = featured[0];
  const rest = posts.filter(p => p !== hero);

  return (
    <div className="bg-amber-50/30 dark:bg-transparent min-h-[60vh]">
      <section className="border-b border-amber-200/60 dark:border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <h1 className="text-2xl font-serif font-bold tracking-tight italic" data-testid="text-blog-heading">The indexFlow Review</h1>
          <div className="w-20 h-px bg-amber-800/20 dark:bg-foreground/30 mx-auto mt-3" />
        </div>
      </section>

      {hero && activeCategory === "All" && (
        <section className="border-b-2 border-double border-amber-200/50 dark:border-foreground/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <Link href={postHref(hero)} className="block group" data-testid="link-hero-post">
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-serif italic text-muted-foreground">{hero.category}</span>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mt-2 mb-4 group-hover:text-primary transition-colors" data-testid="text-hero-title">
                  {hero.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4 font-serif">{hero.excerpt}</p>
                <div className="text-xs text-muted-foreground/60 font-serif italic">By {hero.author} -- {hero.date} -- {hero.readTime}</div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-10 lg:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory !== "All" && (
            <div className="mb-10 pb-6 border-b-2 border-double border-foreground/20 text-center">
              <h2 className="text-xl font-serif font-bold italic">{activeCategory}</h2>
              <p className="text-muted-foreground text-sm font-serif mt-1">{blogCategories.find(c => c.label === activeCategory)?.description}</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-0">
            {rest.map((post, i) => (
              <Link
                key={post.id}
                href={postHref(post)}
                className={`block p-6 group border-b border-amber-200/40 dark:border-border ${i % 2 === 0 ? "md:border-r md:border-r-amber-200/40 dark:md:border-r-border" : ""}`}
                data-testid={`link-post-${post.id}`}
              >
                <span className="text-xs font-serif italic text-muted-foreground/70">{post.category}</span>
                <h3 className="text-lg font-serif font-bold leading-snug mt-1 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground font-serif leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="text-xs text-muted-foreground/50 font-serif italic">{post.author} -- {post.date}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


function GridStyle({ posts, activeCategory }: { posts: BlogPost[]; activeCategory: string }) {
  const featured = posts.filter(p => p.featured);
  const hero = featured[0];
  const rest = posts.filter(p => p !== hero);

  return (
    <div className="bg-slate-50/60 dark:bg-transparent min-h-[60vh]">
      <section className="py-8 lg:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1" data-testid="text-blog-heading">indexFlow Blog</h1>
          <p className="text-2xl lg:text-3xl font-bold tracking-tight">Latest from our team</p>
        </div>
      </section>

      {hero && activeCategory === "All" && (
        <section className="pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={postHref(hero)} className="block group" data-testid="link-hero-post">
              <div className="rounded-md bg-white dark:bg-card border border-slate-200 dark:border-border p-8 lg:p-12">
                <CategoryLabel category={hero.category} className="mb-3 block" />
                <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors" data-testid="text-hero-title">
                  {hero.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mb-4">{hero.excerpt}</p>
                <PostMeta author={hero.author} date={hero.date} readTime={hero.readTime} subtle />
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="pb-12 lg:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory !== "All" && (
            <div className="mb-8">
              <h2 className="text-xl font-bold tracking-tight">{activeCategory}</h2>
              <p className="text-muted-foreground text-sm mt-1">{blogCategories.find(c => c.label === activeCategory)?.description}</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={postHref(post)}
                className="block rounded-md bg-white dark:bg-card border border-slate-200 dark:border-border p-6 group hover-elevate"
                data-testid={`link-post-${post.id}`}
              >
                <CategoryLabel category={post.category} className="mb-2 block" />
                <h3 className="font-bold leading-snug mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                <PostMeta author={post.author} date={post.date} readTime={post.readTime} subtle />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


function BrutalistStyle({ posts, activeCategory }: { posts: BlogPost[]; activeCategory: string }) {
  const featured = posts.filter(p => p.featured);
  const hero = featured[0];
  const rest = posts.filter(p => p !== hero);

  return (
    <div className="bg-yellow-50/40 dark:bg-zinc-950 min-h-[60vh]">
      <section className="border-b-4 border-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none" data-testid="text-blog-heading">RESTO//BLOG</h1>
        </div>
      </section>

      {hero && activeCategory === "All" && (
        <section className="border-b-4 border-foreground bg-foreground text-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <Link href={postHref(hero)} className="block group" data-testid="link-hero-post">
              <span className="text-xs font-mono uppercase tracking-widest opacity-50">[{hero.category}]</span>
              <h2 className="text-3xl lg:text-5xl font-black uppercase leading-none mt-3 mb-4 group-hover:opacity-80 transition-opacity" data-testid="text-hero-title">
                {hero.title}
              </h2>
              <p className="text-lg opacity-60 leading-relaxed max-w-3xl mb-4">{hero.excerpt}</p>
              <div className="text-xs font-mono opacity-40 uppercase">{hero.author} / {hero.date} / {hero.readTime}</div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory !== "All" && (
            <div className="mb-8 border-b-4 border-foreground pb-4">
              <h2 className="text-2xl font-black uppercase">{activeCategory}</h2>
              <p className="text-muted-foreground text-sm mt-1 font-mono">{blogCategories.find(c => c.label === activeCategory)?.description}</p>
            </div>
          )}
          <div className="space-y-0">
            {rest.map((post, i) => (
              <Link
                key={post.id}
                href={postHref(post)}
                className="block py-6 group border-b-2 border-foreground/20"
                data-testid={`link-post-${post.id}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-black text-foreground/10 leading-none pt-1 hidden sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">[{post.category}]</span>
                    <h3 className="text-lg font-black uppercase leading-snug mt-1 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{post.excerpt}</p>
                    <div className="text-xs font-mono text-muted-foreground/50 uppercase">{post.author} / {post.date}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


function CategoryFilter({ activeCategory, onChange }: { activeCategory: string; onChange: (cat: string) => void }) {
  return (
    <section className="border-b border-border sticky top-16 lg:top-[6.25rem] z-[1000] bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          <button
            onClick={() => onChange("All")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCategory === "All" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="blog-category-all"
          >
            All
          </button>
          {blogCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onChange(cat.label)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeCategory === cat.label ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`blog-category-${cat.slug}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}


function StyleSwitcher({ style, onChange }: { style: BlogStyle; onChange: (s: BlogStyle) => void }) {
  const styles: { value: BlogStyle; label: string }[] = [
    { value: "editorial", label: "Editorial" },
    { value: "magazine", label: "Magazine" },
    { value: "minimal", label: "Minimal" },
    { value: "classic", label: "Classic" },
    { value: "grid", label: "Grid" },
    { value: "brutalist", label: "Brutalist" },
  ];
  return (
    <div className="flex items-center gap-1 bg-muted rounded-md p-0.5 flex-wrap" data-testid="style-switcher">
      {styles.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            style === s.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid={`button-style-${s.value}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}


export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogStyle, setBlogStyle] = useState<BlogStyle>("editorial");

  const { data, isLoading } = useQuery<ApiPostsResponse>({
    queryKey: ["/api/public/blog/posts?domain=indexflow.io"],
  });

  useEffect(() => {
    document.title = "Blog | indexFlow - Hospitality Booking Insights";
  }, []);

  useEffect(() => {
    if (data?.blogTemplate) {
      const t = data.blogTemplate as BlogStyle;
      if (["editorial", "magazine", "minimal", "classic", "grid", "brutalist"].includes(t)) {
        setBlogStyle(t);
      }
    }
  }, [data?.blogTemplate]);

  const posts: BlogPost[] = (data?.posts || []).map((p, i) => apiPostToBlogPost(p, i));

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(post => post.category === activeCategory);

  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-4">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-home">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Blog</span>
        </nav>
        <StyleSwitcher style={blogStyle} onChange={setBlogStyle} />
      </div>

      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">No posts found{activeCategory !== "All" ? ` in ${activeCategory}` : ""}.</p>
        </div>
      ) : (
        <>
          {blogStyle === "editorial" && <EditorialStyle posts={filteredPosts} activeCategory={activeCategory} />}
          {blogStyle === "magazine" && <MagazineStyle posts={filteredPosts} activeCategory={activeCategory} />}
          {blogStyle === "minimal" && <MinimalStyle posts={filteredPosts} activeCategory={activeCategory} />}
          {blogStyle === "classic" && <ClassicStyle posts={filteredPosts} activeCategory={activeCategory} />}
          {blogStyle === "grid" && <GridStyle posts={filteredPosts} activeCategory={activeCategory} />}
          {blogStyle === "brutalist" && <BrutalistStyle posts={filteredPosts} activeCategory={activeCategory} />}
        </>
      )}

      <section className="py-12 lg:py-16 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold mb-2">Ready to stop missing bookings?</h2>
          <p className="text-sm text-muted-foreground mb-5">See how indexFlow can automate your booking process and free up your staff.</p>
          <Link href="/contact" data-testid="link-blog-cta">
            <Button className="gap-2" data-testid="button-blog-cta">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
