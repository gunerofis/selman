import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type SiteScript = {
  id: string;
  name: string;
  placement: "head" | "body";
  code: string;
  active: boolean;
  updatedAt: string;
};

export const getPublicScripts = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteScript[]> => {
    const { getPublicScriptsServer } = await import("./site-scripts.server");
    return getPublicScriptsServer();
  },
);
export const getAdminScripts = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteScript[]> => {
    const { getAdminScriptsServer } = await import("./site-scripts.server");
    return getAdminScriptsServer();
  },
);
const scriptSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  placement: z.enum(["head", "body"]),
  code: z.string().trim().min(3).max(20_000),
  active: z.boolean(),
});
export type SiteScriptInput = z.infer<typeof scriptSchema>;
export const saveAdminScript = createServerFn({ method: "POST" })
  .validator((input: unknown) => scriptSchema.parse(input))
  .handler(async ({ data }) => {
    const { saveAdminScriptServer } = await import("./site-scripts.server");
    return saveAdminScriptServer(data);
  });
export const deleteAdminScript = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { deleteAdminScriptServer } = await import("./site-scripts.server");
    return deleteAdminScriptServer(data.id);
  });
