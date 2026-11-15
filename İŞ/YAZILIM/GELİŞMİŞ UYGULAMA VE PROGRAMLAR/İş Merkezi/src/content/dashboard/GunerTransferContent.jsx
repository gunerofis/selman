import {FileLink} from './FileLink.jsx';
import React,{useState} from 'react';
import {Button,Dialog} from '../../data-app-public.jsx';
import {api,useResource,useDirty,lower} from './hub-api.js';
import {FitTable} from './ScreenTools.jsx';
import './guner-transfer.css';

const statuses={remaining:'Kalan',deferred:'Ertelenen',uncertain:'Doğrulanmamış',done:'Biten'};
const decisions={pending:'Onay bekliyor',approved:'Onaylandı',rejected:'Reddedildi',revise:'Revize'};
export function GunerTransferContent(){
 const r=useResource('guner-transfer'),[view,setView]=useState('remaining'),[query,setQuery]=useState(''),[selected,setSelected]=useState(null),[creating,setCreating]=useState(false);
 const data=r.data,items=data?.items||[];
 const matches=(j,v)=>v==='rejected'?j.decision==='rejected':j.decision!=='rejected'&&(v==='done'?j.status==='done':j.status!=='done');
 const rows=items.filter(j=>matches(j,view)&&lower(j.title).includes(lower(query)));
 const columns=[{field:'title',label:'İş'},{field:'priority',label:'Önem',renderCell:v=>v+'/100'},{field:'status',label:'Durum',renderCell:v=>statuses[v]},{field:'decision',label:'Karar',renderCell:v=>decisions[v]},{field:'id',label:'',renderCell:(_,j)=><Button onClick={()=>setSelected(j)}>Aç</Button>}];
 async function saved(d){r.setData(d);if(selected)setSelected(d.items.find(j=>j.id===selected.id)||null)}
 return <section className="hub-content hub-screen guner-transfer">
  <div className="hub-toolbar"><h1>Güner taşıma</h1><Button onClick={()=>setCreating(true)}>İş ekle</Button><a href="/api/guner-transfer-document" download="Güner taşıma.md">Tek belge</a></div>
  <div className="hub-filters">{[['remaining','Kalan'],['done','Biten'],['rejected','Reddedilen'],['notes','Notlar'],['resources','Kurallar ve kaynaklar'],['agents','Agent notları']].map(([id,label])=><button key={id} aria-pressed={view===id} onClick={()=>setView(id)}>{label}{['remaining','done','rejected'].includes(id)&&<span>{items.filter(j=>matches(j,id)).length}</span>}</button>)}</div>
  {r.error&&<p className="hub-error" role="alert">{r.error}</p>}
  {!data?<p>Yükleniyor…</p>:view==='notes'?<AreaNote key="userNote" field="userNote" label="Notlarım" data={data} onSaved={saved}/>:view==='agents'?<><p className="hub-muted">Tarih, son durum ve devir bilgisi kısa yazılır.</p><AreaNote key="agentNotes" field="agentNotes" label="Agent notları" data={data} onSaved={saved}/></>:view==='resources'?<div className="guner-transfer-resources"><ul>{data.rules.map(rule=><li key={rule}>{rule}</li>)}</ul>{data.resources.map((resource,i)=><article key={resource.path}><a href={'/api/guner-transfer-resource?index='+i} target="_blank" rel="noreferrer">{resource.label}</a><code><FileLink path={resource.path}/></code></article>)}</div>:<><input type="search" aria-label="Taşıma işlerinde ara" placeholder="İşlerde ara" value={query} onChange={e=>setQuery(e.target.value)}/>{rows.length?<FitTable topPager label="Güner taşıma işleri" rows={rows} columns={columns} rowKey="id" onRowSelect={setSelected}/>:<p className="hub-empty">Bu görünümde iş yok.</p>}</>}
  {(selected||creating)&&<TransferDialog key={selected?.id||'new'} job={selected} onClose={()=>{setSelected(null);setCreating(false)}} onSaved={async d=>{await saved(d);setCreating(false)}}/>}
 </section>;
}
function AreaNote({field,label,data,onSaved}){
 const [value,setValue]=useState(data[field]||''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),dirty=value!==(data[field]||'');useDirty(dirty);
 async function save(e){e.preventDefault();setBusy(true);try{await onSaved(await api('guner-transfer-save',{operation:'area',revision:data.revision,[field]:value}));setMessage('Kaydedildi.')}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 return <form onSubmit={save} className="guner-transfer-note"><label className="hub-field">{label}<textarea rows={8} maxLength={field==='agentNotes'?4000:3000} value={value} onChange={e=>setValue(e.target.value)}/></label><Button type="submit" disabled={busy||!dirty}>{busy?'Kaydediliyor…':'Kaydet'}</Button><p role="status">{message}</p></form>;
}
function TransferDialog({job,onClose,onSaved}){
 const [editing,setEditing]=useState(!job),[title,setTitle]=useState(job?.title||''),[priority,setPriority]=useState(job?.priority??50),[status,setStatus]=useState(job?.status||'remaining'),[note,setNote]=useState(job?.note||''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[id]=useState(()=>job?.id||crypto.randomUUID().replaceAll('-',''));
 const dirty=note!==(job?.note||'')||title!==(job?.title||'')||Number(priority)!==(job?.priority??50)||status!==(job?.status||'remaining');useDirty(dirty);
 async function save(operation,extra={}){setBusy(true);setMessage('');try{const d=await api('guner-transfer-save',{operation,id,revision:job?.revision,...extra});await onSaved(d);setEditing(false);setMessage('Kaydedildi.');if(!job)onClose()}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 function close(){if(!busy&&(!dirty||confirm('Kaydedilmemiş değişiklikler bırakılsın mı?')))onClose()}
 return <Dialog open title={job?'Taşıma işi':'İş ekle'} onClose={close}><div className="hub-detail guner-transfer-dialog">
  {editing?<form onSubmit={e=>{e.preventDefault();save(job?'edit':'add',{title,priority:Number(priority),status,source:job?.source||'',sourceDate:job?.sourceDate||''})}}><label className="hub-field">İş<input required minLength={3} maxLength={140} value={title} onChange={e=>setTitle(e.target.value)}/></label><label className="hub-field">Önem /100<input required type="number" min={0} max={100} step={1} value={priority} onChange={e=>setPriority(e.target.value)}/></label><div className="hub-filters">{Object.entries(statuses).map(([id,label])=><button type="button" key={id} aria-pressed={status===id} onClick={()=>setStatus(id)}>{label}</button>)}</div><Button type="submit" disabled={busy}>Kaydet</Button></form>:<><p className="hub-summary">{job.title}</p><p>{job.priority}/100 · {statuses[job.status]} · {decisions[job.decision]}</p><div className="hub-inline">{[['approved','Onayla'],['rejected','Reddet'],['revise','Revize']].map(([choice,label])=><Button key={choice} disabled={busy||job.decision===choice} onClick={()=>save('decision',{decision:choice})}>{label}</Button>)}<Button disabled={busy||note!==job.note} onClick={()=>setEditing(true)}>Düzenle</Button></div></>}
  {job&&<><label className="hub-field">Notum<textarea rows={3} maxLength={1000} value={note} onChange={e=>setNote(e.target.value)}/></label><Button disabled={busy||note===job.note} onClick={()=>save('note',{note})}>Notu kaydet</Button><details className="hub-details"><summary>Kaynak</summary><p className="hub-pre">{job.sourceDate} {job.source||'Kullanıcı kaydı'}</p><p className="hub-muted">{job.id}</p></details></>}
  <p role="status">{message}</p>
 </div></Dialog>;
}
