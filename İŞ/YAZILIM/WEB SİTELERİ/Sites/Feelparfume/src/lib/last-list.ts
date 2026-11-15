const KEY = "sweb-last-list";

export type LastList = { href: string; label: string };

export function rememberList(href: string, label: string) {
  if (!href.startsWith("/koleksiyon") && !href.startsWith("/kategori")) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ href, label } satisfies LastList));
  } catch {
    /* quota */
  }
}

export function readLastList(): LastList | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastList;
    if (!parsed?.href || !parsed.label) return null;
    return parsed;
  } catch {
    return null;
  }
}
