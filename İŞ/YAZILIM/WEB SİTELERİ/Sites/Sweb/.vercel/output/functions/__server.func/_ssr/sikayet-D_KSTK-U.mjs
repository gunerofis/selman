import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Input, b as BRAND, n as submitLead, w as Button } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
import { n as Notice, r as fieldBorder, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { n as isEmail, r as isHoneypot } from "./leads-CT49fvvL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sikayet-D_KSTK-U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [fieldErr, setFieldErr] = (0, import_react.useState)({});
	async function onSubmit(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const fd = new FormData(form);
		if (isHoneypot(String(fd.get("trap") ?? ""))) {
			form.reset();
			return;
		}
		const name = String(fd.get("name") ?? "").trim();
		const email = String(fd.get("email") ?? "").trim();
		const message = String(fd.get("message") ?? "").trim();
		const next = {
			name: name.length < 2 ? "Ad soyad en az 2 karakter." : "",
			email: isEmail(email) ? "" : "Geçerli bir e-posta yazın.",
			message: message.length < 8 ? "Mesaj en az 8 karakter." : ""
		};
		setFieldErr(next);
		if (next.name || next.email || next.message) {
			toast.error("Ad, e-posta ve mesajı kontrol edin.");
			return;
		}
		try {
			const result = await submitLead({ data: {
				type: "complaint",
				title: `${name} · Şikayet`,
				email,
				trap: String(fd.get("trap") ?? ""),
				data: {
					contactName: name,
					orderNumber: String(fd.get("order") ?? ""),
					message
				}
			} });
			toast.success(`Şikayetiniz kaydedildi · ${result.reference}`);
			form.reset();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Şikayet kaydedilemedi.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Şikayet",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Önce ",
				BRAND.email,
				". Dönüş ",
				BRAND.reply,
				". Cayma ve ayıp için ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cayma",
					children: "cayma"
				}),
				" ",
				"ve ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/garanti",
					children: "garanti"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sıra" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal space-y-2 pl-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Atölye e-postası veya aşağıdaki form." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Çözülmezse Tüketici Hakem Heyeti." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tüketici mahkemesi için 6502 m. 73/A uyarınca önce arabulucu." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bildirimde ne yazmalı" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 text-sm",
				children: [
					"Sipariş numarası (SW- ile başlar) ve sipariş tarihi",
					"Ürünün stok kodu ve rengi",
					"Sorunun ne olduğu, ne zaman fark edildiği",
					"Varsa fotoğraf veya kargo tutanağı",
					"Beklentiniz: tamir, değişim veya iade"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 bg-taba" }), item]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Süreler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "w-full min-w-[420px] border-collapse text-left text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
						["İlk yanıt", BRAND.reply],
						["Değerlendirme sonucu", "En geç 5 iş günü"],
						["Hakem heyeti başvurusu", "Çözüm gelmezse her zaman açıktır"]
					].map(([a, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-dashed border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "row",
							className: "py-3 pr-4 font-normal text-fg",
							children: a
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							children: b
						})]
					}, a)) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Şikayetiniz ayıplı mala ilişkinse ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/garanti",
					children: "garanti"
				}),
				", cayma hakkına ilişkinse ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cayma",
					children: "cayma"
				}),
				" sayfasındaki süreç işler. Satıcının resmî künye ve iletişim bilgileri: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/satici",
					children: "satıcı bilgileri"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-10 flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6 text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-fg",
						children: "Atölyeye yazın"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Form bildiriminizi doğrudan yönetim paneline kaydeder." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Ad soyad",
						required: true,
						htmlFor: "name",
						error: fieldErr.name,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							name: "name",
							required: true,
							autoComplete: "name",
							className: fieldBorder(fieldErr.name)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "E-posta",
						required: true,
						htmlFor: "email",
						error: fieldErr.email,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							name: "email",
							type: "email",
							required: true,
							autoComplete: "email",
							className: fieldBorder(fieldErr.email)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Sipariş no",
						optional: true,
						htmlFor: "order",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "order",
							name: "order"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Mesaj",
						required: true,
						htmlFor: "message",
						error: fieldErr.message,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "message",
							name: "message",
							required: true,
							minLength: 8,
							rows: 5,
							className: `border bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErr.message ? "border-danger" : "border-border-strong"}`
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Bu alanı boş bırakın", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "trap",
							tabIndex: -1,
							autoComplete: "off"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						children: "Şikayeti gönder"
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
