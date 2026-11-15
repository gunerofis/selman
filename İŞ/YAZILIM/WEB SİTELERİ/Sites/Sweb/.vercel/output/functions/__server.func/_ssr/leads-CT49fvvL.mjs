//#region node_modules/.nitro/vite/services/ssr/assets/leads-CT49fvvL.js
function isHoneypot(trap) {
	return Boolean(trap?.trim());
}
function isEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
/** Baymard: error text must name the missing piece, not just “invalid”. */
function emailIssue(value) {
	const v = value.trim();
	if (!v) return "E-posta girin.";
	if (!v.includes("@")) return "E-postada @ eksik.";
	const at = v.indexOf("@");
	const domain = v.slice(at + 1);
	if (!domain) return "@ sonrası eksik.";
	if (!domain.includes(".")) return "Alan adı uzantısı eksik (.com gibi).";
	if (!isEmail(v)) return "Geçerli e-posta girin.";
	return "";
}
//#endregion
export { isEmail as n, isHoneypot as r, emailIssue as t };
