import { createHash } from "node:crypto";
import { assertSameSiteRequest } from "./auth/isolation.server";
import {
  adminConfigured,
  logAdminActivity,
  requireListPermission,
  requirePermission,
} from "./admin-access.server";
import { getDbSource, getSql } from "./db";
import { getColor, getProduct, productSizes, replaceCatalog, unitPrice } from "./products";
import { getPublicCatalogServer } from "./catalog-db.server";
import { priceOrder, type AdminOrder, type OrderInput, type OrderReceipt } from "./order-input";
import { getPublicLinesServer } from "./catalog-admin.server";
import {
  applyPaidStock,
  enqueueOrderMail,
  enqueueShippingMail,
  loadCoupon,
  priorOrderCount,
} from "./commerce.server";
import { GIFT_WRAP_CENTS } from "./checkout-pricing";
import { merchantOid } from "./paytr";
import { paytrConfigured, refundPaytrOrder, requestPaytrToken } from "./paytr.server";
import { catalogDiscoveryPrice } from "./discovery";
import { loadSampleCredits } from "./sample-credit.server";
import { readShippingRule } from "./shipping.server";
import { trackingUrl } from "./shipping";
import { assertCouponHolder, istanbulDate } from "./account";
import { openYurticiShipment, yurticiConfigured } from "./yurtici.server";

type Row = {
  id: string;
  request_hash: string;
  total_cents: number;
  shipping_cents: number;
  at: string;
  customer: AdminOrder["customer"];
  items: AdminOrder["items"];
  status: AdminOrder["status"];
  admin_note: string | null;
  payment_status: AdminOrder["paymentStatus"];
  shipping_status: AdminOrder["shippingStatus"];
  carrier: string | null;
  tracking_code: string | null;
  invoice_number: string | null;
  refunded_cents: number;
  coupon_code: string | null;
  discount_cents: number;
  gift_wrap: boolean;
  gift_note: string | null;
  hide_prices: boolean;
  paytr_oid: string | null;
  cargo_key: string | null;
  cargo_job_id: string | null;
};

async function orderSql() {
  if (process.env.NODE_ENV === "production" && getDbSource() !== "neon") {
    throw new Error("Sipariş kaydı şu anda kullanılamıyor. Sepetiniz korundu.");
  }
  if (!adminConfigured()) {
    throw new Error("Sipariş alımı henüz etkin değil. Sepetiniz korundu.");
  }
  return getSql();
}

function receipt(row: Row): OrderReceipt {
  return {
    id: row.id,
    total: Number(row.total_cents) / 100,
    shipping: row.shipping_cents / 100,
    at: row.at,
  };
}

async function pricedOrder(data: OrderInput, checkExpected = true) {
  const catalog = await getPublicCatalogServer();
  replaceCatalog(catalog.products, catalog.stamp);
  const publicLines = await getPublicLinesServer();
  const catalogItems = new Map<string, { name: string; price: number | null; colorName: string }>(
    publicLines.flatMap((line) =>
      line.items.map(
        (item) =>
          [
            `catalog:${line.key}:${item.id}`,
            {
              name: item.name,
              price: item.price,
              colorName: item.code ?? item.kind ?? line.title,
            },
          ] as const,
      ),
    ),
  );
  const coupon = await loadCoupon(data.coupon ?? "");
  assertCouponHolder(coupon, data.email, istanbulDate(Date.now()).iso);
  const priorOrders = coupon?.kind === "first" ? await priorOrderCount(data.email, data.id) : 0;
  const shipping = await readShippingRule();
  const sampleCredits = await loadSampleCredits(data.email, data.id);
  return priceOrder(
    data,
    (sku, color) => {
      const catalogItem = catalogItems.get(sku);
      if (catalogItem) return catalogItem;
      const product = getProduct(sku);
      const price = unitPrice(sku, color);
      const variant = getColor(color);
      const size = product ? productSizes(product).find((item) => item.id === color) : undefined;
      return product && price != null && variant
        ? { name: product.name, price, colorName: variant.name, sample: Boolean(size?.sample) }
        : undefined;
    },
    {
      coupon,
      priorOrders,
      checkExpected,
      shipping,
      sampleCredits,
      discoveryCents: data.discoverySet ? Math.round((catalogDiscoveryPrice() ?? 0) * 100) : undefined,
    },
  );
}

async function maybePaytrToken(
  data: OrderInput,
  priced: {
    total: number;
    shipping: number;
    discount: number;
    giftWrap: number;
    items: { name: string; unitPrice: number; qty: number }[];
  },
  paymentStatus: string,
) {
  if (data.pay !== "kart" || paymentStatus === "paid" || !paytrConfigured()) return undefined;
  try {
    return await requestPaytrToken({
      orderId: data.id,
      email: data.email,
      name: data.name,
      address: `${data.address}, ${data.district}, ${data.city}`,
      phone: data.phone,
      totalCents: priced.total,
      items: priced.items.map((item) => ({
        name: item.name,
        unitCents: item.unitPrice,
        qty: item.qty,
      })),
      shippingCents: priced.shipping,
      giftWrapCents: priced.giftWrap,
      discountCents: priced.discount,
    });
  } catch {
    return undefined;
  }
}

export async function submitOrderServer(data: OrderInput) {
  assertSameSiteRequest();
  if (data.pay === "kart" && !paytrConfigured()) throw new Error("Kart ödemesi kapalı.");
  const sql = await orderSql();
  const hash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
  const previous = await sql<Row>`
    select id, request_hash, items, total_cents, shipping_cents, discount_cents, gift_wrap,
      payment_status, created_at::text as at
    from storefront_order_requests where id = ${data.id}
  `;
  if (previous[0]) {
    if (previous[0].request_hash !== hash)
      throw new Error("Sipariş bilgileri değişti. Sepeti yeniden kontrol edin.");
    const stored = previous[0];
    const paytrToken = await maybePaytrToken(
      data,
      {
        total: Number(stored.total_cents),
        shipping: Number(stored.shipping_cents),
        discount: Number(stored.discount_cents ?? 0),
        giftWrap: stored.gift_wrap ? GIFT_WRAP_CENTS : 0,
        items: stored.items ?? [],
      },
      stored.payment_status,
    );
    return { ...receipt(stored), paytrToken };
  }
  const priced = await pricedOrder(data);
  const { name, email, phone, city, district, postal, taxNumber, address, note, pay } = data;
  const customer = { name, email, phone, city, district, postal, taxNumber, address, note, pay };
  const paytrOid = pay === "kart" ? merchantOid(data.id) : null;
  const inserted = await sql<Row>`
    insert into storefront_order_requests (
      id, request_hash, customer, items, total_cents, shipping_cents,
      coupon_code, discount_cents, gift_wrap, gift_note, hide_prices, paytr_oid
    )
    values (
      ${data.id}, ${hash}, ${JSON.stringify(customer)}::jsonb, ${JSON.stringify(priced.items)}::jsonb,
      ${priced.total}, ${priced.shipping}, ${priced.couponCode}, ${priced.discount},
      ${data.giftWrap}, ${data.giftNote || null}, ${data.hidePrices}, ${paytrOid}
    )
    on conflict (id) do nothing
    returning id, request_hash, total_cents, shipping_cents, payment_status, created_at::text as at
  `;
  const row =
    inserted[0] ??
    (
      await sql<Row>`
        select id, request_hash, total_cents, shipping_cents, payment_status, created_at::text as at
        from storefront_order_requests where id = ${data.id}
      `
    )[0];
  if (!row || row.request_hash !== hash)
    throw new Error("Sipariş kaydı doğrulanamadı. Sepetiniz korundu.");
  if (inserted[0]) await enqueueOrderMail(data.id, email, "alindi");
  const paytrToken = await maybePaytrToken(data, priced, row.payment_status ?? "pending");
  return { ...receipt(row), paytrToken };
}

export async function quoteCheckoutServer(data: {
  items: OrderInput["items"];
  coupon: string;
  giftWrap: boolean;
  email: string;
  discoverySet?: boolean;
}) {
  assertSameSiteRequest();
  try {
    const priced = await pricedOrder({
      id: "SW-00000000-0000-4000-8000-000000000000",
      name: "Teklif",
      email: data.email || "teklif@example.invalid",
      phone: "05000000000",
      city: "İstanbul",
      district: "Merkez",
      postal: "",
      taxNumber: "00000000000",
      address: "Teklif adresi yok",
      note: "",
      pay: "kapida-nakit",
      coupon: data.coupon,
      giftWrap: data.giftWrap,
      giftNote: "",
      hidePrices: false,
      consent: true,
      discoverySet: data.discoverySet,
      expectedTotal: 0,
      items: data.items,
    }, false);
    return {
      ok: true as const,
      subtotal: (priced.total - priced.shipping - priced.giftWrap + priced.discount) / 100,
      discount: (priced.discount - priced.sampleCredit) / 100,
      sampleCredit: priced.sampleCredit / 100,
      shipping: priced.shipping / 100,
      giftWrap: priced.giftWrap / 100,
      total: priced.total / 100,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kupon geçersiz.";
    if (
      message.startsWith("Kupon") ||
      message.startsWith("Sepet") ||
      message.startsWith("Sepette") ||
      message.startsWith("Aynı ürün") ||
      message.startsWith("Keşif")
    ) {
      return { ok: false as const, error: message };
    }
    return { ok: false as const, error: "Kupon geçersiz." };
  }
}

export async function getAdminOrdersServer(): Promise<AdminOrder[]> {
  const { rule } = await requireListPermission("orders.view");
  if (!["all", "view_only"].includes(rule.scope))
    throw new Error("Sipariş kapsamı için atama alanı henüz tanımlı değil.");
  const sql = await orderSql();
  const rows =
    await sql<Row>`select id, customer, items, total_cents, shipping_cents, status, admin_note,
      payment_status, shipping_status, carrier, tracking_code, invoice_number, refunded_cents,
      coupon_code, discount_cents, gift_wrap, gift_note, hide_prices, cargo_key,
      created_at::text as at from storefront_order_requests order by created_at desc limit 250`;
  return rows.map((row) => ({
    ...receipt(row),
    customer: row.customer,
    items: row.items,
    status: row.status,
    adminNote: row.admin_note ?? "",
    paymentStatus: row.payment_status,
    shippingStatus: row.shipping_status,
    carrier: row.carrier ?? "",
    trackingCode: row.tracking_code ?? "",
    cargoKey: row.cargo_key ?? "",
    invoiceNumber: row.invoice_number ?? "",
    refundedAmount: Number(row.refunded_cents) / 100,
    couponCode: row.coupon_code ?? "",
    discount: Number(row.discount_cents ?? 0) / 100,
    giftWrap: Boolean(row.gift_wrap),
    giftNote: row.gift_note ?? "",
    hidePrices: Boolean(row.hide_prices),
  }));
}

export async function reviewOrderServer(id: string) {
  const identity = await requirePermission("orders.change_status", {
    resourceType: "order",
    resourceId: id,
    payload: { status: "reviewed" },
  });
  const sql = await orderSql();
  await sql`update storefront_order_requests set status = 'reviewed', updated_at = now() where id = ${id}`;
  await logAdminActivity(identity, {
    permission: "orders.change_status",
    action: "order.reviewed",
    resourceType: "order",
    resourceId: id,
    after: { status: "reviewed" },
  });
  return { ok: true as const };
}

export async function updateAdminOrderServer(data: {
  id: string;
  status: AdminOrder["status"];
  adminNote: string;
  paymentStatus: AdminOrder["paymentStatus"];
  shippingStatus: AdminOrder["shippingStatus"];
  carrier: string;
  trackingCode: string;
  invoiceNumber: string;
  refundedAmount: number;
}) {
  const sql = await orderSql();
  const previous = (
    await sql<Row>`select id, customer, items, total_cents, shipping_cents, status, admin_note,
      payment_status, shipping_status, carrier, tracking_code, invoice_number, refunded_cents,
      paytr_oid, cargo_key, cargo_job_id, created_at::text as at
      from storefront_order_requests where id=${data.id}`
  )[0];
  if (!previous) throw new Error("Sipariş bulunamadı.");
  const refundedCents = Math.round(data.refundedAmount * 100);
  if (refundedCents > Number(previous.total_cents))
    throw new Error("İade tutarı sipariş toplamını aşamaz.");
  const previousRefund = Number(previous.refunded_cents);
  const permissions = new Set<string>();
  if (data.status !== previous.status)
    permissions.add(
      data.status === "cancelled"
        ? "orders.cancel"
        : data.status === "completed"
          ? "orders.complete"
          : "orders.change_status",
    );
  if (data.adminNote !== (previous.admin_note ?? "")) permissions.add("orders.add_note");
  if (data.paymentStatus !== previous.payment_status)
    permissions.add("orders.change_payment_status");
  if (data.shippingStatus !== previous.shipping_status)
    permissions.add("orders.change_shipping_status");
  if (
    data.carrier !== (previous.carrier ?? "") ||
    data.trackingCode !== (previous.tracking_code ?? "")
  )
    permissions.add("orders.add_tracking");
  if (data.invoiceNumber !== (previous.invoice_number ?? ""))
    permissions.add("orders.create_invoice");
  if (refundedCents !== previousRefund) permissions.add("orders.refund");
  if (!permissions.size) permissions.add("orders.edit");
  const permissionList = [...permissions];
  let identity = await requirePermission(permissionList[0], {
    resourceType: "order",
    resourceId: data.id,
    payload: data,
  });
  for (const permission of permissionList.slice(1))
    identity = await requirePermission(permission, {
      resourceType: "order",
      resourceId: data.id,
      payload: data,
    });
  if (previous.customer.pay === "kart" && refundedCents !== previousRefund) {
    if (refundedCents < previousRefund) throw new Error("İade tutarı düşürülemez.");
    await refundPaytrOrder(
      data.id,
      previous.paytr_oid || merchantOid(data.id),
      refundedCents - previousRefund,
      refundedCents,
    );
  }
  let carrier = data.carrier;
  let trackingCode = data.trackingCode;
  let cargoKey = previous.cargo_key ?? "";
  if (
    data.shippingStatus === "shipped" &&
    previous.shipping_status !== "shipped" &&
    yurticiConfigured()
  ) {
    const opened = await openYurticiShipment({
      orderId: data.id,
      name: previous.customer.name,
      address: previous.customer.address,
      phone: previous.customer.phone,
      city: previous.customer.city,
      town: previous.customer.district,
      email: previous.customer.email,
    });
    carrier = "Yurtiçi";
    trackingCode = opened.docId || trackingCode;
    cargoKey = opened.cargoKey;
  }
  await sql`
    with changed as (
      update storefront_order_requests
      set status = ${data.status}, admin_note = ${data.adminNote || null},
          payment_status = ${data.paymentStatus}, shipping_status = ${data.shippingStatus},
          carrier = ${carrier || null}, tracking_code = ${trackingCode || null},
          invoice_number = ${data.invoiceNumber || null}, refunded_cents = ${refundedCents},
          updated_at = now()
      where id = ${data.id}
      returning *
    )
    insert into catalog_admin_audit (product_key, action, before_state, after_state, actor)
    select ${`order:${data.id}`}, ${`order_${data.status}`},
           ${JSON.stringify(previous)}::jsonb, to_jsonb(changed.*), 'admin'
    from changed
  `;
  await logAdminActivity(identity, {
    permission: permissionList.join(","),
    action: "order.update",
    resourceType: "order",
    resourceId: data.id,
    before: previous,
    after: data,
  });
  if (data.paymentStatus === "paid") await applyPaidStock(data.id);
  await enqueueShippingMail(
    data.id,
    previous.customer.email,
    previous.shipping_status,
    data.shippingStatus,
    trackingUrl(trackingCode),
  );
  return { ok: true as const, carrier, trackingCode, cargoKey };
}
