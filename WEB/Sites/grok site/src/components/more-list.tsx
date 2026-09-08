import { Button } from "@/components/ui/button";
import { LIST_STEP } from "@/lib/list-window";

export { LIST_STEP, listWindow, parseListWindow } from "@/lib/list-window";

export function MoreList({
  shown,
  total,
  onMore,
  step = LIST_STEP,
}: {
  shown: number;
  total: number;
  onMore: () => void;
  step?: number;
}) {
  if (shown >= total) return null;
  const n = Math.min(step, total - shown);
  return (
    <div className="mt-10 flex flex-col items-center gap-2">
      <p className="font-mono text-xs text-fg-muted">
        {shown} / {total} parça
      </p>
      <Button variant="outline" onClick={onMore}>
        {n} parça daha
      </Button>
    </div>
  );
}
