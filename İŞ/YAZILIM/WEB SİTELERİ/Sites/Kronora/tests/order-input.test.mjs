import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { isValidOrderEmail, isValidOrderPhone, isValidTaxNumber, isValidTaxOffice, normalizeRequestedItems } from "../app/lib/order-input.ts";
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

test("requires a Turkish phone number", () => {
  assert.equal(isValidOrderPhone("0501 144 27 29"), true);
  assert.equal(isValidOrderPhone("5011442729"), true);
  assert.equal(isValidOrderPhone("90 501 144 27 29"), true);
  assert.equal(isValidOrderPhone("123"), false);
  assert.equal(isValidOrderPhone(""), false);
});

test("requires tax number and tax office", () => {
  assert.equal(isValidTaxNumber("1234567890"), true);
  assert.equal(isValidTaxNumber("12345678901"), true);
  assert.equal(isValidTaxNumber("123 456 7890"), true);
  assert.equal(isValidTaxNumber("12345"), false);
  assert.equal(isValidTaxNumber(""), false);
  assert.equal(isValidTaxOffice("Kadıköy"), true);
  assert.equal(isValidTaxOffice("A"), false);
  assert.equal(isValidTaxOffice(""), false);
});

test("checkout form requires phone, tax number and tax office", async () => {
  const source = await readFile(new URL("../app/odeme/checkout-client.tsx", import.meta.url), "utf8");
  assert.match(source, /name="phone"[^>]*required/);
  assert.match(source, /name="taxNumber"[^>]*required/);
  assert.match(source, /name="taxOffice"[^>]*required/);
  assert.doesNotMatch(source, /Vergi no[\s\S]{0,120}İsteğe bağlı/);
  assert.doesNotMatch(source, /Vergi dairesi[\s\S]{0,120}İsteğe bağlı/);
});

test("rejects cross-origin and originless mutations", () => {
  assert.equal(isSameOriginMutation(new Request("https://shop.example/api/orders", { headers: { origin: "https://shop.example" } })), true);
  assert.equal(isSameOriginMutation(new Request("https://shop.example/api/orders", { headers: { origin: "https://evil.example" } })), false);
  assert.equal(isSameOriginMutation(new Request("https://shop.example/api/orders")), false);
});
