import {useState} from 'react';import {useS} from '../store';import {Empty,Sheet,Field} from '../ui';import ExpForm from './ExpForm';import {DAYS} from '../seed';
import {ECATS,yen,twd,md,jstDate,uid} from '../utils';import type {Exp} from '../types';
export default function Budget(){const{s,up}=useS();const[tw,setTw]=useState(false);const[ed,setEd]=useState<Exp|null>(null);const[cfg,setCfg]=useState(false);const[inc,setInc]=useState(false);
const{rate,budget}=s.set;const fmt=(n:number)=>tw?twd(n,rate):yen(n);
const used=s.exps.filter(e=>inc||!e.prepaid);const spent=used.reduce((a,e)=>a+e.amt,0);const left=budget-spent;
const by=(k:(e:Exp)=>string)=>used.reduce<Record<string,number>>((m,e)=>({...m,[k(e)]:(m[k(e)]||0)+e.amt}),{});
const cats=by(e=>e.cat),days=by(e=>e.date);const today=jstDate();
return <div><h1 className="text-2xl font-bold mb-3">預算</h1>
<div className="card"><div className="flex justify-between"><span className="sub">總預算</span><b>{fmt(budget)}</b></div>
<div className="flex justify-between"><span className="sub">已花</span><b>{fmt(spent)}</b></div>
<div className="flex justify-between"><span className="sub">剩餘</span><b className={left<0?'red':'pri'}>{fmt(left)}</b></div>
<div className="h-2 rounded bg-black/10 my-2 overflow-hidden"><div className="h-full" style={{width:Math.min(100,spent/budget*100)+'%',background:left<0?'var(--red)':'var(--pri)'}}/></div>
<div className="flex gap-2 flex-wrap"><button className="btn2" onClick={()=>setTw(!tw)}>顯示：{tw?'台幣':'日圓'}</button><button className="btn2" onClick={()=>setInc(!inc)}>{inc?'含預付':'不含預付'}</button><button className="btn2" onClick={()=>setCfg(true)}>設定預算／匯率</button></div>
<p className="sub mt-2">匯率 1 日圓 = {rate} 台幣（手動，可自行調整）</p></div>
<button className="btn w-full mb-3" onClick={()=>setEd({id:uid(),date:DAYS.some(d=>d.d===today)?today:DAYS[0].d,amt:0,cat:'food',note:''})}>＋ 記一筆</button>
<div className="card"><b>分類</b>{Object.keys(ECATS).map(k=><div key={k} className="flex justify-between"><span>{ECATS[k]}</span><span>{fmt(cats[k]||0)}</span></div>)}</div>
<div className="card"><b>每日</b>{DAYS.map(d=><div key={d.d} className="flex justify-between"><span>{md(d.d)} {d.city}</span><span>{fmt(days[d.d]||0)}</span></div>)}</div>
<b>明細</b>{s.exps.length===0&&<Empty t="還沒有花費紀錄"/>}
{[...s.exps].sort((a,b)=>b.date.localeCompare(a.date)).map(e=><button key={e.id} className="card w-full text-left flex justify-between" onClick={()=>setEd(e)}>
<span>{md(e.date)}・{ECATS[e.cat]} {e.note}{e.prepaid&&<span className="tag sub ml-1">預付</span>}</span><b>{fmt(e.amt)}</b></button>)}
{ed&&<ExpForm init={ed} onClose={()=>setEd(null)}/>}
{cfg&&<Sheet title="預算設定" onClose={()=>setCfg(false)}>
<Field l="總預算（日圓）"><input className="in" inputMode="numeric" defaultValue={budget} onBlur={e=>{const n=Number(e.target.value);if(n>0)up(x=>({...x,set:{...x.set,budget:n}}));}}/></Field>
<Field l="匯率（1 日圓 = ? 台幣）"><input className="in" inputMode="decimal" defaultValue={rate} onBlur={e=>{const n=Number(e.target.value);if(n>0)up(x=>({...x,set:{...x.set,rate:n}}));}}/></Field>
<button className="btn w-full" onClick={()=>setCfg(false)}>完成</button></Sheet>}</div>;}
