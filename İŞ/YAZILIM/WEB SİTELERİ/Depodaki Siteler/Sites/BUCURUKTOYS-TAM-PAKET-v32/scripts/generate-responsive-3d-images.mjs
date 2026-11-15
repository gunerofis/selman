import { mkdir, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = join(repoRoot, "public", "assets", "3d", "products");
const files = (await readdir(sourceRoot)).filter((file) => file.endsWith(".webp")).sort();

for (const size of [320, 640]) {
  const outputRoot = join(sourceRoot, String(size));
  await mkdir(outputRoot, { recursive: true });
  for (const file of files) {
    const result = spawnSync("convert", [
      join(sourceRoot, file),
      "-strip",
      "-resize", `${size}x${size}>`,
      "-quality", size === 320 ? "84" : "89",
      join(outputRoot, file),
    ], { encoding: "utf8" });
    if (result.status !== 0) throw new Error(`3D görsel türevi oluşturulamadı: ${file}\n${result.stderr}`);
  }
}

console.log(JSON.stringify({ sourceImages: files.length, responsiveWidths: [320, 640], generated: files.length * 2 }, null, 2));
