(function(root){
 'use strict';
 function select(template,bank,units,records,owner){
  const byId=new Map(bank.map(q=>[q.id,q]));
  const origin=q=>q.examOrigin||q.id;
  const identity=q=>q.unit+'|'+(q.passage||'')+'|'+q.text.replace(/^〈[^〉]+〉/,'');
  const aliases=new Map();for(const q of bank)aliases.set(q.id,identity(byId.get(origin(q))||q));
  const history=new Map(),wrongTypes=new Set(),wrongConcepts=new Set();
  for(const e of [...records].filter(e=>e.learner===owner&&e.kind==='answer').sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)))){
   const q=byId.get(e.questionId),unit=q?.unit??Number(String(e.questionId).match(/^u(\d+)-/)?.[1]);
   const k=aliases.get(e.questionId)||e.questionId,prior=history.get(k);
   history.set(k,{wrong:prior?.wrong||e.correct===false,lastWrong:e.correct===false});
   if(e.correct===false){wrongTypes.add(unit+'|'+e.questionType);if(q)wrongConcepts.add(unit+'|'+q.concept);}
  }
  const rank=q=>{const h=history.get(identity(q));return h?.lastWrong?0:h?.wrong?1:!h?2:wrongConcepts.has(q.unit+'|'+q.concept)?3:wrongTypes.has(q.unit+'|'+q.type)?4:5;};
  const ab=new Set(bank.filter(q=>q.variant==='A'||q.variant==='B').map(identity));
  const compare=(a,b)=>rank(a)-rank(b)||Number(ab.has(identity(a)))-Number(ab.has(identity(b)))||a.id.localeCompare(b.id);
  const pool=[...new Map(bank.filter(q=>units[q.unit]?.active!==false&&units[q.unit]?.grade===template.grade&&units[q.unit]?.subject===template.subject&&['single','numeric','text','boolean'].includes(q.type)).map(q=>[identity(q),byId.get(origin(q))||q])).values()];
  const taken=new Set(),families=new Set(),entries=[],reasons={wrong:0,unseen:0,related:0,review:0};
  const take=(q,section)=>{taken.add(identity(q));if(q.family)families.add(q.family);entries.push({questionId:q.id,points:section.pointsEach,section:section.id});const r=rank(q);reasons[r<2?'wrong':r===2?'unseen':r<5?'related':'review']++;};
  for(const section of template.sections){
   if(section.id==='reading'){
    const groups=[...new Set(pool.map(q=>q.passageId).filter(Boolean))].map(id=>pool.filter(q=>q.passageId===id).sort((a,b)=>a.readingOrder-b.readingOrder)).filter(g=>g.length===5&&new Set(g.map(q=>q.readingOrder)).size===5);
    for(const u of units.filter(u=>u.active!==false&&u.grade===template.grade&&u.subject===template.subject)){
     const candidates=groups.filter(g=>g[0].unit===u.id).sort((a,b)=>a.reduce((n,q)=>n+rank(q),0)-b.reduce((n,q)=>n+rank(q),0)||a[0].id.localeCompare(b[0].id));
     if(candidates.length<2)throw Error('完整閱讀題組不足，請家長協助。');
     candidates.slice(0,2).forEach(g=>g.forEach(q=>take(q,section)));
    }
   }else for(const slot of section.entries){
    const old=byId.get(slot.questionId),candidates=pool.filter(q=>q.unit===old.unit&&!q.passageId&&q.type===old.type&&!taken.has(identity(q))&&(!q.family||!families.has(q.family))).sort(compare);
    if(!candidates.length)throw Error('符合範圍的題目不足，請家長協助。');take(candidates[0],section);
   }
  }
  const paper={...template,entries,selection:reasons,sections:template.sections.map(s=>({...s,entries:entries.filter(e=>e.section===s.id)}))};
  paper.coverage=[...new Set(entries.map(e=>byId.get(e.questionId).unit))].map(unit=>({unit,name:units[unit].name,count:entries.filter(e=>byId.get(e.questionId).unit===unit).length,points:entries.filter(e=>byId.get(e.questionId).unit===unit).reduce((n,e)=>n+e.points,0)}));
  return paper;
 }
 function restore(template,d){return {...template,selection:d.selection,entries:d.questions.map(q=>({questionId:q.id,section:q.section,points:q.points})),sections:template.sections.map(s=>({...s,entries:d.questions.filter(q=>q.section===s.id).map(q=>({questionId:q.id,section:q.section,points:q.points}))})),coverage:d.coverage||template.coverage};}
 const api={select,restore};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MockC=api;
})(globalThis);
