import { useId, useState } from "react";
import type { FaqItem } from "@/lib/faq";
import { cn } from "@/lib/utils";

export function FaqList({
  items,
  heading = "Sık sorulan",
}: {
  items: FaqItem[];
  heading?: string | false;
}) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={heading === false ? "mt-4" : "mt-12"}>
      {heading ? <h2 className="font-display text-2xl">{heading}</h2> : null}
      <ul className="mt-4 divide-y divide-solid divide-border border-y border-solid border-border">
        {items.map((item, i) => {
          const expanded = open === i;
          return (
            <li key={item.q}>
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 py-4 text-left"
                aria-expanded={expanded}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
              >
                <span className="text-sm font-medium">{item.q}</span>
                <span className={cn("font-mono text-xs text-fg-muted", expanded && "text-fg")}>
                  {expanded ? "−" : "+"}
                </span>
              </button>
              {expanded ? (
                <p id={`${base}-${i}`} className="pb-4 text-sm leading-relaxed text-fg-muted">
                  {item.a}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
