import fs from 'fs';
const b64 = process.argv[2];
const out = process.argv[3];
fs.writeFileSync(out, Buffer.from(fs.readFileSync(b64,'utf8').trim(), 'base64'));
