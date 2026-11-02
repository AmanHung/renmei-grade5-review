const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('./dist/parent-model.js');
const e=(id,correct,createdAt)=>({id,learner:'晴晴',kind:'answer',questionId:'u0-t01-a',correct,createdAt,selected:['A'],expected:['B'],sessionId:'test-session-0001'});
const a=e('event-1',false,'2026-11-01T01:00:00Z'),b=e('event-2',true,'2026-11-01T02:00:00Z'),c=e('event-3',false,'2026-11-01T03:00:00Z');
assert.equal(M.merge([a,b],[a]).length,2);assert.equal(M.summary(M.merge([b,a])).open.length,0);assert.equal(M.summary(M.merge([a,b,c])).open.length,1);assert.equal(M.summary(M.merge([a,b,c])).wrong[0].count,2);assert.equal(M.summary([a,b]).accuracy,50);assert.equal(M.summary([a,b]).days,1);assert.equal(M.summary([]).accuracy,null);
const headers=['接收時間（臺北）','小朋友名字','紀錄種類','練習編號','科目','單元','題號','題型','題目','作答內容','正確答案','是否答對','分數','答對題數','總題數','作答秒數','紀錄編號','裝置作答時間','網站版本'];
const row=['','晴晴','逐題作答','test-session-0001','自然','三上｜植物','u13-t01-a','single','有逗號,與換行\n和"引號"',JSON.stringify(['甲,乙']),JSON.stringify(['丙']),'待複習','','','','3','event-1','2026-11-01T01:00:00Z','12'];
const encode=rows=>'\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
const imported=M.fromCSV(encode([headers,row]));assert.equal(imported[0].question,row[8]);assert.deepEqual(imported[0].selected,['甲,乙']);assert.equal(imported[0].correct,false);assert.equal(M.grade(imported[0],[]),3);assert.throws(()=>M.fromCSV('wrong,headers\n1,2'));assert.throws(()=>M.csv('"unfinished'));assert.equal(M.merge([a],imported).length,1);
let reads=0;const props=new Map([['STUDY_PARENT_TOKEN','x'.repeat(32)],['STUDY_SPREADSHEET_ID','book']]),sheet={getLastRow:()=>502,getRange:(start,col,count)=>({getValues:()=>{reads++;return Array.from({length:count},(_,i)=>{const r=row.slice();r[16]='row-'+(start+i);return r;});}})};
const ctx={Number,Date,JSON,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet})},ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'js'},createTextOutput:text=>({text,setMimeType(){return this;}})}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('gas/Code.gs','utf8'),ctx);
const query=p=>ctx.doGet({parameter:{action:'parent',callback:'studyParent_123_1',...p}}).text;
assert.ok(query({token:'wrong'}).includes('"ok":false'));assert.equal(reads,0,'未授權不得讀取資料');assert.ok(query({token:'x'.repeat(31)+'y'}).includes('"ok":false'));assert.equal(reads,0);
assert.ok(query({token:'x'.repeat(32),callback:'evil()'}).includes('"ok":false'));assert.equal(reads,0);
const parse=t=>JSON.parse(t.slice(t.indexOf('(')+1,-2));let result=parse(query({token:'x'.repeat(32),cursor:'2'}));assert.equal(result.events.length,250);assert.equal(result.next,252);assert.equal(result.end,502);assert.equal(result.events[0].correct,false);assert.equal(result.events[0].question,row[8]);result=parse(query({token:'x'.repeat(32),cursor:'502_502'}));assert.equal(result.events.length,1);assert.equal(result.next,0);assert.ok(query({token:'x'.repeat(32),cursor:'0'}).includes('"ok":false'));assert.ok(query({token:'x'.repeat(32),cursor:'2_9999'}).includes('"ok":false'));
props.delete('STUDY_PARENT_TOKEN');assert.ok(query({token:'x'.repeat(32)}).includes('"ok":false'));
// Shared family password is verified only by the server; leading zeroes stay strings.
const digest=s=>require('node:crypto').createHash('sha256').update(s).digest('hex');
ctx.Utilities={DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,s)=>[...require('node:crypto').createHash('sha256').update(s).digest()]};
props.set('STUDY_PARENT_PASSWORD_HASH',digest('0123'));
assert.equal(parse(query({token:'0123',cursor:'502_502'})).events.length,1);
const beforeDenied=reads;assert.equal(parse(query({token:'123'})).ok,false);assert.equal(parse(query({token:'9999'})).ok,false);assert.equal(reads,beforeDenied);
props.set('STUDY_PARENT_TOKEN','x'.repeat(32));assert.equal(parse(query({token:'x'.repeat(32)})).ok,false,'設定家長密碼後停用舊金鑰');
props.delete('STUDY_PARENT_PASSWORD_HASH');props.delete('STUDY_PARENT_TOKEN');
// Smoke-render the empty page and a populated report without a browser or real child data.
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='#period'?'0':'',innerHTML:'',textContent:'',querySelectorAll:()=>[],addEventListener(){},insertAdjacentHTML(){},showModal(){}});return nodes.get(id);};
const browser={window:{REVIEW_UNITS:[],REVIEW_EXAM_ITEMS:[],addEventListener(){}},ParentModel:M,document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}},setInterval(){},localStorage:{getItem:()=>null},console,Date,Map,Set,URL};vm.createContext(browser);vm.runInContext(fs.readFileSync('dist/parent.js','utf8'),browser);assert.ok(node('#report').innerHTML.includes('目前篩選條件下沒有作答紀錄'));
browser.localStorage.getItem=k=>JSON.stringify(k==='little-study-names-v3'?['晴晴']:[a,b,c,{...a,id:'summary-1',kind:'session',right:1,total:3,score:33}]);node('#child').value='晴晴';node('#refresh').onclick();assert.ok(node('#report').innerHTML.includes('各單元複習進度'));assert.ok(node('#wrong-list').innerHTML.includes('待複習'));assert.ok(node('#sessions').innerHTML.includes('33 分'));
console.log('家長後台通過：CSV 引號換行、紀錄去重、錯題狀態、正確率、空白與有資料畫面、家長查詢授權及快照分頁。');

(async()=>{
 const store=new Map([['little-study-parent-connection-v1',JSON.stringify({token:'x'.repeat(32)})]]),nodes=new Map(),events={},timers=[];let calls=0,reply;
 const node=k=>{if(!nodes.has(k))nodes.set(k,{value:k==='#period'?'0':'晴晴',innerHTML:'',querySelectorAll:()=>[],addEventListener(){},insertAdjacentHTML(){},showModal(){}});return nodes.get(k);};
 const w={REVIEW_UNITS:[],REVIEW_EXAM_ITEMS:[],addEventListener:(k,fn)=>events[k]=fn};
 const d={hidden:false,querySelector:node,querySelectorAll:()=>[],addEventListener:(k,fn)=>events[k]=fn,createElement:()=>({remove(){}}),head:{appendChild(script){calls++;const cb=new URL(script.src).searchParams.get('callback');reply=()=>w[cb]({ok:true,events:[a,b],end:3,next:0});}}};
 const ctx={window:w,document:d,ParentModel:M,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},setInterval:fn=>timers.push(fn),setTimeout:()=>1,clearTimeout(){},Date,URL,Map,Set};w.LEARNING_CONFIG={gasUrl:'https://script.google.com/macros/s/test/exec'};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/parent.js','utf8'),ctx);
 assert.equal(calls,1,'開啟後台應自動讀取已記住的連線');reply();await new Promise(r=>setImmediate(r));assert.ok(node('#status').textContent.includes('雲端 2 筆'));assert.ok(node('#status').textContent.includes('每 60 秒自動更新'));
 timers[0]();assert.equal(calls,2,'定時自動更新');timers[0]();assert.equal(calls,2,'同步進行中不可重複送出');reply();await new Promise(r=>setImmediate(r));
 node('#refresh').onclick();assert.equal(calls,3,'更新按鈕須重新讀取雲端');node('#disconnect').onclick();assert.equal(store.has('little-study-parent-connection-v1'),false);reply();await new Promise(r=>setImmediate(r));assert.ok(node('#status').textContent.includes('雲端 0 筆'),'中斷後不可被舊請求填回資料');timers[0]();assert.equal(calls,3);
 console.log('自動連線通過：開啟即讀取、定時更新、防重複連線、手動刷新及中斷後取消舊結果。');
})().catch(e=>{console.error(e);process.exitCode=1;});
