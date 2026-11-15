import sharp from 'sharp';import fs from 'fs';
const dir="out"; const files=fs.readdirSync(dir).filter(f=>f.endsWith('.png'));
const cell=200,cols=5,pad=10; const rows=Math.ceil(files.length/cols);
const W=cols*cell, H=rows*cell;
const comps=[];
for(let i=0;i<files.length;i++){
 const f=files[i];
 const buf=await sharp(`${dir}/${f}`).resize(cell-2*pad,cell-2*pad-16,{fit:'inside'}).toBuffer();
 const m=await sharp(buf).metadata();
 const cx=(i%cols)*cell, cy=(Math.floor(i/cols))*cell;
 comps.push({input:buf,left:cx+pad,top:cy+pad});
 const svg=`<svg width="${cell}" height="16"><text x="4" y="13" font-size="13" fill="white">${f}</text></svg>`;
 comps.push({input:Buffer.from(svg),left:cx,top:cy+cell-16});
}
await sharp({create:{width:W,height:H,channels:4,background:{r:255,g:0,b:255,alpha:1}}})
 .composite(comps).png().toFile("contact_out.png");
console.log("ok",W,H);
