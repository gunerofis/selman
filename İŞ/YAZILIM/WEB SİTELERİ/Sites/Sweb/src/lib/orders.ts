import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_STATUSES, SHIPPING_STATUSES, orderInput } from "./order-input";

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
