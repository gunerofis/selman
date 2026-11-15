import { readFileSync, writeFileSync } from "node:fs";
const body = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/sss-body.html", "utf8");
writeFileSync(
  "C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/sss-update-vars.json",
  JSON.stringify({ id: "gid://shopify/Page/166814220580", body })
);
console.log("bytes", Buffer.byteLength(JSON.stringify({ id: "x", body })));
