'use strict';
let activeGrade=5;
function gradeLabel(grade){return Number(grade)===3?'三上':'五上';}
function loadGrade(initial=false){try{const parameter=new URL(location.href).searchParams.get('grade'),stored=localStorage.getItem(Learner.key()+':grade');if(initial&&['3','5'].includes(parameter))activeGrade=Number(parameter);else if(['3','5'].includes(stored))activeGrade=Number(stored);}catch{}}
function selectedUnits(){return units.filter(u=>u.grade===activeGrade&&u.active!==false);}
function gradeMistakeCount(){const ids=new Set([...selectedUnits().flatMap(u=>u.questions.map(q=>q.id)),...(typeof window!=='undefined'?window.REVIEW_EXAM_ITEMS||[]:[]).filter(q=>units[q.unit].active!==false&&units[q.unit].grade===activeGrade).map(q=>q.id)]);return saved.mistakes.filter(id=>ids.has(id)).length;}
function gradeOfRecord(e){return Number(e.grade)===3||String(e.unitName||'').startsWith('三上｜')?3:5;}
function examScope(){return activeGrade===3?'期中考：11/5（四）、11/6（五）。<br>國語第 1 課～統整活動二；數學第 1～4 單元；社會第 1～2 單元；英文 Unit 1、Unit 2、Review 1；自然 Unit 1、Unit 2。':'11/5：國語第 1～6 課、學習地圖一、二；自然第 1～2 單元；英語 Get Ready、Unit 1～2、Review 1。<br>11/6：數學第 1～5 單元、學習加油讚（一）；社會第 1～2 單元。';}
function renderGradePicker(){
 try{if(Learner.getName())localStorage.setItem(Learner.key()+':grade',String(activeGrade));}catch{}
 try{const url=new URL(location.href);url.searchParams.set('grade',String(activeGrade));history.replaceState(null,'',url);}catch{}
 const picker=document.querySelector('#grade-picker');
 picker.innerHTML='<span>選擇年級</span>'+[3,5].map(g=>`<button type="button" data-grade="${g}" aria-pressed="${g===activeGrade}" class="${g===activeGrade?'selected':''}">${g===3?'三':'五'}年級上學期</button>`).join('');
 picker.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{const next=Number(b.dataset.grade);if(next===activeGrade)return;if(window.studyInProgress&&!confirm('切換年級會離開目前未完成的練習。已送出的作答與紀錄會保留，確定切換嗎？'))return;activeGrade=next;try{localStorage.setItem(Learner.key()+':grade',String(next));}catch{}filter='全部';go('home');});
 document.querySelector('.semester').innerHTML=(activeGrade===3?'三':'五')+'年級・上學期<span>依各科選用版本</span>';
 document.querySelector('.side-bottom').innerHTML='仁美國小・'+gradeLabel(activeGrade)+'複習<br><span>115 學年度</span>';
}
function figureMarkup(f){
 if(f.type==='ruler')return `<figure class="math-figure"><figcaption>直尺與紙條（每一小格是 1 毫米）</figcaption><svg viewBox="0 0 380 150" role="img" aria-label="紙條的起點與終點刻度見題目"><rect x="20" y="65" width="320" height="60" rx="4" fill="#f7edc9" stroke="#8c825c"/>${Array.from({length:41},(_,i)=>`<line x1="${20+i*8}" y1="65" x2="${20+i*8}" y2="${i%10===0?94:i%5===0?85:77}" stroke="#4b5140"/>${i%10===0?`<text x="${20+i*8}" y="115" text-anchor="middle">${i/10}</text>`:''}`).join('')}<text x="350" y="115">公分</text><rect x="${20+f.start*8}" y="35" width="${(f.end-f.start)*8}" height="18" fill="#7caa91"/><line x1="${20+f.start*8}" y1="35" x2="${20+f.start*8}" y2="65" stroke="#426737" stroke-dasharray="3 2"/><line x1="${20+f.end*8}" y1="35" x2="${20+f.end*8}" y2="65" stroke="#426737" stroke-dasharray="3 2"/></svg></figure>`;
 if(f.type==='angle'){const rad=f.opening*Math.PI/180,x=f.length*Math.cos(rad),y=-f.length*Math.sin(rad);return `<figure class="math-figure angle-figure"><figcaption>觀察標示的張開部分</figcaption><svg viewBox="0 0 300 300" role="img" aria-label="兩條邊由共同頂點伸出，弧線標出要觀察的角"><g transform="translate(150 150) rotate(${f.rotation})"><path d="M ${f.length} 0 L 0 0 L ${x} ${y}" fill="none" stroke="#426737" stroke-width="4"/><path d="M 30 0 A 30 30 0 0 0 ${30*Math.cos(rad)} ${-30*Math.sin(rad)}" fill="none" stroke="#c68855" stroke-width="3"/><circle r="4" fill="#344d3d"/></g></svg></figure>`;}
 if(f.type==='rectangles')return `<figure class="math-figure"><figcaption>${f.count} 個分開的長方形</figcaption><svg viewBox="0 0 430 205" role="img" aria-label="${f.count} 個分開的長方形">${Array.from({length:f.count},(_,i)=>`<rect x="${20+i%2*215}" y="${15+Math.floor(i/2)*100}" width="170" height="70" fill="#edf4e8" stroke="#426737" stroke-width="3"/>`).join('')}</svg></figure>`;
 return '';
}
