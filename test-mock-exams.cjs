const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const E=require('./dist/engine.js'),M=require('./dist/mock-engine.js');
const context={window:{}};vm.createContext(context);for(const file of ['content','mock-content'])vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'),context);
const units=context.window.REVIEW_UNITS,papers=context.window.REVIEW_EXAMS,bank=units.flatMap(u=>u.questions).concat(context.window.REVIEW_EXAM_ITEMS);
assert.equal(papers.length,20);assert.equal(new Set(papers.map(p=>p.id)).size,20);
let number=0;
for(const p of papers){
 assert.equal(p.count,p.subject==='數學'?25:['自然','社會'].includes(p.subject)?40:30);
 assert.equal(p.entries.length,p.count);assert.equal(p.entries.reduce((n,e)=>n+e.points,0),100);assert.equal(new Set(p.entries.map(e=>e.questionId)).size,p.count);
 assert.equal(p.sections.length,3);assert.equal(p.sections.reduce((n,s)=>n+s.points,0),100);assert.ok(new Set(p.entries.map(e=>e.points)).size>1);
 const expected=units.filter(u=>u.grade===p.grade&&u.subject===p.subject);assert.equal(p.coverage.length,expected.length);
 const d=M.create(p,bank,'測試學生',()=>`session-mock-${++number}`,()=>.37);
 assert.equal(M.compatible(d,p,'測試學生'),true);assert.equal(M.compatible(d,p,'另一位'),false);assert.equal(M.compatible(d,{...p,signature:'new-version'},'測試學生'),false);
 assert.equal(M.missing(d).length,p.count);assert.throws(()=>M.grade(d),/整份/);assert.equal(d.result,null);
 for(const q of d.questions){assert.equal(units[q.unit].grade,p.grade);assert.equal(units[q.unit].subject,p.subject);assert.ok(q.sourceIds?.length);assert.ok(['single','numeric','boolean','text'].includes(q.type));d.answers[q.id]=q.type==='numeric'?String(q.answer).replace(/\d/g,c=>String.fromCharCode(c.charCodeAt(0)+65248)):q.answer;}
 const last=d.questions.at(-1),held=d.answers[last.id];delete d.answers[last.id];assert.throws(()=>M.grade(d),/整份/);d.answers[last.id]=held;
 assert.equal(M.grade(d).score,100);assert.equal(M.grade(d).right,p.count);
 const wrong=q=>q.type==='numeric'?String(q.answer+1):q.type==='text'?'不正確的答案':(q.answer+1)%q.options.length;
 // 故意錯一題低分、一題高分，確認按實際配分而非答對比例。
 const low=d.questions[0],high=d.questions.find(q=>q.points!==low.points);d.answers[low.id]=wrong(low);d.answers[high.id]=wrong(high);
 const expectedScore=100-low.points-high.points;
 assert.equal(M.grade(d).score,expectedScore);assert.equal(M.grade(d).right,p.count-2);
 const restored=JSON.parse(JSON.stringify(d));assert.equal(M.compatible(restored,p,'測試學生'),true);assert.deepEqual(restored.questions.map(q=>q.options||null),JSON.parse(JSON.stringify(d.questions.map(q=>q.options||null))));assert.equal(M.grade(restored).score,expectedScore);
 d.result=M.grade(d);d.questions.forEach(q=>d.answers[q.id]=q.answer);assert.equal(M.grade(d).score,expectedScore);
 const zero=M.create(p,bank,'測試學生',()=>`session-zero-${++number}`);zero.questions.forEach(q=>zero.answers[q.id]=wrong(q));assert.equal(M.grade(zero).score,0);
 const groups=E.readingGroups(d.questions);for(const g of groups){const indices=g.map(q=>d.questions.indexOf(q));assert.equal(Math.max(...indices)-Math.min(...indices)+1,g.length);}
 if(p.subject==='數學'){assert.ok(p.coverage.every(c=>c.count===5&&c.points===20));assert.ok(d.questions.some(q=>q.type==='numeric'));assert.equal(new Set(d.questions.map(q=>q.family||q.id)).size,p.count);}
 else assert.ok(p.readingCount===20);
 if(['自然','社會'].includes(p.subject)){const tf=d.questions.filter(q=>q.type==='boolean');assert.equal(tf.length,10);assert.equal(tf.filter(q=>q.answer===0).length,5);assert.ok(tf.every(q=>q.points===2));}
 const text=d.questions.find(q=>q.type==='text');if(text){assert.ok(E.correct(text,'  '+String(text.answer).toUpperCase()+'  '));assert.ok(!E.correct(text,''));}
 console.log(p.title+'：'+p.count+'題／100分；範圍、分大題、不同配分、完整送出、0分100分及名字隔離通過。');
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
