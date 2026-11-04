import fs from 'node:fs';
import {createHash} from 'node:crypto';
const statements={
0:[['蝙蝠會飛，因此牠和麻雀一樣都是卵生。',false,'蝙蝠是胎生的哺乳類；會不會飛不是判斷繁殖方式的依據。'],['看到魚群一起游動，就能確定每條魚都有不同的固定工作。',false,'聚集不等於有社會性分工，仍須觀察是否分擔不同工作。'],['鯨生活在水裡，仍須到水面用肺呼吸。',true,'鯨是哺乳類，使用肺呼吸。']],
1:[['同一條橡皮筋保持長度及鬆緊相同，較用力撥主要使音量變大。',true,'其他條件相同時，較用力撥使振動幅度較大，通常音量較大。'],['手電筒的光照到平面鏡後改變方向，是光的折射。',false,'光在鏡面反射而改變方向，稱為反射。'],['比較兩種材料的隔音效果時，音源音量和測量位置應保持相同。',true,'只改變材料，其他條件相同，才能合理比較隔音效果。']],
2:[['站在臺灣面向東方，右手邊是南方。',true,'面向東方時，右側是南，左側是北。'],['位置圖沒有方向標示時，只看紙張上方就能確定真正的北方。',false,'應先確認圖上的方向標示或其他方向依據。'],['了解不同族群的節慶時，可以先詢問活動的意義，再尊重地參與。',true,'先了解並尊重差異，有助於相互理解。']],
3:[['只記錄某地今天下雨，就能判定這個地方一年四季都多雨。',false,'單日資料只能說明當天的天氣，氣候須參考長期資料。'],['山坡地保留植被，有助於減少雨水直接沖刷土壤。',true,'植物根系及地表覆蓋有助於水土保持。'],['規劃山區道路時，只需考慮路線長短，不必考慮坡度與地質。',false,'山區道路也須評估坡度、地質與安全。']],
22:[['觀察葉片時，可以記錄葉緣形狀和葉脈，不只記錄顏色。',true,'葉緣、葉脈及外形都是可以觀察比較的特徵。'],['植物的莖只負責支撐，完全沒有輸送水分的作用。',false,'莖能支撐植物，也能輸送水分等物質。'],['同一種植物每一片葉子的大小都必須完全相同。',false,'同種植物的葉片也可能因生長狀況而有大小差異。']],
23:[['空氣看不見，因此倒扣水中的空杯裡一定沒有任何東西。',false,'看似空的杯子仍有空氣；空氣會占據空間。'],['把水倒進不同形狀的容器，水的形狀會隨容器改變。',true,'水沒有固定形狀，會隨容器改變形狀。'],['操作針筒比較空氣是否容易被壓縮時，須先確認出口是否密閉。',true,'若出口漏氣，空氣會逸出，不能據此判斷壓縮情形。']],
24:[['小組合作時，每個人都只選最輕鬆的工作，就一定能公平完成任務。',false,'應討論工作需求與能力，合理分工，而非人人只挑輕鬆工作。'],['不懂老師的說明時，可以先舉手，輪到自己再提出問題。',true,'適當提問有助學習，也兼顧課堂秩序。'],['同學的學習速度不同，表示學得較慢的人所有事情都做不好。',false,'每個人有不同優勢，不能由一項學習表現推論全部能力。']],
25:[['班會表決前，應讓同學了解各方案並有機會表達意見。',true,'先了解方案並討論，再表決，才有助於作出適當決定。'],['班規經多數人同意後，就可以規定少數同學不能使用公共設備。',false,'多數決仍應尊重每位同學的基本權益。'],['值日生工作未完成時，可以先了解原因，再討論如何補做及改善分工。',true,'了解原因並提出補救方式，有助於負責任地解決問題。']]
};
export default function writeC(units,papers,extras){
 const used=new Set(units.flatMap(u=>u.questions).concat(extras).map(q=>q.id));
 const additions=[];
 for(const [id,rows] of Object.entries(statements))for(const [text,truth,explanation] of rows){
  const unit=Number(id);let n=99;while(used.has(`u${unit}-t${n}-tf`))n--;if(n<10)throw Error('C 卷題號不足');
  const q={id:`u${unit}-t${n}-tf`,unit,topic:n-1,type:'boolean',text,options:['○ 正確','× 錯誤'],answer:truth?0:1,explanation,concept:units[unit].name,sourceIds:units[unit].questions[0].sourceIds,sourceType:'依已核對期中範圍編寫的 C 卷補強題',visualPolicy:'none',variant:'C'};
  used.add(q.id);additions.push(q);
 }
 const templates=papers.filter(p=>p.variant==='A').map(p=>({...structuredClone(p),id:p.id.replace(/-a$/,'-c'),variant:'C',adaptive:true,title:p.title.replace(' A 卷',' C 卷'),level:'依最新進度選題：曾答錯、未作答與錯題類型優先',signature:createHash('sha256').update(JSON.stringify({p,units:units.filter(u=>u.grade===p.grade&&u.subject===p.subject).map(u=>u.questions),additions})).digest('hex').slice(0,20)}));
 fs.writeFileSync('dist/mock-c-content.js','window.REVIEW_C_EXAMS='+JSON.stringify(templates,null,2)+';\nwindow.REVIEW_C_ITEMS='+JSON.stringify(additions,null,2)+';\n');
}
