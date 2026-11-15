import { getDbSource, getSql } from "./db";
import { LINES, type LineDef } from "./line-items";
import { requirePermission, requireListPermission, logAdminActivity } from "./admin-access.server";
import type {
  AdminAuditEntry,
  AdminCatalogItem,
  BulkStatusInput,
  ProductStatus,
  UpdateAdminProductInput,
} from "./catalog-admin";

export {
  getAdminSessionServer,
  adminLoginServer,
  adminLogoutServer,
  requireAdmin,
} from "./admin-access.server";

type StateRow = {
  product_key: string;
  name_override: string | null;
  price_override: string | null;
  status: ProductStatus;
  updated_at: string;
  seo_title_override: string | null;
  seo_description_override: string | null;
  image_alt_override: string | null;
};

type AuditRow = {
  id: string;
  product_key: string;
  action: string;
  before_state: Record<string, string | number | boolean | null> | null;
  after_state: Record<string, string | number | boolean | null> | null;
  actor: string;
  created_at: string;
};

function baseItems() {
  return LINES.flatMap((line) =>
    line.items.map((item) => ({
      productKey: `${line.key}:${item.id}`,
      lineKey: line.key,
      lineTitle: line.title,
      item,
    })),
  );
}

async function states() {
  const sql = await getSql();
  const rows = await sql<StateRow>`
    select product_key, name_override, price_override, status, updated_at::text,
           seo_title_override, seo_description_override, image_alt_override
    from catalog_product_state
  `;
  return new Map(rows.map((row) => [row.product_key, row]));
}

export async function getPublicLinesServer(): Promise<LineDef[]> {
  // A production build can be previewed before its hosted database is attached.
  // Keep the public catalog available, but leave the write-capable admin panel
  // fail-closed until DATABASE_URL is configured.
  if (process.env.NODE_ENV === "production" && getDbSource() === "pglite") {
    return LINES.map((line) => ({
      ...line,
      description: line.description.replace(/\d+ model/u, `${line.items.length} model`),
    }));
  }
  const state = await states();
  return LINES.map((line) => ({
    ...line,
    items: line.items.flatMap((item) => {
      const override = state.get(`${line.key}:${item.id}`);
      if (override && override.status !== "active") return [];
      const resolvedName = override?.name_override ?? item.name;
      const price =
        override?.price_override == null ? item.price : Number(override.price_override);
      return [
        {
          ...item,
          name: resolvedName,
          alt: override?.image_alt_override ?? override?.name_override ?? item.alt,
          price,
          seoTitle: override?.seo_title_override ?? override?.name_override ?? item.seoTitle ?? item.name,
          seoDescription:
            override?.seo_description_override ?? item.seoDescription ?? `${line.title} · ${resolvedName}`,
          teklifNot: `${line.title} · ${item.code ?? item.id} · ${resolvedName}`,
        },
      ];
    }),
  }));
}

export async function getAdminCatalogServer(): Promise<AdminCatalogItem[]> {
  const { rule } = await requireListPermission("products.view");
  const state = await states();
  return baseItems()
    .filter(({ lineKey }) => rule.scope !== "category" || rule.scopeValue === lineKey)
    .map(({ productKey, lineKey, lineTitle, item }) => {
      const override = state.get(productKey);
      return {
        productKey,
        lineKey,
        lineTitle,
        id: item.id,
        image: item.image,
        baseName: item.name,
        basePrice: item.price,
        name: override?.name_override ?? item.name,
        price: override?.price_override == null ? item.price : Number(override.price_override),
        status: override?.status ?? "active",
        updatedAt: override?.updated_at ?? null,
        seoTitle:
          override?.seo_title_override ?? override?.name_override ?? item.seoTitle ?? item.name,
        seoDescription:
          override?.seo_description_override ??
          item.seoDescription ??
          `${lineTitle} · ${override?.name_override ?? item.name}`,
        imageAlt: override?.image_alt_override ?? override?.name_override ?? item.alt,
      };
    });
}

export async function getAdminAuditServer(): Promise<AdminAuditEntry[]> {
  await requirePermission("logs.view");
  const sql = await getSql();
  const rows = await sql<AuditRow>`
    select id::text, product_key, action, before_state, after_state, actor, created_at::text
    from catalog_admin_audit
    order by created_at desc
    limit 100
  `;
  return rows.map((row) => ({
    id: row.id,
    productKey: row.product_key,
    action: row.action,
    beforeState: row.before_state,
    afterState: row.after_state,
    actor: row.actor,
    createdAt: row.created_at,
  }));
}

export async function updateAdminProductServer(data: UpdateAdminProductInput) {
  const base = baseItems().find((item) => item.productKey === data.productKey);
  if (!base) throw new Error("Ürün bulunamadı.");
  const permissionContext = {
    resourceType: "product",
    resourceId: data.productKey,
    payload: data,
    category: base.lineKey,
  };
  const identity = await requirePermission("products.edit", permissionContext);
  const sql = await getSql();
  const nameOverride = data.name === base.item.name ? null : data.name;
  const priceOverride = data.price === base.item.price ? null : data.price;
  const seoTitleOverride = data.seoTitle === data.name ? null : data.seoTitle;
  const defaultDescription = `${base.lineTitle} · ${data.name}`;
  const seoDescriptionOverride =
    data.seoDescription === defaultDescription ? null : data.seoDescription;
  const imageAltOverride = data.imageAlt === data.name ? null : data.imageAlt;
  const current = (await states()).get(data.productKey);
  if (
    data.price !==
    (current?.price_override == null ? base.item.price : Number(current.price_override))
  )
    await requirePermission("products.change_price", permissionContext);
  if (data.status === "archived") await requirePermission("products.archive", permissionContext);
  else if (data.status !== (current?.status ?? "active"))
    await requirePermission("products.publish", permissionContext);
  if (
    data.seoTitle !== (current?.seo_title_override ?? current?.name_override ?? base.item.name) ||
    data.seoDescription !==
      (current?.seo_description_override ??
        `${base.lineTitle} · ${current?.name_override ?? base.item.name}`) ||
    data.imageAlt !== (current?.image_alt_override ?? current?.name_override ?? base.item.alt)
  )
    await requirePermission("products.edit_seo", permissionContext);
  // One statement keeps the product change and its audit record atomic. This
  // also works over Neon's stateless HTTP driver on Cloudflare Workers.
  await sql`
    with previous as (
      select to_jsonb(catalog_product_state.*) as state
      from catalog_product_state
      where product_key = ${data.productKey}
    ), changed as (
      insert into catalog_product_state (product_key, name_override, price_override, status, seo_title_override, seo_description_override, image_alt_override, updated_by, updated_at)
      values (${data.productKey}, ${nameOverride}, ${priceOverride}, ${data.status}, ${seoTitleOverride}, ${seoDescriptionOverride}, ${imageAltOverride}, ${"admin"}, now())
      on conflict (product_key) do update set
        name_override = excluded.name_override,
        price_override = excluded.price_override,
        status = excluded.status,
        seo_title_override = excluded.seo_title_override,
        seo_description_override = excluded.seo_description_override,
        image_alt_override = excluded.image_alt_override,
        updated_by = excluded.updated_by,
        updated_at = now()
      returning product_key, name_override, price_override, status,
                seo_title_override, seo_description_override, image_alt_override,
                updated_by, updated_at
    )
    insert into catalog_admin_audit (product_key, action, before_state, after_state, actor)
    select changed.product_key,
           ${data.status === "archived" ? "archive" : "update"},
           (select state from previous),
           to_jsonb(changed.*),
           ${"admin"}
    from changed
  `;
  await logAdminActivity(identity, {
    permission: "products.edit",
    action: data.status === "archived" ? "product.archive" : "product.update",
    resourceType: "product",
    resourceId: data.productKey,
    before: current ?? null,
    after: data,
  });
  return { ok: true as const };
}

export async function bulkUpdateAdminProductsServer(data: BulkStatusInput) {
  const identity = await requirePermission("products.bulk_edit", {
    resourceType: "products",
    payload: data,
  });
  const allowed = new Set(baseItems().map((item) => item.productKey));
  const productKeys = [...new Set(data.productKeys)];
  if (productKeys.some((key) => !allowed.has(key))) throw new Error("Ürün bulunamadı.");
  const sql = await getSql();
  await sql`
    with requested(product_key) as (
      select unnest(${productKeys}::text[])
    ), previous as (
      select requested.product_key, to_jsonb(catalog_product_state.*) as state
      from requested
      left join catalog_product_state using (product_key)
    ), changed as (
      insert into catalog_product_state (product_key, name_override, price_override, status, updated_by, updated_at)
      select product_key, null, null, ${data.status}, ${"admin"}, now()
      from requested
      on conflict (product_key) do update set
        status = excluded.status,
        updated_by = excluded.updated_by,
        updated_at = now()
      returning product_key, name_override, price_override, status
    )
    insert into catalog_admin_audit (product_key, action, before_state, after_state, actor)
    select changed.product_key,
           ${`bulk_${data.status}`},
           previous.state,
           to_jsonb(changed.*),
           ${"admin"}
    from changed
    join previous using (product_key)
  `;
  await logAdminActivity(identity, {
    permission: "products.bulk_edit",
    action: `product.bulk_${data.status}`,
    resourceType: "products",
    after: data,
  });
  return { ok: true as const, updated: productKeys.length };
}
