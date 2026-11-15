import { createServerFn } from "@tanstack/react-start";
import { batchInput, reviewInput, skuInput } from "./reviews-input";

export const loadReviewIndex = createServerFn({ method: "GET" }).handler(async () => {
  const { loadReviewIndex: load } = await import("./reviews.server");
  return load();
});

export const listProductReviews = createServerFn({ method: "GET" })
  .validator((input: unknown) => skuInput.parse(input))
  .handler(async ({ data }) => {
    const { listProductReviews: list } = await import("./reviews.server");
    return list(data.sku);
  });

export const submitProductReview = createServerFn({ method: "POST" })
  .validator((input: unknown) => reviewInput.parse(input))
  .handler(async ({ data }) => {
    const { submitProductReview: save } = await import("./reviews.server");
    return save(data);
  });

export const lookupBatch = createServerFn({ method: "POST" })
  .validator((input: unknown) => batchInput.parse(input))
  .handler(async ({ data }) => {
    const { lookupBatch: find } = await import("./reviews.server");
    return find(data.batch);
  });

export const loadCardSecure = createServerFn({ method: "GET" }).handler(async () => {
  const { paytrConfigured } = await import("./paytr.server");
  return paytrConfigured();
});
