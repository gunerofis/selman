const checks = [
  ["/anasayfa-aciklama", "/pages/sumen-takimi-rehberi"],
  ["/pages/anasayfa-aciklama", "/pages/sumen-takimi-rehberi"],
  ["/makam-panolari-3", "/collections/makam-panolari"],
  ["/collections/makam-panolari-3", "/collections/makam-panolari"],
  ["/makam-panolari-2", "/collections/makam-panolari"],
  ["/kristal-masa-setleri", "/collections/kristal-sumen-takimlari"],
  ["/kristal-sumen-takimlari-2", "/collections/kristal-sumen-takimlari"],
  ["/blog/etiket/masa sümeni", "/blogs/news"],
  ["/blog/etiket/masa%20s%C3%BCmeni", "/blogs/news"],
  ["/blog/kategori/sümen takımı", "/blogs/news"],
  ["/blog/etiket/ofis aksesuarları", "/blogs/news"],
  ["/blog/etiket/sümen takımı", "/blogs/news"],
  ["/kullanici-kayit", "/account/login"],
  ["/kullanici-giris", "/account/login"],
  ["/kumasli-pano-nedir-ofis-ve-kurumsal-alanlarda-kumasli-pano-kullanimi", "/collections/kumasli-panolar"],
  ["/dora-deri-sumen-takimi-9-parca", "/collections/deri-sumen-takimlari"],
  ["/dora-deri-sumen-takimi-9-parca-gumus-aksesuar-", "/collections/deri-sumen-takimlari"],
  ["/dora-sumen-takimi-11-parca-krem-isimlik-hediyeli", "/collections/deri-sumen-takimlari"],
  ["/dora-sumen-takimi-12-parca-krem-full-set-isimlik-hediyeli", "/collections/deri-sumen-takimlari"],
  ["/dora-sumen-takimi-12-parca-krem-masa-bayrakli-gold-aksesuarli-isimlik-hediyeli", "/collections/deri-sumen-takimlari"],
  ["/liya-sumen-takimi-6-parca-siyah", "/collections/deri-sumen-takimlari"],
  ["/liya-sumen-takimi-9-parca-kahverengi", "/collections/deri-sumen-takimlari"],
  ["/liya-sumen-takimi-10-parca-kahverengi-tek-evrak-rafli-kahvrengi", "/collections/deri-sumen-takimlari"],
  ["/liya-sumen-takimi-10-parca-kahverengi-tek-evrak-rafli-siyah", "/collections/deri-sumen-takimlari"],
  ["/diamond-sumen-takimi-9-parca-mermer-desenli", "/collections/sumen-takimi"],
  ["/diamond-sumen-takimi-10-parca-mermer-desenli", "/collections/sumen-takimi"],
  ["/eko-501-deri-sumen-takimi-7-parca", "/collections/deri-sumen-takimlari"],
  ["/eko-501-deri-sumen-takimi-7-parca-siyah-gold-aksesuar-2", "/collections/deri-sumen-takimlari"],
  ["/eko502-deri-sumen-takimi-taba-6-parca-gold-aksesuar", "/collections/deri-sumen-takimlari"],
  ["/chester-deri-sumen-takimi-11-parca-gumus-aksesuar-2", "/collections/deri-sumen-takimlari"],
  ["/chester-deri-sumen-takimi-11-parca-gumus-aksesuar-", "/collections/deri-sumen-takimlari"],
  ["/chester-deri-sumen-takimi-6-parca", "/collections/deri-sumen-takimlari"],
  ["/eko500-deri-evrak-raf-notluk-kalemlik-seti-kahve-gold-aksesuar", "/collections/masa-ustu-setler"],
  ["/deri-kalemlik-notluk-telefonluk", "/collections/masa-ustu-setler"],
  ["/deri-2-parca-masa-ustu-seti-kalemlik-ve-notluk", "/collections/masa-ustu-setler"],
  ["/kucuk-osmanli-devlet-armasi-altin", "/products/kucuk-oval-osmanli-devlet-armasi-altin"],
  ["/cam-ve-deri-masa-isimligi", "/collections/masa-ustu-isimlikler"],
  ["/sumen-takimi-nedir", "/pages/sumen-takimi-rehberi"],
  ["/sumen-aksesuarlari", "/collections/sumen-aksesuarlari"],
  ["/deri-sumen-takimlari", "/collections/deri-sumen-takimlari"],
];

function locPath(loc) {
  if (!loc) return "";
  try {
    return new URL(loc, "https://www.sumentakimi.com.tr").pathname.replace(/\/$/, "") || "/";
  } catch {
    return loc.replace(/\/$/, "");
  }
}

const origin = "https://www.sumentakimi.com.tr";
const bad = [];
const ok = [];
for (const [path, want] of checks) {
  const url = origin + path;
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "sumentakimi-gsc-verify/1.0" } });
  const loc = res.headers.get("location") || "";
  const got = locPath(loc);
  const wantN = want.replace(/\/$/, "") || "/";
  const hopOk = res.status === 301 && (got === wantN || got.endsWith(wantN));
  let destStatus = null;
  if (loc) {
    const destUrl = loc.startsWith("http") ? loc : origin + loc;
    const dest = await fetch(destUrl, { redirect: "manual", headers: { "user-agent": "sumentakimi-gsc-verify/1.0" } });
    destStatus = dest.status;
  }
  const row = { path, status: res.status, loc: got, want: wantN, destStatus };
  if (!hopOk || (destStatus && destStatus !== 200 && destStatus !== 302)) bad.push(row);
  else ok.push(row);
  await new Promise((r) => setTimeout(r, 120));
}
console.log("ok", ok.length, "bad", bad.length);
for (const x of bad) console.log("BAD", JSON.stringify(x));
for (const x of ok.filter((o) => o.path.includes("anasayfa") || o.path.includes("dora-deri-sumen-takimi-9") || o.path.includes("blog") || o.path.includes("makam-panolari-3"))) {
  console.log("OK", x.path, x.status, "->", x.loc, "dest", x.destStatus);
}
