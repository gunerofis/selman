import sharp from 'sharp';
import fs from 'fs';
const CORE="../yeni/ChatGPT Image 17 Haz 2026 20_37_34.png";
const UI  ="../yeni/ChatGPT Image 17 Haz 2026 20_37_31.png";
const OUT="raw2"; fs.mkdirSync(OUT,{recursive:true});
const JOBS=[
 [CORE,"hero",10,45,140,300],
 [CORE,"tile_ground",148,85,145,170],
 [CORE,"bg_main",480,42,355,300],
 [CORE,"door_goal",855,50,275,300],
 [CORE,"ui_retry",1160,55,260,280],
 [CORE,"trap_spike",10,545,265,165],
 [CORE,"trap_ceiling_spike",295,545,255,170],
 [CORE,"trap_fakeplatform",515,545,300,180],
 [CORE,"trap_spring",865,555,260,190],
 [CORE,"trap_movingblock",1160,555,255,190],
 [CORE,"deco_spike_plastic",20,815,250,190],
 [CORE,"door_runner",315,815,225,210],
 [UI,"ui_button_press",10,60,155,195],
 [UI,"fx_gas_zone",195,60,200,195],
 [UI,"ui_invert_indicator",460,60,170,195],
 [UI,"ui_countdown_frame",675,60,200,195],
 [UI,"ui_fake_victory",890,50,460,230],
 [UI,"fx_invisible_dust",5,635,190,255],
 [UI,"deco_sawblade",310,595,385,320],
 [UI,"deco_laser_beam",725,605,250,380],
 [UI,"deco_fireball",1080,600,290,370],
];
for(const[sheet,name,x,y,w,h]of JOBS){
  await sharp(sheet).extract({left:x,top:y,width:w,height:h}).png().toFile(`${OUT}/${name}.png`);
  console.log("raw2",name);
}
