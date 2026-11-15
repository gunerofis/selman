import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Input, b as BRAND, n as submitLead, w as Button } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
import { n as Notice, r as fieldBorder, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { n as isEmail, r as isHoneypot } from "./leads-CT49fvvL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cayma-BpZaq7Eh.js
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
		const order = String(fd.get("order") ?? "").trim();
		const sku = String(fd.get("sku") ?? "").trim();
		const delivered = String(fd.get("delivered") ?? "").trim();
		const message = String(fd.get("message") ?? "").trim();
		const next = {
			name: name.length < 2 ? "Ad soyad en az 2 karakter." : "",
			email: isEmail(email) ? "" : "Geçerli bir e-posta yazın."
		};
		setFieldErr(next);
		if (next.name || next.email) {
			toast.error("Ad ve e-postayı kontrol edin.");
			return;
		}
		try {
			const result = await submitLead({ data: {
				type: "withdrawal",
				title: `${name} · Cayma bildirimi`,
				email,
				trap: String(fd.get("trap") ?? ""),
				data: {
					contactName: name,
					orderNumber: order,
					sku,
					delivered,
					message
				}
			} });
			toast.success(`Bildiriminiz kaydedildi · ${result.reference}`);
			form.reset();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Bildirim kaydedilemedi.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Cayma hakkı",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mb-8 grid gap-px bg-border sm:grid-cols-3",
				children: [
					["Süre", "14 gün"],
					["Gerekçe", "Gerekmez"],
					["Hariç", "Ölçüye göre kesim"]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Malı teslim aldığınız günden itibaren 14 gün içinde herhangi bir gerekçe göstermeden ve cezai şart ödemeden cayabilirsiniz. Sözleşmenin kurulmasından teslimata kadar olan sürede de cayma hakkı kullanılabilir. Bildirim süre dolmadan bu formdan veya ",
				BRAND.email,
				" adresine açık bir yazıyla iletilmelidir."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bildirimden itibaren 14 gün içinde malı geri göndermeniz gerekir. Ön bilgilendirmede iade için bir kargo firması belirtilmemişse herhangi bir kargo firmasıyla yaptığınız iadenin masrafı size yüklenmez. İade adresi, sipariş teyidinde ve satıcı bilgilerinde gösterilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Satıcı, mevzuatta belirlenen başlangıç tarihinden itibaren teslimat giderleri dâhil tahsil edilen ödemeleri 14 gün içinde, kullandığınız ödeme aracına uygun ve masrafsız olarak iade eder. Malı yalnızca niteliğini ve işleyişini anlamak için gerekli ölçüde inceleyebilirsiniz; bunun ötesindeki kullanımdan doğan değer azalması ayrıca hesaplanabilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Özel isteğinize göre ölçülendirilen, isimlendirilen veya standart seçeneklerin ötesinde kişiye özel üretilen mallarda cayma hakkı bulunmaz. Standart renk tercihi tek başına kişiye özel üretim sayılmaz. Ayıplı mala ilişkin yasal haklarınız saklıdır. Ayrıntı:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iade",
					children: "İade"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Ön bilgi: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/on-bilgilendirme",
					children: "ön bilgilendirme"
				}),
				". Sözleşme:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mesafeli",
					children: "mesafeli satış"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-10 flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6 text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-fg",
						children: "Cayma bildirimi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Form bildiriminizi doğrudan yönetim paneline kaydeder ve kayıt numarası oluşturur." }),
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
							"aria-invalid": Boolean(fieldErr.name)
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
							className: fieldBorder(fieldErr.email),
							"aria-invalid": Boolean(fieldErr.email)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Sipariş no",
						optional: true,
						htmlFor: "order",
						hint: "Varsa SW- numarası.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "order",
							name: "order"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Ürün",
						optional: true,
						htmlFor: "sku",
						hint: "Stok kodu veya ad.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sku",
							name: "sku"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Teslim tarihi",
						optional: true,
						htmlFor: "delivered",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "delivered",
							name: "delivered",
							type: "date"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Not",
						optional: true,
						htmlFor: "message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "message",
							name: "message",
							rows: 3,
							className: "border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
						children: "Bildirimi gönder"
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
