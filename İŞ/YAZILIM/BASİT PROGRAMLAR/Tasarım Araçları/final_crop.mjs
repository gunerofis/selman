import sharp from 'sharp';
import fs from 'fs';
const CORE="../yeni/ChatGPT Image 17 Haz 2026 20_37_34.png";
const UI  ="../yeni/ChatGPT Image 17 Haz 2026 20_37_31.png";
const OUT="final"; fs.mkdirSync(OUT,{recursive:true});

const NOBG_JOBS = [ [CORE,"bg_main",461,97,545,322] ];

const JOBS = [
 [CORE,"hero",32,129,184,250],
 [CORE,"tile_ground",247,209,185,174],
 [CORE,"door_goal",1023,110,212,288],
 [CORE,"ui_retry",1255,195,162,158],
 [CORE,"trap_spike",28,586,260,154],
 [CORE,"trap_ceiling_spike",322,569,238,169],
 [CORE,"trap_fakeplatform",581,596,275,149],
 [CORE,"trap_spring",905,576,178,175],
 [CORE,"trap_movingblock",1134,597,285,141],
 [CORE,"deco_spike_plastic",50,827,202,173],
 [CORE,"door_runner",326,811,228,201],
 [UI,"ui_button_press",26,202,215,155],
 [UI,"fx_gas_zone",270,142,264,249],
 [UI,"ui_invert_indicator",567,177,182,174],
 [UI,"ui_countdown_frame",768,139,200,261],
 [UI,"ui_fake_victory",998,122,418,302],
 [UI,"fx_invisible_dust",54,697,160,189],
 [UI,"deco_sawblade",322,636,369,311],
 [UI,"deco_laser_beam",797,612,187,357],
 [UI,"deco_fireball",1137,615,205,360],
];

for(const [sheet,name,x,y,w,h] of NOBG_JOBS){
  await sharp(sheet).extract({left:x,top:y,width:w,height:h}).png().toFile(`${OUT}/${name}.png`);
  console.log("nobg",name);
}
for(const [sheet,name,x,y,w,h] of JOBS){
  await sharp(sheet).extract({left:x,top:y,width:w,height:h}).png().toFile(`${OUT}/${name}.png`);
  console.log("final",name);
}
