import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as COLORS, r as PASTEL } from "./products-BOS9FmZC.mjs";
import { T as cn } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dimension-preview-D5zlfY9T.js
var import_jsx_runtime = require_jsx_runtime();
function DimensionPreview({ widthMm, depthMm, heightMm, color, note = "Oran canlıdır; fiyat tahmini gönderince çıkar." }) {
	const w = clamp(Number(widthMm) || 280);
	const d = clamp(Number(depthMm) || 180);
	const h = clamp(Number(heightMm) || 90);
	const max = Math.max(w, d, h);
	const wash = color ? PASTEL[color] : "var(--color-bg-wash)";
	const edge = color ? COLORS.find((c) => c.id === color)?.swatch : "var(--color-border-strong)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-dashed border-border bg-bg-elevated p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Ölçü taslağı"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-sm",
				children: [
					w,
					" × ",
					d,
					" × ",
					h,
					" mm"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex h-40 items-end justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute border border-dashed border-border",
						style: {
							width: `${w / max * 180}px`,
							height: `${h / max * 140}px`,
							left: `${d / max * 14}px`,
							top: `${d / max * -10}px`
						},
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("wash-shift relative border"),
						style: {
							width: `${w / max * 180}px`,
							height: `${h / max * 140}px`,
							backgroundColor: wash,
							borderColor: edge
						}
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-fg-muted",
				children: note
			})
		]
	});
}
function clamp(n) {
	if (!Number.isFinite(n)) return 180;
	return Math.min(900, Math.max(80, Math.round(n)));
}
//#endregion
export { DimensionPreview as t };
