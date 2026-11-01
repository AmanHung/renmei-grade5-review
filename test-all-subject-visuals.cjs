const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const c={window:{},document:{addEventListener(){}}};
for(const f of ['content','mock-content','reasoning-visuals','exam-diagrams','exam-b-diagrams','learning-visuals'])vm.runInNewContext(fs.readFileSync('dist/'+f+'.js','utf8'),c);
const W=c.window,all=W.REVIEW_UNITS.filter(u=>u.active!==false).flatMap(u=>u.questions).concat(W.REVIEW_EXAM_ITEMS),changed=all.filter(q=>q.visualAudit),counts={},modes=new Map();
for(const q of all){const v=W.LearningVisuals.dataFor(q);if(!v)continue;const h=W.LearningVisuals.markup(q);assert.ok(!/NaN|Infinity|undefined/.test(h),q.id);if(v.kind==='subjectScene'){
 assert.ok(h.includes('<svg'));assert.ok(/<(path|circle|ellipse|polygon)/.test(h)||['schedule','agenda','leafParts','storageLabels','airColumn','blockTower'].includes(v.mode),q.id+' 不能只有文字框');
 assert.ok(h.includes('data-zoom-visual'));
 if(v.table)for(const row of v.table.rows)for(const value of row)assert.ok(h.includes(String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),q.id+' 附表資料需保留');
 counts[W.REVIEW_UNITS[q.unit].subject]=(counts[W.REVIEW_UNITS[q.unit].subject]||0)+1;modes.set(v.mode,q);
 }
}
for(const subject of ['國語','英語','自然','社會'])assert.ok(counts[subject]>0,subject+' 應有本次配圖強化');
for(const mode of ['roots','leafVeins','paperBridge','mosquitoNet','terrain','compass','vote','pictureInventory'])assert.ok(modes.has(mode));
assert.ok(!all.some(q=>q.visual?.kind==='examEvidenceTable'),'原本僅有附表的題組應加上物體或情境圖');
for(const q of changed.filter(q=>q.visual.mode==='river'&&q.visual.table)){const svg=W.LearningVisuals.markup(q).match(/<svg[\s\S]*?<\/svg>/)[0];assert.ok(svg.includes(q.visual.table.rows[0][0]+' 上游'));assert.ok(svg.includes(q.visual.table.rows[2][0]+' 下游'));}
for(const q of changed.filter(q=>q.visual.mode==='rubberLab')){const svg=W.LearningVisuals.markup(q).match(/<svg[\s\S]*?<\/svg>/)[0];assert.ok(!/20 cm|10 cm/.test(svg),'不可加入原題沒有的長度數值');}
console.log('各科配圖通過：'+JSON.stringify(counts)+'；'+modes.size+' 種場景／構造，均有 SVG、放大及原資料保留。');
if(process.argv.includes('--gallery')){const selected=['roots','leafVeins','flower','paperBridge','mosquitoNet','roofGarden','terrain','compass','vote','pictureInventory','cupAir','stringPhone','leafOrder','seaPaintings','blockTower','globe'].map(m=>modes.get(m));
 fs.writeFileSync('dist/qa-subjects.html','<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="learning-visuals.css"><style>body{font-family:system-ui;margin:20px;background:#f2f5f0}main{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}article{background:white;padding:12px;border-radius:12px}h2{font-size:20px}.learning-visual svg{height:245px;width:100%}.visual-zoom{display:none}</style><h1>各科配圖檢查</h1><main>'+selected.map(q=>'<article><h2>'+W.REVIEW_UNITS[q.unit].subject+' · '+q.visual.mode+'</h2>'+W.LearningVisuals.markup(q)+'</article>').join('')+'</main></html>');}
