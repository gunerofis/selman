// Final atlas entries accept an embedded data URL, clip arrays, frame rectangles and per-frame foot/hand anchors.
const atlasDefs=JSON.parse(document.getElementById('asset-manifest').textContent).atlases;
// Atlas sayfaları HTML'e gömülü değil; ilk kullanımda yandaki klasörden yüklenir.
const atlasImages={};
function atlasImage(key){
 if(key in atlasImages)return atlasImages[key];
 const entry=atlasDefs[key];let im=null;
 try{if(entry?.src){im=new Image();im.src=entry.src;}}catch(e){im=null;}
 atlasImages[key]=im;return im;
}
// Oyundaki düşman kimliği ile atlas adını eşler.
const atlasAlias={haydut:'mob_koy_haydut',baskinci:'mob_koy_baskinci',yaban_kopek:'mob_koy_yaban_kopek',kopru_haraci:'boss_koy_1',trial_0:'arena_rival_guard',trial_1:'arena_rival_hunter',trial_2:'arena_rival_warden',trial_3:'boss_daily',trial_4:'boss_world',trial_5:'boss_guild',trial_6:'guild_war_rival'};
function atlasFor(id){
 if(atlasDefs[id])return id;
 if(atlasAlias[id]&&atlasDefs[atlasAlias[id]])return atlasAlias[id];
 const m=/^(.+)_basi$/.exec(id||'');
 return m&&atlasDefs['boss_'+m[1]+'_1']?'boss_'+m[1]+'_1':null;
}
function atlasPose(c,key,clip,time,x,y,height){
 const def=atlasDefs[key],picture=atlasImage(key),sequence=def?.clips?.[clip];
 if(!picture?.complete||!picture.naturalWidth||!sequence?.length)return null;
 const frame=def.frames[sequence[Math.floor(time/(def.frameMs||100))%sequence.length]];
 if(!frame)return null;
 const [sx,sy,w,h]=frame.rect,foot=frame.foot||[w/2,h],hand=frame.hand,scale=height/(def.logicalHeight||h);
 c.drawImage(picture,sx,sy,w,h,x-foot[0]*scale,y-foot[1]*scale,w*scale,h*scale);
 return {x:hand?x+(hand[0]-foot[0])*scale:x,y:hand?y+(hand[1]-foot[1])*scale:y,hand:!!hand,scale};
}
const images={};
for(const [key,src] of Object.entries(ART)){if(key.startsWith('room_')){document.documentElement.style.setProperty('--'+key,'url('+src+')');continue;}const im=new Image();im.src=src;images[key]=im;}
document.documentElement.style.setProperty('--valley','url('+ART.valley+')');
for(const [name,key] of [['yakut','icon_stone_yakut'],['zumrut','icon_stone_zumrut'],['slot','frame_slot'],['btn','btn_primary'],['btn2','btn_secondary'],['panel','frame_panel']])
 if(ART[key])document.documentElement.style.setProperty('--art-'+name,'url('+ART[key]+')');
if(ART.frame_slot&&ART.btn_primary&&ART.frame_panel)document.documentElement.setAttribute('data-frames','true');
function img(ctx,key,x,y,w,h){const image=images[key];if(image?.complete&&image.naturalWidth)ctx.drawImage(image,x,y,w,h);}
function shape(c,path,fill,stroke,width=2){let p=new Path2D(path);if(fill){c.fillStyle=fill;c.fill(p);}if(stroke){c.lineWidth=width;c.strokeStyle=stroke;c.lineJoin='round';c.stroke(p);}}
function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,Math.max(0.1,rx),Math.max(.1,ry),0,0,Math.PI*2);c.fillStyle=color;c.fill();}
function blade(c,key){const sword=key==='item_kilic';shape(c,sword?'M-3 3 L24 -64 L32 -79 L29 -60 L4 4Z':'M-3 3 L10 -28 L18 -40 Q20 -14 4 4Z','#d6e1db','#403b34',1.7);shape(c,'M-8 0 L10 5 L11 9 L-8 5Z','#ba9357','#382d24',1);shape(c,'M0 5 L4 7 L0 18 L-4 16Z','#603a2d','#302a23',1);}
function heroArt(c,x,foot,height,key,action=0,guard=false){wingArt(c,x,foot,height);const clip=guard?'guard':action>0?(fight?.enemyHp.filter(n=>n>0).length>1?'sweep':'attack'):fight&&fight.at<820?'run':'idle';
 const clock=fight?.at||0,pose=atlasPose(c,fight?'hero_'+clip:'hero_hub',clip,clock,x,foot,height);
 if(pose){if(pose.hand){c.save();c.translate(pose.x,pose.y);if(!atlasPose(c,key.replace('item_','wear_'),clip,clock,0,0,height*.38)){c.scale(height/360,height/360);blade(c,key);}c.restore();}return;}
 const w=height*1.04;c.save();c.translate(x+action*height*.055,foot);c.rotate(action*.023);img(c,'hero',-w*.57,-height,w,height);c.save();c.translate(w*.334,-height*.456);c.scale(height/360,height/360);c.rotate(action*1.1);blade(c,key);c.restore();c.restore();}
function hound(c,x,y,h,attackPose){
 if(atlasPose(c,'mob_koy_yaban_kopek',attackPose?'attack':'idle',fight?.at||0,x,y,h))return;
 c.save();c.translate(x-attackPose*6,y);c.scale(h/124,h/124);
 const ink='#302f2b',fur='#674e3d',pale='#baa17b';
 const draw=(p,color)=>shape(c,p,color,ink,2.4);
 draw('M-45 -62 L-23 -57 L-30 -31 L-44 -5 L-59 -4 L-59 -9 L-51 -15Z','#534735');
 draw('M18 -69 L43 -63 L38 -39 L54 -23 L47 -5 L32 -4 L38 -14 L37 -22 L14 -39Z','#4e4235');
 draw('M-58 -81 Q-37 -94 -7 -78 Q17 -71 36 -85 Q51 -85 57 -71 L66 -72 Q83 -76 84 -96 Q94 -77 80 -61 Q71 -50 52 -52 L42 -41 L47 -18 L40 -4 L22 -3 L24 -10 L32 -15 L27 -36 L13 -54 Q-6 -50 -25 -58 L-33 -27 L-29 -12 L-34 -4 L-51 -3 L-49 -12 L-43 -15 L-48 -39 L-62 -53Z',fur);
 draw('M-44 -79 L-51 -101 L-67 -116 L-70 -99 L-83 -108 L-84 -88 L-92 -78 L-108 -73 L-103 -64 L-84 -62 L-77 -54 L-60 -57 L-48 -66Z',fur);
 shape(c,'M-96 -69 L-80 -72 L-70 -64 L-52 -68 L-57 -54 L-66 -48 L-81 -60 L-98 -64Z',pale);
 shape(c,'M-108 -74 L-100 -74 L-100 -70 L-106 -68Z',ink);
 shape(c,'M-88 -81 L-78 -84 L-83 -78Z','#e0ba73',ink,1);
 shape(c,'M-60 -86 L-42 -79 L-21 -76 L-34 -67 L-50 -70Z','#80664c');
 c.restore();
}
const characterArt={trial_0:'arena_rival_guard',trial_1:'arena_rival_hunter',trial_2:'arena_rival_warden',kopru_haraci:'boss_koy_1'};
// Boyalı düşman seçimi: kendi görseli (foe_<id>) → bölüme özel eşleme → biçim görseli (foe_form_<biçim>) → mevcut üç boyalı figür.
const formArt={ward:'arena_rival_guard',beast:'arena_rival_hunter',shade:'arena_rival_warden'};
const koyForm={haydut:'ward',baskinci:'ward',yaban_kopek:'beast',kopru_haraci:'ward'};
function foeForm(type){return enemyInfo[type]?.form||koyForm[type]||'ward';}
function foeKey(type){
 if(images['foe_'+type])return 'foe_'+type;
 if(characterArt[type])return characterArt[type];
 if(!enemyInfo[type]&&!koyForm[type])return null;
 const form=foeForm(type);return images['foe_form_'+form]?'foe_form_'+form:formArt[form];
}
function drawCharacterArt(c,x,y,h,type,hit=0,windup=false){
 const clip=windup?'heavy_windup':hit>0?'attack':'idle';
 const atlas=atlasFor(type);
 if(atlas&&atlasPose(c,atlas,clip,fight?.at||0,x,y,h))return true;
 const key=foeKey(type);if(!key)return false;
 if(atlasPose(c,key,clip,fight?.at||0,x,y,h))return true;
 const picture=images[key];if(!picture?.complete||!picture.naturalWidth)return false;
 const width=h*picture.naturalWidth/picture.naturalHeight,motion=state?.settings?.motion!==false;
 c.save();c.translate(x-(motion?hit*h*.035:0),y);if(motion)c.rotate(windup?.035:-hit*.018);
 c.drawImage(picture,-width*.5,-h,width,h);c.restore();return true;
}
function figure(c,x,y,h,type,hit,windup){
    if(drawCharacterArt(c,x,y,h,type,hit,windup))return;

    const form=enemyInfo[type]?.form;
    if(form==='shade')return spirit(c,x,y,h,windup);
    if(form==='beast')return hound(c,x,y,h*.88,hit);
    if(type==='yaban_kopek')return hound(c,x,y,h,hit);
    const boss=type==='kopru_haraci'||form==='ward',raid=type==='baskinci';
 const clip=windup?'heavy_windup':hit>0?'attack':'idle';
 if(atlasPose(c,boss?'boss_koy_1':raid?'mob_koy_baskinci':'mob_koy_haydut',clip,fight?.at||0,x,y,h))return;
    c.save();c.translate(x-(windup?0:hit*5),y);c.scale(h/200,h/200);c.rotate(windup?0.07:-.025*hit);
    const dark='#282b2c',edge='#252a29',cloth=boss?'#803b2e':raid?'#455a5d':'#79543e',trim=boss?'#d0a26c':'#b69d70';
    const S=(p,fill,st=edge,l=2.8)=>shape(c,p,fill,st,l);
    S('M-25 -96 L-1 -90 L-3 -55 L-17 -12 L-41 -7 L-31 -53Z','#3c3932');S('M3 -97 L29 -92 L37 -58 L33 -10 L13 -5 L8 -52Z','#47443b');
    S('M-20 -18 L-16 -5 L-22 0 L-57 0 L-57 -6 L-38 -16Z',dark);S('M12 -17 L34 -17 L42 -4 L35 0 L9 0Z',dark);
    S('M-22 -157 Q-38 -151 -39 -124 L-48 -69 L-31 -56 L-17 -75 L7 -65 L21 -77 L39 -65 L37 -115 L25 -149Z',cloth);
    for(let i=0;i<4;i++)S('M-28 '+(-129+i*9)+' Q-9 '+(-117+i*8)+' 23 '+(-126+i*7)+' L21 '+(-119+i*7)+' Q-7 '+(-112+i*8)+' -27 '+(-122+i*9)+'Z',i%2?'#4c4b43':'#655e4b',edge,1);
    S('M-32 -103 L26 -105 L26 -96 L-33 -92Z',trim);S('M-19 -96 L-8 -96 L-15 -66 L-26 -54Z',boss?'#b64d39':cloth);
    S('M-15 -170 L8 -171 L14 -150 L-3 -140 L-21 -151Z','#b99979');
    S('M-28 -181 L-14 -194 L9 -190 L19 -177 L12 -155 L2 -150 L-12 -153 L-26 -164Z','#c7a17c');
    S('M-24 -170 L10 -167 L5 -151 L-8 -147 L-22 -154Z',dark);S('M-26 -178 L-10 -179 L-13 -175 L-24 -174Z','#eee3cd',edge,1);
    if(boss){S('M-33 -180 Q-25 -207 2 -204 Q25 -199 24 -178 L33 -173 L-28 -175Z','#555649');S('M-22 -198 L-32 -216 L-15 -205 L-3 -196Z',trim);S('M-3 -200 L15 -218 L11 -199Z',trim);}
    else if(raid){S('M-36 -178 L-15 -198 L5 -201 L29 -177 L39 -172 L12 -174Z','#a58152');S('M-35 -177 L39 -172',null,edge,3);}
    else S('M-31 -177 Q-23 -201 -7 -199 Q14 -196 20 -178 L24 -158 L12 -148 L7 -173 L-15 -182Z',cloth);
    S('M8 -151 Q25 -161 37 -145 L41 -125 L29 -108 L19 -117 L24 -132Z','#575948');S('M19 -152 L32 -150 L44 -133 L25 -134Z',trim);
    c.save();c.translate(-23,-134);c.rotate(windup?-.95:hit*.5);
    S('M0 -13 L11 -7 L3 14 L-20 30 L-29 17 L-12 5Z',cloth);S('M-27 12 L-18 21 L-27 30 L-38 22Z','#b78e69');
    if(boss){S('M-31 29 L-74 -85 L-69 -88 L-24 28Z','#856440');S('M-71 -83 Q-97 -86 -104 -65 Q-106 -101 -85 -112 L-69 -103 L-58 -110 L-52 -99Z','#adb6a8');}
    else S(raid?'M-29 21 L-74 -59 L-77 -73 L-65 -63 L-22 18Z':'M-30 21 L-58 -15 L-62 -32 L-48 -24 L-22 18Z','#bbc8bd');
    c.restore();c.restore();
}
function encounterBackdrop(c,w,h,stage){
 // Her savaş boyalı sahnede: düello avlusu → bölgeye özel bg_<bölge> → boss mağarası → av kampı.
 const e=encounters[stage],duel=e.kind==='arena'||e.kind==='guildWar';
 const bossy=e.final||['regional','daily','world','guildBoss'].includes(e.kind)||e.enemies?.[0]?.id==='kopru_haraci';
 const own=images['bg_'+regions[regionOf(stage)]?.[1]];
 if(!duel&&own?.complete&&own.naturalWidth){
  const s=Math.max(w/own.naturalWidth,h/own.naturalHeight),vw=w/s,vh=h/s;
  c.drawImage(own,(own.naturalWidth-vw)/2,(own.naturalHeight-vh)/2,vw,vh,0,0,w,h);return true;
 }
 const tile=duel?3:bossy?2:0,picture=images.scene_4;
 if(!picture?.complete||!picture.naturalWidth)return false;
 const sw=picture.naturalWidth/2,sh=picture.naturalHeight/2,scale=Math.max(w/sw,h/sh),vw=w/scale,vh=h/scale;
 c.save();if(tile===0&&e.kind!=='hunt'&&stage!==HUNT){c.translate(w,0);c.scale(-1,1);}
 c.drawImage(picture,(tile%2)*sw+(sw-vw)/2,Math.floor(tile/2)*sh+(sh-vh)/2,vw,vh,0,0,w,h);c.restore();return true;
}
function landscape(c,w,h,stage){
    if(encounterBackdrop(c,w,h,stage))return;

    const region=regionOf(stage);if(region)return regionBackdrop(c,w,h,region);
    c.save();c.scale(w/1000,h/440);
    const sky=c.createLinearGradient(0,0,0,440);sky.addColorStop(0,'#7f989d');sky.addColorStop(.65,'#d9c6a6');sky.addColorStop(1,'#aa997c');c.fillStyle=sky;c.fillRect(0,0,1000,440);
    ellipse(c,750,84,53,53*(w/1000)/(h/440),'#bb6850');
    for(let layer=0;layer<3;layer++){c.beginPath();c.moveTo(0,350);for(let i=-1;i<=24;i++){const x=i*47,base=150+layer*43;const y=base+Math.sin(i*1.9+layer)*23+Math.cos(i*.75+layer)*29;c.lineTo(x,y);}c.lineTo(1050,440);c.lineTo(0,440);c.closePath();c.fillStyle=['#98a6a3','#819598','#596f71'][layer];c.fill();}
    function house(x,y,size){c.save();c.translate(x,y);c.scale(size,size);shape(c,'M-30 0 L28 1 L27 -29 L-30 -28Z','#8f8775','#485553',2);shape(c,'M-43 -23 Q-28 -28 0 -54 Q23 -31 42 -24 L29 -19 L-30 -20Z','#46595a','#354649',2);shape(c,'M-10 0 L-9 -20 L3 -21 L4 0Z','#4d5856');c.restore();}
    for(let i=0;i<9;i++)house(50+i*118,242+Math.sin(i*2)*8,.55+(i%3)*.15);
    if(stage===HUNT){
        c.save();c.translate(170,247);
        shape(c,'M-31 0 L-20 -83 L15 -83 L31 0Z','#b1a386','#52615a',2);
        shape(c,'M-31 -78 L-3 -108 L26 -79Z','#596960','#45544f',2);
        shape(c,'M-7 0 L-7 -20 Q0 -30 9 -20 L9 0Z','#586055');
        c.translate(0,-70);c.rotate(.25);
        for(let i=0;i<4;i++){shape(c,'M-2 0 L-3 -56 L-15 -55 L-11 -18 L-3 -13Z','#87795f','#4e594f',2);c.rotate(Math.PI/2);}
        ellipse(c,0,0,4,4,'#504737');c.restore();
    }
    shape(c,'M0 278 Q270 237 505 271 T1000 247 L1000 440 L0 440Z','#707966');
    shape(c,'M0 325 Q245 283 508 306 T1000 288 L1000 440 L0 440Z','#ac9c7f');
    if(stage===2||stage===BRIDGE){shape(c,'M0 306 Q490 259 1000 297 L1000 338 Q500 296 0 345Z','#837763','#514f45',3);for(let i=0;i<11;i++){let xx=i*102;shape(c,'M'+xx+' 314 l0 -33 l9 -1 l0 34Z','#625b4c');}}
    for(let j=0;j<6;j++){const xx=75+j*164,yy=279+Math.sin(j*1.6)*8;shape(c,'M'+xx+' '+yy+' l0 -19 l4 0 l0 19Z','#625d4e');shape(c,'M'+xx+' '+(yy-10)+' l80 -3',null,'#706957',3);}
    for(let i=0;i<32;i++){const x=(i*173)%1000,y=332+(i*47)%108;shape(c,'M'+x+' '+y+' l'+(6+i%16)+' -2',null,'#867d68',1.1);}
    for(const x of [40,944]){shape(c,'M'+x+' 295 l3 -132 l5 0 l-1 133Z','#494642');shape(c,'M'+(x+7)+' 176 q28 7 51 -1 l-8 49 l-14 -7 l-8 10 l-22 -4Z','#884a3a','#55483a',1.5);}
    c.restore();
}
function drawFox(c,x,y,size){
 if(images.pet_tilki?.naturalWidth){const im=images.pet_tilki,w=size*1.9*im.naturalWidth/im.naturalHeight;c.drawImage(im,x-w/2,y-size*1.9,w,size*1.9);return;}
 c.save();c.translate(x,y);c.scale(size/95,size/95);
 const draw=(p,fill)=>shape(c,p,fill,'#3b3329',2);
 draw('M-6 -46 Q-34 -88 -53 -65 Q-42 -29 -13 -24Z','#a35d35');shape(c,'M-53 -65 Q-40 -77 -27 -61 L-30 -53 L-44 -47Z','#e1ceb0');
 draw('M-21 -18 Q-30 -48 -8 -58 L6 -62 L8 -84 L21 -71 L30 -83 L33 -61 L46 -54 L34 -49 L23 -47 L14 -28 L17 -5 L4 -2 L0 -21 L-8 -5 L-27 -5Z','#bc7445');
 shape(c,'M11 -63 L24 -56 L39 -56 L31 -49 L21 -45 L16 -36 L5 -49Z','#e8d6b4');ellipse(c,28,-61,2.5,2,'#252421');c.restore();
}
function drawAura(c,x,y,size){
 const id=state.slots.auras;if(!id)return;
 if(images.aura_halka?.naturalWidth){const w=size*1.05,h=w*images.aura_halka.naturalHeight/images.aura_halka.naturalWidth;c.save();c.globalAlpha=.85;c.drawImage(images.aura_halka,x-w/2,y-h*.62,w,h);c.restore();return;}
 c.save();c.translate(x,y);c.strokeStyle=id==='sis'?'#c0dad9':'#90b582';c.fillStyle=c.strokeStyle;c.lineWidth=2;
 c.beginPath();c.ellipse(0,0,size*.4,size*.068,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<8;i++){const a=Math.PI*i/4,dx=Math.cos(a)*size*.40,dy=Math.sin(a)*size*.068;c.beginPath();c.ellipse(dx,dy,4,1.6,a,0,Math.PI*2);c.fill();}c.restore();
}
function wingArt(c,x,y,size){
 const id=state.slots.wings;if(!id)return;
 const art=images['wing_'+id];if(art?.naturalWidth){const w=size*1.5,h=w*art.naturalHeight/art.naturalWidth;c.drawImage(art,x-w*.5,y-size*.93,w,h);return;}c.save();c.translate(x-size*.04,y-size*.64);c.scale(size/230,size/230);
 for(let i=6;i>=0;i--){c.save();c.rotate(i*.12);shape(c,'M1 4 Q-41 -4 -74 -58 Q-62 -16 -33 6 Q-13 18 1 4Z',id==='turna'?(i%2?'#d8d4bf':'#b7b9ad'):(i%2?'#404956':'#56616b'),'#3f4949',1.4);c.restore();}c.restore();
}
function regionBackdrop(c,w,h,r){
 const data=regions[r],type=data[7];c.save();c.scale(w/1000,h/440);
 const sky=c.createLinearGradient(0,0,0,440);sky.addColorStop(0,data[8]);sky.addColorStop(.68,'#d4cab7');sky.addColorStop(1,data[9]);c.fillStyle=sky;c.fillRect(0,0,1000,440);
 ellipse(c,755-r*13,78,40,40*(w/1000)/(h/440),'#ded0aa');
 for(let j=0;j<3;j++){c.beginPath();c.moveTo(-50,440);for(let i=-1;i<=25;i++)c.lineTo(i*48,135+j*47+Math.sin(i*.8+r)*26+Math.cos(i*2.2+r+j)*15);c.lineTo(1100,440);c.closePath();c.fillStyle=['#a4aaa0','#8b9794',data[9]][j];c.fill();}
 const ink='#4e5c59';
 for(let k=0;k<15;k++){const x=(r*61+k*127)%1050-25,y=251+Math.sin(k*2.3+r)*19,hg=22+(k*17+r*7)%51;c.save();c.translate(x,y);c.scale(hg/58,hg/58);
  if(type==='wood'||type==='marsh'){shape(c,'M-3 0 L0 -47 L4 -47 L3 0Z',ink);if(r===5){shape(c,'M-28 -30 Q-18 -65 2 -61 Q24 -61 31 -35 Q8 -29 -28 -30Z','#827485',ink);}else shape(c,'M-21 -16 L-9 -34 L-15 -31 L3 -66 L18 -35 L12 -39 L23 -19Z',r%2?'#536c62':'#637466');}
  else if(type==='ruin'){shape(c,'M-14 0 L-13 -45 L-18 -46 L-17 -55 L12 -55 L15 -47 L9 -45 L8 0Z','#727c76',ink);}
  else if(type==='ice'||type==='mine'){shape(c,'M-18 0 L-23 -26 L-12 -43 L-2 -19 L4 -61 L14 -66 L22 -40 L12 -2Z',type==='ice'?'#a5bac0':'#716d6b',ink);shape(c,'M4 -3 L14 -63 L19 -40Z',type==='ice'?'#d7e0d8':'#919084');}
  else if(type==='coast'){shape(c,'M-23 0 Q-5 -19 22 -9 L35 -1Z','#747e78');shape(c,'M-28 5 Q-3 -1 33 5',null,'#cedbd2',2);}
  else{shape(c,'M-41 3 Q-4 -31 32 -8 L44 3Z','#b9a080');}
  c.restore();
 }
 shape(c,'M0 334 Q255 283 487 318 T1000 303 L1000 440 L0 440Z',data[9]);for(let i=0;i<52;i++){const x=(i*139+r*31)%1000,y=330+(i*37)%107;shape(c,'M'+x+' '+y+' l'+(5+i%17)+' -2',null,'#6f726a',1);}
 c.restore();
}
function spirit(c,x,y,h,windup){
 c.save();c.translate(x,y);c.scale(h/170,h/170);c.rotate(windup?-.1:0);
 shape(c,'M-8 -165 Q-39 -158 -32 -130 L-45 -102 L-42 -74 L-56 -29 L-36 -42 L-29 -17 L-13 -24 L-7 -1 L8 -21 L22 -13 L30 -37 L44 -24 L38 -79 L51 -62 L34 -119 L18 -135Z','#526270','#333b42',2.6);
 shape(c,'M-24 -135 Q-12 -155 5 -146 L15 -126 L-5 -102 L-22 -113Z','#30383d');
 shape(c,'M-20 -132 L-3 -128 L-15 -125Z','#e1ba77');shape(c,'M2 -128 L11 -133 L6 -125Z','#e1ba77');
 shape(c,'M-15 -101 Q8 -119 21 -113 L9 -106 L-14 -93Z','#ad8c65');
 for(let i=0;i<4;i++)shape(c,'M'+(-28+i*12)+' -84 q-2 23 -12 39',null,'#7c8d93',2);c.restore();
}
