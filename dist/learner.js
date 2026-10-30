(function(){
 'use strict';
 const ACTIVE='little-study-active-v3',INDEX='little-study-names-v3',QUEUE='little-study-outbox-v3';
 const config=window.LEARNING_CONFIG||{},safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 const store=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
 const uuid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
 const normalize=name=>String(name||'').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,20);
 let name=normalize(safeRead(ACTIVE,'')),sending=false,receiptNo=0;
 const listeners=[];
 function notify(){listeners.forEach(fn=>fn());renderBadge();}
 function key(){return 'little-study-v3:'+encodeURIComponent(name);}
 function names(){return safeRead(INDEX,[]).filter(n=>typeof n==='string'&&normalize(n));}
 function setName(value){const next=normalize(value);if(!next)return false;name=next;store(ACTIVE,name);store(INDEX,[...new Set([...names(),name])]);notify();return true;}
 function outbox(){return safeRead(QUEUE,[]).filter(e=>e&&typeof e.id==='string');}
 function status(){return {configured:/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(config.gasUrl||''),pending:outbox().filter(e=>e.learner===name).length,online:navigator.onLine};}
 function renderBadge(){const el=document.querySelector('#learner-name'),sync=document.querySelector('#sync-status');if(el)el.textContent=name||'選擇學習者';if(sync){const s=status();sync.textContent=!s.configured?'紀錄保存在這台裝置':!s.online?'離線保存，連線後補傳':s.pending?`待同步 ${s.pending} 筆`:'紀錄已同步';}}
 function receipt(id){return new Promise((resolve,reject)=>{const cb='studyReceipt_'+Date.now()+'_'+(++receiptNo),script=document.createElement('script');const cleanup=()=>{clearTimeout(timer);delete window[cb];script.remove();};const timer=setTimeout(()=>{cleanup();reject(Error('回執逾時'));},15000);window[cb]=result=>{cleanup();resolve(result);};script.onerror=()=>{cleanup();reject(Error('無法讀取回執'));};const url=new URL(config.gasUrl);url.searchParams.set('action','receipt');url.searchParams.set('id',id);url.searchParams.set('callback',cb);script.src=url.href;document.head.appendChild(script);});}
 async function flush(){if(sending||!status().configured||!navigator.onLine)return;sending=true;try{while(true){const rows=outbox().slice(0,10);if(!rows.length)break;const requestId=uuid();await fetch(config.gasUrl,{method:'POST',mode:'no-cors',credentials:'omit',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({schemaVersion:1,requestId,events:rows})});let ack=null;for(let i=0;i<3;i++){ack=await receipt(requestId);if(ack.ok)break;await new Promise(r=>setTimeout(r,1000*(i+1)));}if(!ack?.ok)throw Error('尚未收到寫入回執');const accepted=new Set(ack.acceptedIds||[]);if(!rows.every(e=>accepted.has(e.id)))throw Error('部分紀錄尚未確認');store(QUEUE,outbox().filter(e=>!accepted.has(e.id)));notify();}}catch{renderBadge();}finally{sending=false;}}
 function log(event){if(!name)return;const record={...event,id:uuid(),learner:name,createdAt:new Date().toISOString(),appVersion:config.appVersion||'3.0.0'};const historyKey=key()+':records';const history=safeRead(historyKey,[]);if(!store(historyKey,[...history,record]))alert('裝置儲存空間不足，請請家長協助匯出紀錄。');const queue=outbox();if(!store(QUEUE,[...queue,record]))alert('這筆紀錄暫時無法排入同步，請保持頁面並請家長協助。');notify();flush();}
 function showName(){const dialog=document.querySelector('#name-dialog'),input=document.querySelector('#student-name'),form=document.querySelector('#name-form');input.value=name;document.querySelector('#name-help').textContent=name?'更換名字後，會切換到那位小朋友自己的學習紀錄。':'名字或暱稱就好，例如「晴晴」。';const recent=document.querySelector('#recent-learners');recent.replaceChildren();names().forEach(n=>{const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=n;b.onclick=()=>{input.value=n;form.requestSubmit();};recent.appendChild(b);});dialog.showModal();input.focus();form.onsubmit=e=>{e.preventDefault();if(!setName(input.value)){input.setCustomValidity('請先輸入名字或暱稱。');input.reportValidity();return;}input.setCustomValidity('');dialog.close();if(window.onLearnerChanged)window.onLearnerChanged();flush();};input.oninput=()=>input.setCustomValidity('');dialog.oncancel=e=>{if(!name)e.preventDefault();};}
 document.querySelector('#change-learner').onclick=()=>{if(window.studyInProgress&&!confirm('這份練習還沒完成。已作答的紀錄會保留，要切換小朋友嗎？'))return;showName();};
 document.querySelector('#sync-now').onclick=flush;
 window.addEventListener('online',flush);setInterval(flush,60000);
 window.Learner={getName:()=>name,key,names,showName,log,status,flush,uuid,onChange:fn=>listeners.push(fn),records:()=>safeRead(key()+':records',[])};
 renderBadge();if(!name)showName();else flush();
})();
