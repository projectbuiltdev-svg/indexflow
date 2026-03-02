import { describe, it, expect, vi } from "vitest";

import {
  extractTextForSimilarity,
  computeSimilarityScore,
  checkSimilarity,
  recheckSimilarity,
  type SimilarityStorage,
  type PageVector,
} from "../../server/pseo/similarity-checker";

import { buildTfIdfVector } from "../../server/utils/pseo-tfidf-vectoriser";

function makeMockStorage(existingVectors: PageVector[] = []): SimilarityStorage {
  return {
    getPageVectors: vi.fn().mockResolvedValue(existingVectors),
    addToReviewQueue: vi.fn().mockResolvedValue(undefined),
    updatePageStatus: vi.fn().mockResolvedValue(undefined),
    storePageVector: vi.fn().mockResolvedValue(undefined),
  };
}

const PLUMBER_HTML = `<html><body>
  <h1>Professional Plumber Services in Dublin</h1>
  <p>Our expert plumbing team provides reliable pipe repair, emergency plumbing, 
     drain cleaning, and water heater installation services across Dublin city. 
     We are the most trusted plumber in the greater Dublin area with over twenty 
     years of professional plumbing experience serving residential and commercial 
     customers throughout Dublin and surrounding counties.</p>
</body></html>`;

const DENTIST_HTML = `<html><body>
  <h1>Professional Dentist Services in Cork</h1>
  <p>Our dental practice offers comprehensive oral health care, teeth whitening, 
     dental implants, orthodontic treatment, and preventive dentistry services 
     across Cork city. We provide the highest standard of dental care with modern 
     equipment and a friendly team of qualified dental professionals serving 
     families and individuals throughout the Cork region.</p>
</body></html>`;

describe("similarity-checker: extractTextForSimilarity", () => {
  it("strips HTML tags", () => {
    const text = extractTextForSimilarity("<h1>Hello</h1><p>World</p>");
    expect(text).not.toContain("<");
    expect(text).not.toContain(">");
    expect(text).toContain("hello");
    expect(text).toContain("world");
  });

  it("strips script and style tags", () => {
    const text = extractTextForSimilarity(
      '<script>var x = 1;</script><style>.a{color:red}</style><p>Content</p>'
    );
    expect(text).not.toContain("var");
    expect(text).not.toContain("color");
    expect(text).toContain("content");
  });

  it("lowercases text", () => {
    const text = extractTextForSimilarity("<p>UPPERCASE Text</p>");
    expect(text).toBe("uppercase text");
  });

  it("decodes HTML entities", () => {
    const text = extractTextForSimilarity("<p>A &amp; B &lt; C</p>");
    expect(text).toContain("a & b < c");
  });
});

describe("similarity-checker: computeSimilarityScore", () => {
  it("identical content scores 1.0", () => {
    const score = computeSimilarityScore(PLUMBER_HTML, PLUMBER_HTML);
    expect(score).toBeCloseTo(1.0, 3);
  });

  it("completely different content scores near 0.0", () => {
    const score = computeSimilarityScore(PLUMBER_HTML, DENTIST_HTML);
    expect(score).toBeLessThan(0.5);
  });

  it("similar but not identical content scores between 0 and 1", () => {
    const variantHtml = PLUMBER_HTML.replace("twenty years", "fifteen years")
      .replace("most trusted", "leading");
    const score = computeSimilarityScore(PLUMBER_HTML, variantHtml);
    expect(score).toBeGreaterThan(0.5);
    expect(score).toBeLessThan(1.0);
  });

  it("empty HTML returns 0.0", () => {
    const score = computeSimilarityScore("<p></p>", PLUMBER_HTML);
    expect(score).toBe(0.0);
  });

  it("zero vector handling — both empty", () => {
    const score = computeSimilarityScore("", "");
    expect(score).toBe(0.0);
  });
});

describe("similarity-checker: checkSimilarity threshold", () => {
  it("score >= 0.80 triggers hold", async () => {
    const text = extractTextForSimilarity(PLUMBER_HTML);
    const existingVector = buildTfIdfVector(text, "en");
    const storage = makeMockStorage([
      { pageId: "existing-page-1", campaignId: "campaign-1", vector: existingVector },
    ]);

    const result = await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-page-1", "en", storage, "workspace-1"
    );

    expect(result.action).toBe("hold");
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.8);
    expect(result.comparisonPageId).toBe("existing-page-1");
    expect(storage.addToReviewQueue).toHaveBeenCalled();
    expect(storage.updatePageStatus).toHaveBeenCalledWith("new-page-1", "held", expect.any(Number));
  });

  it("score < 0.80 triggers pass", async () => {
    const text = extractTextForSimilarity(DENTIST_HTML);
    const existingVector = buildTfIdfVector(text, "en");
    const storage = makeMockStorage([
      { pageId: "existing-page-1", campaignId: "campaign-1", vector: existingVector },
    ]);

    const result = await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-page-1", "en", storage, "workspace-1"
    );

    expect(result.action).toBe("pass");
    expect(result.similarityScore).toBeLessThan(0.8);
    expect(storage.addToReviewQueue).not.toHaveBeenCalled();
    expect(storage.updatePageStatus).toHaveBeenCalledWith("new-page-1", "draft", expect.any(Number));
  });

  it("no existing pages always passes with score 0", async () => {
    const storage = makeMockStorage([]);

    const result = await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-page-1", "en", storage, "workspace-1"
    );

    expect(result.action).toBe("pass");
    expect(result.similarityScore).toBe(0);
    expect(result.comparisonPageId).toBeNull();
  });
});

describe("similarity-checker: cross-campaign isolation", () => {
  it("only compares against pages in the same campaign", async () => {
    const text = extractTextForSimilarity(PLUMBER_HTML);
    const sameVec = buildTfIdfVector(text, "en");

    const storage = makeMockStorage([]);
    (storage.getPageVectors as any).mockImplementation((campaignId: string) => {
      if (campaignId === "campaign-1") return Promise.resolve([]);
      return Promise.resolve([
        { pageId: "other-campaign-page", campaignId: "campaign-2", vector: sameVec },
      ]);
    });

    const result = await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-page-1", "en", storage, "workspace-1"
    );

    expect(result.action).toBe("pass");
    expect(result.similarityScore).toBe(0);
    expect(storage.getPageVectors).toHaveBeenCalledWith("campaign-1", "new-page-1");
  });
});

describe("similarity-checker: earlier page unchanged", () => {
  it("only the new page gets held, existing page status unchanged", async () => {
    const text = extractTextForSimilarity(PLUMBER_HTML);
    const existingVector = buildTfIdfVector(text, "en");
    const storage = makeMockStorage([
      { pageId: "existing-page-1", campaignId: "campaign-1", vector: existingVector },
    ]);

    await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-page-2", "en", storage, "workspace-1"
    );

    const updateCalls = (storage.updatePageStatus as any).mock.calls;
    const updatedPageIds = updateCalls.map((c: any[]) => c[0]);
    expect(updatedPageIds).toContain("new-page-2");
    expect(updatedPageIds).not.toContain("existing-page-1");
  });
});

describe("similarity-checker: recheckSimilarity", () => {
  it("re-runs against all current pages including newer ones", async () => {
    const dentistText = extractTextForSimilarity(DENTIST_HTML);
    const dentistVec = buildTfIdfVector(dentistText, "en");

    const plumberText = extractTextForSimilarity(PLUMBER_HTML);
    const plumberVec = buildTfIdfVector(plumberText, "en");

    const storage = makeMockStorage([
      { pageId: "page-a", campaignId: "campaign-1", vector: dentistVec },
      { pageId: "page-c", campaignId: "campaign-1", vector: plumberVec },
    ]);

    const editedHtml = `<html><body><p>Completely new unique content about gardening 
      and landscaping services with no overlap to plumbing or dentistry whatsoever. 
      Hedge trimming and lawn maintenance across the countryside.</p></body></html>`;

    const result = await recheckSimilarity(
      "page-b", editedHtml, "campaign-1", "en", storage, "workspace-1"
    );

    expect(result.action).toBe("pass");
    expect(storage.getPageVectors).toHaveBeenCalledWith("campaign-1", "page-b");
    expect(storage.storePageVector).toHaveBeenCalledWith("page-b", "campaign-1", expect.any(Object));
  });

  it("recheck can trigger hold if edit makes content too similar", async () => {
    const text = extractTextForSimilarity(PLUMBER_HTML);
    const existingVec = buildTfIdfVector(text, "en");

    const storage = makeMockStorage([
      { pageId: "page-a", campaignId: "campaign-1", vector: existingVec },
    ]);

    const result = await recheckSimilarity(
      "page-b", PLUMBER_HTML, "campaign-1", "en", storage, "workspace-1"
    );

    expect(result.action).toBe("hold");
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.8);
  });
});

describe("similarity-checker: vector storage", () => {
  it("stores new page vector before comparison", async () => {
    const storage = makeMockStorage([]);

    await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-page-1", "en", storage, "workspace-1"
    );

    expect(storage.storePageVector).toHaveBeenCalledWith(
      "new-page-1", "campaign-1", expect.any(Object)
    );

    const storedVector = (storage.storePageVector as any).mock.calls[0][2];
    expect(Object.keys(storedVector).length).toBeGreaterThan(0);
  });

  it("picks the highest scoring page when multiple exist", async () => {
    const plumberText = extractTextForSimilarity(PLUMBER_HTML);
    const plumberVec = buildTfIdfVector(plumberText, "en");

    const dentistText = extractTextForSimilarity(DENTIST_HTML);
    const dentistVec = buildTfIdfVector(dentistText, "en");

    const storage = makeMockStorage([
      { pageId: "dentist-page", campaignId: "campaign-1", vector: dentistVec },
      { pageId: "plumber-page", campaignId: "campaign-1", vector: plumberVec },
    ]);

    const result = await checkSimilarity(
      PLUMBER_HTML, "campaign-1", "new-plumber", "en", storage, "workspace-1"
    );

    expect(result.comparisonPageId).toBe("plumber-page");
    expect(result.similarityScore).toBeGreaterThan(0.5);
  });
});
