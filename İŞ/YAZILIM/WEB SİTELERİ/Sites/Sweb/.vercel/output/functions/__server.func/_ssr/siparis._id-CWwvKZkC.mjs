import { i as __toESM } from "../_runtime.mjs";
import { d as payLabel } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Route$1, nt as EtaLine, p as RecentRail } from "./router-BRoH_qS_.mjs";
import { f as getColor, r as PASTEL } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as formatPrice, p as cartLineDisplay, w as Button } from "./router-BRoH_qS_2.mjs";
import { t as PrintButton } from "./print-button-BbupOTeB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/siparis._id-CWwvKZkC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderDone() {
	const { id } = Route$1.useParams();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("sweb-last-order");
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed.id === id && parsed.received) setOrder(parsed);
			}
		} catch {}
		setReady(true);
	}, [id]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl px-4 py-16 text-sm text-fg-muted",
		children: "Yükleniyor…"
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-fg-muted uppercase",
				children: "Sipariş"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl",
				children: "Özet bu tarayıcıda yok"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 break-all font-mono text-sm",
				children: id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-fg-muted",
				children: "Bu numaraya ait doğrulanmış özet bu tarayıcıda yok. Bu, sunucudaki kaydın silindiği anlamına gelmez. Sipariş numaranızı saklayın ve atölyeyle paylaşın."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/koleksiyon",
				className: "mt-8 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Koleksiyona dön" })
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-fg-muted uppercase",
				children: "Sipariş talebi alındı"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl",
				children: "Teşekkürler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-fg-muted",
				children: [
					"Sipariş numaranız",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "font-medium text-fg hover:text-taba",
						onClick: () => {
							navigator.clipboard?.writeText(order.id);
							toast.success("Sipariş numarası kopyalandı");
						},
						children: order.id
					}),
					` · ${order.name}, ${order.district ? `${order.district}, ` : ""}${order.city}`,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mx-auto mt-6 max-w-md space-y-3 text-left text-sm text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-fg",
						children: "1"
					}), " Talebiniz sunucuya kaydedildi ve atölyenin yönetim paneline ulaştı. Yeniden e-posta göndermeniz gerekmez."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-fg",
							children: "2"
						}),
						" Atölye üretim ve teslimat için sizinle iletişime geçer. Kart bu sitede alınmaz; tercihiniz ",
						payLabel(order.pay),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-fg",
							children: "3"
						}),
						" Kargo penceresi",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaLine, { className: "mt-1 text-sm text-fg-muted" })
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 divide-y divide-dashed divide-border border-y border-dashed border-border text-left",
				children: order.items.map((l) => {
					const p = cartLineDisplay(l);
					const c = getColor(l.color);
					if (!p) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: p.href,
							className: "flex min-w-0 flex-1 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: "",
								className: "size-14 object-contain",
								style: { backgroundColor: PASTEL[l.color] },
								width: 1500,
								height: 1500
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-fg-subtle",
									children: [
										p.catalog ? p.code : c?.name,
										" × ",
										l.qty
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: p.price == null ? "Fiyat teyidi" : formatPrice(p.price * l.qty)
						})]
					}, `${l.sku}-${l.color}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [
					"Toplam ",
					formatPrice(order.total),
					" · ",
					payLabel(order.pay)
				]
			}),
			order.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-fg-muted",
				children: ["Teslimat notu: ", order.note]
			}) : null,
			order.mail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: order.mail,
					className: "text-taba hover:underline",
					children: "Siparişi e-posta ile yeniden aç"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-fg-muted",
				children: [
					"Teslimden sonra nemli bez yeter.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bakim",
						className: "text-taba hover:underline",
						children: "Bakım"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teslimat",
						className: "text-taba hover:underline",
						children: "Teslimat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iade",
						className: "text-taba hover:underline",
						children: "İade"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cayma",
						className: "text-taba hover:underline",
						children: "Cayma"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/garanti",
						className: "text-taba hover:underline",
						children: "Garanti"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/siparis-sorgu",
						className: "text-taba hover:underline",
						children: "Sorgula"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iletisim",
						className: "text-taba hover:underline",
						children: "Yazın"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, { label: "Özeti yazdır" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Koleksiyona dön" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasarla",
						search: {
							istek: order.items.map((i) => cartLineDisplay(i)?.shortName ?? i.sku).join(", "),
							renk: order.items[0]?.color
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Başka bir ölçü"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teklif",
						search: {
							sku: order.items.length === 1 ? order.items[0].sku : void 0,
							renk: order.items[0]?.color,
							not: order.items.map((i) => i.sku).join(" ")
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "50+ adet teklif"
						})
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1400px] px-4 pb-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, { heading: "Yanına bakın" })
	})] });
}
//#endregion
export { OrderDone as component };
