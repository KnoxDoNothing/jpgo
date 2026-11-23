import type {ReactNode} from 'react';import {ART} from './art';
export const Mascot=({k='sprout',size=64}:{k?:string;size?:number})=><span className="mascot" style={{width:size,height:size}} dangerouslySetInnerHTML={{__html:ART[k]}}/>;
export const Sheet=({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode})=>
<div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
<div className="w-full max-h-[90dvh] overflow-auto rounded-t-[28px] p-4 pb-10" style={{background:'var(--bg)'}} onClick={e=>e.stopPropagation()}>
<div className="flex justify-between items-center mb-3"><b className="text-lg">{title}</b><button className="btn2" onClick={onClose}>關閉</button></div>{children}</div></div>;
export const Field=({l,children}:{l:string;children:ReactNode})=><label className="block mb-3 sub">{l}{children}</label>;
export const Empty=({t}:{t:string})=><div className="text-center py-8"><Mascot k="cloud" size={72}/><p className="sub mt-2">{t}</p></div>;
