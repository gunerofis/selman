import { mkdir, readdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

const tasks = [
  {
    sourceRoot: join(repoRoot, "public", "assets", "3d", "products"),
    sizes: [320, 640],
  },
  {
    sourceRoot: join(repoRoot, "public", "products"),
    sizes: [160, 320, 540],
  },
];

let totalSourceFiles = 0;
let totalGenerated = 0;

for (const task of tasks) {
  let sourceEntries;
  try {
    sourceEntries = await readdir(task.sourceRoot, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") continue;
    throw error;
  }

  const sourceImages = sourceEntries.filter((item) => item.isFile() && extname(item.name).toLowerCase() === ".webp");
  totalSourceFiles += sourceImages.length;

  for (const size of task.sizes) {
    const outputRoot = join(task.sourceRoot, String(size));
    await mkdir(outputRoot, { recursive: true });

    for (const file of sourceImages) {
      const sourcePath = join(task.sourceRoot, file.name);
      const outputPath = join(outputRoot, file.name);

      await sharp(sourcePath)
        .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
        .webp({ quality: size === 160 ? 78 : size === 320 ? 82 : 86 })
        .toFile(outputPath);
      totalGenerated++;
    }
  }
}

console.log(JSON.stringify({ sourceImages: totalSourceFiles, generated: totalGenerated }, null, 2));
