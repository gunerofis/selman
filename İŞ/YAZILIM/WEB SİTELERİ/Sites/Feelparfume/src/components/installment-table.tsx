import { installmentRows, type InstallmentRate } from "@/lib/installments";
import { formatPriceTRY } from "@/lib/utils";

export function InstallmentTable({
  price,
  rates,
}: {
  price: number;
  rates: InstallmentRate[];
}) {
  const rows = installmentRows(Math.round(price * 100), rates);
  if (!rows.length) return null;
  return (
    <table className="w-full text-sm">
      <caption className="mb-2 text-left">Taksit</caption>
      <thead>
        <tr className="border-b border-border text-fg-muted">
          <th className="py-1 text-left font-medium">Banka</th>
          <th className="py-1 text-right font-medium">Ay</th>
          <th className="py-1 text-right font-medium">Taksit</th>
          <th className="py-1 text-right font-medium">Toplam</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.bank}-${row.months}`} className="border-b border-border">
            <td className="py-1">{row.bank}</td>
            <td className="py-1 text-right tabular-nums">{row.months}</td>
            <td className="py-1 text-right tabular-nums">
              {formatPriceTRY(row.eachCents / 100, { showDecimals: true })}
            </td>
            <td className="py-1 text-right tabular-nums">
              {formatPriceTRY(row.totalCents / 100, { showDecimals: true })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
