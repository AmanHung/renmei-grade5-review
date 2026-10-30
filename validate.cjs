const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),sandbox);const units=JSON.parse(JSON.stringify(sandbox.window.REVIEW_UNITS));const E=require('./dist/engine.js');
let checked=0;
assert.equal(units.length,4);
for(const u of units){
 assert.equal(u.cards.length,20);assert.equal(u.questions.length,100);assert.equal(new Set(u.questions.map(q=>q.text)).size,100);
 const counts=Object.fromEntries(['single','boolean','multiple','matching'].map(t=>[t,u.questions.filter(q=>q.type===t).length]));assert.deepEqual(counts,{single:40,boolean:20,multiple:20,matching:20});
 for(const q of u.questions){
  assert.ok(q.explanation.length>10);
  for(let k=0;k<10;k++){
   const p=E.prepare(q);assert.equal(E.correct(p,p.answer),true,q.id+'正確答案不能判錯');assert.equal(E.correct(p,null),false);
   if(q.type==='single'||q.type==='boolean'){assert.equal(p.options[p.answer],q.options[q.answer]);assert.equal(E.correct(p,(p.answer+1)%p.options.length),false);}
   if(q.type==='multiple'){assert.deepEqual(p.answer.map(i=>p.options[i]).sort(),q.answer.map(i=>q.options[i]).sort());assert.equal(E.correct(p,p.answer.slice(0,1)),false);assert.equal(E.correct(p,[0,1,2,3]),false);assert.equal(E.correct(p,[...p.answer].reverse()),true);}
   if(q.type==='matching'){p.left.forEach((l,i)=>assert.equal(p.options[p.answer[i]],q.pairs[i][1]));const wrong=[...p.answer];wrong[0]=(wrong[0]+1)%3;assert.equal(E.correct(p,wrong),false);assert.equal(E.ready(p,[0,null,1]),false);}
   checked++;
  }
 }
 for(const n of [10,20,40]){
  let history={seen:[],last:[]};
  for(let round=0;round<30;round++){
   const sample=E.sample(u.questions,n,history);assert.equal(sample.length,n);assert.equal(new Set(sample.map(q=>q.id)).size,n);assert.ok(sample.every(q=>!history.last.includes(q.id)),'不得與上一份重複');
   const unseen=100-new Set(history.seen).size;if(unseen>=n)assert.ok(sample.every(q=>!history.seen.includes(q.id)),'未練題數足夠時應優先抽未練題');
   for(const t of Object.keys(counts))assert.equal(sample.filter(q=>q.type===t).length,n*(t==='single'?.4:.2));
   history={seen:[...new Set([...history.seen,...sample.map(q=>q.id)])],last:sample.map(q=>q.id)};
  }
  assert.equal(new Set(history.seen).size,100,'重複練習後需遍歷題庫');
 }
}
assert.equal(new Set(units.flatMap(u=>u.questions.map(q=>q.id))).size,400);
console.log(`通過：80 個重點、400 題結構與答案、${checked} 次選項重排評分，以及 360 份抽題的題型比例、不重複及題庫遍歷檢查。`);
