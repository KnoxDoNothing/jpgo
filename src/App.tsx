import {useState} from 'react';import {useS} from './store';
import Home from './pages/Home';import Plan from './pages/Plan';import MapPage from './pages/MapPage';import Budget from './pages/Budget';import Info from './pages/Info';
const T=[['home','首頁','🏠'],['plan','行程','🗓'],['map','地圖','📍'],['budget','預算','💴'],['info','資訊','🧳']] as const;
export default function App(){const[t,setT]=useState<string>('home');const{warn}=useS();
return <div className="max-w-xl mx-auto" style={{paddingTop:'env(safe-area-inset-top)'}}>
{warn&&<div className="card red text-sm">{warn}</div>}
<div aria-hidden className="leaves">{['🍃','🌿','🍃','🌸'].map((l,i)=><span key={i} style={{left:(10+i*24)+'%',animationDelay:(i*4)+'s'}}>{l}</span>)}</div>
<main className="p-4 relative z-10" style={{paddingBottom:'calc(88px + env(safe-area-inset-bottom))'}}>
<div key={t} className="page">{t==='home'&&<Home go={setT}/>}{t==='plan'&&<Plan/>}{t==='map'&&<MapPage/>}{t==='budget'&&<Budget/>}{t==='info'&&<Info/>}</div></main>
<nav className="nav">
{T.map(([k,l,i])=><button key={k} onClick={()=>setT(k)} className={'tab '+(t===k?'on':'')}><div className="ico">{i}</div>{l}</button>)}</nav></div>;}
