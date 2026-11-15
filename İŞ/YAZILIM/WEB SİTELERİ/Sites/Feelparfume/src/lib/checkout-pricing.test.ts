import assert from "node:assert/strict";
import test from "node:test";
import { compareAtPrice, quoteOrder, type Coupon } from "./checkout-pricing.ts";
import { orderInput, priceOrder } from "./order-input.ts";

const DAY = 24 * 60 * 60 * 1000;

function coupon(partial: Partial<Coupon> & Pick<Coupon, "kind" | "value">): Coupon {
  return { code: "A", minCents: 0, active: true, ...partial };
}

test("percent, amount, shipping and first-order coupons", () => {
  assert.equal(quoteOrder({ subtotalCents: 10_000, coupon: coupon({ kind: "percent", value: 10 }) }).discountCents, 1_000);
  assert.equal(quoteOrder({ subtotalCents: 10_000, coupon: coupon({ kind: "amount", value: 20_000 }) }).discountCents, 10_000);
  assert.equal(quoteOrder({ subtotalCents: 100_000, coupon: coupon({ kind: "shipping", value: 0 }) }).shippingCents, 0);
  assert.equal(
    quoteOrder({ subtotalCents: 10_000, coupon: coupon({ kind: "first", value: 10 }), priorOrders: 0 }).discountCents,
    1_000,
  );
  assert.throws(
    () => quoteOrder({ subtotalCents: 10_000, coupon: coupon({ kind: "first", value: 10 }), priorOrders: 1 }),
    /ilk sipariş/,
  );
  assert.throws(
    () => quoteOrder({ subtotalCents: 1_000, coupon: coupon({ kind: "percent", value: 10, minCents: 5_000 }) }),
    /tutar/,
  );
});

test("gift wrap is 90 TL and does not invent a compare-at", () => {
  const quoted = quoteOrder({ subtotalCents: 150_000, giftWrap: true });
  assert.equal(quoted.giftWrapCents, 9_000);
  assert.equal(quoted.shippingCents, 0);
  assert.equal(quoted.totalCents, 159_000);
  const now = Date.UTC(2026, 0, 31);
  assert.equal(compareAtPrice(150, [{ price: 150, at: now }]), null);
  assert.equal(
    compareAtPrice(150, [
      { price: 200, at: now - 40 * DAY },
      { price: 180, at: now - 10 * DAY },
      { price: 150, at: now },
    ]),
    180,
  );
  assert.equal(
    compareAtPrice(180, [
      { price: 150, at: now - 10 * DAY },
      { price: 180, at: now },
    ]),
    null,
  );
});

test("server total includes the coupon the client cannot set", () => {
  const input = orderInput.parse({
    id: "SW-00000000-0000-4000-8000-000000000001",
    name: "Test Müşteri",
    email: "test@example.invalid",
    phone: "05000000000",
    city: "İstanbul",
    district: "Test",
    postal: "34000",
    taxNumber: "00000000000",
    address: "Yalnız yerel test adresi",
    note: "",
    pay: "kapida-nakit",
    consent: true,
    expectedTotal: 1350,
    items: [{ sku: "test", color: "50ml", qty: 1 }],
  });
  const priced = priceOrder(input, () => ({ name: "Test", colorName: "50 ml", price: 1500 }), {
    coupon: coupon({ kind: "percent", value: 10 }),
  });
  assert.equal(priced.total, 135_000);
  assert.equal(priced.discount, 15_000);
  assert.throws(
    () => priceOrder({ ...input, expectedTotal: 1500 }, () => ({ name: "Test", colorName: "50 ml", price: 1500 }), {
      coupon: coupon({ kind: "percent", value: 10 }),
    }),
    /tutarı değişti/,
  );
});
