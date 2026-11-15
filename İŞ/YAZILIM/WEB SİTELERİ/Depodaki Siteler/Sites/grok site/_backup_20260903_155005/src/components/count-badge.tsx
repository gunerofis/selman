export function CountBadge({ value }: { value: number }) {
  if (value < 1) return null;
  return (
    <span
      key={value}
      className="pop-badge absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-mono text-[10px] leading-none text-accent-fg"
    >
      {value}
    </span>
  );
}
