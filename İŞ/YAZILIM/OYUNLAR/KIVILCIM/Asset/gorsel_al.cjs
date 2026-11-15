// Yeni görselleri oyuna alır. Kullanım:
//   node Asset/gorsel_al.cjs bak   → İndirilenler'deki son görselleri tek sayfada gösterir (%TEMP%/kivilcim_bakis.jpg)
//   node Asset/gorsel_al.cjs al    → aşağıdaki ADLAR sırasıyla adlandırır, kırpar, küçültür, oyuna koyar
const fs=require('fs'),path=require('path'),os=require('os');
const kok=path.resolve(__dirname,'..'),{createCanvas,loadImage}=require(path.join(kok,'Oyun/node_modules/@napi-rs/canvas'));
const indirilenler=path.join(os.homedir(),'Downloads'),saat=Number(process.env.SAAT||20);
// Sıra: önce dosya saati (dakika), sonra addaki "-N" numarası.
const ADLAR=['wing_golge','wing_ay','wing_firtina','wing_yildiz','wing_anka','wing_ejder','wing_gunes','aura_golge','aura_koz','wing_hiclik','aura_ay','aura_ejder','aura_yildiz','aura_isik','relic_muska','relic_tohum','relic_muhur','relic_anahtar','relic_mercan','relic_sancak','relic_goz','relic_prizma','relic_cekirdek','relic_spor','relic_kumsaati','charm_dugum','charm_av',
 'relic_kure','charm_dis','charm_can','charm_pul','charm_tas','stone_oniks','charm_damla','charm_boncuk','stone_topaz','stone_safir','stone_ametist'];
function dosyalar(){
 return fs.readdirSync(indirilenler).filter(n=>/\.png$/i.test(n)).map(n=>{const p=path.join(indirilenler,n),st=fs.statSync(p);return {n,p,dk:Math.floor(st.mtimeMs/60000),no:Number((n.match(/-(\d+)\.png$/i)||[])[1]||0)};})
  .filter(f=>Date.now()-f.dk*60000<saat*3600000).sort((a,b)=>a.dk-b.dk||a.no-b.no);
}
function sinir(im){ // saydam olmayan alanın kutusu ve saydamlık oranı
 const c=createCanvas(im.width,im.height),x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,im.width,im.height).data;
 let x0=im.width,y0=im.height,x1=-1,y1=-1,bos=0;
 for(let y=0;y<im.height;y++)for(let i=0;i<im.width;i++){const a=d[(y*im.width+i)*4+3];if(a<16){bos++;continue;}if(i<x0)x0=i;if(i>x1)x1=i;if(y<y0)y0=y;if(y>y1)y1=y;}
 return {x0,y0,w:x1-x0+1,h:y1-y0+1,bos:bos/(im.width*im.height)};
}
function ciz(im,b,en,boy,kare){ // kutuyu hedefe sığdırır; kare ise ortalar
 const pay=kare?.06:0,olcek=Math.min(en*(1-pay*2)/b.w,boy*(1-pay*2)/b.h),w=Math.round(b.w*olcek),h=Math.round(b.h*olcek);
 const c=createCanvas(kare?en:w,kare?boy:h),x=c.getContext('2d');x.imageSmoothingQuality='high';
 x.drawImage(im,b.x0,b.y0,b.w,b.h,kare?(en-w)/2:0,kare?(boy-h)/2:0,w,h);return c;
}
(async()=>{
 const liste=dosyalar(),is=process.argv[2]||'bak';
 if(is==='bak'){
  const s=8,k=150,c=createCanvas(s*k,Math.ceil(liste.length/s)*(k+18)),x=c.getContext('2d');x.fillStyle='#3a3f4a';x.fillRect(0,0,c.width,c.height);x.font='13px sans-serif';
  for(const [i,f] of liste.entries()){const im=await loadImage(f.p),b=sinir(im),px=(i%s)*k,py=Math.floor(i/s)*(k+18);
   x.drawImage(ciz(im,b,k-8,k-8,true),px+4,py+4);x.fillStyle=b.bos<.05?'#ff6060':'#fff';x.fillText((i+1)+' '+(ADLAR[i]||'?')+(b.bos<.05?' ARKA PLAN':''),px+4,py+k+12);}
  fs.writeFileSync(path.join(os.tmpdir(),'kivilcim_bakis.jpg'),c.toBuffer('image/jpeg'));console.log(liste.length+' görsel · '+ADLAR.length+' ad');return;
 }
 if(liste.length!==ADLAR.length)throw Error('Görsel '+liste.length+', ad '+ADLAR.length+' — sayılar tutmuyor.');
 const hedef=path.join(kok,'Oyun/gorsel/ikon'),arsiv=path.join(kok,'Asset/Islenen',new Date().toISOString().slice(0,10));fs.mkdirSync(arsiv,{recursive:true});
 for(const [i,f] of liste.entries()){
  const ad=ADLAR[i],im=await loadImage(f.p),b=sinir(im),boyut=ad.startsWith('wing_')?320:ad.startsWith('stone_')?128:256;
  fs.writeFileSync(path.join(hedef,ad+'.webp'),ciz(im,b,boyut,boyut,true).toBuffer('image/webp',88));
  if(ad.startsWith('wing_'))fs.writeFileSync(path.join(hedef,ad+'_wear.webp'),ciz(im,b,900,900,false).toBuffer('image/webp',86));
  fs.copyFileSync(f.p,path.join(arsiv,ad+'.png'));
 }
 console.log(liste.length+' görsel oyuna alındı → Oyun/gorsel/ikon · asıllar → '+path.relative(kok,arsiv));
})().catch(e=>{console.error(e.message);process.exit(1);});
