import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Input, E as formatPrice, b as BRAND, w as Button } from "./router-BRoH_qS_2.mjs";
import { n as Notice, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/siparis-sorgu-CtNzQJ4c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [last, setLast] = (0, import_react.useState)(null);
	const [miss, setMiss] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("sweb-last-order");
			if (raw) setLast(JSON.parse(raw));
		} catch {}
	}, []);
	function onSubmit(e) {
		e.preventDefault();
		const id = q.trim().toLocaleUpperCase("tr");
		if (last?.id && last.id.toLocaleUpperCase("tr") === id) {
			navigate({
				to: "/siparis/$id",
				params: { id: last.id }
			});
			return;
		}
		setMiss(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Yardım"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl sm:text-6xl",
				children: "Sipariş sorgula"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-fg-muted",
				children: [
					"Hesap yok. Özet yalnızca bu tarayıcıda, son gönderilen SW- numarasıyla durur. Başka cihaz veya silinmiş kayıt için ",
					BRAND.email,
					" adresine yazın."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Sunucuda sipariş listesi tutulmaz. Kart tahsilatı da yoktur." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Sipariş no",
						required: true,
						htmlFor: "order",
						hint: "Örnek: SW-…",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "order",
							value: q,
							onChange: (e) => {
								setQ(e.target.value);
								setMiss(false);
							},
							required: true,
							autoComplete: "off",
							placeholder: "SW-"
						})
					}),
					miss ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-danger",
						role: "alert",
						children: [
							"Bu tarayıcıda bu numara yok. ",
							BRAND.email,
							" adresine yazın."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						children: "Özeti aç"
					})
				]
			}),
			last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 border border-dashed border-border bg-bg-elevated p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-fg-muted",
						children: "Bu tarayıcıdaki son kayıt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl",
						children: last.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-fg-muted",
						children: [
							last.name,
							" · ",
							formatPrice(last.total)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/siparis/$id",
						params: { id: last.id },
						className: "mt-4 inline-block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Kayıtlı özeti aç"
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Numarayı bulamıyorsanız"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-2 text-sm text-fg-muted",
					children: [
						"Sipariş onay e-postanızda SW- ile başlayan numarayı arayın.",
						"Siparişi başka bir cihazdan ya da gizli sekmede verdiyseniz kayıt bu tarayıcıda olmaz.",
						`Bulamazsanız ad soyad ve sipariş tarihiyle ${BRAND.email} adresine yazın; ${BRAND.reply} içinde dönülür.`
					].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-fg-subtle",
							children: String(i + 1).padStart(2, "0")
						}), item]
					}, item))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Sipariş durumları"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 space-y-3 text-sm",
					children: [
						["Alındı", "Talep kaydedildi, atölye onayı bekleniyor."],
						["Hazırlanıyor", "Üretim ya da paketleme sürüyor."],
						["Kargoda", "Kargoya verildi; takip numarası e-posta ile gönderildi."],
						["Teslim edildi", "Kargo teslim etti; 14 günlük cayma süresi bu tarihte başlar."]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-medium text-fg",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 text-fg-muted",
						children: v
					})] }, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iletisim",
						className: "text-taba hover:underline",
						children: "İletişim"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teslimat",
						className: "text-taba hover:underline",
						children: "Teslimat"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iade",
						className: "text-taba hover:underline",
						children: "İade"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cayma",
						className: "text-taba hover:underline",
						children: "Cayma"
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
