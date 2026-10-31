(function(root){
 'use strict';
 const E=typeof module!=='undefined'&&module.exports?require('./engine.js'):root.ReviewEngine;
 function create(paper,bank,owner,uuid,rng=Math.random){
  if(paper.entries.length!==20||paper.entries.reduce((n,e)=>n+e.points,0)!==100)throw Error('考卷配分錯誤');
  const questions=paper.entries.map(e=>{const q=bank.find(q=>q.id===e.questionId);if(!q)throw Error('找不到考題');return {...E.prepare(q,rng),points:e.points};});
  return {paperId:paper.id,signature:paper.signature,owner,sessionId:uuid(),startedAt:Date.now(),questions,answers:{},result:null,logged:false};
 }
 const missing=d=>d.questions.flatMap((q,i)=>E.ready(q,d.answers[q.id])?[]:[i]);
 function grade(d){
  if(d.result)return d.result;
  if(missing(d).length)throw Error('請先完成整份考卷');
  const rows=d.questions.map(q=>({id:q.id,correct:E.correct(q,d.answers[q.id]),points:E.correct(q,d.answers[q.id])?q.points:0}));
  return {score:rows.reduce((n,r)=>n+r.points,0),right:rows.filter(r=>r.correct).length,total:rows.length,rows,finishedAt:Date.now()};
 }
 function compatible(d,paper,owner){return !!d&&d.owner===owner&&d.paperId===paper.id&&d.signature===paper.signature&&Array.isArray(d.questions)&&d.questions.length===20&&d.questions.every((q,i)=>q.id===paper.entries[i].questionId)&&d.answers&&typeof d.answers==='object';}
 const api={create,missing,grade,compatible};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MockEngine=api;
})(globalThis);
