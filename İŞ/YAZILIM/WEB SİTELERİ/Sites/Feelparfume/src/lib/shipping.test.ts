import assert from "node:assert/strict";
import test from "node:test";
import { quoteOrder } from "./checkout-pricing.ts";
import { code128Bars } from "./code128.ts";
import { orderInput, priceOrder } from "./order-input.ts";
import { cargoKeyFor, invoiceKeyFor, isTurkeyCity, shippingAmount, trackingUrl } from "./shipping.ts";

test("shipping threshold and turkey-only cities", () => {
  assert.equal(shippingAmount(1499), 149);
  assert.equal(shippingAmount(1500), 0);
  assert.equal(shippingAmount(100, { fee: 10, freeFrom: 200 }), 10);
  assert.equal(quoteOrder({ subtotalCents: 10_000, shipping: { fee: 10, freeFrom: 200 } }).shippingCents, 1_000);
  assert.equal(isTurkeyCity("İstanbul"), true);
  assert.equal(isTurkeyCity("istanbul"), true);
  assert.equal(isTurkeyCity("Berlin"), false);
  const bars = code128Bars("0");
  assert.deepEqual(
    bars.slice(0, 6).map((bar) => bar.w),
    [2, 1, 1, 2, 1, 4],
  );
  assert.equal(code128Bars("ab").length, 0);
});

test("cargo key is 20 characters and abroad is rejected", () => {
  const id = "SW-00000000-0000-4000-8000-000000000001";
  assert.equal(cargoKeyFor(id).length, 20);
  assert.equal(invoiceKeyFor(id).length, 20);
  assert.notEqual(cargoKeyFor(id), invoiceKeyFor(id));
  assert.equal(trackingUrl("1234567890").includes("1234567890"), true);
  assert.equal(trackingUrl("bad code"), "");
  const parsed = orderInput.parse({
    id,
    name: "Test Müşteri",
    email: "test@example.invalid",
    phone: "05000000000",
    city: "Berlin",
    district: "Mitte",
    postal: "34000",
    taxNumber: "00000000000",
    address: "Yalnız yerel test adresi",
    note: "",
    pay: "kapida-nakit",
    consent: true,
    expectedTotal: 10,
    items: [{ sku: "test", color: "siyah", qty: 1 }],
  });
  assert.throws(() => priceOrder(parsed, () => ({ name: "Test", colorName: "Siyah", price: 10 })), /Yurt dışı/);
});
