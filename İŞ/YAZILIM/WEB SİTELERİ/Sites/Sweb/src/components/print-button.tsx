import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Yazdır" }: { label?: string }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
