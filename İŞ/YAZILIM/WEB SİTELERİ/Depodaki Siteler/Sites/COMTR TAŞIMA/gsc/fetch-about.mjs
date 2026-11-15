const html = await (await fetch("https://www.sumentakimi.com.tr/pages/about-us", { headers: { "user-agent": "sumentakimi-seo-audit/2.0" } })).text();
const m = html.match(/<div class="rte">([\s\S]*?)<\/div>/);
console.log(m ? m[1] : "NO RTE");
