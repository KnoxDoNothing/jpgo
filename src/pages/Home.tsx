import {useEffect,useState} from 'react';import {useS} from '../store';import {DAYS} from '../seed';import ExpForm from './ExpForm';import TitleAnim from '../TitleAnim';
import {dayDiff,jstDate,jstTime,md,wd,yen,twd,mapUrl,uid} from '../utils';import type {Exp} from '../types';
interface W{max:number;min:number;rain:number;snow:number}
export default function Home({go}:{go:(t:string)=>void}){const{s,up}=useS();const today=jstDate();const first=DAYS[0].d,last=DAYS[DAYS.length-1].d;
const before=today<first,after=today>last;const target=before?first:after?last:today;const day=DAYS.find(d=>d.d===target)!;
const[w,setW]=useState<W|null>(null);const[ws,setWs]=useState<'load'|'err'|'none'|'ok'>('load');const[q,setQ]=useState<Exp|null>(null);
const fetchW=()=>{setWs('load');fetch(`https://api.open-meteo.com/v1/forecast?latitude=${day.lat}&longitude=${day.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum&timezone=Asia%2FTokyo&forecast_days=16`)
.then(r=>{if(!r.ok)throw new Error(String(r.status));return r.json();}).then(j=>{const i=(j.daily.time as string[]).indexOf(target);if(i<0){setWs('none');return;}
setW({max:j.daily.temperature_2m_max[i],min:j.daily.temperature_2m_min[i],rain:j.daily.precipitation_probability_max[i],snow:j.daily.snowfall_sum[i]});setWs('ok');}).catch(()=>setWs('err'));};
useEffect(()=>{fetchW();},[target]);// eslint-disable-line
const list=s.events.filter(e=>e.date===target&&!e.alt).sort((a,b)=>a.time.localeCompare(b.time));
const next=list.find(e=>!e.done&&(before||after||e.time>=jstTime()));const done=list.filter(e=>e.done).length;
const daily=s.set.budget/DAYS.length;const spent=s.exps.filter(e=>e.date===target&&!e.prepaid).reduce((a,e)=>a+e.amt,0);
const hh=Number(jstTime().slice(0,2));const hi=hh<11?'早安':hh<17?'午安':'晚安';const todo=s.books.filter(b=>b.status!=='done').slice(0,3);
return <div><div className="hero"><span className="cl c1">☁️</span><span className="cl c2">☁️</span><span className="cl c3">☁️</span>
<div className="relative z-10"><div className="text-sm">{hi}！2026/12/26 – 2027/1/2（日本時間 {jstTime()}）</div>
<div className="text-3xl font-bold maru">{before?`還有 ${dayDiff(today,first)} 天出發`:after?'旅程已結束':`Day ${dayDiff(first,today)+1} / ${DAYS.length}・${day.city}`}</div></div>
<TitleAnim/></div>
{todo.length>0&&<div className="card"><b className="red">待辦</b>{todo.map(b=><div key={b.id} className="flex justify-between items-center gap-2 mt-2"><div><div>{b.name}</div><div className="sub">{md(b.date)}・{b.note||'尚未完成'}</div></div>
<button className="btn2" onClick={()=>up(x=>({...x,books:x.books.map(y=>y.id===b.id?{...y,status:'done'}:y)}))}>已訂</button></div>)}
<button className="btn2 mt-2" onClick={()=>go('info')}>前往訂位清單</button></div>}
<div className="card"><b>{before?'第一天':'今日'}摘要：{md(target)}({wd(target)}) {day.city}</b><div className="sub my-1">{list.length===0?'這天還沒有行程':`共 ${list.length} 項，已完成 ${done} 項`}</div><button className="btn2" onClick={()=>go('plan')}>查看完整行程</button></div>
<div className="card"><b>下一個行程</b>{next?<div className="mt-1"><div className="pri font-bold">{next.time}</div><div className="text-lg">{next.title}</div>
<div className="flex gap-2 mt-2"><a className="btn inline-flex items-center" href={mapUrl(next.title+' '+(next.addr||''))} target="_blank" rel="noreferrer">導航</a>
<button className="btn2" onClick={()=>up(x=>({...x,events:x.events.map(e=>e.id===next.id?{...e,done:true}:e)}))}>✓ 完成</button></div></div>:<p className="sub mt-1">{list.length?'今天的行程都完成了 🎉':'沒有待辦行程'}</p>}</div>
<div className="card"><b>天氣・{day.city}（{md(target)}）</b>
{ws==='load'&&<p className="sub">載入中…</p>}{ws==='err'&&<p className="sub">目前無法取得天氣（可能離線）。</p>}
{ws==='none'&&<p className="sub">預報尚未開放（最長約 16 天）。</p>}
{ws==='ok'&&w&&<p className="mt-1">{Math.round(w.min)}°–{Math.round(w.max)}°C・降雨機率 {w.rain}%・降雪 {w.snow} cm</p>}
<div className="flex justify-between items-center"><button className="btn2 mt-2" onClick={fetchW}>重新整理</button><a className="sub" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather data by Open-Meteo.com</a></div></div>
<div className="card"><b>今日預算</b><div className="flex justify-between mt-1"><span>{yen(spent)}（{twd(spent,s.set.rate)}）</span><span className="sub">日預算 {yen(daily)}</span></div>
<div className="h-2 rounded bg-black/10 my-2 overflow-hidden"><div className="h-full" style={{width:Math.min(100,spent/daily*100)+'%',background:spent>daily?'var(--red)':'var(--pri)'}}/></div>
<button className="btn w-full" onClick={()=>setQ({id:uid(),date:target,amt:0,cat:'food',note:''})}>＋ 快速記帳</button></div>
{q&&<ExpForm init={q} onClose={()=>setQ(null)}/>}</div>;}
