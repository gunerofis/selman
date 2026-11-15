import { X } from "lucide-react";

export function FilterChips({
  chips,
  onClearAll,
}: {
  chips: { key: string; label: string; onClear: () => void }[];
  onClearAll: () => void;
}) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-fg-muted">Uygulanan</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onClear}
          aria-label={`${chip.label} kaldır`}
          className="inline-flex h-11 items-center gap-1 rounded-md border border-solid border-border-strong px-2 text-xs hover:border-fg"
        >
          {chip.label}
          <X className="size-3" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="h-11 px-2 text-xs text-taba hover:underline"
      >
        Tümünü sil
      </button>
    </div>
  );
}
