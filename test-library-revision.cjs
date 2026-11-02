const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),E=require('./dist/engine.js');
const c={window:{},document:{addEventListener(){}}};
for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','exam-b-diagrams','learning-visuals'])vm.runInNewContext(fs.readFileSync('dist/'+f+'.js','utf8'),c);
const W=c.window,active=W.REVIEW_UNITS.filter(u=>u.active!==false),all=active.flatMap(u=>u.questions),audit=JSON.parse(fs.readFileSync('reference-library/revision-audit.json','utf8')),retired=new Set(audit.records.map(q=>q.id));
assert.equal(all.length,audit.after);assert.equal(audit.before-audit.retired+audit.added,audit.after);assert.equal(all.filter(q=>q.revision===16).length,audit.added);
const ids=new Set(all.map(q=>q.id));assert.equal(ids.size,all.length);assert.ok(all.every(q=>!retired.has(q.id)));
for(const q of all.filter(q=>q.revision===16)){
 assert.ok(q.sourceIds.length&&q.referencePages.length,q.id);assert.ok(q.explanation.length>=10,q.id);
 const ready=E.prepare(q);assert.ok(E.correct(ready,ready.answer),q.id);
 if(q.options){assert.ok(q.options.length>=2,q.id);assert.equal(new Set(q.options).size,q.options.length,q.id);}
 if(q.visual?.table){assert.ok(q.visual.table.rows.every(r=>r.length===q.visual.table.headers.length),q.id);}
}
for(const u of active)for(const mode of u.literacyAvailable?['concept','reading']:['concept']){
 const bank=E.practiceBank(u,mode);assert.ok(E.practiceCounts(bank).length,u.id+'/'+mode+' 必須有可選題數');
 for(const n of E.practiceCounts(bank)){
  let h={seen:[],last:[],recent:[]};
  for(let run=0;run<20;run++){
   const draw=E.sample(bank,n,h),drawIds=draw.map(q=>q.id);assert.equal(draw.length,n);assert.equal(new Set(drawIds).size,n);
   assert.ok(drawIds.every(id=>!h.last.includes(id)),u.id+' 不可與上一份重複');
   if(mode==='reading')assert.ok(E.readingGroups(draw).every(g=>g.length===5));
   h={seen:[...new Set([...h.seen,...drawIds])],last:drawIds,recent:[...h.recent,drawIds].slice(-6)};
  }
 }
}
const map=new Map(all.concat(W.REVIEW_EXAM_ITEMS).map(q=>[q.id,q]));
for(const p of W.REVIEW_EXAMS){assert.ok(p.entries.every(e=>map.has(e.questionId)&&!retired.has(e.questionId)),p.id);assert.equal(p.entries.reduce((n,e)=>n+e.points,0),100);}
for(const q of all.concat(W.REVIEW_EXAM_ITEMS)){
 const v=W.LearningVisuals.dataFor(q),h=W.LearningVisuals.markup(q);
 if(!v){assert.equal(h,'');continue;}
 assert.ok(!/NaN|undefined|Infinity/.test(h),q.id);
 if(v.kind==='referenceData'){assert.ok(h.includes('<table'));assert.ok(!h.includes('<svg'));}
 else assert.ok(h.includes('<svg'),q.id);
}
const numeric=Object.fromEntries(all.filter(q=>q.revision===16&&q.type==='numeric').map(q=>[q.libraryKey,q.answer]));
assert.equal(numeric['u8-t202-n1'],40);assert.equal(numeric['u17-t203-n1'],8206);assert.equal(numeric['u18-t204-n1'],8440);assert.equal(numeric['u19-t201-n1'],35);assert.equal(numeric['u10-t201-n1'],43);assert.equal(numeric['u11-t205-n1'],36);
console.log(`資料庫修訂通過：退役 ${audit.retired} 題、新增 ${audit.added} 題、現行 ${all.length} 題；來源頁碼、資料欄位、退役隔離、抽題、完整閱讀與 20 份百分制考卷。`);
if(process.argv.includes('--gallery')){
 const selected=['u22-t204-a','u1-t222-r1','u2-t221-r1','u7-t206-a','u16-t203-a','u19-t201-n1','u10-t204-n1','u23-t221-r1'].map(id=>all.find(q=>q.libraryKey===id));
 fs.writeFileSync('dist/qa-library.html','<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="learning-visuals.css"><style>body{font:20px/1.7 system-ui;background:#f2f5f0;padding:20px}main{max-width:1000px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:20px}article{background:white;padding:20px;border-radius:16px}.learning-visual svg{width:100%;height:260px}.visual-zoom{display:none}h2{font-size:21px}</style><h1>資料庫修訂圖文檢視</h1><main>'+selected.map(q=>'<article><h2>'+q.text+'</h2>'+W.LearningVisuals.markup(q)+'</article>').join('')+'</main></html>');
}
