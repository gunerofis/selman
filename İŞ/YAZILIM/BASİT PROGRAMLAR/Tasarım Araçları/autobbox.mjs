import sharp from 'sharp';
import fs from 'fs';
const CORE="../yeni/ChatGPT Image 17 Haz 2026 20_37_34.png";
const UI  ="../yeni/ChatGPT Image 17 Haz 2026 20_37_31.png";
const OUT="raw3"; fs.mkdirSync(OUT,{recursive:true});
const SHEET_W=1448, SHEET_H=1086;

const NOBG_JOBS = [
 [CORE,"bg_main",480,42,355,300],
 [CORE,"tile_ground",148,85,145,170],
];

const JOBS = [
 [CORE,"hero",0,0,300,450],
 [CORE,"door_goal",820,20,350,450],
 [CORE,"ui_retry",1110,20,330,400],
 [CORE,"trap_spike",0,500,320,300],
 [CORE,"trap_ceiling_spike",280,500,320,300],
 [CORE,"trap_fakeplatform",500,500,350,300],
 [CORE,"trap_spring",830,500,350,300],
 [CORE,"trap_movingblock",1110,500,330,300],
 [CORE,"deco_spike_plastic",0,780,320,300],
 [CORE,"door_runner",280,780,320,320],
 [UI,"ui_button_press",0,150,280,300],
 [UI,"fx_gas_zone",150,130,300,300],
 [UI,"ui_invert_indicator",420,130,280,300],
 [UI,"ui_countdown_frame",640,130,280,300],
 [UI,"ui_fake_victory",900,20,500,350],
 [UI,"fx_invisible_dust",0,600,280,350],
 [UI,"deco_sawblade",300,580,420,400],
 [UI,"deco_laser_beam",700,580,300,450],
 [UI,"deco_fireball",1040,560,350,450],
];

const MARGIN=12;
function clampWin(wl,wt,ww,wh){
  let left=Math.max(0,wl), top=Math.max(0,wt);
  let width=Math.min(ww, SHEET_W-left), height=Math.min(wh, SHEET_H-top);
  return {left,top,width,height};
}

async function bboxDetect(sheet,wl,wt,ww,wh){
  const win = clampWin(wl,wt,ww,wh);
  const {data,info}=await sharp(sheet).extract(win).raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,ch=info.channels;
  let minx=W,miny=H,maxx=-1,maxy=-1;
  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const i=(y*W+x)*ch;
      const r=data[i],g=data[i+1],b=data[i+2];
      const mx=Math.max(r,g,b);
      if(mx>=65){ if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y; }
    }
  }
  if(maxx<0) return null;
  const left=win.left+Math.max(0,minx-MARGIN);
  const top=win.top+Math.max(0,miny-MARGIN);
  const width=Math.min(win.width-(left-win.left), maxx-minx+1+2*MARGIN, SHEET_W-left);
  const height=Math.min(win.height-(top-win.top), maxy-miny+1+2*MARGIN, SHEET_H-top);
  return {left,top,width,height};
}

for(const [sheet,name,x,y,w,h] of NOBG_JOBS){
  await sharp(sheet).extract({left:x,top:y,width:w,height:h}).png().toFile(`${OUT}/${name}.png`);
  console.log("nobg",name,{x,y,w,h});
}

for(const [sheet,name,wl,wt,ww,wh] of JOBS){
  const bbox = await bboxDetect(sheet,wl,wt,ww,wh);
  if(!bbox){ console.log("FAIL",name); continue; }
  await sharp(sheet).extract(bbox).png().toFile(`${OUT}/${name}.png`);
  console.log("auto",name,bbox);
}
