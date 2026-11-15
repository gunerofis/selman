import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function QtyControl({
  value,
  onChange,
  min = 1,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
}) {
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef(value);
  const [typed, setTyped] = useState(String(value));
  valueRef.current = value;

  useEffect(() => {
    setTyped(String(value));
  }, [value]);

  function stop() {
    if (delayRef.current) clearTimeout(delayRef.current);
    if (holdRef.current) clearInterval(holdRef.current);
    delayRef.current = null;
    holdRef.current = null;
  }

  useEffect(() => () => stop(), []);

  function startHold(delta: number) {
    const bump = () => {
      const next = Math.max(min, valueRef.current + delta);
      valueRef.current = next;
      onChange(next);
    };
    bump();
    stop();
    delayRef.current = setTimeout(() => {
      holdRef.current = setInterval(bump, 90);
    }, 380);
  }

  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-md border border-border-strong">
      <Button
        variant="ghost"
        size="icon"
        className="size-11 rounded-none"
        aria-label="Azalt"
        onPointerDown={(e) => {
          e.preventDefault();
          startHold(-step);
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        −
      </Button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Adet"
        value={typed}
        className="h-11 w-12 rounded-none border-0 bg-transparent text-center text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onChange={(e) => {
          const next = e.target.value.replace(/\D/g, "");
          setTyped(next);
          const n = Number(next);
          if (next && Number.isFinite(n) && n >= min) onChange(n);
        }}
        onBlur={() => {
          const n = Math.max(min, Number(typed) || min);
          setTyped(String(n));
          if (n !== value) onChange(n);
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-11 rounded-none"
        aria-label="Arttır"
        onPointerDown={(e) => {
          e.preventDefault();
          startHold(step);
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        +
      </Button>
    </div>
  );
}

export function EmptyHint({
  title,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg border border-solid border-border bg-bg-elevated px-6 py-16 text-center">
      <h2 className="font-display text-3xl">{title}</h2>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
