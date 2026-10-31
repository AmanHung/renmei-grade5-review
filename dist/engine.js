(function(root){
 'use strict';
 function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function sample(bank,count,history={},rng=Math.random){
   count=Math.min(count,bank.length);
   const seen=new Set(history.seen||[]),last=new Set(history.last||[]);
   if(bank.length&&bank.every(q=>q.passageId)){
    const groups=readingGroups(bank),size=groups[0].length;
    if(groups.some(g=>g.length!==size)||count%size)throw Error('閱讀練習須抽取完整題組');
    const fresh=shuffle(groups.filter(g=>g.every(q=>!seen.has(q.id)&&!last.has(q.id))),rng);
    const old=shuffle(groups.filter(g=>g.some(q=>seen.has(q.id))&&g.every(q=>!last.has(q.id))),rng);
    const previous=shuffle(groups.filter(g=>g.some(q=>last.has(q.id))),rng);
    return [...fresh,...old,...previous].slice(0,count/size).flat();
   }
   const fresh=shuffle(bank.filter(q=>!seen.has(q.id)&&!last.has(q.id)),rng),old=shuffle(bank.filter(q=>seen.has(q.id)&&!last.has(q.id)),rng),previous=shuffle(bank.filter(q=>last.has(q.id)),rng),picked=[],ids=new Set(),families=new Set();
   const choose=(pool,limits=true)=>{for(const q of pool){if(picked.length===count)break;if(ids.has(q.id))continue;const family=q.family||q.id;if(limits&&(families.has(family)||q.difficulty==='basic'&&picked.filter(x=>x.difficulty==='basic').length>=Math.max(1,Math.floor(count*.2))))continue;picked.push(q);ids.add(q.id);families.add(family);}};
   choose(fresh);choose(old);choose([...fresh,...old],false);choose(previous);choose(previous,false);
   return shuffle(picked,rng);
 }
 function prepare(q,rng=Math.random){
  if(q.type==='numeric'||q.type==='text')return {...q};
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
 function textAnswer(s){return String(s??'').normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');}
 function ready(q,selected){if(q.type==='text')return typeof selected==='string'&&textAnswer(selected).length>0;if(q.type==='numeric')return numeric(selected)!==null;if(q.type==='matching')return Array.isArray(selected)&&selected.length===q.left.length&&selected.every(x=>Number.isInteger(x)&&x>=0);if(q.type==='multiple')return Array.isArray(selected)&&selected.length>0;return Number.isInteger(selected)&&selected>=0;}
 function correct(q,selected){if(!ready(q,selected))return false;if(q.type==='text')return [q.answer,...(q.acceptedAnswers||[])].some(a=>textAnswer(a)===textAnswer(selected));if(q.type==='numeric')return numeric(selected)===q.answer;if(q.type==='matching')return q.answer.every((a,i)=>a===selected[i]);if(q.type==='multiple')return q.answer.length===selected.length&&q.answer.every(a=>selected.includes(a));return q.answer===selected;}
 function readingGroups(bank){const groups=new Map();for(const q of bank){const key=q.passageId||q.id;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q);}return [...groups.values()].map(g=>g.sort((a,b)=>(a.readingOrder||0)-(b.readingOrder||0)));}
 function quizOrder(questions,bank=questions,review=false,rng=Math.random){const ordered=[],added=new Set();for(const q of shuffle(questions,rng)){if(added.has(q.passageId||q.id))continue;const group=q.passageId?(review?bank:questions).filter(x=>x.passageId===q.passageId).sort((a,b)=>a.readingOrder-b.readingOrder):[q];if(review&&ordered.length+group.length>20)continue;ordered.push(...group);added.add(q.passageId||q.id);}return ordered;}
 function practiceBank(unit,mode){return unit.literacyAvailable?unit.questions.filter(q=>mode==='reading'?!!q.passageId:!q.passageId):unit.questions;}
 function practiceCounts(bank){const cap=Math.floor(bank.length/2);return [5,10,20,40].filter(n=>n<=cap&&(!bank[0]?.passageId||n%5===0));}
 const api={shuffle,sample,prepare,ready,correct,numeric,readingGroups,quizOrder,practiceBank,practiceCounts};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReviewEngine=api;
})(globalThis);
