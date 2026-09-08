import { readFileSync, writeFileSync } from "node:fs";
const body = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/sss-body.html", "utf8");
const vars = {
  title: "Sümen Takımı Hakkında Sık Sorulan Sorular",
  handle: "sss",
  suffix: "faq",
  body,
};
writeFileSync(
  "C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/sss-page-vars.json",
  JSON.stringify(vars)
);
console.log("vars bytes", Buffer.byteLength(JSON.stringify(vars)));
