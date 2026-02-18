export interface BatchOptions {
  concurrency?: number;
  retries?: number;
  onProgress?: (completed: number, total: number) => void;
}

export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: BatchOptions = {}
): Promise<R[]> {
  const { concurrency = 2, retries = 1, onProgress } = options;
  const results: R[] = [];
  let completed = 0;
  const total = items.length;

  const queue = [...items];
  const workers: Promise<void>[] = [];

  for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
    workers.push(
      (async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          if (!item) break;
          let lastError: any;
          for (let attempt = 0; attempt < retries; attempt++) {
            try {
              const result = await processor(item);
              results.push(result);
              lastError = null;
              break;
            } catch (err) {
              lastError = err;
            }
          }
          if (lastError) {
            results.push(undefined as any);
          }
          completed++;
          onProgress?.(completed, total);
        }
      })()
    );
  }

  await Promise.all(workers);
  return results;
}
