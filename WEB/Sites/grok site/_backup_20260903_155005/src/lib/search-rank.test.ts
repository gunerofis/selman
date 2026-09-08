import assert from "node:assert/strict";
import test from "node:test";
import { isExactHit, promoteExact } from "./search-rank.ts";

const fold = (s: string) => s.toLowerCase();
const list = [
  { sku: "7003", name: "Masa sümen" },
  { sku: "7002", name: "Ekmek kutusu" },
  { sku: "7004", name: "Kalemlik" },
];

test("exact sku is promoted to the first result", () => {
  const ranked = promoteExact(list, "7002", fold);
  assert.equal(ranked[0].sku, "7002");
  assert.equal(ranked.length, 3);
});

test("exact name is promoted and already-first lists stay put", () => {
  assert.equal(promoteExact(list, "Masa sümen", fold)[0].sku, "7003");
  assert.equal(promoteExact(list, "7003", fold)[0].sku, "7003");
});

test("empty or unknown queries do not reshuffle", () => {
  assert.equal(promoteExact(list, "", fold)[0].sku, "7003");
  assert.equal(promoteExact(list, "xyzq", fold)[0].sku, "7003");
  assert.equal(isExactHit(list[1], "7002", fold), true);
  assert.equal(isExactHit(list[1], "ekmek", fold), false);
});
