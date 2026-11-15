import { randomUUID } from "node:crypto";
import { getSql } from "./db";
import { logAdminActivity, requireAdmin, requirePermission } from "./admin-access.server";
import type {
  AdminRecord,
  AdminRecordModule,
  SaveAdminRecordInput,
} from "./admin-operations";

const ACCESS: Record<
  AdminRecordModule,
  { view: string | string[]; create: string; edit: string; delete: string }
> = {
  quotes: { view: "quotes.view", create: "quotes.create", edit: "quotes.edit", delete: "quotes.delete" },
  custom_production: {
    view: "custom_production.view",
    create: "custom_production.add_technical_note",
    edit: "custom_production.add_technical_note",
    delete: "custom_production.delete",
  },
  customers: { view: "customers.view", create: "customers.create", edit: "customers.edit", delete: "customers.delete" },
  companies: { view: "companies.view", create: "companies.create", edit: "companies.edit", delete: "companies.delete" },
  inventory: { view: "inventory.view", create: "inventory.receive", edit: "inventory.adjust", delete: "inventory.issue" },
  warehouses: { view: "warehouses.view", create: "warehouses.create", edit: "warehouses.edit", delete: "warehouses.delete" },
  production: { view: "production.view", create: "production.create", edit: "production.change_operation", delete: "production.cancel" },
  shipping: { view: "shipping.view", create: "shipping.create", edit: "shipping.add_tracking", delete: "shipping.cancel" },
  pricing: { view: "pricing.view_sale", create: "pricing.change_sale", edit: "pricing.change_sale", delete: "pricing.bulk_update" },
  discounts: { view: "discounts.view", create: "discounts.create_code", edit: "discounts.edit", delete: "discounts.delete" },
  blog: { view: "blog.view", create: "blog.create", edit: "blog.edit", delete: "blog.delete" },
  reviews: { view: "reviews.view", create: "reviews.reply", edit: "reviews.approve", delete: "reviews.delete" },
  forms: { view: ["forms.view_contact", "forms.view_quotes", "forms.view_complaints", "forms.view_design"], create: "forms.assign_staff", edit: "forms.change_status", delete: "forms.delete" },
  newsletter: { view: "newsletter.view_subscribers", create: "newsletter.add_subscriber", edit: "newsletter.create_campaign", delete: "newsletter.delete_subscriber" },
  finance: { view: "finance.view_revenue", create: "finance.record_payment", edit: "finance.view_collections", delete: "finance.refund" },
  payment_settings: { view: "payment_settings.view", create: "payment_settings.change_provider", edit: "payment_settings.change_provider", delete: "payment_settings.change_provider" },
  delivery_settings: { view: "delivery_settings.manage_carriers", create: "delivery_settings.manage_carriers", edit: "delivery_settings.change_fee", delete: "delivery_settings.manage_carriers" },
  tax: { view: "tax.view_rates", create: "tax.change_rates", edit: "tax.change_rates", delete: "tax.change_rates" },
  domain: { view: "domain.view", create: "domain.add", edit: "domain.change", delete: "domain.manage_redirect" },
  integrations: { view: "integrations.view", create: "integrations.add", edit: "integrations.edit", delete: "integrations.delete" },
  pixels: { view: "pixels.view", create: "pixels.add", edit: "pixels.edit", delete: "pixels.delete" },
  media: { view: "media.view", create: "media.upload", edit: "media.edit", delete: "media.delete" },
};

function viewPermissions(module: AdminRecordModule) {
  const value = ACCESS[module].view;
  return Array.isArray(value) ? value : [value];
}

type Row = {
  id: string;
  module: AdminRecordModule;
  title: string;
  reference: string | null;
  status: string;
  data: Record<string, AdminRecord["data"][string]>;
  owner_id: string | null;
  assigned_id: string | null;
  category: string | null;
  warehouse: string | null;
  brand: string | null;
  customer_group: string | null;
  sales_channel: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: Row): AdminRecord {
  return {
    id: row.id,
    module: row.module,
    title: row.title,
    reference: row.reference,
    status: row.status,
    data: row.data ?? {},
    ownerId: row.owner_id,
    assignedId: row.assigned_id,
    category: row.category,
    warehouse: row.warehouse,
    brand: row.brand,
    customerGroup: row.customer_group,
    salesChannel: row.sales_channel,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function can(identity: Awaited<ReturnType<typeof requireAdmin>>, permission: string) {
  return identity.isOwner || identity.permissions.includes(permission);
}

function sanitizeRow(row: Row, identity: Awaited<ReturnType<typeof requireAdmin>>) {
  const data = { ...(row.data ?? {}) };
  if (row.module === "customers") {
    if (!can(identity, "customers.view_email")) delete data.email;
    if (!can(identity, "customers.view_phone")) delete data.phone;
    if (!can(identity, "customers.view_address")) delete data.address;
  }
  if (row.module === "companies") {
    if (!can(identity, "companies.manage_tax")) {
      delete data.taxOffice;
      delete data.taxNumber;
    }
    if (!can(identity, "companies.manage_billing")) delete data.billingAddress;
  }
  if (row.module === "pricing" && !can(identity, "pricing.view_cost")) delete data.cost;
  if (row.module === "finance" && !can(identity, "finance.view_cost")) delete data.cost;
  return mapRow({ ...row, data });
}

function formViewPermission(row: Row) {
  const type = String(row.data?.formType ?? "contact");
  if (type === "complaint") return "forms.view_complaints";
  if (type === "design") return "forms.view_design";
  if (type === "quote") return "forms.view_quotes";
  return "forms.view_contact";
}

function inScope(
  row: Row,
  identity: Awaited<ReturnType<typeof requireAdmin>>,
  scope: string,
  scopeValue?: string,
) {
  if (identity.isOwner || scope === "all" || scope === "view_only") return true;
  if (scope === "own") return row.owner_id === identity.id;
  if (scope === "assigned") return row.assigned_id === identity.id;
  const value = scopeValue ?? "";
  if (scope === "category") return row.category === value;
  if (scope === "warehouse") return row.warehouse === value;
  if (scope === "brand") return row.brand === value;
  if (scope === "customer_group") return row.customer_group === value;
  if (scope === "sales_channel") return row.sales_channel === value;
  return false;
}

export async function getAdminOperationsServer() {
  const identity = await requireAdmin();
  const allowed = new Map(
    (identity.isOwner
      ? Object.entries(ACCESS).map(([module]) => [module, { permission: viewPermissions(module as AdminRecordModule)[0], scope: "all" }])
      : identity.rules
          .filter((rule) => rule.approval !== "deny" && rule.scope !== "none")
          .map((rule) => {
            const module = (Object.keys(ACCESS) as AdminRecordModule[]).find((key) =>
              viewPermissions(key).includes(rule.permission),
            );
            return module ? [module, rule] : null;
          })
          .filter(Boolean)) as Array<[AdminRecordModule, { permission: string; scope: string; scopeValue?: string }]>,
  );
  if (!allowed.size) return [];
  const sql = await getSql();
  const rows = await sql<Row>`
    select id::text,module,title,reference,status,data,owner_id::text,assigned_id::text,
      category,warehouse,brand,customer_group,sales_channel,created_at::text,updated_at::text
    from admin_records order by updated_at desc limit 2000
  `;
  return rows
    .filter((row) => {
      const rule = allowed.get(row.module);
      return (
        rule &&
        inScope(row, identity, rule.scope, rule.scopeValue) &&
        (row.module !== "forms" || can(identity, formViewPermission(row)))
      );
    })
    .map((row) => sanitizeRow(row, identity));
}

function changed(old: Row | undefined, data: SaveAdminRecordInput, key: string) {
  return (old?.data?.[key] ?? null) !== (data.data[key] ?? null);
}

async function requireDetailedPermissions(
  old: Row | undefined,
  data: SaveAdminRecordInput,
  context: Parameters<typeof requirePermission>[1],
) {
  const checks: Array<[boolean, string]> = [];
  if (data.module === "quotes") {
    checks.push(
      [changed(old, data, "amount"), "quotes.set_price"],
      [changed(old, data, "discount"), "quotes.discount"],
      [changed(old, data, "quantity"), "quotes.change_quantity"],
      [Boolean(old && old.status !== data.status), "quotes.change_status"],
      [data.status === "approved" && old?.status !== "approved", "quotes.approve"],
      [data.status === "converted" && old?.status !== "converted", "quotes.convert_to_order"],
    );
  } else if (data.module === "custom_production") {
    checks.push(
      [changed(old, data, "measurements"), "custom_production.add_measurement"],
      [changed(old, data, "technicalNote"), "custom_production.add_technical_note"],
      [changed(old, data, "amount"), "custom_production.set_price"],
      [changed(old, data, "dueDate"), "custom_production.set_due_date"],
      [data.status === "sample" && old?.status !== "sample", "custom_production.change_sample_status"],
      [
        ["in_production", "completed"].includes(data.status) && old?.status !== data.status,
        "custom_production.change_production_status",
      ],
      [data.status === "closed" && old?.status !== "closed", "custom_production.close"],
    );
  } else if (data.module === "customers") {
    checks.push(
      [changed(old, data, "address"), "customers.change_address"],
      [changed(old, data, "notes"), "customers.add_note"],
      [changed(old, data, "tags"), "customers.add_tag"],
      [changed(old, data, "group"), "customers.change_group"],
    );
  } else if (data.module === "companies") {
    checks.push(
      [changed(old, data, "taxOffice") || changed(old, data, "taxNumber"), "companies.manage_tax"],
      [changed(old, data, "billingAddress"), "companies.manage_billing"],
      [changed(old, data, "discount"), "companies.set_discount"],
      [changed(old, data, "paymentTerm"), "companies.set_payment_term"],
    );
  } else if (data.module === "inventory") {
    checks.push(
      [changed(old, data, "quantity"), "inventory.adjust"],
      [changed(old, data, "minimum"), "inventory.set_minimum"],
    );
  } else if (data.module === "production") {
    checks.push(
      [changed(old, data, "quantity"), "production.change_quantity"],
      [changed(old, data, "operation"), "production.change_operation"],
      [changed(old, data, "staff") || old?.assigned_id !== data.assignedId, "production.assign_staff"],
      [changed(old, data, "dueDate"), "production.change_due_date"],
      [changed(old, data, "waste"), "production.record_waste"],
      [data.status === "in_production" && old?.status !== "in_production", "production.start"],
      [data.status === "completed" && old?.status !== "completed", "production.complete"],
      [data.status === "cancelled" && old?.status !== "cancelled", "production.cancel"],
    );
  } else if (data.module === "shipping") {
    checks.push(
      [changed(old, data, "carrier"), "shipping.select_carrier"],
      [changed(old, data, "tracking"), "shipping.add_tracking"],
      [data.status === "shipped" && old?.status !== "shipped", "shipping.mark_shipped"],
      [data.status === "delivered" && old?.status !== "delivered", "shipping.mark_delivered"],
      [data.status === "cancelled" && old?.status !== "cancelled", "shipping.cancel"],
    );
  } else if (data.module === "pricing") {
    checks.push(
      [changed(old, data, "salePrice"), "pricing.change_sale"],
      [changed(old, data, "cost"), "pricing.change_cost"],
      [changed(old, data, "wholesale"), "pricing.change_wholesale"],
      [changed(old, data, "corporate"), "pricing.change_corporate"],
      [changed(old, data, "campaign"), "pricing.change_campaign"],
    );
  } else if (data.module === "discounts") {
    checks.push([data.status === "inactive" && old?.status !== "inactive", "discounts.disable"]);
  } else if (data.module === "blog") {
    checks.push(
      [changed(old, data, "seoTitle") || changed(old, data, "seoDescription"), "blog.edit_seo"],
      [data.status === "published" && old?.status !== "published", "blog.publish"],
    );
  } else if (data.module === "reviews") {
    checks.push(
      [changed(old, data, "reply"), "reviews.reply"],
      [data.status === "approved" && old?.status !== "approved", "reviews.approve"],
      [data.status === "rejected" && old?.status !== "rejected", "reviews.reject"],
    );
  } else if (data.module === "forms") {
    checks.push(
      [Boolean(old && old.status !== data.status), "forms.change_status"],
      [changed(old, data, "internalNote"), "forms.add_note"],
      [old?.assigned_id !== data.assignedId, "forms.assign_staff"],
    );
  } else if (data.module === "newsletter") {
    checks.push([data.status === "sent" && old?.status !== "sent", "newsletter.send_campaign"]);
  }
  for (const [needed, permission] of checks) {
    if (needed) await requirePermission(permission, context);
  }
}

export async function saveAdminRecordServer(data: SaveAdminRecordInput) {
  const sql = await getSql();
  const oldRows = data.id
    ? await sql<Row>`select id::text,module,title,reference,status,data,owner_id::text,assigned_id::text,category,warehouse,brand,customer_group,sales_channel,created_at::text,updated_at::text from admin_records where id=${data.id}::uuid`
    : [];
  const old = oldRows[0];
  if (data.id && (!old || old.module !== data.module)) throw new Error("Kayıt bulunamadı.");
  const permission = data.id ? ACCESS[data.module].edit : ACCESS[data.module].create;
  const context = {
    resourceType: data.module,
    resourceId: data.id,
    payload: data,
    ownerId: old?.owner_id ?? undefined,
    assignedId: data.assignedId ?? old?.assigned_id ?? undefined,
    category: data.category || old?.category || undefined,
    warehouse: data.warehouse || old?.warehouse || undefined,
    brand: data.brand || old?.brand || undefined,
    customerGroup: data.customerGroup || old?.customer_group || undefined,
    salesChannel: data.salesChannel || old?.sales_channel || undefined,
  };
  const identity = await requirePermission(permission, context);
  await requireDetailedPermissions(old, data, context);
  const id = data.id ?? randomUUID();
  const reference = data.reference || null;
  if (old) {
    await sql`
      update admin_records set title=${data.title},reference=${reference},status=${data.status},
        data=${JSON.stringify(data.data)}::jsonb,assigned_id=${data.assignedId ?? null}::uuid,
        category=${data.category || null},warehouse=${data.warehouse || null},brand=${data.brand || null},
        customer_group=${data.customerGroup || null},sales_channel=${data.salesChannel || null},
        updated_by=${identity.id}::uuid,updated_at=now() where id=${id}::uuid
    `;
  } else {
    await sql`
      insert into admin_records
        (id,module,title,reference,status,data,owner_id,assigned_id,category,warehouse,brand,customer_group,sales_channel,created_by,updated_by)
      values (${id}::uuid,${data.module},${data.title},${reference},${data.status},${JSON.stringify(data.data)}::jsonb,
        ${identity.id}::uuid,${data.assignedId ?? null}::uuid,${data.category || null},${data.warehouse || null},
        ${data.brand || null},${data.customerGroup || null},${data.salesChannel || null},${identity.id}::uuid,${identity.id}::uuid)
    `;
  }
  await logAdminActivity(identity, {
    permission,
    action: `${data.module}.${old ? "update" : "create"}`,
    resourceType: data.module,
    resourceId: id,
    before: old ? mapRow(old) : undefined,
    after: { ...data, id },
  });
  return { ok: true as const, id };
}

export async function deleteAdminRecordServer(data: { id: string; module: AdminRecordModule }) {
  const sql = await getSql();
  const rows = await sql<Row>`select id::text,module,title,reference,status,data,owner_id::text,assigned_id::text,category,warehouse,brand,customer_group,sales_channel,created_at::text,updated_at::text from admin_records where id=${data.id}::uuid and module=${data.module}`;
  const old = rows[0];
  if (!old) throw new Error("Kayıt bulunamadı.");
  const permission = ACCESS[data.module].delete;
  const identity = await requirePermission(permission, {
    resourceType: data.module,
    resourceId: data.id,
    payload: data,
    ownerId: old.owner_id ?? undefined,
    assignedId: old.assigned_id ?? undefined,
    category: old.category ?? undefined,
    warehouse: old.warehouse ?? undefined,
    brand: old.brand ?? undefined,
    customerGroup: old.customer_group ?? undefined,
    salesChannel: old.sales_channel ?? undefined,
  });
  await sql`delete from admin_records where id=${data.id}::uuid`;
  await logAdminActivity(identity, {
    permission,
    action: `${data.module}.delete`,
    resourceType: data.module,
    resourceId: data.id,
    before: mapRow(old),
  });
  return { ok: true as const };
}
