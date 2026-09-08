import { readFileSync, writeFileSync } from "node:fs";
const rows = JSON.parse(readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/url-map.json", "utf8"));
const out = [];
for (const r of rows) {
  const url = "https://www.sumentakimi.com.tr" + (r.path === "/" ? "/" : r.path);
  try {
    const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "sumentakimi-gsc-map/1.0" } });
    out.push({
      path: r.path,
      clicks: r.clicks,
      impr: r.impr,
      status: res.status,
      location: res.headers.get("location") || "",
      planned: r.target,
      reason: r.reason,
    });
  } catch (e) {
    out.push({ path: r.path, clicks: r.clicks, impr: r.impr, status: "ERR", location: String(e), planned: r.target, reason: r.reason });
  }
  await new Promise((x) => setTimeout(x, 200));
}
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/http-check.json", JSON.stringify(out, null, 2));
const by = {};
for (const x of out) by[x.status] = (by[x.status] || 0) + 1;
const need = out.filter((x) => x.status === 404 || (x.status === 301 && x.planned && !String(x.location).includes(x.planned.replace(/\/$/, ""))));
console.log(JSON.stringify({ by, need: need.length }));
need.slice(0, 40).forEach((x) => console.log(x.status, x.path, "loc="+x.location, "want="+x.planned));
