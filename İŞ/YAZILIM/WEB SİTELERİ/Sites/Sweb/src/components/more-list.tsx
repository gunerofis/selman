import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
export { LIST_STEP, listWindow, parseListWindow } from "@/lib/list-window";

export function MoreList({
  shown,
  total,
  onMore,
}: {
  shown: number;
  total: number;
  onMore: () => void;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const onMoreRef = useRef(onMore);

  useEffect(() => {
    onMoreRef.current = onMore;
  }, [onMore]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || shown >= total) return;

    let requested = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || requested) return;
        requested = true;
        onMoreRef.current();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [shown, total]);

  if (shown >= total) return null;
  const remaining = total - shown;
  return (
    <div ref={triggerRef} className="mt-10 flex flex-col items-center gap-2">
      <p className="font-mono text-xs text-fg-muted">
        {shown} / {total} parça
      </p>
      <Button variant="outline" onClick={onMore}>
        {remaining} parça daha yükle
      </Button>
    </div>
  );
}
