import { readFileSync } from "node:fs";

const strings = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/unzip/xl/sharedStrings.xml", "utf8")
  .match(/<si><t>([\s\S]*?)<\/t><\/si>/g)
  .map((s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"));

function parseSheet(name) {
  const xml = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/unzip/xl/worksheets/" + name, "utf8");
  const rows = [...xml.matchAll(/<row r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)];
  return rows.map((r) => {
    const cells = {};
    for (const c of r[2].matchAll(/<c r="([A-Z]+)(\d+)"([^>]*)>(?:<v>([^<]*)<\/v>)?/g)) {
      const col = c[1];
      const attrs = c[3] || "";
      const v = c[4] || "";
      cells[col] = attrs.includes('t="s"') ? strings[Number(v)] : v;
    }
    return cells;
  });
}

const q = parseSheet("sheet2.xml");
const p = parseSheet("sheet3.xml");
console.log("=== QUERIES ===");
q.slice(0, 20).forEach((r) => console.log([r.A, r.B, r.C, r.D, r.E].join("\t")));
console.log("\n=== PAGES ===");
p.slice(0, 30).forEach((r) => console.log([r.A, r.B, r.C, r.D, r.E].join("\t")));
const pages = p.slice(1).map((r) => ({ u: r.A, c: Number(r.B) || 0, i: Number(r.C) || 0 }));
console.log("\npages", pages.length, "clicks", pages.reduce((s, x) => s + x.c, 0), "impr", pages.reduce((s, x) => s + x.i, 0));
const withClicks = pages.filter((x) => x.c > 0).sort((a, b) => b.c - a.c);
console.log("\nCLICKED PAGES");
withClicks.forEach((x) => console.log(x.c, x.i, x.u));
