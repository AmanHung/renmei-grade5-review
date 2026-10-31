'use strict';
function renderReadingSet(){
 const first=quiz.questions[quiz.index],u=units[first.unit];
 const group=quiz.questions.filter(q=>q.passageId===first.passageId);
 const groupNumber=E.readingGroups(quiz.questions.filter(q=>q.passageId)).findIndex(g=>g[0].passageId===first.passageId)+1;
 const groupCount=E.readingGroups(quiz.questions.filter(q=>q.passageId)).length;
 if(!quiz.readingDraft)quiz.readingDraft={};
 const draft=quiz.readingDraft;
 const ready=()=>group.every(q=>E.ready(q,draft[q.id]));
 const completed=quiz.results.length;
 main.innerHTML=unitHeader(u)+`<section class="quiz-panel reading-set"><div class="quiz-meta"><span>${quiz.review?'錯題題組再練':'閱讀題組'} · 第 ${groupNumber} / ${groupCount} 篇</span><span>本篇 ${group.length} 題 · 已完成 ${completed} / ${quiz.questions.length} 題</span></div><div class="progress-track"><div style="width:${completed/quiz.questions.length*100}%"></div></div><p class="set-instructions">先讀完整篇，再回答下面 ${group.length} 題。可以來回核對文章；全部選好後，一次送出本篇答案。</p><div class="reading-layout"><section class="reading-passage" id="reading-article" aria-label="本篇閱讀文章"><span class="eyebrow">READ & THINK · 原創閱讀題組</span><h2>${esc(first.passageTitle)}</h2>${first.passage.split(/\n\n/).map((p,i)=>`<p lang="${u.subject==='英語'?'en':'zh-Hant'}">${esc(p)}</p>${i===0?LearningVisuals.markup(first):''}`).join('')}<a class="text-button article-jump" href="#reading-questions">開始回答本篇 ${group.length} 題 ↓</a></section><section class="reading-questions" id="reading-questions" aria-label="本篇全部題目">${group.map((q,i)=>`<article class="reading-question" id="reading-question-${i}"><a class="article-return" href="#reading-article">回到文章 ↑</a><span class="type-badge">第 ${i+1} 題 · ${esc(q.readingSkill)}</span><h3>${esc(q.text.replace(/^〈[^〉]+〉/,'').replace(/^.*? · /,''))}</h3><div class="options" role="group" aria-label="第 ${i+1} 題答案">${q.options.map((o,j)=>`<button class="option ${draft[q.id]===j?'chosen':''} ${quiz.checked&&q.answer===j?'correct':''} ${quiz.checked&&draft[q.id]===j&&q.answer!==j?'incorrect':''}" data-reading-question="${q.id}" data-reading-option="${j}" aria-pressed="${draft[q.id]===j}" ${quiz.checked?'disabled':''}><span class="letter">${letters[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>${quiz.checked?`<div class="feedback ${E.correct(q,draft[q.id])?'':'wrong'}" role="status"><strong>${E.correct(q,draft[q.id])?'✓ 答對了':'再回文章找線索'}</strong><p>正確答案：${esc(q.options[q.answer])}</p><p>${esc(q.explanation)}</p></div>`:''}</article>`).join('')}</section></div><div class="quiz-actions"><span class="muted" id="reading-answered">${quiz.checked?`本篇答對 ${group.filter(q=>E.correct(q,draft[q.id])).length} / ${group.length} 題`:`已選 ${group.filter(q=>E.ready(q,draft[q.id])).length} / ${group.length} 題`}</span><button class="primary" id="reading-submit" ${!ready()?'disabled':''}>${quiz.checked?(quiz.index+group.length===quiz.questions.length?'看看練習成果':'閱讀下一篇 →'):`送出本篇 ${group.length} 題`}</button></div></section>`;
 document.querySelector('#back').onclick=()=>go(quiz.review?'mistakes':'home');
 main.querySelectorAll('[data-reading-question]').forEach(b=>b.onclick=()=>{
  if(quiz.checked)return;
  const id=b.dataset.readingQuestion;draft[id]=Number(b.dataset.readingOption);
  main.querySelectorAll(`[data-reading-question="${id}"]`).forEach(option=>{const chosen=Number(option.dataset.readingOption)===draft[id];option.classList.toggle('chosen',chosen);option.setAttribute('aria-pressed',String(chosen));});
  document.querySelector('#reading-submit').disabled=!ready();
  document.querySelector('#reading-answered').textContent=`已選 ${group.filter(q=>E.ready(q,draft[q.id])).length} / ${group.length} 題`;
 });
 document.querySelector('#reading-submit').onclick=()=>{
  if(!quiz.checked){
   if(!ready())return;
   const elapsed=(Date.now()-quiz.questionStartedAt)/1000;
   quiz.checked=true;
   group.forEach(q=>{const selected=draft[q.id],right=E.correct(q,selected);quiz.results.push({id:q.id,correct:right});Learner.log({kind:'answer',sessionId:quiz.sessionId,subject:u.subject,unitName:gradeLabel(u.grade)+'｜'+u.name,grade:u.grade,questionId:q.id,questionType:q.type,question:q.passageTitle+'\n'+q.passage+'\n'+LearningVisuals.logText(q)+q.text,selected:selectionText(q,selected),expected:selectionText(q,q.answer),correct:right,elapsedSeconds:elapsed/group.length});if(!right&&!saved.mistakes.includes(q.id))saved.mistakes.push(q.id);if(right)saved.mistakes=saved.mistakes.filter(id=>id!==q.id);});
   persist();updateCount();renderReadingSet();
   document.querySelector('#reading-questions').scrollIntoView({behavior:'instant',block:'start'});
  }else if(quiz.index+group.length===quiz.questions.length)finish();
  else{quiz.index+=group.length;quiz.checked=false;quiz.selected=initialSelection(quiz.questions[quiz.index]);quiz.questionStartedAt=Date.now();renderQuiz();focusMain();}
 };
}
