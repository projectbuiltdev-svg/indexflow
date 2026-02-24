import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { routeMeta, injectMeta } from "./ssr-meta";
import { createServer } from "http";
import { Transform } from "stream";
import fs from "fs";
import path from "path";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

const SSR_PUBLIC_PREFIXES = [
  "/founder-statement", "/how-it-works", "/pricing", "/contact",
  "/book-demo", "/faq", "/portfolio", "/templates", "/blog", "/privacy",
  "/terms", "/docs", "/testimonials", "/case-studies", "/locations",
  "/solutions/", "/platform/", "/comparisons/", "/features/", "/services/",
  "/home-archive",
];

function shouldSSR(url: string): boolean {
  const pathname = url.split("?")[0];
  if (pathname === "/") return true;
  return SSR_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

(async () => {
  const { seedDatabase } = await import("./seed");
  await seedDatabase().catch((err) => console.error("Seed error:", err));

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { createServer: createViteServer, createLogger } = await import("vite");
    const { nanoid } = await import("nanoid");
    const viteConfig = (await import("../vite.config")).default;

    const viteLogger = createLogger();

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        error: (msg: string, options?: any) => {
          viteLogger.error(msg, options);
          process.exit(1);
        },
      },
      server: {
        middlewareMode: true,
        hmr: { server: httpServer, path: "/vite-hmr" },
        allowedHosts: true as const,
      },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("/{*path}", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html",
        );

        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        template = await vite.transformIndexHtml(url, template);

        const urlPath = url.split("?")[0].replace(/\/$/, "") || "/";
        const meta = routeMeta[urlPath];
        if (meta) {
          template = injectMeta(template, meta);
        }

        if (!shouldSSR(url)) {
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
          return;
        }

        const [head, tail] = template.split("<!--ssr-outlet-->");
        if (!tail) {
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
          return;
        }

        let render: any;
        try {
          const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
          render = mod.render;
        } catch (ssrErr) {
          console.error("[SSR] Failed to load entry-server module:", ssrErr);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
          return;
        }

        let didError = false;
        const stream = render(url, {
          onAllReady() {
            res.status(didError ? 500 : 200).set({ "Content-Type": "text/html" });
            res.write(head);

            const transform = new Transform({
              transform(chunk, _encoding, callback) {
                callback(null, chunk);
              },
              flush(callback) {
                this.push(tail);
                callback();
              },
            });

            transform.pipe(res);
            stream.pipe(transform);
          },
          onShellReady() {
            // wait for onAllReady for SEO completeness
          },
          onShellError(err: unknown) {
            console.error("[SSR] Shell error:", err);
            res.status(200).set({ "Content-Type": "text/html" }).end(head + tail);
          },
          onError(err: unknown) {
            didError = true;
            console.error("[SSR] Render error:", err);
          },
        });

        res.on("close", () => {
          stream.abort();
        });

      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
