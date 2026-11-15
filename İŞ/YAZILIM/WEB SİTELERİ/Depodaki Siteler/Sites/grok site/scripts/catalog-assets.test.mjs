import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = await readFile(join(root, "src/lib/products.ts"), "utf8");
const sitemap = await readFile(join(root, "public/sitemap.xml"), "utf8");

const products = [
  ...source.matchAll(
    /\{\s*sku:\s*"(?<sku>[0-9A-Z]+)"[\s\S]*?name:\s*"(?<name>[^"]+)"[\s\S]*?image:\s*"(?<image>\/products\/[^"]+)"/g,
  ),
].map(({ groups }) => groups);
const referencedImages = [...source.matchAll(/image:\s*"\/products\/(?<file>[^"]+)"/g)].map(
  ({ groups }) => groups.file,
);

function slugify(input) {
  const replacements = {
    ç: "c",
    ğ: "g",
    ı: "i",
    i: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    â: "a",
    î: "i",
    û: "u",
  };
  return input
    .split("")
    .map(
      (character) =>
        replacements[character] ?? replacements[character.toLocaleLowerCase("tr")] ?? character,
    )
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

test("catalog SKUs, product images and slugs are unique", () => {
  assert.ok(products.length > 0, "no catalog products were parsed");
  assert.deepEqual(duplicates(products.map(({ sku }) => sku)), [], "duplicate SKU");
  assert.deepEqual(duplicates(products.map(({ image }) => image)), [], "duplicate product image");
  assert.deepEqual(
    duplicates(products.map(({ name }) => slugify(name))),
    [],
    "duplicate product slug",
  );
});

test("every referenced catalog image exists", async () => {
  const files = new Set(await readdir(join(root, "public/products")));
  const missing = referencedImages.filter((file) => !files.has(file));
  assert.deepEqual(missing, []);
});

test("every catalog image has responsive WebP variants", async () => {
  const files = new Set(await readdir(join(root, "public/products")));
  const missing = referencedImages.flatMap((file) =>
    [320, 800]
      .map((width) => file.replace(/\.webp$/, `-${width}.webp`))
      .filter((variant) => !files.has(variant)),
  );
  assert.deepEqual(missing, []);
});

test("public product directory has no unreferenced image", async () => {
  const files = await readdir(join(root, "public/products"));
  const referenced = new Set(referencedImages);
  const orphaned = files.filter((file) => {
    if (referenced.has(file)) return false;
    const source = file.replace(/-(?:320|800)\.webp$/, ".webp");
    return !referenced.has(source);
  });
  assert.deepEqual(orphaned, []);
});

test("sitemap contains every product slug exactly once", () => {
  const sitemapSlugs = [
    ...sitemap.matchAll(/<loc>(?:https:\/\/sweb\.co)?\/urun\/(?<slug>[^<]+)<\/loc>/g),
  ].map(({ groups }) => groups.slug);
  const catalogSlugs = products.map(({ name }) => slugify(name));
  assert.deepEqual(duplicates(sitemapSlugs), [], "duplicate sitemap product URL");
  assert.deepEqual(sitemapSlugs.toSorted(), catalogSlugs.toSorted());
});
