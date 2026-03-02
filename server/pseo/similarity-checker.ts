import { buildTfIdfVector } from "../utils/pseo-tfidf-vectoriser";
import { cosineSimilarity } from "../utils/pseo-cosine-similarity";
import { SIMILARITY_THRESHOLD } from "../config/pseo-similarity-threshold";

export interface SimilarityResult {
  similarityScore: number;
  comparisonPageId: string | null;
  action: "pass" | "hold";
}

export interface PageVector {
  pageId: string;
  campaignId: string;
  vector: Record<string, number>;
}

export interface SimilarityStorage {
  getPageVectors(campaignId: string, excludePageId?: string): Promise<PageVector[]>;
  addToReviewQueue(entry: {
    campaignId: string;
    venueId: string;
    pageId: string;
    reason: string;
    reasonCategory: string;
    failReasons: string[];
    status: string;
  }): Promise<void>;
  updatePageStatus(
    pageId: string,
    status: string,
    similarityScore: number
  ): Promise<void>;
  storePageVector(pageId: string, campaignId: string, vector: Record<string, number>): Promise<void>;
}

export function extractTextForSimilarity(html: string, languageCode: string = "en"): string {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return stripped;
}

export function computeSimilarityScore(
  htmlA: string,
  htmlB: string,
  languageCode: string = "en"
): number {
  const textA = extractTextForSimilarity(htmlA, languageCode);
  const textB = extractTextForSimilarity(htmlB, languageCode);
  const vecA = buildTfIdfVector(textA, languageCode);
  const vecB = buildTfIdfVector(textB, languageCode);
  return cosineSimilarity(vecA, vecB);
}

export async function checkSimilarity(
  newPageHtml: string,
  campaignId: string,
  newPageId: string,
  languageCode: string,
  storage: SimilarityStorage,
  venueId: string
): Promise<SimilarityResult> {
  const text = extractTextForSimilarity(newPageHtml, languageCode);
  const newVector = buildTfIdfVector(text, languageCode);

  await storage.storePageVector(newPageId, campaignId, newVector);

  const existingVectors = await storage.getPageVectors(campaignId, newPageId);

  if (existingVectors.length === 0) {
    await storage.updatePageStatus(newPageId, "draft", 0);
    return { similarityScore: 0, comparisonPageId: null, action: "pass" };
  }

  let highestScore = 0;
  let comparisonPageId: string | null = null;

  for (const existing of existingVectors) {
    const score = cosineSimilarity(newVector, existing.vector);
    if (score > highestScore) {
      highestScore = score;
      comparisonPageId = existing.pageId;
    }
  }

  const roundedScore = Math.round(highestScore * 1000) / 1000;

  if (highestScore >= SIMILARITY_THRESHOLD) {
    await storage.updatePageStatus(newPageId, "held", roundedScore);

    await storage.addToReviewQueue({
      campaignId,
      venueId,
      pageId: newPageId,
      reason: `Similarity score ${roundedScore} exceeds threshold ${SIMILARITY_THRESHOLD} (compared to page ${comparisonPageId})`,
      reasonCategory: "similarity_hold",
      failReasons: [`Similarity: ${roundedScore} vs page ${comparisonPageId}`],
      status: "pending",
    });

    return { similarityScore: roundedScore, comparisonPageId, action: "hold" };
  }

  await storage.updatePageStatus(newPageId, "draft", roundedScore);

  return { similarityScore: roundedScore, comparisonPageId, action: "pass" };
}

export async function recheckSimilarity(
  pageId: string,
  editedHtml: string,
  campaignId: string,
  languageCode: string,
  storage: SimilarityStorage,
  venueId: string
): Promise<SimilarityResult> {
  return checkSimilarity(editedHtml, campaignId, pageId, languageCode, storage, venueId);
}
