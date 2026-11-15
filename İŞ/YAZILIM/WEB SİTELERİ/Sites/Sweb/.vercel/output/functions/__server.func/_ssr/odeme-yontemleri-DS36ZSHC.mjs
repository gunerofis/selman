import { i as PAY_METHODS } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as useSiteConfig } from "./router-BRoH_qS_.mjs";
import { b as BRAND, w as Button } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/odeme-yontemleri-DS36ZSHC.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { identity } = useSiteConfig();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Yardım",
		title: "Ödeme yöntemleri",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kart numarası, CVV veya son kullanma tarihi bu sitede toplanmaz. Ödeme adımında seçtiğiniz yöntem sipariş kaydına işlenir; tahsilat teslimde veya havale ile yapılır." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Nasıl işler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-3",
				children: [
					["Sipariş", "Ödeme adımında yöntemi seçip talebi gönderirsiniz."],
					["Onay", "Sipariş numaranız (SW-) ekranda görünür ve e-posta ile iletilir."],
					["Tahsilat", "Kapıda nakit/kart teslimde; havalede dekont sonrası kargoya verilir."],
					["Fatura", "Fatura ürünle birlikte gönderilir; kurumsal fatura için unvan yazın."]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Yöntemler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 grid gap-3",
				children: PAY_METHODS.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-dashed border-border bg-bg-elevated px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl text-fg",
						children: method.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: method.hint
					})]
				}, method.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6",
				children: [
					"Havale seçilirse IBAN ",
					identity.iban || "sipariş onayından sonra e-posta ile",
					" iletilir. Açıklamaya sipariş numarasını yazın. Sitede IBAN uydurulmaz."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Güvenlik" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Site hiçbir aşamada kart bilgisi istemez. Kart bilgisi isteyen bir sayfa veya e-posta ile karşılaşırsanız işlemi durdurun ve ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iletisim",
					children: "bize yazın"
				}),
				". Kapıda kart ödemesinde tahsilat kuryenin POS cihazından yapılır; numara bize iletilmez."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sık sorulanlar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 space-y-3 text-sm",
				children: [
					["Taksit var mı?", "Kapıda kart ödemesinde taksit kuryenin POS cihazına ve bankanıza bağlıdır."],
					["Fiyatlara KDV dahil mi?", "Evet, sitedeki tüm fiyatlar KDV dahildir."],
					["Havale ne kadar sürede geçer?", "Dekont ulaştıktan sonra aynı iş günü siparişe işlenir."],
					["Kurumsal fatura alabilir miyim?", "Evet; sipariş notuna unvan, vergi dairesi ve numarasını yazın."]
				].map(([q, a]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "font-medium text-fg",
					children: q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-0.5",
					children: a
				})] }, q))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Ön bilgi: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/on-bilgilendirme",
					children: "ön bilgilendirme"
				}),
				". Sepet:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sepet",
					children: "sepet"
				}),
				". İade: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iade",
					children: "iade"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/odeme",
				className: "mt-8 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Ödemeye geç" })
			})
		]
	});
}
//#endregion
export { Page as component };
