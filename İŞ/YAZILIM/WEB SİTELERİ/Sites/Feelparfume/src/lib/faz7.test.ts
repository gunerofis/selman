import assert from "node:assert/strict";
import test from "node:test";
import {
  assertCouponHolder,
  birthdayMatch,
  bottleReady,
  istanbulDate,
  pointsFromItems,
  priceDropped,
  validBirth,
} from "./account.ts";

test("points are one per 100 TL of paid merchandise", () => {
  assert.equal(pointsFromItems([{ unitPrice: 10000, qty: 1 }]), 1);
  assert.equal(pointsFromItems([{ unitPrice: 9999, qty: 1 }]), 0);
  assert.equal(pointsFromItems([{ unitPrice: 6000, qty: 1 }, { unitPrice: 6000, qty: 1 }]), 1);
  assert.equal(pointsFromItems([{ unitPrice: "10000", qty: 1 }]), 0);
  assert.equal(pointsFromItems([{ unitPrice: 10000.5, qty: 1 }]), 0);
});

test("birthday follows the Istanbul calendar", () => {
  const lateUtc = Date.parse("2026-09-28T22:30:00Z");
  assert.equal(istanbulDate(lateUtc).iso, "2026-09-29");
  assert.equal(birthdayMatch(9, 29, lateUtc), true);
  assert.equal(birthdayMatch(9, 28, lateUtc), false);
  assert.equal(birthdayMatch(null, null, lateUtc), false);
});

test("bottle, price drop, coupon holder and birth date", () => {
  const day = 90 * 24 * 60 * 60 * 1000;
  assert.equal(bottleReady(0, day), true);
  assert.equal(bottleReady(0, day - 1), false);
  assert.equal(priceDropped(1000, 999), true);
  assert.equal(priceDropped(1000, 1000), false);
  assert.doesNotThrow(() => assertCouponHolder(null, "a@b.c", "2026-09-29"));
  assert.doesNotThrow(() =>
    assertCouponHolder({ ownerEmail: "A@B.C", expiresOn: "2026-09-29" }, "a@b.c", "2026-09-29"),
  );
  assert.throws(
    () => assertCouponHolder({ ownerEmail: "owner@example.invalid" }, "other@example.invalid", "2026-09-29"),
    /Kupon geçersiz/,
  );
  assert.throws(
    () => assertCouponHolder({ expiresOn: "2026-09-28" }, "a@b.c", "2026-09-29"),
    /Kupon geçersiz/,
  );
  assert.equal(validBirth(2, 29), true);
  assert.equal(validBirth(4, 31), false);
  assert.equal(validBirth(null, null), true);
  assert.equal(validBirth(9, null), false);
});
