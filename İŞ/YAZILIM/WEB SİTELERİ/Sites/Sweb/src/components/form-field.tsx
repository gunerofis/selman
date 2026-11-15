import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Baymard: mark required and optional; keep the label visible; hint next to the field. */
export function FormField({
  label,
  required,
  optional,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5 text-sm">
      <label htmlFor={htmlFor} className="text-sm">
        {label}
        {required ? <span className="text-fg-muted"> · zorunlu</span> : null}
        {optional ? <span className="text-fg-muted"> · isteğe bağlı</span> : null}
      </label>
      {children}
      {error ? (
        <p
          id={htmlFor ? `${htmlFor}-hata` : undefined}
          className="text-xs text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-fg-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function fieldBorder(error?: string) {
  return cn(error && "border-danger");
}
