import sharp from 'sharp';
const S="../yeni/ChatGPT Image 17 Haz 2026 20_37_34.png";
const cells=[["hero",10,45,160,345],["trap_spring",635,550,170,240],["door_goal",1035,40,165,340]];
const comps=[];let xo=0;
for(const[n,x,y,w,h]of cells){const b=await sharp(S).extract({left:x,top:y,width:w,height:h}).resize(180,null).png().toBuffer();comps.push({input:b,left:xo,top:10});xo+=200;}
await sharp({create:{width:xo+10,height:420,channels:4,background:{r:255,g:0,b:255,alpha:1}}}).composite(comps).png().toFile("raw_check.png");
console.log("ok");
