import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kategori.index-DtHbhR-a.js
var import_jsx_runtime = require_jsx_runtime();
function Categories() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Ürün kategorileri"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-6 sm:grid-cols-2",
			children: [{
				id: "saat",
				name: "Saat kutuları",
				image: "/clik/s-8008.webp"
			}, {
				id: "mucevher",
				name: "Mücevher kutuları",
				image: "/clik/mjx-001.webp"
			}].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/saat-mucevher-kutulari",
				search: { tur: c.id },
				className: "border border-border bg-bg-wash p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: c.image,
					alt: c.name,
					width: 600,
					height: 600,
					className: "aspect-square w-full object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-2xl",
					children: c.name
				})]
			}, c.id))
		})]
	});
}
//#endregion
export { Categories as component };
