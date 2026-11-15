import { type FormEvent, useState } from "react";
import { askRestock } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { toast } from "sonner";

export function RestockForm({ sku, ml, id }: { sku: string; ml: number; id: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await askRestock({ data: { sku, ml, email } });
      setEmail("");
      toast.success("Kaydedildi");
    } catch {
      setError("E-posta geçersiz.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
      <FormField label="E-posta" required htmlFor={id} error={error}>
        <Input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(error)}
        />
      </FormField>
      <Button type="submit" disabled={busy}>
        Gelince haber ver
      </Button>
    </form>
  );
}
