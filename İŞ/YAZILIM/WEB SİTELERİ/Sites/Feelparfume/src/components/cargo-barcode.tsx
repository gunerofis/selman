import { code128Bars } from "@/lib/code128";

export function CargoBarcode({ code }: { code: string }) {
  const bars = code128Bars(code);
  if (!bars.length) return <p className="font-mono text-sm">{code}</p>;
  const width = bars.reduce((max, bar) => Math.max(max, bar.x + bar.w), 0);
  return (
    <svg role="img" aria-label={code} viewBox={`0 0 ${width} 48`} className="h-16 w-64">
      {bars.map((bar, index) =>
        bar.black ? <rect key={index} x={bar.x} width={bar.w} height="40" /> : null,
      )}
      <text x={width / 2} y="47" textAnchor="middle" fontSize="8" fontFamily="ui-monospace, monospace">
        {code}
      </text>
    </svg>
  );
}
