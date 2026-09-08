import assert from "node:assert/strict";
import test from "node:test";
import { isValidOrderEmail, normalizeRequestedItems } from "../app/lib/order-input.ts";
import { isSameOriginMutation } from "../app/lib/request-security.ts";

test("normalizes duplicate, fractional and excessive quantities", () => {
  assert.deepEqual(normalizeRequestedItems([
    { slug: " urun-a ", quantity: 1.9 },
    { slug: "urun-a", quantity: 2 },
    { slug: "urun-b", quantity: 999 },
    { slug: "", quantity: 1 },
  ]), [
    { slug: "urun-a", quantity: 3 },
    { slug: "urun-b", quantity: 20 },
  ]);
});

test("validates customer email shape", () => {
  assert.equal(isValidOrderEmail("musteri@example.com"), true);
  assert.equal(isValidOrderEmail("musteri@localhost"), false);
  assert.equal(isValidOrderEmail("musteri @example.com"), false);
});

test("rejects cross-origin and originless mutations", () => {
  assert.equal(isSameOriginMutation(new Request("https://shop.example/api/orders", { headers: { origin: "https://shop.example" } })), true);
  assert.equal(isSameOriginMutation(new Request("https://shop.example/api/orders", { headers: { origin: "https://evil.example" } })), false);
  assert.equal(isSameOriginMutation(new Request("https://shop.example/api/orders")), false);
});
