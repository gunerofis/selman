import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as PRICE_BANDS, C as Route$38, Z as listWindow, at as useCatalogLines, tt as inPriceBand } from "./router-BRoH_qS_.mjs";
import { i as matchesLineItem } from "./line-items-CJOP5bzH.mjs";
import { p as Search } from "../_libs/lucide-react.mjs";
import { C as Input, E as formatPrice, T as cn } from "./router-BRoH_qS_2.mjs";
import { a as MoreList, n as LineItemLink } from "./line-catalog-DNcdcPlf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/koleksiyon-C3qWIZ-s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SERIES_FILTERS = [{
	id: "all",
	label: "Tümü"
}, {
	id: "clik",
	label: "Saat & Mücevher"
}];
var PRICE_FILTERS = [
	{
		id: "all",
		label: "Tümü"
	},
	...PRICE_BANDS.map((b) => ({
		id: b.id,
		label: b.label
	})),
	{
		id: "teklif",
		label: "Teklife özel"
	}
];
function Shop() {
	const lines = useCatalogLines();
	const navigate = Route$38.useNavigate();
	const search = Route$38.useSearch();
	const [query, setQuery] = (0, import_react.useState)(search.q ?? "");
	const [seri, setSeri] = (0, import_react.useState)(search.aile ?? "all");
	const [fiyat, setFiyat] = (0, import_react.useState)(search.fiyat ?? "all");
	const [tur, setTur] = (0, import_react.useState)(search.tur ?? "all");
	const [sort, setSort] = (0, import_react.useState)(search.sirala && search.sirala !== "en" ? search.sirala : "onerilen");
	const [shown, setShown] = (0, import_react.useState)(() => listWindow(search.goster));
	const syncUrl = (patch) => {
		navigate({
			to: "/koleksiyon",
			search: (prev) => ({
				...prev,
				...patch
			}),
			replace: true,
			resetScroll: false
		});
	};
	const all = (0, import_react.useMemo)(() => {
		const isArchive = (item) => Boolean(item.note && /arşiv/i.test(item.note));
		const buckets = lines.map((line) => line.items.filter((item) => !isArchive(item)).map((item) => ({
			line,
			item
		})));
		const out = [];
		const longest = buckets.reduce((max, b) => Math.max(max, b.length), 0);
		for (let i = 0; i < longest; i++) for (const bucket of buckets) if (i < bucket.length) out.push(bucket[i]);
		return out;
	}, [lines]);
	const turler = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const { item } of all) if (item.kind) set.add(item.kind);
		return [...set].sort((a, b) => a.localeCompare(b, "tr"));
	}, [all]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = query.trim();
		return all.filter(({ line, item }) => {
			if (seri !== "all" && line.key !== seri) return false;
			if (tur !== "all" && item.kind !== tur) return false;
			if (fiyat === "teklif") {
				if (item.price != null) return false;
			} else if (fiyat !== "all") {
				if (item.price == null || !inPriceBand(item.price, fiyat)) return false;
			}
			if (needle && !matchesLineItem(item, line, needle)) return false;
			return true;
		});
	}, [
		all,
		seri,
		tur,
		fiyat,
		query
	]);
	const list = (0, import_react.useMemo)(() => {
		const copy = [...filtered];
		copy.sort((a, b) => {
			const featuredOrder = Number(b.item.price === 1850) - Number(a.item.price === 1850);
			if (featuredOrder !== 0) return featuredOrder;
			if (sort === "fiyat-asc") return (a.item.price ?? Infinity) - (b.item.price ?? Infinity);
			if (sort === "fiyat-desc") return (b.item.price ?? -Infinity) - (a.item.price ?? -Infinity);
			if (sort === "ad") return a.item.name.localeCompare(b.item.name, "tr");
			return 0;
		});
		return copy;
	}, [filtered, sort]);
	const windowed = list.slice(0, shown);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Katalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl sm:text-5xl",
				children: "Tüm Ürünler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-fg-muted",
				children: [
					"Tüm kategoriler tek listede. ",
					all.length,
					" ürün arasından filtreleyin."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-5 border-y border-dashed border-border py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Ara"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3.5 left-3 size-4 text-fg-subtle" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "pl-10",
								placeholder: "Ürün adı, kod veya özellik ara",
								value: query,
								onChange: (e) => {
									setQuery(e.target.value);
									setShown(24);
									syncUrl({
										q: e.target.value.trim() || void 0,
										goster: void 0
									});
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
						label: "Kategori",
						children: SERIES_FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: seri === f.id,
							onClick: () => {
								setSeri(f.id);
								setShown(24);
								syncUrl({
									aile: f.id === "all" ? void 0 : f.id,
									goster: void 0
								});
							},
							children: f.label
						}, f.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
						label: "Fiyat",
						children: PRICE_FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: fiyat === f.id,
							onClick: () => {
								setFiyat(f.id);
								setShown(24);
								syncUrl({
									fiyat: f.id === "all" ? void 0 : f.id,
									goster: void 0
								});
							},
							children: f.label
						}, f.id))
					}),
					turler.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterRow, {
						label: "Tür",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: tur === "all",
							onClick: () => {
								setTur("all");
								setShown(24);
								syncUrl({
									tur: void 0,
									goster: void 0
								});
							},
							children: "Tümü"
						}), turler.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: tur === k,
							onClick: () => {
								setTur(k);
								setShown(24);
								syncUrl({
									tur: k,
									goster: void 0
								});
							},
							children: k
						}, k))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-sm text-fg-muted",
							children: [list.length, " ürün"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-fg-muted",
							children: ["Sırala", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sort,
								onChange: (e) => {
									const v = e.target.value;
									setSort(v);
									syncUrl({ sirala: v === "onerilen" ? void 0 : v });
								},
								className: "h-11 border border-border-strong bg-bg-elevated px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "onerilen",
										children: "Önerilen"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fiyat-asc",
										children: "Fiyat: artan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fiyat-desc",
										children: "Fiyat: azalan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ad",
										children: "İsim"
									})
								]
							})]
						})]
					})
				]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-20 text-center text-sm text-fg-muted",
				children: "Bu filtrelerle eşleşen ürün yok."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4",
				children: windowed.map(({ line, item }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col bg-bg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineItemLink, {
						line,
						id: item.id,
						className: "img-zoom block bg-bg-wash",
						ariaLabel: item.name,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image,
							srcSet: item.imageSrcSet,
							sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
							alt: item.alt,
							width: 1500,
							height: 1125,
							loading: "lazy",
							className: "aspect-[4/3] w-full object-contain p-1 sm:p-3"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col p-3 sm:p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
									children: line.kicker
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs tracking-wide text-fg-subtle uppercase",
									children: item.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-display text-base leading-snug sm:text-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineItemLink, {
									line,
									id: item.id,
									className: "hover:text-taba",
									children: item.name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-auto pt-4 font-display text-lg sm:text-xl",
								children: item.price == null ? "Fiyat teyidi bekliyor" : formatPrice(item.price)
							})
						]
					})]
				}, `${line.key}-${item.id}`))
			}),
			list.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreList, {
				shown: Math.min(shown, list.length),
				total: list.length,
				onMore: () => setShown((s) => {
					const next = s + 24;
					syncUrl({ goster: next });
					return next;
				})
			}) : null
		]
	});
}
function FilterRow({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 font-mono text-xs tracking-wide text-fg-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children
	})] });
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-pressed": active,
		className: cn("min-h-11 border px-4 py-2 text-sm transition-colors duration-150", active ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg hover:text-fg"),
		children
	});
}
//#endregion
export { Shop as component };
