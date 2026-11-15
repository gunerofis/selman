import sharp from 'sharp';
import fs from 'fs';
const CORE="../yeni/ChatGPT Image 17 Haz 2026 20_37_34.png";
const UI  ="../yeni/ChatGPT Image 17 Haz 2026 20_37_31.png";
const OUT="out"; fs.mkdirSync(OUT,{recursive:true});
const JOBS=[
 [CORE,"hero",10,45,160,345],[CORE,"tile_ground",175,110,150,205],[CORE,"bg_main",365,40,470,335],
 [CORE,"door_goal",1035,40,165,340],[CORE,"ui_retry",1270,105,160,220],[CORE,"trap_spike",10,585,160,190],
 [CORE,"trap_ceiling_spike",185,555,155,230],[CORE,"trap_fakeplatform",362,595,220,155],
 [CORE,"trap_spring",635,550,170,240],[CORE,"trap_movingblock",860,595,165,175],
 [CORE,"deco_spike_plastic",10,830,160,190],[CORE,"door_runner",182,820,158,220],
 [UI,"ui_button_press",10,170,160,225],[UI,"fx_gas_zone",283,165,195,230],
 [UI,"ui_invert_indicator",503,190,130,175],[UI,"ui_countdown_frame",653,190,145,175],
 [UI,"ui_fake_victory",998,155,420,250],[UI,"fx_invisible_dust",12,645,235,255],
 [UI,"deco_sawblade",528,635,240,300],[UI,"deco_laser_beam",828,615,190,340],[UI,"deco_fireball",1078,615,340,340],
];
const TOL=52, tol2=TOL*TOL;
const NOBG=new Set(["bg_main","tile_ground"]);
function near(data,ci,pal){for(let k=0;k<pal.length;k+=3){const dr=data[ci]-pal[k],dg=data[ci+1]-pal[k+1],db=data[ci+2]-pal[k+2];if(dr*dr+dg*dg+db*db<tol2)return true;}return false;}
async function run(){
 for(const[sheet,name,x,y,w,h]of JOBS){
  let img=sharp(sheet).extract({left:x,top:y,width:w,height:h}).ensureAlpha();
  if(NOBG.has(name)){await img.png().toFile(`${OUT}/${name}.png`);console.log("rect",name);continue;}
  const{data,info}=await img.raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,ch=info.channels;
  // border-ring palette (subsampled)
  const pal=[];const add=(px,py)=>{const i=(py*W+px)*ch;pal.push(data[i],data[i+1],data[i+2]);};
  for(let px=0;px<W;px+=3){add(px,0);add(px,1);add(px,H-1);add(px,H-2);}
  for(let py=0;py<H;py+=3){add(0,py);add(1,py);add(W-1,py);add(W-2,py);}
  const bg=new Uint8Array(W*H);const q=[];
  const push=(px,py)=>{const i=py*W+px;if(!bg[i]&&near(data,i*ch,pal)){bg[i]=1;q.push(i);}};
  for(let px=0;px<W;px++){push(px,0);push(px,H-1);}for(let py=0;py<H;py++){push(0,py);push(W-1,py);}
  while(q.length){const i=q.pop();const px=i%W,py=(i/W|0);
   const nb=[[px-1,py],[px+1,py],[px,py-1],[px,py+1]];
   for(const[nx,ny]of nb){if(nx<0||ny<0||nx>=W||ny>=H)continue;const ni=ny*W+nx;if(bg[ni])continue;if(near(data,ni*ch,pal)){bg[ni]=1;q.push(ni);}}}
  let minx=W,miny=H,maxx=-1,maxy=-1;
  for(let i=0;i<W*H;i++){if(bg[i]){data[i*ch+3]=0;}else{const px=i%W,py=(i/W|0);if(px<minx)minx=px;if(px>maxx)maxx=px;if(py<miny)miny=py;if(py>maxy)maxy=py;}}
  if(maxx<0){console.log("EMPTY",name);continue;}
  await sharp(data,{raw:{width:W,height:H,channels:ch}}).extract({left:minx,top:miny,width:maxx-minx+1,height:maxy-miny+1}).png().toFile(`${OUT}/${name}.png`);
  console.log("cut",name,`${maxx-minx+1}x${maxy-miny+1}`);
 }
}
run();
