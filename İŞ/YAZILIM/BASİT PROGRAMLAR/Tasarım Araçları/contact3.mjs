import sharp from 'sharp';import fs from 'fs';
const dir="raw3"; const files=fs.readdirSync(dir).filter(f=>f.endsWith('.png')).sort();
const cell=220,cols=5,pad=8; const rows=Math.ceil(files.length/cols);
const W=cols*cell, H=rows*cell;
const comps=[];
for(let i=0;i<files.length;i++){
 const f=files[i];
 const buf=await sharp(`${dir}/${f}`).resize(cell-2*pad,cell-2*pad-16,{fit:'inside'}).toBuffer();
 const cx=(i%cols)*cell, cy=(Math.floor(i/cols))*cell;
 comps.push({input:buf,left:cx+pad,top:cy+pad});
 const svg=`<svg width="${cell}" height="16"><text x="4" y="13" font-size="13" fill="black">${f}</text></svg>`;
 comps.push({input:Buffer.from(svg),left:cx,top:cy+cell-16});
}
await sharp({create:{width:W,height:H,channels:4,background:{r:230,g:230,b:230,alpha:1}}})
 .composite(comps).png().toFile("contact3.png");
console.log("ok",W,H,files.length);
