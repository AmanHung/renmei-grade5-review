import fs from 'node:fs';
import {createHash} from 'node:crypto';
import chineseExamItems from './mock-chinese.mjs';
import redesign,{writeBlueprint,writeFormatPage} from './exam-format-v8.mjs';
import {upgradeExamDiagrams} from './exam-diagram-content.mjs';
import reviseExams from './exam-revision-v10.mjs';
import addSubjectVisuals from './all-subject-visuals.mjs';
import applyScope from './scope-v12.mjs';
import supplementVisuals from './supplement-visuals.mjs';
import addB from './mock-exams-b.mjs';

// 固定 A 卷的命題藍圖；不用隨機抽題，也不用只換數字的題目湊分。
export default function writeMockExams(units){
 const extras=[1,2].map((n)=>({id:`u6-t71-r${n}`,unit:6,topic:70,concept:'Get Ready：三位數與資訊核對',type:'single',passageId:'mock-g5-tickets',readingOrder:n,passageTitle:'Read the tickets',passage:'At the school fair, Amy and Ben have tickets.\n\nAmy: My ticket is one hundred and twenty-four.\nBen: My ticket is one hundred and forty-two.\n\nThe board says: 124 → 142.\nAmy: Look! My number is first.',glossary:'ticket：號碼牌；board：看板；first：先、第一個',text:n===1?'Which ticket is Amy’s?':'Who goes first according to the board?',options:n===1?['124','142','214','241']:['Amy','Ben','Amy and Ben together','The board does not show an order.'],answer:0,explanation:n===1?'one hundred and twenty-four 是 124；不要把十位和個位顛倒。':'看板依序列出 124、142。Amy 的號碼是 124，因此先輪到 Amy。',readingSkill:n===1?'數字辨讀':'對照文字與看板',sourceIds:['E5'],sourceType:'依 Get Ready 三位數範圍編寫的延伸閱讀',visual:{kind:'reasoningBoard',caption:'Ticket board',description:'看板的號碼依序是 124、142。',items:['124 → 142']}}));
 extras.push(...chineseExamItems(units));
 const bank=units.flatMap(u=>u.questions).concat(extras),byId=new Map(bank.map(q=>[q.id,q]));
 const papers=[];
 const choose=(u,t,orders)=>orders.map(n=>{const q=units[u].questions.find(q=>q.topic===t&&q.readingOrder===n);if(!q)throw Error(`缺少閱讀 ${u}/${t}/${n}`);return q.id;});
 const article=(u,t,orders=[1,2,3,4,5])=>choose(u,t,orders);
 function add(grade,subject,slug,scope,ids){
  const questions=ids.map(id=>{const q=byId.get(id);if(!q)throw Error('缺少考題 '+id);return q;});
  if(ids.length!==20||new Set(ids).size!==20||questions.some(q=>units[q.unit].grade!==grade||units[q.unit].subject!==subject))throw Error('模擬考藍圖錯誤 '+slug);
  const covered=[...new Set(questions.map(q=>q.unit))],expected=units.filter(u=>u.grade===grade&&u.subject===subject).map(u=>u.id);
  if(expected.some(id=>!covered.includes(id)))throw Error('模擬考漏單元 '+slug);
  const signature=createHash('sha256').update(JSON.stringify(questions)).digest('hex').slice(0,20);
  papers.push({id:`g${grade}-${slug}-a`,grade,subject,title:`${grade===3?'三上':'五上'}${subject}期中模擬考 A 卷`,publisher:units[covered[0]].publisher,scope,minutes:subject==='數學'?50:subject==='國語'?45:40,signature,total:100,entries:ids.map(id=>({questionId:id,points:5})),coverage:covered.map(id=>({unit:id,name:units[id].name,count:questions.filter(q=>q.unit===id).length})),readingCount:questions.filter(q=>q.passageId).length});
 }
 for(const [grade,pair,topics] of [[3,[13,14],[[0,1,2],[0,3,4]]],[5,[4,5],[[0,5,11],[0,6,12]]]]){
  const ids=grade===3?extras.filter(q=>[13,14].includes(q.unit)).map(q=>q.id):pair.flatMap((u,i)=>topics[i].flatMap((t,j)=>article(u,t,[[1,2,3],[1,4,5],[2,3,4,5]][j])));
  add(grade,'國語','chinese',grade===3?'第 1 課～統整活動二（第 1～6 課）':'第 1～6 課、學習地圖一、二',ids);
 }
 add(3,'英語','english','Unit 1、Unit 2、Review 1',[...article(15,0),...article(15,40),...article(16,0),...article(16,41)]);
 add(5,'英語','english','Get Ready、Unit 1、Unit 2、Review 1',[...extras.filter(q=>q.unit===6).map(q=>q.id),...article(6,0,[1,2,3,5]),...article(6,40),...article(7,41,[1,2,3,4]),...article(7,0)]);
 const plans=[
  [5,'自然','science',[0,1],[[20,22],[20,23]],[['u0-t04-b','u0-t06-b','u0-t08-b','u0-t13-b'],['u1-t04-b','u1-t07-b','u1-t16-b','u1-t17-b']]],
  [5,'社會','social',[2,3],[[21,22],[20,21]],[['u2-t02-b','u2-t05-b','u2-t11-b','u2-t19-b'],['u3-t02-b','u3-t09-b','u3-t16-b','u3-t19-b']]],
  [3,'自然','science',[22,23],[[21,22],[20,22]],[['u22-t04-b','u22-t12-b','u22-t14-b','u22-t19-b'],['u23-t04-b','u23-t09-b','u23-t13-b','u23-t20-b']]],
  // 社會全卷採四篇完整情境，避免孤立的定義記憶題。
  [3,'社會','social',[24,25],[[20,22],[20,23]],null]
 ];
 for(const [grade,subject,slug,pair,topics,concepts] of plans){
  const ids=pair.flatMap((u,i)=>[...topics[i].flatMap(t=>article(u,t,concepts?[1,3,4]:[1,2,3,4,5])),...(concepts?.[i]||[])]);
  add(grade,subject,slug,'第 1～2 單元',ids);
 }
 const math3=[['u17-t01-n2','u17-t43-n1','u17-t45-n1','u17-t46-n1'],['u18-t01-n1','u18-t44-n1','u18-t45-n1','u18-t42-n1'],['u19-t01-n2','u19-t43-n1','u19-t46-n1','u19-t41-n1'],['u20-t01-n2','u20-t41-n1','u20-t42-n1','u20-t46-n1'],['u21-t44-n1','u21-t41-n1','u21-t43-n1','u21-t47-n1']].flat();
 const math5=[['u8-t01-n1','u8-t42-n1','u8-t43-n1','u8-t46-n1'],['u9-t01-n5','u9-t45-n1','u9-t46-n1','u9-t41-n1'],['u10-t41-n1','u10-t56-n1','u10-t53-n1','u10-t60-n1'],['u11-t01-n2','u11-t41-n1','u11-t42-n1','u11-t43-n1'],['u12-t01-n1','u12-t01-n4','u12-t44-n1','u12-t46-n1']].flat();
 add(3,'數學','math','第 1～5 單元、統整與應用一',math3);
 add(5,'數學','math','第 1～5 單元、學習加油讚（一）',math5);
 redesign(papers,units,extras);
 upgradeExamDiagrams(papers,units,extras);
 reviseExams(papers,units,extras);
 addB(papers,units,extras);
 applyScope(papers,units,extras);
 supplementVisuals(units,extras);
 addSubjectVisuals(units,extras);
 const examBank=new Map(units.flatMap(u=>u.questions).concat(extras).map(q=>[q.id,q]));
 for(const p of papers)p.signature=createHash('sha256').update(JSON.stringify({entries:p.entries,questions:p.entries.map(e=>examBank.get(e.questionId))})).digest('hex').slice(0,20);
 fs.writeFileSync('dist/mock-content.js','window.REVIEW_EXAMS='+JSON.stringify(papers,null,2)+';\nwindow.REVIEW_EXAM_ITEMS='+JSON.stringify(extras,null,2)+';\n');
 writeFormatPage(papers);
 writeBlueprint(papers);
 return papers;
}
