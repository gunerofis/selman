import assert from "node:assert/strict";
import test from "node:test";
import { inPriceBand, inWidthBand } from "./catalog-filters.ts";

test("price bands sit on catalog quartiles", () => {
  assert.equal(inPriceBand(1290, "3000"), true);
  assert.equal(inPriceBand(3000, "3000"), false);
  assert.equal(inPriceBand(3000, "5000"), true);
  assert.equal(inPriceBand(8000, "8000"), false);
  assert.equal(inPriceBand(8000, "ust"), true);
});

test("width bands use millimetres, not the product object", () => {
  assert.equal(inWidthBand(180, "200"), true);
  assert.equal(inWidthBand(200, "350"), true);
  assert.equal(inWidthBand(900, "genis"), true);
  assert.equal(inWidthBand(null, "200"), false);
});
