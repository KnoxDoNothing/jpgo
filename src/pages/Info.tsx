import {useState} from 'react';import {useS} from '../store';import {Sheet,Field,Empty} from '../ui';import {HOTELS,seed,mig} from '../seed';import {jstDate,md,uid} from '../utils';import type {Bk,State} from '../types';
const ST={done:'已訂',todo:'待訂',tbc:'待確認'} as const;const NEXT={done:'todo',todo:'tbc',tbc:'done'} as const;
export default function Info(){const{s,up,put}=useS();const[drv,setDrv]=useState<string|null>(null);const[nb,setNb]=useState<Bk|null>(null);const[nc,setNc]=useState('');const[msg,setMsg]=useState('');
const exp=async()=>{const b=new Blob([JSON.stringify(s,null,2)],{type:'application/json'});const f=new File([b],`tabi-backup-${jstDate()}.json`,{type:'application/json'});
if(navigator.canShare?.({files:[f]})){try{await navigator.share({files:[f]});return;}catch(e){if((e as Error).name==='AbortError')return;}}
const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e4);setMsg('已匯出備份檔');};
const imp=async(file?:File)=>{if(!file)return;try{const j=JSON.parse(await file.text()) as State;
if(!(j&&j.v===1&&Array.isArray(j.events)&&Array.isArray(j.exps)&&Array.isArray(j.books)&&Array.isArray(j.chk)&&j.set))throw new Error('格式不符');
if(confirm('匯入會覆蓋目前所有資料，確定？')){put(mig(j));setMsg('匯入成功');}}catch(e){setMsg('匯入失敗：'+(e as Error).message);}};
const hd=s.chk.length?Math.round(s.chk.filter(c=>c.done).length/s.chk.length*100):0;
return <div><h1 className="text-2xl font-bold mb-3">資訊</h1>
<div className="card"><b>訂位與票券</b>{s.books.length===0&&<Empty t="沒有項目"/>}
{s.books.map(b=><div key={b.id} className="flex justify-between items-center gap-2 mt-2"><div><div>{b.name}</div><div className="sub">{md(b.date)}{b.note&&'・'+b.note}</div></div>
<div className="flex gap-1"><button className={'btn2 '+(b.status==='done'?'':'red')} onClick={()=>up(x=>({...x,books:x.books.map(y=>y.id===b.id?{...y,status:NEXT[y.status]}:y)}))}>{ST[b.status]}</button>
<button className="btn2" aria-label="刪除" onClick={()=>confirm('刪除？')&&up(x=>({...x,books:x.books.filter(y=>y.id!==b.id)}))}>✕</button></div></div>)}
<button className="btn2 mt-3" onClick={()=>setNb({id:uid(),name:'',date:'2026-12-26',status:'todo'})}>＋ 新增項目</button></div>
<div className="card"><b>飯店</b>{HOTELS.map(h=><div key={h.n} className="mt-2"><div>{h.n}</div><div className="sub">{h.dt}</div>
<div className="flex gap-2 mt-1"><a className="btn2 inline-flex items-center" href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(h.n)} target="_blank" rel="noreferrer">導航</a>
<button className="btn2" onClick={()=>setDrv(h.jp?h.jp+'\n'+h.n:h.n)}>給司機看</button></div></div>)}
<p className="sub mt-2">地址與電話請依訂房信自行確認。</p></div>
<div className="card"><b>重要聯絡</b><div className="flex gap-2 mt-2"><a className="btn" href="tel:110">警察 110</a><a className="btn" href="tel:119">救護・消防 119</a></div></div>
<div className="card"><b>行李清單（{hd}%）</b>{s.chk.length===0&&<Empty t="清單是空的"/>}
{s.chk.map(c=><div key={c.id} className="flex justify-between items-center mt-2"><label className="flex gap-2 items-center"><input type="checkbox" className="w-5 h-5" checked={c.done} onChange={()=>up(x=>({...x,chk:x.chk.map(y=>y.id===c.id?{...y,done:!y.done}:y)}))}/><span style={{textDecoration:c.done?'line-through':'none'}}>{c.text}</span></label>
<button className="btn2" aria-label="刪除" onClick={()=>up(x=>({...x,chk:x.chk.filter(y=>y.id!==c.id)}))}>✕</button></div>)}
<div className="flex gap-2 mt-3"><input className="in" style={{marginTop:0}} placeholder="新增項目" value={nc} onChange={e=>setNc(e.target.value)}/>
<button className="btn" onClick={()=>{if(nc.trim()){up(x=>({...x,chk:[...x.chk,{id:uid(),text:nc.trim(),done:false}]}));setNc('');}}}>加入</button></div></div>
<div className="card"><b>設定與備份</b><Field l="外觀"><select className="in" value={s.set.theme} onChange={e=>up(x=>({...x,set:{...x.set,theme:e.target.value as State['set']['theme']}}))}><option value="auto">跟隨系統</option><option value="light">淺色</option><option value="dark">深色</option></select></Field>
<div className="flex gap-2 flex-wrap"><button className="btn" onClick={exp}>匯出 JSON</button><label className="btn2 inline-flex items-center">匯入 JSON<input type="file" accept="application/json,.json" hidden onChange={e=>{imp(e.target.files?.[0]);e.target.value='';}}/></label>
<button className="btn2 red" onClick={()=>confirm('重設為預設行程？所有自訂資料會被清除。')&&put(seed())}>重設</button></div>
{msg&&<p className="sub mt-2">{msg}</p>}<p className="sub mt-2">資料只存在這支手機。iOS 可能清除長期未使用的網站資料，建議定期匯出備份。</p></div>
{drv&&<div className="fixed inset-0 z-50 p-6 flex flex-col justify-center text-center bg-white text-black" onClick={()=>setDrv(null)}><p className="text-3xl font-bold whitespace-pre-line">{drv}</p><p className="mt-6 text-gray-500">點一下關閉</p></div>}
{nb&&<Sheet title="新增訂位項目" onClose={()=>setNb(null)}><Field l="名稱"><input className="in" value={nb.name} onChange={e=>setNb({...nb,name:e.target.value})}/></Field>
<Field l="日期"><input className="in" type="date" value={nb.date} onChange={e=>setNb({...nb,date:e.target.value})}/></Field>
<button className="btn w-full" onClick={()=>{if(!nb.name.trim()){setMsg('請輸入名稱');return;}up(x=>({...x,books:[...x.books,nb]}));setNb(null);}}>儲存</button></Sheet>}</div>;}
