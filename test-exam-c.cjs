const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const C=require('./dist/mock-c-engine.js'),M=require('./dist/mock-engine.js');
const ctx={window:{}};vm.createContext(ctx);for(const file of ['content','mock-content','mock-c-content'])vm.runInContext(fs.readFileSync('dist/'+file+'.js','utf8'),ctx);
const units=ctx.window.REVIEW_UNITS,templates=ctx.window.REVIEW_C_EXAMS,bank=units.flatMap(u=>u.questions).concat(ctx.window.REVIEW_EXAM_ITEMS,ctx.window.REVIEW_C_ITEMS),byId=new Map(bank.map(q=>[q.id,q]));
assert.equal(templates.length,10);assert.equal(templates.reduce((n,p)=>n+p.count,0),330);
const identity=q=>q.unit+'|'+(q.passage||'')+'|'+q.text.replace(/^〈[^〉]+〉/,'');
for(const template of templates){
 const owner=template.grade===3?'言旭':'悠晴';
 const first=C.select(template,bank,units,[],owner);
 // Answer every available item correctly, then mark the least preferred standalone
 // item wrong via its A/B alias. It must outrank all other eligible items.
 const standalone=first.entries.filter(e=>!byId.get(e.questionId).passageId),target=byId.get(standalone.at(-1).questionId);
 const records=bank.map((q,i)=>({id:'e'+i,learner:owner,kind:'answer',questionId:q.id,questionType:q.type,correct:true,createdAt:'2026-11-01'}));
 const alias=bank.find(q=>q.examOrigin===target.id)||target;
 records.push({learner:owner,kind:'answer',questionId:alias.id,questionType:alias.type,correct:false,createdAt:'2026-11-04'});
 const p=C.select(template,bank,units,records,owner),qs=p.entries.map(e=>byId.get(e.questionId));
 assert.ok(qs.some(q=>identity(q)===identity(target)),'錯題及其別名優先');
 assert.equal(p.entries.length,template.count);assert.equal(p.entries.reduce((n,e)=>n+e.points,0),100);
 assert.equal(new Set(qs.map(identity)).size,p.count,'不得抽到同文不同題號複本');
 assert.ok(qs.every(q=>units[q.unit].grade===p.grade&&units[q.unit].subject===p.subject&&units[q.unit].active!==false));
 for(const s of p.sections)assert.equal(s.entries.length,s.count);
 for(const pid of new Set(qs.map(q=>q.passageId).filter(Boolean))){const g=qs.filter(q=>q.passageId===pid);assert.equal(g.length,5);assert.equal(new Set(g.map(q=>q.readingOrder)).size,5);}
 if(p.subject==='數學'&&p.grade===5)assert.ok(p.coverage.every(c=>c.count===5&&c.points===20));
 assert.deepEqual(C.select(template,bank,units,records.map(e=>({...e,learner:'別人'})),owner).entries,first.entries,'孩子紀錄隔離');
 const d=M.create(p,bank,owner,()=> 'c-session');d.questions.forEach(q=>d.answers[q.id]=q.answer);
 assert.equal(M.grade(d).score,100);assert.ok(M.compatible(d,template,owner));assert.ok(!M.compatible(d,template,'別人'));
 const compact=JSON.parse(JSON.stringify({...d,questions:d.questions.map(q=>({id:q.id,options:q.options,answer:q.answer,section:q.section,points:q.points}))}));
 assert.ok(JSON.stringify(compact).length<35000,'雲端草稿大小符合現有後端');
 const restored=C.restore(template,compact);assert.deepEqual(restored.entries,p.entries);assert.deepEqual(restored.coverage,p.coverage);
 assert.equal(restored.signature,p.signature);assert.ok(M.compatible(compact,template,owner));
 const changed=JSON.parse(JSON.stringify(compact));changed.questions[0].points+=1;assert.ok(!M.compatible(changed,template,owner));
 assert.equal(Object.values(p.selection).reduce((n,x)=>n+x,0),p.count);
 console.log(p.title+'：題數、100 分、錯題優先、別名去重、完整閱讀、姓名隔離及雲端接續通過。');
}
// 開卷使用已保存的草稿；同步緩慢或離線時也能立即作答。
(async()=>{
 const t=templates[0],p=C.select(t,bank,units,[],'言旭'),d=M.create(p,bank,'言旭',()=> 'existing-cloud-session');
 d.answers[d.questions[0].id]=0;const storage=new Map([['test:mock:'+t.id,JSON.stringify(d)]]);let onCloud,saves=0;
 const env={window:{MockEngine:M,REVIEW_UNITS:units,REVIEW_EXAM_ITEMS:ctx.window.REVIEW_EXAM_ITEMS.concat(ctx.window.REVIEW_C_ITEMS),REVIEW_EXAMS:templates},MockC:C,LearningVisuals:{dataFor:()=>null},activeGrade:3,units,URLSearchParams,location:{search:'?form=c'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},Learner:{getName:()=> '言旭',key:()=> 'test',onCloud(fn){onCloud=fn;},status:()=>({loaded:false,cloud:'loading'}),syncCloud(){throw Error('開卷不得等待雲端同步');},records:()=>[],uuid:()=> 'new-offline-session',state(){saves++;}},focusMain(){},alert:m=>{throw Error(m);}};
 vm.createContext(env);let source=fs.readFileSync('dist/mock-exams.js','utf8').replace(/ function render\(\)\{[\s\S]*?\n \}\n function update/,' function render(){}\n function update').replace('window.MockExam={','window.MockExam={testOpen:open,testDraft:()=>draft,');
 vm.runInContext(source,env);env.window.MockExam.testOpen(t.id);assert.equal(env.window.MockExam.testDraft().sessionId,d.sessionId);assert.equal(env.window.MockExam.testDraft().answers[d.questions[0].id],0);assert.equal(saves,0);
 storage.delete('test:mock:'+t.id);env.window.MockExam.testOpen(t.id);const current=env.window.MockExam.testDraft();assert.equal(current.sessionId,'new-offline-session');assert.ok(saves>0,'空白裝置立即開卷並保存草稿');
 const before=storage.get('test:mock:'+t.id);onCloud('言旭',[{kind:'state',stateKey:'draft:'+t.id,createdAt:'2099-01-01',stateValue:{...d,_cloudUpdatedAt:'2099-01-01'}}]);assert.equal(storage.get('test:mock:'+t.id),before,'背景同步不得覆蓋正在作答的考卷');
 console.log('C 卷免等待通過：接續本機草稿、空白裝置離線開卷、背景同步保護正在作答的草稿。');
})().catch(e=>{console.error(e);process.exitCode=1;});
