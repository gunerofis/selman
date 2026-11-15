import assert from "node:assert/strict";
import test from "node:test";
import { inPriceBand, inWidthBand } from "./catalog-filters.ts";

test("price bands sit on catalog quartiles", () => {
  assert.equal(inPriceBand(290, "1000"), true);
  assert.equal(inPriceBand(1000, "1000"), false);
  assert.equal(inPriceBand(1000, "2500"), true);
  assert.equal(inPriceBand(4000, "4000"), false);
  assert.equal(inPriceBand(4000, "ust"), true);
});

test("width bands use millimetres, not the product object", () => {
  assert.equal(inWidthBand(180, "200"), true);
  assert.equal(inWidthBand(200, "350"), true);
  assert.equal(inWidthBand(900, "genis"), true);
  assert.equal(inWidthBand(null, "200"), false);
});
