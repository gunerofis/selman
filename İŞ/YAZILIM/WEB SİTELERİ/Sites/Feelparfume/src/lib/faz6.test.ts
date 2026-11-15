import assert from "node:assert/strict";
import test from "node:test";
import { authorLabel, batchGroups, ratingSummary, reviewAllowed } from "./reviews.ts";

const delivered = {
  shippingStatus: "delivered",
  email: "Ayse@Example.invalid",
  skus: ["FP-001"],
};

test("only a delivered order for the same buyer and sku can be reviewed", () => {
  assert.equal(reviewAllowed(delivered, "ayse@example.invalid", "FP-001"), true);
  assert.equal(reviewAllowed({ ...delivered, shippingStatus: "shipped" }, "ayse@example.invalid", "FP-001"), false);
  assert.equal(reviewAllowed(delivered, "baska@example.invalid", "FP-001"), false);
  assert.equal(reviewAllowed(delivered, "ayse@example.invalid", "FP-002"), false);
  assert.equal(reviewAllowed(null, "ayse@example.invalid", "FP-001"), false);
});

test("rating stays empty until a real score exists", () => {
  assert.equal(ratingSummary([]), null);
  assert.equal(ratingSummary([0, 6]), null);
  assert.deepEqual(ratingSummary([5, 4]), { count: 2, rating: 4.5 });
  assert.equal(authorLabel("Ayşe Yılmaz"), "Ayşe");
  assert.equal(authorLabel("  "), "Müşteri");
});

test("one batch lists each volume once", () => {
  const groups = batchGroups([
    { sku: "FP-001", name: "Gül Işığı", slug: "gul-isigi", ml: "5" },
    { sku: "FP-001", name: "Gül Işığı", slug: "gul-isigi", ml: "50" },
    { sku: "FP-001", name: "Gül Işığı", slug: "gul-isigi", ml: "5" },
  ]);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0]?.mls, [5, 50]);
});
