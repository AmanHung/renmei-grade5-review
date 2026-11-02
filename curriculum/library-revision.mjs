import fs from 'node:fs';
import concepts from './library-concepts.mjs';
import reading from './library-reading.mjs';
import english from './library-english.mjs';
import language from './library-language.mjs';
import math from './library-math.mjs';
import {sources} from './assessment-sources.mjs';
const reviewed=JSON.parse(fs.readFileSync(new URL('../reference-library/catalogue.json',import.meta.url),'utf8')).sources;
for(const r of reviewed.filter(r=>r.analysis))sources[r.id]={title:r.title,url:r.url,detail:`2026-11-02 檢閱；${r.scope_match}。可參考：${r.analysis.included} 排除：${r.analysis.excluded}`};
export default function applyLibrary(units,papers,extras){
 const before=units.filter(u=>u.active!==false).flatMap(u=>u.questions);
 const original=new Map(units.flatMap(u=>u.questions).concat(extras).map(q=>[q.id,q]));
 const additions=[...concepts(units),...reading(units),...english(units),...language(units),...math(units)];
 for(const q of additions){
  const kind=q.unit===1&&q.passageTitle==='光照進水裡'?'referenceOptics':q.unit===2&&q.passageTitle==='旅行前先看位置圖'?'referenceMap':q.unit===22&&q.id==='u22-t204-a'?'referenceRoots':null;
  if(kind)q.visual={...q.visual,kind,caption:kind==='referenceOptics'?'光從空氣斜射入水':kind==='referenceMap'?'臺灣與澎湖位置示意':'兩種根系的構造比較',description:'圖與本文資料相互對照；示意圖未依比例。'};
 }
 // Keep the established two-digit topic ID contract accepted by the deployed GAS.
 // Reserve every legacy ID, including the questions retired in this revision.
 const reserved=new Set(original.keys());
 const allocate=(unit,suffix,preferred)=>{
  const candidates=[preferred,...Array.from({length:99},(_,i)=>99-i)].filter(n=>n>=1&&n<=99);
  for(const n of candidates){const id=`u${unit}-t${String(n).padStart(2,'0')}-${suffix}`;if(!reserved.has(id)){reserved.add(id);return id;}}
  throw Error('可用題號不足：'+unit+'/'+suffix);
 };
 for(const q of additions){q.libraryKey=q.id;const suffix=q.id.split('-').at(-1),n=Number(q.id.match(/-t(\d+)/)[1]);q.id=allocate(q.unit,suffix,n>=221?63+n-221:q.type==='numeric'?91+n-201:51+n-201);}
 const records=[],retired=new Set();
 const science=new Set([0,1,2,3,22,23,24,25]);
 for(const u of units.filter(u=>u.active!==false)){
  let rulerKept=false;
  u.questions=u.questions.filter(q=>{
   let reason='';
   if(science.has(u.id))reason=q.passageId?'閱讀複本大量沿用相同敘述與過度簡化的干擾選項；整組退役，改用資料庫考點情境':'觀念題含牽強或跨考點的干擾選項，套用通用插圖；改用逐題重編題';
   else if(u.subject==='英語')reason='原閱讀常含超出入門範圍的說明或重複資料核對語句；改為範圍內句型、圖文與完整對話';
   else if(u.grade===3&&u.subject==='國語')reason='文章共用「一開始只覺得不順利」等抽象模板，故事細節不足；整篇改寫為具體事件';
   else if(q.family==='ruler-translation'){if(rulerKept)reason='讀尺平移系列均固定長 17 毫米，只改起終點，刪除重複變式';rulerKept=true;}
   if(!reason)return true;
   retired.add(q.id);records.push({id:q.id,unit:u.id,passageId:q.passageId||null,reason});return false;
  });
  u.questions.push(...additions.filter(q=>q.unit===u.id));
  u.qualityRevision=16;
  if(['國語','英語'].includes(u.subject))u.literacyAvailable=true;
 }
 const weak=/私人密碼|石頭與紙|水不存在|永遠代寫|鞋子顏色|拍照者名字|照片檔案大小|午餐菜單|把所有不同結果刪掉|把紀錄改成零|圖中沒有任何位置/;
 const bad=q=>weak.test([q.text,...(q.options||[]),q.passage||''].join(' '));
 const used=new Set(),replacements=[],groupMap=new Map();
 const clone=(source,p,old)=>{
  const copy=structuredClone(source);copy.id=allocate(source.unit,source.type==='numeric'?'n2':'b',99);
  copy.examRevision=16;copy.examOrigin=source.id;copy.variant=p.variant;extras.push(copy);used.add(source.id);
  replacements.push({paper:p.id,old:old.id,new:copy.id,origin:source.id});return copy;
 };
 const examMap=new Map(original);
 for(const p of papers){
  const within=new Set(),passagesUsed=new Set();
  const badPassages=new Set(p.entries.map(e=>original.get(e.questionId)).filter(q=>q?.passageId&&bad(q)).map(q=>q.passageId));
  for(const section of p.sections)for(const entry of section.entries){
   const old=original.get(entry.questionId);
   if(!old)throw Error('原卷題號不存在：'+entry.questionId);
   const rewriteLanguage=units[old.unit].subject==='英語'||units[old.unit].grade===3&&units[old.unit].subject==='國語';
   if(!retired.has(old.id)&&!bad(old)&&!badPassages.has(old.passageId)&&!rewriteLanguage){within.add(old.id);continue;}
   const pool=units[old.unit].questions.filter(q=>q.revision===16);
   let replacement;
   if(old.passageId){
    const key=p.id+'|'+old.passageId;
    if(!groupMap.has(key)){
     const groups=[...new Set(pool.map(q=>q.passageId).filter(Boolean))];
     const pid=groups.find(id=>!passagesUsed.has(id)&&pool.filter(q=>q.passageId===id).every(q=>!used.has(q.id)))||groups.find(id=>!passagesUsed.has(id));
     if(!pid)throw Error('新閱讀題組不足：'+key);
     groupMap.set(key,{id:pid,index:0});passagesUsed.add(pid);
    }
    const group=groupMap.get(key),options=pool.filter(q=>q.passageId===group.id).sort((a,b)=>a.readingOrder-b.readingOrder);
    replacement=options[group.index++];if(!replacement)throw Error('原卷同組小題過多：'+key);
   }else{
    const candidates=pool.filter(q=>!q.passageId&&q.type===old.type);
    replacement=candidates.find(q=>!used.has(q.id)&&!within.has(q.id))||candidates.find(q=>!within.has(q.id));
    if(!replacement){
     const fallback=pool.filter(q=>!q.passageId&&q.type==='single');replacement=fallback.find(q=>!used.has(q.id)&&!within.has(q.id))||fallback.find(q=>!within.has(q.id));
    }
    if(!replacement)throw Error('新獨立題不足：'+p.id+'/'+old.unit+'/'+old.type);
   }
   within.add(replacement.id);
   const copy=clone(replacement,p,old);entry.questionId=copy.id;examMap.set(copy.id,copy);
  }
  p.entries=p.sections.flatMap(s=>s.entries);
  p.coverage=[...new Set(p.entries.map(e=>examMap.get(e.questionId).unit))].map(unit=>({unit,name:units[unit].name,count:p.entries.filter(e=>examMap.get(e.questionId).unit===unit).length,points:p.entries.filter(e=>examMap.get(e.questionId).unit===unit).reduce((n,e)=>n+e.points,0)}));
  p.readingCount=p.entries.filter(e=>examMap.get(e.questionId).passageId).length;
  p.formatVersion=16;
  if(p.subject==='英語')p.sections[0].title='一、字詞與句型選擇';
  if(p.grade===3&&p.subject==='國語')p.sections[0].title='一、語詞與句型判讀';
  if(p.subject==='英語'||p.grade===3&&p.subject==='國語')p.level='依課內句型與情境理解練習';
  // Replacements retain the section's response mode wherever possible.
  for(const s of p.sections){const types=[...new Set(s.entries.map(e=>examMap.get(e.questionId).type))];s.instructions=types.includes('boolean')?'判斷敘述正確或錯誤；其他題目依提示作答。':types.includes('numeric')?'依題目計算；數字題只填數字，其他題目依提示作答。':'先讀完整題幹或共用文章，再依題目選答或填答。';}
 }
 // Drop unused legacy exam items so retired content cannot reappear through a stale bank.
 const referenced=new Set(papers.flatMap(p=>p.entries.map(e=>e.questionId)));
 extras.splice(0,extras.length,...extras.filter(q=>referenced.has(q.id)));
 let removedIllustrations=0;
 for(const q of units.flatMap(u=>u.questions).concat(extras)){
  if(q.visual?.kind==='subjectScene'){
   // Preserve actual table data; remove the generic illustration attached by topic matching.
   const table=q.visual.table;
   if(table)q.visual={kind:'referenceData',caption:q.visual.caption,description:'依題目、文章與資料表判斷。',table};
   else {delete q.visual;q.visualPolicy='none';}
   delete q.visualAudit;removedIllustrations++;
  }
  if(!q.visual&&!q.chart&&!q.figure)q.visualPolicy='none';
 }
 for(const u of units){
  const ids=[...new Set(u.questions.flatMap(q=>q.sourceIds||[]))];u.sources=ids.filter(id=>sources[id]).map(id=>({id,...sources[id]}));
  u.sourceNote='依公開考卷共同考點與題型整理；新增情境、文字及圖表重新編寫。來源與頁碼見逐題解析。';
  u.audit={...u.audit,after:u.questions.length,libraryAdded:additions.filter(q=>q.unit===u.id).length,libraryRetired:records.filter(q=>q.unit===u.id).length};
 }
 const result={version:16,date:'2026-11-02',before:before.length,after:units.filter(u=>u.active!==false).reduce((n,u)=>n+u.questions.length,0),added:additions.length,retired:records.length,removedIllustrations,records,examReplacements:replacements};
 fs.writeFileSync('reference-library/revision-audit.json',JSON.stringify(result,null,2)+'\n');
 fs.writeFileSync('題庫更新與退役紀錄.md',`# 依參考考卷修訂題庫\n\n日期：2026-11-02；內容修訂版：16。\n\n原有 ${result.before} 題，退役 ${result.retired} 題，新增 ${result.added} 題，現行 ${result.after} 題。移除或改為資料表的通用插圖 ${removedIllustrations} 處（含考卷題）。\n\n自然社會觀念與閱讀、三上國語模板文章及兩年級英語全部改用重新編寫的題目；五上國語保留較完整的閱讀文本，另補語詞、修辭與句型。數學保留可核算的計算及推理題，刪除固定長度的平移複本，另補公開卷共同考點。新增題目附來源 ID、參考頁碼與解析。原始考卷全文未放入公開網站。\n\n舊題號不移作新題；既有作答紀錄保留。模擬考改題後重新計算簽章，舊草稿不當作新版繼續作答。\n\n## 各單元\n\n| 年級 | 科目 | 單元 | 退役 | 新增 | 現行題數 |\n| --- | --- | --- | ---: | ---: | ---: |\n${units.filter(u=>u.active!==false).map(u=>`| ${u.grade} 上 | ${u.subject} | ${u.name} | ${u.audit.libraryRetired} | ${u.audit.libraryAdded} | ${u.questions.length} |`).join('\n')}\n\n逐題退役理由與考卷替換對應見 [機器可讀紀錄](reference-library/revision-audit.json)。\n`);
 return result;
}
