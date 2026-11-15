export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-solid border-border bg-bg-wash px-3 py-2 text-sm text-fg-muted">
      {children}
    </p>
  );
}

/** @deprecated Use Notice. Kept as alias while routes migrate. */
export const DemoNotice = Notice;
