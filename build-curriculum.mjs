import fs from 'node:fs';
import animals from './curriculum/animals.mjs';
import sound from './curriculum/sound-light.mjs';
import home from './curriculum/home.mjs';
import environment from './curriculum/environment.mjs';
import multiple from './curriculum/multiple.mjs';
import literacy from './curriculum/literacy.mjs';
import math from './curriculum/math.mjs';
import grade3Reading from './curriculum/grade3-reading.mjs';
import grade3Math from './curriculum/grade3-math.mjs';
import grade3Concepts from './curriculum/grade3-concepts.mjs';
import addVisualLiteracy from './curriculum/visual-literacy.mjs';
import attachLearningVisuals from './curriculum/learning-visuals.mjs';
import reviewQuality from './curriculum/quality-review.mjs';
import upgradeDiagramContent from './curriculum/exam-diagram-content.mjs';
import reports from './curriculum/quality-reports.mjs';
const names=['動物世界','探索聲光世界','臺灣我的家','臺灣的自然環境與生活'];
const tips=[['動物聚在一起，不一定有分工合作。','卵生、胎生與是否育幼，應分開判斷。','觀察與推論要區分，也要尊重動物棲地。'],['音量與音高不同，反射與折射也不同。','實驗一次聚焦一個變因，其餘條件盡量相同。','不直視太陽、不用強光照眼，也不以高音量刺激聽覺。'],['方位要有參考點，讀圖先看方向標示。','不同族群與家庭之間，也會有個別差異。','團體規則、道德與法律，不宜直接畫上等號。'],['地形分類要看地勢，不能只看名字或顏色。','天氣與氣候不同；結論要符合資料時間範圍。','地形與氣候會影響生活，也要考慮人文與技術條件。']];
const units=[animals,sound,home,environment].map((topics,u)=>({
 id:u,subject:u<2?'自然':'社會',number:u%2+1,name:names[u],color:['mint','blue','peach','lavender'][u],tips:tips[u],
 cards:topics.map((t,i)=>({id:`u${u}-t${i+1}`,title:t[0],text:t[1],group:Math.floor(i/5)})),
 questions:topics.flatMap((t,i)=>{
   const base={concept:t[0],topic:i,unit:u},prefix=`u${u}-t${String(i+1).padStart(2,'0')}`;
   const [title,description,a,b,tf,pairs]=t;
   const multi=multiple[u][i];
   return [
    {...base,id:prefix+'-a',type:'single',text:a[0],options:a.slice(1),answer:0,explanation:`${a[1]}。${description}`},
    {...base,id:prefix+'-b',type:'single',text:b[0],options:b.slice(1),answer:0,explanation:`${b[1]}。${description}`},
    {...base,id:prefix+'-tf',type:'boolean',text:`判斷這句話是否正確：${tf[0]}`,options:['正確','錯誤'],answer:tf[1]?0:1,explanation:tf[2]},
    {...base,id:prefix+'-multi',type:'multiple',text:`關於「${title}」，請選出兩個正確的說法。`,options:multi,answer:[0,1],explanation:`正確說法：${multi.slice(0,2).join('；')}。${description}`},
    {...base,id:prefix+'-match',type:'matching',text:`「${title}」配對練習：將三個項目配上最合適的說明。`,pairs,explanation:pairs.map(([l,r])=>`${l} → ${r}`).join('；')+'。'}
   ];
 })
}));
units.push(...literacy,...math);
units.forEach(u=>{u.grade=5;u.publisher=u.subject==='數學'?'翰林':u.subject==='英語'?'康軒 Wonder World 5':'康軒';});
units.push(...grade3Reading,...grade3Math,...grade3Concepts);
addVisualLiteracy(units);
attachLearningVisuals(units);
reviewQuality(units);
upgradeDiagramContent(units);
// 數字型閱讀選項遇到相同數值時，改用其他合理數量，避免重複選項。
for(const u of units)for(const q of u.questions){if(q.options){const used=new Set();q.options=q.options.map((o,i)=>{if(used.has(o)&&u.subject==='英語'&&/^\d+$/.test(o)){let n=Number(o)+1;while(used.has(String(n))||q.options.includes(String(n)))n++;o=String(n);}used.add(o);return o;});}}
for(const u of units){
 if(u.cards.length!==20||u.questions.length<5)throw Error(`${u.name}數量不符`);
 if(new Set(u.questions.map(q=>q.text)).size!==u.questions.length)throw Error('題幹重複');
 for(const q of u.questions){
  if(q.options&&new Set(q.options).size!==q.options.length)throw Error(`${q.id}選項重複`);
  if(q.pairs&&(q.pairs.length!==3||new Set(q.pairs.map(p=>p[1])).size!==3))throw Error(`${q.id}配對重複`);
 }
}
fs.writeFileSync(new URL('dist/content.js',import.meta.url),'window.REVIEW_UNITS='+JSON.stringify(units,null,2)+';\n');
console.table(units.map(u=>({科目:u.subject,單元:u.name,重點:u.cards.length,題目:u.questions.length})));
fs.writeFileSync(new URL('題庫清單.md',import.meta.url),'# 三上與五上考前複習題庫\n\n共 '+units.length+' 組、'+units.reduce((n,u)=>n+u.cards.length,0)+' 個重點、'+units.reduce((n,u)=>n+u.questions.length,0)+' 題。每組 20 個重點；國英數每組 100 題，自然社會每組 200 題（100 題觀念＋20 篇圖文閱讀共 100 題）。\n\n國語、英語以原創閱讀題組為主，數學計算題使用數字填答，角的概念題含配圖單選。各科加入情境配圖、圖卡或精確幾何圖。自然、社會保留原有四種題型，另有一篇 5 題的圖文閱讀模式。教材核對與限制見 [版本核對.md](版本核對.md)。\n\n'+units.map(u=>'## '+(u.grade===3?'三上':'五上')+' '+u.publisher+' '+u.subject+'：'+u.name+'\n\n'+(u.scope||'第 '+u.number+' 單元')+'\n\n'+u.cards.map((c,i)=>(i+1)+'．'+c.title+'：'+c.text).join('\n\n')+'\n\n題號：'+u.questions[0].id+' ～ '+u.questions.at(-1).id+'。完整題目、短文與答案由 curriculum 原始資料產生於 dist/content.js。\n').join('\n'));
reports(units);
const {default:writeMockExams}=await import('./curriculum/mock-exams.mjs');
writeMockExams(units);
