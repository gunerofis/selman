import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, o as FAQ_RETURN } from "./faq-D2XSa1MZ.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/iade-CQ5AJp7E.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "İade",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mb-8 grid gap-px bg-border sm:grid-cols-3",
				children: [
					["Süre", "14 gün"],
					["Koşul", "Kullanılmamış, etiketli"],
					["Hariç", "Ölçüye göre üretim"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-4 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 text-fg",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Teslimden itibaren 14 gün içinde, kullanılmamış ve etiketli ürünler iade edilir. Kargo hasarı ayrı değerlendirilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"İade için sipariş numarası ve stok kodu ile ",
				BRAND.email,
				" adresine yazın. Onaydan sonra ürün atölye adresine gönderilir. İnceleme sonrası bedel, ödeme yöntemine göre iade edilir."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "İade adımları" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-3",
				children: [
					["Bildirin", `Sipariş numarası (SW-) ve stok kodu ile ${BRAND.email} adresine yazın veya cayma formunu doldurun.`],
					["Onay bekleyin", `${BRAND.reply} içinde iade onayı ve gönderim adresi iletilir.`],
					["Paketleyin", "Ürünü kendi kutusu ve koruyucusuyla, kullanılmamış hâlde paketleyin."],
					["Gönderin", "Onay e-postasındaki adrese kargolayın; kargo takip numarasını iletin."],
					["Bedeli alın", "İnceleme sonrası bedel, en geç 14 gün içinde ödeme yönteminize iade edilir."]
				].map(([k, v], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-dashed border-border bg-bg-elevated px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-fg-subtle",
							children: String(i + 1).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl text-fg",
							children: k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: v
						})
					]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "İade edilemeyenler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 text-sm",
				children: [
					"Ölçüye göre üretilen, kişiye özel kesilen parçalar",
					"Logo baskısı veya isim işlemesi yapılmış ürünler",
					"Kurumsal proje siparişleri",
					"Kullanılmış, çizilmiş veya kokusu geçmiş ürünler"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 bg-taba" }), item]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Bu ürünlerde üretim hatası varsa ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/garanti",
					children: "garanti"
				}),
				" kapsamında değerlendirilir; iade dışı olmaları ayıplı malı kapsamaz."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"İade kargo bedeli ayıplı üründe satıcıya aittir. Anlaşmalı iade taşıyıcısı sitede adı yazılmaz; caymada da kargoyu tüketiciye yüklemeyiz. Bildirim: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cayma",
					children: "cayma"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, { items: FAQ_RETURN })
		]
	});
}
//#endregion
export { Page as component };
