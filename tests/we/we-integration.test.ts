import { describe, it, expect } from "vitest";
import { getTierConfig, canDeploy } from "../../server/config/we-tier-config";
import { isSupported } from "../../server/config/we-language-config";
import { getAllBlocks, getBlock } from "../../server/config/we-block-library";
import { getPrompt } from "../../server/config/we-ai-prompts";
import { parseDiff, applyDiff, validateDiff } from "../../server/services/we-diff";
import { checkDnsTxtRecord } from "../../server/services/we-dns-poller";
import fs from "fs";
import path from "path";

describe("TEST GROUP 1 — Database", () => {
  const tables = [
    "we_projects", "we_pages", "we_versions", "we_templates",
    "we_deployments", "we_domains", "we_form_submissions",
    "we_audit_log", "we_project_assets", "we_programmatic_pages",
  ];

  const enums = [
    "we_audit_severity", "we_deployment_status",
    "we_deployment_type", "we_verification_status",
  ];

  it("all 10 we_ table schema files exist", () => {
    const schemaDir = path.resolve(__dirname, "../../db/schema");
    const schemaFiles = [
      "we-projects.ts", "we-pages.ts", "we-versions.ts", "we-templates.ts",
      "we-deployments.ts", "we-domains.ts", "we-form-submissions.ts",
      "we-audit-log.ts", "we-project-assets.ts", "we-programmatic-pages.ts",
    ];
    for (const f of schemaFiles) {
      expect(fs.existsSync(path.join(schemaDir, f)), `${f} should exist`).toBe(true);
    }
  });

  it("we_projects schema has buildState column", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-projects.ts"), "utf-8");
    expect(content).toContain("build_state");
    expect(content).toContain("buildState");
  });

  it("all 4 enums are defined in schema files", () => {
    const auditLog = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-audit-log.ts"), "utf-8");
    expect(auditLog).toContain("we_audit_severity");

    const deployments = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-deployments.ts"), "utf-8");
    expect(deployments).toContain("we_deployment_status");
    expect(deployments).toContain("we_deployment_type");

    const domains = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-domains.ts"), "utf-8");
    expect(domains).toContain("we_verification_status");
  });

  it("foreign keys reference correct parent tables", () => {
    const pages = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-pages.ts"), "utf-8");
    expect(pages).toContain("weProjects.id");
    expect(pages).toContain("workspaces.id");

    const versions = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-versions.ts"), "utf-8");
    expect(versions).toContain("wePages.id");
    expect(versions).toContain("weProjects.id");

    const deployments = fs.readFileSync(path.resolve(__dirname, "../../db/schema/we-deployments.ts"), "utf-8");
    expect(deployments).toContain("weProjects.id");
    expect(deployments).toContain("workspaces.id");
  });
});

describe("TEST GROUP 2 — Server routes registration", () => {
  const routesContent = fs.readFileSync(path.resolve(__dirname, "../../server/routes.ts"), "utf-8");

  const registeredPaths = [
    "/api/we/projects",
    "/api/we/pages",
    "/api/we/versions",
    "/api/we/build",
    "/api/we/export",
    "/api/we/deploy",
    "/api/we/domains",
    "/api/we/whitelabel",
    "/api/we/ai",
    "/api/we/admin",
    "/api/we/collab",
    "/api/we/comments",
  ];

  for (const p of registeredPaths) {
    it(`route ${p} is registered`, () => {
      expect(routesContent).toContain(`"${p}"`);
    });
  }

  it("route files exist for all registered paths", () => {
    const routeFiles = [
      "we-projects.ts", "we-pages.ts", "we-versions.ts", "we-build.ts",
      "we-export.ts", "we-deploy.ts", "we-domains.ts", "we-whitelabel.ts",
      "we-ai.ts", "we-admin.ts", "we-collab.ts", "we-comments.ts",
    ];
    const routeDir = path.resolve(__dirname, "../../server/routes");
    for (const f of routeFiles) {
      expect(fs.existsSync(path.join(routeDir, f)), `${f} should exist`).toBe(true);
    }
  });
});

describe("TEST GROUP 3 — Middleware", () => {
  it("weAuth rejects unauthenticated requests with 401", async () => {
    const { weAuth } = await import("../../server/middleware/we-auth");
    const req = {} as any;
    let statusCode = 0;
    const res = { status: (c: number) => { statusCode = c; return { json: () => {} }; } } as any;
    const next = () => { statusCode = 200; };
    weAuth(req, res, next);
    expect(statusCode).toBe(401);
  });

  it("weAuth allows authenticated requests", async () => {
    const { weAuth } = await import("../../server/middleware/we-auth");
    const req = { user: { id: "u1" } } as any;
    let called = false;
    const res = { status: () => ({ json: () => {} }) } as any;
    weAuth(req, res, () => { called = true; });
    expect(called).toBe(true);
  });

  it("weVenue rejects missing venueId with 403", async () => {
    const { weVenue } = await import("../../server/middleware/we-venue");
    const req = { params: {}, body: {}, query: {}, ip: "127.0.0.1", originalUrl: "/test" } as any;
    let statusCode = 0;
    const res = { status: (c: number) => { statusCode = c; return { json: () => {} }; } } as any;
    weVenue(req, res, () => {});
    expect(statusCode).toBe(403);
  });

  it("requireExport blocks solo tier with 403", async () => {
    const { requireExport } = await import("../../server/middleware/we-tier");
    const req = { tier: "solo", isOnTrial: false, originalUrl: "/test" } as any;
    (req as any).venueId = "test";
    let statusCode = 0;
    const res = { status: (c: number) => { statusCode = c; return { json: () => {} }; } } as any;
    requireExport(req, res, () => { statusCode = 200; });
    expect(statusCode).toBe(403);
  });

  it("requireWhiteLabel blocks solo tier with 403", async () => {
    const { requireWhiteLabel } = await import("../../server/middleware/we-tier");
    const req = { tier: "solo", isOnTrial: false, originalUrl: "/test" } as any;
    (req as any).venueId = "test";
    let statusCode = 0;
    const res = { status: (c: number) => { statusCode = c; return { json: () => {} }; } } as any;
    requireWhiteLabel(req, res, () => { statusCode = 200; });
    expect(statusCode).toBe(403);
  });

  it("requirePaidDeployment blocks trial with 403", async () => {
    const { requirePaidDeployment } = await import("../../server/middleware/we-tier");
    const req = { tier: "solo", isOnTrial: true, originalUrl: "/test" } as any;
    (req as any).venueId = "test";
    let statusCode = 0;
    const res = { status: (c: number) => { statusCode = c; return { json: () => {} }; } } as any;
    requirePaidDeployment(req, res, () => { statusCode = 200; });
    expect(statusCode).toBe(403);
  });

  it("requireExport allows pro tier", async () => {
    const { requireExport } = await import("../../server/middleware/we-tier");
    const req = { tier: "pro", isOnTrial: false, originalUrl: "/test" } as any;
    (req as any).venueId = "test";
    let called = false;
    const res = { status: () => ({ json: () => {} }) } as any;
    requireExport(req, res, () => { called = true; });
    expect(called).toBe(true);
  });
});

describe("TEST GROUP 4 — Services", () => {
  it("parseDiff rejects invalid JSON without throwing", () => {
    const result = parseDiff("not json at all {{{");
    expect(result.valid).toBe(false);
    expect(result.diff).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("parseDiff handles valid diff JSON", () => {
    const result = parseDiff(JSON.stringify({
      changes: [{ blockId: "hero-centered", action: "update", data: { headline: "New" } }],
    }));
    expect(result.valid).toBe(true);
    expect(result.diff).not.toBeNull();
    expect(result.diff!.changes).toHaveLength(1);
  });

  it("applyDiff does not mutate input state", () => {
    const original = { components: [{ blockId: "hero-centered", headline: "Old" }] };
    const frozen = JSON.parse(JSON.stringify(original));
    const diff = {
      changes: [{ blockId: "hero-centered", action: "update" as const, data: { headline: "New" } }],
    };
    const result = applyDiff(original, diff);
    expect(result.success).toBe(true);
    expect(original.components[0].headline).toBe("Old");
    expect(JSON.stringify(original)).toBe(JSON.stringify(frozen));
  });

  it("applyDiff correctly updates block data", () => {
    const state = { components: [{ blockId: "hero-centered", headline: "Old" }] };
    const diff = {
      changes: [{ blockId: "hero-centered", action: "update" as const, data: { headline: "New" } }],
    };
    const result = applyDiff(state, diff);
    expect(result.success).toBe(true);
    expect(result.newState.components[0].headline).toBe("New");
  });

  it("validateDiff catches out-of-bounds positions", () => {
    const state = { components: [{ blockId: "a" }] };
    const diff = {
      changes: [{ blockId: "b", action: "add" as const, position: 999 }],
    };
    const result = validateDiff(diff, state);
    expect(result.valid).toBe(false);
    expect(result.warnings.some((w) => w.includes("out of bounds"))).toBe(true);
  });

  it("checkDnsTxtRecord returns false on bad domain without throwing", async () => {
    const result = await checkDnsTxtRecord("this-domain-does-not-exist-abc123.invalid", "test-value");
    expect(result).toBe(false);
  });
});

describe("TEST GROUP 5 — Config files", () => {
  it("getTierConfig solo.canExport === false", () => {
    expect(getTierConfig("solo").canExport).toBe(false);
  });

  it("getTierConfig pro.canExport === true", () => {
    expect(getTierConfig("pro").canExport).toBe(true);
  });

  it("canDeploy solo trial === false", () => {
    expect(canDeploy("solo", true)).toBe(false);
  });

  it("canDeploy solo paid === true", () => {
    expect(canDeploy("solo", false)).toBe(true);
  });

  it("canDeploy agency trial === false", () => {
    expect(canDeploy("agency", true)).toBe(false);
  });

  it("isSupported en === true", () => {
    expect(isSupported("en")).toBe(true);
  });

  it("isSupported xx === false", () => {
    expect(isSupported("xx")).toBe(false);
  });

  it("getAllBlocks returns 44 blocks", () => {
    expect(getAllBlocks().length).toBe(44);
  });

  it("getPrompt hero-centered is defined string", () => {
    const p = getPrompt("hero-centered");
    expect(typeof p).toBe("string");
    expect(p.length).toBeGreaterThan(0);
  });

  it("getPrompt utility-embed is defined string", () => {
    const p = getPrompt("utility-embed");
    expect(typeof p).toBe("string");
    expect(p.length).toBeGreaterThan(0);
  });

  it("every block has a matching prompt", () => {
    const blocks = getAllBlocks();
    for (const b of blocks) {
      const p = getPrompt(b.id);
      expect(typeof p).toBe("string");
      expect(p.length).toBeGreaterThan(0);
    }
  });

  it("all tier configs have required fields", () => {
    for (const tier of ["solo", "pro", "agency", "enterprise"]) {
      const c = getTierConfig(tier);
      expect(typeof c.maxWorkspaces).toBe("number");
      expect(typeof c.canExport).toBe("boolean");
      expect(typeof c.canWhiteLabel).toBe("boolean");
      expect(typeof c.canCollaborate).toBe("boolean");
      expect(typeof c.maxUsers).toBe("number");
    }
  });
});

describe("TEST GROUP 6 — Client components", () => {
  const components = [
    "WECanvas", "WEChatPanel", "WEPageManager", "WECustomCode",
    "WEVersionHistory", "WEExportModal", "WEDeployModal",
    "WEDomainSettings", "WECollabPanel", "WEFormSubmissions",
    "WEClientPreview", "WEEmptyState", "WEWhiteLabel", "WEAdminPanel",
  ];

  for (const name of components) {
    it(`${name}.tsx exists`, () => {
      const filePath = path.resolve(__dirname, `../../client/src/components/website-engine/${name}.tsx`);
      expect(fs.existsSync(filePath), `${name}.tsx should exist`).toBe(true);
    });
  }

  it("all 14 components exported from index.ts", () => {
    const indexPath = path.resolve(__dirname, "../../client/src/components/website-engine/index.ts");
    const content = fs.readFileSync(indexPath, "utf-8");
    for (const name of components) {
      expect(content).toContain(name);
    }
  });

  it("index.ts has exactly 14+ export lines", () => {
    const indexPath = path.resolve(__dirname, "../../client/src/components/website-engine/index.ts");
    const content = fs.readFileSync(indexPath, "utf-8");
    const exportLines = content.split("\n").filter((l) => l.startsWith("export"));
    expect(exportLines.length).toBeGreaterThanOrEqual(14);
  });
});

describe("TEST GROUP 7 — Rule set validation", () => {
  it("trial cannot deploy — canDeploy returns false for any trial", () => {
    expect(canDeploy("solo", true)).toBe(false);
    expect(canDeploy("pro", true)).toBe(false);
    expect(canDeploy("agency", true)).toBe(false);
    expect(canDeploy("enterprise", true)).toBe(false);
  });

  it("solo cannot export — requireExport blocks solo", async () => {
    const { requireExport } = await import("../../server/middleware/we-tier");
    const req = { tier: "solo", isOnTrial: false, originalUrl: "/test", venueId: "v" } as any;
    let statusCode = 0;
    const res = { status: (c: number) => { statusCode = c; return { json: () => {} }; } } as any;
    requireExport(req, res, () => { statusCode = 200; });
    expect(statusCode).toBe(403);
  });

  it("one domain per workspace — route returns 409 on duplicate", () => {
    const routeContent = fs.readFileSync(path.resolve(__dirname, "../../server/routes/we-domains.ts"), "utf-8");
    expect(routeContent).toContain("409");
    expect(routeContent).toContain("Only 1 domain");
  });

  it("home page cannot be deleted — route returns 400", () => {
    const routeContent = fs.readFileSync(path.resolve(__dirname, "../../server/routes/we-pages.ts"), "utf-8");
    expect(routeContent).toContain("Cannot delete the home page");
    expect(routeContent).toContain("400");
  });

  it("language lock — weLanguage never reads Accept-Language header", () => {
    const middlewareContent = fs.readFileSync(path.resolve(__dirname, "../../server/middleware/we-language.ts"), "utf-8");
    expect(middlewareContent).not.toContain("accept-language");
    expect(middlewareContent).not.toContain("Accept-Language");
  });

  it("version cap — MAX_VERSIONS = 500 and archives oldest 50", () => {
    const versionRoute = fs.readFileSync(path.resolve(__dirname, "../../server/routes/we-versions.ts"), "utf-8");
    expect(versionRoute).toContain("MAX_VERSIONS");
    expect(versionRoute).toContain("500");
    expect(versionRoute).toContain("ARCHIVE_BATCH");
    expect(versionRoute).toContain("50");
  });

  it("solo cannot white-label", () => {
    expect(getTierConfig("solo").canWhiteLabel).toBe(false);
  });

  it("pro can white-label", () => {
    expect(getTierConfig("pro").canWhiteLabel).toBe(true);
  });

  it("solo cannot collaborate", () => {
    expect(getTierConfig("solo").canCollaborate).toBe(false);
  });

  it("pro can collaborate", () => {
    expect(getTierConfig("pro").canCollaborate).toBe(true);
  });

  it("deployer checks domain verification before live deploy", () => {
    const deployerContent = fs.readFileSync(path.resolve(__dirname, "../../server/services/we-deployer.ts"), "utf-8");
    expect(deployerContent).toContain("Domain not verified");
  });

  it("build service has retry logic (3 attempts)", () => {
    const buildContent = fs.readFileSync(path.resolve(__dirname, "../../server/services/we-build.ts"), "utf-8");
    expect(buildContent).toContain("attempt");
    expect(buildContent).toContain("< 3");
  });
});
