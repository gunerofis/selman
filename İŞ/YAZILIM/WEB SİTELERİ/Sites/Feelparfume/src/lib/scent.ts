import { createServerFn } from "@tanstack/react-start";
import { scentInput } from "./scent-input";

export const saveScentResult = createServerFn({ method: "POST" })
  .validator((input: unknown) => scentInput.parse(input))
  .handler(async ({ data }) => {
    const { saveScentResult: save } = await import("./scent.server");
    return save(data);
  });
