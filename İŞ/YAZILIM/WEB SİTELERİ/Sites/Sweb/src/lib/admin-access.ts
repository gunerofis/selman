import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PERMISSION_MODULES, type PermissionRule } from "./admin-permissions";

export {
  APPROVAL_MODES,
  PERMISSION_MODULES,
  PERMISSION_SCOPES,
  permissionLabel,
} from "./admin-permissions";
export type { ApprovalMode, PermissionRule, PermissionScope } from "./admin-permissions";

const scope = z.enum([
  "none",
  "view_only",
  "own",
  "assigned",
  "category",
  "warehouse",
  "brand",
  "customer_group",
  "sales_channel",
  "all",
]);
const approval = z.enum(["allow", "require_approval", "deny"]);
const rule = z.object({
  permission: z.string().max(100),
  scope,
  scopeValue: z.string().max(120).optional(),
  approval,
});

export const getAdminAccessData = createServerFn({ method: "GET" }).handler(async () => {
  const { getAccessDataServer } = await import("./admin-access.server");
  return getAccessDataServer();
});

export const saveAdminRole = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().trim().min(2).max(80),
        description: z.string().trim().max(240),
        rules: z.array(rule).max(PERMISSION_MODULES.flatMap((x) => x.permissions).length),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { saveRoleServer } = await import("./admin-access.server");
    return saveRoleServer(
      data as { id?: string; name: string; description: string; rules: PermissionRule[] },
    );
  });

export const deleteAdminRole = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { deleteRoleServer } = await import("./admin-access.server");
    return deleteRoleServer(data.id);
  });

export const saveAdminUser = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        username: z
          .string()
          .trim()
          .min(3)
          .max(60)
          .regex(/^[a-zA-Z0-9._-]+$/),
        displayName: z.string().trim().min(2).max(100),
        password: z.string().min(10).max(256).optional().or(z.literal("")),
        roleId: z.string().uuid(),
        active: z.boolean(),
        locked: z.boolean(),
        twoFactorRequired: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { saveUserServer } = await import("./admin-access.server");
    return saveUserServer(data);
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { deleteUserServer } = await import("./admin-access.server");
    return deleteUserServer(data.id);
  });

export const revokeAdminSession = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { revokeSessionServer } = await import("./admin-access.server");
    return revokeSessionServer(data.id);
  });

export const reviewAdminApproval = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["approved", "rejected"]),
        note: z.string().trim().max(500),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { reviewApprovalServer } = await import("./admin-access.server");
    return reviewApprovalServer(data);
  });
