import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { catalogDiscoveryPrice, sampleChoices } from "@/lib/discovery";
import { useCart } from "@/lib/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/kesif-seti")({
  head: () =>
    pageHead({
      title: "Keşif seti",
      description: "Beş deneme boyu, sabit fiyat.",
      path: "/kesif-seti",
    }),
  component: Builder,
});

function Builder() {
  const choices = useMemo(() => sampleChoices(), []);
  const price = catalogDiscoveryPrice();
  const setBundle = useCart((state) => state.setBundle);
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(sku: string) {
    setPicked((current) => {
      if (current.includes(sku)) return current.filter((item) => item !== sku);
      if (current.length >= 5) return current;
      return [...current, sku];
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Keşif seti</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl">5 deneme boyu</h1>
        {price != null ? <p className="font-mono text-2xl">{formatPrice(price)}</p> : null}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {choices.map((choice) => {
          const on = picked.includes(choice.sku);
          return (
            <li key={`${choice.sku}-${choice.color}`}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(choice.sku)}
                className={cn(
                  "flex h-full w-full flex-col rounded-xl border p-3 text-left",
                  on ? "border-fg bg-fg text-bg-elevated" : "border-border-strong bg-bg-elevated",
                )}
              >
                <img src={choice.image} alt="" className="aspect-square w-full object-contain" width={320} height={320} />
                <span className="mt-3 font-display text-lg leading-tight">{choice.name}</span>
                <span className="mt-1 font-mono text-xs">{choice.ml} ml</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-8">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={picked.length !== 5 || price == null}
          onClick={() => {
            const lines = picked.map((sku) => {
              const choice = choices.find((item) => item.sku === sku);
              return { sku, color: choice?.color ?? "5ml", qty: 1 };
            });
            setBundle(lines);
          }}
        >
          Sepete ekle · {picked.length}/5
        </Button>
      </div>
    </div>
  );
}
