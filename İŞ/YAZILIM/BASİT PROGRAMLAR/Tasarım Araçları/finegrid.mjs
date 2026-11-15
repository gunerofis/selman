import sharp from 'sharp';
const [,,src,out,y0,y1]=process.argv;
const Y0=+y0,Y1=+y1;
const meta=await sharp(src).metadata();
const W=meta.width;
const H=Y1-Y0;
const strip = await sharp(src).extract({left:0,top:Y0,width:W,height:H}).toBuffer();
let lines='';
for(let x=0;x<=W;x+=20){
  const major = x%100===0;
  lines+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${major?'red':'lime'}" stroke-width="${major?2:1}"/>`;
  if(major) lines+=`<text x="${x+2}" y="14" fill="yellow" font-size="14">${x}</text>`;
}
const svg=`<svg width="${W}" height="${H}">${lines}</svg>`;
await sharp(strip).composite([{input:Buffer.from(svg)}]).png().toFile(out);
console.log('done',W,H);
