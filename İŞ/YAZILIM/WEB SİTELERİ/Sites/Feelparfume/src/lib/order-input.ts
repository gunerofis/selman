import { z } from "zod";
import { quoteOrder, type Coupon } from "./checkout-pricing.ts";
import { isPostalCode, isTaxNumber, isTurkishPhone } from "./commerce.ts";
import { applySampleCredit } from "./sample-credit.ts";
import { isTurkeyCity, type ShippingRule } from "./shipping.ts";

export const orderInput = z.object({
  id: z.string().regex(/^SW-[0-9a-f-]{36}$/i),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).refine(isTurkishPhone),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  postal: z.string().trim().refine((value) => value === "" || isPostalCode(value)),
  taxNumber: z.string().trim().refine(isTaxNumber),
  address: z.string().trim().min(10).max(600),
  note: z.string().trim().max(1000),
  pay: z.enum(["kapida-nakit", "kapida-kart", "havale", "kart"]),
  coupon: z.string().trim().max(40).default(""),
  giftWrap: z.boolean().default(false),
  giftNote: z.string().trim().max(200).default(""),
  hidePrices: z.boolean().default(false),
  consent: z.literal(true),
  discoverySet: z.boolean().optional(),
  expectedTotal: z.number().finite().min(0).max(99_999_999),
  items: z
    .array(
      z.object({
        sku: z.string().min(1).max(240),
        color: z.string().min(1).max(30),
        qty: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(100),
});

export type OrderInput = z.infer<typeof orderInput>;
export type OrderItem = OrderInput["items"][number] & {
  name: string;
  colorName: string;
  unitPrice: number;
  pricePending?: boolean;
};
export type OrderReceipt = {
  id: string;
  total: number;
  shipping: number;
  at: string;
  paytrToken?: string;
};
export const ORDER_STATUSES = [
  "new",
  "reviewed",
  "confirmed",
  "preparing",
  "shipped",
  "completed",
  "cancelled",
  "archived",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "partially_refunded",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const SHIPPING_STATUSES = [
  "pending",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type ShippingStatus = (typeof SHIPPING_STATUSES)[number];
export type AdminOrder = OrderReceipt & {
  customer: Pick<
    OrderInput,
    | "name"
    | "email"
    | "phone"
    | "city"
    | "district"
    | "postal"
    | "taxNumber"
    | "address"
    | "note"
    | "pay"
  >;
  items: OrderItem[];
  status: OrderStatus;
  adminNote: string;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  carrier: string;
  trackingCode: string;
  cargoKey: string;
  invoiceNumber: string;
  refundedAmount: number;
  couponCode: string;
  discount: number;
  giftWrap: boolean;
  giftNote: string;
  hidePrices: boolean;
};

export function priceOrder(
  input: OrderInput,
  resolve: (
    sku: string,
    color: string,
  ) => { name: string; colorName: string; price: number | null; sample?: boolean } | undefined,
  ctx: {
    coupon?: Coupon | null;
    priorOrders?: number;
    checkExpected?: boolean;
    shipping?: ShippingRule;
    sampleCredits?: Record<string, number>;
    discoveryCents?: number | null;
  } = {},
) {
  if (!isTurkeyCity(input.city)) throw new Error("Yurt dışı gönderim kapalı.");
  const seen = new Set<string>();
  const items = input.items.map((item) => {
    const key = `${item.sku}:${item.color}`;
    if (seen.has(key))
      throw new Error("Aynı ürün ve renk sepette tekrar ediyor. Sepeti yeniden düzenleyin.");
    seen.add(key);
    const product = resolve(item.sku, item.color);
    if (
      !product ||
      (product.price != null && (!Number.isFinite(product.price) || product.price <= 0))
    ) {
      throw new Error("Sepette artık sipariş verilemeyen bir ürün veya renk var.");
    }
    return {
      ...item,
      name: product.name,
      colorName: product.colorName,
      unitPrice: product.price == null ? 0 : Math.round(product.price * 100),
      pricePending: product.price == null || undefined,
      sample: product.sample,
    };
  });
  if (input.discoverySet) {
    if (items.length !== 5 || items.some((item) => item.qty !== 1 || !item.sample)) {
      throw new Error("Keşif seti 5 deneme boyudur.");
    }
    const fixed = ctx.discoveryCents;
    if (!Number.isInteger(fixed) || !fixed || fixed <= 0) throw new Error("Keşif seti kurulamadı.");
    const base = Math.floor(fixed / items.length);
    let left = fixed;
    items.forEach((item, index) => {
      const share = index === items.length - 1 ? left : base;
      item.unitPrice = share;
      left -= share;
    });
  }
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const priced = quoteOrder({
    subtotalCents: subtotal,
    coupon: ctx.coupon ?? null,
    priorOrders: ctx.priorOrders ?? 0,
    giftWrap: input.giftWrap ?? false,
    shipping: ctx.shipping,
  });
  const sampleCredit = applySampleCredit(items, ctx.sampleCredits ?? {}, priced.subtotalCents - priced.discountCents);
  const discount = priced.discountCents + sampleCredit;
  const total = priced.totalCents - sampleCredit;
  if (
    ctx.checkExpected !== false &&
    (!Number.isSafeInteger(total) ||
      total <= 0 ||
      total !== Math.round((input.expectedTotal ?? 0) * 100))
  ) {
    throw new Error("Sepet tutarı değişti. Sepeti yenileyip güncel tutarı kontrol edin.");
  }
  return {
    items,
    total,
    shipping: priced.shippingCents,
    discount,
    sampleCredit,
    giftWrap: priced.giftWrapCents,
    couponCode: priced.couponCode,
  };
}
