const html = await (await fetch("https://www.sumentakimi.com.tr/", { headers: { "user-agent": "olay-close/1.0" } })).text();
const lines = html.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Sümen Takımı TR")) {
    const t = lines[i].replace(/\s+/g, " ").trim().slice(0, 220);
    console.log(i + 1, t);
  }
}
