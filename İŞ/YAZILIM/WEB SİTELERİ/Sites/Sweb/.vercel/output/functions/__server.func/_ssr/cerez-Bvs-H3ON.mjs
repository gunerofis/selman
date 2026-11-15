import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cerez-Bvs-H3ON.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Çerez politikası",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sitede yalnızca zorunlu çerez ve tarayıcı deposu kullanılır. Sepet, favori, son bakılan ürün ve çerez onayı cihazınızda tutulur. Ölçüm, reklam ve üçüncü taraf izleme çerezi yoktur." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tamam zorunlu depoyu kabul eder. Reddet çubuğu kapatır; sepet ve favori yine tarayıcıda çalışır çünkü ödeme başka türlü yürüyemez." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Tercihi değiştirmek için alt bilgideki «Çerez tercihleri» bağlantısını kullanın. Sorular:",
				" ",
				BRAND.email,
				"."
			] })
		]
	});
}
//#endregion
export { Page as component };
