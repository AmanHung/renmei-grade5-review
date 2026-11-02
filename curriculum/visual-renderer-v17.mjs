// Self-contained renderer. The build embeds this function in learning-visuals.js
// so the browser and all existing VM tests use the same drawing implementation.
export default function draw(v){
 if(!v.kind?.startsWith('audit'))return null;
 const ink='#31524d',green='#79a77b',blue='#8dc5da',sand='#dfc49c',red='#c77e66';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const T=(x,y,s,size=22)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Microsoft JhengHei,system-ui,sans-serif" font-size="${size}" fill="${ink}">${esc(s)}</text>`;
 const L=(x,y,a,b,color=ink,w=3,extra='')=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${color}" stroke-width="${w}" ${extra}/>`;
 const R=(x,y,w,h,fill='#fff',radius=8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${ink}" stroke-width="2"/>`;
 const C=(x,y,r,fill='#fff')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="2"/>`;
 const E=(x,y,a,b,fill='#fff')=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${fill}" stroke="${ink}" stroke-width="2"/>`;
 const P=(d,fill='none',color=ink,w=3)=>`<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/>`;
 const G=(x,y,body,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
 const A=(x,y,a,b,color=ink,w=3)=>{const d=Math.atan2(b-y,a-x),h=12;return L(x,y,a,b,color,w)+P(`M${a-h*Math.cos(d-.45)} ${b-h*Math.sin(d-.45)}L${a} ${b}L${a-h*Math.cos(d+.45)} ${b-h*Math.sin(d+.45)}`,'none',color,w);};
 const panel=(title,body,y=10,h=190)=>R(10,y,580,h,'#fff',12)+T(300,y+31,title,23)+G(0,y+40,body);
 const book=()=>P('M0 10Q40-5 75 10Q110-5 150 10V90Q110 75 75 90Q40 75 0 90Z','#e5efdc')+L(75,10,75,90)+L(15,35,55,35)+L(95,35,135,35)+L(15,52,55,52)+L(95,52,135,52);
 const person=(x,y,name,bodyColor=blue)=>G(x,y,C(0,0,25,'#f1dec5')+P('M-29 42Q0 20 29 42L38 115H-38Z',bodyColor)+L(-24,52,-50,95)+L(24,52,50,95)+L(-15,115,-15,150)+L(15,115,15,150)+R(-53,65,106,35,'#fff',4)+T(0,89,name,19));
 const cup=(x,y,drink)=>{
  const color=/orange|juice/.test(drink)?'#efbd6b':/milk tea/.test(drink)?'#cca584':/^tea$/.test(drink)?'#d6b178':/milk/.test(drink)?'#fff8e7':'#dceff5';
  return G(x,y,P('M-36-25L-27 65H27L36-25Z',color)+E(0,-25,36,8,color)+P('M36-8Q68-10 57 25Q49 39 30 32')+T(0,105,drink,19));
 };
 const fruit=(x,y,name,s=1)=>G(x,y,/banana/.test(name)?P('M-28-27Q7 14 35-28Q24 61-28-27Z','#f4d06c'):/orange/.test(name)?C(0,3,30,'#edb66c')+P('M0-27Q2-44 17-38',green):P('M0-17C-45-52-49 43-6 37Q0 33 7 37C48 44 46-53 0-17Z','#dd9982')+L(0,-17,5,-37,green,5),s);
 const root=()=>P('M0 0V110M0 35L-35 60M0 70L30 90M0 88L-20 110','none','#90734e',5);
 const leaf=(edge='smooth',vein='net')=>{
  const outline=edge==='serrated'?'M0 0L-14-12L-9-22L-28-30L-22-40L-36-51L-27-60L-29-73L-13-78L0-100L13-78L29-73L27-60L36-51L22-40L28-30L9-22L14-12Z':'M0 0Q-64-46 0-100Q64-46 0 0Z';
  return P(outline,'#b5d4a1')+L(0,-2,0,-95,ink,2)+(vein==='parallel'?[-18,-9,9,18].map(x=>P(`M0-4Q${x*2}-47 0-94`,'none',ink,1.6)).join(''):[-24,-45,-65].flatMap(y=>[L(0,y,-23,y-16,ink,1.6),L(0,y,23,y-16,ink,1.6)]).join(''));
 };
 const leafStem=(x,y,opposite)=>G(x,y,L(0,0,0,-190,green,5)+[[-1,-65],[1,opposite?-65:-120]].map(([side,yy])=>G(0,yy,`<g transform="rotate(${side*55})">${leaf(opposite?'smooth':'serrated',opposite?'parallel':'net')}</g>`,.72)).join('')+C(0,-65,4,green)+(opposite?'':C(0,-120,4,green)));
 const note=(x,y,title,lines,w=240)=>G(x,y,R(0,0,w,50+lines.length*33,'#fff7d9',5)+T(w/2,32,title,22)+lines.map((s,i)=>T(w/2,68+i*33,s,19)).join(''));
 const wrap=(body,h=330,alt=v.caption)=>({body,box:`0 0 600 ${h}`,alt});
 const syringe=(x,y,p,water,seal=true,press=false,mirror=false)=>{
  const body=R(0,0,200,48,'#fbfdf9',2)+R(1,2,p-2,44,water?'#a8d9e8':'#f2e4be',0)+P('M0 14H-17V34H0','#fff')+(seal?R(-25,12,9,24,'#b48469',2):'')+L(p,1,p,47,ink,7)+L(p+3,24,p+72,24,ink,8)+L(p+75,-10,p+75,58,ink,5)+L(198,-10,198,58,ink,3)+[20,40,60,80,100,120,140,160,180].map(n=>L(n,1,n,n%40?10:17,ink,1)).join('')+(press?A(p+110,-19,p+70,-19,red,4):'');
  return G(x,y,mirror?`<g transform="scale(-1 1)">${body}</g>`:body,.82);
 };
 if(v.kind==='auditSyringes'){
  let body='',h=390;
  if(v.mode!=='hydraulic'){
   body=panel('實驗一：出口封住，用相近的力推活塞',T(169,19,'推之前')+T(445,19,'推的時候')+T(63,70,'甲')+syringe(55,80,154,false)+syringe(340,80,98,false,true,true)+T(176,157,'空氣')+T(450,157,'空氣')+T(63,220,'乙')+syringe(55,230,154,true)+syringe(340,230,152,true,true,true)+T(176,307,'水')+T(450,307,'水')+T(300,352,'棕色封口堵住出口；圖中沒有針頭。',19),10,425);h=445;
  }
  if(v.mode!=='sealed'){
   const y=v.mode==='hydraulic'?10:455;
   const system=syringe(260,90,145,true,false,false,true)+syringe(340,90,145,true,false,false)+P('M274 110H326','none',blue,12)+P('M274 110H326','none',ink,2)+A(40,72,86,72,red,4)+A(508,72,554,72,red,4)+T(140,32,'推左端活塞')+T(455,32,'右端活塞移動')+T(300,185,'無針注射筒以軟管密合連通，內部裝滿水。',19);
   body+=panel('實驗二：以水連通，觀察動力傳送',system,y,255);h=y+265;
  }
  return wrap(body,h,'無針注射筒的封口壓縮比較，以及以水連通的傳動裝置。空氣與水用文字和顏色雙重標示。');
 }
 if(v.kind==='auditCupAir'){
  const setup=(x,tilt)=>G(x,65,R(-100,-55,200,260,'#dceff5',3)+L(-100,-35,100,-35,blue,3)+G(0,0,`<g transform="rotate(${tilt?28:0} 0 100)">`+P('M-52 158V-8Q0-24 52-8V158',tilt?'#a8d9e8':'#fdfaf0')+R(-27,-8,54,23,tilt?'#a7987c':'#cdbd9f',3)+(tilt?'':P('M-48 155H48','none',blue,3))+'</g>')+(tilt?[C(-64,117,9),C(-76,78,7),C(-87,47,5)].join(''):'')+T(0,245,tilt?'杯子傾斜':'杯口向下，垂直壓入',20));
  return wrap(panel('同一杯子與紙團，比較進水方式',setup(155,false)+setup(445,true),10,380)+T(300,425,'紙團固定在杯底；氣泡表示杯內空氣逸出。',20),450,'兩個相同倒扣杯放入水盆。左杯垂直，紙團在杯底；右杯傾斜，空氣從杯口形成氣泡逸出。');
 }
 if(v.kind==='auditLeaves')return wrap(T(155,37,'甲')+T(445,37,'乙')+leafStem(155,270,false)+leafStem(445,270,true)+T(300,310,'比較莖節上的排列，再看葉片局部。',20)+G(155,445,leaf('serrated','net'),1.05)+G(445,445,leaf('smooth','parallel'),1.05)+T(155,485,'甲葉片局部',20)+T(445,485,'乙葉片局部',20),510,'甲每節一葉、交錯排列，葉緣鋸齒、網狀葉脈；乙每節兩片相對、葉緣平滑、平行葉脈。');
 if(v.kind==='auditRubber'){
  const rubber=(x,y,len,label,force)=>G(x,y,R(-12,8,len+24,90,'#f2e4c5',4)+L(0,38,len,38,red,5)+L(0,23,0,60,ink,4)+L(len,23,len,60,ink,4)+A(len/2,-20,len/2,force?23:7,blue,force?5:3)+T(len/2,134,label,20));
  const isArticle=!!v.articleTitle,shortOnly=v.conceptIndex===2;
  let body='',h=270;
  if(!shortOnly)body=panel('比較一：同一條、同長度；只改撥動力道',rubber(60,33,190,'輕撥',false)+rubber(350,33,190,'較用力撥',true),10,250);
  if(shortOnly||isArticle){const y=shortOnly?10:280;body+=panel('比較二：其餘條件相近；改振動部分長度',rubber(65,38,200,'16 公分',false)+rubber(390,38,100,'8 公分',false),y,260);h=y+275;}
  return wrap(body,h,'橡皮筋固定在兩支點之間，標出振動部分。兩次比較分別改力道與振動長度，並不畫成聲音量測波形。');
 }
 if(v.kind==='auditFoodParts'){
  const cabbage=E(0,0,48,43,'#b5d4a1')+[-20,0,20].map(x=>P(`M${x} 38Q${x-35}-5 ${x+8}-37`,'none',green,2)).join('');
  const carrot=P('M-24-25L24-25L0 80Z','#e9b271')+[-1,0,1].map(n=>P(`M0-25Q${n*30}-66 ${n*20}-85`,'none',green,5)).join('');
  const beans=[-22,16].map((x,i)=>G(x,i*16,P('M-8-26C-52-18-39 34 0 31C29 25 12 7 8-2C3-10 20-30-8-26Z','#b87367'),.9)).join('');
  const papaya=E(0,0,40,62,'#efbd7a')+E(0,0,18,40,'#fff0c5')+[-1,0,1].flatMap(a=>[-1,0,1].map(b=>C(a*8,b*14,3,'#654f42'))).join('');
  const labels=v.sceneText?.includes('高麗菜')&&v.sceneText.includes('紅豆湯')?['高麗菜','紅豆','木瓜']:['高麗菜','胡蘿蔔','紅豆','木瓜'];
  const shapes={高麗菜:cabbage,胡蘿蔔:carrot,紅豆:beans,木瓜:papaya};
  return wrap(labels.map((name,i)=>G(85+i*(430/(labels.length-1)),145,shapes[name])+T(85+i*(430/(labels.length-1)),277,name,23)).join('')+T(300,320,'食物外形示意；請判斷實際食用的植物部位。',19),345,'高麗菜葉球、胡蘿蔔膨大根、紅豆種子與剖開的木瓜果實，依本題食材呈現。');
 }
 if(v.kind==='auditFlower'){
  const body=Array.from({length:5},(_,i)=>`<g transform="rotate(${i*72} 295 155)">${E(295,93,43,63,'#f0cec9')}</g>`).join('')+[-1,1].map(n=>P(`M295 169Q${295+n*55} 150 ${295+n*62} 110`)+E(295+n*62,107,10,6,'#e5c779')).join('')+P('M295 185V103','none',green,9)+E(295,100,15,7,'#abd3a2')+P('M265 205L295 180L326 205L299 199Z',green)+P('M295 203V287','none',green,8);
  return wrap(body+L(92,70,245,89)+T(84,60,'花瓣')+L(500,90,363,110)+T(510,80,'雄蕊')+L(498,180,301,105)+T(510,170,'雌蕊')+L(105,260,270,202)+T(95,254,'花萼'),330,'簡化花朵構造：中央雌蕊、周圍雄蕊、外圍花瓣、花瓣下方花萼；引線指向對應構造。');
 }
 if(v.kind==='auditWaterContainers')return wrap(panel('同一份水倒進不同容器，沒有溢出',P('M65 25V180H225V25')+R(67,100,156,78,'#b9deea',0)+P('M380 25L400 180H510L530 25')+P('M391 93L402 178H508L519 93Z','#b9deea')+A(247,94,354,94)+T(145,225,'方形盒')+T(455,225,'圓形杯'),10,300),325,'方形容器與圓形杯裝同一份水，水依容器呈現不同外形。水面高度為示意，不作體積量測。');
 if(v.kind==='auditSpongeAir')return wrap(R(90,50,420,240,'#dceff5')+L(90,110,510,110,blue)+R(210,155,170,80,'#e6cf86')+[0,1,2,3].flatMap(i=>[0,1].map(j=>E(233+i*39,177+j*34,8,5,'#f6e9b3'))).join('')+[C(230,140,10),C(277,105,8),C(324,85,6)].join('')+A(300,15,300,85)+T(300,325,'乾海綿壓入水中，孔隙的空氣形成氣泡。',20),350,'水盆內的海綿有孔隙，向上冒出氣泡；箭頭表示海綿入水方向。');
 if(v.kind==='auditBalloon'||v.kind==='auditAirExamples')return wrap(G(130,135,E(0,30,28,43,'#efc6b7')+P('M-8 72L8 72L0 82Z','#efc6b7'))+A(220,150,330,150)+G(440,135,E(0,0,72,94,'#efc6b7')+P('M-10 92L10 92L0 105Z','#efc6b7')+P('M0 105Q-35 125 0 145'))+T(130,310,'充氣前')+T(440,310,'充氣後'),340,'同一氣球充氣前較扁，充氣後鼓起；形狀依氣球而改變，沒有提供量測體積。');
 if(v.kind==='auditTuningFork')return wrap(R(110,170,370,110,'#dceff5')+L(110,205,480,205,blue)+P('M250 30V100Q290 145 330 100V30','none',ink,12)+L(290,124,290,212,ink,10)+[[-30,0],[28,-2],[47,10],[-51,10]].map(([x,y])=>P(`M290 212Q${290+x} ${170+y} ${290+x*1.8} ${210+y}`,'none',blue,3)).join('')+T(300,325,'發聲音叉接觸水面，觀察水面反應。',20),350,'U 形音叉柄接觸水面，旁邊出現水花；圖示為觀察裝置，不提供振動次數。');
 if(v.kind==='auditSoundBox')return wrap(panel('橡皮筋長度與撥動方式相同',R(65,80,190,80,'#e7d3b1')+E(160,115,62,22,'#fff')+L(80,100,235,100,red,4)+L(350,100,535,100,red,4)+L(350,80,350,130)+L(535,80,535,130)+T(160,215,'有音箱')+T(445,215,'無音箱'),10,285),310,'同長度橡皮筋分別在音箱上與沒有音箱的支點間；不把結果大小直接畫成量測數字。');
 if(v.kind==='auditMirrorRay')return wrap(P('M270 235L430 75','none','#82999a',12)+G(80,155,R(0,-20,95,40,'#e6d5af')+R(95,-14,20,28,'#fff'))+A(200,155,350,155,red,4)+A(350,155,350,35,red,4)+T(110,235,'光源')+T(460,265,'平面鏡')+T(450,65,'反射光',20),310,'入射光從左方射向斜置平面鏡，再反射向上。箭頭依實際光源到鏡面再到反射方向排列。');
 if(v.kind==='auditMagnifier')return wrap(G(80,160,book())+C(375,115,70,'#e6f2ee')+L(421,170,490,250,ink,18)+T(375,125,'字',48)+T(152,260,'觀察物')+T(400,300,'調整鏡片與物體距離',20),330,'放大鏡與書面文字分開放置，以握柄持鏡調整距離；未畫直視太陽操作。');
 if(v.kind==='auditWind'||v.kind==='auditFanTest'){
  const fan=x=>G(x,85,C(0,0,48,'#f7fbf9')+[0,1,2].map(i=>`<g transform="rotate(${i*120})">${E(0,-23,13,26,blue)}</g>`).join('')+L(0,49,0,102)+R(-36,102,72,12,'#dfe8de'));
  const windmill=x=>G(x,85,[0,1,2,3].map(i=>`<g transform="rotate(${i*90})">${P('M0 0L-12-42L32-29Z','#d9c28b')}</g>`).join('')+L(0,0,0,113)+C(0,0,5));
  const row=(y,label)=>G(0,y,fan(95)+A(170,85,385,85,blue,4)+windmill(470)+T(300,155,label,20));
  return wrap(row(0,v.kind==='auditFanTest'?'相同距離':'空氣流動方向')+(v.kind==='auditFanTest'?row(220,'相同紙風車、相同時間與放法'):''),v.kind==='auditFanTest'?455:245,'風扇對著紙風車；比較風扇時，兩組距離與紙風車相同，沒有杜撰轉速或風速數值。');
 }
 if(v.kind==='auditPeopleCards'){
  const rows=v.table?.rows||[];
  return wrap(rows.slice(0,3).map((row,i)=>person(100+i*200,70,row[0])+ (v.showAges?G(100+i*200,270,R(-58,-20,116,50,'#f7e2b5')+T(0,14,row[1],32)):T(100+i*200,302,'Hello!',20))).join(''),350,'三位人物的姓名牌'+(v.showAges?'與年齡數字':'，對照對話發言者')+'；各姓名依本篇資料，不使用同一組固定人名。');
 }
 if(v.kind==='auditDrinkOrders'){
  const rows=v.table?.rows||[];
  if(v.table?.headers?.[0]==='Menu')return wrap(rows.map((row,i)=>G(110+i*190,100,cup(0,0,row[0])+T(0,170,row[1]==='No'?'Not available':'Available',18)+(row[1]==='No'?L(-36,-30,40,75,red,5):''))).join(''),325,'本篇菜單依資料標示飲料是否供應，只有明載未供應的飲料畫斜線。');
  const h=rows.length*210+20;
  return wrap(rows.map((row,i)=>G(0,i*210,person(105,50,row[0],i%2?green:blue)+A(195,110,350,110)+cup(455,90,row[1]))).join(''),h,'人物姓名牌連到本文明載的飲料；牛奶、奶茶、茶、水與果汁有不同容器或色澤並附文字。');
 }
 if(v.kind==='auditFruitInventory'){
  const rows=v.table?.rows||[];
  const body=T(150,35,'Need')+T(445,35,'Have at first')+rows.map((row,j)=>{
   const render=(count,x)=>Array.from({length:Number(count)},(_,i)=>fruit(x+(i%4)*52,130+j*225+Math.floor(i/4)*72,String(row[0]),.55)).join('');
   return T(300,88+j*225,row[0],23)+render(row[1],65)+render(row[2],365);
  }).join('');return wrap(body,rows.length*225+70,'本篇目標水果與起初已有水果，依原表逐個繪製；左右兩欄的蘋果與香蕉數量不以同一固定圖替代。');
 }
 // Remaining figures below use the same primitives but distinct physical or
 // document layouts, selected by the reviewed question context.
 let body='',h=340;
 if(v.kind==='auditTeeth'){
  body=G(100,115,P('M-35-60H35L25 40L8 85L0 45L-10 85L-27 40Z','#fff6df'))+G(300,115,P('M-27-35L0-85L27-35L17 50L0 95L-17 50Z','#fff6df'))+G(500,115,P('M-42-50Q-27-72-10-49Q6-73 22-48Q42-65 43-40L28 45L12 86L0 48L-13 86L-30 45Z','#fff6df'))+T(100,282,'門齒')+T(300,282,'犬齒')+T(500,282,'臼齒');
 }else if(v.kind==='auditCamouflage'||v.kind==='auditAnimalDefense'){
  const insect=G(440,145,P('M-75 4L75-4','none','#82946a',7)+L(-20,2,-50,-34,green,3)+L(-20,2,-47,40,green,3)+L(20,0,45,-35,green,3)+L(20,0,50,35,green,3)+C(82,-5,8,green));
  if(v.kind==='auditCamouflage')body=P('M30 210L565 130','none','#ab8b62',12)+insect+T(300,300,'比較枝條與竹節蟲的細長外形。',20);
  else {
   const bird=G(305,105,E(0,0,40,24,'#bfc9b2')+C(35,-24,17,'#bfc9b2')+P('M48-28L70-20L48-15Z',sand)+P('M-5-4Q40 10 16 48','none',ink,3)+L(-12,20,-18,54)+L(8,20,20,54));
   body=panel('假裝受傷，往遠離巢區的方向移動',E(98,138,57,19,sand)+E(87,127,8,12,'#fff6d5')+E(109,128,8,12,'#fff6d5')+T(98,188,'巢區')+bird+A(385,105,515,105)+T(475,150,'遠離巢區',20),10,265);h=290;
   if(v.articleTitle){body+=panel('斷尾後離開，尾部繼續短暫擺動',G(165,85,E(0,0,45,19,'#b7c6a8')+C(44,-2,15,'#b7c6a8')+[-1,1].flatMap(s=>[-20,20].map(x=>L(x,s*8,x-8,s*34))).join(''))+P('M345 100Q395 48 445 95Q480 120 505 82','none',green,8)+A(235,80,290,80)+T(435,160,'分離的尾部',20),295,240)+panel('外形與枝條相似',P('M35 125L560 70','none','#ab8b62',12)+G(-125,-55,insect),555,240);h=810;}
  }
 }else if(v.kind==='auditAntJobs'||v.kind==='auditBirth'||v.kind==='auditAnimalFamily'){
  if(v.kind==='auditAntJobs'){
   const ant=(x,y)=>G(x,y,E(-24,0,19,13,'#b49b7b')+E(8,0,13,10,'#b49b7b')+C(31,0,12,'#b49b7b')+[-1,1].flatMap(s=>[-10,6,20].map(xx=>L(xx,0,xx-10,s*25,ink,2))).join('')+L(38,-8,48,-23)+L(39,-5,58,-12));
   const labels=['蟻后：產卵','工蟻：覓食、育幼','兵蟻：保護蟻巢'];body=[0,1,2].map(i=>ant(110+i*190,125)+T(110+i*190,220,labels[i],18)).join('')+E(80,161,7,11,'#fff7e4')+E(103,163,7,11,'#fff7e4')+P('M260 100L290 60L310 98Z',green);
  }else body=G(100,135,E(0,10,43,31,'#e1c18e')+C(27,-23,21,'#e1c18e')+P('M44-27L67-18L44-10Z',sand)+L(-15,35,-15,70)+L(12,35,12,70)+E(-35,70,10,14,'#fff2d4'))+G(300,135,E(0,12,45,28,'#cab6a1')+C(28,-15,22,'#cab6a1')+E(18,-45,7,25,'#cab6a1')+E(35,-43,7,24,'#cab6a1')+E(-45,45,23,16,'#d9c9b5'))+G(500,135,E(-23,-5,27,38,'#d6c29b')+E(23,-5,27,38,'#d6c29b')+L(0,-30,0,45,ink,6))+[T(100,275,'雞'),T(300,275,'兔'),T(500,275,'蝴蝶')].join('');
 }else if(v.kind==='auditThermoregulation')body=G(145,130,E(0,0,55,35,'#cfb495')+C(40,-20,27,'#cfb495')+P('M52-2Q64 45 75 4','#dcaaa0'))+T(145,260,'狗吐舌喘氣')+G(445,140,E(0,0,48,17,green)+P('M-45 0Q-105-35-110 25')+C(50,-6,14,green))+C(478,43,29,'#eed485')+T(445,260,'蜥蜴到有陽光處');
 else if(v.kind==='auditStems')body=G(150,75,P('M-18 0L-32 195H32L17 0Z','#b39b74')+G(-2,65,leaf(),.6)+G(15,125,leaf(),.6))+G(435,75,L(-38,0,-38,200,sand,9)+L(38,0,38,200,sand,9)+L(-38,50,38,50,sand,5)+L(-38,115,38,115,sand,5)+P('M0 200Q-70 160 0 120Q70 80 0 40Q-35 10 0-5','none',green,6))+T(150,315,'粗硬直立')+T(435,315,'柔軟攀附支架');
 else if(v.kind==='auditFruitSeeds')body=G(170,135,E(0,0,68,90,'#efbd7a')+E(0,0,30,60,'#fff0ca')+[-1,0,1].flatMap(a=>[-2,-1,0,1,2].map(b=>C(a*13,b*18,4,'#735b48'))).join(''))+G(420,145,C(0,0,78,'#d1dfa9')+C(0,0,48,'#f2d5bd')+C(0,0,22,'#957356'))+T(170,290,'剖開的果實甲')+T(420,290,'剖開的果實乙');
 else if(v.kind==='auditLandform'||v.kind==='auditTeaTerrain'||v.kind==='auditRiverTerrain'){
  const plateau=P('M35 240L95 215L135 112H260L300 220L340 240Z','#d9d7a9'),basin=P('M40 230L110 65L205 225H365L475 75L565 230Z','#d9d7a9'),slope=P('M330 240L445 115L570 240Z','#c4d3ab');
  body=v.mode==='basin'?basin:plateau+(v.kind!=='auditLandform'?slope:'')+L(30,240,575,240);
  if(v.kind==='auditTeaTerrain')body+=E(210,142,36,12,blue)+T(195,85,'甲',24)+T(462,85,'乙',24)+[0,1,2].map(i=>L(423+i*18,158+i*18,455+i*18,158+i*18,green,6)).join('')+R(505,204,35,22,blue,2)+T(210,292,'較高、頂部平坦')+T(460,292,'坡面分層種植',20);
  if(v.kind==='auditRiverTerrain')body+=P('M145 150Q180 180 220 220T540 252','none',blue,8)+A(295,235,360,248,blue,3)+T(150,75,'較高地勢')+T(480,310,'往低處與下游流');
 }else if(v.kind==='auditMountainRoad')body=P('M30 275L180 45L320 275L430 90L570 275Z','#c3d1ad')+P('M35 280Q140 160 220 230Q320 300 380 205Q455 100 570 230','none',sand,14)+P('M230 239Q260 160 290 246','#fff')+T(300,325,'道路配合山勢，可能使用橋梁或隧道。',20);
 else if(v.kind==='auditSlopeCover')body=P('M40 260L260 75L300 260Z','#d1c49e')+P('M330 260L550 75L590 260Z','#d1c49e')+[90,130,170,210].map((x,i)=>G(x,225-i*33,root(),.3)+G(x,215-i*33,leaf(),.3)).join('')+[370,420,470].map((x,i)=>A(x,145-i*25,x+38,215-i*25,blue)).join('')+T(165,310,'有植被的坡面')+T(450,310,'移除植被的坡面');
 else if(v.kind==='auditMonsoon'||v.kind==='auditCompass'||v.kind==='auditRegionalMap'){
  body=P('M350 55Q390 60 375 110Q355 195 300 270Q282 270 299 215Q310 120 350 55Z','#bfd6af')+T(360,312,'臺灣')+(v.kind==='auditMonsoon'?A(530,95,430,180,blue,5)+T(470,62,'東北季風',22):'');
  if(v.kind==='auditMonsoon')body+=T(160,135,'冬季')+P('M330 80Q345 60 360 78Q380 65 390 85','none',ink,3)+[0,1,2].map(i=>L(335+i*18,100,327+i*18,115,blue,2)).join('');
  else body+=A(90,200,90,85)+T(90,60,'北')+T(40,190,'西')+T(145,190,'東')+T(90,255,'南')+(v.kind==='auditRegionalMap'?P('M30 50L125 15L180 70L210 130L120 170L35 145Z','#e2d5b7')+T(115,105,'亞洲東部',18):'');
 }else if(v.kind==='auditRainShelter')body=P('M90 135L300 50L510 135Z','#c7d8c4')+L(130,135,130,265)+L(470,135,470,265)+L(90,265,510,265)+P('M90 280H510V300H90Z','#c9e1e9')+A(315,291,410,291,blue)+[0,1,2].map(i=>L(60+i*175,35,43+i*175,73,blue,3)).join('')+T(300,330,'遮雨棚與保持暢通的排水設施',20);
 else if(v.kind==='auditHarbor')body=P('M35 200H175L155 240H70Z','#cbb694')+L(107,110,107,200)+P('M107 115L158 181H107Z','#f3ead0')+G(245,135,R(0,0,175,65,'#d9e5df')+R(25,-48,48,48,'#d5bc91')+R(80,-48,55,48,'#d6cba8')+P('M-20 65H200L175 105H10Z','#b7d1da'))+L(20,260,580,260,blue,4)+T(115,310,'漁船與漁獲',20)+T(350,310,'貨輪與貨物',20)+T(505,140,'旅客',19)+person(515,165,'遊客',sand);
 else if(v.kind==='auditTimeScales'){body=panel('多年紀錄',A(70,70,520,70)+[0,1,2,3,4].map(i=>L(80+i*105,50,80+i*105,90)+T(80+i*105,122,'一年',19)).join(''),10,210)+panel('某一天的新聞',R(210,20,180,115,'#fff5d7')+T(300,58,v.articleTitle?'一月某日':'今天')+P('M255 80Q280 55 300 78Q320 60 344 85')+[0,1,2].map(i=>L(270+i*22,95,260+i*22,113,blue,3)).join(''),235,215);h=465;}
 else if(v.kind==='auditTeamJobs'||v.kind==='auditResources'||v.kind==='auditStudySteps'||v.kind==='auditPlanSteps'||v.kind==='auditMeetingRoles'||v.kind==='auditPaperWorkflow'){
  const rows=v.table?.rows;
  const labels=v.kind==='auditTeamJobs'?(rows?.slice(0,3).map(r=>r[0])||['繪圖者','查資料者','整理者']):v.kind==='auditMeetingRoles'?['主持討論','記下決議','分工執行']:v.kind==='auditStudySteps'?['找出錯誤','釐清原因','自己再試']:v.kind==='auditResources'?['觀察葉片','查閱圖鑑','核對與記來源']:v.kind==='auditPaperWorkflow'?['畫輪廓','輪流剪','摺紙與整理']:['確認任務','安排順序','保留休息'];
  body=labels.map((label,i)=>{
   const task=v.kind==='auditTeamJobs'?(rows?.[i]?.[1]||['畫圖','查資料','整理文字'][i]):label;
   const prop=/查|圖鑑|書/.test(task)?book():R(5,0,125,68,'#fff5dc')+L(20,20,110,20)+L(20,40,100,40)+(/畫|輪廓/.test(task)?P('M45 62L65 10L72 12L52 64Z','#d4b56f'):/剪/.test(task)?C(47,38,10)+C(73,38,10)+L(51,30,83,0)+L(69,30,37,0):P('M20 20l8 8l15-18'));
   const words=String(task).match(/.{1,8}/gu)||[];
   return G(35+i*195,45,person(70,25,label,i%2?green:blue)+G(5,188,prop)+words.map((s,n)=>T(75,295+n*25,s,18)).join(''))+(i<2?A(178+i*195,150,222+i*195,150):'');
  }).join('');
  if(v.kind==='auditResources')body+=G(90,255,leaf(),.7);h=420;
 }else if(v.kind==='auditSchedule'||v.kind==='auditPracticeTimeline'){
  const labels=v.kind==='auditSchedule'?['16：10','16：50','17：00','17：30','17：40','18：00']:['8：50','整理用品','就座準備','9：00'];
  body=A(40,140,565,140)+labels.map((s,i)=>{const x=65+i*470/(labels.length-1);return L(x,122,x,158)+T(x,195,s,labels.length>4?17:20);}).join('')+T(300,70,v.kind==='auditSchedule'?'作業 → 運動 → 閱讀':'提早到校 → 準備好 → 開始練習',22)+T(300,280,'依文中時刻排序；各間隔未依比例。',19);
 }else if(v.kind==='auditBallTurns')body=person(100,90,'甲組',blue)+person(500,90,'乙組',green)+C(300,150,47,'#ead3a5')+P('M258 145Q300 110 343 145M300 103V198')+A(185,120,240,120)+A(360,190,418,190)+P('M455 285Q300 330 145 285')+T(300,355,'輪流使用；器材仍只有一顆球。',20);
 else if(v.kind==='auditMeetingNote'){
  const specific=v.articleTitle==='班會紀錄漏了什麼';body=note(30,70,'原紀錄',['大家同意整理'],230)+A(268,155,322,155)+note(340,40,'補完整的紀錄',specific?['星期五午休後','第一組：排書','第二組：擦桌','第三組：確認借閱卡']:['討論的事項','通過的決議','負責人、時間'],230);h=330;
 }else if(v.kind==='auditCorridor')body=L(40,75,560,75)+L(40,270,560,270)+person(180,100,'行走',green)+person(420,100,'注意前方',blue)+A(260,225,340,225)+T(300,325,'共同通道保留通行空間，避免碰撞。',20);
 else if(v.kind==='auditReminder'||v.kind==='auditReminderLocation'||v.kind==='auditTwoLists'){
  if(v.kind==='auditReminder')body=note(55,40,'睡前準備',['聯絡簿','水壺','餐袋'],250)+G(375,75,book(),.8)+R(395,215,70,75,'#c5dbe7')+P('M395 215L407 195H453L465 215Z','#c5dbe7');
  else if(v.kind==='auditTwoLists')body=note(30,45,'物品清單',['水壺','餐袋','其他所需用品'],240)+note(330,45,'時間安排',['集合時間','出發時間','修改時只調整本張'],240);
  else body=panel('原先：便條在桌底',R(65,50,470,25,sand)+L(90,75,90,160)+L(510,75,510,160)+R(210,85,150,50,'#fff2be')+T(285,117,'便條',20),10,230)+panel('調整後：便條在鉛筆盒旁',R(65,75,470,25,sand)+R(100,28,200,48,'#b8d7dc')+R(335,15,155,65,'#fff2be')+T(410,45,'帶彩色筆',20),260,200);h=v.kind==='auditReminderLocation'?480:340;
 }else if(v.kind==='auditPaperBridge'){
  const bridge=(folded)=>R(60,90,120,80,'#d8c49c')+R(420,90,120,80,'#d8c49c')+(folded?P('M140 82L165 64L190 82L215 64L240 82L265 64L290 82L315 64L340 82L365 64L390 82L415 64L440 82','none',ink,4):P('M140 82Q300 135 440 82','none',ink,4))+E(300,folded?67:104,17,5,'#b7c3c4')+L(180,185,420,185,ink,2,'stroke-dasharray="7 5"')+T(300,215,'兩本書的間距相同',19);
  body=panel('第一次：平紙',bridge(false),10,295)+panel('第二次：連續摺痕',bridge(true),325,295);h=635;
 }else if(v.kind==='auditPencilTray'){body=panel('原先用可拿走的橡皮擦阻擋',P('M65 100L530 135L510 180L45 145Z','#e0cfaa')+P('M150 90L310 102L329 112L307 120L150 108Z','#d3b56b')+R(330,96,52,30,'#ddc6bc'),10,235)+panel('改成淺紙槽，放在桌面一側',P('M65 100L530 135L510 180L45 145Z','#e0cfaa')+P('M155 62L365 80L382 124L145 105Z','#d6e5d6')+P('M165 86L332 99L350 109L330 118L165 104Z','#d3b56b'),265,235);h=515;}
 else if(v.kind==='auditNoticeSize'||v.kind==='auditNoticeChange'){
  const change=v.kind==='auditNoticeChange';body=note(30,65,change?'原訊息':'原公告',change?['地點改了']:['集合時間','集合地點','其他圖案與裝飾'],230)+A(270,170,320,170)+note(335,35,change?'完整通知':'修正後公告',change?['今天 8：20','一樓穿堂集合','原操場集合取消']:['集合時間','集合地點'],235);h=345;
 }else if(v.kind==='auditBottleLabels')body=[0,1,2,3].map(i=>G(80+i*145,55,R(-28,30,56,160,'#a8cddd',12)+R(-17,0,34,30,'#d6e7ee',3)+R(-23,102,46,35,'#fff',2)+T(0,126,i===1?'小禾':i===2?'★':'',16)+T(0,235,'水壺 '+(i+1),20))).join('');
 else if(v.kind==='auditRiverViews'||v.kind==='auditFields'||v.kind==='auditLandscapeLayers'){
  if(v.kind==='auditFields')body=Array.from({length:3},(_,i)=>Array.from({length:4},(_,j)=>R(45+j*130,55+i*75,120,65,['#7ea470','#b4c994','#e2c86d'][(i+j)%3],2)).join('')).join('')+T(300,325,'色塊不同不等於已確定作物種類。',20);
  else if(v.kind==='auditLandscapeLayers')body=P('M45 140L140 35L230 140L360 45L550 140Z','#c6d7cc')+P('M180 225Q300 110 420 225V250H180Z',sand)+P('M230 250Q300 165 370 250','#fff')+[80,125,480,530].map((x,i)=>L(x,250,x,310,green,4)+C(x,245,18,'#d99485')).join('')+T(300,330,'紅花（近） → 小橋 → 遠山',20);
  else body=panel('較近：河面與岸邊細節',P('M45 55Q170 20 290 60T555 50V145H45Z','#b9dbe7')+P('M45 145H555','none',green,7),10,210)+panel('俯視：河道、田地與聚落關係',R(40,15,520,140,'#dae4c0')+P('M60 25Q220 140 300 50T540 120','none',blue,25)+[0,1,2].map(i=>R(380+i*48,28+i*18,34,28,sand,1)).join(''),240,230);h=v.kind==='auditRiverViews'?485:350;
 }else if(v.kind==='auditSeaColors'){
  const third=/紫色/.test(v.articleText||''),colors=third?['#8ea8bd','#e8aa87','#bba0cc']:['#8ea8bd','#e8aa87'];
  body=colors.map((color,i)=>G(20+i*(570/colors.length),45,R(0,0,540/colors.length,205,color,2)+P(`M0 110Q${140/colors.length} 95 ${280/colors.length} 110T${540/colors.length} 110V205H0Z`,i===1?'#cf8d7a':i===2?'#897ba6':'#7e9fb0')+T(270/colors.length,260,['清晨：灰藍','夕陽：橘紅','想像：紫色'][i],19))).join('');h=345;
 }else if(v.kind==='auditPainting'){
  body=R(40,25,520,270,'#e9ddc1',3)+R(65,45,115,115,'#bfdce9',1)+L(122,45,122,160)+L(65,103,180,103)+R(440,60,75,215,'#bda68c',1)+C(305,125,27,'#ead4b7')+P('M274 168Q305 147 338 168L350 230H260Z','#bac8c6')+L(270,195,300,210,ink,6)+L(338,195,315,210,ink,6)+L(277,230,277,280,ink,6)+L(329,230,329,280,ink,6)+T(300,330,'依文字重繪的示意，非原畫或實拍。',19);
 }else if(['auditLogoScale','auditTeamLogo','auditSigns'].includes(v.kind)){
  const team=v.kind==='auditTeamLogo';
  body=R(40,45,230,210,v.kind==='auditSigns'?'#b9d0b1':'#f4e5c4')+R(330,45,230,210,v.kind==='auditSigns'?'#b9d0b1':'#f4e5c4')+(team?P('M75 175L150 80L230 175Z','#bfd0ae')+T(155,120,'★',30)+T(155,187,'山形・星星・縮寫',15)+P('M360 175L445 85L530 175Z','#bfd0ae')+T(445,209,'隊名',29):P('M70 175Q155 55 240 175Z','#dfc49c')+Array.from({length:8},(_,i)=>L(80+i*19,100,110+i*15,190,ink,1)).join('')+P('M360 175Q445 65 530 175Z','#dfc49c'))+T(155,238,v.kind==='auditSigns'?'甲店':'第一版',20)+T(445,238,v.kind==='auditSigns'?'乙店':'第二版',25)+T(300,315,'依文意重繪的虛構設計示意。',19);
 }else if(v.kind==='auditAnimation')body=[0,1,2,3].map(i=>G(20+i*148,55,R(0,0,130,200,'#fff4df')+C(25+i*24,110-i*16,16,blue)+P(`M${10+i*24} ${110-i*16}l-17-12M${40+i*24} ${110-i*16}l17-12`)+T(65,245,'畫格 '+(i+1),20))).join('');
 else if(v.kind==='auditSolids'){
  const txt=v.sceneText||'',n=/六角/.test(txt)?6:/五角/.test(txt)?5:/三角/.test(txt)?3:4,isPyramid=/角錐/.test(txt)&&!/角柱與/.test(txt),cylinder=/圓柱/.test(txt);
  const poly=(cx,cy)=>Array.from({length:n},(_,i)=>[cx+90*Math.cos(2*Math.PI*i/n-.5),cy+38*Math.sin(2*Math.PI*i/n-.5)]);
  if(cylinder)body=E(300,80,95,30,'#e2eee1')+L(205,80,205,245)+L(395,80,395,245)+P('M205 245A95 30 0 0 0 395 245')+P('M205 245A95 30 0 0 1 395 245','none',ink,2);
  else{const bottom=poly(300,240),top=isPyramid?[[300,40]]:poly(300,90);body=`<polygon points="${bottom.map(p=>p.join(',')).join(' ')}" fill="#e4efdc" stroke="${ink}" stroke-width="2"/>`+(isPyramid?'':`<polygon points="${top.map(p=>p.join(',')).join(' ')}" fill="#e4efdc" stroke="${ink}" stroke-width="2"/>`)+bottom.map((p,i)=>L(...p,...(isPyramid?top[0]:top[i]),ink,2,i>n/2?'stroke-dasharray="7 5"':'')).join('')+bottom.concat(isPyramid?top:top).map(p=>C(...p,4,ink)).join('');}
  body+=T(300,325,'依已知形體觀察；頂點、邊或面數由你判斷。',19);
 }else if(v.kind==='auditGeometry'){
  const txt=v.sceneText||'';let labels=txt.includes('94')?['94°','?','?']:txt.includes('72')?['90°','90°','72°','?']:txt.includes('70')?['70°','?']:['7 公分','11 公分','?'];
  const quad=labels.length===4||txt.includes('平行四邊形');body=quad?P('M100 260L175 75H505L430 260Z','#e7efdf'):P('M90 265L300 60L510 265Z','#e7efdf');body+=labels.map((label,i)=>T([150,300,450,450][i],[245,110,245,100][i],label,23)).join('')+T(300,325,'示意圖未依比例；只使用題目給定條件。',19);
 }else if(v.kind==='auditStrips'){
  if(v.mode==='rectangleCut')body=R(80,65,400,205,'#e4dcc2',1)+T(280,45,v.width+' 公分')+T(535,175,v.height+' 公分',20)+R(80,65,65,65,'#bfdbc1',1)+T(300,315,'剪成相同正方形；小正方形邊長待求。',19);
  else body=R(45,80,335,45,'#e4c394',2)+R(235,135,320,45,'#a8cbd4',2)+L(235,70,235,205,ink,2,'stroke-dasharray="7 5"')+L(380,70,380,205,ink,2,'stroke-dasharray="7 5"')+T(190,55,'第一條 '+v.a+' 毫米',20)+T(465,210,'第二條 '+v.b+' 毫米',20)+T(305,248,'重疊：？毫米',23)+T(300,295,'接成後共 '+v.total+' 毫米；圖未依比例。',20);
 }
 else if(v.kind==='auditNumberLine')body=A(45,160,560,160)+[0,1,2,3,4].map((n)=>L(85+n*105,143,85+n*105,177)+T(85+n*105,215,n===0?'4750':n===3?'?':'',20)).join('')+A(85,105,400,105)+T(300,65,'向右移 3 格，每格增加 100',21);
 else if(v.kind==='auditRuler')body=R(30,170,540,80,'#efddb4',2)+Array.from({length:81},(_,i)=>L(40+i*6.5,170,40+i*6.5,i%10===0?207:i%5===0?196:184,ink,1)).join('')+[0,10,20,30,40,50,60,70,80].map(i=>T(40+i*6.5,232,i,17)).join('')+P('M92 120H514L535 137L514 150H92Z','#c9b16e')+T(300,300,'刻度單位：毫米；從物體左端量到右端。',19);
 else throw Error('未實作審查圖種：'+v.kind);
 if(v.kind==='auditBallTurns')h=390;
 return wrap(body,h,v.caption+'。依題目條件繪製的示意圖，不是原卷圖片或實拍照片。');
}
