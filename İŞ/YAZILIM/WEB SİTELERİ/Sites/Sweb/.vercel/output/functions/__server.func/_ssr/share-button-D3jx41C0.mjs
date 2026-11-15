import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as Share2 } from "../_libs/lucide-react.mjs";
import { w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-button-D3jx41C0.js
var import_jsx_runtime = require_jsx_runtime();
function ShareButton({ title, url, text }) {
	async function share() {
		try {
			if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
				await navigator.share({
					title,
					url,
					text: text ?? title
				});
				return;
			}
			await navigator.clipboard.writeText(url);
			toast.success("Bağlantı kopyalandı");
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			try {
				await navigator.clipboard.writeText(url);
				toast.success("Bağlantı kopyalandı");
			} catch {
				toast.error("Paylaşılamadı");
			}
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		size: "sm",
		onClick: () => void share(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Paylaş"]
	});
}
//#endregion
export { ShareButton as t };
