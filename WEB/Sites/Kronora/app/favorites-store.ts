const FAVORITES_KEY = "moneluks-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string) {
  const current = getFavorites();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("favorites-updated"));
  return next.includes(slug);
}

export function addFavorite(slug: string) {
  const current = getFavorites();
  if (current.includes(slug)) return false;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...current, slug]));
  window.dispatchEvent(new CustomEvent("favorites-updated"));
  return true;
}
