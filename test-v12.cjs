const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),E=require('./dist/engine.js');
const ctx={window:{},document:{addEventListener(){}}};for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','exam-b-diagrams','learning-visuals'])vm.runInNewContext(fs.readFileSync('dist/'+f+'.js','utf8'),ctx);
ctx.window.REVIEW_UNITS=JSON.parse(JSON.stringify(ctx.window.REVIEW_UNITS));const W=ctx.window,active=W.REVIEW_UNITS.filter(u=>u.active!==false),bank=active.flatMap(u=>u.questions),map=new Map(bank.concat(W.REVIEW_EXAM_ITEMS).map(q=>[q.id,q]));
assert.equal(active.length,25);assert.equal(bank.length,3437);assert.deepEqual(active.filter(u=>u.grade===3&&u.subject==='數學').map(u=>u.number),[1,2,3,4]);
let runs=0;for(const u of active){assert.ok(u.questions.length>=100);for(const mode of u.literacyAvailable?['concept','reading']:['concept']){
 const b=E.practiceBank(u,mode);assert.ok(b.length>=100,u.name+' / '+mode);
 let h={seen:[],last:[],recent:[]};for(let i=0;i<50;i++){
  const picked=E.sample(b,10,h),ids=picked.map(q=>q.id);assert.equal(new Set(ids).size,10);
  const recent=new Set(h.recent.flat());assert.ok(ids.every(id=>!recent.has(id)),u.name+' 應避開最近六份');
  if(picked[0].passageId)assert.ok(E.readingGroups(picked).every(g=>g.length===5));
  h={seen:[...new Set([...h.seen,...ids])],last:ids,recent:[...h.recent,ids].slice(-6)};runs++;
 }
}
}
for(const p of W.REVIEW_EXAMS.filter(p=>p.grade===3&&p.subject==='數學')){assert.equal(p.entries.length,25);assert.equal(p.entries.reduce((n,e)=>n+e.points,0),100);assert.ok(p.entries.every(e=>map.get(e.questionId).unit!==21));}
const sample=['u17-t44-n1','u10-t46-n1','u10-t50-n1','u11-t41-n1','u11-t42-n1','u18-t41-n1','u19-t46-n1','u20-t44-n1','u20-t46-n1','u20-t47-n1','u19-t61-n1','u19-t84-n2'];
for(const id of sample){const q=map.get(id),h=W.LearningVisuals.markup(q);assert.ok(/<svg/.test(h));assert.ok(!/NaN|Infinity|undefined/.test(h));}
// Deterministic adversarial RNG still cannot return the previous six 10-question sets.
let h={seen:[],last:[],recent:[]};for(let i=0;i<20;i++){const ids=E.sample(active[0].questions.filter(q=>!q.passageId),10,h,()=>0).map(q=>q.id);assert.ok(ids.every(id=>!h.recent.flat().includes(id)));h={seen:[...h.seen,...ids],last:ids,recent:[...h.recent,ids].slice(-6)};}
console.log('v12 通過：3437 題、25 個有效單元；'+runs+' 份十題練習避開最近六份、完整閱讀、三上四單元與新增圖形。');
if(process.argv.includes('--gallery'))fs.writeFileSync('dist/qa-v12.html','<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="learning-visuals.css"><style>body{font-family:system-ui;background:#eef3ef;margin:20px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}article{background:white;padding:12px;border-radius:14px}h1{font-size:28px}h2{font-size:18px}.learning-visual svg{width:100%;height:230px}.visual-zoom{display:none}</style><h1>新增配圖檢視</h1><main>'+sample.map(id=>{const q=map.get(id);return '<article><h2>'+q.text+'</h2>'+W.LearningVisuals.markup(q)+'</article>';}).join('')+'</main></html>');
