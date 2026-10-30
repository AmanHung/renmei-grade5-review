import fs from 'node:fs';
import animals from './curriculum/animals.mjs';
import sound from './curriculum/sound-light.mjs';
import home from './curriculum/home.mjs';
import environment from './curriculum/environment.mjs';
import multiple from './curriculum/multiple.mjs';
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
for(const u of units){
 if(u.cards.length!==20||u.questions.length!==100)throw Error(`${u.name}數量不符`);
 if(new Set(u.questions.map(q=>q.text)).size!==100)throw Error('題幹重複');
 for(const q of u.questions){
  if(q.options&&new Set(q.options).size!==q.options.length)throw Error(`${q.id}選項重複`);
  if(q.pairs&&(q.pairs.length!==3||new Set(q.pairs.map(p=>p[1])).size!==3))throw Error(`${q.id}配對重複`);
 }
}
fs.writeFileSync(new URL('dist/content.js',import.meta.url),'window.REVIEW_UNITS='+JSON.stringify(units,null,2)+';\n');
console.table(units.map(u=>({單元:u.name,重點:u.cards.length,題目:u.questions.length,單選:40,是非:20,多選:20,配對:20})));
fs.writeFileSync(new URL('題庫清單.md',import.meta.url),'# 五上康軒：擴充題庫\n\n每單元 20 個重點、100 題原創練習；40 題單選、20 題是非、20 題多選、20 題配對。\n\n題型從概念、情境、判斷及關係配對等角度練習相同核心觀念。此為自主複習素材，非出版社官方題庫或學校考試範圍。來源與版本核對限制見上層內容草案。\n\n'+units.map(u=>`## ${u.subject}：${u.name}\n\n`+u.cards.map((c,i)=>`### ${i+1}．${c.title}\n\n${c.text}\n\n`+u.questions.filter(q=>q.topic===i).map(q=>`**${q.id}｜${({single:'單選',boolean:'是非',multiple:'多選',matching:'配對'})[q.type]}**\n\n${q.text}\n\n`+(q.options?q.options.map((o,j)=>`${String.fromCharCode(65+j)}．${o}`).join('\n'):'配對：'+q.pairs.map(p=>p.join(' → ')).join('；'))+`\n\n答案與解析：${q.explanation}\n`).join('\n')).join('\n')).join('\n'));
