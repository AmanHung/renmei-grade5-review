import {mathB} from './exam-b-math.mjs';
import {tfB,choiceB} from './exam-b-concepts.mjs';
import {languageB,englishB} from './exam-b-language.mjs';
import {scienceSocialB} from './exam-b-reading.mjs';
import {languageReadingsB} from './exam-b-reading-language.mjs';

export default function addB(papers,units,extras){
 const all=units.flatMap(u=>u.questions).concat(extras),used=new Set(all.map(q=>q.id));
 function number(unit,suffixes){for(let t=99;t>0;t--)if(suffixes.every(s=>!used.has(`u${unit}-t${String(t).padStart(2,'0')}-${s}`))){suffixes.forEach(s=>used.add(`u${unit}-t${String(t).padStart(2,'0')}-${s}`));return t;}throw Error('題號用盡 '+unit);}
 function put(unit,data,forced){
  const suffix=data.type==='boolean'?'tf':data.type==='numeric'?'n1':'b',t=forced?.t??number(unit,[suffix]),id=forced?.id??`u${unit}-t${String(t).padStart(2,'0')}-${suffix}`;
  const q={...data,id,unit,topic:t-1,concept:data.concept||units[unit].name,sourceIds:units[unit].questions[0].sourceIds,sourceType:'B卷依仁美既定範圍改編；公開原卷僅參考題型與設計。新增條件判讀及多步驟應用，非課文或原卷原文。',difficulty:data.difficulty||'challenge',variant:'B',family:'b-'+id};
  if(q.visual)q.visual={...q.visual,examLineArt:true};extras.push(q);return id;
 }
 function group(spec){
  const originals=all.filter(q=>q.passageId===spec.from).sort((a,b)=>a.readingOrder-b.readingOrder);
  if(originals.length!==5)throw Error('B卷缺少完整閱讀 '+spec.from);
  const unit=originals[0].unit,t=number(unit,['r1','r2','r3','r4','r5']),base=originals[0],title=spec.title||base.passageTitle.replace(/（紀錄 1）/g,'')+'：追加資料';
  const passage=spec.passage||'【原始紀錄】'+base.passage+'\n\n【追加情境】'+spec.extra;
  const start=spec.tailStart||3;
  let visual=spec.visual||base.visual||units[unit].articleVisuals?.[spec.from];
  if(visual)visual=JSON.parse(JSON.stringify(visual));if(spec.kind)visual={...visual,kind:spec.kind,examLineArt:true};
  return originals.map((old,i)=>{
   const replacement=spec.all?.[i]||(i+1>=start?spec.tail?.[i+1-start]:null),data=replacement||old;
   const stage=!spec.passage&&!replacement?'依原始紀錄：':'';
   const q={...old,...data,passageTitle:title,passageId:`b-${spec.from}`,passage,readingOrder:i+1,text:`〈${title}〉${stage}${data.text.replace(/^〈[^〉]+〉/,'')}`,visual,readingSkill:replacement?'整合證據、條件與推論':old.readingSkill,difficulty:replacement?'challenge':'core'};
   delete q.chart;delete q.figure;
   if(units[unit].subject==='英語'&&spec.extra)q.glossary=(old.glossary?old.glossary+'；':'')+'original：原始的；target：目標；available：有供應、可使用的；unavailable：無供應的；usable：可使用的；set aside：先放在一旁；share：分享、共用；note：筆記；refer to：指的是';
   return put(unit,q,{t,id:`u${unit}-t${String(t).padStart(2,'0')}-r${i+1}`});
  });
 }
 const section=(id,title,ids,points,instructions)=>({id,title,instructions,count:ids.length,points:ids.length*points,pointsEach:points,entries:ids.map(questionId=>({questionId,points,section:id}))});
 for(const a of [...papers]){
  a.variant='A';const pair=units.filter(u=>u.grade===a.grade&&u.subject===a.subject).map(u=>u.id);let sections;
  if(a.subject==='數學'){
   const rows=pair.map(u=>mathB[u].map(q=>put(u,q)));
   sections=[section('choice','一、選擇與理由判斷',rows.map(r=>r[0]),2,'讀完整個情境，選出條件與理由皆符合的一項。'),section('fill','二、條件計算與看圖填答',rows.flatMap(r=>r.slice(1,3)),3,'留意單位、範圍與起點；計算後填數字或指定名稱。'),section('application','三、多步驟應用與推理',rows.flatMap(r=>r.slice(3)),6,'先整理已知與所求，再計算或判斷。可用紙筆；依最終答案計分。')];
  }else if(['自然','社會'].includes(a.subject)){
   const tf=pair.flatMap(u=>tfB[u].map(([text,truth,explanation])=>put(u,{type:'boolean',text,options:['○ 正確','× 錯誤'],answer:truth?0:1,explanation})));
   const choice=pair.flatMap(u=>choiceB[u].map(([text,options,answer,explanation])=>put(u,{type:'single',text,options,answer,explanation})));
   const ids=scienceSocialB.filter(s=>pair.includes(all.find(q=>q.passageId===s.from).unit)).flatMap(group);
   sections=[section('truefalse','一、情境是非與證據判斷',tf,2,'判斷整句主張是否有充分依據；正確選○，錯誤選×。'),section('choice','二、比較與方案選擇',choice,2,'留意條件與結論的範圍，選擇最有依據的說法。'),section('reading','三、圖文整合與追加資料',ids,3,'先讀原始紀錄，再讀追加情境。題目註明原始或追加時，應依指定資料回答。')];
  }else{
   const data=(a.subject==='國語'?languageB:englishB)[a.grade];
   const words=data.words.map(([text,answer,explanation],i)=>put(pair[i<3?0:1],{type:'text',text,answer,explanation:explanation||'依情境、資料及句型填入 '+answer+'。'}));
   const choice=data.sentences.map(([text,options,answer,explanation],i)=>put(pair[i<2?0:1],{type:'single',text,options,answer,explanation:explanation||'核對人物、提問與情境，正確回應為「'+options[answer]+'」。'}));
   const ids=languageReadingsB.filter(s=>pair.includes(all.find(q=>q.passageId===s.from).unit)).flatMap(group);
   sections=[section('words',a.subject==='國語'?'一、語境中的字詞訂正':'一、語境字詞填寫',words,2,a.subject==='國語'?'依句意訂正指定錯字，每格只填一個字。':'核對情境，填完整單字；留意單複數。'),section('sentences','二、語句與資訊連結',choice,2,'比較完整句意、人物與條件，選出最合適的回應。'),section('reading','三、深度閱讀與資料核對',ids,4,'每篇五題。原始紀錄與追加情境可能有不同條件，請依題目指定的資料作答。')];
  }
  const entries=sections.flatMap(s=>s.entries),bank=new Map(extras.map(q=>[q.id,q]));
  const coverage=pair.map(unit=>({unit,name:units[unit].name,count:entries.filter(e=>bank.get(e.questionId).unit===unit).length,points:entries.filter(e=>bank.get(e.questionId).unit===unit).reduce((n,e)=>n+e.points,0)}));
  if(entries.reduce((n,e)=>n+e.points,0)!==100||entries.length!==a.count)throw Error('B卷題數或配分錯誤 '+a.id);
  papers.push({...a,id:a.id.replace(/-a$/,'-b'),variant:'B',title:a.title.replace(' A 卷',' B 卷'),level:'進階：整合、推論與多步驟應用',minutes:a.subject==='數學'?60:a.subject==='英語'?50:55,sections,entries,count:entries.length,coverage,readingCount:entries.filter(e=>bank.get(e.questionId).passageId).length,formatVersion:11});
 }
}
