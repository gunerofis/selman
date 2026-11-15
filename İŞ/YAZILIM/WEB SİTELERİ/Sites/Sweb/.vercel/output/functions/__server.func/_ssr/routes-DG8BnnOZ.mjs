import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Route$56, X as useSiteConfig, at as useCatalogLines, it as useCatalogLine, p as RecentRail, ut as SITE_ORIGIN } from "./router-BRoH_qS_.mjs";
import { B as ArrowRight } from "../_libs/lucide-react.mjs";
import { E as formatPrice, b as BRAND, w as Button } from "./router-BRoH_qS_2.mjs";
import { t as LineHomeSection } from "./line-catalog-DNcdcPlf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DG8BnnOZ.js
var import_jsx_runtime = require_jsx_runtime();
function WatchBoxSlider() {
	const line = useCatalogLine("/saat-mucevher-kutulari");
	const featured = line.items.find((item) => item.price === 1850 && item.id === "gnrs06-bordo") ?? line.items.find((item) => item.price === 1850);
	if (!featured) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-dashed border-border bg-bg-wash px-4 py-8 sm:py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1400px] overflow-hidden border border-dashed border-border bg-bg-elevated lg:grid-cols-[0.86fr_1.14fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-taba uppercase",
						children: "1850 TL özel seri"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-xl font-display text-4xl leading-[0.96] sm:text-6xl",
						children: "Saatlerinize düzenli bir vitrin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-lg text-sm leading-relaxed text-fg-muted sm:text-base",
						children: "Cam kapaklı, kadife iç yüzeyli saat kutuları; koleksiyonunuzu düzenli tutmak ve görünür biçimde sergilemek için."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/saat-mucevher-kutulari",
							search: { tur: "saat" },
							className: "inline-flex min-h-11 items-center gap-2 bg-bg-deep px-5 py-3 text-sm font-medium text-fg-on-deep",
							children: ["1850 TL ürünleri incele ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "size-4",
								"aria-hidden": true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tabular-nums",
							children: formatPrice(featured.price)
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/saat-mucevher-kutulari/$id",
				params: { id: featured.id },
				className: "relative flex min-h-[20rem] items-center justify-center border-t border-dashed border-border bg-bg-wash p-4 sm:min-h-[30rem] sm:p-8 lg:border-t-0 lg:border-l",
				"aria-label": `${featured.name} ürününü incele`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: featured.image,
					srcSet: featured.imageSrcSet,
					sizes: "(min-width: 1024px) 58vw, 100vw",
					alt: featured.alt,
					width: 960,
					height: 720,
					fetchPriority: "high",
					className: "max-h-[34rem] w-full object-contain"
				})
			})]
		})
	});
}
function Home() {
	const homeLines = [...useCatalogLines()].sort((a, b) => [
		"clik",
		"slac",
		"desq",
		"sweb"
	].indexOf(a.key) - [
		"clik",
		"slac",
		"desq",
		"sweb"
	].indexOf(b.key));
	const siteConfig = useSiteConfig();
	const { renk } = Route$56.useSearch();
	const structuredData = {
		"@context": "https://schema.org",
		"@graph": [{
			"@type": "Organization",
			"@id": `${SITE_ORIGIN}/#organization`,
			name: siteConfig.identity.name,
			url: SITE_ORIGIN,
			email: siteConfig.identity.email,
			address: {
				"@type": "PostalAddress",
				addressLocality: BRAND.district,
				addressRegion: BRAND.city,
				addressCountry: "TR"
			}
		}, {
			"@type": "WebSite",
			"@id": `${SITE_ORIGIN}/#website`,
			url: SITE_ORIGIN,
			name: siteConfig.identity.name,
			inLanguage: "tr-TR",
			publisher: { "@id": `${SITE_ORIGIN}/#organization` }
		}]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(structuredData) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchBoxSlider, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-dashed border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-[1400px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4",
				children: [
					[
						"Atölye",
						`${siteConfig.identity.atelier}`,
						"/atolye"
					],
					[
						"Teslim",
						"3–5 iş günü",
						"/teslimat"
					],
					[
						"Palet",
						"kahve · orman",
						"/palet"
					],
					[
						"İade",
						"14 gün",
						"/iade"
					]
				].map(([k, v, href]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: href,
					className: "how-step bg-bg px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: v
					})]
				}, k))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1400px] px-4",
			children: homeLines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineHomeSection, { line }, line.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "deferred-section mx-auto max-w-[1400px] px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: "Atölye"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl",
					children: "Nasıl işliyor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4",
					children: [
						[
							"1",
							"Anlatın",
							"Aklınızdaki düzeni cümleyle yazın. Form, ölçü, renk — biliyorsanız ekleyin."
						],
						[
							"2",
							"Ölçü çıksın",
							"İlk fiyat tahmini. Form, milimetre ve birim fiyat döner."
						],
						[
							"3",
							"Yakın stok",
							"Beklerken katalogdaki benzer parçalar görünür. Hazır ürün de vardır."
						],
						[
							"4",
							"Numune",
							"Onaylarsanız numune 10–15 iş günü. Elli adet ve üzeri teklif sayfasından."
						]
					].map(([n, t, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/tasarla",
						className: "how-step block bg-bg-elevated px-5 py-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-4xl text-taba",
								children: n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-2xl",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg-muted",
								children: b
							})
						]
					}) }, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasarla",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							children: "Tasarımı gönder"
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1400px] px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, {
				color: renk,
				className: "py-16"
			})
		})
	] });
}
//#endregion
export { Home as component };
