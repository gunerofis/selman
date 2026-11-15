import { i as __toESM } from "../_runtime.mjs";
import { c as object, d as union, i as boolean, l as record, s as number, t as _enum, u as string } from "../_libs/zod.mjs";
import { p as shippingForSubtotal } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerFn } from "./ssr.mjs";
import { n as createSsrRpc } from "./site-config-BWq3LIpj.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { W as router_exports } from "./router-BRoH_qS_.mjs";
import { _ as productImageVariant, a as SERIES, n as COLORS, p as getProduct, r as PASTEL, t as CATEGORIES, v as productSlug } from "./products-BOS9FmZC.mjs";
import { t as LINES } from "./line-items-CJOP5bzH.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as Expand, S as Heart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-V30jRwka.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatPrice(amount) {
	return new Intl.NumberFormat("tr-TR", {
		style: "currency",
		currency: "TRY",
		maximumFractionDigits: 0
	}).format(amount);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-Bj7btINc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[background-color,color,border-color,opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-accent-hover",
			outline: "border border-border-strong bg-transparent text-fg hover:border-fg",
			ghost: "text-fg hover:bg-bg-wash",
			deep: "bg-bg-deep text-fg-on-deep hover:opacity-90",
			inverse: "bg-bg-elevated text-fg hover:bg-bg"
		},
		size: {
			sm: "h-11 px-3 text-xs",
			md: "h-11 px-5 text-sm",
			lg: "h-12 px-6 text-sm",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/input-BSfMHjO-.js
var Input = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm text-fg placeholder:text-fg-subtle", "transition-[border-color] duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
	...props
}));
Input.displayName = "Input";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/brand-Dkkw7fWr.js
var BRAND = {
	name: "Sweb",
	tagline: "Ev ve çalışma alanı için düzen ürünleri.",
	email: "destek@gunerofis.com",
	legalEmail: "destek@gunerofis.com",
	atelier: "Örnektepe Mah. Etibank Cad. Onur Sok. 39/7, Beyoğlu / İstanbul",
	neighborhood: "Örnektepe",
	district: "Beyoğlu",
	city: "İstanbul",
	country: "Türkiye",
	hours: "09.00–18.00",
	reply: "1 iş günü",
	quoteReply: "2 iş günü",
	legalUpdated: "2026-09-14",
	/** Resmî unvan, telefon ve IBAN bilinmeden yazılmaz. */
	legalName: "Guner Ofis Okul ve Büro Malzemeleri Ltd. Şti.",
	mersisNumber: "0432046576100001",
	taxOffice: "Kasımpaşa",
	taxNumber: "4320465761",
	legalAddress: "Örnektepe Mah. Etibank Cad. Onur Sok. 39/7, Beyoğlu / İstanbul",
	phone: "+90 212 210 33 91",
	iban: ""
};
function hasBrandValue(value) {
	return Boolean(value.trim());
}
function sellerName() {
	return hasBrandValue(BRAND.legalName) ? BRAND.legalName : `${BRAND.name} atölyesi`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/use-hydrated-DQwezpzp.js
function useHydrated() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	return ready;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/cart-toast-BE8GadUV.js
function recolorLines(lines, sku, from, to) {
	if (from === to) return lines;
	const next = lines.map((line) => ({ ...line }));
	const i = next.findIndex((line) => line.sku === sku && line.color === from);
	if (i < 0) return lines;
	const j = next.findIndex((line) => line.sku === sku && line.color === to);
	if (j >= 0) {
		next[j] = {
			...next[j],
			qty: next[j].qty + next[i].qty
		};
		next.splice(i, 1);
		return next;
	}
	next[i] = {
		...next[i],
		color: to
	};
	return next;
}
/** Put a removed line back, merging qty when the same sku+color is already there. */
function restoreLine(lines, line) {
	const i = lines.findIndex((row) => row.sku === line.sku && row.color === line.color);
	if (i < 0) return [...lines, line];
	const next = lines.map((row) => ({ ...row }));
	next[i] = {
		...next[i],
		qty: next[i].qty + line.qty
	};
	return next;
}
var useCart = create()(persist((set, get) => ({
	lines: [],
	drawerOpen: false,
	lastAdded: null,
	lastRemoved: null,
	add: (sku, color, qty = 1, shouldOpen = true) => {
		const lines = [...get().lines];
		const i = lines.findIndex((l) => l.sku === sku && l.color === color);
		if (i >= 0) lines[i] = {
			...lines[i],
			qty: lines[i].qty + qty
		};
		else lines.push({
			sku,
			color,
			qty
		});
		set({
			lines,
			lastAdded: {
				sku,
				color
			},
			drawerOpen: shouldOpen ? true : get().drawerOpen
		});
	},
	addCatalog: (catalog, qty = 1, shouldOpen = true) => {
		if (catalog.lineKey !== "clik" || !LINES.some((line) => line.items.some((item) => item.id === catalog.itemId))) return;
		const sku = `catalog:${catalog.lineKey}:${catalog.itemId}`;
		const color = "espresso";
		const lines = [...get().lines];
		const i = lines.findIndex((line) => line.sku === sku);
		if (i >= 0) lines[i] = {
			...lines[i],
			catalog,
			qty: lines[i].qty + qty
		};
		else lines.push({
			sku,
			color,
			qty,
			catalog
		});
		set({
			lines,
			lastAdded: {
				sku,
				color
			},
			drawerOpen: shouldOpen ? true : get().drawerOpen
		});
	},
	addMany: (skus, color, shouldOpen = true) => {
		const lines = [...get().lines];
		for (const sku of skus) {
			const i = lines.findIndex((l) => l.sku === sku && l.color === color);
			if (i >= 0) lines[i] = {
				...lines[i],
				qty: lines[i].qty + 1
			};
			else lines.push({
				sku,
				color,
				qty: 1
			});
		}
		const last = skus.at(-1);
		set({
			lines,
			lastAdded: last ? {
				sku: last,
				color
			} : get().lastAdded,
			drawerOpen: shouldOpen ? true : get().drawerOpen
		});
	},
	setQty: (sku, color, qty) => {
		if (qty < 1) {
			set({ lines: get().lines.filter((l) => !(l.sku === sku && l.color === color)) });
			return;
		}
		set({ lines: get().lines.map((l) => l.sku === sku && l.color === color ? {
			...l,
			qty
		} : l) });
	},
	remove: (sku, color) => {
		const line = get().lines.find((l) => l.sku === sku && l.color === color) ?? null;
		set({
			lines: get().lines.filter((l) => !(l.sku === sku && l.color === color)),
			lastRemoved: line
		});
	},
	restoreLast: () => {
		const line = get().lastRemoved;
		if (!line) return;
		set({
			lines: restoreLine(get().lines, line),
			lastRemoved: null
		});
	},
	setColor: (sku, from, to) => set({ lines: recolorLines(get().lines, sku, from, to) }),
	clear: () => set({
		lines: [],
		drawerOpen: false,
		lastAdded: null,
		lastRemoved: null
	}),
	openDrawer: () => set({ drawerOpen: true }),
	closeDrawer: () => set({ drawerOpen: false })
}), {
	name: "sweb-cart",
	merge: (persisted, current) => ({
		...current,
		lines: (persisted?.lines ?? []).filter((line) => line.catalog?.lineKey === "clik" && LINES.some((family) => family.items.some((item) => item.id === line.catalog?.itemId)))
	}),
	partialize: (s) => ({ lines: s.lines })
}));
function cartCount(lines) {
	return lines.reduce((n, l) => n + l.qty, 0);
}
function cartSubtotal(lines) {
	return lines.reduce((sum, l) => {
		const price = l.catalog?.price ?? getProduct(l.sku)?.price;
		return sum + (price == null ? 0 : price * l.qty);
	}, 0);
}
function cartHasPendingPrice(lines) {
	return lines.some((line) => line.catalog?.price == null);
}
function cartLineDisplay(line) {
	if (!line) return null;
	if (line.catalog) return {
		name: line.catalog.name,
		shortName: line.catalog.name,
		image: line.catalog.image,
		price: line.catalog.price,
		href: `${line.catalog.path}/${encodeURIComponent(line.catalog.itemId)}`,
		code: line.catalog.code ?? line.catalog.itemId,
		catalog: true
	};
	const product = getProduct(line.sku);
	if (!product) return null;
	return {
		name: product.name,
		shortName: product.shortName,
		image: product.image,
		price: product.price,
		href: `/urun/${productSlug(product)}`,
		code: product.sku,
		catalog: false
	};
}
function shippingFor(subtotal) {
	return shippingForSubtotal(subtotal);
}
/** Baymard: after add, confirm and offer a path to the cart. */
function toastAdded(name) {
	toast.success(`${name} sepete eklendi`, { action: {
		label: "Sepet",
		onClick: () => useCart.getState().openDrawer()
	} });
}
/** Accidental remove is a top cart error — undo without re-picking color/qty. */
function toastRemoved(name) {
	toast(`${name} sepetten alındı`, { action: {
		label: "Geri al",
		onClick: () => useCart.getState().restoreLast()
	} });
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-C1Lw8HLG.js
var usePrefs = create()(persist((set, get) => ({
	wishlist: [],
	recent: [],
	lastColor: "espresso",
	gridCols: 4,
	toggleWish: (sku) => {
		const cur = get().wishlist;
		set({ wishlist: cur.includes(sku) ? cur.filter((s) => s !== sku) : [sku, ...cur] });
	},
	pushRecent: (sku) => {
		set({ recent: [sku, ...get().recent.filter((s) => s !== sku)].slice(0, 8) });
	},
	rememberColor: (id) => set({ lastColor: id }),
	setGridCols: (n) => set({ gridCols: n })
}), { name: "sweb-prefs" }));
function wishedProducts(skus) {
	return skus.map(getProduct).filter((p) => p != null);
}
/** LCP: first image eager+high. Below-fold lazy. srcset uses existing 320/800/full WebP. */
function CatalogImg({ src, alt, priority = false, sizes = "(max-width: 640px) 50vw, 25vw", className, style }) {
	const v320 = productImageVariant(src, 320);
	const v800 = productImageVariant(src, 800);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: priority ? v800 : v320,
		srcSet: `${v320} 320w, ${v800} 800w, ${src} 1500w`,
		sizes,
		width: 1500,
		height: 1500,
		alt,
		className: cn(className),
		style,
		loading: priority ? "eager" : "lazy",
		fetchPriority: priority ? "high" : "low",
		decoding: priority ? "async" : "async"
	});
}
function WishButton({ sku, className }) {
	const ready = useHydrated();
	const wishlist = usePrefs((s) => s.wishlist);
	const toggle = usePrefs((s) => s.toggleWish);
	const on = ready && wishlist.includes(sku);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": on ? "Favorilerden çıkar" : "Favorilere ekle",
		"aria-pressed": on,
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			const next = !on;
			toggle(sku);
			toast.success(next ? "Favorilere eklendi" : "Favorilerden çıktı");
		},
		className: cn("flex size-11 items-center justify-center bg-bg-elevated/90 text-fg transition-colors duration-200 hover:bg-bg", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4 transition-transform duration-200", on && "heart-pop fill-accent text-accent") })
	});
}
var useQuickLook = create((set) => ({
	product: null,
	color: void 0,
	open: (product, color) => set({
		product,
		color
	}),
	close: () => set({
		product: null,
		color: void 0
	})
}));
var useCompare = create()(persist((set, get) => ({
	skus: [],
	toggle: (sku) => {
		const cur = get().skus;
		if (cur.includes(sku)) {
			set({ skus: cur.filter((s) => s !== sku) });
			return true;
		}
		if (cur.length >= 4) return false;
		set({ skus: [...cur, sku] });
		return true;
	},
	remove: (sku) => set({ skus: get().skus.filter((s) => s !== sku) }),
	replace: (skus) => {
		set({ skus: [...new Set(skus.filter(Boolean))].slice(0, 4) });
	},
	clear: () => set({ skus: [] })
}), { name: "sweb-compare" }));
function comparedProducts(skus) {
	return skus.map(getProduct).filter((p) => p != null);
}
function ProductCard({ product, color, priority = false }) {
	const cat = CATEGORIES.find((c) => c.id === product.category);
	const series = SERIES.find((s) => s.id === product.series);
	const add = useCart((s) => s.add);
	const inCart = useCart((s) => s.lines.some((l) => l.sku === product.sku));
	const lastColor = usePrefs((s) => s.lastColor);
	const rememberColor = usePrefs((s) => s.rememberColor);
	const peek = useQuickLook((s) => s.open);
	const chosen = color ?? lastColor ?? "espresso";
	const colorName = COLORS.find((c) => c.id === chosen)?.name;
	const washBg = color ? PASTEL[color] : void 0;
	const dim = product.specs.find((s) => s.label === "Dış ölçü")?.value;
	const comparing = useCompare((s) => s.skus.includes(product.sku));
	const toggleCompare = useCompare((s) => s.toggle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative border border-dashed border-border bg-bg-wash wash-shift group-hover:border-fg",
			style: washBg ? { backgroundColor: washBg } : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/urun/$sku",
					params: { sku: productSlug(product) },
					search: color ? { renk: color } : void 0,
					className: "img-zoom block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogImg, {
						src: product.image,
						alt: product.name,
						priority,
						className: "aspect-square w-full object-contain p-3"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-2 left-2 font-mono text-xs text-fg-muted",
					children: product.sku
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-1 right-1 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishButton, { sku: product.sku }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center bg-bg-elevated/90 text-fg hover:bg-bg",
						"aria-label": "Hızlı bakış",
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
							peek(product, chosen);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "size-4" })
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-1 border-x border-b border-dashed border-border bg-bg-elevated px-3 pt-3 pb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: series?.name ?? cat?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg leading-snug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/urun/$sku",
						params: { sku: productSlug(product) },
						search: color ? { renk: color } : void 0,
						className: "product-title text-fg hover:text-taba",
						children: product.name
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm tabular-nums",
					children: formatPrice(product.price)
				}),
				dim ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-fg-muted",
					children: dim
				}) : null,
				color ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-fg-muted",
					children: [colorName, " · zemin, fotoğraf değil"]
				}) : null,
				inCart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-taba",
					children: "Sepette"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-auto min-h-9 px-2 py-2 leading-tight",
						onClick: () => {
							rememberColor(chosen);
							add(product.sku, chosen, 1);
							toastAdded(product.name);
						},
						children: inCart ? "Bir tane daha" : "Sepete ekle"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": comparing,
					className: cn("mt-1 h-9 w-full border text-xs", comparing ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg"),
					onClick: () => {
						if (!toggleCompare(product.sku)) toast.error(`En fazla 4 parça`);
					},
					children: comparing ? "Karşılaştırmada" : "Karşılaştır"
				})
			]
		})]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/lead-submissions-CPsmq2MT.js
var leadInput = object({
	type: _enum([
		"contact",
		"quote",
		"complaint",
		"visit",
		"newsletter",
		"withdrawal",
		"design"
	]),
	title: string().trim().min(2).max(160),
	email: string().trim().email().max(254),
	trap: string().max(200).optional(),
	data: record(string().max(60), union([
		string().max(4e3),
		number().finite(),
		boolean()
	])).refine((value) => Object.keys(value).length <= 30)
});
var submitLead = createServerFn({ method: "POST" }).validator((input) => leadInput.parse(input)).handler(createSsrRpc("b318ff381073ccee96a3ac38fc741ae5df0a62e53decbed1c7fa2f3f184b4142"));
//#endregion
export { Input as C, formatPrice as E, sellerName as S, cn as T, toastRemoved as _, WishButton as a, BRAND as b, usePrefs as c, cartCount as d, cartHasPendingPrice as f, toastAdded as g, shippingFor as h, ProductCard as i, useQuickLook as l, cartSubtotal as m, submitLead as n, comparedProducts as o, cartLineDisplay as p, CatalogImg as r, useCompare as s, router_exports as t, wishedProducts as u, useCart as v, Button as w, hasBrandValue as x, useHydrated as y };
