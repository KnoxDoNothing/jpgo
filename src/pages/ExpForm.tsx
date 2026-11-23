import {useState} from 'react';import {useS} from '../store';import {Sheet,Field} from '../ui';import {DAYS} from '../seed';import {ECATS,md,wd} from '../utils';import type {Exp,ECat} from '../types';
export default function ExpForm({init,onClose}:{init:Exp;onClose:()=>void}){const{s,up}=useS();const[e,setE]=useState(init);const[err,setErr]=useState('');
const save=()=>{if(!(e.amt>0)){setErr('請輸入大於 0 的金額');return;}up(x=>({...x,exps:x.exps.some(y=>y.id===e.id)?x.exps.map(y=>y.id===e.id?e:y):[...x.exps,e]}));onClose();};
const del=()=>{if(confirm('刪除這筆花費？')){up(x=>({...x,exps:x.exps.filter(y=>y.id!==e.id)}));onClose();}};
return <Sheet title={s.exps.some(y=>y.id===e.id)?'編輯花費':'記一筆'} onClose={onClose}>
<Field l="金額（日圓）"><input className="in" inputMode="numeric" value={e.amt||''} onChange={v=>setE({...e,amt:Number(v.target.value.replace(/\D/g,''))})}/></Field>
<Field l="日期"><select className="in" value={e.date} onChange={v=>setE({...e,date:v.target.value})}>{DAYS.map(d=><option key={d.d} value={d.d}>{md(d.d)}({wd(d.d)})</option>)}</select></Field>
<Field l="分類"><select className="in" value={e.cat} onChange={v=>setE({...e,cat:v.target.value as ECat})}>{Object.entries(ECATS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
<Field l="備註"><input className="in" value={e.note} onChange={v=>setE({...e,note:v.target.value})}/></Field>
<label className="flex gap-2 mb-3"><input type="checkbox" checked={!!e.prepaid} onChange={v=>setE({...e,prepaid:v.target.checked})}/>已預付（不計入現場預算）</label>
{err&&<p className="red mb-2">{err}</p>}<div className="flex gap-2"><button className="btn flex-1" onClick={save}>儲存</button>{s.exps.some(y=>y.id===e.id)&&<button className="btn2 red" onClick={del}>刪除</button>}</div></Sheet>;}
