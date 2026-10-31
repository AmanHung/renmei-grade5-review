const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const E=require('./dist/engine.js'),M=require('./dist/mock-engine.js');
const context={window:{}};vm.createContext(context);for(const file of ['content','mock-content'])vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'),context);
const units=context.window.REVIEW_UNITS,papers=context.window.REVIEW_EXAMS,bank=units.flatMap(u=>u.questions).concat(context.window.REVIEW_EXAM_ITEMS);
assert.equal(papers.length,10);assert.equal(new Set(papers.map(p=>p.id)).size,10);
let number=0;
for(const p of papers){
 assert.equal(p.entries.length,20);assert.equal(p.entries.reduce((n,e)=>n+e.points,0),100);assert.equal(new Set(p.entries.map(e=>e.questionId)).size,20);
 const expected=units.filter(u=>u.grade===p.grade&&u.subject===p.subject);assert.equal(p.coverage.length,expected.length);
 const d=M.create(p,bank,'測試學生',()=>`session-mock-${++number}`,()=>.37);assert.equal(M.compatible(d,p,'測試學生'),true);assert.equal(M.compatible(d,p,'另一位'),false);assert.equal(M.compatible(d,{...p,signature:'new-version'},'測試學生'),false);
 assert.equal(M.missing(d).length,20);assert.throws(()=>M.grade(d),/整份/);assert.equal(d.result,null,'草稿不可先揭露分數');
 for(const q of d.questions){assert.equal(units[q.unit].grade,p.grade);assert.equal(units[q.unit].subject,p.subject);assert.ok(q.sourceIds?.length||units[q.unit].sources?.length);assert.ok(['single','numeric'].includes(q.type));d.answers[q.id]=q.type==='numeric'?String(q.answer).replace(/\d/g,c=>String.fromCharCode(c.charCodeAt(0)+65248)):q.answer;}
 const last=d.questions.at(-1),held=d.answers[last.id];delete d.answers[last.id];assert.throws(()=>M.grade(d),/整份/);d.answers[last.id]=held;
 assert.equal(M.grade(d).score,100);assert.equal(M.grade(d).right,20);
 // 17 題正確應是 85 分，而不是依所選題型重算權重。
 d.questions.slice(0,3).forEach(q=>d.answers[q.id]=q.type==='numeric'?String(q.answer+1):(q.answer+1)%q.options.length);
 assert.equal(M.grade(d).score,85);assert.equal(M.grade(d).right,17);
 const restored=JSON.parse(JSON.stringify(d));assert.equal(M.compatible(restored,p,'測試學生'),true);assert.deepEqual(restored.questions.map(q=>q.options||null),JSON.parse(JSON.stringify(d.questions.map(q=>q.options||null))));assert.equal(M.grade(restored).score,85);
 d.result=M.grade(d);d.questions.forEach(q=>d.answers[q.id]=q.answer);assert.equal(M.grade(d).score,85,'交卷後不得改分');
 const groups=E.readingGroups(d.questions);for(const g of groups){const indices=g.map(q=>d.questions.indexOf(q));assert.equal(Math.max(...indices)-Math.min(...indices)+1,g.length,'同篇題目須相鄰');}
 if(p.subject==='數學'){assert.ok(p.coverage.every(c=>c.count===4));assert.ok(d.questions.some(q=>q.type==='numeric'));assert.equal(new Set(d.questions.map(q=>q.family||q.id)).size,20,'同卷不重複相同運算任務');}
 else{assert.ok(p.readingCount>=12);assert.ok(groups.filter(g=>g[0].passageId).length>=4);}
 if(p.subject==='國語')assert.equal(groups.length,6);
 console.log(`${p.title}：20 題／100 分，範圍、完整送出、85 分批改、草稿與名字隔離通過。`);
}
// 測試真實 Learner 的批次暫存：只有交卷才呼叫，穩定 ID 重試不重複。
const storage=new Map(),elements=new Map();for(const id of ['#change-learner','#sync-now','#learner-name','#sync-status'])elements.set(id,{});
storage.set('little-study-active-v3',JSON.stringify('測試學生'));
const c={window:{LEARNING_CONFIG:{}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},crypto:{randomUUID:()=>`uuid-mock-${++number}`},navigator:{onLine:false},document:{querySelector:s=>elements.get(s)},setInterval(){},alert(){},console,Date,JSON,URL};c.window.addEventListener=()=>{};vm.createContext(c);vm.runInContext(fs.readFileSync('dist/learner.js','utf8'),c);
const rows=Array.from({length:21},(_,i)=>({id:`mock-stable-${i}`,learner:'測試學生',kind:i===20?'session':'answer'}));
assert.equal(c.window.Learner.records().length,0);assert.equal(c.window.Learner.logBatch(rows),true);assert.equal(c.window.Learner.records().length,21);assert.equal(c.window.Learner.logBatch(rows),true);assert.equal(c.window.Learner.records().length,21);assert.equal(JSON.parse(storage.get('little-study-outbox-v3')).length,21);assert.equal(c.window.Learner.logBatch([{...rows[0],learner:'另一位'}]),false);
// 模擬已收到回執，重載重試不得再次將已保存事件排入同步。
storage.set('little-study-outbox-v3','[]');assert.equal(c.window.Learner.logBatch(rows),true);assert.equal(JSON.parse(storage.get('little-study-outbox-v3')).length,0);
const setItem=c.localStorage.setItem;c.localStorage.setItem=()=>{throw Error('full');};assert.equal(c.window.Learner.logBatch([{...rows[0],id:'mock-new-failed'}]),false);c.localStorage.setItem=setItem;
console.log('批次 21 筆紀錄、重送去重、回執後重試、名字防混用與儲存失敗檢查通過。');
