import {ART} from './art';
const K=Object.keys(ART);const pick=<T>(a:T[]):T=>a[(Math.random()*a.length)|0];
const GOOD=/完成|已訂|儲存|加入|選這間|已選|匯出|匯入|記一筆|快速記帳|＋/;
const MSG=['太棒了！','收好囉～','耶～','好選擇！','加油！','出發囉！'];
function burst(x:number,y:number,n:number,far:number){for(let i=0;i<n;i++){const s=document.createElement('span');s.className='fx-c';s.innerHTML=ART[pick(K)];
const a=Math.PI*2*i/n+Math.random()*.6;s.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*far}px;--dy:${Math.sin(a)*far-40}px;--r:${(Math.random()*80-40)|0}deg;animation-delay:${i*35}ms`;
document.body.appendChild(s);setTimeout(()=>s.remove(),1600);}}
function cheer(m:string){const d=document.createElement('div');d.className='cheer';d.innerHTML=`<span>${ART.sprout}</span><b>${m}</b>`;document.body.appendChild(d);setTimeout(()=>d.remove(),1800);}
export function initFx(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
document.addEventListener('click',ev=>{const t=(ev.target as HTMLElement).closest('button,a,label,select') as HTMLElement|null;if(!t)return;
const r=t.getBoundingClientRect();const x=ev.clientX||r.left+r.width/2,y=ev.clientY||r.top+r.height/2;const good=GOOD.test(t.textContent||'');
burst(x,y,good?9:5,good?100:60);if(good)cheer(pick(MSG));
t.classList.remove('pop');void t.offsetWidth;t.classList.add('pop');},true);}
