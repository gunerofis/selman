import React,{useState} from 'react';
import {RulesContent} from './RulesContent.jsx';
import {WorkContent} from './WorkContent.jsx';
export function SettingsContent(){const [section,setSection]=useState('rules');return <section className="hub-content hub-screen"><div className="hub-filters">{[['rules','Kurallar'],['log','Sistem Günlüğü'],['legacy','Geçmiş işler']].map(([id,label])=><button key={id} aria-pressed={section===id} onClick={()=>setSection(id)}>{label}</button>)}</div>{section==='legacy'?<WorkContent view="tasks"/>:<RulesContent section={section}/>}</section>}
