import matter from "gray-matter";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return escapeAttr(trimmed);
  return "";
}

const ALLOWED_COMPONENTS = new Set([
  "BlogImage",
  "Callout",
  "Checklist",
  "QuickSummary",
  "FAQ",
  "FeatureCTA",
  "RelatedLinks",
]);

function renderComponentToHtml(tag: string, props: Record<string, string>, children: string): string {
  switch (tag) {
    case "BlogImage": {
      const { src, alt = "", caption, credit, creditUrl, prompt } = props;
      if (src) {
        const safeSrc = sanitizeUrl(src);
        const safeAlt = escapeAttr(alt);
        let html = `<figure class="blog-image"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" />`;
        if (credit) {
          const safeCredit = escapeHtml(credit);
          html += creditUrl
            ? `<figcaption><span class="credit">Photo by <a href="${sanitizeUrl(creditUrl)}" target="_blank" rel="noopener">${safeCredit}</a></span></figcaption>`
            : `<figcaption><span class="credit">Photo by ${safeCredit}</span></figcaption>`;
        }
        html += `</figure>`;
        return html;
      }
      if (prompt) {
        const safePrompt = escapeHtml(prompt);
        return `<figure class="blog-image blog-image-placeholder" data-prompt="${escapeAttr(prompt)}"><div style="background:#f1f5f9;border:2px dashed #94a3b8;border-radius:8px;padding:24px 20px;text-align:center;margin:16px 0;"><div style="font-size:24px;margin-bottom:8px;color:#64748b;">&#x1f4f7;</div><div style="font-size:13px;font-weight:600;color:#475569;margin-bottom:4px;">Image Placeholder</div><div style="font-size:12px;color:#64748b;line-height:1.4;max-width:500px;margin:0 auto;">${safePrompt}</div></div></figure>`;
      }
      return `<figure class="blog-image"><div style="background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:8px;padding:24px;text-align:center;color:#94a3b8;font-size:13px;">Image placeholder</div></figure>`;
    }
    case "Callout": {
      const type = /^[a-z]+$/.test(props.type || "") ? props.type : "info";
      return `<div class="callout callout-${type}">${escapeHtml(children || props.children || "")}</div>`;
    }
    case "Checklist":
      return `<div class="checklist">${children}</div>`;
    case "QuickSummary":
      return `<div class="quick-summary"><strong>Quick Summary</strong>${children}</div>`;
    case "FAQ":
      return `<details class="faq"><summary>${props.question || ""}</summary><div>${children}</div></details>`;
    case "FeatureCTA":
      return `<div class="feature-cta"><strong>${escapeHtml(props.title || "")}</strong><p>${escapeHtml(props.description || "")}</p>${props.href ? `<a href="${sanitizeUrl(props.href)}">${escapeHtml(props.badge || "Learn more")}</a>` : ""}</div>`;
    case "RelatedLinks":
      return `<div class="related-links">${children}</div>`;
    default:
      return children;
  }
}

function parseJsxProps(propsStr: string): Record<string, string> {
  const props: Record<string, string> = {};
  const regex = /(\w+)=(?:"([^"]*)"|{[^}]*}|'([^']*)')/g;
  let match;
  while ((match = regex.exec(propsStr)) !== null) {
    props[match[1]] = match[2] ?? match[3] ?? "";
  }
  return props;
}

function transformCustomComponents(mdxContent: string): string {
  let result = mdxContent;

  for (const comp of ALLOWED_COMPONENTS) {
    const selfClosingRegex = new RegExp(`<${comp}\\s((?:[^"'/]|"[^"]*"|'[^']*')*)\\s*\\/>`, "g");
    result = result.replace(selfClosingRegex, (_match, propsStr) => {
      const props = parseJsxProps(propsStr);
      return renderComponentToHtml(comp, props, "");
    });

    const blockRegex = new RegExp(`<${comp}((?:\\s(?:[^"'>]|"[^"]*"|'[^']*')*)?)>((?:.|\\n)*?)<\\/${comp}>`, "g");
    result = result.replace(blockRegex, (_match, propsStr, children) => {
      const props = parseJsxProps(propsStr || "");
      return renderComponentToHtml(comp, props, children?.trim() || "");
    });
  }

  const unknownJsxRegex = /<([A-Z]\w+)[\s>]/g;
  let cleaned = result;
  let m;
  while ((m = unknownJsxRegex.exec(result)) !== null) {
    if (!ALLOWED_COMPONENTS.has(m[1])) {
      cleaned = cleaned.replace(new RegExp(`<${m[1]}[^>]*>(?:.|\\n)*?<\\/${m[1]}>`, "g"), "");
      cleaned = cleaned.replace(new RegExp(`<${m[1]}[^>]*\\/>`, "g"), "");
    }
  }

  return cleaned;
}

function markdownToHtml(md: string): string {
  let html = md;

  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m: string, alt: string, src: string) => {
    const safeSrc = sanitizeUrl(src);
    return safeSrc ? `<img src="${safeSrc}" alt="${escapeAttr(alt)}" loading="lazy" />` : escapeHtml(alt);
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m: string, text: string, href: string) => {
    const safeHref = sanitizeUrl(href);
    return safeHref ? `<a href="${safeHref}">${escapeHtml(text)}</a>` : escapeHtml(text);
  });

  const lines = html.split("\n");
  const output: string[] = [];
  let inList = false;
  let inOrderedList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { output.push("<ul>"); inList = true; }
      output.push(`<li>${trimmed.slice(2)}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inOrderedList) { output.push("<ol>"); inOrderedList = true; }
      output.push(`<li>${trimmed.replace(/^\d+\.\s/, "")}</li>`);
    } else {
      if (inList) { output.push("</ul>"); inList = false; }
      if (inOrderedList) { output.push("</ol>"); inOrderedList = false; }
      if (trimmed === "") {
        output.push("");
      } else if (trimmed.startsWith("<")) {
        const isKnownHtml = /^<(figure|div|details|summary|strong|em|code|a|img|h[1-6]|p|ul|ol|li|br|hr|blockquote|table|thead|tbody|tr|th|td|span|figcaption|section|article|nav|header|footer|pre)\b/i.test(trimmed)
          || /^<\/(figure|div|details|summary|strong|em|code|a|h[1-6]|p|ul|ol|li|blockquote|table|thead|tbody|tr|th|td|span|figcaption|section|article|nav|header|footer|pre)>/i.test(trimmed);
        output.push(isKnownHtml ? trimmed : `<p>${escapeHtml(trimmed)}</p>`);
      } else {
        output.push(`<p>${trimmed}</p>`);
      }
    }
  }
  if (inList) output.push("</ul>");
  if (inOrderedList) output.push("</ol>");

  return output.join("\n");
}

export interface CompileResult {
  html: string;
  frontmatter: Record<string, any>;
  errors: string[];
}

export async function compileMdxToHtml(mdxString: string): Promise<CompileResult> {
  const errors: string[] = [];

  try {
    const { data: frontmatter, content } = matter(mdxString);
    const transformed = transformCustomComponents(content);
    const html = markdownToHtml(transformed);

    return { html, frontmatter, errors };
  } catch (err: any) {
    errors.push(err.message || "MDX compilation failed");
    return { html: "", frontmatter: {}, errors };
  }
}
