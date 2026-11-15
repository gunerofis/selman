export const COOKIE_PREFS_OPEN_EVENT = "sweb-cookies-open";

export function openCookiePrefs() {
  window.dispatchEvent(new Event(COOKIE_PREFS_OPEN_EVENT));
}
