import {judgments,choices} from './exam-review-v10.mjs';
import {readings} from './exam-reading-v10.mjs';
import {sentences} from './exam-language-v10.mjs';

export default function reviseExams(papers,units,extras){
 const original=new Map(units.flatMap(u=>u.questions).concat(extras).map(q=>[q.id,q]));
 for(const [firstUnit,rows]of Object.entries(sentences))for(let i=0;i<rows.length;i++){
  const unit=Number(firstUnit)+(i<2?0:1),q=extras.find(q=>q.id===`u${unit}-t${90+i}-a`),[text,options,answer,explanation]=rows[i];
  if(!q)throw Error('找不到語句題');Object.assign(q,{text,options,answer,explanation,reviewVersion:10});
 }
 for(const [unit,rows]of Object.entries(judgments))for(let i=0;i<rows.length;i++){
  const q=extras.find(q=>q.id===`u${unit}-t${80+i}-tf`),[text,truth,explanation]=rows[i];
  if(!q)throw Error('找不到是非題');
  Object.assign(q,{text,answer:truth?0:1,explanation,difficulty:'core',reviewVersion:10});
 }
 for(const p of papers){
  p.formatVersion=10;
  if(!['自然','社會'].includes(p.subject))continue;
  const section=p.sections.find(s=>s.id==='choice');
  section.entries.forEach((entry,i)=>{
   const old=original.get(entry.questionId),unit=old.unit,n=i%5,[text,options,answer,explanation]=choices[unit][n];
   const q={...old,id:`u${unit}-t${95+n}-a`,topic:94+n,text,options,answer,explanation,difficulty:'core',reviewVersion:10,sourceType:'依仁美單元範圍改編；參考公開原卷的情境判斷與同領域干擾選項'};
   delete q.visual;delete q.figure;delete q.chart;
   extras.push(q);entry.questionId=q.id;
  });
  const reading=p.sections.find(s=>s.id==='reading'),oldGroups=[...new Set(reading.entries.map(e=>original.get(e.questionId).passageId))];
  for(const passageId of oldGroups){
   const spec=readings.find(r=>r.from===passageId);if(!spec)throw Error('缺少閱讀重製 '+passageId);
   const unit=spec.unit,index=readings.filter(r=>r.unit===unit).indexOf(spec),topic=70+index;
   const v=spec.visualFrom?JSON.parse(JSON.stringify(units[unit].articleVisuals[passageId])):{...spec.visual,examLineArt:true};
   if(!v)throw Error('缺少附圖 '+passageId);
   const oldQuestions=reading.entries.filter(e=>original.get(e.questionId)?.passageId===passageId);
   if(oldQuestions.length!==5)throw Error('閱讀題組應含五題');
   for(let i=0;i<5;i++){
    const old=original.get(oldQuestions[i].questionId),data=spec.questions[i];
    const q={...old,...data,id:`u${unit}-t${topic}-r${i+1}`,topic:topic-1,passageId:`mock-v10-u${unit}-${index+1}`,passageTitle:spec.title,passage:spec.passage,readingOrder:i+1,readingSkill:['圖文定位與對照','資料比較與連結','因果與條件判斷','評估說法或推論','遷移與具體應用'][i],visual:v,difficulty:i<2?'core':'challenge',reviewVersion:10,sourceType:'依仁美範圍原創延伸題組；參考公開卷的圖文整合、觀察比較與情境判斷，不是原卷或課文原文'};
    delete q.figure;delete q.chart;delete q.glossary;
    extras.push(q);oldQuestions[i].questionId=q.id;
   }
  }
  p.entries=p.sections.flatMap(s=>s.entries);
 }
}
