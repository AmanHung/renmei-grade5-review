import fs from 'node:fs';

// Explicitly reviewed learning situations. Tables are retained as records,
// never treated as substitutes for an apparatus, structure or spatial diagram.
const articles={
 '溪邊的觀察紀錄':['auditAnimalDefense','三種自保方式','比較假傷引離巢區、斷尾與枝條擬態，不以表格代替動物外形。'],
 '蟻巢的工作分配':['auditAntJobs','蟻群的工作與角色','呈現不同角色及相互配合的工作，並保留原分工表。'],
 '橡皮筋的兩次比較':['auditRubber','橡皮筋的兩次實驗配置','分開呈現同長度改力道、以及固定其他條件改振動長度。'],
 '光照進水裡':['referenceOptics','光從空氣斜射入水','已具水面、介質與光路，保留既有方向圖。'],
 '旅行前先看位置圖':['referenceMap','臺灣與澎湖位置示意','位置判讀須有指北、島嶼與海域，保留既有位置圖。'],
 '港邊的工作':['auditHarbor','同一港口的不同活動','區分漁船漁獲、貨輪貨物與觀光船旅客。'],
 '兩座茶園的用水':['auditTeaTerrain','甲、乙茶園的地勢與用水','甲為高起平坦臺地與埤塘，乙為起伏坡地與分層茶園、蓄水池。'],
 '雨量紀錄怎麼看':['auditTimeScales','多年紀錄與單日新聞','以不同時間跨度呈現資料，不憑文字捏造實測雨量。'],
 '餐桌上的植物':['auditFoodParts','食物與植物部位','畫出高麗菜葉球、胡蘿蔔根、紅豆種子與木瓜果實。'],
 '葉子的三種特徵':['auditLeaves','甲、乙的葉緣、葉脈與葉序','甲鋸齒網狀互生，乙平滑平行對生；同時顯示莖節與局部葉片。'],
 '紙團為什麼沒有溼':['auditCupAir','倒扣杯：垂直與傾斜比較','呈現水盆、杯口、紙團、留在杯內的空氣及傾斜後逸出的氣泡。'],
 '注射筒的比較紀錄':['auditSyringes','無針注射筒：壓縮與傳動','呈現相同筒身、封口、活塞、空氣與水，以及第二項密合連通裝置。'],
 '海報分工表':['auditTeamJobs','海報製作的三項工作','人物搭配畫圖、查資料、整理文字的具體工具及工作成果。'],
 '把星期三下午排好':['auditSchedule','星期三下午的時間安排','用可對照時刻的時間軸呈現作業、運動與閱讀，不加未提供活動。'],
 '一顆球的借用規則':['auditBallTurns','一顆球與兩組使用者','呈現有限器材與兩組輪替方向；不虛構日期或次數。'],
 '班會紀錄漏了什麼':['auditMeetingNote','原紀錄與補完整的紀錄','以實際紀錄單呈現原缺漏及文中已通過的時間分工。'],
 '早晨少了一場尋找':['auditReminder','門旁的用品提醒便條','便條內容為聯絡簿、水壺、餐袋，搭配實際用品形狀。'],
 '不會再掉下來的便條':['auditReminderLocation','便條的前後位置','比較書桌底下與鉛筆盒旁，箭頭表示移動而非新增物品。'],
 '提早到的練習':['auditPracticeTimeline','到校與準備好的時間','區分 8：50 到校、準備與 9：00 開始，不把兩種時刻混為一談。'],
 '兩張不一樣的表':['auditTwoLists','物品清單與時間安排','以兩張用途不同的紙本清單呈現資訊分類，不虛構班車時刻。'],
 '紙橋第二次站起來':['auditPaperBridge','平紙橋與摺紙橋','兩側支撐與間距相同、同一枚硬幣，只改變紙形；無承重測量數值。'],
 '鉛筆不再滾下桌':['auditPencilTray','擋住鉛筆與紙槽放筆','呈現傾斜桌面、圓鉛筆、可移開的橡皮擦及有邊緣的紙槽。'],
 '公告上的小字':['auditNoticeSize','公告的閱讀距離與字級','將時間地點視為重要資訊，比較小字與放大後的公告；不填入未給的時刻。'],
 '認得自己的水壺':['auditBottleLabels','相同外形水壺的標記','四個相同藍水壺，其中一個有小禾姓名；靠標記而非外形辨識。'],
 '只有一把剪刀':['auditPaperWorkflow','四人的紙工步驟','畫輪廓、輪流剪、等待時摺紙整理，呈現一把剪刀的分配。'],
 '下雨後的新集合點':['auditNoticeChange','集合通知的前後內容','新通知依文中 8：20、一樓穿堂與操場取消呈現，不杜撰校園方位。'],
 '河流的兩種模樣':['auditRiverViews','近看河面與俯看河道','以示意視角區分河面細節與河道、農田、聚落關係，非實拍照片。'],
 '田野像拼布':['auditFields','田野的不同色塊','保留深綠、淺綠、金黃色塊；不由顏色直接標定作物種類。'],
 '把鏡頭拉遠':['auditRiverViews','河口俯視與葉片特寫','區分位置關係與細部觀察，示意圖不假稱原始空拍照片。'],
 '從近處到遠方':['auditLandscapeLayers','前景、中景與遠景','依文中順序畫紅花、小橋、遠山，協助觀察描述順序。'],
 '畫裡的等待':['auditPainting','依文字描述重繪的畫面','呈現窗邊老人、放在膝上的雙手及門口，圖為依文字重繪的示意。'],
 '安靜的顏色':['auditSeaColors','同一海景的色彩表現','依本文灰藍清晨、橘紅夕陽，追加資料有紫色想像時才增加第三幅。'],
 '色彩不能單獨作證':['auditSigns','兩家綠色招牌的比較','同色招牌的圖形、字樣與排列不同；為虛構設計示意，非真實商標。'],
 '小店的新標誌':['auditLogoScale','標誌縮小前後','比較複雜線條與簡化麵包標誌的辨識效果，無真實品牌。'],
 '一眼認出的秘密':['auditTeamLogo','兩版隊徽示意','第一版多元素、第二版山形隊名放大，與文中設計修改相符。'],
 '一頁一頁動起來':['auditAnimation','連續畫面的動作變化','連續畫格呈現位置逐步變化；只有本文談及動畫與連續畫格才使用。']
};
const conceptScenes={
 0:{0:'auditCamouflage',1:'auditAnimalDefense',2:'auditTeeth',4:'auditAntJobs',6:'auditThermoregulation',10:'auditTeeth'},
 1:{0:'auditTuningFork',1:'auditRubber',2:'auditRubber',4:'referenceOptics',5:'auditMirrorRay',6:'auditMagnifier',7:'auditSoundBox'},
 2:{0:'referenceMap',1:'referenceMap',2:'auditHarbor',3:'auditCompass',4:'auditRegionalMap',5:'auditRegionalMap',6:'referenceMap'},
 3:{0:'auditLandform',1:'auditLandform',2:'auditRiverTerrain',3:'auditTeaTerrain',4:'auditMountainRoad',5:'auditMonsoon',6:'auditTimeScales',7:'auditSlopeCover',10:'auditLandform',11:'auditRainShelter'},
 22:{0:'auditLeaves',1:'auditLeaves',2:'referenceRoots',3:'referenceRoots',4:'auditFoodParts',5:'auditFlower',6:'auditFruitSeeds',7:'auditStems',8:'auditLeaves',10:'auditLeaves',11:'auditFlower'},
 23:{0:'auditCupAir',1:'auditWaterContainers',2:'auditSpongeAir',3:'auditSyringes',4:'auditBalloon',5:'auditWind',6:'auditSyringes',7:'auditFanTest',8:'auditWaterContainers',9:'auditSyringes',10:'auditAirExamples',11:'auditAirExamples'},
 24:{0:'auditTeamJobs',2:'auditStudySteps',3:'auditResources',4:'auditStudySteps',5:'auditPlanSteps',7:'auditResources',10:'auditStudySteps',11:'auditResources'},
 25:{1:'auditMeetingNote',3:'auditMeetingNote',4:'auditCorridor',6:'auditBallTurns',10:'auditMeetingRoles',11:'auditMeetingRoles'}
};
const captions={auditCamouflage:'枝條與竹節蟲外形比較',auditAnimalDefense:'動物自保行為示意',auditTeeth:'門齒、犬齒與臼齒的形狀',auditBirth:'胎生與卵生示意',auditAntJobs:'蟻群角色及工作',auditThermoregulation:'散熱與獲取外界熱量',auditTuningFork:'音叉接觸水面的裝置',auditRubber:'橡皮筋振動的比較配置',auditMirrorRay:'光源、鏡面與反射光',auditMagnifier:'放大鏡與觀察物',auditSoundBox:'有、無音箱的比較',auditCompass:'方向標記與相對位置',auditRegionalMap:'臺灣與亞洲東部位置',auditLandform:'依地勢觀察形狀',auditRiverTerrain:'河流從高處流向低處',auditMountainRoad:'山地交通配置示意',auditMonsoon:'冬季東北季風示意',auditSlopeCover:'坡地植被與雨水',auditRainShelter:'多雨環境的設施',auditLeaves:'葉片與莖節的觀察',auditFlower:'花朵的構造與觀察',auditFruitSeeds:'果實內的種子',auditStems:'直立與攀附的莖',auditWaterContainers:'不同容器中的水',auditSpongeAir:'海綿入水後排出空氣',auditBalloon:'充氣前後的氣球',auditWind:'空氣流動與風車',auditFanTest:'同距離、同紙風車的比較',auditAirExamples:'空氣占有空間的生活例子',auditStudySteps:'找錯因與重新嘗試',auditResources:'觀察、查圖鑑與核對來源',auditPlanSteps:'安排任務與保留休息',auditCorridor:'走廊的安全通行',auditMeetingRoles:'班會角色與討論順序'};
const refsFor={自然:['REF-62e311149b','REF-aee19445a2','REF-b81ad739fc'],社會:['REF-857b30709b','REF-843f6a9aff'],國語:['REF-259cc36ab7','REF-e05ab93ee3'],英語:['REF-d7ead9893d','REF-bf9819daf9'],數學:['REF-b3ac3a1ec8','REF-dcff2019fd']};

function decide(q,u){
 const text=(q.text||'')+' '+(q.passage||'');
 const title=(q.passageTitle||'').replace(/：追加資料$/,'');
 const index=q.libraryKey?Number(q.libraryKey.match(/-t(\d+)/)?.[1])-201:null;
 let match=articles[title];
 if(!match&&q.libraryKey&&!q.passageId&&conceptScenes[u.id]?.[index]){
  const kind=conceptScenes[u.id][index];match=[kind,captions[kind]||'依題目條件繪製的示意圖','本題涉及器材、構造或位置，需有對應實物或操作圖。'];
 }
 if(!match&&u.subject==='自然'&&q.visual?.kind==='referenceData'){
  if(/出生與照顧/.test(title))match=['auditAnimalFamily','動物的出生與照顧紀錄','雞、兔與蝴蝶形態及對應觀察，保留原資料表。'];
 }
 if(!match&&u.subject==='社會'&&q.visual?.kind==='referenceData'){
  if(/地勢與生活/.test(title))match=['auditRiverTerrain','地勢與生活配置','依表中甲乙丙線索繪製平坦、坡地與河邊，不改代號。'];
  else if(/專長|分工|值日/.test(title))match=['auditTeamJobs','工作分工的具體情境','按原表的人物和工作作圖，不使用無關的三人通用插畫。'];
  else if(/錯誤變成|訂正/.test(title))match=['auditStudySteps','訂正的操作步驟','呈現抄答案、找錯因、自己再試的不同活動。'];
  else if(/報告資料室/.test(title))match=['auditResources','葉片觀察與圖鑑查找','補上觀察葉序與查圖鑑的資料來源關係。'];
 }
 if(!match&&u.subject==='英語'&&q.passageId){
  if(u.id===15||u.id===16)match=['auditPeopleCards','人物、姓名與年齡','人物胸前姓名牌與生日數字搭配對話，替代表格單獨承擔人物辨識。'];
  if(u.id===6)match=['auditDrinkOrders','人物與飲料','依對話表格逐人呈現實際飲料種類；不額外推定喜好。'];
  if(u.id===7)match=['auditFruitInventory','需求與現有水果','分別畫出 Need 與 Have at first 的蘋果、香蕉數量，不用表格取代可數物件。'];
 }
 if(!match&&u.subject==='數學'&&(!q.visual&&!q.chart&&!q.figure)){
  if(/角柱|角錐|圓柱/.test(q.text))match=['auditSolids','立體形體觀察','角柱錐體與面邊頂點須有正確模型，未知數不標答案。'];
  else if(/等腰三角形|三角形兩邊|四邊形|平行四邊形/.test(q.text))match=['auditGeometry','已知條件的幾何圖','標出已知角或邊；不以文字省略幾何關係，也不標待求答案。'];
  else if(/紙|繩/.test(q.text)&&/重疊|剪成|切成/.test(q.text))match=['auditStrips','紙條、繩段或裁切配置','將重疊或裁切位置畫出來，未知量留問號，不只用數字列表。'];
  else if(/數線/.test(q.text))match=['auditNumberLine','數線上的起點與移動','依已知數與移動格數繪製，待求位置不直接寫答案。'];
  else if(/鉛筆放在尺上/.test(q.text))match=['auditRuler','非零起點量尺','標出鉛筆起終點與毫米刻度，顯示非零起點。'];
 }
 if(!match&&u.subject==='國語'&&q.passageId){
  if(/商標|標誌|隊徽/.test(title)&&/縮小|兩版|兩家/.test(text))match=['auditLogoScale','文字中描述的設計比較','依本文已知的設計元素作圖，標示為依文意重繪。'];
  else if(/動畫|連續畫面|分鏡|翻頁/.test(text)&&/動起來|畫格|翻頁|連續/.test(title))match=['auditAnimation','連續畫面示意','展示動作前後的變化；非作者原畫或影片截圖。'];
 }
 return match;
}

export default function reviewVisuals(units,extras){
 const rows=[];
 for(const q of units.filter(u=>u.active!==false).flatMap(u=>u.questions).concat(extras)){
  const u=units[q.unit],before=q.visual?.kind||q.figure?.type||(q.chart?'chart':'none');
  const match=decide(q,u);
  let reason,decision;
  if(match){
   const [kind,caption,why]=match;
   q.visual={...(q.visual||{}),kind,caption,description:q.visual?.table?'依題文條件重繪的教學示意；圖與下方紀錄表需一起閱讀。':'依題目條件繪製的示意圖；請觀察圖中的物體與配置。',sceneText:q.text,articleTitle:q.passageTitle||'',articleText:/安靜的顏色/.test(q.passageTitle||'')?q.passage:'',unitId:q.unit,conceptIndex:q.libraryKey?Number(q.libraryKey.match(/-t(\d+)/)?.[1])-201:null};
   if(kind==='auditSyringes')q.visual.mode=q.passageId?'both':/傳送|傳動/.test(q.text)?'hydraulic':'sealed';
   if(kind==='auditLandform')q.visual.mode=/四周.*較高|盆地/.test(q.text)?'basin':'plateau';
   if(kind==='auditPeopleCards')q.visual.showAges=u.id===16;
   if(kind==='auditSolids'){
    const txt=q.text,n=/六角/.test(txt)?6:/五角/.test(txt)?5:/三角/.test(txt)?3:4;
    q.visual.kind='solids';q.visual.models=/角柱與.*角錐/.test(txt)?[{shape:'prism',n:4,count:1},{shape:'pyramid',n:4,count:1}]:[{shape:/圓柱/.test(txt)?'cylinder':/角錐/.test(txt)?'pyramid':'prism',n:/圓柱/.test(txt)?undefined:n,count:1}];
   }
   if(kind==='auditGeometry'){
    if(/頂角為 94/.test(q.text))Object.assign(q.visual,{kind:'isosceles',vertex:94});
    else if(/兩個直角.*72/.test(q.text))Object.assign(q.visual,{kind:'quadKnown',angles:[90,90,72,null]});
    else if(/兩邊為 7、11/.test(q.text))Object.assign(q.visual,{kind:'triangleSides',sides:[7,11]});
    else if(/一角為 70/.test(q.text))Object.assign(q.visual,{kind:'parallelogram',known:70});
    else if(/四邊原本都等長/.test(q.text))Object.assign(q.visual,{kind:'rhombus'});
    else throw Error('幾何條件未逐題指定：'+q.id);
   }
   if(kind==='auditStrips'){
    const txt=q.text;
    if(/長 52 公分、寬 39/.test(txt))Object.assign(q.visual,{mode:'rectangleCut',width:52,height:39});
    else if(/長 84 公分、寬 60/.test(txt))Object.assign(q.visual,{mode:'rectangleCut',width:84,height:60});
    else if(/47 毫米與 36 毫米/.test(txt))Object.assign(q.visual,{kind:'overlapStrips',a:47,b:36,overlap:8});
    else if(/4 公分 7 毫米、3 公分 8 毫米/.test(txt))Object.assign(q.visual,{kind:'overlapStrips',a:47,b:38,overlap:6});
    else if(/2 條各長 9 公分/.test(txt))Object.assign(q.visual,{mode:'unknownOverlap',a:90,b:90,total:150});
    else throw Error('裁切或重疊條件未逐題指定：'+q.id);
   }
   if(kind==='auditRuler')Object.assign(q.visual,{start:8,end:73,max:80});
   q.visual.examLineArt=false;
   delete q.visualPolicy;
   decision=before===kind?'保留並核對':'補足具體圖示';reason=why;
  }else if(q.visual||q.figure||q.chart){
   decision='保留並核對';reason=u.subject==='數學'?'既有尺圖、數線、幾何或數量圖已提供題目所需條件，保留已知量與未知量區別。':q.visual?.kind==='referenceData'?'此處資料為訪談、文字摘要或紀錄，本題不要求辨識器材、外形或位置；表格保留為文字證據。':'既有圖已呈現原文所需的構造、器材或位置，未改為通用插畫。';
  }else{
   decision='文字作答適當';reason=u.subject==='英語'?'測量單字、數字、句型或語法，已提供必要文字，不需用圖直接提示答案。':u.subject==='國語'?'測量語詞、修辭、因果或敘事理解；文中有完整線索，不以裝飾圖替代閱讀。':u.subject==='數學'?'純計算或因倍數條件可由題幹完整表達，不需要虛構量測圖。':'本題測量概念或程序判斷，沒有需要辨識的外形、器材配置或圖上位置。';
  }
  q.visualReview={version:17,decision,reason};
  rows.push({id:q.id,grade:u.grade,subject:u.subject,unit:u.name,passageId:q.passageId||null,passageTitle:q.passageTitle||null,before,after:q.visual?.kind||q.figure?.type||(q.chart?'chart':'none'),decision,reason,sourceIds:q.sourceIds||[],referencePages:q.referencePages||[]});
 }
 const summary={version:17,questionRecords:rows.length,practiceQuestions:units.filter(u=>u.active!==false).reduce((n,u)=>n+u.questions.length,0),updated:rows.filter(r=>r.decision==='補足具體圖示').length,bySubject:Object.fromEntries(['國語','數學','英語','自然','社會'].map(s=>[s,{reviewed:rows.filter(r=>r.subject===s).length,updated:rows.filter(r=>r.subject===s&&r.decision==='補足具體圖示').length}]))};
 fs.writeFileSync('reference-library/visual-review-v17.json',JSON.stringify({summary,rows},null,2)+'\n');
 fs.writeFileSync('各科配圖重新審查.md',`# 各科配圖重新審查\n\n本次審查 ${rows.length} 筆練習與考卷題目資料，涵蓋 ${summary.practiceQuestions} 道有效練習與全部 A、B 卷；補足具體圖示 ${summary.updated} 筆。相同閱讀題組共用一張圖，不將五道小題宣稱為五張不同設計。\n\n## 審查原則\n\n實驗、構造、位置與量測題要有相符的器材、構造或空間圖，不能只因文字已交代就省略。表格用來保留數據與紀錄，不能代替針筒、杯子、葉片、地形或可數水果。文字語法與純計算則不強加無關圖。\n\n## 原卷對照\n\n- 深美 108 三上自然期末卷第 1 頁：空氣與水封口注射筒的壓放前後圖、倒扣杯題；本次重新讀取文字並檢視原頁。僅取空氣與水共同考點。\n- 永安 111 三上自然第 2 頁：花構造引線、根部圖與食物部位。\n- 明義 113 五上自然第 2 頁：三個同構水槽光路選項；只改變待比較的路線。\n- 永安 114 三上數學第 2 頁：非零起點尺圖、數線與方格。\n- 永安 114 五上數學第 1～2 頁：折線、立體隱邊、角度與資料轉圖。\n- 永安 114 五上社會第 2 頁：臺灣輪廓與海岸位置。\n- 永安 114 三上及五上英語第 1～2 頁：人物、數字、飲料與可數水果圖。\n- 永安 114 三上及五上國語：流程與作答格可輔助閱讀，並非每題都要裝飾插畫。\n\n## 各科結果\n\n| 科目 | 審查題目資料筆數 | 補足具體圖示筆數 |\n| --- | ---: | ---: |\n${Object.entries(summary.bySubject).map(([s,c])=>`| ${s} | ${c.reviewed} | ${c.updated} |`).join('\n')}\n\n逐題決策、原圖種、新圖種與理由見 [完整審查紀錄](reference-library/visual-review-v17.json)。\n`);
 return summary;
}
