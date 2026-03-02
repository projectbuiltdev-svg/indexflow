export function dotProduct(
  vectorA: Record<string, number>,
  vectorB: Record<string, number>
): number {
  let sum = 0;
  for (const key in vectorA) {
    if (key in vectorB) {
      sum += vectorA[key] * vectorB[key];
    }
  }
  return sum;
}

export function l2Norm(vector: Record<string, number>): number {
  let sum = 0;
  for (const key in vector) {
    sum += vector[key] * vector[key];
  }
  return Math.sqrt(sum);
}

export function cosineSimilarity(
  vectorA: Record<string, number>,
  vectorB: Record<string, number>
): number {
  const normA = l2Norm(vectorA);
  const normB = l2Norm(vectorB);

  if (normA === 0 || normB === 0) return 0.0;

  return dotProduct(vectorA, vectorB) / (normA * normB);
}
