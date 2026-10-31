const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{},document:{addEventListener(){}}};vm.createContext(c);
for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','learning-visuals'])vm.runInContext(fs.readFileSync(`dist/${f}.js`,'utf8'),c);
const W=c.window,all=W.REVIEW_UNITS.flatMap(u=>u.questions).concat(W.REVIEW_EXAM_ITEMS),byId=new Map(all.map(q=>[q.id,q]));
assert.equal(byId.size,all.length,'新題號不可與舊題或其他科重複');
let revised=0,groups=0;
for(const p of W.REVIEW_EXAMS){
 const qs=p.entries.map(e=>byId.get(e.questionId));assert.ok(qs.every(Boolean));
 if(!['自然','社會'].includes(p.subject))continue;
 assert.ok(qs.every(q=>q.reviewVersion===10),'四份考卷必須整份換入已複核內容');
 for(const q of qs){assert.match(q.id,/^u\d{1,2}-t\d{2}-(?:a|tf|r[1-5])$/);assert.ok(q.sourceIds?.length);assert.equal(new Set(q.options).size,q.options.length);revised++;}
 const articles=new Map();for(const q of qs.filter(q=>q.passageId)){if(!articles.has(q.passageId))articles.set(q.passageId,[]);articles.get(q.passageId).push(q);}
 assert.equal(articles.size,4);
 for(const g of articles.values()){
  assert.equal(g.length,5);assert.equal(new Set(g.map(q=>q.passage)).size,1);assert.equal(new Set(g.map(q=>q.text)).size,5);
  const markup=W.LearningVisuals.markup(g[0]);assert.ok(markup.includes('<svg')||markup.includes('<table'));
  const v=g[0].visual;if(v.kind==='examEvidenceTable'){assert.ok(markup.includes('<table'));assert.ok(!markup.includes('<svg'),'純資料表不插入空白裝飾圖');}
  if(v.table)for(const row of v.table.rows)assert.equal(row.length,v.table.headers.length,'資料欄位對齊');
  groups++;
 }
}
assert.equal(revised,160);assert.equal(groups,16);
const q=id=>byId.get(id),answer=id=>q(id).options[q(id).answer];
const bird=q('u0-t70-r2').visual.table.rows;assert.equal(parseInt(answer('u0-t70-r2')),bird[0][2]-bird[1][2]);
const rubber=q('u1-t70-r1').visual.table.rows;assert.equal(rubber[0][1],rubber[1][1]);assert.equal(rubber[0][2],rubber[2][2]);assert.notEqual(rubber[0][1],rubber[2][1]);
const rain=q('u3-t71-r1').visual.table.rows;assert.equal(parseInt(answer('u3-t71-r1')),rain[1][1]-rain[2][1]);
const votes=q('u25-t70-r1').visual.table.rows;assert.equal(votes.reduce((n,r)=>n+r[1],0),26);assert.equal(votes[1][1],Math.max(...votes.map(r=>r[1])));
const corridor=q('u25-t71-r1').visual.table.rows;assert.equal(parseInt(answer('u25-t71-r1')),corridor[0][1]-corridor[1][1]);
assert.equal(answer('u23-t70-r1'),'6 格');assert.equal(answer('u24-t70-r2'),'5 分鐘');
console.log('編審資料核對通過：自然社會 160 題、16 篇完整圖文題組；題號不重複、資料表完整、計數單位、比較條件與數值答案相符。');
