import { shippingForSubtotal } from "./commerce.ts";
import { DEFAULT_SHIPPING, type ShippingRule } from "./shipping.ts";

export const GIFT_WRAP_CENTS = 9000;

export type CouponKind = "percent" | "amount" | "shipping" | "first";

export type Coupon = {
  code: string;
  kind: CouponKind;
  value: number;
  minCents: number;
  active: boolean;
  ownerEmail?: string | null;
  expiresOn?: string | null;
};

export type PricePoint = { price: number; at: number };

const DAY_MS = 24 * 60 * 60 * 1000;

export function quoteOrder(input: {
  subtotalCents: number;
  coupon?: Coupon | null;
  priorOrders?: number;
  giftWrap?: boolean;
  shipping?: ShippingRule;
}) {
  const subtotalCents = Math.max(0, Math.round(input.subtotalCents));
  const coupon = input.coupon?.active ? input.coupon : null;
  let discountCents = 0;
  let freeShip = false;
  if (coupon) {
    if (coupon.minCents > subtotalCents) throw new Error("Kupon bu tutar için geçerli değil.");
    if (coupon.kind === "percent" || coupon.kind === "first") {
      if (coupon.kind === "first" && (input.priorOrders ?? 0) > 0) {
        throw new Error("Kupon yalnızca ilk siparişte geçerlidir.");
      }
      const pct = coupon.value;
      if (!Number.isInteger(pct) || pct < 1 || pct > 100) throw new Error("Kupon geçersiz.");
      discountCents = Math.min(subtotalCents, Math.round((subtotalCents * pct) / 100));
    } else if (coupon.kind === "amount") {
      if (!Number.isInteger(coupon.value) || coupon.value <= 0) throw new Error("Kupon geçersiz.");
      discountCents = Math.min(subtotalCents, coupon.value);
    } else if (coupon.kind === "shipping") {
      freeShip = true;
    } else {
      throw new Error("Kupon geçersiz.");
    }
  }
  const shippingCents = freeShip
    ? 0
    : Math.round(shippingForSubtotal(subtotalCents / 100, input.shipping ?? DEFAULT_SHIPPING) * 100);
  const giftWrapCents = input.giftWrap ? GIFT_WRAP_CENTS : 0;
  const totalCents = subtotalCents - discountCents + shippingCents + giftWrapCents;
  return {
    subtotalCents,
    discountCents,
    shippingCents,
    giftWrapCents,
    totalCents,
    couponCode: coupon && (discountCents > 0 || freeShip) ? coupon.code : null,
  };
}

/** Son 30 günün, güncel fiyattan önceki en düşük fiyatı. Tek kayıtta çizgi yoktur. */
export function compareAtPrice(current: number, history: PricePoint[]) {
  if (history.length < 2 || !Number.isFinite(current)) return null;
  const sorted = [...history].filter((row) => Number.isFinite(row.price) && Number.isFinite(row.at));
  if (sorted.length < 2) return null;
  sorted.sort((a, b) => a.at - b.at);
  const latest = sorted[sorted.length - 1];
  const windowStart = latest.at - 30 * DAY_MS;
  const prior = sorted.filter((row) => row.at >= windowStart && row.at < latest.at);
  if (!prior.length) return null;
  const low = Math.min(...prior.map((row) => row.price));
  return current < low ? low : null;
}
