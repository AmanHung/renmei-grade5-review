const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const logs=[],receipts=[],cache=new Map(),props=new Map();let held=false;
const sheet={getLastRow:()=>logs.length+1,getRange:(r,c,n,w)=>({getValues:()=>logs.map(row=>[row[16]]),setValues:rows=>logs.push(...rows)})};
const receiptSheet={appendRow:row=>receipts.push(row)};
const book={getSheetByName:name=>name==='作答紀錄'?sheet:receiptSheet};
const context={console,Number,Date,JSON,ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'js'},createTextOutput:text=>({text,setMimeType(){return this;}})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})},SpreadsheetApp:{openById:()=>book,flush(){}},LockService:{getScriptLock:()=>({waitLock(){held=true;},hasLock:()=>held,releaseLock(){held=false;}})},CacheService:{getScriptCache:()=>({put:(k,v)=>cache.set(k,v),get:k=>cache.get(k)})},Utilities:{formatDate:()=> '2026/10/30 20:00:00'}};
props.set('STUDY_SPREADSHEET_ID','test-book');vm.createContext(context);vm.runInContext(fs.readFileSync('gas/Code.gs','utf8'),context);
const event={id:'event-test-000001',learner:'測試學生',sessionId:'session-test-0001',kind:'answer',subject:'自然',unitName:'動物世界',questionId:'u0-t01-a',questionType:'single',question:'測試題目',selected:['測試選項'],expected:['測試答案'],correct:false,elapsedSeconds:3,createdAt:'2026-10-30T12:00:00Z',appVersion:'test'};
const payload={schemaVersion:1,requestId:'request-test-001',events:[event]};
const post=p=>JSON.parse(context.doPost({postData:{contents:JSON.stringify(p)}}).text);
assert.equal(post(payload).ok,true);assert.equal(logs.length,1);assert.equal(logs[0][1],'測試學生');assert.equal(logs[0][11],'待複習');
assert.equal(post(payload).ok,true);assert.equal(logs.length,1,'重送不可產生重複作答');
const receipt=JSON.parse(context.doGet({parameter:{action:'receipt',id:payload.requestId}}).text);assert.equal(receipt.ok,true);assert.deepEqual(receipt.acceptedIds,[event.id]);assert.ok(!JSON.stringify(receipt).includes('測試學生'),'回執不公開名字');
assert.equal(context.safeCell_('=IMPORTXML("x")').startsWith("'"),true,'必須阻擋公式注入');
assert.equal(post({...payload,requestId:'request-invalid-1',events:[{...event,id:'event-invalid-0001',learner:''}]}).ok,false);assert.equal(logs.length,1);
const summary={...event,id:'event-summary-001',kind:'session',right:9,total:10,score:90};assert.equal(post({...payload,requestId:'request-summary-1',events:[summary]}).ok,true);assert.equal(logs.length,2);assert.equal(logs[1][12],'90');
const invalidSummary={...summary,id:'event-invalid-002',score:100};assert.equal(post({...payload,requestId:'request-invalid-2',events:[invalidSummary]}).ok,false);assert.equal(logs.length,2);
const jsonp=context.doGet({parameter:{action:'receipt',id:payload.requestId,callback:'studyReceipt_123_1'}}).text;assert.ok(jsonp.startsWith('studyReceipt_123_1('));
assert.equal(held,false);console.log('GAS 檢查通過：逐題紀錄、成績、去重、回執、無公開姓名、資料驗證與公式防護。');

for(const [questionId,questionType,subject] of [['u4-t01-r1','single','國語'],['u7-t20-r5','single','英語'],['u12-t20-n5','numeric','數學']]){const e={...event,id:'event-new-'+questionId,questionId,questionType,subject,selected:['２０'],expected:['20'],correct:true};assert.equal(post({...payload,requestId:'request-new-'+questionId,events:[e]}).ok,true);assert.equal(logs.at(-1)[4],subject);assert.equal(logs.at(-1)[7],questionType);assert.equal(logs.at(-1)[9],'["２０"]');}
assert.equal(post({...payload,events:[{...event,questionId:'u12-t20-x5',id:'event-badtype-001'}]}).ok,false);
console.log('新增國語、英語、數學題號與數字填答紀錄通過。');

const examContext={window:{}};vm.createContext(examContext);vm.runInContext(fs.readFileSync('dist/content.js','utf8'),examContext);vm.runInContext(fs.readFileSync('dist/mock-content.js','utf8'),examContext);
for(const paper of examContext.window.REVIEW_EXAMS){
 const bank=examContext.window.REVIEW_UNITS.flatMap(u=>u.questions).concat(examContext.window.REVIEW_EXAM_ITEMS);
 const rows=paper.entries.map((item,i)=>{const q=bank.find(q=>q.id===item.questionId);return {...event,id:`exam-${paper.id}-answer-${i}`,sessionId:`session-${paper.id}-mock`,grade:paper.grade,subject:paper.subject,unitName:`${paper.grade}上｜${paper.subject}期中模擬考 A 卷`,questionId:q.id,questionType:q.type,question:(q.passage||'')+'\n'+q.text,selected:[String(q.answer)],expected:[String(q.answer)],correct:i!==0};});
 rows.push({...event,id:`exam-${paper.id}-summary`,sessionId:`session-${paper.id}-mock`,grade:paper.grade,subject:paper.subject,unitName:`${paper.grade}上｜${paper.subject}期中模擬考 A 卷`,kind:'session',right:19,total:20,score:95});
 const before=logs.length;
 for(let offset=0;offset<rows.length;offset+=10){const data={...payload,requestId:`request-${paper.id}-${offset}`,events:rows.slice(offset,offset+10)};assert.equal(post(data).ok,true);assert.equal(post(data).ok,true);}
 assert.equal(logs.length,before+21);assert.equal(logs.at(-1)[12],'95');
}
console.log('10 份模擬考的 210 筆資料，分批寫入、100 分制總成績與重送去重通過。');

const grade3={...event,id:'event-grade3-0001',grade:3,subject:'數學',unitName:'三上｜毫米',questionId:'u19-t20-n5',questionType:'numeric',correct:true,selected:['12'],expected:['12']};assert.equal(post({...payload,requestId:'request-grade3-01',events:[grade3]}).ok,true);assert.equal(logs.at(-1)[5],'三上｜毫米');const grade3Social={...grade3,id:'event-grade3-0002',subject:'社會',unitName:'三上｜校園規範和班級自治',questionId:'u25-t20-match',questionType:'matching'};assert.equal(post({...payload,requestId:'request-grade3-02',events:[grade3Social]}).ok,true);console.log('三上題號及年級單元標記寫入通過。');

for(const [questionId,subject,grade] of [['u0-t40-r5','自然',5],['u25-t40-r5','社會',3]]){assert.equal(post({...payload,requestId:'visual-'+questionId,events:[{...event,id:'event-visual-'+questionId,questionId,subject,grade,question:'圖文閱讀與圖卡資料',questionType:'single'}]}).ok,true);}console.log('新增自然社會圖文閱讀題號寫入通過。');
