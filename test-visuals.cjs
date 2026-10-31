const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},document:{addEventListener(){}}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),ctx);vm.runInNewContext(fs.readFileSync('dist/learning-visuals.js','utf8'),ctx);
const units=ctx.window.REVIEW_UNITS,V=ctx.window.LearningVisuals;
let rendered=0,legacy=0;
for(const u of units)for(const q of u.questions){
 if(q.figure||q.chart){legacy++;continue;}
 assert.ok(V.dataFor(q),q.id+' 缺配圖');const html=V.markup(q);assert.ok(html.includes('<svg'),q.id+' 未繪圖');assert.ok(!/NaN|undefined|Infinity/.test(html),q.id+' 無效繪圖');assert.ok(html.includes('data-zoom-visual'),q.id+' 無放大入口');
 if(q.passageId&&u.literacyAvailable){assert.ok(html.includes('<table>'));assert.equal(V.dataFor(q).table.rows.length>=2,true);}
 rendered++;
}
// 以 SVG 頂點獨立計算圖上內角，驗證實際線段與標示相符。
function corners(q){const h=V.markup(q),p=h.match(/<polygon points="([^"]+)"/)[1].split(' ').map(x=>x.split(',').map(Number));return p.map((a,i)=>{const b=p[(i+p.length-1)%p.length].map((x,j)=>x-a[j]),c=p[(i+1)%p.length].map((x,j)=>x-a[j]);return Math.acos((b[0]*c[0]+b[1]*c[1])/(Math.hypot(...b)*Math.hypot(...c)))*180/Math.PI;});}
for(const q of units[10].questions){const v=V.dataFor(q);if(v.kind==='triangleAngles'||v.kind==='quadrilateral'){const actual=corners(q);v.angles.forEach((a,i)=>{if(a!==null)assert.ok(Math.abs(actual[i]-a)<1e-8,q.id+' 圖上角度不合');});assert.ok(Math.abs(actual.at(-1)-q.answer)<1e-8);assert.ok(V.markup(q).includes('>?</text>'));}else if(v.kind==='isosceles'){const a=corners(q);assert.ok(Math.abs(a[0]-a[1])<1e-8);assert.ok(Math.abs(a[2]-v.vertex)<1e-8);assert.ok(Math.abs(a[0]-q.answer)<1e-8);}else if(v.kind==='parallelogram'){const a=corners(q);assert.ok(Math.abs(a[0]-v.known)<1e-8);assert.ok(Math.abs(a[1]-q.answer)<1e-8);}}
assert.equal(V.dataFor(units[9].questions[1]).kind,'packing');assert.ok(V.markup(units[9].questions[1]).includes('盒數：？'));
for(const u of units.filter(u=>u.literacyAvailable)){assert.equal(require('./dist/engine.js').practiceBank(u,'reading').length,100);assert.equal(require('./dist/engine.js').practiceBank(u,'concept').length,100);}
assert.equal(rendered+legacy,3400);console.log(`配圖檢查通過：${rendered} 題新圖卡＋${legacy} 題既有讀圖；100 題幾何實際角度及未知量；各模式獨立完整題庫。`);
