import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../server/db", () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock("../../server/utils/pseo-soft-delete", () => ({
  excludeDeleted: vi.fn(() => ({ _: "mock_exclude_deleted" })),
}));

import { slugify, buildPseoUrl, type UrlStructure } from "../../server/utils/pseo-url-builder";
import { enforceUrlLock } from "../../server/middleware/pseo-url-lock-enforcement";

describe("pseo-url-builder", () => {
  describe("slugify", () => {
    it("converts to lowercase", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("replaces spaces with hyphens", () => {
      expect(slugify("new york city")).toBe("new-york-city");
    });

    it("handles apostrophes — O'Brien's → obriens", () => {
      expect(slugify("O'Brien's")).toBe("obriens");
    });

    it("handles curly apostrophes", () => {
      expect(slugify("O\u2019Brien\u2019s")).toBe("obriens");
    });

    it("handles special characters — Köln → koln", () => {
      expect(slugify("Köln")).toBe("koln");
    });

    it("handles accented characters — São Paulo → sao-paulo", () => {
      expect(slugify("São Paulo")).toBe("sao-paulo");
    });

    it("handles umlauts — München → munchen", () => {
      expect(slugify("München")).toBe("munchen");
    });

    it("removes consecutive hyphens — 'New  York' → new-york", () => {
      expect(slugify("New  York")).toBe("new-york");
    });

    it("removes leading hyphens", () => {
      expect(slugify("-hello")).toBe("hello");
    });

    it("removes trailing hyphens", () => {
      expect(slugify("hello-")).toBe("hello");
    });

    it("removes leading and trailing hyphens", () => {
      expect(slugify("--hello--")).toBe("hello");
    });

    it("removes special characters", () => {
      expect(slugify("hello@world!")).toBe("helloworld");
    });

    it("handles empty string", () => {
      expect(slugify("")).toBe("");
    });

    it("handles numbers", () => {
      expect(slugify("Route 66")).toBe("route-66");
    });

    it("handles complex mixed input", () => {
      expect(slugify("St. Mary's Church — Köln")).toBe("st-marys-church-koln");
    });

    it("collapses multiple special chars into single hyphen", () => {
      expect(slugify("foo---bar")).toBe("foo-bar");
    });
  });

  describe("buildPseoUrl", () => {
    it("builds location_first URL structure", () => {
      const url = buildPseoUrl("New York", "Plumbing", "US", "New York", "location_first");
      expect(url).toBe("/us/new-york/new-york/plumbing");
    });

    it("builds service_first URL structure", () => {
      const url = buildPseoUrl("New York", "Plumbing", "US", "New York", "service_first");
      expect(url).toBe("/plumbing/us/new-york/new-york");
    });

    it("slugifies all segments", () => {
      const url = buildPseoUrl("O'Brien's Town", "Drain Cleaning", "US", "California", "location_first");
      expect(url).toBe("/us/california/obriens-town/drain-cleaning");
    });

    it("handles special characters in all segments", () => {
      const url = buildPseoUrl("München", "Klempner", "DE", "Bayern", "service_first");
      expect(url).toBe("/klempner/de/bayern/munchen");
    });

    it("handles empty state", () => {
      const url = buildPseoUrl("Dublin", "Plumbing", "IE", "", "location_first");
      expect(url).toBe("/ie//dublin/plumbing");
    });
  });
});

describe("pseo-url-lock-enforcement", () => {
  function createMockReq(method: string, body: any = {}) {
    return { method, body } as any;
  }

  function createMockRes() {
    return {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
  }

  it("allows GET requests through", () => {
    const req = createMockReq("GET");
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("allows POST requests through", () => {
    const req = createMockReq("POST");
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("allows PUT without urlStructure", () => {
    const req = createMockReq("PUT", { name: "Test" });
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("allows PATCH without urlStructure", () => {
    const req = createMockReq("PATCH", { name: "Test" });
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("blocks PUT with urlStructure in body", () => {
    const req = createMockReq("PUT", { urlStructure: "service_first" });
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ type: "URL_CONFLICT" })
    );
  });

  it("blocks PATCH with urlStructure in body", () => {
    const req = createMockReq("PATCH", { urlStructure: "location_first" });
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("blocks PATCH with url_structure (snake_case) in body", () => {
    const req = createMockReq("PATCH", { url_structure: "service_first" });
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns correct error message", () => {
    const req = createMockReq("PUT", { urlStructure: "service_first" });
    const res = createMockRes();
    const next = vi.fn();
    enforceUrlLock(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "URL structure cannot be changed after activation",
      })
    );
  });
});
