import { i as __toESM } from "../_runtime.mjs";
import { c as isTaxNumber, i as PAY_METHODS, l as isTurkishPhone, o as includedVat, s as isPostalCode } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as ShippingBar, X as useSiteConfig, a as EmptyHint, ct as submitOrder, l as PENDING_PRICE_NOTICE, nt as EtaLine, p as RecentRail } from "./router-BRoH_qS_.mjs";
import { f as getColor, r as PASTEL } from "./products-BOS9FmZC.mjs";
import { C as Input, E as formatPrice, f as cartHasPendingPrice, h as shippingFor, m as cartSubtotal, p as cartLineDisplay, v as useCart, w as Button } from "./router-BRoH_qS_2.mjs";
import { n as Notice, r as fieldBorder, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { t as emailIssue } from "./leads-CT49fvvL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/odeme-Kio1u8NR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DRAFT_KEY = "sweb-checkout-draft";
var ORDER_KEY = "sweb-order-fp";
function readCheckoutDraft() {
	try {
		const raw = sessionStorage.getItem(DRAFT_KEY);
		if (!raw) return {};
		return JSON.parse(raw);
	} catch {
		return {};
	}
}
function writeCheckoutDraft(patch) {
	try {
		const next = {
			...readCheckoutDraft(),
			...patch
		};
		sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
	} catch {}
}
function clearCheckoutDraft() {
	try {
		sessionStorage.removeItem(DRAFT_KEY);
		sessionStorage.removeItem(ORDER_KEY);
	} catch {}
}
function stableOrderId(lines, email, details = "") {
	const fp = `${[...lines].map((l) => `${l.sku}:${l.color}:${l.qty}`).sort().join("|")}|${email.trim().toLocaleLowerCase("tr")}|${details}`;
	try {
		const raw = sessionStorage.getItem(ORDER_KEY);
		if (raw) {
			const prev = JSON.parse(raw);
			if (prev.fp === fp && /^SW-[0-9a-f-]{36}$/i.test(prev.id)) return prev.id;
		}
	} catch {}
	const id = `SW-${crypto.randomUUID()}`;
	try {
		sessionStorage.setItem(ORDER_KEY, JSON.stringify({
			fp,
			id
		}));
	} catch {}
	return id;
}
var CITIES = [
	"Adana",
	"Adıyaman",
	"Afyonkarahisar",
	"Ağrı",
	"Aksaray",
	"Amasya",
	"Ankara",
	"Antalya",
	"Ardahan",
	"Artvin",
	"Aydın",
	"Balıkesir",
	"Bartın",
	"Batman",
	"Bayburt",
	"Bilecik",
	"Bingöl",
	"Bitlis",
	"Bolu",
	"Burdur",
	"Bursa",
	"Çanakkale",
	"Çankırı",
	"Çorum",
	"Denizli",
	"Diyarbakır",
	"Düzce",
	"Edirne",
	"Elazığ",
	"Erzincan",
	"Erzurum",
	"Eskişehir",
	"Gaziantep",
	"Giresun",
	"Gümüşhane",
	"Hakkâri",
	"Hatay",
	"Iğdır",
	"Isparta",
	"İstanbul",
	"İzmir",
	"Kahramanmaraş",
	"Karabük",
	"Karaman",
	"Kars",
	"Kastamonu",
	"Kayseri",
	"Kilis",
	"Kırıkkale",
	"Kırklareli",
	"Kırşehir",
	"Kocaeli",
	"Konya",
	"Kütahya",
	"Malatya",
	"Manisa",
	"Mardin",
	"Mersin",
	"Muğla",
	"Muş",
	"Nevşehir",
	"Niğde",
	"Ordu",
	"Osmaniye",
	"Rize",
	"Sakarya",
	"Samsun",
	"Siirt",
	"Sinop",
	"Sivas",
	"Şanlıurfa",
	"Şırnak",
	"Tekirdağ",
	"Tokat",
	"Trabzon",
	"Tunceli",
	"Uşak",
	"Van",
	"Yalova",
	"Yozgat",
	"Zonguldak"
];
function Checkout() {
	const { identity } = useSiteConfig();
	const navigate = useNavigate();
	const lines = useCart((s) => s.lines);
	const clear = useCart((s) => s.clear);
	const subtotal = cartSubtotal(lines);
	const shipping = shippingFor(subtotal);
	const total = subtotal + shipping;
	const pendingPrice = cartHasPendingPrice(lines);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [pay, setPay] = (0, import_react.useState)("kapida-nakit");
	const [error, setError] = (0, import_react.useState)("");
	const [fieldErr, setFieldErr] = (0, import_react.useState)({});
	const [draft, setDraft] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [gift, setGift] = (0, import_react.useState)(false);
	const [city, setCity] = (0, import_react.useState)("İstanbul");
	(0, import_react.useEffect)(() => {
		const stored = readCheckoutDraft();
		setDraft(stored);
		if (stored.pay && [
			"kapida-nakit",
			"kapida-kart",
			"havale"
		].includes(stored.pay)) setPay(stored.pay);
		if (stored.gift) setGift(true);
		if (stored.city && CITIES.includes(stored.city)) setCity(stored.city);
		setReady(true);
	}, []);
	const items = (0, import_react.useMemo)(() => lines.map((l) => {
		const p = cartLineDisplay(l);
		const c = getColor(l.color);
		if (!p) return null;
		return {
			...l,
			product: p,
			colorName: p.catalog ? p.code : c?.name ?? l.color
		};
	}).filter(Boolean), [lines]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-5xl",
			children: "Sipariş bilgileri"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-fg-muted",
			children: "Sipariş formunuz hazırlanıyor…"
		})]
	});
	if (lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, {
			title: "Ödenecek bir şey yok",
			body: "Sepetiniz boş. Koleksiyondan başlayın.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/koleksiyon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Koleksiyona git" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sepet",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Sepete bak"
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1400px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, { heading: "Son baktıklarınız" })
		})]
	});
	if (pendingPrice) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, {
			title: "Bu sepet için önce teklif gerekiyor",
			body: PENDING_PRICE_NOTICE,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/teklif",
					search: { not: PENDING_PRICE_NOTICE },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Fiyat ve stok teklifi al" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sepet",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Sepeti düzenle"
					})
				})]
			})
		})
	});
	function checkField(name, value) {
		const v = value.trim();
		if (name === "name") return v.length < 2 ? "Ad soyad en az 2 karakter." : "";
		if (name === "email") return emailIssue(v);
		if (name === "phone") return isTurkishPhone(v) ? "" : "Geçerli bir Türkiye telefon numarası girin.";
		if (name === "district") return v.length < 2 ? "İlçe girin." : "";
		if (name === "postal") return !v || isPostalCode(v) ? "" : "Posta kodu 5 haneli olmalı.";
		if (name === "taxNumber") return isTaxNumber(v) ? "" : "Vergi/TC kimlik no 10 veya 11 haneli olmalı.";
		if (name === "address") return v.length < 10 ? "Adres en az 10 karakter." : "";
		return "";
	}
	function onFieldBlur(e) {
		const el = e.currentTarget;
		setFieldErr((s) => ({
			...s,
			[el.name]: checkField(el.name, el.value)
		}));
	}
	function onFieldInput(e) {
		const el = e.currentTarget;
		persistField(el.name, el.value);
		setFieldErr((s) => {
			if (!s[el.name]) return s;
			const next = checkField(el.name, el.value);
			return {
				...s,
				[el.name]: next
			};
		});
	}
	function persistField(name, value) {
		writeCheckoutDraft({ [name]: value });
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (submitting) return;
		setError("");
		const fd = new FormData(e.currentTarget);
		const name = String(fd.get("name") ?? "").trim();
		const email = String(fd.get("email") ?? "").trim();
		const phone = String(fd.get("phone") ?? "").trim();
		const city = String(fd.get("city") ?? "").trim();
		const district = String(fd.get("district") ?? "").trim();
		const postal = String(fd.get("postal") ?? "").trim();
		const taxNumber = String(fd.get("taxNumber") ?? "").trim();
		const address = String(fd.get("address") ?? "").trim();
		const noteRaw = String(fd.get("note") ?? "").trim();
		const asGift = Boolean(fd.get("gift"));
		const giftNote = String(fd.get("giftNote") ?? "").trim();
		const note = [
			asGift ? "Hediye: fiyat fişi pakete konmasın." : "",
			asGift && giftNote ? `Hediye notu: ${giftNote}` : "",
			noteRaw
		].filter(Boolean).join(" ");
		const next = {
			name: checkField("name", name),
			email: checkField("email", email),
			phone: checkField("phone", phone),
			district: checkField("district", district),
			postal: checkField("postal", postal),
			taxNumber: checkField("taxNumber", taxNumber),
			address: checkField("address", address)
		};
		setFieldErr(next);
		const first = [
			"name",
			"email",
			"phone",
			"district",
			"postal",
			"taxNumber",
			"address"
		].find((key) => next[key]);
		if (first) {
			setError("Eksik veya hatalı alanlar işaretli.");
			const el = document.getElementById(first);
			el?.scrollIntoView({ block: "center" });
			el?.focus();
			return;
		}
		if (!city || !CITIES.includes(city)) {
			setError("İl seçin.");
			document.getElementById("city")?.focus();
			return;
		}
		if (!fd.get("onbilgi")) {
			setError("Ön bilgilendirmeyi işaretleyin.");
			return;
		}
		if (!fd.get("kvkk")) {
			setError("KVKK aydınlatmasını işaretleyin.");
			return;
		}
		setSubmitting(true);
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
		const id = stableOrderId(lines, email, JSON.stringify(customer));
		try {
			const receipt = await submitOrder({ data: {
				id,
				...customer,
				consent: true,
				expectedTotal: total,
				items: lines
			} });
			const order = {
				...customer,
				...receipt,
				items: lines,
				received: true
			};
			try {
				localStorage.setItem("sweb-last-order", JSON.stringify(order));
			} catch {}
			clearCheckoutDraft();
			clear();
			await navigate({
				to: "/siparis/$id",
				params: { id: receipt.id }
			});
		} catch {
			setError("Sipariş kaydı tamamlanamadı. Sepetiniz ve formunuz korundu; bağlantınızı kontrol edip yeniden deneyin. Tutar değiştiyse sepeti yenileyin.");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_340px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "flex flex-wrap gap-4 font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-fg",
							children: "1 · Teslimat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2 · Ödeme" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3 · Onay" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Teslimat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Kart numarası bu sitede alınmaz. Sipariş talebiniz kaydedilir ve atölyenin yönetim paneline ulaşır. Üretim ve teslimat ayrıca teyit edilir." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Ad soyad",
					required: true,
					htmlFor: "name",
					error: fieldErr.name,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						name: "name",
						autoComplete: "name",
						minLength: 2,
						required: true,
						className: fieldBorder(fieldErr.name),
						"aria-invalid": Boolean(fieldErr.name),
						"aria-describedby": fieldErr.name ? "name-hata" : void 0,
						defaultValue: draft.name ?? "",
						onBlur: onFieldBlur,
						onInput: onFieldInput
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "E-posta",
					required: true,
					htmlFor: "email",
					hint: "Siparişiniz hakkında size ulaşabilmemiz için.",
					error: fieldErr.email,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						name: "email",
						type: "email",
						autoComplete: "email",
						required: true,
						placeholder: "ad@firma.com",
						defaultValue: draft.email ?? "",
						className: fieldBorder(fieldErr.email),
						"aria-invalid": Boolean(fieldErr.email),
						"aria-describedby": fieldErr.email ? "email-hata" : void 0,
						onBlur: onFieldBlur,
						onInput: onFieldInput
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Telefon",
					required: true,
					htmlFor: "phone",
					hint: "Kargo bu numaradan ulaşır.",
					error: fieldErr.phone,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						name: "phone",
						type: "tel",
						inputMode: "tel",
						autoComplete: "tel",
						pattern: "(?:\\+90|0)?(?:5[0-9]{9}|[234][0-9]{9})",
						title: "Cep veya sabit Türkiye telefon numarası girin",
						required: true,
						placeholder: "05XXXXXXXXX",
						defaultValue: draft.phone ?? "",
						className: fieldBorder(fieldErr.phone),
						"aria-invalid": Boolean(fieldErr.phone),
						"aria-describedby": fieldErr.phone ? "phone-hata" : void 0,
						onBlur: onFieldBlur,
						onInput: onFieldInput
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "İl",
						required: true,
						htmlFor: "city",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "city",
							name: "city",
							required: true,
							value: city,
							onChange: (e) => {
								const next = e.target.value;
								setCity(next);
								persistField("city", next);
							},
							className: "h-11 border border-border-strong bg-bg-elevated px-3 text-sm",
							children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "İlçe",
						required: true,
						htmlFor: "district",
						error: fieldErr.district,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "district",
							name: "district",
							autoComplete: "address-level2",
							required: true,
							minLength: 2,
							defaultValue: draft.district ?? "",
							className: fieldBorder(fieldErr.district),
							"aria-invalid": Boolean(fieldErr.district),
							"aria-describedby": fieldErr.district ? "district-hata" : void 0,
							onBlur: onFieldBlur,
							onInput: onFieldInput
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Posta kodu (isteğe bağlı)",
					htmlFor: "postal",
					hint: "Kargo firması isterse 5 haneli posta kodunuzu yazın.",
					error: fieldErr.postal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "postal",
						name: "postal",
						inputMode: "numeric",
						autoComplete: "postal-code",
						pattern: "[0-9]{5}",
						title: "5 haneli posta kodu",
						placeholder: "34000",
						defaultValue: draft.postal ?? "",
						className: fieldBorder(fieldErr.postal),
						"aria-invalid": Boolean(fieldErr.postal),
						"aria-describedby": fieldErr.postal ? "postal-hata" : void 0,
						onBlur: onFieldBlur,
						onInput: onFieldInput
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Vergi / TC kimlik no",
					required: true,
					htmlFor: "taxNumber",
					hint: "Fatura için: firma vergi no (10 hane) veya TC kimlik no (11 hane).",
					error: fieldErr.taxNumber,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "taxNumber",
						name: "taxNumber",
						inputMode: "numeric",
						required: true,
						pattern: "[0-9]{10,11}",
						title: "10 haneli vergi no veya 11 haneli TC kimlik no",
						placeholder: "Vergi no veya TC kimlik no",
						defaultValue: draft.taxNumber ?? "",
						className: fieldBorder(fieldErr.taxNumber),
						"aria-invalid": Boolean(fieldErr.taxNumber),
						"aria-describedby": fieldErr.taxNumber ? "taxNumber-hata" : void 0,
						onBlur: onFieldBlur,
						onInput: onFieldInput
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Adres",
					required: true,
					htmlFor: "address",
					error: fieldErr.address,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "address",
						name: "address",
						required: true,
						minLength: 10,
						rows: 4,
						autoComplete: "street-address",
						defaultValue: draft.address ?? "",
						className: `border bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErr.address ? "border-danger" : "border-border-strong"}`,
						"aria-invalid": Boolean(fieldErr.address),
						"aria-describedby": fieldErr.address ? "address-hata" : void 0,
						onBlur: onFieldBlur,
						onInput: onFieldInput
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Teslimat notu",
					optional: true,
					htmlFor: "note",
					hint: "Kapıcı, kat, zil — kargoya iletilir.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "note",
						name: "note",
						rows: 2,
						maxLength: 240,
						placeholder: "Kapıcı, kat, zil…",
						defaultValue: draft.note ?? "",
						onInput: (e) => persistField("note", e.currentTarget.value),
						className: "border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						name: "gift",
						checked: gift,
						onChange: (e) => {
							setGift(e.target.checked);
							writeCheckoutDraft({ gift: e.target.checked });
						},
						className: "mt-1 size-4 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Hediye — fiyat fişini pakete koymayın", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-fg-muted",
						children: "Ürün fiyat fişi olmadan hazırlanır. Hediye paketi ücreti yoktur; özel sarma yapılmaz."
					})] })]
				}),
				gift ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Hediye notu (isteğe bağlı)",
					htmlFor: "giftNote",
					hint: "Notunuz sipariş kaydına eklenir.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "giftNote",
						name: "giftNote",
						rows: 2,
						maxLength: 300,
						placeholder: "Hediye notunuzu yazın…",
						defaultValue: draft.giftNote ?? "",
						onInput: (e) => persistField("giftNote", e.currentTarget.value),
						className: "border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-sm",
							children: "Ödeme"
						}),
						PAY_METHODS.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-3 border border-border-strong bg-bg-elevated px-3 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "pay",
								className: "mt-1",
								checked: pay === method.id,
								onChange: () => {
									setPay(method.id);
									writeCheckoutDraft({ pay: method.id });
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [method.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-fg-muted",
								children: method.hint
							})] })]
						}, method.id)),
						pay === "havale" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg-muted",
							children: identity.iban ? `Havale açıklamasına sipariş numarasını yazın. IBAN: ${identity.iban}` : "IBAN sipariş onayından sonra e-posta ile iletilir. Açıklamaya sipariş numarasını yazın."
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						name: "onbilgi",
						required: true,
						className: "mt-1 size-4 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/on-bilgilendirme",
							className: "underline-offset-2 hover:underline",
							children: "Ön bilgilendirmeyi"
						}),
						" ",
						"ve",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mesafeli",
							className: "underline-offset-2 hover:underline",
							children: "mesafeli satışı"
						}),
						" ",
						"okudum."
					] })]
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
						"okudum. Sipariş talebi sunucuda, özeti bu tarayıcıda saklanır."
					] })]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "Bu işlem ödeme almaz; sipariş talebinizi kaydeder. Üretim, teslimat ve tahsilat koşulları atölye onayından sonra kesinleşir."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					disabled: submitting,
					"aria-busy": submitting,
					children: submitting ? "Kaydediliyor…" : `Sipariş talebini oluştur · ${formatPrice(total)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-fg-muted",
					children: "Kart çekilmez. Kayıt tamamlandığında sipariş numaranız gösterilir."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit border border-dashed border-border bg-bg-elevated p-5 lg:sticky",
			style: { top: "calc(var(--nav-h, 4rem) + var(--cookie-h, 0px) + 1rem)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Sipariş"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/sepet",
						className: "text-xs text-taba hover:underline",
						children: "Sepeti düzenle"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: items.map((it) => it ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: it.product.image,
								alt: "",
								className: "size-12 object-contain",
								style: { backgroundColor: PASTEL[it.color] },
								width: 1500,
								height: 1500
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [it.product.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-fg-subtle",
									children: [
										it.colorName,
										" × ",
										it.qty
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: it.product.price == null ? "Fiyat teyidi" : formatPrice(it.product.price * it.qty)
						})]
					}, `${it.sku}-${it.color}`) : null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShippingBar, { subtotal })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-between border-t border-border pt-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kargo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shipping === 0 ? "Ücretsiz" : formatPrice(shipping) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex justify-between text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pendingPrice ? "Bilinen toplam" : "Toplam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatPrice(total)
					})]
				}),
				pendingPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-fg-muted",
					children: PENDING_PRICE_NOTICE
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-fg-muted",
					children: ["KDV dahil ", formatPrice(includedVat(total))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaLine, { className: "mt-3 text-xs text-fg-muted" })
			]
		})]
	});
}
//#endregion
export { Checkout as component };
