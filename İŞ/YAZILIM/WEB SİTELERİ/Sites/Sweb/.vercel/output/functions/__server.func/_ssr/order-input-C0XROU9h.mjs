import { c as object, o as literal, r as array, s as number, t as _enum, u as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-input-C0XROU9h.js
var FREE_SHIPPING_FROM = 1500;
function shippingForSubtotal(subtotal) {
	if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
	return subtotal >= 1500 ? 0 : 149;
}
function includedVat(gross) {
	if (!Number.isFinite(gross) || gross <= 0) return 0;
	return gross - gross / 1.2;
}
function normalizeTurkishMobile(value) {
	return value.trim().replace(/[\s()-]/g, "");
}
function isTurkishPhone(value) {
	return /^(?:\+90|0)?(?:5\d{9}|[234]\d{9})$/.test(normalizeTurkishMobile(value));
}
function isPostalCode(value) {
	return /^\d{5}$/.test(value.trim());
}
function isTaxNumber(value) {
	return /^\d{10,11}$/.test(value.trim());
}
var PAY_METHODS = [
	{
		id: "kapida-nakit",
		label: "Kapıda nakit",
		hint: "Teslimde nakit. Kart sitede alınmaz."
	},
	{
		id: "kapida-kart",
		label: "Kapıda kart",
		hint: "Kuryenin POS'u. Numara sitede yazılmaz."
	},
	{
		id: "havale",
		label: "Havale-EFT",
		hint: "IBAN onay e-postasındadır. Açıklamaya sipariş no."
	}
];
function payLabel(pay) {
	return PAY_METHODS.find((item) => item.id === pay)?.label ?? pay;
}
var orderInput = object({
	id: string().regex(/^SW-[0-9a-f-]{36}$/i),
	name: string().trim().min(2).max(120),
	email: string().trim().email().max(254),
	phone: string().trim().max(30).refine(isTurkishPhone),
	city: string().trim().min(2).max(80),
	district: string().trim().min(2).max(80),
	postal: string().trim().refine((value) => value === "" || isPostalCode(value)),
	taxNumber: string().trim().refine(isTaxNumber),
	address: string().trim().min(10).max(600),
	note: string().trim().max(1e3),
	pay: _enum([
		"kapida-nakit",
		"kapida-kart",
		"havale"
	]),
	consent: literal(true),
	expectedTotal: number().finite().min(0).max(99999999),
	items: array(object({
		sku: string().min(1).max(240),
		color: string().min(1).max(30),
		qty: number().int().min(1).max(100)
	})).min(1).max(100)
});
var ORDER_STATUSES = [
	"new",
	"reviewed",
	"confirmed",
	"preparing",
	"shipped",
	"completed",
	"cancelled",
	"archived"
];
var PAYMENT_STATUSES = [
	"pending",
	"paid",
	"failed",
	"partially_refunded",
	"refunded"
];
var SHIPPING_STATUSES = [
	"pending",
	"preparing",
	"shipped",
	"delivered",
	"cancelled"
];
function priceOrder(input, resolve) {
	const seen = /* @__PURE__ */ new Set();
	const items = input.items.map((item) => {
		const key = `${item.sku}:${item.color}`;
		if (seen.has(key)) throw new Error("Aynı ürün ve renk sepette tekrar ediyor. Sepeti yeniden düzenleyin.");
		seen.add(key);
		const product = resolve(item.sku, item.color);
		if (!product || product.price != null && (!Number.isFinite(product.price) || product.price <= 0)) throw new Error("Sepette artık sipariş verilemeyen bir ürün veya renk var.");
		return {
			...item,
			name: product.name,
			colorName: product.colorName,
			unitPrice: product.price == null ? 0 : Math.round(product.price * 100),
			pricePending: product.price == null || void 0
		};
	});
	const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
	const shipping = Math.round(shippingForSubtotal(subtotal / 100) * 100);
	const total = subtotal + shipping;
	if (!Number.isSafeInteger(total) || total !== Math.round(input.expectedTotal * 100)) throw new Error("Sepet tutarı değişti. Sepeti yenileyip güncel tutarı kontrol edin.");
	return {
		items,
		total,
		shipping
	};
}
//#endregion
export { SHIPPING_STATUSES as a, isTaxNumber as c, payLabel as d, priceOrder as f, PAY_METHODS as i, isTurkishPhone as l, ORDER_STATUSES as n, includedVat as o, shippingForSubtotal as p, PAYMENT_STATUSES as r, isPostalCode as s, FREE_SHIPPING_FROM as t, orderInput as u };
