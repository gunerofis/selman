import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as OpenBadge, f as QtyControl, v as Route$16 } from "./router-BRoH_qS_.mjs";
import { c as featuredProducts, m as getSeries, n as COLORS, p as getProduct } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Input, b as BRAND, i as ProductCard, n as submitLead, w as Button } from "./router-BRoH_qS_2.mjs";
import { a as FAQ_QUOTE, c as FaqList } from "./faq-D2XSa1MZ.mjs";
import { n as Notice, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { n as isEmail, r as isHoneypot } from "./leads-CT49fvvL.mjs";
import { t as PrintButton } from "./print-button-BbupOTeB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teklif-B3EqAhg3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductQuote() {
	const { sku, renk, seri, adet: adetIn, not } = Route$16.useSearch();
	const product = sku ? getProduct(sku) : null;
	const series = getSeries(seri);
	const colorName = renk ? COLORS.find((c) => c.id === renk)?.name : void 0;
	const seed = [
		product ? `${product.sku} · ${product.name}` : "",
		series?.name,
		colorName,
		not
	].filter(Boolean).join(" · ");
	const [adet, setAdet] = (0, import_react.useState)(adetIn ?? 1);
	const featured = featuredProducts().slice(0, 4);
	(0, import_react.useEffect)(() => {
		if (adetIn) setAdet(adetIn);
	}, [adetIn]);
	async function onSubmit(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const fd = new FormData(form);
		if (isHoneypot(String(fd.get("trap") ?? ""))) {
			form.reset();
			return;
		}
		const email = String(fd.get("email") ?? "").trim();
		if (!isEmail(email)) {
			toast.error("Geçerli e-posta girin.");
			return;
		}
		const adSoyad = String(fd.get("ad") ?? "").trim();
		const adetValue = Math.max(1, Number(fd.get("adet") || 1));
		try {
			const result = await submitLead({ data: {
				type: "quote",
				title: `Ürün teklifi · ${adSoyad || email} · ${adetValue} adet`,
				email,
				trap: String(fd.get("trap") ?? ""),
				data: {
					scope: "urun",
					contactName: adSoyad,
					phone: String(fd.get("tel") ?? ""),
					quantity: adetValue,
					product: product ? `${product.sku} · ${product.name}` : "",
					color: colorName ?? "",
					notes: String(fd.get("not") ?? "")
				}
			} });
			toast.success(`Ürün teklifi talebi kaydedildi · ${result.reference}`);
			form.reset();
			setAdet(1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Teklif talebi kaydedilemedi.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Ürün"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl sm:text-6xl",
				children: "Ürün teklifi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-prose text-sm leading-relaxed text-fg-muted",
				children: [
					"Tek parça ve az adetli siparişler içindir: fiyat, ölçü, renk ve teslim süresi",
					" ",
					BRAND.reply,
					" içinde teyit edilir. Adet sınırı yoktur. 50 adet ve üzeri için",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/kurumsal-teklif",
						className: "text-taba hover:underline",
						children: "kurumsal teklif"
					}),
					" ",
					"sayfasını kullanın."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenBadge, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-4",
				children: [
					["Adet sınırı", "Yok"],
					["Dönüş", BRAND.reply],
					["Hazır stok", "3–5 iş günü"],
					["Ölçüye göre", "10–15 iş günü"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-xs text-fg-muted",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 font-display text-2xl",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-12 grid gap-px bg-border sm:grid-cols-3",
				children: [
					["Ne zaman gerekir", "Fiyatı görünmeyen parçalar, ölçü değişikliği veya renk kombinasyonu isteyen siparişler."],
					["Neyi teyit ederiz", "Birim fiyat, dış ölçü, seçtiğiniz renk ve kargoya çıkış tarihi."],
					["Sipariş nasıl olur", "Onayınızdan sonra sipariş kaydı açılır; kart bilgisi sitede alınmaz."]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg-muted",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Talep doğrudan yönetim paneline kaydolur ve atölyeye iletilir." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Ad soyad",
							required: true,
							htmlFor: "ad",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ad",
								name: "ad",
								required: true,
								autoComplete: "name"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "E-posta",
							required: true,
							htmlFor: "email",
							hint: "Teklif bu adrese gider.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								name: "email",
								type: "email",
								required: true,
								autoComplete: "email",
								placeholder: "ad@ornek.com"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Telefon",
							optional: true,
							htmlFor: "tel",
							hint: "Boş bırakılabilir.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "tel",
								name: "tel",
								type: "tel",
								autoComplete: "tel",
								placeholder: "5xx xxx xx xx"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Adet",
							required: true,
							htmlFor: "adet",
							hint: "Tek parça da olabilir.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
									value: adet,
									onChange: setAdet,
									min: 1,
									step: 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "hidden",
									id: "adet",
									name: "adet",
									value: adet
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Ürün ve not",
							required: true,
							htmlFor: "not",
							hint: "Stok kodu, renk, ölçü veya kullanım amacı.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "not",
								name: "not",
								required: true,
								rows: 5,
								defaultValue: seed,
								placeholder: "Stok kodu, renk, ölçü",
								className: "border border-border-strong bg-bg-elevated px-3 py-2 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							}, seed || "empty")
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
							children: "Teklif iste"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, { label: "Sayfayı yazdır" })
					}),
					product ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "Bu parça"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-2xl",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
									product,
									color: renk
								})
							})
						]
					}) : series ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
								children: "Masa seti"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-2xl",
								children: series.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-fg-muted",
								children: series.blurb
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Katalogdan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl",
						children: "Sık istenen parçalar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-6 sm:grid-cols-2",
						children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.sku))
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_QUOTE,
				heading: "Teklif hakkında"
			})
		]
	});
}
//#endregion
export { ProductQuote as component };
