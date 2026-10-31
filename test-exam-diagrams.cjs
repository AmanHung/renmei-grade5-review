const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},document:{addEventListener(){}}};
vm.createContext(ctx);
for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','exam-b-diagrams','learning-visuals'])vm.runInContext(fs.readFileSync(`dist/${f}.js`,'utf8'),ctx);
const W=ctx.window,D=W.ExamDiagrams,bank=W.REVIEW_UNITS.flatMap(u=>u.questions).concat(W.REVIEW_EXAM_ITEMS);
const byId=id=>bank.find(q=>q.id===id);
const degrees=(p,a,b)=>{const u=a.map((n,i)=>n-p[i]),v=b.map((n,i)=>n-p[i]);return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v))))*180/Math.PI;};
const near=(n,want)=>assert.ok(Math.abs(n-want)<1e-8,`${n} != ${want}`);
const compound=byId('u10-t96-n1'),parallel=byId('u10-t97-n1');
const {A,B,C,D:d,E,P}=D.compound(compound.visual).points;
near(degrees(A,B,C),50);near(degrees(E,d,C),30);near(degrees(C,A,E),70);near(degrees(P,d,C),compound.answer);
const p=D.parallelogram(parallel.visual).points;
near(degrees(p.B,p.A,p.C),112);near(degrees(p.B,p.A,p.D),35);near(degrees(p.D,p.A,p.B),parallel.answer);
for(const q of [compound,parallel]){const r=D.draw(q.visual);assert.ok(r.body.includes('x°'));assert.ok(!r.body.includes(q.answer+'°'));assert.ok(!/NaN|Infinity/.test(r.body));}
for(const paper of W.REVIEW_EXAMS)assert.equal(paper.entries.reduce((s,e)=>s+e.points,0),100);
const paper=W.REVIEW_EXAMS.find(p=>p.id==='g5-math-a');
for(const id of ['u10-t95-a','u10-t96-n1','u10-t97-n1'])assert.ok(paper.entries.some(e=>e.questionId===id));
let count=0;
for(const q of bank){const v=W.LearningVisuals.dataFor(q);if(!v)continue;const r=D.draw(v);if(!r)continue;
 assert.ok(!/NaN|Infinity|undefined/.test(r.body),q.id);
 // 重複 SVG 屬性會讓瀏覽器使用錯誤的填色或線寬。
 for(const tag of r.body.match(/<[a-z]+\b[^>]*>/g)||[]){const names=[...tag.matchAll(/\s([\w:-]+)="[^"]*"/g)].map(m=>m[1]);assert.equal(new Set(names).size,names.length,q.id+': '+tag);}
 if(v.hideTable)assert.ok(!W.LearningVisuals.markup(q).includes('<table'),q.id);
 count++;
}
assert.ok(count>50);
console.log(`考卷線圖通過：${count} 題附圖；實際座標角度 50／30／70／100、112／35／77；未知數不洩漏答案、SVG 屬性及 100 分配分。`);
