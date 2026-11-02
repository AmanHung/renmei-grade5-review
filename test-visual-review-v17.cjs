const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const c={window:{},document:{addEventListener(){}}};
for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','exam-b-diagrams','learning-visuals'])vm.runInNewContext(fs.readFileSync('dist/'+f+'.js','utf8'),c);
const W=c.window,practice=W.REVIEW_UNITS.filter(u=>u.active!==false).flatMap(u=>u.questions),all=practice.concat(W.REVIEW_EXAM_ITEMS),report=JSON.parse(fs.readFileSync('reference-library/visual-review-v17.json','utf8'));
assert.equal(practice.length,1620);assert.equal(report.rows.length,all.length);assert.ok(all.every(q=>q.visualReview?.version===17));
const target=all.filter(q=>q.passageTitle==='注射筒的比較紀錄');assert.ok(target.length>=5);
for(const q of target){assert.equal(q.visual.kind,'auditSyringes');assert.equal(q.visual.mode,'both');const html=W.LearningVisuals.markup(q);for(const label of ['<svg','推之前','推的時候','空氣','水','出口封住','無針注射筒'])assert.ok(html.includes(label),q.id+'/'+label);}
for(const q of all.filter(q=>q.visual?.kind?.startsWith('audit'))){const h=W.LearningVisuals.markup(q);assert.ok(h.includes('<svg'),q.id);assert.ok(!/NaN|undefined|Infinity/.test(h),q.id);assert.ok(!h.includes('<image'),q.id);}
for(const kind of ['auditCupAir','auditLeaves','auditSyringes','auditMirrorRay','auditDrinkOrders','auditFruitInventory','auditNoticeChange','auditLandform'])assert.ok(all.some(q=>q.visual?.kind===kind),kind);
for(const q of all.filter(q=>q.visual?.kind==='overlapStrips'&&q.visualReview.version===17))assert.ok(q.visual.overlap<q.visual.a&&q.visual.overlap<q.visual.b);
assert.throws(()=>W.AuditDiagrams.draw({kind:'auditUnsupported'}));
console.log('PASS v17 visual review: '+all.length+' records; apparatus and subject-specific diagrams verified.');
