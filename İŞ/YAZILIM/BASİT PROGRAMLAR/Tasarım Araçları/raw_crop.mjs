import sharp from 'sharp';
import fs from 'fs';
const CORE="../yeni/ChatGPT Image 17 Haz 2026 20_37_34.png";
const UI  ="../yeni/ChatGPT Image 17 Haz 2026 20_37_31.png";
const OUT="raw"; fs.mkdirSync(OUT,{recursive:true});
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
for(const[sheet,name,x,y,w,h]of JOBS){
  await sharp(sheet).extract({left:x,top:y,width:w,height:h}).png().toFile(`${OUT}/${name}.png`);
  console.log("raw",name);
}
