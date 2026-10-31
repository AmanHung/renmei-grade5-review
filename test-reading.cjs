const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),E=require('./dist/engine.js');const context={window:{}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),context);const units=JSON.parse(JSON.stringify(context.window.REVIEW_UNITS));
for(const u of units.filter(u=>u.readingSetSize)){
 const groups=E.readingGroups(u.questions);assert.equal(groups.length,20);
 for(const g of groups){assert.equal(g.length,5);assert.equal(new Set(g.map(q=>q.passage)).size,1);assert.deepEqual(g.map(q=>q.readingOrder),[1,2,3,4,5]);assert.equal(new Set(g.map(q=>q.readingSkill)).size,5);assert.ok(g[0].passage.split(/\n\n/).length>=3);assert.ok(u.subject==='國語'?g[0].passage.length>=250:g[0].passage.split(/\s+/).length>=100);}
 for(const n of [10,20,40]){let history={seen:[],last:[]};for(let i=0;i<30;i++){const picked=E.sample(u.questions,n,history),ordered=E.quizOrder(picked),sets=E.readingGroups(ordered);assert.equal(sets.length,n/5);assert.ok(sets.every(s=>s.length===5));sets.forEach(g=>{const index=ordered.findIndex(q=>q.passageId===g[0].passageId);assert.deepEqual(ordered.slice(index,index+5).map(q=>q.id),g.map(q=>q.id));});assert.ok(picked.every(q=>!history.last.includes(q.id)));history={seen:[...new Set([...history.seen,...picked.map(q=>q.id)])],last:picked.map(q=>q.id)};}}
 const retry=E.quizOrder([u.questions[1]],u.questions,true);assert.equal(retry.length,5,'單一錯題也須帶回完整題組');
}
const bank=units.flatMap(u=>u.questions),mixed=[units[4].questions[0],units[7].questions[12],units[8].questions[0],units[0].questions[4]];const retry=E.quizOrder(mixed,bank,true);assert.equal(retry.length,12);assert.equal(E.readingGroups(retry.filter(q=>q.passageId)).length,2);assert.ok(E.quizOrder(units[4].questions.filter((q,i)=>i%5===0),bank,true).length<=20);
assert.throws(()=>E.sample(units[4].questions,11));
console.log('閱讀題組檢查通過：80 篇、每篇 5 題、多段文章、完整抽組與排序、相鄰不重複、錯題帶回題組及 20 題上限。');
