import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerFn } from "./ssr.mjs";
import { n as createSsrRpc } from "./site-config-BWq3LIpj.mjs";
import { f as QtyControl, r as ColorSwatches, y as Route$17 } from "./router-BRoH_qS_.mjs";
import { S as searchProducts, n as COLORS, p as getProduct } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { C as Input, E as formatPrice, T as cn, b as BRAND, i as ProductCard, n as submitLead, w as Button } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, r as FAQ_DESIGN } from "./faq-D2XSa1MZ.mjs";
import { n as Notice, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { r as isHoneypot } from "./leads-CT49fvvL.mjs";
import { t as PrintButton } from "./print-button-BbupOTeB.mjs";
import { t as DimensionPreview } from "./dimension-preview-D5zlfY9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasarla-CeMkLXmI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FORMS = [{
	id: "kapak",
	label: "Saat kutusu",
	hint: "Saat kapasitesi ve kapak biçimine göre."
}, {
	id: "cekmece",
	label: "Mücevher kutusu",
	hint: "Çekmece, bölme ve iç yerleşime göre."
}];
var MATERIALS = [
	"Deri kaplama",
	"Keçe astar",
	"Metal detay",
	"Ahşap gövde"
];
var FEATURES = [
	"Çekmece",
	"Kapak",
	"Ayna",
	"Döner taban",
	"Duvara montaj",
	"Ayarlanır bölme",
	"Kaymaz taban",
	"Logo baskı"
];
var quoteDesign = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("8d307d7291f6aff61cc42507a4a004befd2589a0be07852a6e183cb54f4ffe41"));
function DesignRefs({ refs, onChange }) {
	const inputRef = (0, import_react.useRef)(null);
	const live = (0, import_react.useRef)(refs);
	live.current = refs;
	(0, import_react.useEffect)(() => {
		return () => {
			live.current.forEach((item) => URL.revokeObjectURL(item.url));
		};
	}, []);
	function add(list) {
		if (!list) return;
		const next = [...refs];
		for (const file of [...list]) {
			if (next.length >= 4) {
				toast.error(`En fazla 4 görsel`);
				break;
			}
			if (!file.type.startsWith("image/")) {
				toast.error(`${file.name} görsel değil`);
				continue;
			}
			if (file.size > 5242880) {
				toast.error(`${file.name} 5 MB üstü`);
				continue;
			}
			next.push({
				id: `${file.name}-${file.size}-${file.lastModified}-${next.length}`,
				file,
				url: URL.createObjectURL(file)
			});
		}
		onChange(next);
		if (inputRef.current) inputRef.current.value = "";
	}
	function remove(id) {
		const hit = refs.find((item) => item.id === id);
		if (hit) URL.revokeObjectURL(hit.url);
		onChange(refs.filter((item) => item.id !== id));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-border-strong bg-bg-elevated px-4 py-6 text-center text-sm text-fg-muted hover:border-fg hover:text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/jpeg,image/png,image/webp,image/heic,image/heif",
					multiple: true,
					className: "sr-only",
					onChange: (e) => add(e.target.files)
				}),
				"Masa, çekmece veya eskiz fotoğrafı ekleyin",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-1 font-mono text-xs",
					children: [
						"jpg, png, webp · en fazla ",
						4,
						" · 5 MB"
					]
				})
			]
		}),
		refs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 grid grid-cols-4 gap-2",
			children: refs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "relative border border-dashed border-border bg-bg-wash",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.url,
						alt: "",
						className: "aspect-square w-full object-contain p-1",
						width: 1500,
						height: 1500
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute top-0 right-0 flex size-11 items-center justify-center bg-bg-elevated/90 text-fg-muted hover:text-danger",
						"aria-label": `${item.file.name} kaldır`,
						onClick: () => remove(item.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate px-1 pb-1 font-mono text-xs text-fg-muted",
						children: item.file.name
					})
				]
			}, item.id))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-fg-muted",
			children: "Seçtiğiniz dosyalar cihazınızda kalır; kayıtta dosya adları atölye notuna eklenir."
		})
	] });
}
function DesignPage() {
	const start = Route$17.useSearch();
	const [brief, setBrief] = (0, import_react.useState)(start.istek ?? "");
	const [form, setForm] = (0, import_react.useState)("");
	const [materials, setMaterials] = (0, import_react.useState)(["Deri kaplama"]);
	const [features, setFeatures] = (0, import_react.useState)([]);
	const [color, setColor] = (0, import_react.useState)(start.renk ?? "");
	const [widthMm, setWidthMm] = (0, import_react.useState)(start.en ?? "");
	const [depthMm, setDepthMm] = (0, import_react.useState)(start.boy ?? "");
	const [heightMm, setHeightMm] = (0, import_react.useState)(start.yuk ?? "");
	const [qty, setQty] = (0, import_react.useState)(1);
	const [email, setEmail] = (0, import_react.useState)("");
	const [trap, setTrap] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [refs, setRefs] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (start.en) setWidthMm(start.en);
		if (start.boy) setDepthMm(start.boy);
		if (start.yuk) setHeightMm(start.yuk);
		if (start.renk) setColor(start.renk);
		if (start.istek) setBrief(start.istek);
	}, [
		start.en,
		start.boy,
		start.yuk,
		start.renk,
		start.istek
	]);
	const waiting = (0, import_react.useMemo)(() => [
		"7043",
		"7054",
		"7012",
		"7036"
	].map(getProduct).filter((p) => p != null), []);
	const matches = (0, import_react.useMemo)(() => {
		if (brief.trim().length < 3) return waiting;
		const found = searchProducts(brief, 4).filter((p) => p != null);
		return found.length > 0 ? found : waiting;
	}, [brief, waiting]);
	function toggle(list, value, set) {
		set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
	}
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setQuote(null);
		if (isHoneypot(trap)) {
			setBusy(false);
			return;
		}
		try {
			const result = await quoteDesign({ data: {
				brief,
				form,
				materials,
				features,
				color,
				widthMm: widthMm ? Number(widthMm) : null,
				depthMm: depthMm ? Number(depthMm) : null,
				heightMm: heightMm ? Number(heightMm) : null,
				qty: Math.max(1, qty),
				email,
				trap
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setQuote(result.quote);
			toast.success("Tahmini ölçü ve fiyat çıktı.");
		} catch {
			toast.error("Bağlantı kesildi. Yeniden deneyin.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1100px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Atölye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Tasarımınızı gönderin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm text-fg-muted",
				children: "Aklınızdaki ürünü kendi cümlelerinizle yazın. Çıkan ölçü ve fiyat ilk tahmindir."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/olcu",
					className: "text-sm text-taba hover:underline",
					children: "Ölçü rehberi"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, { children: [
							"İlk fiyat tahmini sitede çıkar. Onaylamak için taslağı ",
							BRAND.email,
							" adresine gönderin."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-fg-muted",
									children: "Fikrinizi Anlatın"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									required: true,
									minLength: 8,
									rows: 4,
									value: brief,
									onChange: (e) => setBrief(e.target.value),
									placeholder: "Çekmeceye oturan, kalem ve kart için üç gözlü tepsi.",
									className: "border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								}),
								start.istek ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-fg-muted",
									children: brief.trim().length < 8 ? "Katalog aramanız taşındı. Cümleye çevirin (en az 8 karakter)." : "Katalog aramanız taslağa taşındı."
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "font-mono text-xs text-fg-muted",
							children: "form"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid gap-2 sm:grid-cols-2",
							children: FORMS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setForm(form === f.label ? "" : f.label),
								className: cn("border px-3 py-3 text-left text-sm", form === f.label ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg hover:border-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: f.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("mt-1 block text-[12px]", form === f.label ? "text-bg-elevated/70" : "text-fg-muted"),
									children: f.hint
								})]
							}, f.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "font-mono text-xs text-fg-muted",
							children: "malzeme"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: MATERIALS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggle(materials, m, setMaterials),
								className: cn("h-11 border px-3 text-sm", materials.includes(m) ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg"),
								children: m
							}, m))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "font-mono text-xs text-fg-muted",
							children: "özellik"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: FEATURES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggle(features, m, setFeatures),
								className: cn("h-11 border px-3 text-sm", features.includes(m) ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg"),
								children: m
							}, m))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "font-mono text-xs text-fg-muted",
								children: "renk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-fg-muted",
								children: "Seçmezseniz forma uygun rengi biz öneririz."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatches, {
										value: color,
										onChange: setColor,
										named: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setColor(""),
										className: cn("mt-2 h-11 border px-3 font-mono text-xs", color === "" ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg"),
										children: "Atölye önerir"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-mono text-xs text-fg-muted",
										children: color ? COLORS.find((c) => c.id === color)?.name : "Renk atölye önerisi"
									})
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Görsel",
							optional: true,
							hint: "Masa, çekmece, eskiz. Mailto ek taşımaz; gönderirken iliştirin.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesignRefs, {
								refs,
								onChange: setRefs
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Ölçü (mm)",
							optional: true,
							hint: "Biliyorsanız 80–900. Boşsa atölye önerir.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "numeric",
										placeholder: "en",
										"aria-label": "En mm",
										value: widthMm,
										onChange: (e) => setWidthMm(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "numeric",
										placeholder: "boy",
										"aria-label": "Boy mm",
										value: depthMm,
										onChange: (e) => setDepthMm(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "numeric",
										placeholder: "yükseklik",
										"aria-label": "Yükseklik mm",
										value: heightMm,
										onChange: (e) => setHeightMm(e.target.value)
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Adet",
								required: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
									value: qty,
									onChange: setQty
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "E-posta",
								required: true,
								htmlFor: "email",
								hint: "Taslak bu adrese gider.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									autoComplete: "email",
									placeholder: "ad@firma.com",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})
							})]
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
								value: trap,
								onChange: (e) => setTrap(e.target.value),
								tabIndex: -1,
								autoComplete: "off"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							disabled: busy,
							children: busy ? "Ölçülüyor…" : "Tasarımı gönder"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex flex-col gap-6",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-dashed border-border bg-bg-elevated p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-fg-muted",
								children: "Beklerken"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-2xl",
								children: "Yakın ürettiklerimiz"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-4",
								children: matches.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
									product: p,
									color: color || void 0
								}, p.sku))
							})
						]
					}) : quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-dashed border-border bg-bg-elevated p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-fg-muted",
								children: "taslak"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-3xl",
								children: quote.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-fg-muted",
								children: quote.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
								className: "mt-5 w-full text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
									["Form", quote.form],
									["Ölçü", `${quote.widthMm} × ${quote.depthMm} × ${quote.heightMm} mm`],
									["Renk", quote.color],
									["Malzeme", quote.materials.join(", ") || "—"],
									["Özellik", quote.features.join(", ") || "—"],
									["Adet", String(quote.qty)],
									["Birim", formatPrice(quote.unitPrice)],
									["Toplam", formatPrice(quote.total)],
									["Teslim", quote.lead]
								].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-dashed border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 text-fg-muted",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 text-right font-mono text-[13px]",
										children: v
									})]
								}, k)) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-fg-muted",
								children: quote.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, { label: "Taslağı yazdır" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										onClick: async () => {
											try {
												const result = await submitLead({ data: {
													type: "design",
													title: quote.name,
													email,
													data: {
														brief,
														form,
														materials: materials.join(", "),
														features: features.join(", "),
														color: quote.color,
														measurements: `${quote.widthMm} × ${quote.depthMm} × ${quote.heightMm} mm`,
														quantity: quote.qty,
														amount: quote.total,
														unitPrice: quote.unitPrice,
														fileNames: refs.map((item) => item.file.name).join(", ")
													}
												} });
												toast.success(`Tasarım talebi atölyeye kaydedildi · ${result.reference}`);
											} catch (error) {
												toast.error(error instanceof Error ? error.message : "Tasarım talebi kaydedilemedi.");
											}
										},
										children: "Taslağı atölyeye gönder"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/kurumsal-teklif",
										search: {
											adet: Math.max(50, quote.qty),
											renk: color || void 0,
											not: `${quote.name} · ${quote.widthMm}×${quote.depthMm}×${quote.heightMm} mm`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											children: "Kurumsal teklif"
										})
									})
								]
							}),
							quote.similar.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-fg-muted",
									children: "Yakın stok"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid gap-4",
									children: quote.similar.map(getProduct).map((p) => p ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.sku) : null)
								})]
							}) : null
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [widthMm || depthMm || heightMm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimensionPreview, {
						widthMm,
						depthMm,
						heightMm,
						color
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-dashed border-border bg-bg-wash p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-fg-muted",
							children: "Nasıl işliyor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-3 space-y-2 text-sm text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Ne istediğinizi anlatın; varsa ölçü fotoğrafı ekleyin." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. İlk fiyat tahmini çıkar; onaydan sonra netleşir." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Beklerken benzer ürettiklerimizi görürsünüz." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4. Onaylarsanız numune 10–15 iş gününde çıkar." })
							]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-dashed border-border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-fg-muted",
								children: "Yapmadıklarımız"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-1.5 text-sm text-fg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Elektrikli veya elektronik parça" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cam ve seramik gövde" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dış mekân ve suya dayanıklı ürün" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tek parçada 900 mm üstü ölçü" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Gıdayla doğrudan temas eden yüzey" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-sm",
								children: [
									"Hazır ürün mü arıyorsunuz?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/koleksiyon",
										className: "text-taba hover:underline",
										children: "Koleksiyona bakın"
									}),
									"."
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, { items: FAQ_DESIGN })
		]
	});
}
//#endregion
export { DesignPage as component };
