/** 小小複習室：專用紀錄表，只接受寫入，不提供公開查詢孩子紀錄。 */
var STUDY_HEADERS=['接收時間（臺北）','小朋友名字','紀錄種類','練習編號','科目','單元','題號','題型','題目','作答內容','正確答案','是否答對','分數','答對題數','總題數','作答秒數','紀錄編號','裝置作答時間','網站版本'];

function setup() {
  var book = getBook_();
  console.log('作答紀錄表：' + book.getUrl());
  return book.getUrl();
}

function getBook_() {
  var properties=PropertiesService.getScriptProperties();
  var id=properties.getProperty('STUDY_SPREADSHEET_ID');
  var book=id?SpreadsheetApp.openById(id):SpreadsheetApp.create('小小複習室－孩子作答紀錄');
  if(!id)properties.setProperty('STUDY_SPREADSHEET_ID',book.getId());
  var log=book.getSheetByName('作答紀錄');
  if(!log){log=book.insertSheet('作答紀錄');log.appendRow(STUDY_HEADERS);log.setFrozenRows(1);log.getRange(1,1,1,STUDY_HEADERS.length).setBackground('#e4eedd').setFontWeight('bold');}
  if(!book.getSheetByName('同步回執')){var receipts=book.insertSheet('同步回執');receipts.appendRow(['請求編號','已接收紀錄編號','接收時間']);receipts.setFrozenRows(1);}
  return book;
}

function normalizeEvent_(e) {
  if(!e||!/^[-\w]{12,100}$/.test(String(e.id||'')))throw new Error('紀錄編號格式錯誤');
  if(!/^[-\w]{12,100}$/.test(String(e.sessionId||'')))throw new Error('練習編號格式錯誤');
  if(typeof e.learner!=='string'||!e.learner.trim()||e.learner.length>20)throw new Error('請輸入有效暱稱');
  if(['answer','session'].indexOf(e.kind)<0)throw new Error('紀錄種類不支援');
  if(!Number.isFinite(Number(e.elapsedSeconds))||Number(e.elapsedSeconds)<0)throw new Error('作答時間格式錯誤');
  if(e.kind==='answer'&&(!/^u\d{1,2}-t\d{2}-(a|b|tf|multi|match|r[1-5]|n[1-5])$/.test(String(e.questionId||''))||['single','boolean','multiple','matching','numeric'].indexOf(e.questionType)<0||typeof e.correct!=='boolean'))throw new Error('題目資料格式錯誤');
  if(e.kind==='session'&&(!Number.isInteger(e.total)||e.total<1||e.total>100||!Number.isInteger(e.right)||e.right<0||e.right>e.total||e.score!==Math.round(e.right/e.total*100)))throw new Error('成績格式錯誤');
  return e;
}

function safeCell_(value) {
  var text=value==null?'':String(value);
  if(text.length>8000)text=text.slice(0,8000);
  // 名字或題目即使以公式符號開頭，也只當純文字保存。
  return /^\s*[=+@-]/.test(text)?"'"+text:text;
}

function eventRow_(e,now) {
  return [Utilities.formatDate(now,'Asia/Taipei','yyyy/MM/dd HH:mm:ss'),e.learner,e.kind==='answer'?'逐題作答':'練習完成',e.sessionId,e.subject||'',e.unitName||'',e.questionId||'',e.questionType||'',e.question||'',JSON.stringify(e.selected||[]),JSON.stringify(e.expected||[]),e.kind==='answer'?(e.correct?'答對':'待複習'):'',e.kind==='session'?e.score:'',e.kind==='session'?e.right:'',e.kind==='session'?e.total:'',Math.round(Number(e.elapsedSeconds)*10)/10,e.id,e.createdAt||'',e.appVersion||''].map(safeCell_);
}

function doPost(request) {
  var lock=LockService.getScriptLock();
  try {
    var raw=request&&request.postData&&request.postData.contents;
    if(!raw||raw.length>150000)throw new Error('資料大小不符');
    var payload=JSON.parse(raw);
    if(payload.schemaVersion!==1||!/^[-\w]{12,100}$/.test(String(payload.requestId||'')))throw new Error('請求格式錯誤');
    if(!Array.isArray(payload.events)||payload.events.length<1||payload.events.length>10)throw new Error('每批僅接受 1 至 10 筆');
    var events=payload.events.map(normalizeEvent_);
    lock.waitLock(20000);
    var book=getBook_(),sheet=book.getSheetByName('作答紀錄'),receipts=book.getSheetByName('同步回執');
    var existing={};
    if(sheet.getLastRow()>1)sheet.getRange(2,17,sheet.getLastRow()-1,1).getValues().forEach(function(r){existing[String(r[0])]=true;});
    var now=new Date(),rows=[];
    events.forEach(function(e){if(!existing[e.id]){rows.push(eventRow_(e,now));existing[e.id]=true;}});
    if(rows.length)sheet.getRange(sheet.getLastRow()+1,1,rows.length,STUDY_HEADERS.length).setValues(rows);
    var ack={ok:true,requestId:payload.requestId,acceptedIds:events.map(function(e){return e.id;})};
    receipts.appendRow([payload.requestId,JSON.stringify(ack.acceptedIds),now]);
    SpreadsheetApp.flush();
    CacheService.getScriptCache().put('receipt:'+payload.requestId,JSON.stringify(ack),21600);
    return json_(ack);
  } catch(error) {
    // 未取得成功回執時，前端保留待傳資料；不會把發送成功當成寫入成功。
    return json_({ok:false,error:String(error.message||error)});
  } finally {if(lock.hasLock())lock.releaseLock();}
}

function doGet(request) {
  var p=request&&request.parameter||{};
  var result={ok:true,service:'little-study-log',schemaVersion:1};
  if(p.action==='receipt') {
    if(!/^[-\w]{12,100}$/.test(String(p.id||'')))result={ok:false};
    else {
      var cached=CacheService.getScriptCache().get('receipt:'+p.id);
      result=cached?JSON.parse(cached):{ok:false,requestId:p.id};
      if(!cached){
        var propertyId=PropertiesService.getScriptProperties().getProperty('STUDY_SPREADSHEET_ID');
        if(propertyId){var receipts=SpreadsheetApp.openById(propertyId).getSheetByName('同步回執');var found=receipts&&receipts.getRange('A:A').createTextFinder(p.id).matchEntireCell(true).findNext();if(found)result={ok:true,requestId:p.id,acceptedIds:JSON.parse(receipts.getRange(found.getRow(),2).getValue())};}
      }
    }
  }
  // 只回傳隨機請求編號及已接收編號；不回傳名字、題目、答案或試算表資訊。
  if(p.callback&&/^studyReceipt_\d+_\d+$/.test(p.callback))return ContentService.createTextOutput(p.callback+'('+JSON.stringify(result)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return json_(result);
}

function json_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
