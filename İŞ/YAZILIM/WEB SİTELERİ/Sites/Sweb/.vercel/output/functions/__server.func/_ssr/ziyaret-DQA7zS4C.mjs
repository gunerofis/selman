import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as OpenBadge } from "./router-BRoH_qS_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Input, b as BRAND, n as submitLead, w as Button } from "./router-BRoH_qS_2.mjs";
import { n as Notice, t as FormField } from "./demo-notice-CE5NZMKQ.mjs";
import { n as isEmail, r as isHoneypot } from "./leads-CT49fvvL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ziyaret-DQA7zS4C.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
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
		if (name.length < 2 || !isEmail(email)) {
			toast.error("Ad ve e-postayı kontrol edin.");
			return;
		}
		try {
			const result = await submitLead({ data: {
				type: "visit",
				title: `${name} · Atölye ziyareti`,
				email,
				trap: String(fd.get("trap") ?? ""),
				data: {
					contactName: name,
					preferredTime: String(fd.get("when") ?? ""),
					message: String(fd.get("message") ?? "")
				}
			} });
			toast.success(`Randevu talebi kaydedildi · ${result.reference}`);
			form.reset();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Randevu talebi kaydedilemedi.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-5xl gap-12 px-4 py-14 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Atölye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl sm:text-6xl",
				children: "Ziyaret"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-fg-muted",
				children: [BRAND.atelier, ". Ziyaretler, üretim akışını aksatmamak için randevuyla kabul edilir."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenBadge, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-8 grid gap-px bg-border sm:grid-cols-2",
				children: [
					["Yer", `${BRAND.neighborhood}, ${BRAND.district}`],
					["Saat", `Hafta içi ${BRAND.hours}`],
					["Hafta sonu", "Kapalı"],
					["Randevu", "Form ile, plansız ziyaret yok"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-4 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 text-sm",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Ziyarette ne görürsünüz"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2 text-sm text-fg-muted",
					children: [
						"Sekiz deri rengin fiziksel numunesi",
						"İç keçe ve süet örnekleri",
						"Stokta duran modellerin gerçek boyutu",
						"Menteşe, kilit ve kapak mekanizmaları",
						"Logo baskısı örnekleri (gofre, yaldız, serigrafi)"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 bg-taba" }), item]
					}, item))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Gelmeden önce"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-2 text-sm text-fg-muted",
					children: [
						"Formu doldurun; gün ve saat teyidi e-posta ile gelir.",
						"İlgilendiğiniz stok kodlarını nota yazın, hazır bulundurulsun.",
						"Ölçüye göre iş için yerin ölçüsünü ve varsa fotoğrafını getirin.",
						"Atölye üretim alanıdır; kapalı ayakkabı tercih edin."
					].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-fg-subtle",
							children: String(i + 1).padStart(2, "0")
						}), item]
					}, item))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-fg-muted",
				children: [
					"Numune ve renk, randevuda bakılır. Üretim devam ediyor olabilir.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/atolye",
						className: "text-taba hover:underline",
						children: "Atölye"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/palet",
						className: "text-taba hover:underline",
						children: "Palet"
					}),
					"."
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "Randevu iste"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Form randevu talebinizi doğrudan yönetim paneline kaydeder." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Ad soyad",
					required: true,
					htmlFor: "name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						name: "name",
						required: true,
						autoComplete: "name",
						minLength: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "E-posta",
					required: true,
					htmlFor: "email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						name: "email",
						type: "email",
						required: true,
						autoComplete: "email"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Tercih edilen gün",
					optional: true,
					htmlFor: "when",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "when",
						name: "when",
						placeholder: "Hafta içi, öğleden sonra"
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
						className: "border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
					children: "Randevu yaz"
				})
			]
		})]
	});
}
//#endregion
export { Page as component };
