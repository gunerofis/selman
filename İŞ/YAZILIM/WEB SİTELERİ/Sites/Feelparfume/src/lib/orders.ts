import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_STATUSES, SHIPPING_STATUSES, orderInput } from "./order-input";

const quoteInput = z.object({
  items: orderInput.shape.items,
  coupon: z.string().trim().max(40).default(""),
  giftWrap: z.boolean().default(false),
  email: z.string().trim().max(254).default(""),
  discoverySet: z.boolean().default(false),
});

const restockInput = z.object({
  sku: z.string().trim().min(1).max(80),
  ml: z.number().positive().max(1000),
  email: z.string().trim().email().max(254),
});

export const submitOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => orderInput.parse(input))
  .handler(async ({ data }) => {
    const { submitOrderServer } = await import("./orders.server");
    return submitOrderServer(data);
  });

export const getAdminOrders = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminOrdersServer } = await import("./orders.server");
  return getAdminOrdersServer();
});

export const reviewOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: orderInput.shape.id }).parse(input))
  .handler(async ({ data }) => {
    const { reviewOrderServer } = await import("./orders.server");
    return reviewOrderServer(data.id);
  });

export const quoteCheckout = createServerFn({ method: "POST" })
  .validator((input: unknown) => quoteInput.parse(input))
  .handler(async ({ data }) => {
    const { quoteCheckoutServer } = await import("./orders.server");
    return quoteCheckoutServer(data);
  });

export const askRestock = createServerFn({ method: "POST" })
  .validator((input: unknown) => restockInput.parse(input))
  .handler(async ({ data }) => {
    const { saveStockAlert } = await import("./commerce.server");
    const { assertSameSiteRequest } = await import("./auth/isolation.server");
    assertSameSiteRequest();
    return saveStockAlert(data.sku, data.ml, data.email);
  });

const shippingInput = z.object({
  fee: z.number().int().min(0).max(100_000),
  freeFrom: z.number().int().min(0).max(1_000_000),
});

export const saveShippingSettings = createServerFn({ method: "POST" })
  .validator((input: unknown) => shippingInput.parse(input))
  .handler(async ({ data }) => {
    const { saveShippingRule } = await import("./shipping.server");
    return saveShippingRule(data);
  });

export const pullCargoTracking = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: orderInput.shape.id }).parse(input))
  .handler(async ({ data }) => {
    const { pullCargoTracking: pull } = await import("./yurtici.server");
    return pull(data.id);
  });

export const updateAdminOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: orderInput.shape.id,
        status: z.enum(ORDER_STATUSES),
        adminNote: z.string().trim().max(2000),
        paymentStatus: z.enum(PAYMENT_STATUSES),
        shippingStatus: z.enum(SHIPPING_STATUSES),
        carrier: z.string().trim().max(120),
        trackingCode: z.string().trim().max(160),
        invoiceNumber: z.string().trim().max(160),
        refundedAmount: z.number().finite().min(0).max(99_999_999),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { updateAdminOrderServer } = await import("./orders.server");
    return updateAdminOrderServer(data);
  });
