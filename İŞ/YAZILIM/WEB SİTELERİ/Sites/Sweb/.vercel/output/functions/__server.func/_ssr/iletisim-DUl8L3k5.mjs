import { i as __toESM } from "../_runtime.mjs";
import { t as FREE_SHIPPING_FROM } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Input, E as formatPrice, b as BRAND, n as submitLead, w as Button, x as hasBrandValue } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, n as FAQ_CONTACT } from "./faq-D2XSa1MZ.mjs";
import { n as Notice, r as fieldBorder, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { n as isEmail, r as isHoneypot } from "./leads-CT49fvvL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/iletisim-DUl8L3k5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const [fieldErr, setFieldErr] = (0, import_react.useState)({});
	function checkField(name, value) {
		const v = value.trim();
		if (name === "name") return v.length < 2 ? "Ad soyad en az 2 karakter." : "";
		if (name === "email") return isEmail(v) ? "" : "Geçerli bir e-posta yazın.";
		if (name === "message") return v.length < 8 ? "Mesaj en az 8 karakter." : "";
		return "";
	}
	function onFieldBlur(e) {
		const el = e.currentTarget;
		setFieldErr((s) => ({
			...s,
			[el.name]: checkField(el.name, el.value)
		}));
	}
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
			name: checkField("name", name),
			email: checkField("email", email),
			message: checkField("message", message)
		};
		setFieldErr(next);
		const first = [
			"name",
			"email",
			"message"
		].find((key) => next[key]);
		if (first) {
			toast.error("Ad, e-posta ve mesajı kontrol edin.");
			document.getElementById(first)?.focus();
			return;
		}
		try {
			const result = await submitLead({ data: {
				type: "contact",
				title: `${name} · İletişim talebi`,
				email,
				trap: String(fd.get("trap") ?? ""),
				data: {
					contactName: name,
					orderNumber: String(fd.get("order") ?? ""),
					message
				}
			} });
			toast.success(`Talebiniz kaydedildi · ${result.reference}`);
			form.reset();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Talep kaydedilemedi.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-5xl gap-12 px-4 py-14 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: "İletişim"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-5xl sm:text-6xl",
					children: "Atölyeye yazın."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid gap-px bg-border sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg-elevated px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "E-posta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `mailto:${BRAND.email}`,
									className: "text-taba hover:underline",
									children: BRAND.email
								})
							})]
						}),
						hasBrandValue(BRAND.phone) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg-elevated px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "Telefon"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${BRAND.phone}`,
									className: "text-taba hover:underline",
									children: BRAND.phone
								})
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg-elevated px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "Atölye"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2",
								children: BRAND.atelier
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg-elevated px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "Yanıt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2",
								children: BRAND.reply
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg-elevated px-4 py-5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "Kargo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-2",
								children: [formatPrice(FREE_SHIPPING_FROM), " üzeri ücretsiz · 3–5 iş günü"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teslimat",
							className: "hover:text-taba",
							children: "Teslimat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ziyaret",
							className: "hover:text-taba",
							children: "Ziyaret"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/siparis-sorgu",
							className: "hover:text-taba",
							children: "Sipariş sorgula"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sikayet",
							className: "hover:text-taba",
							children: "Şikayet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tasarla",
							className: "hover:text-taba",
							children: "Tasarlayın"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teklif",
							className: "hover:text-taba",
							children: "Ürün teklifi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kurumsal-teklif",
							className: "hover:text-taba",
							children: "Kurumsal teklif"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 border-t border-dashed border-border pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Hangi konu nereye"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-4 space-y-3 text-sm",
						children: [
							["Siparişim nerede", "Sipariş sorgula sayfasından SW- numaranızla bakın."],
							["İade veya değişim", "İade sayfasındaki adımları izleyin; 14 gün içinde geçerlidir."],
							["Ölçüye göre üretim", "Tasarlayın sayfasından ölçü ve fikrinizi gönderin."],
							["50 adet ve üzeri", "Kurumsal teklif sayfasından firma bilgisiyle talep açın."],
							["Ürün fiyatı görünmüyor", "Ürün teklifi sayfasından stok kodunu yazın."],
							["Şikayet", "Şikayet sayfası doğrudan yönetime düşer."]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-0.5 sm:flex-row sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "min-w-44 font-medium text-fg",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg-muted",
								children: v
							})]
						}, k))
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Form talebinizi doğrudan atölye yönetim paneline kaydeder. Size e-posta üzerinden dönüş yapılır." }),
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
							minLength: 2,
							className: fieldBorder(fieldErr.name),
							"aria-invalid": Boolean(fieldErr.name),
							onBlur: onFieldBlur
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "E-posta",
						required: true,
						htmlFor: "email",
						hint: "Dönüş bu adrese gider.",
						error: fieldErr.email,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							name: "email",
							type: "email",
							required: true,
							autoComplete: "email",
							placeholder: "ad@firma.com",
							className: fieldBorder(fieldErr.email),
							"aria-invalid": Boolean(fieldErr.email),
							onBlur: onFieldBlur
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Sipariş no",
						optional: true,
						htmlFor: "order",
						hint: "Varsa tarayıcıdaki SW- numarası.",
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
							className: `border bg-bg-elevated px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErr.message ? "border-danger" : "border-border-strong"}`,
							"aria-invalid": Boolean(fieldErr.message),
							onBlur: onFieldBlur
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "kvkk",
							required: true,
							className: "mt-1 size-4 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/kvkk",
								className: "underline-offset-2 hover:underline",
								children: "KVKK aydınlatmasını"
							}),
							" ",
							"okudum."
						] })]
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
						children: "Mesaj gönder"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, { items: FAQ_CONTACT })
			})
		]
	});
}
//#endregion
export { Contact as component };
