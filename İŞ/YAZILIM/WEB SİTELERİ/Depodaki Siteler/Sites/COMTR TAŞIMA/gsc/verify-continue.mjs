import { readFileSync } from "node:fs";
const prod = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/prod-olcu.html", "utf8");
const home = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/home-now.html", "utf8");
const rehber = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/rehber-now.html", "utf8");
const col = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/col-deri2.html", "utf8");
const art = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/art-ld.html", "utf8");
console.log(
  JSON.stringify(
    {
      olcuOnProduct: /48x34 cm/.test(prod) && /<dt>Ölçü<\/dt>/.test(prod),
      makroOnProduct: /Makro Ofis/.test(prod),
      homeSss: /href="\/pages\/sss"/.test(home),
      rehberNedirArticle: /sumen-takimi-nedir-ve-hangi-parcalardan-olusur/.test(rehber),
      rehberRenk: /siyah-kahve-taba-ve-bordo-sumen-renk-rehberi/.test(rehber),
      colFaq: /Deri sümen takımı nasıl temizlenir/.test(col),
      articleLd: /BlogPosting/.test(art),
      liquid: /Liquid error/i.test(prod + home + rehber + col + art),
    },
    null,
    2
  )
);
