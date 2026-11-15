import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Monorepo kökü (IAGEE): `packages/shared` altına giden importlar için Vite fs izni. */
const monorepoRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  root: __dirname,
  publicDir: false,
  build: {
    outDir: "dist-browser",
    emptyOutDir: true,
  },
  resolve: {
    /**
     * Tarayıcı bundle: workspace `dist` (CJS) Rollup’ta named export kaybeder.
     * `src/index.ts` üzerinden derle — Node `tsc` client yine `node_modules` → `dist` kullanır.
     */
    alias: {
      "@rift-empire/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [monorepoRoot],
    },
  },
});
