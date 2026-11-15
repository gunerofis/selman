(() => {
  const $=id=>document.getElementById(id);
  const fields={colors:'Renk',forms:'Şekil',subjects:'Konu',styles:'Tarz',tones:'Renk tonu',keywords:'Arama kelimeleri'};
  const examples={colors:'Örn: mavi',forms:'Örn: daire',subjects:'Örn: yaprak',styles:'Örn: minimal',tones:'Örn: pastel',keywords:'Örn: kitap, okuyan, kişi'};
  const clone=value=>JSON.parse(JSON.stringify(value));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const normalize=value=>value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
  let records=[],selected=null,busy=false,pending=null;
  const drafts=new Map();
  const current=()=>records.find(r=>r.code===selected);
  const draft=()=>drafts.get(selected)?.tags||current().tags;
  const isDirty=code=>drafts.has(code)&&!same(drafts.get(code).tags,records.find(r=>r.code===code).tags);
  function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
  async function api(path,options={}){
    const response=await fetch('/api/admin/keywords'+path,{...options,cache:'no-store'});
    let data;try{data=await response.json();}catch{throw Error('Hizmet yanıtı okunamadı. Tekrar deneyin.');}
    if(!response.ok){const error=Error(data.error||'İşlem tamamlanamadı.');error.status=response.status;throw error;}
    return data;
  }
  function status(message,error=false){$('save-status').textContent=message;$('save-status').classList.toggle('error',error);}
  function updateActions(){
    const dirty=isDirty(selected);
    $('dirty-status').textContent=dirty?'Kaydedilmedi':'';
    $('save').disabled=busy||!dirty;$('discard').disabled=busy||!dirty;
    $('save').textContent=busy?'Kaydediliyor…':'Kaydet';
    $('reload-record').disabled=busy;
    for(const button of $('history-list').querySelectorAll('button'))button.disabled=busy||Number(button.dataset.revision)===current().revision;
  }
  function list(){
    const query=normalize($('image-search').value.trim());
    const filtered=records.filter(r=>normalize([r.code,r.designCode,r.name,...Object.values(r.tags).flat()].join(' ')).includes(query));
    $('list-count').textContent=`${filtered.length} görsel`;
    $('list-empty').hidden=filtered.length>0;
    $('image-list').replaceChildren(...filtered.map(r=>{
      const li=node('li'),button=node('button');button.type='button';button.disabled=busy;
      button.setAttribute('aria-label',`${r.code} · ${r.designCode} · ${r.name}`);button.setAttribute('aria-current',String(r.code===selected));
      const img=node('img');img.src=r.thumb;img.alt='';img.loading='lazy';img.width=62;img.height=62;
      const copy=node('span',undefined,'list-copy');copy.append(node('strong',r.code),node('small',`${r.designCode} · ${r.name}`));
      if(isDirty(r.code))copy.append(node('span','Kaydedilmedi','draft-dot'));
      button.append(img,copy);button.addEventListener('click',()=>select(r.code));li.append(button);return li;
    }));
  }
  function changed(tags,restoreRevision=null){
    drafts.set(selected,{tags,restoreRevision});pending=null;status('');$('reload-record').hidden=true;
    renderFields();list();updateActions();
  }
  function add(field){
    const input=$('add-'+field),error=$('error-'+field);
    const values=input.value.split(/[,\s]+/u).map(s=>s.normalize('NFC').trim()).filter(Boolean);
    if(!values.length){error.textContent='Etiket yazın.';input.focus();return;}
    const tags=clone(draft()),existing=new Set(tags[field].map(normalize));
    for(const value of values){
      if(value.length>80||/[<>\u0000-\u001f|]/.test(value)){error.textContent='Etiket 1–80 karakter olmalı.';input.focus();return;}
      if(existing.has(normalize(value))){error.textContent='Bu etiket zaten var.';input.focus();return;}
      tags[field].push(value);existing.add(normalize(value));
    }
    if(tags[field].length>40){error.textContent='Bir grupta en fazla 40 etiket olabilir.';input.focus();return;}
    changed(tags);$('add-'+field).focus();
  }
  function renderFields(){
    const tags=draft();
    $('tag-fields').replaceChildren(...Object.entries(fields).map(([field,label])=>{
      const group=node('fieldset',undefined,'tag-group');group.disabled=busy;group.append(node('legend',`${label} · ${tags[field].length}`));
      const chips=node('ul',undefined,'tags');
      for(const [index,tag] of tags[field].entries()){
        const li=node('li',undefined,'tag');li.append(node('span',tag));
        const remove=node('button','×');remove.type='button';remove.setAttribute('aria-label',`${label}: ${tag}. Sil`);
        remove.addEventListener('click',()=>{const next=clone(draft());next[field].splice(index,1);changed(next);$('add-'+field).focus();});li.append(remove);chips.append(li);
      }
      const row=node('div',undefined,'tag-entry'),input=node('input');input.id='add-'+field;input.placeholder=examples[field];input.maxLength=400;
      input.setAttribute('aria-label',`${label} etiketi ekle`);input.setAttribute('aria-describedby','error-'+field);input.autocomplete='off';
      input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();add(field);}});
      const button=node('button','Ekle');button.type='button';button.setAttribute('aria-label',`${label} ekle`);button.addEventListener('click',()=>add(field));row.append(input,button);
      const error=node('p','', 'tag-error');error.id='error-'+field;error.setAttribute('role','status');group.append(chips,row,error);return group;
    }));
  }
  function select(code){
    selected=code;pending=null;const r=current();
    const url=new URL(location.href);url.searchParams.set('g',code);history.replaceState(null,'',url.pathname+url.search);
    $('selected-code').textContent=r.code;$('selected-product').textContent=`${r.designCode} · ${r.name}`;
    $('selected-image').src=r.image;$('selected-image').alt=`${r.name} · ${r.designCode} · ${r.code}`;
    $('base-keywords').textContent=r.baseKeywords.join(' · ');
    $('history').open=false;$('history-list').replaceChildren();$('history-status').textContent='';$('reload-record').hidden=true;
    status(r.updatedAt?`Son kayıt: ${new Date(r.updatedAt).toLocaleString('tr-TR')}`:'');renderFields();list();updateActions();
  }
  async function load(){
    $('load-error').hidden=true;$('page-status').textContent='Etiketler yükleniyor…';
    try{const data=await api('');records=data.images;
      if(!records.length)throw Error('Görsel kaydı bulunamadı.');
      $('workspace').hidden=false;$('page-status').textContent=`${records.length} görsel · ${data.user}`;
      const requested=new URLSearchParams(location.search).get('g');select(records.some(r=>r.code===requested)?requested:records[0].code);
    }catch(error){$('workspace').hidden=true;$('load-error').hidden=false;$('load-message').textContent=error.message;$('page-status').textContent='Etiketler yüklenemedi.';}
  }
  $('save').addEventListener('click',async()=>{
    if(busy||!isDirty(selected))return;
    for(const [field,label] of Object.entries(fields))if(!draft()[field].length){$('error-'+field).textContent=`${label} için en az bir etiket ekleyin.`;$('add-'+field).focus();return;}
    const code=selected,r=current(),restore=drafts.get(code).restoreRevision;
    const payload={revision:r.revision,tags:clone(draft()),...(restore!==null?{restoreRevision:restore}:{})};
    const signature=JSON.stringify(payload);
    if(!pending||pending.signature!==signature)pending={signature,requestId:crypto.randomUUID()};
    payload.requestId=pending.requestId;
    busy=true;status('Kaydediliyor…');renderFields();list();updateActions();
    try{
      const saved=await api('/'+code+(restore!==null?'/restore':''),{method:'POST',headers:{'Content-Type':'application/json','X-Doku-Admin':'1'},body:JSON.stringify(payload)});
      Object.assign(r,saved);drafts.delete(code);pending=null;$('reload-record').hidden=true;
      status('Kaydedildi. Galeri araması güncellendi.');
      $('history').open=false;$('history-list').replaceChildren();
    }catch(error){status(error.message,true);$('reload-record').hidden=error.status!==409;}
    finally{busy=false;renderFields();list();updateActions();}
  });
  $('discard').addEventListener('click',()=>{drafts.delete(selected);pending=null;renderFields();list();updateActions();status('Değişiklikler kaldırıldı.');});
  $('reload-record').addEventListener('click',async()=>{
    try{const data=await api('/'+selected);Object.assign(current(),data);drafts.delete(selected);select(selected);status('Güncel kayıt yüklendi.');}catch(error){status(error.message,true);}
  });
  $('history').addEventListener('toggle',async()=>{
    if(!$('history').open)return;
    const code=selected;$('history-status').textContent='Geçmiş yükleniyor…';
    try{
      const data=await api('/'+code+'/history');if(code!==selected)return;
      $('history-status').textContent=data.versions.length?'Eski etiketleri yükleyip kontrol edin; Kaydet ile uygulayın.':'Henüz kayıt değişikliği yok.';
      $('history-list').replaceChildren(...data.versions.map(version=>{
        const li=node('li'),copy=node('div',version.revision===0?'İlk etiketler':`Sürüm ${version.revision}`);
        if(version.at)copy.append(node('small',`${new Date(version.at).toLocaleString('tr-TR')} · ${version.actor}`));
        const button=node('button','Yükle');button.type='button';button.disabled=busy||version.revision===current().revision;
        button.dataset.revision=String(version.revision);
        button.setAttribute('aria-label',`Sürüm ${version.revision} etiketlerini yükle`);
        button.addEventListener('click',()=>{changed(clone(version.tags),version.revision);status('Eski etiketler yüklendi. Kontrol edip Kaydet’e basın.');$('selected-code').scrollIntoView({block:'center'});});
        li.append(copy,button);return li;
      }));
    }catch(error){if(code===selected)$('history-status').textContent=error.message;}
  });
  $('tag-form').addEventListener('submit',event=>event.preventDefault());
  $('image-search').addEventListener('input',list);$('retry').addEventListener('click',load);
  window.addEventListener('beforeunload',event=>{if([...drafts.keys()].some(isDirty)){event.preventDefault();event.returnValue='';}});
  load();
})();
