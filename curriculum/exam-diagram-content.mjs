// 原卷僅參考線圖與標註方式；資料、考點及答案仍屬仁美已核對範圍。
export function refineVisual(v){
 if(!v||v.kind.startsWith('exam'))return v;
 const copy={...v,examLineArt:true};
 const charts={rain:['毫米',5,1],votes:['票',2,1],beforeAfter:['次',2,1],wind:['圈',2,1]};
 if(charts[v.kind]&&v.table){const [unit,step,valueColumn]=charts[v.kind];return {...copy,kind:'examBars',unit,step,valueColumn,note:v.kind==='rain'?'同一天的模擬雨量':'同條件下的教學模擬資料'};}
 if(v.kind==='syringes'&&v.table)return {...copy,kind:'examSyringes',hideTable:true,description:'刻度單位為格。四幅圖使用相同裝置，出口都封好；依刻度與活塞位置比較。'};
 if(v.kind==='plantParts'&&v.table)return {...copy,kind:'examPlant',hideTable:true,description:'虛線是土面。A～D 為部位代號，請依圖判斷；示意未按實物比例。'};
 if(v.kind==='leaves'&&v.table)return {...copy,kind:'examLeaves',hideTable:true,description:'上排為葉片在莖上的排列，下排為對應葉片的葉脈放大圖。'};
 if(v.kind==='taiwan'&&v.table)return {...copy,kind:'examTaiwan',hideTable:true,description:'A～D 是海域代號。依北箭頭、臺灣輪廓與相對位置判讀；此圖不是測量用地圖。'};
 if(v.kind==='terrain'&&v.table)return {...copy,kind:'examTerrain',hideTable:true,description:'甲、乙、丙使用相同高度基準。海拔及地勢外形應一起判讀；水平距離為示意。'};
 if(v.kind==='reasoningBoard')return {...copy,kind:'examReceipt',heading:'題目資料',rows:v.items.map((s,i)=>[String(i+1),s])};
 return copy;
}
export default function upgradeDiagramContent(units){
 for(const u of units){
  for(const [id,v]of Object.entries(u.articleVisuals||{}))u.articleVisuals[id]=refineVisual(v);
  for(const q of u.questions){if(q.visual)q.visual=refineVisual(q.visual);
   if(q.passageId==='u22-p23')q.passage=q.passage.replace('A 指向花，B 指向葉，C 指向莖，D 指向土裡的根。','圖中用 A、B、C、D 標示四個部位，虛線表示土面。');
   if(q.passageId==='u22-p22')q.passage=q.passage.replace('甲株每節有兩片相對的葉，乙株每節一片、上下錯開，丙株同一節有三片以上葉子。','圖中甲、乙、丙三株的葉片排列不同，下方另附各自的葉脈放大圖。');
   if(q.passageId==='u2-p22'){
    q.passage=q.passage.replace('圖卡標出西側臺灣海峽、東側太平洋、北側東海與南側巴士海峽，協助閱讀位置關係。','圖上用 A、B、C、D 標記臺灣附近四個海域，請結合課堂所學判斷各代號代表的海域。');
    if(q.readingOrder===1)q.text='〈臺灣周邊海域〉依圖中的位置，A 代表哪個海域？';
    if(q.readingOrder===2)q.text='〈臺灣周邊海域〉B 與 D 代表的海域依序是哪兩個？';
   }
  }
 }
 const byId=new Map(units.flatMap(u=>u.questions).map(q=>[q.id,q]));
 const set=(id,v,text)=>{const q=byId.get(id);if(!q)throw Error('找不到配圖題 '+id);q.visual={...v,examLineArt:true};if(text)q.text=text;};
 set('u17-t43-n1',{kind:'examNumberLine',caption:'等距數線',labels:['2980','2990','□','3010']},'觀察下方等距數線，□ 裡的數是多少？');
 set('u19-t42-n1',{kind:'examStrips',caption:'兩段紙條重疊後的長度',mode:'overlap'},'兩段紙條依圖重疊黏好，求整條紙條的長度。');
 set('u19-t44-n1',{kind:'examStrips',caption:'紙帶的裁切紀錄',mode:'cut'},'依圖剪下 4 段後，原紙帶還剩多少毫米？');
 for(const [id,heading,rows,text]of [
  ['u18-t42-n1','購物明細',[['書包','1680 元'],['鞋子','875 元'],['付出','3000 元']],'依購物明細，應找回多少元？'],
  ['u20-t42-n1','購票資料',[['每張票','135 元'],['購買數量','4 張'],['付出','600 元']],'依購票資料，應找回多少元？'],
  ['u8-t42-n1','圖書借閱紀錄',[['週一','20 本'],['週二','35 本'],['週三','25 本'],['週四','？本'],['四天合計','120 本']],'借閱紀錄有一格遺失。週四借出幾本？']
 ])set(id,{kind:'examReceipt',caption:heading,heading,rows},text);
}
export function upgradeExamDiagrams(papers,units,extras){
 for(const q of extras)if(q.visual)q.visual=refineVisual(q.visual);
 const note=extras.filter(q=>q.passageId==='mock-g3-chinese-2');
 for(const q of note)q.visual={kind:'examNotes',caption:'兩張便條的比較',notes:[['別忘了帶來！'],['星期五早自習','帶彩色筆到教室','和第三組一起畫海報']],examLineArt:true};
 const original=units[10].questions[0];
 const items=[
  {id:'u10-t95-a',type:'single',text:'圖中哪一組三根木棒可以圍成三角形？（端點相接，不彎曲木棒。）',options:['甲','乙','丙','丁'],answer:1,explanation:'三角形任兩邊長的和必須大於第三邊。乙的 5＋7＞10；甲、丙剛好相等，丁則小於最長邊，不能圍成三角形。',visual:{kind:'examRods',caption:'四組木棒的長度',sets:[[4,7,11],[5,7,10],[3,6,9],[2,4,8]]}},
  {id:'u10-t96-n1',type:'numeric',text:'左下角是直角，另有 50°、30°、70° 如圖。求交點下方標示的 x 是多少度？',answer:100,unitLabel:'度',explanation:'先看右上方小三角形：交點上方的角＝180－30－70＝80 度。x 與它在同一直線旁互補，所以 x＝180－80＝100 度。亦可先求左大三角形右端角 40 度，再用另一個三角形檢查。',visual:{kind:'examCompound',caption:'相交三角形：依角度標記推理',leftTop:50,top:30,rightBetween:70}},
  {id:'u10-t97-n1',type:'numeric',text:'ABCD 是平行四邊形，BD 是對角線。B 的整個內角是 112°，其中 ∠ABD＝35°。求 ∠ADB，也就是圖中的 x。',answer:77,unitLabel:'度',explanation:'平行四邊形相鄰內角和為 180 度，所以 A＝180－112＝68 度。在三角形 ABD 中，x＝180－68－35＝77 度。',visual:{kind:'examParallel',caption:'平行四邊形與對角線',corner:112,diagonal:35}}
 ];
 for(const q of items)extras.push({...q,unit:10,topic:Number(q.id.match(/t(\d+)/)[1])-1,concept:'平面圖形的圖像推理',sourceIds:original.sourceIds,sourceType:'參考公開原卷的線圖、角度記號及圖形比較形式；依仁美五上平面圖形範圍改編',visual:{...q.visual,examLineArt:true}});
 const p=papers.find(p=>p.id==='g5-math-a');
 const replacements={'u10-t58-n1':'u10-t95-a','u10-t53-n1':'u10-t96-n1','u10-t60-n1':'u10-t97-n1'};
 for(const s of p.sections)for(const e of s.entries)if(replacements[e.questionId])e.questionId=replacements[e.questionId];
 p.entries=p.sections.flatMap(s=>s.entries);
}
