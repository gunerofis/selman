import { createContext, useContext, type ReactNode } from "react";
import type { LineDef } from "./line-items";

const CatalogContext = createContext<LineDef[] | null>(null);

export function CatalogProvider({ lines, children }: { lines: LineDef[]; children: ReactNode }) {
  return <CatalogContext.Provider value={lines}>{children}</CatalogContext.Provider>;
}

export function useCatalogLines() {
  const lines = useContext(CatalogContext);
  if (!lines) throw new Error("CatalogProvider is missing");
  return lines;
}

export function useCatalogLine(path: LineDef["to"]) {
  const line = useCatalogLines().find((item) => item.to === path);
  if (!line) throw new Error(`Catalog line not found: ${path}`);
  return line;
}

export function useCatalogItem(path: LineDef["to"], id: string) {
  const line = useCatalogLine(path);
  const item = line.items.find((product) => product.id === id) ?? null;
  return item ? { line, item } : null;
}
