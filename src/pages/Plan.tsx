import {useState} from 'react';import {useS} from '../store';import {Sheet,Field,Empty} from '../ui';import {DAYS} from '../seed';
import {CAT,PRIO,jstDate,md,wd,mapUrl,uid} from '../utils';import type {Ev,Cat,Tr} from '../types';
const ICON:Record<string,string>={subway:'🚇',bus:'🚌',train:'🚆',walk:'🚶',taxi:'🚕',plane:'✈️'};
const dir=(t:Tr)=>'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(t.from)+'&destination='+encodeURIComponent(t.to)+'&travelmode='+(t.m==='walk'?'walking':'transit');
const blank=(date:string):Ev=>({id:uid(),date,time:'09:00',title:'',cat:'sight',done:false});
export default function Plan(){const{s,up}=useS();const t=jstDate();
const[day,setDay]=useState(DAYS.some(d=>d.d===t)?t:DAYS[0].d);const[alt,setAlt]=useState(false);const[ed,setEd]=useState<Ev|null>(null);const[err,setErr]=useState('');
const list=s.events.filter(e=>e.date===day&&!!e.alt===alt).sort((a,b)=>a.time.localeCompare(b.time));
const patch=(id:string,p:Partial<Ev>)=>up(x=>({...x,events:x.events.map(e=>e.id===id?{...e,...p}:e)}));
const swap=(i:number,j:number)=>{const a=list[i],b=list[j];if(!a||!b)return;up(x=>({...x,events:x.events.map(e=>e.id===a.id?{...e,time:b.time}:e.id===b.id?{...e,time:a.time}:e)}));};
const del=(e:Ev)=>{if(confirm('刪除「'+e.title+'」？'))up(x=>({...x,events:x.events.filter(y=>y.id!==e.id)}));};
const save=()=>{if(!ed)return;if(!ed.title.trim()){setErr('請輸入標題');return;}
up(x=>({...x,events:x.events.some(e=>e.id===ed.id)?x.events.map(e=>e.id===ed.id?ed:e):[...x.events,ed]}));setEd(null);setErr('');};
const set=(p:Partial<Ev>)=>setEd(e=>e&&{...e,...p});
return <div><h1 className="text-2xl font-bold mb-3" style={{fontFamily:'"Hiragino Mincho ProN",serif'}}>行程</h1>
<div className="flex gap-2 overflow-x-auto pb-2">{DAYS.map(d=><button key={d.d} onClick={()=>setDay(d.d)} className={'shrink-0 rounded-2xl px-3 py-2 text-center '+(day===d.d?'btn':'card')} style={{marginBottom:0}}>
<div className="font-bold">{md(d.d)}({wd(d.d)})</div><div className="text-xs">{d.city}</div></button>)}</div>
<div className="flex gap-2 my-3"><button className={alt?'btn2 flex-1':'btn flex-1'} onClick={()=>setAlt(false)}>主計畫</button><button className={alt?'btn flex-1':'btn2 flex-1'} onClick={()=>setAlt(true)}>雨雪備案</button></div>
{list.length===0&&<Empty t={alt?'這天沒有備案，按下方「＋」新增':'這天還沒有行程，按下方「＋」新增'}/>}
{list.map((e,i)=><div key={e.id} className="card" style={{opacity:e.done?.55:1}}>
<div className="flex justify-between"><b className="pri">{e.time}</b><span className="sub">{CAT[e.cat]}</span></div>
<div className="font-semibold text-lg" style={{textDecoration:e.done?'line-through':'none'}}>{e.title}</div>
<div className="flex gap-1 flex-wrap my-1">{e.prio&&<span className={'tag '+(e.prio==='must'?'red':'sub')}>{PRIO[e.prio]}</span>}{e.tbc&&<span className="tag" style={{color:'#B7791F'}}>待確認</span>}</div>
{e.closed?.includes(e.date)&&<div className="red text-sm">⚠ 這天可能休館／休業，請改期或確認</div>}
{e.addr&&<div className="sub">{e.addr}</div>}{e.note&&<div className="sub">{e.note}</div>}
{e.tr?.map((t,k)=><div key={k} className="mt-2 text-sm rounded-xl p-2" style={{background:'#8881'}}>
<div>{ICON[t.m]} <b>{t.line}</b> <span className="sub">{t.from} → {t.to}</span></div>
<div className="sub">{t.tt}{t.fare&&'・'+t.fare} <span className="tag" style={{color:t.ok?'var(--pri)':'#B7791F'}}>{t.ok?'✓已查':'待確認'}</span></div>
{t.m!=='walk'&&<a className="pri underline" href={dir(t)} target="_blank" rel="noreferrer">查當日時刻（Google 地圖）</a>}</div>)}
{e.meal&&<div className="mt-2"><b className="text-sm">餐廳候選（由你決定）</b>{e.meal.map(r=><div key={r.n} className="flex justify-between items-center gap-2 mt-1 rounded-xl p-2" style={{background:e.pick===r.n?'color-mix(in srgb,var(--pri) 20%,transparent)':'#8881'}}>
<div><div>{r.n}</div><div className="sub text-xs">{r.d}{!r.ok&&'（營業日待確認）'}</div></div>
<div className="flex gap-1"><a className="btn2 inline-flex items-center" href={mapUrl(r.n)} target="_blank" rel="noreferrer">地圖</a>
<button className="btn2" onClick={()=>patch(e.id,{pick:e.pick===r.n?undefined:r.n})}>{e.pick===r.n?'已選':'選這間'}</button></div></div>)}</div>}
{e.lug&&<div className="mt-2 text-sm">🧳 {e.lug}</div>}

<div className="flex gap-2 flex-wrap mt-2">
<button className="btn2" onClick={()=>patch(e.id,{done:!e.done})}>{e.done?'↩ 取消完成':'✓ 完成'}</button>
<a className="btn2 inline-flex items-center" href={mapUrl(e.title+' '+(e.addr||''))} target="_blank" rel="noreferrer">導航</a>
<button className="btn2" onClick={()=>swap(i,i-1)} disabled={i===0}>↑</button><button className="btn2" onClick={()=>swap(i,i+1)} disabled={i===list.length-1}>↓</button>
<button className="btn2" onClick={()=>{setErr('');setEd(e);}}>編輯</button><button className="btn2 red" onClick={()=>del(e)}>刪除</button></div></div>)}
<button className="btn fixed right-4 rounded-full w-14 h-14 text-2xl shadow-lg" style={{bottom:'calc(96px + env(safe-area-inset-bottom))'}} aria-label="新增" onClick={()=>{setErr('');setEd({...blank(day),alt});}}>＋</button>
{ed&&<Sheet title={s.events.some(e=>e.id===ed.id)?'編輯行程':'新增行程'} onClose={()=>setEd(null)}>
<Field l="日期"><select className="in" value={ed.date} onChange={e=>set({date:e.target.value})}>{DAYS.map(d=><option key={d.d} value={d.d}>{md(d.d)}({wd(d.d)}) {d.city}</option>)}</select></Field>
<Field l="時間"><input className="in" type="time" value={ed.time} onChange={e=>set({time:e.target.value})}/></Field>
<Field l="標題"><input className="in" value={ed.title} onChange={e=>set({title:e.target.value})}/></Field>
<Field l="地址／地點名稱（導航用）"><input className="in" value={ed.addr||''} onChange={e=>set({addr:e.target.value})}/></Field>
<Field l="類別"><select className="in" value={ed.cat} onChange={e=>set({cat:e.target.value as Cat})}>{Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
<Field l="優先級"><select className="in" value={ed.prio||''} onChange={e=>set({prio:(e.target.value||undefined) as Ev['prio']})}><option value="">無</option>{Object.entries(PRIO).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
<Field l="備註"><input className="in" value={ed.note||''} onChange={e=>set({note:e.target.value})}/></Field>
<label className="flex gap-2 mb-2"><input type="checkbox" checked={!!ed.tbc} onChange={e=>set({tbc:e.target.checked})}/>待確認</label>
<label className="flex gap-2 mb-3"><input type="checkbox" checked={!!ed.alt} onChange={e=>set({alt:e.target.checked})}/>雨雪備案</label>
{err&&<p className="red mb-2">{err}</p>}<button className="btn w-full" onClick={save}>儲存</button></Sheet>}</div>;}
