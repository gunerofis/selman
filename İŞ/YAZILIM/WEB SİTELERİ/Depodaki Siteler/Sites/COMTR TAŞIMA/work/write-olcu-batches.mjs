import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const rows = JSON.parse(readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/olcu-extracted.json", "utf8"));
const metafields = rows.map((r) => ({
  ownerId: r.id,
  namespace: "custom",
  key: "sumen_olcu",
  type: "single_line_text_field",
  value: r.olcu,
}));
const size = 25;
mkdirSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/olcu-vars", { recursive: true });
writeFileSync(
  "C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/mutations-olcu-set.graphql",
  `mutation SetOlcu($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { key value }
    userErrors { field message }
  }
}
`
);
let n = 0;
for (let i = 0; i < metafields.length; i += size) {
  n += 1;
  writeFileSync(
    `C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/olcu-vars/${n}.json`,
    JSON.stringify({ metafields: metafields.slice(i, i + size) })
  );
}
console.log({ total: metafields.length, batches: n });
