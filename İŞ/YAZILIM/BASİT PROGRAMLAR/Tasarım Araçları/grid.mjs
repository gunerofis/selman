import sharp from 'sharp';
const [,,src,out]=process.argv;
const meta=await sharp(src).metadata();
const W=meta.width,H=meta.height;
let lines='';
for(let x=0;x<=W;x+=100){lines+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="red" stroke-width="2"/><text x="${x+2}" y="20" fill="yellow" font-size="22">${x}</text>`;}
for(let y=0;y<=H;y+=100){lines+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="red" stroke-width="2"/><text x="2" y="${y+22}" fill="cyan" font-size="22">${y}</text>`;}
const svg=`<svg width="${W}" height="${H}">${lines}</svg>`;
await sharp(src).composite([{input:Buffer.from(svg)}]).png().toFile(out);
console.log('done',W,H);
