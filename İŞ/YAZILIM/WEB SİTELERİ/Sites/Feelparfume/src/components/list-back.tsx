import { useEffect, useState } from "react";
import { readLastList, type LastList } from "@/lib/last-list";

/** Baymard: hierarchy crumbs plus a history-based path back to filtered results. */
export function ListBack() {
  const [last, setLast] = useState<LastList | null>(null);
  useEffect(() => setLast(readLastList()), []);
  if (!last) return null;
  return (
    <p className="mb-2 font-mono text-xs">
      <a href={last.href} className="text-taba hover:underline">
        ← {last.label}
      </a>
    </p>
  );
}
