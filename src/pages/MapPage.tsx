import {useState} from 'react';import {useS} from '../store';import {Empty} from '../ui';import {CAT,md,mapUrl} from '../utils';
export default function MapPage(){const{s}=useS();const[f,setF]=useState('all');
const list=s.events.filter(e=>!e.alt&&e.cat!=='move'&&(f==='all'||e.cat===f)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
return <div><h1 className="text-2xl font-bold mb-1">地圖</h1><p className="sub mb-3">依類別列出所有地點，點「導航」在 Google Maps 開啟。</p>
<div className="flex gap-2 overflow-x-auto pb-2 mb-2">{['all',...Object.keys(CAT)].filter(k=>k!=='move').map(k=><button key={k} onClick={()=>setF(k)} className={f===k?'btn':'btn2'}>{k==='all'?'全部':CAT[k]}</button>)}</div>
{list.length===0&&<Empty t="沒有符合的地點"/>}
{list.map(e=><div key={e.id} className="card flex justify-between items-center gap-2"><div><b>{e.title}</b><div className="sub">{md(e.date)} {e.time}・{CAT[e.cat]}</div></div>
<a className="btn" href={mapUrl(e.title+' '+(e.addr||''))} target="_blank" rel="noreferrer">導航</a></div>)}</div>;}
