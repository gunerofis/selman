// Dosya adresindeki eski kayıt ile Vite adresindeki kayıt arasında kullanıcı denetimli aktarım.
function portableSaveValid(data){
 const p=data?.player;
 return data?.format==='kivilcim-save'&&data.version===1&&typeof p==='object'&&p!==null&&
  ['gold','xp','ore','shards'].every(k=>Number.isFinite(p[k])&&p[k]>=0)&&
  ['gems','arenaCoin','guildCoin','casinoTickets','auraEssence','feed','eggs','feather'].every(k=>p[k]===undefined||Number.isFinite(p[k])&&p[k]>=0)&&
  (!Array.isArray(p.gear)||new Set(p.gear.map(g=>g?.id)).size===p.gear.length)&&
  ((Array.isArray(p.gear)&&p.gear.every(g=>g&&typeof g.id==='string'&&gearSlot[g.slot]&&Number.isInteger(g.tier)&&g.tier>=1&&g.tier<=GEAR_MAX_TIER&&Number.isInteger(g.rarity)&&g.rarity>=0&&g.rarity<rarities.length&&Number.isInteger(g.plus)&&g.plus>=0&&g.plus<=GEAR_MAX_PLUS&&Array.isArray(g.sockets)&&g.sockets.every(k=>k===null||stones[k])))||(Array.isArray(p.items)&&p.items.includes(BALANCE.starterWeapon)&&p.items.every(k=>typeof k==='string')))&&
  Array.isArray(p.cleared)&&p.cleared.every(k=>typeof k==='string')&&typeof p.upgrades==='object';
}
if(typeof MutationObserver!=='undefined'){
 const addSaveControls=()=>{
  const host=document.querySelector('.clockControls');
  if(!host||document.getElementById('saveTransfer'))return;
  const box=document.createElement('div');box.id='saveTransfer';box.className='row';
  box.innerHTML='<button type="button" class="gxBtn sub" data-save="export">Kaydı dışa aktar</button><button type="button" class="gxBtn sub" data-save="import">Kaydı yükle</button><input type="file" id="saveTransferFile" accept="application/json,.json" hidden>';
  host.append(box);uiPrepareControls(box);
 };
 new MutationObserver(addSaveControls).observe(document.getElementById('main'),{childList:true,subtree:true});
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-save]');if(!button||busy||fight)return;
  if(button.dataset.save==='import'){document.getElementById('saveTransferFile').click();return;}
  try{
   const player=await transact(()=>false),url=URL.createObjectURL(new Blob([JSON.stringify({format:'kivilcim-save',version:1,qa:QA,player})],{type:'application/json'}));
   const link=document.createElement('a');link.href=url;link.download='Kıvılcım Kayıt '+rewardDay()+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(error){console.error(error);toast('Kayıt dışa aktarılamadı.');}
 });
 document.addEventListener('change',async event=>{
  if(event.target.id!=='saveTransferFile')return;
  const file=event.target.files?.[0];if(!file||busy||fight)return;
  busy=true;
  try{
   if(file.size>2_000_000)throw new Error('Kayıt dosyası fazla büyük.');
   const data=JSON.parse(await file.text());
   if(!portableSaveValid(data)||!!data.qa!==QA)throw new Error('Uyumlu bir Kıvılcım kaydı seç.');
   // Var olan kayıt geri dönüş için aynı cihazda saklanır; içe aktarım onu silmez.
   const previous=await transact(()=>false);localStorage.setItem('kivilcim-import-oncesi',JSON.stringify(previous));
   state=await transact(s=>{if(s.fight)return false;const revision=s.revision;Object.assign(s,normalize(data.player));s.revision=revision;if(s.fight)s.fight.owner=owner;});
   reflect(state);tell();toast('Kayıt yüklendi.');
  }catch(error){console.error(error);toast(error.message||'Kayıt yüklenemedi.');}
  finally{busy=false;}
 });
}
