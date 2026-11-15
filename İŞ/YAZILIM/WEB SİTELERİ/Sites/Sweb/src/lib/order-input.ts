import { z } from "zod";
import { isPostalCode, isTaxNumber, isTurkishPhone, shippingForSubtotal } from "./commerce.ts";

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
  pay: z.enum(["kapida-nakit", "kapida-kart", "havale"]),
  consent: z.literal(true),
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
export type OrderReceipt = { id: string; total: number; shipping: number; at: string };
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
  invoiceNumber: string;
  refundedAmount: number;
};

export function priceOrder(
  input: OrderInput,
  resolve: (
    sku: string,
    color: string,
  ) => { name: string; colorName: string; price: number | null } | undefined,
) {
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
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const shipping = Math.round(shippingForSubtotal(subtotal / 100) * 100);
  const total = subtotal + shipping;
  if (!Number.isSafeInteger(total) || total !== Math.round(input.expectedTotal * 100)) {
    throw new Error("Sepet tutarı değişti. Sepeti yenileyip güncel tutarı kontrol edin.");
  }
  return { items, total, shipping };
}
