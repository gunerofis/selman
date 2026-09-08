import assert from "node:assert/strict";
import test from "node:test";
import {
  FREE_SHIPPING_FROM,
  SHIPPING_FEE,
  includedVat,
  isPostalCode,
  isTurkishMobile,
  normalizeTurkishMobile,
  orderTotal,
  payLabel,
  shippingForSubtotal,
} from "../src/lib/commerce.ts";
import { recolorLines, restoreLine } from "../src/lib/cart-lines.ts";

test("free shipping starts exactly at 1,500 TRY", () => {
  assert.equal(FREE_SHIPPING_FROM, 1500);
  assert.equal(shippingForSubtotal(1499), SHIPPING_FEE);
  assert.equal(shippingForSubtotal(1500), 0);
  assert.equal(shippingForSubtotal(1501), 0);
});

test("empty, invalid and negative carts never receive a shipping charge", () => {
  assert.equal(shippingForSubtotal(0), 0);
  assert.equal(shippingForSubtotal(-1), 0);
  assert.equal(shippingForSubtotal(Number.NaN), 0);
});

test("order total adds shipping only below the threshold", () => {
  assert.equal(orderTotal(1290), 1290 + SHIPPING_FEE);
  assert.equal(orderTotal(2580), 2580);
});

test("included VAT preserves the gross total at the 20% rate", () => {
  assert.equal(includedVat(120), 20);
  assert.equal(Math.round(includedVat(1290) * 100) / 100, 215);
  assert.equal(includedVat(0), 0);
});

test("Turkish mobile validation accepts common formats and rejects malformed values", () => {
  assert.equal(normalizeTurkishMobile("(0505) 123-45-67"), "05051234567");
  assert.equal(isTurkishMobile("05051234567"), true);
  assert.equal(isTurkishMobile("+90 505 123 45 67"), true);
  assert.equal(isTurkishMobile("5051234567"), true);
  assert.equal(isTurkishMobile("x"), false);
  assert.equal(isTurkishMobile("02121234567"), false);
  assert.equal(isTurkishMobile("0505123456"), false);
});

test("Turkish postal codes are five digits", () => {
  assert.equal(isPostalCode("34380"), true);
  assert.equal(isPostalCode("1234"), false);
  assert.equal(isPostalCode("abcde"), false);
});

test("payment labels stay human-readable", () => {
  assert.equal(payLabel("kapida-nakit"), "Kapıda nakit");
  assert.equal(payLabel("kapida-kart"), "Kapıda kart");
  assert.equal(payLabel("havale"), "Havale / EFT");
});

test("recoloring a cart line merges quantities of the same sku", () => {
  const lines = [
    { sku: "7101", color: "espresso", qty: 1 },
    { sku: "7101", color: "bordo", qty: 2 },
  ];
  const merged = recolorLines(lines, "7101", "espresso", "bordo");
  assert.equal(merged.length, 1);
  assert.equal(merged[0].color, "bordo");
  assert.equal(merged[0].qty, 3);
  const swapped = recolorLines(lines, "7101", "espresso", "siyah");
  assert.equal(swapped.length, 2);
  assert.equal(swapped.find((l) => l.color === "siyah")?.qty, 1);
});

test("list window snaps below the step up to the step and caps high values", async () => {
  const { parseListWindow, listWindow, LIST_STEP } = await import("../src/lib/list-window.ts");
  assert.equal(parseListWindow(undefined), undefined);
  assert.equal(parseListWindow("10"), LIST_STEP);
  assert.equal(parseListWindow("48"), 48);
  assert.equal(parseListWindow("9999"), 480);
  assert.equal(listWindow(undefined), LIST_STEP);
  assert.equal(listWindow(72), 72);
});

test("restoring a removed line merges qty of the same sku and color", () => {
  const lines = [{ sku: "7101", color: "espresso", qty: 1 }];
  const merged = restoreLine(lines, { sku: "7101", color: "espresso", qty: 2 });
  assert.equal(merged.length, 1);
  assert.equal(merged[0].qty, 3);
  const added = restoreLine(lines, { sku: "7101", color: "siyah", qty: 1 });
  assert.equal(added.length, 2);
});
