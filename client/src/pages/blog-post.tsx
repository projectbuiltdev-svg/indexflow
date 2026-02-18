import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ArrowLeft, Clock, User, Calendar, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { blogCategories } from "@/pages/blog";

type BlogStyle = "editorial" | "magazine" | "minimal" | "classic" | "grid" | "brutalist";

const SLUG_TO_LABEL: Record<string, string> = {};
blogCategories.forEach(c => { SLUG_TO_LABEL[c.slug] = c.label; });

interface PostData {
  blogTemplate: string;
  accentColor: string | null;
  accentForeground: string | null;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  tags: string[] | null;
  compiledHtml: string | null;
  publishedAt: string | null;
}

const PROSE_BASE = [
  "prose prose-lg dark:prose-invert max-w-none",
  "prose-headings:font-bold prose-headings:tracking-tight",
  "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
  "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
  "prose-p:leading-relaxed prose-p:mb-4",
  "prose-li:leading-relaxed",
  "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
  "prose-img:rounded-md prose-img:my-6",
  "prose-blockquote:border-l-2 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
  "prose-strong:font-semibold",
  "prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
  "prose-table:text-sm",
  "prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-border prose-th:pb-2",
  "prose-td:border-b prose-td:border-border/50 prose-td:py-2",
].join(" ");

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function estimateReadTime(html: string | null): string {
  if (!html) return "3 min read";
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return `${Math.max(3, Math.round(words / 250))} min read`;
}


function EditorialArticle({ post }: { post: PostData }) {
  const catLabel = SLUG_TO_LABEL[post.category] || post.category;
  return (
    <div className="bg-stone-50/50 dark:bg-transparent min-h-[60vh]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <header className="mb-10 border-b border-stone-200 dark:border-border pb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block" data-testid="text-post-category">{catLabel}</span>
          <h1 className="text-3xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight mb-5" data-testid="text-post-title">{post.title}</h1>
          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-5">{post.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> indexFlow Editorial</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {estimateReadTime(post.compiledHtml)}</span>
          </div>
        </header>
        <div className={PROSE_BASE} dangerouslySetInnerHTML={{ __html: post.compiledHtml || "" }} data-testid="post-body" />
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-stone-200 dark:border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Tags:</span>
              {post.tags.map(tag => (
                <span key={tag} className="text-xs bg-muted px-2.5 py-1 rounded-md text-muted-foreground">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}


function MagazineArticle({ post }: { post: PostData }) {
  const catLabel = SLUG_TO_LABEL[post.category] || post.category;
  return (
    <div className="min-h-[60vh]">
      <div className="bg-zinc-900 dark:bg-zinc-950 text-white py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-4 block" data-testid="text-post-category">{catLabel}</span>
          <h1 className="text-3xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-5" data-testid="text-post-title">{post.title}</h1>
          {post.description && (
            <p className="text-lg opacity-60 leading-relaxed mb-5">{post.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm opacity-40 flex-wrap">
            <span>indexFlow Editorial</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{estimateReadTime(post.compiledHtml)}</span>
          </div>
        </div>
      </div>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14 bg-zinc-50 dark:bg-transparent">
        <div className={PROSE_BASE} dangerouslySetInnerHTML={{ __html: post.compiledHtml || "" }} data-testid="post-body" />
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Tags:</span>
              {post.tags.map(tag => (
                <span key={tag} className="text-xs bg-muted px-2.5 py-1 rounded-md text-muted-foreground">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}


function MinimalArticle({ post }: { post: PostData }) {
  const catLabel = SLUG_TO_LABEL[post.category] || post.category;
  return (
    <div className="bg-white dark:bg-transparent min-h-[60vh]">
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <header className="mb-10 border-t-2 border-foreground dark:border-foreground/50 pt-8">
          <span className="text-xs text-muted-foreground uppercase tracking-widest" data-testid="text-post-category">{catLabel}</span>
          <h1 className="text-2xl lg:text-3xl font-semibold leading-snug mt-2 mb-3" data-testid="text-post-title">{post.title}</h1>
          {post.description && (
            <p className="text-muted-foreground leading-relaxed mb-4">{post.description}</p>
          )}
          <div className="text-xs text-muted-foreground/60">
            indexFlow Editorial -- {formatDate(post.publishedAt)} -- {estimateReadTime(post.compiledHtml)}
          </div>
        </header>
        <div className={`${PROSE_BASE} prose-base`} dangerouslySetInnerHTML={{ __html: post.compiledHtml || "" }} data-testid="post-body" />
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-muted-foreground/70">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}


function ClassicArticle({ post }: { post: PostData }) {
  const catLabel = SLUG_TO_LABEL[post.category] || post.category;
  return (
    <div className="bg-amber-50/30 dark:bg-transparent min-h-[60vh]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <header className="mb-10 text-center pb-8 border-b-2 border-double border-amber-200/50 dark:border-foreground/20">
          <span className="text-xs font-serif italic text-muted-foreground" data-testid="text-post-category">{catLabel}</span>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mt-2 mb-4" data-testid="text-post-title">{post.title}</h1>
          {post.description && (
            <p className="text-muted-foreground font-serif leading-relaxed max-w-2xl mx-auto mb-4">{post.description}</p>
          )}
          <div className="text-xs text-muted-foreground/60 font-serif italic">
            By indexFlow Editorial -- {formatDate(post.publishedAt)} -- {estimateReadTime(post.compiledHtml)}
          </div>
        </header>
        <div className={`${PROSE_BASE} prose-headings:font-serif`} dangerouslySetInnerHTML={{ __html: post.compiledHtml || "" }} data-testid="post-body" />
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t-2 border-double border-amber-200/50 dark:border-foreground/20 text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-serif italic text-muted-foreground/70">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}


function GridArticle({ post }: { post: PostData }) {
  const catLabel = SLUG_TO_LABEL[post.category] || post.category;
  return (
    <div className="bg-slate-50/60 dark:bg-transparent min-h-[60vh]">
      <div className="py-8 lg:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block" data-testid="text-post-category">{catLabel}</span>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3" data-testid="text-post-title">{post.title}</h1>
          {post.description && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl mb-4">{post.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span>indexFlow Editorial</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{estimateReadTime(post.compiledHtml)}</span>
          </div>
        </div>
      </div>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 lg:pb-16">
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-md p-6 lg:p-10">
          <div className={PROSE_BASE} dangerouslySetInnerHTML={{ __html: post.compiledHtml || "" }} data-testid="post-body" />
        </div>
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-6 flex items-center gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-white dark:bg-card border border-slate-200 dark:border-border px-2.5 py-1 rounded-md text-muted-foreground">{tag}</span>
            ))}
          </footer>
        )}
      </article>
    </div>
  );
}


function BrutalistArticle({ post }: { post: PostData }) {
  const catLabel = SLUG_TO_LABEL[post.category] || post.category;
  return (
    <div className="bg-yellow-50/40 dark:bg-zinc-950 min-h-[60vh]">
      <div className="border-b-4 border-foreground bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <span className="text-xs font-mono uppercase tracking-widest opacity-50 block" data-testid="text-post-category">[{catLabel}]</span>
          <h1 className="text-3xl lg:text-5xl font-black uppercase leading-none mt-3 mb-4" data-testid="text-post-title">{post.title}</h1>
          {post.description && (
            <p className="text-lg opacity-60 leading-relaxed max-w-3xl mb-4">{post.description}</p>
          )}
          <div className="text-xs font-mono opacity-40 uppercase">
            indexFlow Editorial / {formatDate(post.publishedAt)} / {estimateReadTime(post.compiledHtml)}
          </div>
        </div>
      </div>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className={`${PROSE_BASE} prose-headings:uppercase prose-headings:font-black`} dangerouslySetInnerHTML={{ __html: post.compiledHtml || "" }} data-testid="post-body" />
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t-4 border-foreground">
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-mono uppercase bg-foreground text-background px-2.5 py-1">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}


function ArticleRenderer({ post }: { post: PostData }) {
  const template = (post.blogTemplate || "editorial") as BlogStyle;
  const accentStyle: Record<string, string> = {};
  if (post.accentColor) accentStyle["--blog-accent"] = post.accentColor;
  if (post.accentForeground) accentStyle["--blog-accent-fg"] = post.accentForeground;

  const content = (() => {
    switch (template) {
      case "magazine": return <MagazineArticle post={post} />;
      case "minimal": return <MinimalArticle post={post} />;
      case "classic": return <ClassicArticle post={post} />;
      case "grid": return <GridArticle post={post} />;
      case "brutalist": return <BrutalistArticle post={post} />;
      default: return <EditorialArticle post={post} />;
    }
  })();

  return <div style={accentStyle as React.CSSProperties}>{content}</div>;
}


export default function BlogPost() {
  const params = useParams<{ category: string; slug: string }>();
  const { category, slug } = params;

  const { data: post, isLoading, error } = useQuery<PostData>({
    queryKey: [`/api/public/blog/post?domain=indexflow.io&slug=${encodeURIComponent(slug || "")}`],
    enabled: !!slug,
  });

  const categoryMismatch = post && category && post.category !== category;
  const effectivePost = categoryMismatch ? null : post;

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | indexFlow Blog`;
    }
  }, [post?.title]);

  const catLabel = category ? SLUG_TO_LABEL[category] || category : "";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap" data-testid="breadcrumbs">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-home">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-blog">Blog</Link>
          {catLabel && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/80">{catLabel}</span>
            </>
          )}
        </nav>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" data-testid="loading-spinner" />
        </div>
      ) : error || !effectivePost ? (
        <div className="py-24 text-center" data-testid="post-not-found">
          <h2 className="text-xl font-bold mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-6 text-sm">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog" data-testid="link-back-to-blog">
            <Button variant="outline" className="gap-2" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      ) : (
        <ArticleRenderer post={effectivePost} />
      )}

      <section className="py-12 lg:py-16 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 flex-wrap">
          <Link href="/blog" data-testid="link-back-to-blog-bottom">
            <Button variant="outline" className="gap-2" data-testid="button-back-blog">
              <ArrowLeft className="w-4 h-4" /> More Articles
            </Button>
          </Link>
          <Link href="/contact" data-testid="link-post-cta">
            <Button className="gap-2" data-testid="button-post-cta">
              Get Started with indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
