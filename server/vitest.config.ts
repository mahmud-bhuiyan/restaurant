import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      mongoose: path.resolve(dir, "node_modules/mongoose"),
      supertest: path.resolve(dir, "node_modules/supertest"),
    },
  },
  test: {
    globals: false,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup/db.ts"],
    testTimeout: 30000,
    pool: "forks",
  },
});
