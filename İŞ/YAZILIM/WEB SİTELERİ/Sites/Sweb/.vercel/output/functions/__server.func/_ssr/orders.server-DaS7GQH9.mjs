import { f as priceOrder } from "./order-input-C0XROU9h.mjs";
import { n as COLORS, p as getProduct } from "./products-BOS9FmZC.mjs";
import { n as getDbSource, r as getSql, t as assertSameSiteRequest } from "./db-B_lsxeMu.mjs";
import { adminConfigured, logAdminActivity, requireListPermission, requirePermission } from "./admin-access.server-DrHauVYy.mjs";
import { getPublicLinesServer } from "./catalog-admin.server-qad7ApFr.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.server-DaS7GQH9.js
async function orderSql() {
	if (getDbSource() !== "neon") throw new Error("Sipariş kaydı şu anda kullanılamıyor. Sepetiniz korundu.");
	if (!adminConfigured()) throw new Error("Sipariş alımı henüz etkin değil. Sepetiniz korundu.");
	return getSql();
}
function receipt(row) {
	return {
		id: row.id,
		total: Number(row.total_cents) / 100,
		shipping: row.shipping_cents / 100,
		at: row.at
	};
}
async function submitOrderServer(data) {
	assertSameSiteRequest();
	const sql = await orderSql();
	const hash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
	const previous = await sql`select id, request_hash, total_cents, shipping_cents, created_at::text as at from storefront_order_requests where id = ${data.id}`;
	if (previous[0]) {
		if (previous[0].request_hash !== hash) throw new Error("Sipariş bilgileri değişti. Sepeti yeniden kontrol edin.");
		return receipt(previous[0]);
	}
	const publicLines = await getPublicLinesServer();
	const catalogItems = new Map(publicLines.flatMap((line) => line.items.map((item) => [`catalog:${line.key}:${item.id}`, {
		name: item.name,
		price: item.price,
		colorName: item.code ?? item.kind ?? line.title
	}])));
	const priced = priceOrder(data, (sku, color) => {
		const catalogItem = catalogItems.get(sku);
		if (catalogItem) return catalogItem;
		const product = getProduct(sku);
		const selectedColor = COLORS.find((item) => item.id === color);
		return product && selectedColor ? {
			name: product.name,
			price: product.price,
			colorName: selectedColor.name
		} : void 0;
	});
	const { name, email, phone, city, district, postal, taxNumber, address, note, pay } = data;
	const customer = {
		name,
		email,
		phone,
		city,
		district,
		postal,
		taxNumber,
		address,
		note,
		pay
	};
	const row = (await sql`
    insert into storefront_order_requests (id, request_hash, customer, items, total_cents, shipping_cents)
    values (${data.id}, ${hash}, ${JSON.stringify(customer)}::jsonb, ${JSON.stringify(priced.items)}::jsonb, ${priced.total}, ${priced.shipping})
    on conflict (id) do nothing
    returning id, request_hash, total_cents, shipping_cents, created_at::text as at
  `)[0] ?? (await sql`select id, request_hash, total_cents, shipping_cents, created_at::text as at from storefront_order_requests where id = ${data.id}`)[0];
	if (!row || row.request_hash !== hash) throw new Error("Sipariş kaydı doğrulanamadı. Sepetiniz korundu.");
	return receipt(row);
}
async function getAdminOrdersServer() {
	const { rule } = await requireListPermission("orders.view");
	if (!["all", "view_only"].includes(rule.scope)) throw new Error("Sipariş kapsamı için atama alanı henüz tanımlı değil.");
	return (await (await orderSql())`select id, customer, items, total_cents, shipping_cents, status, admin_note,
      payment_status, shipping_status, carrier, tracking_code, invoice_number, refunded_cents,
      created_at::text as at from storefront_order_requests order by created_at desc limit 250`).map((row) => ({
		...receipt(row),
		customer: row.customer,
		items: row.items,
		status: row.status,
		adminNote: row.admin_note ?? "",
		paymentStatus: row.payment_status,
		shippingStatus: row.shipping_status,
		carrier: row.carrier ?? "",
		trackingCode: row.tracking_code ?? "",
		invoiceNumber: row.invoice_number ?? "",
		refundedAmount: Number(row.refunded_cents) / 100
	}));
}
async function reviewOrderServer(id) {
	const identity = await requirePermission("orders.change_status", {
		resourceType: "order",
		resourceId: id,
		payload: { status: "reviewed" }
	});
	await (await orderSql())`update storefront_order_requests set status = 'reviewed', updated_at = now() where id = ${id}`;
	await logAdminActivity(identity, {
		permission: "orders.change_status",
		action: "order.reviewed",
		resourceType: "order",
		resourceId: id,
		after: { status: "reviewed" }
	});
	return { ok: true };
}
async function updateAdminOrderServer(data) {
	const sql = await orderSql();
	const previous = (await sql`select id, customer, items, total_cents, shipping_cents, status, admin_note,
      payment_status, shipping_status, carrier, tracking_code, invoice_number, refunded_cents,
      created_at::text as at from storefront_order_requests where id=${data.id}`)[0];
	if (!previous) throw new Error("Sipariş bulunamadı.");
	const refundedCents = Math.round(data.refundedAmount * 100);
	if (refundedCents > Number(previous.total_cents)) throw new Error("İade tutarı sipariş toplamını aşamaz.");
	const permissions = /* @__PURE__ */ new Set();
	if (data.status !== previous.status) permissions.add(data.status === "cancelled" ? "orders.cancel" : data.status === "completed" ? "orders.complete" : "orders.change_status");
	if (data.adminNote !== (previous.admin_note ?? "")) permissions.add("orders.add_note");
	if (data.paymentStatus !== previous.payment_status) permissions.add("orders.change_payment_status");
	if (data.shippingStatus !== previous.shipping_status) permissions.add("orders.change_shipping_status");
	if (data.carrier !== (previous.carrier ?? "") || data.trackingCode !== (previous.tracking_code ?? "")) permissions.add("orders.add_tracking");
	if (data.invoiceNumber !== (previous.invoice_number ?? "")) permissions.add("orders.create_invoice");
	if (refundedCents !== Number(previous.refunded_cents)) permissions.add("orders.refund");
	if (!permissions.size) permissions.add("orders.edit");
	const permissionList = [...permissions];
	let identity = await requirePermission(permissionList[0], {
		resourceType: "order",
		resourceId: data.id,
		payload: data
	});
	for (const permission of permissionList.slice(1)) identity = await requirePermission(permission, {
		resourceType: "order",
		resourceId: data.id,
		payload: data
	});
	await sql`
    with changed as (
      update storefront_order_requests
      set status = ${data.status}, admin_note = ${data.adminNote || null},
          payment_status = ${data.paymentStatus}, shipping_status = ${data.shippingStatus},
          carrier = ${data.carrier || null}, tracking_code = ${data.trackingCode || null},
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
		after: data
	});
	return { ok: true };
}
//#endregion
export { getAdminOrdersServer, reviewOrderServer, submitOrderServer, updateAdminOrderServer };
