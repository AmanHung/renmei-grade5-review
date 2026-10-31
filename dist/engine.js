(function(root){
 'use strict';
 function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function sample(bank,count,history={},rng=Math.random){
   count=Math.min(count,bank.length);
   const seen=new Set(history.seen||[]),last=new Set(history.last||[]);
   const types=[...new Set(bank.map(q=>q.type))];
   const quotas=types.map(type=>({type,exact:count*bank.filter(q=>q.type===type).length/bank.length}));
   quotas.forEach(q=>q.n=Math.floor(q.exact));
   let remaining=count-quotas.reduce((s,q)=>s+q.n,0);
   [...quotas].sort((a,b)=>(b.exact-b.n)-(a.exact-a.n)).slice(0,remaining).forEach(q=>q.n++);
   const picked=[];
   types.forEach(type=>{
    const pool=bank.filter(q=>q.type===type),n=quotas.find(q=>q.type===type).n;
    const unseen=shuffle(pool.filter(q=>!seen.has(q.id)&&!last.has(q.id)),rng);
    const old=shuffle(pool.filter(q=>seen.has(q.id)&&!last.has(q.id)),rng);
    const previous=shuffle(pool.filter(q=>last.has(q.id)),rng);
    picked.push(...[...unseen,...old,...previous].slice(0,n));
   });
   const ids=new Set(picked.map(q=>q.id));
   if(picked.length<count)picked.push(...shuffle(bank.filter(q=>!ids.has(q.id)),rng).slice(0,count-picked.length));
   return shuffle(picked.slice(0,count),rng);
 }
 function prepare(q,rng=Math.random){
  if(q.type==='numeric')return {...q};
  if(q.type==='matching'){
   const right=shuffle(q.pairs.map((p,i)=>({label:p[1],i})),rng);
   return {...q,options:right.map(p=>p.label),left:q.pairs.map(p=>p[0]),answer:q.pairs.map((p,i)=>right.findIndex(r=>r.i===i))};
  }
  if(q.type==='boolean')return {...q,options:[...q.options]};
  const options=shuffle(q.options.map((label,i)=>({label,i})),rng);
  const answer=Array.isArray(q.answer)?options.flatMap((o,i)=>q.answer.includes(o.i)?[i]:[]):options.findIndex(o=>o.i===q.answer);
  return {...q,options:options.map(o=>o.label),answer};
 }
 function numeric(value){if(typeof value!=='string'&&typeof value!=='number')return null;const s=String(value).trim().replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296)).replace(/．/g,'.').replace(/－/g,'-');if(!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return null;const n=Number(s);return Number.isFinite(n)?n:null;}
 function ready(q,selected){if(q.type==='numeric')return numeric(selected)!==null;if(q.type==='matching')return Array.isArray(selected)&&selected.length===q.left.length&&selected.every(x=>Number.isInteger(x)&&x>=0);if(q.type==='multiple')return Array.isArray(selected)&&selected.length>0;return Number.isInteger(selected)&&selected>=0;}
 function correct(q,selected){if(!ready(q,selected))return false;if(q.type==='numeric')return numeric(selected)===q.answer;if(q.type==='matching')return q.answer.every((a,i)=>a===selected[i]);if(q.type==='multiple')return q.answer.length===selected.length&&q.answer.every(a=>selected.includes(a));return q.answer===selected;}
 const api={shuffle,sample,prepare,ready,correct,numeric};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReviewEngine=api;
})(globalThis);
