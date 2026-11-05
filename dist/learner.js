(function(){
 'use strict';
 const ACTIVE='little-study-active-v3',INDEX='little-study-names-v3',QUEUE='little-study-outbox-v3';
 const config=window.LEARNING_CONFIG||{},safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 const store=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
 const uuid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
 const normalize=name=>String(name||'').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,20);

 const canonical=value=>{const n=normalize(value);return ['悠晴','晴晴','洪悠晴'].includes(n)?'悠晴':n==='言旭'?'言旭':'測試';};
 let testMode=new URL(location.href).searchParams.get('test')==='1';
 const requestedGrade=new URL(location.href).searchParams.get('grade');
 let learnerGrade=['3','5'].includes(requestedGrade)?Number(requestedGrade):Number(safeRead('little-study-active-grade-v1',5));if(![3,5].includes(learnerGrade))learnerGrade=5;
 const prefix=n=>'little-study-v3:'+encodeURIComponent(n);
 function migrate(){
  const oldNames=[...new Set([...safeRead(INDEX,[]),safeRead(ACTIVE,''),'晴晴','洪悠晴'].filter(n=>typeof n==='string'&&n))];
  for(const old of oldNames){const target=canonical(old),marker='little-study-name-merged-v1:'+encodeURIComponent(old);if(old===target||safeRead(marker,false))continue;
   const source=prefix(old),dest=prefix(target),history=safeRead(source+':records',[]),existing=safeRead(dest+':records',[]),byId=new Map([...existing,...history].map(e=>[e.id,{...e,learner:target}]));
   const merged=[...byId.values()].sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));let ok=store(dest+':records',merged);
   const a=safeRead(source,null),b=safeRead(dest,{version:2,read:[],attempts:{},mistakes:[],readCards:[],draws:{}});
   if(a){const attempts={...b.attempts};for(const [id,value] of Object.entries(a.attempts||{})){const prior=attempts[id];attempts[id]=prior?{...(String(value.date)>String(prior.date)?value:prior),count:(prior.count||0)+(value.count||0),bestPct:Math.max(prior.bestPct||0,value.bestPct||0)}:value;}
    const mistakes=new Set([...(b.mistakes||[]),...(a.mistakes||[])]);merged.filter(e=>e.kind==='answer').forEach(e=>e.correct?mistakes.delete(e.questionId):mistakes.add(e.questionId));
    ok=store(dest,{...b,version:2,read:[...new Set([...(b.read||[]),...(a.read||[])])],readCards:[...new Set([...(b.readCards||[]),...(a.readCards||[])])],mistakes:[...mistakes],attempts,draws:{...(a.draws||{}),...(b.draws||{})}})&&ok;
   }
   const keys=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter(k=>k&&k.startsWith(source+':mock:'));
   for(const k of keys){const draft=safeRead(k,null);if(!draft)continue;const nextKey=dest+k.slice(source.length),prior=safeRead(nextKey,null),time=d=>d?.result?.finishedAt||d?.updatedAt||d?.startedAt||0;if(!prior||time(draft)>time(prior)){draft.owner=target;if(draft.events)draft.events=draft.events.map(e=>({...e,learner:target}));ok=store(nextKey,draft)&&ok;}}
   if(!safeRead(dest+':grade',null)&&safeRead(source+':grade',null))ok=store(dest+':grade',safeRead(source+':grade',null))&&ok;
   if(ok)store(marker,true);
  }
  store(QUEUE,safeRead(QUEUE,[]).map(e=>({...e,learner:canonical(e.learner)})));
  store(INDEX,['悠晴','言旭','測試']);
 }
 migrate();
 let name=testMode?'測試':learnerGrade===3?'言旭':'悠晴',sending=false,receiptNo=0;
 store(ACTIVE,name);

 const listeners=[];
 function notify(){listeners.forEach(fn=>fn());renderBadge();}
 function key(){return 'little-study-v3:'+encodeURIComponent(name);}
 function names(){return testMode?['測試']:['悠晴','言旭'];}
 function selectGrade(value){if(![3,5].includes(Number(value)))return false;learnerGrade=Number(value);name=testMode?'測試':learnerGrade===3?'言旭':'悠晴';store(ACTIVE,name);store('little-study-active-grade-v1',learnerGrade);store(INDEX,['悠晴','言旭','測試']);notify();syncCloud();return true;}
 function toggleTest(){if(window.studyInProgress&&!confirm('切換測試模式會離開目前練習，已作答紀錄會保留，確定切換嗎？'))return;testMode=!testMode;const url=new URL(location.href);if(testMode)url.searchParams.set('test','1');else url.searchParams.delete('test');history.replaceState(null,'',url);selectGrade(learnerGrade);if(window.onLearnerChanged)window.onLearnerChanged();flush();}
 function outbox(){return safeRead(QUEUE,[]).filter(e=>e&&typeof e.id==='string');}
 function status(){return {configured:/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(config.gasUrl||''),cloud:cloudStatus.get(name)||'loading',error:cloudError,authenticated:true,loaded:cloudLoaded.has(name),pending:outbox().filter(e=>e.learner===name).length,online:navigator.onLine};}
 function renderBadge(){const toggle=document.querySelector('#toggle-test');if(toggle){toggle.textContent=testMode?'退出測試模式':'切換成測試者';toggle.setAttribute?.('aria-pressed',String(testMode));}const el=document.querySelector('#learner-name'),sync=document.querySelector('#sync-status');if(el)el.textContent=name||'選擇學習者';if(sync){const s=status();sync.textContent=!s.configured?'紀錄保存在這台裝置':!s.online?'離線保存，可繼續作答':s.pending?`已保存在裝置，背景同步 ${s.pending} 筆` :s.cloud==='ready'?'雲端紀錄已更新':s.cloud==='error'?'可繼續作答，稍後自動同步':'可直接作答，背景更新紀錄';}}
 function receipt(id){return new Promise((resolve,reject)=>{const cb='studyReceipt_'+Date.now()+'_'+(++receiptNo),script=document.createElement('script');const cleanup=()=>{clearTimeout(timer);delete window[cb];script.remove();};const timer=setTimeout(()=>{cleanup();reject(Error('回執逾時'));},15000);window[cb]=result=>{cleanup();resolve(result);};script.onerror=()=>{cleanup();reject(Error('無法讀取回執'));};const url=new URL(config.gasUrl);url.searchParams.set('action','receipt');url.searchParams.set('id',id);url.searchParams.set('callback',cb);script.src=url.href;document.head.appendChild(script);});}
 async function flush(){if(sending||!status().configured||!navigator.onLine)return;sending=true;try{while(true){let bytes=0;const rows=[];for(const event of outbox()){const size=JSON.stringify(event).length;if(rows.length>=10||bytes+size>130000)break;rows.push(event);bytes+=size;}if(!rows.length)break;const requestId=uuid();await fetch(config.gasUrl,{method:'POST',mode:'no-cors',credentials:'omit',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({schemaVersion:1,requestId,events:rows})});let ack=null;for(let i=0;i<3;i++){ack=await receipt(requestId);if(ack.ok)break;await new Promise(r=>setTimeout(r,1000*(i+1)));}if(!ack?.ok)throw Error('尚未收到寫入回執');const accepted=new Set(ack.acceptedIds||[]);if(!rows.every(e=>accepted.has(e.id)))throw Error('部分紀錄尚未確認');store(QUEUE,outbox().filter(e=>!accepted.has(e.id)));notify();}}catch{renderBadge();}finally{sending=false;syncCloud();}}
 function log(event){if(!name)return;const record={...event,id:uuid(),learner:name,createdAt:new Date().toISOString(),appVersion:config.appVersion||'3.0.0'};const historyKey=key()+':records';const history=safeRead(historyKey,[]);if(!store(historyKey,[...history,record]))alert('裝置儲存空間不足，請請家長協助匯出紀錄。');const queue=outbox().filter(e=>event.kind!=='state'||e.kind!=='state'||e.learner!==name||e.stateKey!==event.stateKey);if(!store(QUEUE,[...queue,record]))alert('這筆紀錄暫時無法排入同步，請保持頁面並請家長協助。');notify();flush();}
 function logBatch(events){
  if(!name||!Array.isArray(events)||events.some(e=>!e.id||e.learner!==name))return false;
  const historyKey=key()+':records',history=safeRead(historyKey,[]),known=new Set(history.map(e=>e.id)),queue=outbox(),queued=new Set(queue.map(e=>e.id));
  const rows=events.map(e=>({...e,appVersion:config.appVersion||'7.0.0'}));
  if(!store(QUEUE,[...queue,...rows.filter(e=>!known.has(e.id)&&!queued.has(e.id))]))return false;
  if(!store(historyKey,[...history,...rows.filter(e=>!known.has(e.id))]))return false;
  notify();flush();return true;
 }

 let cloudError='';const cloudHistory=new Map(),cloudStatus=new Map(),cloudLoaded=new Set(),cloudBusy=new Set(),cloudCursor=new Map(),cloudListeners=[];
 function state(stateKey,stateValue,meta={}){log({kind:'state',stateKey,stateValue,sessionId:'state-'+uuid(),elapsedSeconds:0,grade:learnerGrade,unitName:(learnerGrade===3?'三上':'五上')+'｜學習狀態',...meta});}
 function cloudRequest(owner,cursor){return new Promise((resolve,reject)=>{const cb='studyParent_'+Date.now()+'_'+(++receiptNo),script=document.createElement('script'),cleanup=()=>{clearTimeout(timer);script.remove();delete window[cb];},timer=setTimeout(()=>{cleanup();reject(Error('雲端查詢逾時'));},30000);window[cb]=r=>{cleanup();r.ok&&Array.isArray(r.events)?resolve(r):reject(Error(r.error||'雲端暫時無法更新'));};script.onerror=()=>{cleanup();reject(Error('雲端連線失敗'));};const url=new URL(config.gasUrl);url.searchParams.set('action','parent');url.searchParams.set('callback',cb);url.searchParams.set('learner',owner);url.searchParams.set('cursor',cursor);if(owner==='測試')url.searchParams.set('includeTest','1');script.src=url.href;script.referrerPolicy='no-referrer';document.head.appendChild(script);});}
 async function syncCloud(){
  const owner=name;if(!status().configured||!navigator.onLine||cloudBusy.has(owner))return;cloudBusy.add(owner);cloudStatus.set(owner,'loading');renderBadge();
  try{let cursor=cloudCursor.get(owner)||2,end,rows=cloudHistory.get(owner)||[];do{const r=await cloudRequest(owner,cursor+(end?'_'+end:''));rows=window.ParentModel.merge(rows,r.events);end=r.end;const next=Number(r.next);if(next&&next<=cursor)throw Error('雲端分頁錯誤');cursor=next;}while(cursor);
   const localKey=prefix(owner)+':records',local=safeRead(localKey,[]),known=new Set(rows.map(e=>e.id)),missing=local.filter(e=>!known.has(e.id)),queued=new Set(outbox().map(e=>e.id));
   if(missing.length)store(QUEUE,[...outbox(),...missing.filter(e=>!queued.has(e.id))]);
   const merged=window.ParentModel.merge(rows,local);cloudHistory.set(owner,rows);if(store(localKey,merged))cloudCursor.set(owner,Number(end)+1);cloudStatus.set(owner,'ready');cloudLoaded.add(owner);cloudError='';
   cloudListeners.forEach(fn=>fn(owner,merged));if(missing.length&&!sending)flush();
  }catch(error){cloudError=error.message;cloudStatus.set(owner,'error');}finally{cloudBusy.delete(owner);renderBadge();}
 }
 function connectCloud(){syncCloud();}
 document.querySelector('#toggle-test').onclick=toggleTest;
 document.querySelector('#sync-now').onclick=()=>{flush();syncCloud();};
 window.addEventListener('online',()=>{flush();syncCloud();});
 window.addEventListener('pageshow',()=>{flush();syncCloud();});
 document.addEventListener?.('visibilitychange',()=>{if(!document.hidden){flush();syncCloud();}});
 setInterval(()=>{if(!document.hidden){flush();syncCloud();}},60000);
 window.Learner={getName:()=>name,key,names,selectGrade,getGrade:()=>learnerGrade,isTest:()=>testMode,log,logBatch,status,flush,uuid,onChange:fn=>listeners.push(fn),records:()=>cloudHistory.has(name)?window.ParentModel.merge(cloudHistory.get(name),safeRead(key()+':records',[])):safeRead(key()+':records',[]),state,connectCloud,syncCloud,onCloud:fn=>cloudListeners.push(fn)};
 renderBadge();flush();
})();
