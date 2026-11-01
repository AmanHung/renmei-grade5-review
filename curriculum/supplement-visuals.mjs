const bars=(caption,labels,values,unit='',total)=>({kind:'quantityBars',caption,labels,values,unit,total});
const flow=(caption,labels)=>({kind:'quantityFlow',caption,labels});
const maps={
 'u9-t41-n1':{kind:'packing',caption:'24 枝筆，嘗試每盒 5～8 枝',total:24,per:5},
 'u9-t44-n1':{kind:'dotArray',caption:'36 人的隊伍；圖為其中一種排法',rows:6,cols:6},
 'u10-t46-n1':{kind:'labelledAngles',caption:'三張獨立角卡，能否組成三角形？',angles:[50,60,80]},
 'u10-t50-n1':{kind:'rodCompare',caption:'三根木棒長度比較',values:[4,7,11],unit:'公分'},
 'u11-t41-n1':bars('兩條繩剪成同長小段',['紅繩','藍繩'],[24,36],'公分'),
 'u11-t42-n1':{kind:'intervalTracks',caption:'從 8：00 同時出發，刻度表示經過分鐘',intervals:[12,18],max:40},
 'u11-t43-n1':bars('兩種筆平均分包',['紅筆','藍筆'],[18,30],'枝'),
 'u11-t44-n1':{kind:'repeatGroups',caption:'每包枝數不同，要買到相同枝數',rows:[{label:'鉛筆',per:6,count:3},{label:'原子筆',per:8,count:3}],note:'各畫 3 包示意；應買幾包仍須計算。'},
 'u17-t44-n1':{kind:'placePiles',caption:'各位值積木尚未整理進位',counts:[4,12,3,6]},
 'u18-t41-n1':flow('圖書館借還流程',['原有 3250 本','借出 486 本','還回 278 本','現在？本']),
 'u18-t43-n1':bars('兩班募款比較；合計 4320 元',['甲班','乙班'],[2500,null],'元', '甲比乙多 680 元'),
 'u18-t44-n1':{kind:'examNumberLine',caption:'累積張數的起點與終點',labels:['2897','？張的增量','3506']},
 'u18-t45-n1':bars('減法的部分與整體',['拿走','剩下'],[1785,2640],'','原有總數？'),
 'u18-t46-n1':{kind:'arithmetic',caption:'檢查小安的 2115 是否正確',a:4002,b:1987,operation:'−'},
 'u19-t46-n1':{kind:'equalStrips',caption:'兩條等長線合計 14 公分',count:2,total:'14 公分'},
 'u20-t44-n1':{kind:'repeatGroups',caption:'兩人都讀 7 天',rows:[{label:'甲',per:18,count:7},{label:'乙',per:15,count:7}]},
 'u20-t45-n1':{kind:'repeatGroups',caption:'漏掉十位的 0，數值也改變',rows:[{label:'正確',per:203,count:4},{label:'誤算',per:23,count:4}]},
 'u20-t46-n1':{kind:'splitArray',caption:'36 分成 30 和 6，每部分都有 5 組',a:30,b:6,count:5},
 'u20-t47-n1':{kind:'verticalProblem',caption:'乘法直式的缺格',lines:['2□6','×  3','738']}
};
export default function supplementVisuals(units,extras=[]){
 for(const q of units.flatMap(u=>u.questions).concat(extras)){
  if(maps[q.id])q.visual={...maps[q.id],examLineArt:true};
  if(units[q.unit].subject!=='數學')continue;
  if(q.text.startsWith('細棒左端在尺上'))q.visual={kind:'rulerMove',caption:'細棒平移前後',start:17,end:96,shift:5,max:100};
  if(q.text.startsWith('原紙帶長 16 公分'))q.visual={kind:'cutStrip',caption:'16 公分紙帶的裁切位置',total:160,cuts:[28,28,28,40],unit:'毫米'};
  if(q.text.startsWith('回收站用位值積木'))q.visual={kind:'placePiles',caption:'回收登記：尚未整理進位的積木',counts:[2,13,6,0]};
  if(q.text.startsWith('用 0、3、7、8'))q.visual={kind:'numberCards',caption:'每張卡用一次，千位先選 7',numbers:[0,3,7,8]};
  if(q.text.startsWith('倉庫密碼是四位數'))q.visual={kind:'numberCards',caption:'每張卡用一次，依範圍與位值排卡',numbers:[2,0,5,8]};
  if(q.text.startsWith('學校訂 8 箱飲品'))q.visual={kind:'repeatGroups',caption:'購入與發出比較',rows:[{label:'購入',count:8,per:24},{label:'發出',count:5,per:30}]};
  if(q.text.startsWith('場館最多可同時容納'))q.visual=flow('上限 3500 人',['原有 2186 人','離場 975 人','進場 1288 人','還能容納？人']);
  if(q.text.startsWith('修繕預算有'))q.visual=flow('修繕支出',['原有 6000 元','材料 2785 元','工具 946 元','剩餘？元']);
 }
}
