const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),sandbox);const units=JSON.parse(JSON.stringify(sandbox.window.REVIEW_UNITS));const E=require('./dist/engine.js');
let checked=0;
assert.equal(units.length,26);
for(const u of units){
 assert.equal(u.cards.length,20);assert.equal(u.questions.length,u.literacyAvailable?200:100);assert.equal(new Set(u.questions.map(q=>q.text)).size,u.questions.length);
 const counts=Object.fromEntries(['single','boolean','multiple','matching','numeric'].map(t=>[t,u.questions.filter(q=>q.type===t).length]));if(u.subject==='自然'||u.subject==='社會')assert.deepEqual(counts,{single:140,boolean:20,multiple:20,matching:20,numeric:0});else if(u.readingSetSize){assert.equal(counts.single,100);assert.ok(u.questions.every(q=>q.passage&&q.passageTitle));}else {assert.ok(u.questions.every(q=>q.type==='single'||q.type==='numeric'&&Number.isFinite(q.answer)));if(u.id===21){assert.equal(counts.single,40);assert.equal(counts.numeric,60);}else assert.equal(counts.numeric,100);}
 for(const q of u.questions){
  assert.ok(q.explanation.length>10);if(q.options)assert.equal(new Set(q.options).size,q.options.length,q.id+'選項不得重複');
  for(let k=0;k<10;k++){
   const p=E.prepare(q);assert.equal(E.correct(p,p.answer),true,q.id+'正確答案不能判錯');assert.equal(E.correct(p,null),false);
   if(q.type==='numeric'){assert.equal(E.correct(p,String(p.answer)),true);assert.equal(E.correct(p,String(p.answer)+'.0'),true);assert.equal(E.correct(p,String(p.answer).replace(/\d/g,c=>String.fromCharCode(c.charCodeAt(0)+65248))),true);assert.equal(E.correct(p,String(p.answer+1)),false);for(const bad of ['',null,' ','20本','1e2','1+1','Infinity',[],true])assert.equal(E.ready(p,bad),false);}
   if(q.type==='single'||q.type==='boolean'){assert.equal(p.options[p.answer],q.options[q.answer]);assert.equal(E.correct(p,(p.answer+1)%p.options.length),false);}
   if(q.type==='multiple'){assert.deepEqual(p.answer.map(i=>p.options[i]).sort(),q.answer.map(i=>q.options[i]).sort());assert.equal(E.correct(p,p.answer.slice(0,1)),false);assert.equal(E.correct(p,[0,1,2,3]),false);assert.equal(E.correct(p,[...p.answer].reverse()),true);}
   if(q.type==='matching'){p.left.forEach((l,i)=>assert.equal(p.options[p.answer[i]],q.pairs[i][1]));const wrong=[...p.answer];wrong[0]=(wrong[0]+1)%3;assert.equal(E.correct(p,wrong),false);assert.equal(E.ready(p,[0,null,1]),false);}
   checked++;
  }
 }
 for(const bank of (u.literacyAvailable?[E.practiceBank(u,"concept"),E.practiceBank(u,"reading")]:[u.questions]))for(const n of [10,20,40]){
  let history={seen:[],last:[]};
  for(let round=0;round<30;round++){
   const sample=E.sample(bank,n,history);assert.equal(sample.length,n);assert.equal(new Set(sample.map(q=>q.id)).size,n);assert.ok(sample.every(q=>!history.last.includes(q.id)),'不得與上一份重複');
   const unseen=100-new Set(history.seen).size;if(unseen>=n)assert.ok(sample.every(q=>!history.seen.includes(q.id)),'未練題數足夠時應優先抽未練題');
   if(u.literacyAvailable&&!bank[0].passageId)for(const t of Object.keys(counts))assert.equal(sample.filter(q=>q.type===t).length,n*(t==='single'?.4:t==='numeric'?0:.2));
   history={seen:[...new Set([...history.seen,...sample.map(q=>q.id)])],last:sample.map(q=>q.id)};
  }
  assert.equal(new Set(history.seen).size,100,'重複練習後需遍歷題庫');
 }
}
assert.equal(new Set(units.flatMap(u=>u.questions.map(q=>q.id))).size,3400);
// 抽樣以獨立枚舉法核對公因數、公倍數，避免只重複產生公式。
for(const q of units[11].questions){const i=q.topic,a=i+4,b=i%7+6;let common=[];for(let d=1;d<=Math.min(a,b);d++)if(a%d===0&&b%d===0)common.push(d);let l=1;while(l%a||l%b)l++;const k=Number(q.id.at(-1));assert.equal(q.answer,k===1?common.at(-1):k===2||k===3?l:k===4?common.at(-1)*2:common.at(-1)*3);}
for(const q of units[8].questions){assert.equal(q.chart.values.length,q.chart.labels.length);assert.ok(q.chart.values.every(Number.isFinite));}
assert.deepEqual(units[4].lessonNames.split('／'),['蚊帳大使','從空中看臺灣','攀岩高手']);
console.log(`通過：26 組、520 個重點、3,400 題；${checked} 次重排／評分；3,060 份抽題、前後不重複與遍歷；數字輸入及公因倍數檢查。`);

assert.deepEqual(units.map(u=>u.id),units.map((u,i)=>i));for(const grade of [3,5]){assert.equal(units.filter(u=>u.grade===grade).length,13);assert.equal(units.filter(u=>u.grade===grade).flatMap(u=>u.questions).length,1700);}assert.equal(units[13].lessonNames,'時間是什麼／妙用便利貼／提早五分鐘');assert.equal(units[24].name,'升上三年級的新學習');assert.equal(units[25].name,'校園規範和班級自治');
