export type SpecSatiri = { etiket: string; deger: string }

/** Sol etiket gövde, sağ değer mono. Satır ayırıcı kesikli. */
export function SpecTablosu({ satirlar }: { satirlar: readonly SpecSatiri[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {satirlar.map((s) => (
          <tr key={s.etiket}>
            <th scope="row" className="py-[7px] text-left font-normal dikis-alt">
              {s.etiket}
            </th>
            <td className="py-[7px] text-right font-mono text-[13px] dikis-alt">{s.deger}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
