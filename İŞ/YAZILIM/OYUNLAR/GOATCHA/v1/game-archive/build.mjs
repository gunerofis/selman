import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

const zipName = 'goatcha-build.zip';

if (existsSync(zipName)) {
  rmSync(zipName);
  console.log(`Deleted old ${zipName}`);
}

console.log('Zipping files (assets, src, index.html)...');
try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path 'assets', 'src', 'index.html' -DestinationPath '${zipName}' -Force"`);
  console.log(`✅ Successfully created ${zipName}!`);
  console.log('You can now upload this .zip file to Poki or CrazyGames.');
} catch (e) {
  console.error('❌ Build failed:', e.message);
  process.exit(1);
}
