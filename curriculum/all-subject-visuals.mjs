// Topic-specific diagrams for every subject. Existing measured experiment data,
// assessment charts and answer-bearing tables remain the source of truth.
const topics={
 0:['beaks','teeth','camouflage','mimicry','defense','thermoregulation','thermoregulation','migration','hibernation','animalSignals','scent','beeDance','antTeam','courtship','birth','birth','parentYoung','parentYoung','observation','habitat'],
 1:['vibration','vibration','soundMedium','stringPhone','waveAmplitude','waveFrequency','stringLength','stringThickness','airColumn','drum','soundSafety','soundSafety','lightSources','lightPath','shadow','mirror','eyePath','refraction','prism','labSafety'],
 2:['globe','compass','taiwan','regionalMap','coordinates','globe','seaTrade','culture','culture','sharedRules','sharedRules','sharedRules','rights','rights','rights','accessibility','discussion','privacy','vote','verify'],
 3:['terrain','mountain','hill','plateau','basin','plain','taiwanTerrain','river','coast','transport','landUse','weatherClimate','latitude','altitude','monsoon','waterStorage','storm','slope','habitat','mapKey'],
 22:['plantObserve','observation','roots','roots','stem','stems','leafParts','leafShapes','leafEdges','leafVeins','leafOrder','flower','fruitSeeds','seedShapes','plantEnvironment','plantWater','plantFood','plantProducts','habitat','observation'],
 23:['balloon','cupAir','waterDisplace','cupAir','waterShape','airShape','waterFlow','wind','waterBalance','airBalance','airCompression','waterCompression','fairTest','pistons','pistons','wind','windStrength','windUses','storm','labSafety'],
 24:['selfIntro','teamSkills','teamSkills','discussion','division','study','listen','ask','notes','revise','study','book','library','ask','verify','schedule','schedule','checklist','schedule','balance'],
 25:['sharedRules','discussion','accessibility','checklist','revise','library','discussion','agenda','discussion','listen','vote','discussion','notes','checklist','division','teamSkills','vote','division','checklist','ask']
};
function readingMode(q,u){
 const p=(q.passageTitle||'')+' '+(q.passage||'');
 if(u.subject==='國語'){
  if(/岩壁/.test(p))return 'climb';
  if(/壁虎/.test(p))return 'gecko';
  if(/棉花糖|身高/.test(p))return 'comparison';
  if(/陶杯|揉土/.test(p))return 'clayCup';
  if(/隊徽/.test(p))return 'logo';
  if(/翻頁|連續圖像/.test(p))return 'flipBird';
  if(/展覽|署名|圖畫/.test(p))return 'gallery';
  if(/積木塔/.test(p))return 'blockTower';
  if(/擦拭|吸水的布/.test(p))return 'wipeWater';
  if(/剪刀/.test(p))return 'scissors';
  if(/標籤|借物櫃/.test(p))return 'storageLabels';
  if(/校園圖|維修|集合地點/.test(p))return 'routeMap';
  if(/風車/.test(p))return 'wind';
  if(/書包|用品整理/.test(p))return 'schoolbag';
  if(/借閱|找回.*書/.test(p))return 'library';
  if(/展示位置/.test(p))return 'gallery';
  if(/紙橋|摺橋/.test(p))return 'paperBridge';
  if(/花苗|小苗|花圃|盆栽/.test(p))return /傘/.test(p)?'umbrellaPlant':'plantWater';
  if(/鉛筆.*(滑|滾)|筆槽/.test(p))return 'pencilTray';
  if(/水壺|熱水|水滾/.test(p))return 'kettle';
  if(/屋頂|空拍|高處.*綠/.test(p))return 'roofGarden';
  if(/烤餅|市場/.test(p))return 'bakery';
  if(/商標|招牌|標誌|圖案/.test(p))return 'logo';
  if(/動畫|分鏡|連續畫面/.test(p))return 'storyboard';
  if(/畫家|畫作|畫裡|美術館|雕像/.test(p))return /橘紅|紫色|藍海/.test(p)?'seaPaintings':'gallery';
  if(/攀岩|攀登/.test(p))return 'climb';
  if(/蚊帳/.test(p))return 'mosquitoNet';
  if(/義賣|包裝|紙袋/.test(p))return 'fundraiser';
  if(/還書|借書/.test(p))return 'libraryCard';
  if(/卡片|便條|便利貼|貼紙/.test(p))return 'reminder';
  if(/計畫|時間|五分鐘|鐘|早晨|作息/.test(p))return 'schedule';
  if(/忘了帶尺|測量/.test(p))return 'measurement';
  return null;
 }
 return null;
}
export default function addSubjectVisuals(units,extras){
 let count=0;
 for(const u of units.filter(u=>u.active!==false&&u.subject!=='數學')){
  for(const q of u.questions.concat(extras.filter(q=>q.unit===u.id))){
   const original=q.visual||u.articleVisuals?.[q.passageId]||u.topicVisuals?.[q.topic];
   if(q.figure||q.chart)continue;
   let mode;
   if(!q.passageId&&q.topic<20)mode=topics[u.id]?.[q.topic];
   if(u.subject==='國語')mode=readingMode(q,u);
   if(original?.kind==='examEvidenceTable'){
    if(u.id===0)mode='birth';
    if(u.id===2)mode='culture';
    if(u.id===24)mode='resources';
   }
   if(!q.passageId&&!mode&&!/^(exam|b[A-Z])/.test(original?.kind||'')&&['自然','社會'].includes(u.subject)){
    const rules=[[/鳥喙|喙形/,'beaks'],[/牙齒|臼齒|犬齒/,'teeth'],[/保護色/,'camouflage'],[/擬態/,'mimicry'],[/卵生|胎生|出生/,'birth'],[/育幼/,'parentYoung'],[/體溫/,'thermoregulation'],[/遷徙/,'migration'],[/休眠/,'hibernation'],[/橡皮筋|琴弦/,'rubberLab'],[/音高|振動快慢/,'waveFrequency'],[/音量|振幅/,'waveAmplitude'],[/傳聲筒/,'stringPhone'],[/影子|光沿直線/,'shadow'],[/鏡面|反射/,'mirror'],[/折射|吸管/,'refraction'],[/葉脈/,'leafVeins'],[/葉序|對生|互生|輪生/,'leafOrder'],[/葉緣/,'leafEdges'],[/根系|鬚根|軸根/,'roots'],[/果實|種子/,'fruitSeeds'],[/花瓣|花的構造/,'flower'],[/注射筒|壓縮/,'airCompression'],[/倒扣杯|杯內空氣/,'cupAir'],[/連接.*活塞|傳送動力/,'pistons'],[/風車|風力/,'wind'],[/盆地/,'basin'],[/臺地/,'plateau'],[/山地|丘陵|平原|地形/,'terrain'],[/上游|下游|河川/,'river'],[/氣候|天氣/,'weatherClimate'],[/海拔|高度.*氣溫/,'altitude'],[/方位|東方|西方|南方|北方/,'compass'],[/經緯|半球/,'coordinates'],[/表決|投票|選舉/,'vote'],[/隱私/,'privacy'],[/分工/,'division'],[/班會|討論|發言/,'discussion'],[/課表|時間安排|計畫/,'schedule'],[/圖書館|資料查證/,'resources']];
    mode=rules.find(([re])=>re.test(q.text))?.[1];
   }
   // Replace coarse illustrations in science reading with an actual setup.
   const readingKinds={birds:'beaks',sound:'rubberLab',refraction:'refraction',cupAir:'cupAir',pistons:'pistons',river:'river',landUse:'landUse',teamwork:'teamSkills',resources:'resources',studySteps:'revise',libraryRules:'library',duty:'division',sharedSpace:'sharedRules'};
   if(!mode&&q.passageId)mode=readingKinds[original?.kind];
   if(u.subject==='英語'&&original?.kind==='fruitList'&&original.table)mode='pictureInventory';
   if(!mode)continue;
   // Keep exact tables; the drawing is qualitative unless it explicitly uses those values.
   q.visual={...original,kind:'subjectScene',mode,caption:original?.caption||q.concept||u.name,description:'依圖觀察物體、配置或前後關係；圖為情境示意，具體資料以題目與附表為準。',examLineArt:false};
   if(mode==='seaPaintings')q.visual.paintingLabels=/紫色/.test(q.passage||'')?['清晨','夕陽','想像中的海']:['清晨','夕陽'];
   q.visualAudit={version:12,subject:u.subject,mode};count++;
  }
 }
 return count;
}
