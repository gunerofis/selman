import sharp from 'sharp';
const [,,src,out,x0,y0,w,h,scale]=process.argv;
const X0=+x0,Y0=+y0,W=+w,H=+h,SC=+scale||2;
const crop = await sharp(src).extract({left:X0,top:Y0,width:W,height:H}).toBuffer();
let lines='';
for(let x=0;x<=W;x+=50){
  const major = (X0+x)%100===0;
  lines+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${major?'red':'lime'}" stroke-width="1"/>`;
  if(major) lines+=`<text x="${x+2}" y="16" fill="yellow" font-size="16">${X0+x}</text>`;
}
for(let y=0;y<=H;y+=50){
  const major = (Y0+y)%100===0;
  lines+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${major?'orange':'cyan'}" stroke-width="1"/>`;
  if(major) lines+=`<text x="2" y="${y+14}" fill="orange" font-size="14">${Y0+y}</text>`;
}
const svg=`<svg width="${W}" height="${H}">${lines}</svg>`;
const gridded = await sharp(crop).composite([{input:Buffer.from(svg)}]).png().toBuffer();
await sharp(gridded).resize(Math.round(W*SC),Math.round(H*SC)).png().toFile(out);
console.log('done');
