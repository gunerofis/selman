import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const products = JSON.parse(await readFile(new URL("../app/products.json", import.meta.url), "utf8"));

test("catalog baseline retains 30 unique products", () => {
  assert.equal(products.length, 30);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.equal(new Set(products.map((product) => product.sku)).size, products.length);
});

test("every product keeps price, image and SEO fields", () => {
  for (const product of products) {
    assert.ok(Number(product.price) > 0, `${product.slug}: price`);
    assert.ok(product.image || product.images?.[0], `${product.slug}: image`);
    assert.ok(product.metaTitle, `${product.slug}: meta title`);
    assert.ok(product.metaDescription, `${product.slug}: meta description`);
    assert.ok(product.keywords?.length, `${product.slug}: keywords`);
  }
});

test("new model gallery contains 14 models and 70 five-color variants", () => {
  const source = readFileSync(join(root, "app", "lib", "product-wall-concepts.ts"), "utf8");
  const modelKeys = [...source.matchAll(/^  \["([^"]+)",/gm)].map((match) => match[1]);
  assert.equal(modelKeys.length, 14);
  assert.equal(new Set(modelKeys).size, 14);

  const assetDirectory = join(root, "public", "product-concepts");
  const assets = readdirSync(assetDirectory).filter((name) => name.endsWith(".webp"));
  assert.equal(assets.length, 70);
  for (const key of modelKeys) {
    for (const color of ["krem", "kahve", "bordo", "taba", "siyah"]) {
      const file = join(assetDirectory, `${key}-${color}.webp`);
      assert.ok(existsSync(file), `missing ${key}-${color}.webp`);
      assert.ok(statSync(file).size > 10_000, `invalid ${key}-${color}.webp`);
    }
  }
});
