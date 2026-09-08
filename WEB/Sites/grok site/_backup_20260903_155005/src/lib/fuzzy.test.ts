import assert from "node:assert/strict";
import test from "node:test";
import { closestTerm, fuzzyIncludes, withinOne } from "./fuzzy.ts";

test("within one edit catches swap, extra letter, and substitute", () => {
  assert.equal(withinOne("organizer", "organzier"), true);
  assert.equal(withinOne("baharat", "bahart"), true);
  assert.equal(withinOne("sumen", "suman"), true);
  assert.equal(withinOne("sumen", "xyzab"), false);
});

test("fuzzy includes only fires on tokens of four or more", () => {
  assert.equal(fuzzyIncludes("masa sumen stand", "suman"), true);
  assert.equal(fuzzyIncludes("masa sumen stand", "xyzq"), false);
});

test("closest term prefers a one-edit candidate", () => {
  const fold = (s: string) => s.toLowerCase();
  assert.equal(closestTerm("suman", ["sumen", "sarj", "baharat"], fold), "sumen");
  assert.equal(closestTerm("xy", ["sumen"], fold), null);
});
