import assert from "node:assert/strict";
import test from "node:test";
import { outerMm, parseOuterDims, scaleShare } from "./scale.ts";
import type { Product } from "./products.ts";

function stub(partial: Pick<Product, "category" | "specs">): Product {
  return {
    sku: "0000",
    name: "Deneme",
    shortName: "Deneme",
    price: 1,
    image: "/products/0000.webp",
    tagline: "",
    description: "",
    features: [],
    ...partial,
  };
}

test("outer mm reads the first number on dış ölçü", () => {
  const p = stub({
    category: "ofis",
    specs: [{ label: "Dış ölçü", value: "240 × 160 × 90 mm" }],
  });
  assert.equal(outerMm(p), 240);
  assert.deepEqual(parseOuterDims(p), { w: 240, d: 160, h: 90 });
});

test("desk share uses a typical 140 cm office desk", () => {
  const p = stub({
    category: "ofis",
    specs: [{ label: "Dış ölçü", value: "280 × 180 × 40 mm" }],
  });
  const share = scaleShare(p);
  assert.ok(share);
  assert.ok(share.ratio < 1);
  assert.match(share.text, /beşte biri/);
});

test("oversize pieces tell you to measure the spot", () => {
  const p = stub({
    category: "gardrop",
    specs: [{ label: "Dış ölçü", value: "900 × 480 × 360 mm" }],
  });
  const share = scaleShare(p);
  assert.ok(share);
  assert.ok(share.ratio > 1);
  assert.match(share.text, /ölçün/i);
});
