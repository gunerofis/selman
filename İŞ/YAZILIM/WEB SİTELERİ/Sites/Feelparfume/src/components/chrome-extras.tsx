import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChromeExtras() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
      setShowTop(el.scrollTop > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 h-0.5 bg-taba print:hidden"
        style={{ width: `${progress}%` }}
        aria-hidden
        data-print-hide
      />
      <button
        type="button"
        aria-label="Yukarı çık"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed right-4 z-40 flex size-11 items-center justify-center rounded-full border border-solid border-border bg-bg-elevated text-fg transition-opacity duration-200 print:hidden",
          showTop ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ bottom: "calc(1rem + var(--cookie-h, 0px))" }}
        data-print-hide
      >
        <ArrowUp className="size-4" />
      </button>
    </>
  );
}
