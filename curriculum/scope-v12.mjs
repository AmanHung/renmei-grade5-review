// A/B retain 25 questions and their 2/3/6-point sections. Replace the five
// out-of-scope angle entries with distinct existing in-scope tasks.
export default function applyScope(papers,units,extras){
 units[21].active=false;
 units[21].scope='本次不考（保留舊紀錄對應）';
 for(const u of units.filter(u=>u.grade===3&&u.subject==='數學'&&u.id!==21))u.tips=['先整理已知與所求，再在紙上計算。','本次數學範圍為第 1～4 單元。','讀尺時確認單位與起點，乘法先確認每組數量。'];
 const bank=new Map(units.flatMap(u=>u.questions).concat(extras).map(q=>[q.id,q]));
 const replacements={
 A:[
 [17,'single','用 0、2、5、9 各一次排成最大的四位數，哪一個正確？',0,'先把較大的數字放在高位，依序是 9、5、2、0，因此為 9520。',['9520','9502','9250','9025'],{kind:'numberCards',caption:'每張卡片用一次',numbers:[0,2,5,9]}],
 [18,'numeric','倉庫有 4020 張色紙，上午用掉 975 張，下午補進 648 張，現在有幾張？',3693,'先減去上午用量，再加補入：4020－975＋648＝3693 張。',null,{kind:'quantityFlow',caption:'色紙的數量變化',labels:['原有 4020 張','用掉 975 張','補進 648 張','現在？張']}],
 [19,'numeric','兩段紙條分別長 38 毫米與 27 毫米，黏接時重疊 9 毫米。總長是多少毫米？',56,'相加後扣掉重複計算的部分：38＋27－9＝56 毫米。',null,{kind:'overlapStrips',caption:'兩段紙條重疊',a:38,b:27,overlap:9}],
 [20,'numeric','每盒 125 枝筆，買 6 盒，送出 238 枝後，還有幾枝？',512,'先算總量 125×6＝750，再算 750－238＝512 枝。',null,{kind:'quantityFlow',caption:'買入與送出',labels:['每盒 125 枝','共 6 盒','送出 238 枝','剩餘？枝']}],
 [19,'numeric','細棒起點是 9 毫米，終點是 36 毫米。左端移到 4 毫米後，右端在幾毫米？',31,'細棒長度為 36－9＝27 毫米；平移後右端為 4＋27＝31 毫米。',null,{kind:'rulerMove',caption:'細棒平移',start:9,end:36,shift:4,max:40}]
 ],
 B:[
 [17,'single','用 1、0、6、8 各一次排成最小的四位數，下列哪個說明正確？',0,'千位不能為 0，先選最小的非零數字 1，再依序放 0、6、8，得到 1068。',['1068，千位不能是 0','0168，從小到大排列即可','1608，0 必須放十位','1680，0 必須放最後'],{kind:'numberCards',caption:'每張卡用一次',numbers:[1,0,6,8]}],
 [18,'numeric','有 5000 元，買書用 1685 元，文具比書少 476 元。買完兩樣剩幾元？',2106,'文具是 1685－476＝1209 元。剩下 5000－1685－1209＝2106 元。',null,{kind:'quantityFlow',caption:'購物預算',labels:['原有 5000 元','書 1685 元','文具少 476 元','剩餘？元']}],
 [19,'numeric','長 12 公分的紙帶，剪下 3 段各 27 毫米，不計損耗。剩下多少毫米？',39,'12 公分＝120 毫米，剪下 27×3＝81 毫米，剩下 120－81＝39 毫米。',null,{kind:'cutStrip',caption:'紙帶裁切',total:120,cuts:[27,27,27],unit:'毫米'}],
 [20,'numeric','每天讀 24 頁，連讀 8 天。另一本每天讀 18 頁，連讀 7 天。兩本合計讀幾頁？',318,'第一本讀 24×8＝192 頁，第二本讀 18×7＝126 頁，合計 318 頁。',null,{kind:'repeatGroups',caption:'兩本書的閱讀量',rows:[{label:'第一本',per:24,count:8},{label:'第二本',per:18,count:7}]}],
 [19,'numeric','兩段線分別長 47 毫米和 6 公分，接起來不重疊。比 10 公分長多少毫米？',7,'6 公分＝60 毫米，10 公分＝100 毫米；47＋60－100＝7 毫米。',null,{kind:'quantityBars',caption:'比較接起來的總長與 10 公分',labels:['第一段','第二段','比較基準'],values:[47,60,100],unit:'毫米'}]
 ]};
 const used=new Set(papers.filter(p=>p.grade===3&&p.subject==='數學').flatMap(p=>p.entries.map(e=>e.questionId)));
 for(const p of papers.filter(p=>p.grade===3&&p.subject==='數學')){
  let i=0;
  for(const section of p.sections)for(const entry of section.entries){
   if(bank.get(entry.questionId).unit!==21)continue;
   const [unit,type,text,answer,explanation,options,visual]=replacements[p.variant][i++];
   const id='u'+unit+'-t'+(p.variant==='A'?81+i:87+i)+'-n2';
   if(bank.has(id))throw Error('替代題號碰撞 '+id);
   const q={id,unit,topic:80+i,concept:units[unit].name,type,text,answer,explanation,...(options?{options}:{}),visual:{...visual,examLineArt:true},family:'scope-'+p.variant+'-'+i,sourceIds:units[unit].questions[0].sourceIds,sourceType:'依三上第 1～4 單元原創命題',variant:p.variant};
   extras.push(q);bank.set(id,q);entry.questionId=id;used.add(id);
  }
  p.entries=p.sections.flatMap(s=>s.entries);p.scope='第 1～4 單元（10000 以內的數、四位數的加減、毫米、乘法）';
  p.coverage=[17,18,19,20].map(unit=>({unit,name:units[unit].name,count:p.entries.filter(e=>bank.get(e.questionId).unit===unit).length,points:p.entries.filter(e=>bank.get(e.questionId).unit===unit).reduce((n,e)=>n+e.points,0)}));
  p.sections[1].instructions='依題目與圖示計算，填入數字。';p.sections[2].title='三、應用與數量推理';
  p.formatVersion=12;
 }
}
