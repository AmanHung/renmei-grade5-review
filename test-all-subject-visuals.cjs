const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const c={window:{},document:{addEventListener(){}}};
for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','exam-b-diagrams','learning-visuals'])vm.runInNewContext(fs.readFileSync('dist/'+f+'.js','utf8'),c);
const W=c.window,all=W.REVIEW_UNITS.filter(u=>u.active!==false).flatMap(u=>u.questions).concat(W.REVIEW_EXAM_ITEMS);
let diagrams=0,tables=0,plain=0;const kinds=new Set();
for(const q of all){
 const v=W.LearningVisuals.dataFor(q),h=W.LearningVisuals.markup(q);
 assert.ok(!/NaN|Infinity|undefined/.test(h),q.id);
 if(!v){assert.equal(h,'');plain++;continue;}
 assert.notEqual(v.kind,'subjectScene','不可再套用通用場景 '+q.id);kinds.add(v.kind);
 if(v.kind==='referenceData'){assert.ok(h.includes('<table'));assert.ok(!h.includes('<svg'));tables++;}
 else {assert.ok(h.includes('<svg'),q.id);assert.ok(h.includes('data-zoom-visual'));diagrams++;}
 if(v.table){for(const row of v.table.rows){assert.equal(row.length,v.table.headers.length,q.id);if(v.hideTable)continue;for(const value of row){const esc=String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));assert.ok(h.includes(esc),q.id+' 資料不得遺失');}}}
}
for(const k of ['referenceRoots','referenceOptics','referenceMap','referenceFruit','referenceNumber'])assert.ok(kinds.has(k),k);
assert.ok(plain>0&&tables>0&&diagrams>0);
console.log(`圖文審查通過：${diagrams} 題必要圖、${tables} 題資料表、${plain} 題獨立文字；無通用場景錯配，資料保留且圖可放大。`);
