import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {statements,language,english} from './exam-items-v8.mjs';

export default function redesign(papers,units,extras){
 const bank=new Map(units.flatMap(u=>u.questions).concat(extras).map(q=>[q.id,q]));
 function put(unit,n,type,text,answer,explanation,options,visual){
  const q={id:`u${unit}-t${n}-${type==='boolean'?'tf':'a'}`,unit,topic:n-1,type,text,answer,explanation,concept:units[unit].name,sourceIds:units[unit].questions[0].sourceIds,sourceType:'參考公開卷題型；內容依仁美115學年度版本與考試範圍改編',...(options?{options}:{}),...(visual?{visual}:{})};
  extras.push(q);bank.set(q.id,q);return q.id;
 }
 const tf={};for(const [unit,rows]of Object.entries(statements))tf[unit]=rows.map(([t,a,e],i)=>put(+unit,80+i,'boolean',t,a?0:1,e,['○ 正確','× 錯誤']));
 const langIds={},engIds={};
 for(const grade of [3,5]){
  for(const [data,result,pair]of [[language,langIds,grade===3?[13,14]:[4,5]],[english,engIds,grade===3?[15,16]:[6,7]]]){
   result[grade]={words:data[grade].words.map(([t,a,e],i)=>put(pair[i<3?0:1],85+i,'text',t,a,e||`依句意應填 ${a}。`)),sentences:data[grade].sentences.map(([t,o,a,e],i)=>put(pair[i<2?0:1],90+i,'single',t,a,e||`依人物、句意與提問，應選「${o[a]}」。`,o))};
  }
 }
 const aq=bank.get('u21-t44-n1');
 const angleText=put(21,85,'text','甲為直角檢查片。依圖，乙應填「銳角」、「直角」或「鈍角」？',aq.options[aq.answer],aq.explanation,undefined,aq.visual||units[21].topicVisuals?.[aq.topic]);
 const math={
  3:[['u17-t46-n1','u17-t01-n2','u17-t43-n1','u17-t41-n1','u17-t44-n1'],['u18-t46-n1','u18-t01-n1','u18-t45-n1','u18-t41-n1','u18-t42-n1'],['u19-t45-n1','u19-t01-n2','u19-t43-n1','u19-t42-n1','u19-t44-n1'],['u20-t46-n1','u20-t01-n2','u20-t47-n1','u20-t41-n1','u20-t42-n1'],['u21-t43-n1','u21-t48-n1',angleText,'u21-t41-n1','u21-t47-n1']],
  5:[['u8-t45-n1','u8-t01-n1','u8-t42-n1','u8-t43-n1','u8-t46-n1'],['u9-t43-n1','u9-t01-n5','u9-t46-n1','u9-t41-n1','u9-t45-n1'],['u10-t58-n1','u10-t41-n1','u10-t56-n1','u10-t53-n1','u10-t60-n1'],['u11-t45-n1','u11-t01-n1','u11-t01-n2','u11-t42-n1','u11-t43-n1'],['u12-t44-n1','u12-t01-n1','u12-t01-n4','u12-t43-n1','u12-t46-n1']]
 };
 const concepts={0:['u0-t02-a','u0-t05-a','u0-t10-b','u0-t18-a','u0-t19-a'],1:['u1-t02-b','u1-t04-b','u1-t09-b','u1-t14-b','u1-t20-b'],2:['u2-t07-b','u2-t09-a','u2-t12-b','u2-t16-b','u2-t18-b'],3:['u3-t05-a','u3-t09-b','u3-t10-b','u3-t11-a','u3-t18-b'],22:['u22-t02-b','u22-t04-b','u22-t12-b','u22-t17-a','u22-t18-b'],23:['u23-t03-a','u23-t05-a','u23-t07-a','u23-t14-a','u23-t20-b'],24:['u24-t03-a','u24-t04-a','u24-t07-a','u24-t09-a','u24-t20-b'],25:['u25-t04-a','u25-t08-a','u25-t09-a','u25-t13-a','u25-t18-a']};
 const section=(id,title,ids,points,instructions)=>({id,title,instructions,entries:ids.map(questionId=>({questionId,points,section:id}))});
 for(const p of papers){
  const reading=p.entries.filter(e=>bank.get(e.questionId).passageId).map(e=>e.questionId);
  if(['國語','英語'].includes(p.subject)){
   const ids=p.subject==='國語'?langIds[p.grade]:engIds[p.grade];
   p.sections=[section('words',p.subject==='國語'?'一、語詞訂正':'一、字詞填寫',ids.words,2,p.subject==='國語'?'依句意訂正錯字，每格只填一個字。':'依句意填入英文單字，大小寫不影響判分。'),section('sentences',p.subject==='國語'?'二、語句運用':'二、對話與句型',ids.sentences,2,'選擇最合適的答案。'),section('reading','三、閱讀理解',reading,4,'先讀完整篇文章與圖表，再回答同篇題目。')];
  }else if(p.subject==='數學'){
   const rows=math[p.grade];p.sections=[section('choice','一、選擇題',rows.map(r=>r[0]),2,'選擇最合適的答案。'),section('fill','二、計算與看圖填答',rows.flatMap(r=>r.slice(1,3)),3,'計算後填數字；角的分類題填要求的名稱。'),section('application','三、應用與圖形推理',rows.flatMap(r=>r.slice(3)),6,'可用紙筆計算，依題目填數字或選答案。本卷依最終答案計分，不評紙筆過程。')];
  }else{
   const pair=units.filter(u=>u.grade===p.grade&&u.subject===p.subject).map(u=>u.id),groups=[...new Set(reading.map(id=>bank.get(id).passageId))];
   const full=groups.flatMap(id=>units.flatMap(u=>u.questions).filter(q=>q.passageId===id).sort((a,b)=>a.readingOrder-b.readingOrder).map(q=>q.id));
   p.sections=[section('truefalse','一、是非題',pair.flatMap(u=>tf[u]),2,'正確選 ○，錯誤選 ×。'),section('choice','二、選擇題',pair.flatMap(u=>concepts[u]),2,'依情境選出最合適的答案。'),section('reading','三、圖文閱讀與資料判讀',full,3,'閱讀文章、實驗紀錄或圖表，再回答問題。')];
  }
  p.sections.forEach(s=>{s.count=s.entries.length;s.points=s.entries.reduce((n,e)=>n+e.points,0);s.pointsEach=s.entries[0].points;});
  p.entries=p.sections.flatMap(s=>s.entries);p.count=p.entries.length;p.formatVersion=9;
  const qs=p.entries.map(e=>{const q=bank.get(e.questionId);if(!q)throw Error('缺少考題 '+e.questionId);if(units[q.unit].grade!==p.grade||units[q.unit].subject!==p.subject)throw Error('年級科目不符');return q;});
  if(new Set(qs.map(q=>q.id)).size!==p.count||p.entries.reduce((n,e)=>n+e.points,0)!==100)throw Error('配分錯誤');
  p.coverage=units.filter(u=>u.grade===p.grade&&u.subject===p.subject).map(u=>({unit:u.id,name:u.name,count:qs.filter(q=>q.unit===u.id).length,points:p.entries.filter(e=>bank.get(e.questionId).unit===u.id).reduce((n,e)=>n+e.points,0)}));
  if(p.coverage.some(c=>!c.count))throw Error('遺漏單元');
  p.readingCount=qs.filter(q=>q.passageId).length;
  p.signature=createHash('sha256').update(JSON.stringify({entries:p.entries,questions:qs})).digest('hex').slice(0,20);
 }
 fs.writeFileSync('dist/exam-formats.html',page(papers));
}
export function writeBlueprint(papers){fs.writeFileSync('模擬考命題藍圖.md','# 三上、五上期中模擬考：題型與配分\n\n版本 9.0.0。十份固定 A 卷，內容依仁美115學年度選用版本與家長提供範圍；公開原卷只參考題型、分大題與配分，不套用其他學期課文。每卷100分，整卷完成後送出才批改。配圖採白底黑線、刻度、代號及必要標註；五上含相交三角形和平行四邊形對角線推理，三上不加入角度數計算。\n\n國語、英語各30題（字詞5題×2分、語句5題×2分、閱讀20題×4分）；數學25題（選擇5題×2分、填答10題×3分、應用10題×6分）；自然、社會各40題（是非10題×2分、選擇10題×2分、圖文閱讀20題×3分）。依各小題配分計分，不另給紙筆過程分。\n\n國語延伸閱讀與語詞運用依課次主題及統整活動，不假稱逐頁課本生字抽考；英語為讀寫卷，不含聽力；三上角不考角度數，五上不加小數分數體積等範圍外運算。數學每單元5題共20分。\n\n來源與設計：[公開參考及配分表](https://amanhung.github.io/renmei-grade5-review/exam-formats.html)。另見版本核對.md、三上版本核對.md及考題參考與刪重.md。\n\n草稿依名字與考卷內容簽章隔離，新題或配分不沿用舊草稿；歷次作答紀錄保留。交卷後以每題配分加總，不以答對題數比例代替實得分。GAS會檢查配分總和100、答對題數及得分一致；保留舊版等分練習紀錄。每題秒數為整卷平均時間。\n\n'+papers.map(p=>`## ${p.title}\n\n${p.publisher}；${p.scope}。${p.count}題。\n\n${p.sections.map(s=>`- ${s.title}：${s.count}題，每題${s.pointsEach}分，共${s.points}分。`).join('\n')}\n\n${p.coverage.map(c=>`- ${c.name}：${c.count}題，共${c.points}分。`).join('\n')}\n\n題號及配分：${p.entries.map(e=>e.questionId+'（'+e.points+'分）').join('、')}。\n`).join('\n'));}
function page(papers){return '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>模擬考題型與配分</title><style>body{font-family:system-ui,"Microsoft JhengHei",sans-serif;max-width:900px;margin:auto;padding:28px;line-height:1.9;color:#294b3c}table{border-collapse:collapse;width:100%;margin:20px 0}th,td{padding:12px;border:1px solid #cbd8c8;text-align:left}a{color:#295e46}</style><h1>仁美版本內容，參考一般考卷設計</h1><p>其他學校公開卷只參考大題、題型與配分；內容依仁美115學年度版本及家長提供範圍命題。不沿用他校不同版本、學期的課文與單元。每卷100分，全卷完成後才批改。</p><p>配圖採白底黑線、清楚刻度、角度記號與部位代號。五上加入相交三角形及平行四邊形對角線推理；三上角只做辨認與比較，不考角度數。</p>'+papers.map(p=>'<h2>'+p.title+'</h2><p>'+p.publisher+'；'+p.scope+'</p><table><tr><th>大題</th><th>題數</th><th>每題／格</th><th>合計</th></tr>'+p.sections.map(s=>'<tr><td>'+s.title+'</td><td>'+s.count+'</td><td>'+s.pointsEach+'分</td><td>'+s.points+'分</td></tr>').join('')+'</table>').join('')+'<h2>公開原卷題型參考（2026-10-31查閱）</h2><ul><li><a href="https://www.csps.tp.edu.tw/uploads/1612421481241XOvCQE8s.pdf">中山國小五上數學期中卷</a>：選擇、填充、計算、應用分大題配分。</li><li><a href="https://www.myps.hlc.edu.tw/modules/tad_uploader/index.php?cat_sn=327&cfsn=3566&fn=花蓮縣花蓮市明義國民小學五年級國語期中評量試卷.pdf&op=dlfile">明義國小107五上國語期中卷</a>：語詞訂正、句意、排序與閱讀。</li><li><a href="https://wlps.kl.edu.tw/docs/file/43/WW2_midterm_題目卷.pdf">武崙國小112三下英語期中卷</a>：字詞、看圖、回應與填空；只參考形式，本網站仍考姓名年齡或飲料水果。</li><li><a href="https://www.yap.kh.edu.tw/upload/33/104_44061/113下三自然期中評量試卷.pdf">永安國小113三下自然期中卷</a>：是非、選擇、題組與逐格判斷。</li><li><a href="https://oldsmps.kl.edu.tw/books/file/162/社.pdf">深美國小113五上社會期中卷</a>：是非、選擇、地圖與情境。</li><li><a href="https://www.yap.kh.edu.tw/upload/33/104_44061/113五上自然期中評量試卷.pdf">永安國小113五上自然期中卷</a>：參考植物部位代號、實驗裝置與黑白線圖的呈現；只取圖面設計，不加入本次範圍外內容。</li></ul><p>閱讀為課次主題延伸文本，非課文原文。語詞題不假稱出版社逐頁生字抽考；英語為讀寫卷，不含聽力。難度以基礎及應用為主，尚未經學生施測校準。</p><a href="?view=exams">回到模擬考卷</a></html>';}
