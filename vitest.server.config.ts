import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["server/__tests__/**/*.test.ts", "tests/pseo/**/*.test.ts", "tests/we/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
});
