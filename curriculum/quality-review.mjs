import curateMath from './curated-math.mjs';
import curateReading from './curated-reading.mjs';
import {attachSources} from './assessment-sources.mjs';
export default function reviewQuality(units){
 const baseline=new Map(units.map(u=>[u.id,u.questions.map(q=>q.id)]));
 curateMath(units);curateReading(units);
 for(const u of units.filter(u=>u.literacyAvailable)){
  const before=u.questions.length;
  const topics=new Set();const retained=[];
  // 同篇只換人名與表格數字的五個版本，僅留下第一版，整篇保留五題。
  for(const q of u.questions){if(q.passageId){if(q.topic<24)retained.push({...q,family:'reading-case-'+q.topic,difficulty:q.readingOrder<3?'core':'challenge'});continue;}
   // 每個觀念保留一題較具情境的單選，避免再以是非／配對反覆背同一事實。
   if(topics.has(q.topic))continue;topics.add(q.topic);
   const candidates=u.questions.filter(x=>!x.passageId&&x.topic===q.topic&&x.type==='single');
   const score=x=>x.text.length+(/實驗|如果|下列|觀察|為什麼|哪種|發現|比較|小[明安華美]/.test(x.text)?20:0);
   const best=[...candidates].sort((a,b)=>score(b)-score(a))[0]||q;
   retained.push({...best,family:'concept-'+q.topic,difficulty:'core'});
  }
  u.questions=retained;u.qualityRevision=6;u.audit={before,after:retained.length,reason:'同一事實的跨題型重複只保留一題；同情境換名字／數字的閱讀複本整篇刪除。'};
 }
 attachSources(units);
 for(const u of units){const old=new Set(baseline.get(u.id)),active=new Set(u.questions.map(q=>q.id));u.audit={...u.audit,before:old.size,after:active.size,removed:[...old].filter(id=>!active.has(id)).length,added:[...active].filter(id=>!old.has(id)).length};
  if(u.articleVisuals){const passages=new Set(u.questions.map(q=>q.passageId).filter(Boolean));u.articleVisuals=Object.fromEntries(Object.entries(u.articleVisuals).filter(([id])=>passages.has(id)));}
  for(const q of u.questions)if(q.revision===6&&u.subject==='數學')q.concept=u.name+'・'+(q.difficulty==='basic'?'觀念核對':'推理應用');
  for(const q of u.questions)if(q.passage&&u.subject==='英語')q.passage=q.passage.replace(/\b1 (apples|bananas|oranges|guavas|papayas|kiwis|pears|pineapples)\b/g,(_,noun)=>'1 '+noun.slice(0,-1));
 }
}
