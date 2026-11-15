import { access, copyFile, mkdir, rename, rm } from "node:fs/promises";

await mkdir("dist/.openai", { recursive: true });
try {
  await access(".openai/hosting.json");
  await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
} catch (error) {
  if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
    throw error;
  }
}

// vinext mirrors a path-based assetPrefix on disk. Move the generated bundles
// back to their canonical storage path so /app-assets/* cannot be short-
// circuited by the hosting static layer and must pass through worker.ts.
const prefixedStatic = "dist/client/app-assets/_next/static";
const canonicalStatic = "dist/client/_next/static";

let hasPrefixedStatic = true;
try {
  await access(prefixedStatic);
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    hasPrefixedStatic = false;
  } else {
    throw error;
  }
}

if (hasPrefixedStatic) {
  await mkdir("dist/client/_next", { recursive: true });
  await rm(canonicalStatic, { recursive: true, force: true });
  await rename(prefixedStatic, canonicalStatic);
  await rm("dist/client/app-assets", { recursive: true, force: true });
}
