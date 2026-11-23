import type {State} from './types';
const open=()=>new Promise<IDBDatabase>((ok,no)=>{const r=indexedDB.open('nenmatsu-tabi',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});
export async function load():Promise<State|null>{const d=await open();return new Promise((ok,no)=>{const q=d.transaction('kv').objectStore('kv').get('state');q.onsuccess=()=>ok((q.result as State)??null);q.onerror=()=>no(q.error);});}
export async function save(s:State):Promise<void>{const d=await open();return new Promise((ok,no)=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(s,'state');t.oncomplete=()=>ok();t.onerror=()=>no(t.error);});}
