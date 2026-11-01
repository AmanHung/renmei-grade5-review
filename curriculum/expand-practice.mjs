import fs from 'node:fs';
import {attachSources} from './assessment-sources.mjs';
// 同一考點的數值練習標記為變式，與推理題並存，不宣稱不同考點。
export default function expandPractice(units,baseline){
 for(const u of units){
  if(u.id===21)continue;
  const old=baseline[u.id],ids=new Set(u.questions.map(q=>q.id));
  const key=q=>q.text.replace(/^第 \d+ [組篇]：/,'')+JSON.stringify(q.chart||q.figure||q.visual||q.passage||'');
  const texts=new Set(u.questions.map(key));
  const passages=new Set(u.questions.map(q=>q.passageId).filter(Boolean));
  for(const q of old.questions){
   if(q.passageId&&passages.has(q.passageId))continue;
   if(ids.has(q.id)||texts.has(key(q)))continue;
   const copy=structuredClone(q);
   copy.family=q.passageId?'reading-'+q.passageId:'practice-'+q.concept;
   copy.difficulty=q.type==='numeric'?'core':'basic';
   copy.practiceVariant=true;
   copy.sourceType='依既定課程範圍編寫的練習變式；非出版社或學校原題。同考點可能使用不同數值、角色或題型。';
   u.questions.push(copy);ids.add(q.id);texts.add(key(q));
  }
  u.articleVisuals={...old.articleVisuals,...u.articleVisuals};
  // 若短題同文去重後不足 100，加入具體位值／運算變式，避免重複題幹。
  if(u.id===19)for(let i=0;i<20;i++){
   const start=2+i,end=19+i,len=end-start,shift=3+i;
   u.questions.push({id:'u19-t'+(61+i)+'-n1',unit:19,topic:60+i,concept:'平移後的讀尺',family:'ruler-translation',difficulty:'challenge',type:'numeric',text:'細棒原本從 '+start+' 毫米量到 '+end+' 毫米。保持長度不變，左端移到 '+shift+' 毫米，右端會在幾毫米？',answer:shift+len,unitLabel:'毫米',explanation:'先用終點減起點：'+end+'－'+start+'＝'+len+' 毫米。平移後長度不變，右端＝'+shift+'＋'+len+'＝'+(shift+len)+' 毫米。',visual:{kind:'rulerMove',caption:'細棒平移前後',start,end,shift,max:50},practiceVariant:true});
  }
  if(u.questions.length<100)throw Error('擴充後不足 100 題：'+u.name);
  u.audit.after=u.questions.length;u.audit.added=u.questions.filter(q=>!old.questions.some(o=>o.id===q.id)).length;
  u.audit.removed=old.questions.filter(q=>!ids.has(q.id)).length;
 }
 attachSources(units);
}
