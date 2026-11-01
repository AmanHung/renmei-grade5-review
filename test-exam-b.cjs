const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{},document:{addEventListener(){}}};vm.createContext(c);
for(const f of ['content','mock-content','exam-diagrams','exam-b-diagrams','reasoning-visuals','learning-visuals'])vm.runInContext(fs.readFileSync('dist/'+f+'.js','utf8'),c);
const W=c.window,bank=W.REVIEW_UNITS.flatMap(u=>u.questions).concat(W.REVIEW_EXAM_ITEMS),byId=new Map(bank.map(q=>[q.id,q]));
assert.equal(byId.size,bank.length);assert.equal(W.REVIEW_EXAMS.length,20);
// 新增 B 卷不得使原有 A 卷的草稿簽章失效。
const oldA={'g3-chinese-a':'90a939c549602ee19104','g5-chinese-a':'3f6f55edefc47950fb56','g3-english-a':'85f81bdc49179840bade','g5-english-a':'89c4b52f7501e1ed30a0','g5-science-a':'c269e58813582bfe2ec6','g5-social-a':'ac094c67f7bf5f361389','g3-science-a':'ad1b2594c59ed15a916b','g3-social-a':'a5574769ebf05d6d4223','g3-math-a':'a57755937797270622fc','g5-math-a':'030ead70a1cdf79f00a0'};
for(const p of W.REVIEW_EXAMS.filter(p=>p.variant==='A'&&p.subject!=='數學'))assert.equal(p.signature,oldA[p.id],p.id+' 不應隨新增B卷改變');
let count=0,reading=0,figures=0;
for(const b of W.REVIEW_EXAMS.filter(p=>p.variant==='B')){
 const a=W.REVIEW_EXAMS.find(p=>p.id===b.id.replace(/-b$/,'-a')),aq=a.entries.map(e=>byId.get(e.questionId)),aIds=new Set(aq.map(q=>q.id)),aTexts=new Set(aq.map(q=>q.text));
 for(const e of b.entries){const q=byId.get(e.questionId);assert.ok(!aIds.has(q.id));assert.ok(!aTexts.has(q.text));assert.equal(q.variant,'B');assert.match(q.id,/^u\d{1,2}-t\d{2}-(?:b|tf|n[12]|r[1-5])$/);assert.ok(q.explanation);count++;
  if(q.visual){const v=q.visual,r=W.BExamDiagrams.draw(v)||W.ExamDiagrams.draw(v);if(v.kind.startsWith('b'))assert.ok(r,'B卷必須實際支援新圖形 '+v.kind);if(r){assert.ok(!/NaN|Infinity|undefined/.test(r.body));for(const tag of r.body.match(/<[a-z]+\b[^>]*>/g)||[]){const names=[...tag.matchAll(/\s([\w:-]+)="[^"]*"/g)].map(m=>m[1]);assert.equal(new Set(names).size,names.length);}figures++;}}
 }
 const groups=new Set(b.entries.map(e=>byId.get(e.questionId).passageId).filter(Boolean));if(b.subject!=='數學'){assert.equal(groups.size,4);for(const id of groups){const qs=b.entries.map(e=>byId.get(e.questionId)).filter(q=>q.passageId===id);assert.equal(qs.length,5);assert.equal(new Set(qs.map(q=>q.passage)).size,1);reading++;}}
}
assert.equal(count,330);assert.equal(reading,32);
function angle(p,a,b){const u=a.map((n,i)=>n-p[i]),v=b.map((n,i)=>n-p[i]);return Math.acos((u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v))*180/Math.PI;}
const near=(x,n)=>assert.ok(Math.abs(x-n)<1e-7,`${x} != ${n}`),Q=W.BExamDiagrams.quad().points;
near(angle(Q.A,Q.B,Q.C),35);near(angle(Q.A,Q.C,Q.D),45);near(angle(Q.B,Q.A,Q.C),70);near(angle(Q.C,Q.B,Q.D),110);near(angle(Q.D,Q.A,Q.C),100);
const O=W.BExamDiagrams.opposite().points;near(angle(O.A,O.B,O.D),90);near(angle(O.C,O.B,O.D),90);near(angle(O.B,O.A,O.C),70);near(angle(O.D,O.A,O.C),110);
const I=W.BExamDiagrams.iso().points;near(angle(I.A,I.B,I.C),50);near(angle(I.B,I.A,I.C),65);
const math=W.REVIEW_EXAMS.find(p=>p.id==='g5-math-b').entries.map(e=>byId.get(e.questionId));
const factors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
assert.equal(math.find(q=>q.text.startsWith('48 枝筆')).answer,factors(48).filter(n=>n>=5&&n<=12).length);
assert.equal(math.find(q=>q.text.startsWith('1～60')).answer,Array.from({length:60},(_,i)=>i+1).filter(n=>n%6===0&&n%9!==0).length);
assert.equal(math.find(q=>q.text.startsWith('甲燈每')).answer,[0,36,72,108].length);
// 以真實目錄函式測試版本切換，避免卡片、重新作答與同步名稱仍硬編碼為 A。
const buttons=new Map(),main={innerHTML:'',querySelectorAll(selector){const attr=selector==='[data-exam-form]'?'data-exam-form':'data-exam-open';const result=[...this.innerHTML.matchAll(new RegExp(attr+'="([^"]+)"','g'))].map(m=>({dataset:{[attr==='data-exam-form'?'examForm':'examOpen']:m[1]}}));buttons.set(selector,result);return result;}};
const location={search:'?grade=3&view=exams&form=b',href:'https://example.test/?grade=3&view=exams&form=b'};
const ui={window:W,main,activeGrade:3,location,URLSearchParams,URL,history:{replaceState(_a,_b,url){location.href=String(url);location.search=url.search;}},Learner:{key:()=> 'kid',getName:()=> '測試'},localStorage:{getItem:()=>null},renderGradePicker(){},gradeLabel:g=>g+'上',esc:s=>String(s),document:{},console};
vm.createContext(ui);vm.runInContext(fs.readFileSync('dist/mock-exams.js','utf8'),ui);ui.window.MockExam.catalog();
assert.equal(buttons.get('[data-exam-open]').length,5);assert.ok(buttons.get('[data-exam-open]').every(b=>b.dataset.examOpen.endsWith('-b')));assert.match(main.innerHTML,/數學模擬考 B 卷/);
buttons.get('[data-exam-form]').find(b=>b.dataset.examForm==='A').onclick();assert.ok(buttons.get('[data-exam-open]').every(b=>b.dataset.examOpen.endsWith('-a')));assert.ok(location.search.includes('form=a'));
console.log(`B卷通過：10份、${count}題、${reading}篇完整閱讀；A/B題號與題幹分離、目錄切換、數學數據及${figures}題附圖；實際角度與標註一致。`);
