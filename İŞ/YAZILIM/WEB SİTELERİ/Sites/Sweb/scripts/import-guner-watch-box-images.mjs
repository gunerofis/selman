import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const outputDir = path.resolve("public/gunerofis-watch-boxes");

export const GUNER_WATCH_IMAGE_URLS = {
  "gnrs06-bordo":
    "https://www.gunerofis.com/i/l/000/0003591_cam-kapakli-saat-gozluk-ve-yuzuk-kutusu-bordo.png",
  "gnrs06-kahve":
    "https://www.gunerofis.com/i/l/000/0003565_cam-kapakli-saat-gozluk-ve-yuzuk-kutusu-kahve.png",
  "gnrs06-krem":
    "https://www.gunerofis.com/i/l/000/0003573_cam-kapakli-saat-gozluk-ve-yuzuk-kutusu-krem.png",
  "gnrs06-siyah":
    "https://www.gunerofis.com/i/l/000/0003557_cam-kapakli-saat-gozluk-ve-yuzuk-kutusu-siyah.png",
  "gnrs06-taba":
    "https://www.gunerofis.com/i/l/000/0003581_cam-kapakli-saat-gozluk-ve-yuzuk-kutusu-taba.png",
  "gnrs04-bordo":
    "https://www.gunerofis.com/i/l/000/0003624_cam-kapakli-saat-ve-gozluk-kutusu-bordo.png",
  "gnrs04-kahve":
    "https://www.gunerofis.com/i/l/000/0003601_cam-kapakli-saat-ve-gozluk-kutusu-kahve.png",
  "gnrs04-krem":
    "https://www.gunerofis.com/i/l/000/0003609_cam-kapakli-saat-ve-gozluk-kutusu-krem.png",
  "gnrs04-siyah":
    "https://www.gunerofis.com/i/l/000/0003595_cam-kapakli-saat-ve-gozluk-kutusu-siyah.png",
  "gnrs04-taba":
    "https://www.gunerofis.com/i/l/000/0003614_cam-kapakli-saat-ve-gozluk-kutusu-taba.png",
  "gnrs05-bordo":
    "https://www.gunerofis.com/i/l/000/0003643_cekmeceli-12li-saat-ve-6li-gozluk-kutusu-bordo.png",
  "gnrs05-kahve":
    "https://www.gunerofis.com/i/l/000/0003635_cekmeceli-12li-saat-ve-6li-gozluk-kutusu-kahve.png",
  "gnrs05-krem":
    "https://www.gunerofis.com/i/l/000/0003638_cekmeceli-12li-saat-ve-6li-gozluk-kutusu-krem.png",
  "gnrs05-siyah":
    "https://www.gunerofis.com/i/l/000/0003627_cekmeceli-12li-saat-ve-6li-gozluk-kutusu-siyah.png",
  "gnrs05-taba":
    "https://www.gunerofis.com/i/l/000/0003651_cekmeceli-12li-saat-ve-6li-gozluk-kutusu-taba.png",
  "gnrs03-bordo": "https://www.gunerofis.com/i/l/000/0003552_saat-kutusu-12li-bordo.png",
  "gnrs03-kahve": "https://www.gunerofis.com/i/l/000/0003523_saat-kutusu-12li-kahve.png",
  "gnrs03-krem": "https://www.gunerofis.com/i/l/000/0003533_saat-kutusu-12li-krem.png",
  "gnrs03-siyah": "https://www.gunerofis.com/i/l/000/0003514_saat-kutusu-12li-siyah.png",
  "gnrs03-taba": "https://www.gunerofis.com/i/l/000/0003543_saat-kutusu-12li-taba.png",
  "gnrs07-bordo":
    "https://www.gunerofis.com/i/l/000/0003684_saat-kutusu-12li-cekmeceli-cam-kapakli-tesbih-ve-aksesuar-saklama-organizeri-bordo.png",
  "gnrs07-kahve":
    "https://www.gunerofis.com/i/l/000/0003663_saat-kutusu-12li-cekmeceli-cam-kapakli-tesbih-ve-aksesuar-saklama-organizeri-kahve.png",
  "gnrs07-krem":
    "https://www.gunerofis.com/i/l/000/0003669_saat-kutusu-12li-cekmeceli-cam-kapakli-tesbih-ve-aksesuar-saklama-organizeri-krem.png",
  "gnrs07-siyah":
    "https://www.gunerofis.com/i/l/000/0003656_saat-kutusu-12li-cekmeceli-cam-kapakli-tesbih-ve-aksesuar-saklama-organizeri-siyah.png",
  "gnrs07-taba":
    "https://www.gunerofis.com/i/l/000/0003676_saat-kutusu-12li-cekmeceli-cam-kapakli-tesbih-ve-aksesuar-saklama-organizeri-taba.png",
  "gnrs01-bordo": "https://www.gunerofis.com/i/l/000/0003464_saat-kutusu-6li-bordo.png",
  "gnrs01-kahve": "https://www.gunerofis.com/i/l/000/0003451_saat-kutusu-6li-kahve.png",
  "gnrs01-krem": "https://www.gunerofis.com/i/l/000/0003455_saat-kutusu-6li-krem.png",
  "gnrs01-siyah": "https://www.gunerofis.com/i/l/000/0003444_saat-kutusu-6li-siyah.png",
  "gnrs01-taba": "https://www.gunerofis.com/i/l/000/0003474_saat-kutusu-6li-taba.png",
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await mkdir(outputDir, { recursive: true });

  for (const [id, url] of Object.entries(GUNER_WATCH_IMAGE_URLS)) {
    const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    const original = Buffer.from(await response.arrayBuffer());
    for (const width of [480, 960]) {
      const output = await sharp(original)
        .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 84, effort: 5 })
        .toBuffer();
      await writeFile(path.join(outputDir, `${id}-${width}.webp`), output);
    }
  }

  console.log(
    `Imported ${Object.keys(GUNER_WATCH_IMAGE_URLS).length} product images into ${outputDir}`,
  );
}
