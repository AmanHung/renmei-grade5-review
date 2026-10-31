function storyScene(u,i){
 if(u.subject==='英語')return u.id===6?'drinks':u.id===7?'fruit':u.id===15?'names':'ages';
 if(u.id===4)return i<5?'charity':i<10?'landscape':i<15?'climb':'reading';
 if(u.id===5)return i<6?'museum':i<12?'shop':'animation';
 if(u.id===13)return 'planner';
 const scenes=['labels','bridge','tools','garden','pencils','lamp','poster','library','blocks','cleaning','garden','teamwork','rain','labels','map','books','museum','teamwork','garden','wind'];return scenes[i%scenes.length];
}
function articleVisual(u,q){const scene=storyScene(u,q.topic),base={kind:'story',scene,caption:'閱讀情境圖',description:'情境示意圖，人物與物品請和文章一起理解。'};
 if(u.id===6){const menu=q.passage.match(/Menu: ([^\n]+)\./);return {...base,kind:'menu',caption:'故事裡的菜單',items:menu?menu[1].split(', ').map(x=>x.trim()):[]};}
 if(u.id===7){const a=q.passage.match(/We need (\d+) (\w+) and (\d+) (\w+)\. We have (\d+) (\w+) and (\d+) (\w+)\./);if(a)return {kind:'fruitList',caption:'水果沙拉準備單',table:{headers:['水果','需要 need','已有 have'],rows:[[a[2],Number(a[1]),Number(a[5])],[a[4],Number(a[3]),Number(a[7])]]}};}
 if(u.id===15||u.id===16){const last=q.passage.split('\n\n').at(-1).split('\n').slice(1),rows=last.map(line=>u.id===15?[line.replace('Name: ','')]:line.split(': '));return {kind:'nameCards',caption:u.id===15?'故事裡的姓名卡':'故事裡的姓名與年齡',table:{headers:u.id===15?['Name']:['Name','Age'],rows}};}
 return base;
}
export default function attachLearningVisuals(units){
 for(const u of units){
  if(u.subject==='國語'||u.subject==='英語'){u.articleVisuals=u.articleVisuals||{};for(const q of u.questions)if(q.passageId&&!u.articleVisuals[q.passageId])u.articleVisuals[q.passageId]=articleVisual(u,q);}
  if(u.subject==='自然'||u.subject==='社會'){
   const kinds={0:['birds','camouflage','animalFamily','teamAnimals'],1:['sound','shadow','mirror','refraction'],2:['taiwan','communityMap','culture','sharedSpace'],3:['terrain','rain','landUse','river'],22:['plantParts','leaves','seedlings','plantFood'],23:['cupAir','syringes','pistons','wind'],24:['teamwork','schedule','resources','studySteps'],25:['votes','libraryRules','duty','beforeAfter']};
   u.topicVisuals=u.cards.map((c,i)=>({kind:kinds[u.id][Math.floor(i/5)%4],caption:c.title+'・觀念情境圖',description:'觀念情境示意，仍須依題目與課本內容判斷。'}));
  }
  if(u.subject!=='數學')continue;
  for(const q of u.questions){if(q.figure||q.chart)continue;const i=q.topic,k=Number(q.id.at(-1))-1;
   if(u.id===10){const a=35+i,b=55+i;if(k===0)q.visual={kind:'triangleAngles',caption:'三角形內角圖',angles:[a,b,null]};if(k===1)q.visual={kind:'isosceles',caption:'等腰三角形：兩腰相等',vertex:40+2*i};if(k===2)q.visual={kind:'triangleSides',caption:'兩條已知邊與可變的第三邊',sides:[4+i,7+i,null]};if(k===3)q.visual={kind:'parallelogram',caption:'平行四邊形的相鄰內角',known:a};if(k===4)q.visual={kind:'quadrilateral',caption:'四邊形內角圖',angles:[90,80+i,100-i,null]};}
   else if(u.id===12){const n=i%5+3,count=Math.floor(i/5)+1;const models=k<3?[{shape:'prism',n,count}]:k===3?[{shape:'pyramid',n,count}]:i%4===0?[{shape:'cylinder',count}]:i%4===1?[{shape:'cone',count},{shape:'sphere',count:n}]:i%4===2?[{shape:'cylinder',count},{shape:'sphere',count:n}]:[{shape:'pyramid',n,count}];q.visual={kind:'solids',caption:'立體模型觀察圖',models,description:'虛線表示被遮住的邊；各模型彼此分開，未共用邊或頂點。'};}
   else if(u.id===17){const n=1203+i*137,a=i%7+2,b=i%9,c=(i+3)%10,d=(i+6)%10;q.visual=k===1?{kind:'placeValue',caption:'依位值組合數',digits:[a,b,c,d]}:k===3?{kind:'groups',caption:'每一份代表一百',per:100,count:i+10,unit:'百'}:k===4?{kind:'numberCards',caption:'比較兩個數',numbers:[n,n+17]}:{kind:'placeValue',caption:'讀一讀各個位值',digits:String(n).split('').map(Number)};}
   else if(u.id===18){const a=2307+i*201,b=1184+i*53;q.visual=k===0?{kind:'arithmetic',caption:'位值對齊來計算',a,b,operation:'+'}:k===1||k===4?{kind:'arithmetic',caption:k===4?'原有與花掉的數量':'位值對齊來計算',a,b,operation:'−'}:k===2?{kind:'arithmetic',caption:'注意經過零的退位',a:10000,b:a,operation:'−'}:{kind:'equation',caption:'已知總數，找另一部分',a,total:a+b};}
   else if(u.id===19){const c=i%8+1,m=i%9+1,a=31+i,b=10+i%7;q.visual=k===0?{kind:'lengths',caption:'公分與毫米的關係',segments:[{value:c,label:'公分'}],conversion:true}:k===1?{kind:'lengths',caption:'兩種長度單位要合起來',segments:[{value:c,label:'公分'},{value:m,label:'毫米'}],conversion:true}:{kind:'lengths',caption:k===2?'比較原長與剪掉的部分':'兩段接起來，不重疊',segments:[{value:a,label:'毫米'},{value:b,label:'毫米'}]};}
   else if(u.id===20){const a=12+i*3,b=2+i%8,n=102+i*13,z=(i+2)*10;q.visual={kind:'groups',caption:'相同數量分成幾組',per:k===1||k===2?n:k===3?z:a,count:k===2?0:b,unit:'組'};}
   else if(u.id===9){const n=i+4;q.visual=k===1?{kind:'packing',caption:'依每盒數量分裝',total:n*5,per:n}:k===0?{kind:'groups',caption:'每組相同的數量',per:n,count:4,unit:'組'}:{kind:'numberCards',caption:'用整除關係找因數與倍數',numbers:[k===4?n*2:n],note:'請依題目條件計算，不只看圖案數量。'};}
   else if(u.id===11){const a=i+4,b=i%7+6;q.visual=k===2?{kind:'timelines',caption:'兩盞燈各自固定間隔閃動',intervals:[a,b]}:k===4?{kind:'tiling',caption:'大長方形與要找的正方形',width:a*3,height:b*3}: {kind:'numberCards',caption:k===3?'兩種紙張都要平均分組':k===0?'找共同的因數':'找共同的正倍數',numbers:k===3?[a*2,b*2]:[a,b],note:'依題目判斷是求最大公因數或最小公倍數。'};}
   else if(u.id===21)q.figure={type:'angle',opening:[25,40,55,65,80,90,100,115,135,150][i%10],rotation:i*17%360,length:65+i*2};
  }
 }
}
