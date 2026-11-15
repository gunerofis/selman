import React,{useState,useEffect} from 'react';
import {Button,useDataApp} from '../../data-app-public.jsx';
import {day} from './hub-api.js';
const iso=d=>d.toISOString().slice(0,10);
export const displayDate=s=>s?s.split('-').reverse().join('.'):'';
export function parseDate(s){if(!/^\d{2}\.\d{2}\.\d{4}$/.test(s))return null;const value=s.split('.').reverse().join('-'),date=new Date(value+'T12:00:00Z');return !Number.isNaN(date.valueOf())&&iso(date)===value?value:null}
export function DateField({label,visibleLabel,value,onChange,allowEmpty=false}){const [draft,setDraft]=useState(displayDate(value));useEffect(()=>setDraft(displayDate(value)),[value]);return <label>{visibleLabel||label}<input type="text" inputMode="numeric" lang="tr" aria-label={label} placeholder="GG.AA.YYYY" value={draft} maxLength={10} onChange={e=>{setDraft(e.target.value);if(allowEmpty&&!e.target.value){onChange('');return}const parsed=parseDate(e.target.value);if(parsed)onChange(parsed)}} onBlur={()=>{if((!allowEmpty||draft)&&!parseDate(draft))setDraft(displayDate(value))}}/></label>}

export function PeriodControl({value,onChange,label='Tarih aralığı'}){
 const app=useDataApp(),today=day(),current=value??app.filters.date??(today+'..'+today),set=onChange||((v)=>app.setFilter('date',v));
 const parts=current==='all'?['','']:current.split('..'),start=parts[0],end=parts[1]||start;
 function shift(n){set([start||today,end||today].map(v=>iso(new Date(new Date(v+'T12:00:00Z').getTime()+n*86400000))).join('..'))}
 function preset(kind){const first=new Date(today+'T12:00:00Z');if(kind==='all')return 'all';if(kind==='week')first.setUTCDate(first.getUTCDate()-((first.getUTCDay()+6)%7));if(kind==='month')first.setUTCDate(1);if(kind==='year'){first.setUTCMonth(0);first.setUTCDate(1)}return iso(first)+'..'+today}
 return <div className="hub-report-period" role="group" aria-label={label}><Button aria-label="Önceki gün" onClick={()=>shift(-1)}>←</Button><DateField visibleLabel="Başlangıç" label={label+' başlangıç'} value={start} onChange={v=>set(v+'..'+(end&&end>=v?end:v))}/><DateField visibleLabel="Bitiş" label={label+' bitiş'} value={end} onChange={v=>set((start&&start<=v?start:v)+'..'+v)}/><Button aria-label="Sonraki gün" onClick={()=>shift(1)}>→</Button><div className="hub-filters">{[['today','Bugün'],['week','Bu hafta'],['month','Bu ay'],['year','Bu yıl'],['all','Tümü']].map(([v,l])=><button key={v} aria-pressed={current===preset(v)} onClick={()=>set(preset(v))}>{l}</button>)}</div></div>;
}
