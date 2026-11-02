/*audit-v17:start*/
window.AuditDiagrams={draw:function draw(v){
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
}};
/*audit-v17:end*/
(function(){
 'use strict';
 const palette=['#79b9b0','#e5a273','#8bace0','#b5a1d0','#e0bd64'];
 const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const registry=new Map();let serial=0;
 const txt=(x,y,s,size=20,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="#344f50" ${extra}>${escape(s)}</text>`;
 const line=(a,b,color='#527c80',width=3,dash='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${width}" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
 const polygon=(p,fill='#d9eee5',extra='')=>`<polygon points="${p.map(x=>x.join(',')).join(' ')}" fill="${fill}" stroke="#527c80" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
 const centered=(x,y,s,size=20)=>txt(x,y,s,size,'text-anchor="middle"');
 function kid(x,y,color='#7ba9cc',scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-13 61L-14 85M13 61L14 85" stroke="#617a97" stroke-width="12" stroke-linecap="round"/><path d="M-20 30L-36 51M20 30L36 51" stroke="#edbf91" stroke-width="10" stroke-linecap="round"/><rect x="-23" y="19" width="46" height="49" rx="14" fill="${color}"/><circle cy="-3" r="24" fill="#f2cda1"/><path d="M-23-6Q-30-35-6-31Q18-34 25-8Q8-4 0-18Q-11-5-23-6" fill="#66564e"/><circle cx="-8" cy="-1" r="2" fill="#4d4b47"/><circle cx="8" cy="-1" r="2" fill="#4d4b47"/><path d="M-6 9Q0 14 7 8" fill="none" stroke="#b56f60" stroke-width="2" stroke-linecap="round"/><path d="M-22 88H-7M7 88H23" stroke="#53665d" stroke-width="9" stroke-linecap="round"/></g>`;}
 function book(x,y,color='#92bfb0'){return `<g transform="translate(${x} ${y})"><path d="M0 8Q26-3 48 8Q72-3 98 8V66Q72 55 48 66Q24 55 0 66Z" fill="#fffef5" stroke="${color}" stroke-width="3"/><path d="M48 8V66M9 23H36M9 35H36M61 23H88M61 35H88" stroke="${color}" stroke-width="2"/></g>`;}
 function leaf(x,y,scale=1,fill='#79ad78'){return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0C-65-75-80-125 0-145C70-115 65-60 0 0Z" fill="${fill}" stroke="#5b8b65" stroke-width="2"/><path d="M0-7V-130M0-40L-25-65M0-40L25-65M0-76L-22-98M0-76L22-98" fill="none" stroke="#d4e5be" stroke-width="3"/></g>`;}
 function plant(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0V-155" stroke="#6e9c70" stroke-width="8"/>${leaf(-3,-50,.55)}${leaf(4,-102,.42,'#96c37f')}<g transform="translate(0 -168)">${[0,60,120,180,240,300].map(a=>`<ellipse cy="-18" rx="13" ry="23" fill="#e9b1a3" transform="rotate(${a})"/>`).join('')}<circle r="15" fill="#e8c96f"/></g><path d="M0 0L-22 33M0 0V50M0 0L23 33M-11 18L-35 26M12 18L36 27" stroke="#ae9274" stroke-width="5" fill="none"/></g>`;}
 function angleMark(p,prev,next,label,r=28){const a=[prev[0]-p[0],prev[1]-p[1]],b=[next[0]-p[0],next[1]-p[1]],na=Math.hypot(...a),nb=Math.hypot(...b),ua=a.map(x=>x/na),ub=b.map(x=>x/nb);let delta=Math.atan2(ub[1],ub[0])-Math.atan2(ua[1],ua[0]);while(delta>Math.PI)delta-=Math.PI*2;while(delta< -Math.PI)delta+=Math.PI*2;const mid=[ua[0]+ub[0],ua[1]+ub[1]],nm=Math.hypot(...mid)||1;return `<path d="M${p[0]+ua[0]*r} ${p[1]+ua[1]*r}A${r} ${r} 0 0 ${delta>0?1:0} ${p[0]+ub[0]*r} ${p[1]+ub[1]*r}" fill="none" stroke="#c38660" stroke-width="2"/>${centered(p[0]+mid[0]/nm*r*1.8,p[1]+mid[1]/nm*r*1.8+7,label,22)}`;}
 function cornerLabels(points,labels){return points.map((p,i)=>angleMark(p,points[(i+points.length-1)%points.length],points[(i+1)%points.length],labels[i])).join('');}
 function tick(a,b){const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);return line([x-dy/n*7,y+dx/n*7],[x+dy/n*7,y-dx/n*7],'#c38660',3);}
 function geometry(v){
  if(v.kind==='triangleAngles'){const a=v.angles[0]*Math.PI/180,b=v.angles[1]*Math.PI/180;let base=300,h=base/(1/Math.tan(a)+1/Math.tan(b));const scale=Math.min(1,205/h);base*=scale;h*=scale;const A=[225-base/2,270],B=[225+base/2,270],C=[A[0]+h/Math.tan(a),270-h],p=[A,B,C];return {box:'0 0 450 330',body:polygon(p)+cornerLabels(p,[v.angles[0]+'°',v.angles[1]+'°','?'])+centered(A[0]-15,A[1]+23,'A',17)+centered(B[0]+15,B[1]+23,'B',17)+centered(C[0],C[1]-15,'C',17),alt:`三角形，A 角 ${v.angles[0]} 度，B 角 ${v.angles[1]} 度，C 角為問號。`};}
  if(v.kind==='isosceles'){const h=190,half=h*Math.tan(v.vertex*Math.PI/360),p=[[225-half,265],[225+half,265],[225,75]];return {box:'0 0 450 330',body:polygon(p,'#f7e3c1')+cornerLabels(p,['?','?',v.vertex+'°'])+tick(p[0],p[2])+tick(p[1],p[2]),alt:`等腰三角形，頂角 ${v.vertex} 度，兩個底角標問號，兩腰有相同記號。`};}
  if(v.kind==='triangleSides'){const p=[[80,250],[365,250],[210,60]];return {box:'0 0 450 330',body:polygon(p)+txt(72,145,v.sides[0]+' 公分',20)+txt(310,145,v.sides[1]+' 公分',20)+line([80,280],[365,280],'#c38660',2,'6 4')+centered(225,315,'第三邊可變長短：？',21),alt:`三角形兩條已知邊為 ${v.sides[0]} 公分與 ${v.sides[1]} 公分，第三邊未知。邊長示意未按比例。`};}
  if(v.kind==='parallelogram'){const shift=125/Math.tan(v.known*Math.PI/180),p=[[45,275],[210,275],[210+shift,150],[45+shift,150]];return {box:'0 0 450 330',body:polygon(p,'#e4e5f3')+angleMark(p[0],p[3],p[1],v.known+'°')+angleMark(p[1],p[0],p[2],'?'),alt:`平行四邊形，一個內角 ${v.known} 度，與它相鄰的內角標問號。`};}
  const b=v.angles[1]*Math.PI/180,p=[[75,270],[315,270],[315-180/Math.tan(b),90],[75,90]];return {box:'0 0 450 330',body:polygon(p,'#f4dfd5')+cornerLabels(p,v.angles.map(a=>a==null?'?':a+'°')),alt:`四邊形三個已知內角為 ${v.angles.slice(0,3).join('、')} 度，第四角標問號。`};
 }
 function solid(shape,n=4){
  if(shape==='sphere')return '<circle cx="95" cy="92" r="65" fill="#b8d9d9" stroke="#527c80" stroke-width="3"/><path d="M54 57Q70 37 92 38" fill="none" stroke="#eef8f1" stroke-width="9" stroke-linecap="round"/>';
  if(shape==='cylinder')return '<path d="M35 42V140Q95 175 155 140V42" fill="#d3e5d1" stroke="#527c80" stroke-width="3"/><ellipse cx="95" cy="42" rx="60" ry="22" fill="#edf3dc" stroke="#527c80" stroke-width="3"/><path d="M35 140Q95 106 155 140" fill="none" stroke="#527c80" stroke-width="2" stroke-dasharray="5 4"/>';
  if(shape==='cone')return '<path d="M95 14L30 145Q95 180 160 145Z" fill="#f3ddb3" stroke="#527c80" stroke-width="3"/><path d="M30 145Q95 112 160 145" fill="none" stroke="#527c80" stroke-width="2" stroke-dasharray="5 4"/><circle cx="95" cy="14" r="4" fill="#527c80"/>';
  if(shape==='pyramid'){const base=Array.from({length:n},(_,i)=>[95+70*Math.cos(i*2*Math.PI/n-Math.PI/2),135+27*Math.sin(i*2*Math.PI/n-Math.PI/2)]),top=[95,14];return polygon(base,'#e2d8ec')+base.map(p=>line(top,p,'#7b7898',2,p[1]<135?'5 4':'')).join('')+base.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#527c80"/>`).join('')+'<circle cx="95" cy="14" r="4" fill="#527c80"/>';}
  const front=Array.from({length:n},(_,i)=>[72+52*Math.cos(i*2*Math.PI/n-Math.PI/2),109+52*Math.sin(i*2*Math.PI/n-Math.PI/2)]),back=front.map(([x,y])=>[x+48,y-40]);return polygon(back,'#eef4e6','stroke-dasharray="5 4"')+front.map((p,i)=>polygon([p,front[(i+1)%n],back[(i+1)%n],back[i]],i%2?'#dbe9e8':'#e8e9c9','fill-opacity=".5"')).join('')+polygon(front,'#c5e0d5','fill-opacity=".7"')+front.map((p,i)=>line(p,back[i],'#527c80',2)).join('')+[...front,...back].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#527c80"/>`).join('');
 }
 function solids(v){const models=v.models.flatMap(m=>Array.from({length:m.count},()=>m)),cols=Math.min(4,models.length),rows=Math.ceil(models.length/cols),names={prism:'角柱',pyramid:'角錐',sphere:'球',cylinder:'圓柱',cone:'圓錐'};return {box:`0 0 ${cols*210} ${rows*210}`,body:models.map((m,i)=>`<g transform="translate(${i%cols*210+10} ${Math.floor(i/cols)*210+5})">${solid(m.shape,m.n)}${centered(95,195,v.hideNames?'觀察模型':(m.n?['','','','三','四','五','六','七'][m.n]:'')+names[m.shape],18)}</g>`).join(''),alt:v.hideNames?'未標示名稱的立體模型，依題目條件觀察頂點與面的關係。':v.models.map(m=>`${m.count} 個${m.n?m.n+'角':''}${names[m.shape]}`).join('、')+'。虛線表示被遮住的邊。'};}
 function math(v){
  if(['triangleAngles','isosceles','triangleSides','parallelogram','quadrilateral'].includes(v.kind))return geometry(v);
  if(v.kind==='solids')return solids(v);
  if(v.kind==='placeValue')return {box:'0 0 600 250',body:v.digits.map((d,i)=>`<g transform="translate(${35+i*140} 45)"><rect width="120" height="155" rx="18" fill="${palette[i]}" fill-opacity=".23"/>${centered(60,42,['千位','百位','十位','個位'][i],22)}${centered(60,115,d,44)}</g>`).join(''),alt:v.digits.map((d,i)=>['千位','百位','十位','個位'][i]+d).join('，')};
  if(v.kind==='arithmetic'){const max=Math.max(String(v.a).length,String(v.b).length),xs=Array.from({length:max},(_,i)=>480-(max-1-i)*64),digits=(n,y)=>String(n).padStart(max,' ').split('').map((c,i)=>centered(xs[i],y,c,35)).join('');return {box:'0 0 600 300',body:xs.map(x=>`<rect x="${x-29}" y="25" width="58" height="235" fill="#f4f5e9" stroke="#e3e6d7"/>`).join('')+digits(v.a,90)+txt(xs[0]-62,158,v.operation,38)+digits(v.b,158)+line([xs[0]-65,183],[xs.at(-1)+35,183],'#527c80',3)+centered(340,243,'？',36),alt:`直式，${v.a} ${v.operation} ${v.b}，答案留白。`};}
  if(v.kind==='packing')return {box:'0 0 600 260',body:'<rect x="40" y="55" width="230" height="125" rx="18" fill="#dce9d6"/>'+centered(155,125,'共 '+v.total+' 枝筆',27)+'<rect x="355" y="55" width="200" height="125" rx="18" fill="#f2dfb8" stroke="#b9a77d" stroke-width="2"/>'+centered(455,107,'每盒 '+v.per+' 枝',25)+centered(455,150,'盒數：？',25)+line([285,115],[335,115]),alt:'共有 '+v.total+' 枝筆，每盒放 '+v.per+' 枝，盒數未知。'};
  if(v.kind==='equation')return {box:'0 0 600 230',body:`<rect x="45" y="60" width="510" height="78" rx="15" fill="#d6e9df"/><path d="M300 60V138" stroke="#fff" stroke-width="5"/>${centered(165,112,v.a,30)}${centered(425,112,'？',32)}${centered(300,195,'合計 '+v.total,25)}`,alt:`已知一部分 ${v.a}，另一部分未知，合計 ${v.total}。`};
  if(v.kind==='groups'){const count=Math.min(v.count,9),extra=v.count>9;return {box:'0 0 600 310',body:(count?Array.from({length:count},(_,i)=>`<g transform="translate(${20+i%3*195} ${25+Math.floor(i/3)*85})"><rect width="170" height="68" rx="13" fill="${palette[i%5]}" fill-opacity=".24" stroke="#b1c8b8"/>${centered(85,43,'每份 '+v.per,22)}</g>`).join(''):centered(300,125,'尚未放入任何一組',27))+(extra?centered(300,300,`圖示前 9 份；題目共有 ${v.count} 份`,18):centered(300,300,`共 ${v.count} ${v.unit||'組'}`,22)),alt:`每份 ${v.per}，共有 ${v.count} ${v.unit||'組'}。${extra?'圖只畫前九份。':''}`};}
  if(v.kind==='numberCards'){const n=v.numbers.length,w=Math.min(200,550/n),start=(600-n*w)/2;return {box:'0 0 600 240',body:v.numbers.map((value,i)=>`<g transform="translate(${start+i*w} 35)"><rect width="${w-12}" height="125" rx="16" fill="${palette[i%5]}" fill-opacity=".24"/>${centered((w-12)/2,112,value,Math.min(36,w/4))}</g>`).join('')+(v.note?centered(300,210,v.note,18):''),alt:'數字卡：'+v.numbers.join('、')};}
  if(v.kind==='lengths')return {box:'0 0 600 280',body:v.segments.map((s,i)=>`<g transform="translate(45 ${45+i*90})"><rect width="${Math.min(470,180+s.value*3)}" height="38" rx="8" fill="${palette[i]}"/>${txt(10,65,s.value+' '+s.label,24)}</g>`).join('')+(v.conversion?centered(300,250,'1 公分 = 10 毫米',22):''),alt:v.segments.map(s=>s.value+s.label).join('、')+'。長條未按比例，依標示計算。'};
  if(v.kind==='timelines')return {box:'0 0 600 280',body:v.intervals.map((n,i)=>`<g transform="translate(0 ${i*115})">${txt(35,40,`燈 ${i===0?'A':'B'}：每 ${n} 秒`,22)}${line([55,75],[555,75])}${[0,1,2,3].map(j=>`<circle cx="${65+j*150}" cy="75" r="7" fill="${palette[i]}"/>${centered(65+j*150,108,j*n,19)}`).join('')}</g>`).join(''),alt:v.intervals.map((n,i)=>`燈${i===0?'A':'B'}前幾次在0、${n}、${n*2}、${n*3}秒閃動`).join('；')+'。時間軸各自示意前幾次，不用點與點的螢幕距離推算時間。'};
  if(v.kind==='tiling')return {box:'0 0 600 300',body:`<rect x="55" y="60" width="310" height="170" rx="4" fill="#e0eee1" stroke="#527c80" stroke-width="3"/>${centered(210,43,v.width+' 公分',23)}${txt(378,152,v.height+' 公分',23)}<rect x="465" y="185" width="80" height="80" fill="#f3dfbc" stroke="#b78c5d" stroke-width="3" stroke-dasharray="7 4"/>${centered(505,238,'？',28)}${centered(500,292,'正方形邊長',18)}`,alt:`長方形長寬為 ${v.width} 與 ${v.height} 公分，另有邊長未知的正方形，示意未按比例。`};
  return null;
 }
 function drink(x,y,name){const color=/soy/.test(name)?'#f4e8c9':/chocolate|coffee/.test(name)?'#9c7560':/cola/.test(name)?'#73574e':/soda/.test(name)?'#d9e8c1':'#c7a669';return `<g transform="translate(${x} ${y})"><path d="M-33 0H33L26 98H-26Z" fill="${color}" stroke="#8a9d8b" stroke-width="3"/><path d="M-30 16H31M17-25L10 76" stroke="#fffaf0" stroke-width="5"/>${/bubble/.test(name)?[[-10,80],[8,78],[0,90],[15,90],[-18,91]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#6d6559"/>`).join(''):''}${centered(0,135,name,21)}</g>`;}
 function fruit(x,y,name,scale=1){
  if(/guava|pear|kiwi|papaya/.test(name)){
   const shape=/pear/.test(name)?'<path d="M-14-30Q-28-5-38 18Q-45 65 0 65Q45 65 38 18Q28-5 14-30Z" fill="#c3cf7b" stroke="#6f966a" stroke-width="3"/>':/papaya/.test(name)?'<ellipse cy="12" rx="25" ry="53" fill="#e4a35f" stroke="#9f956c" stroke-width="3"/><ellipse cy="12" rx="11" ry="35" fill="#64584c"/>':/kiwi/.test(name)?'<ellipse cy="12" rx="40" ry="33" fill="#9d8868" stroke="#7e715c" stroke-width="3"/>':'<path d="M-35-12Q-40-34-8-32Q20-40 35-12Q50 40 18 52Q-18 65-38 30Z" fill="#a8c681" stroke="#6f966a" stroke-width="3"/>';
   return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+shape+'<path d="M0-30V-45" stroke="#6f966a" stroke-width="4"/></g>';
  }
const banana=/banana/.test(name),grape=/grape/.test(name),pine=/pineapple/.test(name),orange=/orange|papaya/.test(name);return `<g transform="translate(${x} ${y}) scale(${scale})">${banana?'<path d="M-25-25Q-25 35 35 18Q4 63-30 20Q-48-4-25-25" fill="#efd16f" stroke="#be9e55" stroke-width="3"/>':grape?[[-15,-10],[10,-10],[-28,12],[-3,12],[23,12],[-14,34],[12,34],[0,54]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="14" fill="#af9ac5" stroke="#fff7ed"/>`).join(''):`<${pine?'ellipse':'circle'} cx="0" cy="12" ${pine?'rx="35" ry="48"':'r="39"'} fill="${pine?'#e8bf65':orange?'#e9a166':'#c78177'}" stroke="#9f956c" stroke-width="2"/>`}${pine?'<path d="M0-35L-20-65L0-55L20-70L16-42" fill="#7ba57b"/>':'<path d="M0-27Q-3-47 17-48M7-32Q24-49 33-31Q18-22 7-32" fill="#87af79" stroke="#6f966a" stroke-width="2"/>'}</g>`;}
 function bars(v){const rows=v.table?.rows||[['甲',4],['乙',8],['丙',6]],data=rows.map(r=>Number(r.at(-1))),max=Math.max(...data.filter(Number.isFinite),1);return `<g>${line([70,250],[550,250],'#9bad9c',2)}${rows.map((r,i)=>{const value=Number(r.at(-1)),height=Number.isFinite(value)?value/max*160:65;return `<rect x="${100+i*140}" y="${250-height}" width="85" height="${height}" rx="10" fill="${palette[i%5]}"/>${centered(142+i*140,238-height,Number.isFinite(value)?value:'？',23)}${centered(142+i*140,282,String(r[0]).split('：')[0],20)}`;}).join('')}</g>`;}
 function animalInsect(name){return /螳螂/.test(name)?'<path d="M-8-45L3 55M-5-15L-39 15L-24-12M-4-15L30 7L23-15M0 18L-35 58M2 18L40 58" stroke="#83a96b" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M-8-42L-25-60L12-60Z" fill="#83a96b"/>':/蜻蜓/.test(name)?'<ellipse cx="-30" cy="-18" rx="38" ry="12" fill="#b8d9dc"/><ellipse cx="30" cy="-18" rx="38" ry="12" fill="#b8d9dc"/><ellipse cx="-30" cy="10" rx="38" ry="12" fill="#b8d9dc"/><ellipse cx="30" cy="10" rx="38" ry="12" fill="#b8d9dc"/><path d="M0-45V60" stroke="#8aa77c" stroke-width="9"/><circle cy="-38" r="11" fill="#8aa77c"/>':/瓢蟲/.test(name)?'<ellipse rx="37" ry="46" fill="#cf8976"/><path d="M0-45V45" stroke="#52685c" stroke-width="3"/><circle cy="-47" r="16" fill="#52685c"/>'+[[-19,-20],[18,-20],[-17,16],[17,16]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#52685c"/>`).join(''):'<ellipse cx="-27" cy="-16" rx="30" ry="40" fill="#d2b5d0"/><ellipse cx="27" cy="-16" rx="30" ry="40" fill="#d2b5d0"/><ellipse cy="-5" rx="8" ry="48" fill="#8e9d80"/><path d="M-4-48L-18-65M4-48L18-65" stroke="#8e9d80" stroke-width="3"/>';}
 function scene(v){const rows=v.table?.rows;
  if(v.kind==='menu')return {body:`<rect x="80" y="30" width="440" height="255" rx="24" fill="#fffdf5" stroke="#d3c8a9" stroke-width="3"/>${centered(300,65,v.heading||'MENU',27)}${v.items.map((name,i)=>drink(600/(v.items.length+1)*(i+1),105,name)).join('')}`,alt:'菜單供應：'+v.items.join('、')};
  if(v.kind==='fruitList'){const fruits=[...new Set((rows||[]).map(r=>String(r[0]).match(/apples|bananas|oranges|grapes|papayas|kiwis|guavas|pineapples|pears|strawberries/)?.[0]||String(r[0])))].slice(0,2);return {body:fruits.map((name,i)=>fruit(180+i*240,125,name,1.1)+centered(180+i*240,235,name,23)).join(''),alt:'水果準備圖，需求與現有數量見資料表。'};}
  if(v.kind==='nameCards')return {body:(rows||[]).map((r,i)=>`<rect x="${25+i*190}" y="25" width="170" height="265" rx="20" fill="${palette[i%5]}" fill-opacity=".18"/>${kid(110+i*190,87,palette[i],.8)}${centered(110+i*190,210,r[0],24)}${r[1]!=null?centered(110+i*190,255,'Age: '+r[1],25):''}`).join(''),alt:'人物姓名卡，姓名與年齡見圖卡及資料表。'};
  if(v.kind==='plantParts'||v.kind==='seedlings'){const label=part=>rows?.find(r=>r[1]===part)?.[0]||part;return {body:v.kind==='seedlings'?`<path d="M120 250H480" stroke="#c5ad8b" stroke-width="12"/>${plant(200,215,.7)}${plant(405,215,.85)}${centered(200,295,rows?.[0]?.[0]||'觀察盆栽',21)}${centered(405,295,rows?.[1]?.[0]||'記錄變化',21)}`:`<rect x="80" y="232" width="440" height="60" rx="16" fill="#d9c3a0"/>${plant(300,230,.9)}${txt(425,68,label('花'),24)}${line([410,65],[320,76])}${txt(100,120,label('葉'),24)}${line([140,116],[260,142])}${txt(430,195,label('莖'),24)}${line([414,185],[308,185])}${txt(120,285,label('根'),24)}${line([160,278],[280,255])}`,alt:v.kind==='seedlings'?'兩盆小苗的觀察情境，生長數值請看紀錄表。':'植物包含花、葉、莖與根，圖卡標記與部位請對照資料表。'};}
  if(v.kind==='leaves')return {body:[0,1,2].map(j=>{const r=rows?.[j]||[['甲','同一節兩片相對','網狀'],['乙','交錯長出','平行'],['丙','同一節三片以上','網狀']][j],parallel=String(r[2]).includes('平行'),l=(x,y,flip=false)=>'<g transform="translate('+x+' '+y+')'+' rotate('+(flip?55:-55)+')">'+(parallel?'<path d="M0 0Q-85-70-12-110Q45-60 0 0Z" fill="#8ab37b"/><path d="M-4-7Q-30-65-14-100M-12-12Q-50-68-18-98M3-16Q-10-60-9-96" fill="none" stroke="#d9e9bd" stroke-width="3"/>':leaf(0,0,.65))+'</g>',opposite=String(r[1]).includes('相對'),alternate=/交錯|錯開/.test(String(r[1]));return '<g transform="translate('+(120+j*180)+' 250)"><path d="M0 0V-175" stroke="#719b6c" stroke-width="5"/>'+l(-3,-55)+(opposite?l(3,-55,true):alternate?l(3,-110,true):l(3,-55,true)+leaf(0,-55,.65,'#b1c987')) +centered(0,35,r[0],24)+'</g>';}).join(''),alt:'三株植物的葉片排列與葉脈示意，標籤對應本篇紀錄表。'};
  if(v.kind==='animalFamily')return {body:[0,1,2].map(j=>{const name=rows?.[j]?.[0]||['雞','兔','蝴蝶'][j],insect=/蝴蝶|蛾|瓢蟲|蜻蜓|螳螂/.test(name),bird=/雞|鴨/.test(name),body=insect?animalInsect(name):bird?'<ellipse cy="20" rx="49" ry="37" fill="#e1bd7b"/><circle cx="25" cy="-20" r="28" fill="#e1bd7b"/><path d="M49-26L77-14L49-7" fill="#c58b56"/><circle cx="32" cy="-26" r="4" fill="#465b54"/><path d="M-10 50V80M15 50V80" stroke="#ae9265" stroke-width="5"/>':'<ellipse cy="25" rx="52" ry="35" fill="#c7b1a0"/><circle cx="28" cy="-10" r="30" fill="#c7b1a0"/><ellipse cx="17" cy="-44" rx="9" ry="'+(/兔/.test(name)?'31':'17')+'" fill="#c7b1a0"/><ellipse cx="38" cy="-44" rx="9" ry="'+(/兔/.test(name)?'31':'17')+'" fill="#c7b1a0"/><circle cx="36" cy="-16" r="4" fill="#465b54"/><path d="M-25 46V75M23 46V75" stroke="#a38e7b" stroke-width="10"/>';return '<g transform="translate('+(110+j*185)+' 155)">'+body+centered(0,130,name,23)+'</g>';}).join(''),alt:'本篇紀錄中的三種動物外形情境，出生與育幼方式請讀紀錄表。'};
  if(v.kind==='plantFood')return {body:`<g transform="translate(120 130)"><path d="M-28-10L28-10L0 105Z" fill="${/白蘿蔔/.test(rows?.[0]?.[0]||'')?'#f0ead9':/地瓜/.test(rows?.[0]?.[0]||'')?'#bd927d':'#dfad75'}" stroke="#ad885e" stroke-width="3"/><path d="M0-10L-20-65M0-10V-75M0-10L25-60" stroke="#7ba876" stroke-width="9"/></g>${leaf(310,232,.95)}<g transform="translate(480 170)"><ellipse cx="-18" rx="30" ry="42" fill="#ae786d" transform="rotate(-25)"/><ellipse cx="23" cy="30" rx="28" ry="38" fill="#bc8e76" transform="rotate(20)"/></g>${[0,1,2].map(j=>centered(120+j*180,285,rows?.[j]?.[0]||['根的例子','葉的例子','種子的例子'][j],22)).join('')}`,alt:'食物部位示意，名稱與主要食用部位請對照資料表。'};
  if(v.kind==='birds')return {body:[0,1,2].map(j=>`<g transform="translate(${110+j*185} 145)"><ellipse cy="28" rx="48" ry="38" fill="${palette[j]}"/><circle cx="20" cy="-15" r="32" fill="${palette[j]}"/><circle cx="30" cy="-21" r="4" fill="#42545a"/><path d="M44-19L${j===1?95:76}-${j===2?8:14}L44 0" fill="#dca863"/><path d="M-12 59V86M12 59V86" stroke="#b28c65" stroke-width="4"/>${centered(0,130,rows?.[j]?.[0]||['觀察外形','觀察行為','閱讀紀錄'][j],20)}</g>`).join(''),alt:'動物觀察情境，物種與行為資料以本篇表格為準。'};
  if(v.kind==='teamAnimals')return {body:[0,1,2].map(j=>{const label=rows?.[j]?.[0]||['螞蟻搬運','蝴蝶取食','鳥群休息'][j],body=j===0?'<g stroke="#8f7e61" stroke-width="4" fill="#8f7e61"><ellipse cx="-30" rx="18" ry="13"/><ellipse rx="16" ry="11"/><circle cx="27" r="13"/><path d="M-15-8L-25-34M-15 8L-25 33M10-8L20-34M10 8L20 33" fill="none"/></g>'+leaf(0,-25,.4):j===1?animalInsect('蝴蝶'):'<ellipse cy="15" rx="40" ry="28" fill="#96b5cc"/><circle cx="27" cy="-10" r="22" fill="#96b5cc"/><path d="M45-15L68-7L45 1" fill="#d6b474"/><circle cx="32" cy="-16" r="3" fill="#3e5b58"/>';return '<g transform="translate('+(110+j*185)+' 150)">'+body+centered(0,130,label,20)+'</g>';}).join(''),alt:'螞蟻搬運、蝴蝶各自取食與鳥群休息的三種行為情境。'};
  if(v.kind==='camouflage')return {body:`<rect x="50" y="40" width="500" height="220" rx="26" fill="#a9c59a"/>${[0,1,2].map((j)=>`<g transform="translate(${140+j*160} ${115+j%2*70})"><ellipse rx="31" ry="18" fill="${(v.colors||['#5e9c63','#df6e61','#e6bb51'])[j]}"/>${[-1,1].flatMap(s=>[-12,0,12].map(y=>line([s*20,y],[s*43,y-10],(v.colors||['#5e9c63','#df6e61','#e6bb51'])[j],4))).join('')}</g>`).join('')}${centered(300,297,'紙模型與背景色的比較',21)}`,alt:'綠色背景上的綠、紅、黃紙模型，尋找秒數請看資料表。'};
  if(v.kind==='sound')return {body:`${[0,1].map(j=>`<g transform="translate(0 ${j*125})">${txt(40,55,j?'較用力撥':'輕撥',23)}<path d="M190 55Q215 ${55-(j?35:12)} 240 55T290 55T340 55T390 55T440 55T490 55T540 55" fill="none" stroke="${palette[j]}" stroke-width="5"/></g>`).join('')}${centered(300,298,'振動幅度示意，不代表實際波形量測',18)}`,alt:'輕撥與較用力撥的振幅示意；兩幅的週期畫法相同，振幅不同。'};
  if(v.kind==='shadow')return {body:`<path d="M115 80L490 38V258L115 155Z" fill="#f6df9a" fill-opacity=".5"/><rect x="40" y="87" width="100" height="60" rx="13" fill="#8bacc0"/><rect x="470" y="30" width="65" height="245" rx="9" fill="#eee9da" stroke="#9eab9c"/><rect x="287" y="125" width="24" height="90" rx="6" fill="#ba946c"/><rect x="485" y="85" width="25" height="145" rx="6" fill="#6d7d75"/>${centered(95,300,'光源',21)}${centered(300,300,'同一模型',21)}${centered(500,300,'屏幕',21)}`,alt:'光源、同一不透明模型與屏幕的情境示意，高度數據依本篇紀錄表。'};
  if(v.kind==='mirror')return {body:`<rect x="110" y="238" width="385" height="18" rx="8" fill="#aec9d3"/>${line([120,65],[300,238],'#d6a759',6)}${line([300,238],[480,65],'#d6a759',6)}<path d="M197 128L215 159L182 152M390 143L420 125L412 158" fill="none" stroke="#c58f4b" stroke-width="4"/>${centered(300,298,'鏡面與光的反射路徑示意',22)}`,alt:'光照到鏡面後轉向的反射路徑示意，方向依箭頭判讀。'};
  if(v.kind==='refraction')return {body:`<path d="M155 45H445L420 270H180Z" fill="#eef5ef" stroke="#8bb2bc" stroke-width="3"/><path d="M167 145H432L420 269H180Z" fill="#b9dce7" fill-opacity=".8"/><path d="M240 18L285 145L335 245" fill="none" stroke="#d29273" stroke-width="13" stroke-linecap="round"/>${line([120,145],[480,145],'#88b5c5',2,'6 4')}${txt(465,137,'水面',20)}${centered(300,305,'部分在水中時，看起來像彎折',21)}`,alt:'吸管部分在水中時，從側面看似彎折的示意；取出後實際形狀請看觀察紀錄。'};
  if(v.kind==='syringes'||v.kind==='pistons'){const positions=v.kind==='syringes'?[v.airAfter||6,10]:[7,7];return {body:[0,1].map(j=>`<g transform="translate(40 ${50+j*130})">${txt(0,0,j?'水':'空氣',23)}<rect x="110" y="15" width="350" height="57" rx="8" fill="${j?'#c3e0e7':'#eff2df'}" stroke="#6f9ba5" stroke-width="3"/>${Array.from({length:11},(_,i)=>line([120+i*32,15],[120+i*32,25],'#7a9799',2)).join('')}<path d="M${120+positions[j]*32} 12V75M${120+positions[j]*32} 43H520M520 22V66" fill="none" stroke="#b39270" stroke-width="8"/></g>`).join(''),alt:v.kind==='syringes'?'同樣裝置中，封住出口後空氣較容易壓縮，數值請看紀錄表。':'空氣或水在適當連接裝置中傳送動力的情境，接頭與結果依紀錄表。'};}
  if(v.kind==='cupAir')return {body:[0,1].map(j=>`<g transform="translate(${70+j*280} 55)"><rect y="95" width="220" height="150" rx="24" fill="#c6e3e6"/><g transform="rotate(${j?24:0} 110 145)"><path d="M60 175V25H160V175" fill="#fffdf3" fill-opacity=".8" stroke="#8ba9aa" stroke-width="3"/><rect x="78" y="37" width="63" height="14" rx="4" fill="#eadbb9"/></g>${j?[0,1,2].map(k=>`<circle cx="${185+k*8}" cy="${120-k*30}" r="${10-k*2}" fill="#f7ffff" stroke="#8bb5bf"/>`).join(''):''}${centered(110,255,j?'傾斜杯子':'垂直放入',22)}</g>`).join(''),alt:'倒扣杯垂直入水與傾斜入水的兩種做法示意；是否濕與氣泡依本篇紀錄。'};
  if(v.kind==='wind')return {body:`<circle cx="125" cy="145" r="75" fill="#e3eae5" stroke="#7d9da3" stroke-width="4"/>${[0,120,240].map(a=>`<ellipse cx="125" cy="114" rx="20" ry="38" fill="#9ebdc9" transform="rotate(${a} 125 145)"/>`).join('')}<circle cx="125" cy="145" r="14" fill="#7b9faa"/><path d="M125 220V275H180" stroke="#7d9da3" stroke-width="10" fill="none"/>${[0,1,2].map(j=>`<path d="M240 ${90+j*55}Q295 ${72+j*55} 350 ${90+j*55}" fill="none" stroke="#afc9ca" stroke-width="4" stroke-dasharray="10 6"/>`).join('')}<g transform="translate(465 142)">${[0,90,180,270].map((a,j)=>`<path d="M0 0L-12-72L53-47Z" fill="${palette[j]}" transform="rotate(${a})"/>`).join('')}<circle r="11" fill="#f7e4b9"/><path d="M0 12V144" stroke="#ae8f70" stroke-width="7"/></g>`,alt:'電風扇使空氣流動並推動紙風車的示意，轉圈數依資料表。'};
  if(v.kind==='communityMap'){const list=rows||[['西北','圖書館'],['東北','活動中心'],['西南','學校'],['東南','公園']];return {body:list.map((r,j)=>`<rect x="${80+j%2*270}" y="${35+Math.floor(j/2)*145}" width="190" height="105" rx="20" fill="${palette[j]}" fill-opacity=".27"/>${centered(175+j%2*270,76+Math.floor(j/2)*145,r[0],19)}${centered(175+j%2*270,113+Math.floor(j/2)*145,r[1],24)}`).join('')+`<path d="M300 102V15L289 35M300 15L311 35" fill="none" stroke="#5f7b68" stroke-width="3"/>${centered(300,300,'北方在上；方位示意，不是道路圖',18)}`,alt:list.map(r=>r.join('：')).join('；')+'。北方在上，未提供真實路線與距離。'};}
  if(v.kind==='taiwan')return {body:`<path d="M335 25L355 55L344 82L355 112L330 150L315 194L280 246L250 280L229 263L240 226L238 196L265 148L273 114L289 88L300 54Z" fill="#a6c393" stroke="#6e9479" stroke-width="3"/>${centered(126,166,'臺灣海峽',22)}${centered(481,155,'太平洋',22)}${centered(280,24,'東海',22)}${centered(305,309,'巴士海峽',22)}<path d="M500 87V25L490 43M500 25L510 43" stroke="#7c9581" stroke-width="3" fill="none"/>${txt(520,41,'北',20)}`,alt:'臺灣周邊海域示意：西側臺灣海峽、東側太平洋、北側東海、南側巴士海峽，不用來量距離。'};
  if(['rain','votes','beforeAfter'].includes(v.kind))return {body:bars(v),alt:'依本篇資料繪製的長條圖。數值、項目與單位見下方資料表。'};
  if(v.kind==='terrain'||v.kind==='landUse')return {body:[0,1,2].map(j=>`<g transform="translate(${20+j*195} 40)"><rect width="170" height="210" rx="18" fill="${palette[j]}" fill-opacity=".15"/><path d="${j===0?'M5 150L165 150L165 210H5Z':j===1?'M5 210L42 115L74 155L110 60L165 210Z':'M5 100L45 170L125 170L165 100L165 210H5Z'}" fill="${['#b3c992','#a6b8a4','#b4a8bb'][j]}"/>${centered(85,247,rows?.[j]?.[0]||['平坦','起伏','中央低'][j],22)}</g>`).join(''),alt:'地勢外形的簡化示意，高度與判斷條件請對照資料表及文字。'};
  if(v.kind==='river')return {body:`<path d="M30 115L100 25L173 136L235 65L310 160" fill="#b8c9ad"/><path d="M161 88C340 95 120 180 300 205S400 270 545 280" fill="none" stroke="#a1cad7" stroke-width="31" stroke-linecap="round"/>${[[167,95],[260,203],[507,280]].map((p,j)=>`<circle cx="${p[0]}" cy="${p[1]}" r="17" fill="#f8e1a9"/>${centered(p[0],p[1]+7,rows?.[j]?.[0]||['甲','乙','丙'][j],20)}`).join('')}<path d="M322 212L346 223L320 233" fill="none" stroke="#6f9db4" stroke-width="5"/>`,alt:'由較高上游流向中游與下游出海處的虛構河流示意；位置標記與資料表對應。'};
  if(['teamwork','duty','culture'].includes(v.kind))return {body:[0,1,2].map(j=>kid(110+j*190,110,palette[j],1.05)+centered(110+j*190,258,rows?.[j]?.[0]||['互相欣賞','一起討論','共同完成'][j],22)).join(''),alt:'三位成員分享與合作的情境，實際角色與分工依文章及資料表。'};
  if(['schedule','studySteps','resources','libraryRules','sharedSpace'].includes(v.kind))return {body:`<rect x="200" y="30" width="340" height="245" rx="20" fill="#f1ebd3"/>${[0,1,2].map(j=>`<rect x="230" y="${55+j*67}" width="270" height="48" rx="9" fill="${palette[j]}" fill-opacity=".6"/>${txt(245,87+j*67,rows?.[j]?.[0]||['想一想','討論與記錄','檢查結果'][j],20)}`).join('')}${kid(100,160,'#88b9a8',1.1)}`,alt:'討論、計畫與紀錄的情境圖；各項內容與關係請看資料表。'};
  const s=v.scene||'reading';
  if(s==='climb')return {body:`<rect x="180" y="20" width="300" height="270" rx="22" fill="#d7dcd1"/>${[0,1,2,3].flatMap(r=>[0,1,2].map(c=>`<ellipse cx="${225+c*90+r%2*15}" cy="${60+r*60}" rx="14" ry="9" fill="${palette[(r+c)%5]}"/>`)).join('')}<path d="M325 20V150" stroke="#bd9472" stroke-width="4"/>${kid(330,150,'#e1aa76',.9)}${kid(105,220,'#89b7b0',.75)}`,alt:'在適當裝備與陪同下觀察攀登活動的情境示意。'};
  if(s==='landscape'||s==='map')return {body:`<path d="M10 230L130 50L270 230Z" fill="#b7caa9"/><path d="M220 250L365 90L590 250Z" fill="#d0d7bc"/><path d="M220 100C400 150 180 220 400 310" fill="none" stroke="#a2cbd3" stroke-width="38"/><rect x="40" y="35" width="145" height="100" rx="18" fill="#eee4ca"/><circle cx="114" cy="85" r="34" fill="#8cabb8"/><circle cx="114" cy="85" r="19" fill="#e6f1ed"/>${kid(510,195,'#d8b174',.8)}`,alt:'山川、觀察與相機的情境示意，非實際地區測繪。'};
  if(s==='museum')return {body:`<rect x="45" y="30" width="215" height="175" fill="#fff9e6" stroke="#c9a980" stroke-width="12"/><path d="M60 185L120 75L175 155L240 100V190Z" fill="#b9c8a2"/><rect x="315" y="30" width="215" height="175" fill="#f1e2d4" stroke="#c9a980" stroke-width="12"/><circle cx="425" cy="85" r="33" fill="#eacba3"/>${kid(190,220,'#89b6b0',.7)}${kid(400,220,'#d8ad7f',.7)}`,alt:'學生仔細觀察不同畫作的情境示意。'};
  if(s==='shop'||s==='charity')return {body:`<path d="M80 95L110 30H490L520 95" fill="#d5a385"/>${[0,1,2,3,4,5].map(j=>`<path d="M${80+j*73} 95V115Q${116+j*73} 140 ${153+j*73} 115V95" fill="${j%2?'#faefd8':'#9cbdb1'}"/>`).join('')}<rect x="95" y="135" width="410" height="145" rx="12" fill="#efe5cc"/>${s==='charity'?book(250,183):`<ellipse cx="300" cy="206" rx="75" ry="37" fill="#deb67f"/><path d="M260 195L275 209M290 184L305 200M320 189L333 206" stroke="#b98e60" stroke-width="4"/>`}${kid(100,215,'#9cb6d6',.65)}${kid(495,215,'#dca680',.65)}`,alt:s==='charity'?'同學一起整理書籍、進行義賣的情境示意。':'店面招牌、圖案與商品的情境示意。'};
  if(s==='animation')return {body:`${[0,1,2].map(j=>`<rect x="${25+j*195}" y="45" width="175" height="205" rx="12" fill="#e8eee1" stroke="#c7d4c3" stroke-width="3"/><circle cx="${110+j*195}" cy="143" r="28" fill="${palette[j]}"/><path d="M${90+j*195} 140L${65+j*195} ${100+j*35}M${130+j*195} 140L${154+j*195} ${100+j*35}" stroke="${palette[j]}" stroke-width="13" stroke-linecap="round"/>${centered(110+j*195,225,j+1,22)}`).join('')}${centered(300,295,'連續畫面的變化與順序',22)}`,alt:'三張依序排列、動作逐漸變化的圖像示意。'};
  if(s==='garden')return {body:`<rect x="100" y="235" width="410" height="50" rx="16" fill="#d9c09a"/>${plant(250,235,.9)}${plant(410,235,.65)}${kid(90,185,'#92b7c4',.9)}`,alt:'照顧與觀察花圃植物的情境示意。'};
  return {body:`<rect x="180" y="200" width="330" height="24" rx="10" fill="#c5ad87"/><path d="M205 223V290M480 223V290" stroke="#b99d78" stroke-width="12"/>${book(280,127)}${kid(105,185,'#8cbcb0',1.0)}${kid(525,185,'#e0af7d',.85)}<rect x="220" y="25" width="210" height="82" rx="16" fill="#eee5c8"/>${[0,1,2].map(j=>`<rect x="${238+j*60}" y="40" width="43" height="47" rx="7" fill="${palette[j]}" fill-opacity=".8"/>`).join('')}`,alt:'人物在桌邊閱讀、討論與安排工作的情境示意。'};
 }
 function supplement(v){
  const t=(x,y,s,size=20)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#233c36">${escape(s)}</text>`;
  const rect=(x,y,w,h,fill='#e2eee7')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#35594c" stroke-width="2"/>`;
  const line=(x,y,a,b)=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="#35594c" stroke-width="2"/>`;
  let body='',box='0 0 650 330';
  if(v.kind==='quantityBars'||v.kind==='rodCompare'){
   const max=Math.max(...v.values.filter(x=>x!==null));
   v.values.forEach((n,i)=>{const y=45+i*80,w=n===null?240:n/max*420;body+=t(90,y+25,v.labels?.[i]||['甲','乙','丙','丁'][i],18)+rect(160,y,w,35)+t(160+w/2,y+25,(n??'？')+' '+(v.unit||''));});
   body+=t(325,310,v.total||'依標示數值計算；未知長度未按比例',18);
  }else if(v.kind==='quantityFlow'){
   box='0 0 650 260';v.labels.forEach((label,i)=>{const x=20+i*158;body+=rect(x,65,135,105)+label.match(/.{1,7}/gu).map((s,j)=>t(x+67,108+j*26,s,19)).join('');if(i<v.labels.length-1)body+=t(x+146,127,'→',25);});
  }else if(v.kind==='placePiles'){
   box='0 0 650 400';v.counts.forEach((n,i)=>{const x=20+i*158;body+=rect(x,45,145,290,'#fff')+t(x+72,30,['千','百','十','個'][i],24);for(let j=0;j<n;j++){const xx=x+15+j%3*40,yy=65+Math.floor(j/3)*42;body+=rect(xx,yy,28,28,['#a8c8bb','#d6d8a9','#dfbf98','#aac8db'][i]);}body+=t(x+72,365,n+' 個'+['千','百','十','一'][i]);});
  }else if(v.kind==='repeatGroups'){
   box='0 0 650 310';v.rows.forEach((r,i)=>{const y=45+i*110,w=Math.min(65,500/r.count);body+=t(58,y+35,r.label);for(let j=0;j<r.count;j++)body+=rect(110+j*w,y,w-6,60)+t(110+j*w+(w-6)/2,y+36,r.per,18);});body+=t(325,290,v.note||'每個方框是一組，框內標示每組數量。',18);
  }else if(v.kind==='dotArray'){
   for(let r=0;r<v.rows;r++)for(let c=0;c<v.cols;c++)body+=`<circle cx="${180+c*40}" cy="${40+r*40}" r="10" fill="#497969"/>`;body+=t(325,310,'試想其他排法；不是所有排列都符合條件。',18);
  }else if(v.kind==='labelledAngles'){
   v.angles.forEach((a,i)=>{const x=55+i*210,y=210,rad=a*Math.PI/180;body+=line(x,y,x+140,y)+line(x,y,x+140*Math.cos(rad),y-140*Math.sin(rad))+`<path d="M${x+40} ${y} A40 40 0 0 0 ${x+40*Math.cos(rad)} ${y-40*Math.sin(rad)}" fill="none" stroke="#b87449"/>`+t(x+90,y-15,a+'°');});
  }else if(v.kind==='equalStrips'){
   const w=500/v.count;for(let i=0;i<v.count;i++)body+=rect(75+i*w,100,w,50)+t(75+(i+.5)*w,133,'？');body+=line(75,190,575,190)+line(75,180,75,200)+line(575,180,575,200)+t(325,230,'合計 '+v.total);
  }else if(v.kind==='splitArray'){
   for(let i=0;i<v.count;i++)body+=rect(80,35+i*48,360,42)+rect(440,35+i*48,72,42,'#f0dcc0')+t(260,63+i*48,v.a)+t(476,63+i*48,v.b);body+=t(325,310,'每一列都是 '+v.a+'＋'+v.b+'，共有 '+v.count+' 列。');
  }else if(v.kind==='verticalProblem'){
   body=v.lines.map((s,i)=>t(325,65+i*75,s,40)).join('')+line(230,170,420,170);
  }else if(v.kind==='intervalTracks'){
   v.intervals.forEach((n,i)=>{const y=95+i*125;body+=line(70,y,600,y)+t(80,y-42,i?'乙':'甲');for(let k=0;k<=v.max;k+=n){const x=90+k/v.max*490;body+=line(x,y-12,x,y+12)+t(x,y+40,k,19);}});
   }else if(v.kind==='overlapStrips'){
   const scale=500/(v.a+v.b-v.overlap),x=65+(v.a-v.overlap)*scale;
   body+=rect(65,75,v.a*scale,32)+rect(x,135,v.b*scale,32,'#f0dcc0')+t(65+v.a*scale/2,60,v.a+' 毫米')+t(x+v.b*scale/2,205,v.b+' 毫米')+line(x,110,x,240)+line(65+v.a*scale,110,65+v.a*scale,240)+t(x+v.overlap*scale/2,275,'重疊 '+v.overlap+' 毫米',18);
  }else if(v.kind==='cutStrip'){
   let x=60;for(const n of v.cuts){const w=n/v.total*530;body+=rect(x,100,w,50)+t(x+w/2,132,n);x+=w;}body+=rect(x,100,590-x,50,'#f0dcc0')+t((x+590)/2,132,'？')+line(60,70,590,70)+t(325,45,'原長 '+v.total+' '+v.unit)+t(325,230,'各段緊接，沒有重疊或裁切損耗。',18);
  }else if(v.kind==='rulerMove'){
   box='0 0 650 360';const scale=550/v.max,X=n=>55+n*scale;
   for(const [i,start,end]of [[0,v.start,v.end],[1,v.shift,null]]){const y=85+i*165;body+=line(55,y,605,y);for(let n=0;n<=v.max;n++)body+=line(X(n),y,X(n),y+(n%10===0?20:n%5===0?13:7))+(n%10===0?t(X(n),y+43,n,17):'');const right=end??start+(v.end-v.start);body+=rect(X(start),y-28,(right-start)*scale,16)+line(X(start),y-30,X(start),y+8)+line(X(right),y-30,X(right),y+8)+t(X(start),y-40,start,18)+t(X(right),y-40,end??'？',18);}
   body+=t(325,345,'刻度單位：毫米；同一根細棒只平移，不伸縮。',18);
  }else return null;
  return {body,box,alt:v.caption+'。圖上標示為題目已知條件，問號為待求量。'};
 }

 function subjectDiagram(v){
  if(v.kind!=='subjectScene')return null;
  if(v.mode==='camouflage'||v.mode==='plantFood')return scene({...v,kind:v.mode});
  const m=v.mode,rows=v.table?.rows||[],stroke='#385c56',blue='#86bed2',green='#8bb788',tan='#dfc29e';
  const path=(d,fill='none',width=3)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const r=(x,y,w,h,fill='#fffaf0')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const c=(x,y,rad,fill='#fffaf0')=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const tx=(x,y,s,size=20)=>centered(x,y,s,size);
  const arr=(x,y,a,b)=>{const rad=Math.atan2(b-y,a-x);return path(`M${x} ${y}L${a} ${b}M${a-10*Math.cos(rad-.5)} ${b-10*Math.sin(rad-.5)}L${a} ${b}L${a-10*Math.cos(rad+.5)} ${b-10*Math.sin(rad+.5)}`);};
  const group=(x,y,s,body)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
  const drop=(x,y,s=1)=>group(x,y,s,path('M0-22Q-28 15 0 22Q28 15 0-22Z',blue));
  const sun=(x,y)=>c(x,y,23,'#f4d274')+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return line([x+31*Math.cos(a),y+31*Math.sin(a)],[x+43*Math.cos(a),y+43*Math.sin(a)],'#cca64c',3);}).join('');
  const pot=(x,y,s=1)=>group(x,y,s,plant(0,0,.7)+path('M-46 0H46L35 72H-35Z',tan));
  const bird=(x,y,beak=0)=>group(x,y,1,`<ellipse cx="0" cy="35" rx="46" ry="32" fill="${green}" stroke="${stroke}"/>`+c(20,-7,29,green)+c(27,-13,3,stroke)+path(beak===0?'M44-14L82 0L44 9Z':beak===1?'M44-14L105-5L44 9Z':'M44-14L95-12Q107-3 95 9L44 9Z',tan)+path('M-18 62V86M12 62V86'));
  const paper=()=>r(0,0,100,125)+[30,55,80].map(y=>line([14,y],[86,y])).join('');
  const speech=(x,y)=>r(x,y,100,55,'#e2edf2')+path(`M${x+25} ${y+55}l-8 14l28-14`);
  let body='',box='0 0 650 350';
  if(['beaks','teeth','mimicry','defense','animalSignals','scent','beeDance','antTeam','courtship','birth','parentYoung','migration','hibernation','thermoregulation'].includes(m)){
   if(m==='birth'&&rows.length)return scene({...v,kind:'animalFamily'});
   if(m==='beaks'){body=[0,1,2].map(i=>bird(105+i*205,130,i)+tx(110+i*205,280,rows[i]?.[0]||['甲','乙','丙'][i])).join('');}
   else if(m==='teeth'){body=tx(175,45,'甲：尖銳的牙')+tx(475,45,'乙：較寬平的臼齒')+path('M50 190Q175 280 300 190')+path('M350 190Q475 280 600 190');for(let i=0;i<5;i++)body+=path(`M${70+i*42} 190l20-80l20 80`, '#f6eee2')+r(365+i*43,125,35,70,'#f6eee2');}
   else if(m==='mimicry'){body=path('M70 250L290 70M110 210L70 135M190 135L265 150',tan,9)+group(175,155,1,animalInsect('螳螂'))+leaf(470,270,1.25)+path('M430 215L510 140M455 193L425 160M480 168L515 180',green,8)+tx(170,320,'枝條與動物外形')+tx(470,320,'葉片與外形示意');}
   else if(m==='birth'||m==='parentYoung'){body=bird(125,110,0)+[0,1,2].map(i=>`<ellipse cx="${70+i*40}" cy="255" rx="15" ry="20" fill="#f4e7cf" stroke="${stroke}"/>`).join('')+group(450,160,1.2,`<ellipse cy="25" rx="56" ry="32" fill="${tan}"/>`+c(42,-4,25,tan)+path('M25-20L25-60M47-20L50-62',tan,12)+path('M-30 50V75M30 50V75'))+group(530,240,.5,`<ellipse cy="25" rx="56" ry="32" fill="${tan}"/>`+c(42,-4,25,tan)+path('M25-20L25-60M47-20L50-62',tan,12))+tx(150,330,'出生方式與照顧行為分開觀察')+tx(490,330,'圖示個案；依題目紀錄判斷');}
   else if(m==='migration'){body=[0,1,2,3,4].map(i=>path(`M${90+i*85} ${100+Math.abs(i-2)*25}q18-28 36 0q18-28 36 0`)).join('')+arr(100,260,550,260)+sun(540,80)+tx(325,320,'季節移動的路線示意，非實際地圖');}
   else if(m==='hibernation'){body=path('M80 280Q80 80 290 90Q430 80 500 280Z',tan)+path('M150 280Q170 150 320 170Q410 180 430 280Z','#786c60')+`<ellipse cx="300" cy="257" rx="75" ry="25" fill="#c7ae91"/>`+tx(320,200,'z z z',26)+tx(325,325,'季節中的活動變化');}
   else if(m==='thermoregulation'){body=sun(100,75)+bird(220,155,0)+path('M380 230Q420 200 460 230L510 230L545 210M435 230l-25 30M470 230l20 30',green,12)+r(320,55,23,200)+c(331,270,27,'#df9784')+path('M331 260V120','#df9784',9)+tx(325,330,'環境溫度改變時，比較動物體溫紀錄');}
   else if(m==='antTeam'){body=[0,1,2].map(i=>group(145+i*160,210,.6,`<ellipse cx="-28" rx="18" ry="12" fill="#7e6959"/>`+c(0,0,13,'#7e6959')+c(25,0,12,'#7e6959')+path('M-15-8l-15-25M-15 8l-15 25M10-8l15-25M10 8l15 25'))).join('')+path('M110 150L530 150',green,16)+tx(325,310,'觀察是否一起搬運同一件物體');}
   else if(m==='beeDance'){body=path('M180 170C90 50 390 50 300 170C210 290 510 290 420 170')+arr(260,180,340,150)+group(300,165,.8,`<ellipse cx="-16" cy="-22" rx="20" ry="30" fill="#d9ebed"/><ellipse cx="16" cy="-22" rx="20" ry="30" fill="#d9ebed"/><ellipse cy="10" rx="18" ry="30" fill="#e2bd62" stroke="${stroke}"/>`+path('M-16 2H16M-16 18H16','none',5)+c(0,-22,12,'#a28b5c'))+tx(325,320,'移動路徑示意；訊息內容依觀察資料判斷');}
   else if(m==='scent'){body=bird(130,160,0)+[0,1,2,3,4].map(i=>c(260+i*50,210-i*12,5,'#bdabc8')).join('')+arr(280,90,530,90)+tx(325,325,'空氣流動與氣味傳遞示意');}
   else if(m==='defense'){body=group(170,180,1.2,path('M-80 50L-55-15L-30 20L0-40L25 15L60-10L80 50Z',tan)+c(60,35,5,stroke))+path('M385 230Q440 120 500 210L545 160M430 220L400 255M480 210L505 250',green,12)+arr(490,100,590,70)+tx(170,315,'外部構造')+tx(490,315,'移動行為');}
   else{body=bird(160,170,0)+bird(490,170,0)+[0,1,2].map(i=>path(`M${245+i*24} ${105-i*10}q${28+i*8} ${45+i*15} 0 ${90+i*20}`)).join('')+tx(325,330,m==='courtship'?'觀察外形展示與互動行為':'聲音與動作的互動示意');}
  }else if(['roots','stem','stems','leafParts','leafShapes','leafEdges','leafVeins','leafOrder','flower','fruitSeeds','seedShapes','plantObserve','plantEnvironment','plantWater','plantProducts','observation','habitat'].includes(m)){
   if(m==='roots'){body=line([30,95],[620,95],tan,7)+path('M175 35V280M175 120L105 180M175 160L235 220M175 205L135 250',tan,7);for(let i=0;i<9;i++)body+=path(`M475 85Q${370+i*23} 160 ${365+i*26} 280`,tan,4);body+=tx(175,325,'甲')+tx(475,325,'乙');}
   else if(m==='stems'){body=path('M150 290V80M150 150L90 90M150 180L225 110',tan,27)+leaf(90,90,.45)+leaf(225,110,.5)+plant(480,250,1.05)+tx(160,330,'甲')+tx(480,330,'乙');}
   else if(m==='stem'){body=pot(300,240,1)+[0,1,2].map(i=>arr(305,230-i*40,305,205-i*40)).join('')+drop(200,285,.6)+tx(325,335,'觀察莖連接各部位的方式');}
   else if(m==='flower'){body=group(320,170,1.5,[0,60,120,180,240,300].map(a=>`<ellipse cy="-30" rx="22" ry="45" fill="#e9b0a6" stroke="${stroke}" transform="rotate(${a})"/>`).join('')+c(0,0,20,'#efd080')+path('M0 20V100',green,7))+line([380,100],[525,65])+tx(550,65,'A')+line([320,170],[120,155])+tx(90,160,'B')+line([320,280],[510,290])+tx(540,295,'C');}
   else if(m==='leafOrder'){for(let i=0;i<3;i++){const x=110+i*210;body+=path(`M${x} 290V70`,green,5);for(let k=0;k<3;k++){const y=130+k*55;if(i!==1||k%2===0)body+=group(x,y,.45,`<g transform="rotate(-55)">${leaf(0,0,1)}</g>`);if(i!==1||k%2===1)body+=group(x,y,.45,`<g transform="rotate(55)">${leaf(0,0,1)}</g>`);if(i===2)body+=group(x,y,.45,`<g transform="rotate(180)">${leaf(0,0,1)}</g>`);}body+=tx(x,330,['甲','乙','丙'][i]);}}
   else if(m==='leafParts'||m==='leafVeins'){body=leaf(200,280,1.5)+path('M445 280Q370 130 445 45Q520 130 445 280Z',green);for(const dx of [-28,-14,0,14,28])body+=path(`M445 270Q${445+dx*2} 150 445 60`,'none',2);body+=tx(200,330,'甲：葉片放大')+tx(445,330,'乙：葉片放大');}
   else if(m==='leafShapes'||m==='leafEdges'){body=leaf(120,280,1.2)+path('M315 280Q260 170 315 55Q370 170 315 280Z',green)+path('M520 280L475 245L490 220L465 195L485 170L475 140L500 125L520 65L540 125L565 140L555 170L575 195L550 220L565 245Z',green)+[120,315,520].map((x,i)=>tx(x,330,['甲','乙','丙'][i])).join('');}
   else if(m==='fruitSeeds'||m==='seedShapes'){body=c(155,170,86,'#dfaa84')+c(155,170,68,'#f7dfb2')+[0,1,2,3].map(i=>`<ellipse cx="${135+i%2*40}" cy="${150+Math.floor(i/2)*40}" rx="8" ry="15" fill="#6a5d4f"/>`).join('')+group(445,170,1.3,path('M0 0Q-65-80-90-20Q-60 20 0 0Q45-70 85-15Q50 25 0 0Z','#dfd7b4')+c(0,0,9,'#a68c62'))+tx(155,310,'剖開觀察')+tx(445,310,'外形放大示意');}
   else if(m==='plantEnvironment'||m==='plantWater'){body=pot(180,235,1)+pot(460,235,1)+sun(325,60)+drop(110,90)+drop(430,85)+drop(480,90)+drop(530,80)+tx(180,335,'甲')+tx(460,335,'乙')+path('M390 320Q460 300 530 320',blue,8);}
   else if(m==='observation'){body=plant(230,270,1)+c(430,120,65,'#e7f2f2')+path('M475 170L550 270',tan,16)+leaf(430,160,.7)+book(65,260)+tx(325,335,'近看構造，記錄實際看見的線索');}
   else if(m==='plantProducts'){body=plant(120,260,1)+arr(210,170,290,170)+book(340,100)+r(485,110,80,110,tan)+path('M490 110Q525 55 560 110')+tx(440,300,'生活用品與植物材料');}
   else{body=pot(180,235,1)+plant(430,270,1.1)+sun(520,65)+group(320,170,.4,animalInsect('蝴蝶'))+tx(325,335,'觀察棲地與生物，避免破壞或任意採集');}
  }else if(['vibration','stringPhone','soundMedium','waveAmplitude','waveFrequency','stringLength','stringThickness','airColumn','drum','soundSafety','rubberLab','lightSources','lightPath','shadow','mirror','eyePath','refraction','prism','labSafety'].includes(m)){
   if(m==='refraction')return window.ExamDiagrams.draw({kind:'examRefraction'});
   if(m==='rubberLab'){const d=window.ExamDiagrams.draw({kind:'examRubberLab'});return {...d,body:d.body.replaceAll('20 cm','較長').replaceAll('10 cm','較短'),alt:'比較輕撥與較用力撥，再比較較長與較短的橡皮筋；未另外指定長度數值。'};}
   if(m==='mirror')return window.BExamDiagrams.draw({kind:'bMirror'});
   if(m==='waveAmplitude'||m==='waveFrequency'){for(let j=0;j<2;j++){const y=100+j*150,amp=m==='waveAmplitude'?20+j*25:30,freq=m==='waveFrequency'?2+j*2:3;body+=line([70,y],[600,y],'#b7c7c0',1)+path(Array.from({length:121},(_,i)=>(i?'L':'M')+(70+i*4.4)+' '+(y-Math.sin(i/120*Math.PI*2*freq)*amp)).join(''))+tx(40,y+8,j?'乙':'甲');}body+=tx(325,335,'示意比較；相同橫向長度代表相同時間',18);}
   else if(m==='stringPhone'||m==='soundMedium'){body=path('M80 100L145 110V220L80 230Z',tan)+path('M570 100L505 110V220L570 230Z',tan)+line([145,165],[505,165],stroke,3)+kid(55,240,blue,.65)+kid(600,240,green,.65)+tx(325,310,'杯底連線；比較拉直、鬆弛或被碰觸時的情形',18);}
   else if(m==='stringLength'||m==='stringThickness'||m==='vibration'){body=r(70,75,220,170,tan)+r(360,75,220,170,tan);for(let i=0;i<2;i++){const x=90+i*290,end=m==='stringLength'&&i===1?x+110:x+180;body+=line([x,150],[end,150],stroke,m==='stringThickness'?3+i*5:4)+path(`M${x} 150Q${(x+end)/2} 120 ${end} 150M${x} 150Q${(x+end)/2} 180 ${end} 150`,'none',1)+tx(x+90,280,i?'乙':'甲');}}
   else if(m==='airColumn'){for(let i=0;i<4;i++)body+=r(100+i*130,65,55,100+i*35,blue)+line([105+i*130,75],[150+i*130,75])+tx(128+i*130,315,['甲','乙','丙','丁'][i]);}
   else if(m==='drum'){body=`<ellipse cx="325" cy="120" rx="130" ry="45" fill="${tan}" stroke="${stroke}"/>`+path('M195 120V250Q325 300 455 250V120',tan)+`<ellipse cx="325" cy="120" rx="130" ry="45" fill="#f4e8d0" stroke="${stroke}"/>`+path('M180 40L290 115M470 40L360 115',stroke,9)+path('M260 140Q325 160 390 140','none',2);}
   else if(m==='soundSafety'||m==='labSafety'){body=kid(180,175,blue,1.3)+path('M140 145Q180 95 220 145','none',12)+r(130,150,25,50,green)+r(207,150,25,50,green)+r(380,70,150,160)+path('M410 200L450 110L490 200Z','#f4d274')+tx(450,178,'!',36)+tx(325,325,'觀察設備與操作環境，依題目判斷安全做法');}
   else if(m==='prism'){body=path('M280 70L220 260H380Z','#d9eaf0')+line([60,140],[258,140],'#e1d69f',8)+['#d17e7a','#e3ae71','#d4c976','#89ae85','#89b5ca','#9b91bc'].map((color,i)=>line([335,140],[590,110+i*28],color,5)).join('')+tx(325,325,'白光通過透明三角柱的示意');}
   else if(m==='lightSources'){body=sun(150,130)+c(440,140,70,'#c2c9c2')+arr(225,140,360,140)+tx(150,280,'太陽')+tx(440,280,'月亮')+tx(325,330,'觀察發光與被照亮的差別');}
   else if(m==='eyePath'){body=c(100,60,30,'#f4d274')+r(340,125,100,110,green)+path('M50 280Q100 235 150 280Q100 325 50 280Z','#fff')+c(100,280,18,stroke)+arr(135,80,330,165)+arr(330,195,160,270)+tx(490,185,'物體',21)+tx(100,115,'光源',18);}
   else{body=c(70,160,20,'#f4d274')+r(300,105,18,110,green)+line([540,50],[540,290],stroke,5)+line([70,160],[540,48],tan,2)+line([70,160],[540,272],tan,2)+line([540,48],[540,272],stroke,13)+tx(70,325,'光源')+tx(310,325,'物體')+tx(540,325,'屏幕');}
  }else if(['balloon','cupAir','waterDisplace','waterShape','airShape','waterFlow','wind','waterBalance','airBalance','airCompression','waterCompression','fairTest','pistons','windStrength','windUses'].includes(m)){
   if(m==='cupAir')return window.BExamDiagrams.draw({kind:'bCupAir'});
   if(m==='pistons')return window.BExamDiagrams.draw({kind:'bPistons'});
   if(m==='airCompression'||m==='waterCompression'||m==='fairTest'){for(let i=0;i<2;i++){const y=85+i*140,px=290+(m==='airCompression'?i*50:0);body+=r(180,y,340,55,'#f7f5ec')+(m==='waterCompression'?r(px+4,y+3,516-px,49,blue):'')+line([px,y-5],[px,y+60],stroke,7)+line([90,y+28],[px,y+28],stroke,5)+line([520,y+28],[565,y+28],stroke,4)+line([565,y+15],[565,y+40],stroke,7)+arr(100,y+72,160,y+72)+tx(70,y+35,i?'乙':'甲');}body+=tx(325,340,'出口封住；裝置未按比例，實際數值依量測紀錄。',18);}
   else if(m==='waterShape'){body=path('M80 60V270H250V60M430 40V270H530V40')+r(82,150,166,118,blue)+r(432,74,96,194,blue)+arr(265,120,410,120)+tx(165,320,'容器甲')+tx(480,320,'容器乙');}
   else if(m==='waterDisplace'||m==='waterFlow'){body=path('M80 60V270H250V60M390 60V270H560V60')+r(82,150,166,118,blue)+r(392,m==='waterDisplace'?125:150,166,m==='waterDisplace'?143:118,blue)+arr(265,120,370,120);if(m==='waterDisplace')body+=r(430,185,70,60,tan)+tx(325,330,'放入物體前後，觀察水面位置');else body+=tx(165,320,'容器甲')+tx(475,320,'容器乙');}
   else if(m==='airBalance'||m==='waterBalance'){body=path('M325 280V110M290 300H360M100 145L550 75')+path('M140 139L90 259H190ZM510 81L460 201H560Z');body+=m==='airBalance'?`<ellipse cx="140" cy="214" rx="35" ry="40" fill="${blue}" stroke="${stroke}"/>`+path('M480 186Q510 166 540 186',blue,6):r(115,199,50,55,blue)+r(485,141,50,55);body+=tx(325,335,'先確認空器材平衡，再比較加入物品的變化。',18);}
   else if(m==='balloon'||m==='airShape'){body=`<ellipse cx="165" cy="140" rx="85" ry="105" fill="${blue}" stroke="${stroke}"/>`+path('M165 245l-10 15h20Z',blue)+path('M165 260Q200 290 165 320')+path('M400 95Q490 30 560 100V220Q490 290 400 220Z','#e9d29e')+tx(485,325,'袋子或容器的形狀');}
   else{body=path('M60 75Q130 35 190 75M50 125Q140 80 220 125M70 175Q150 130 240 175','none',5)+arr(170,220,275,220)+path('M445 145V315',tan,10)+[0,90,180,270].map(a=>`<g transform="translate(445 145) rotate(${a})">${path('M0 0L75-45L65 20Z',green)}</g>`).join('')+c(445,145,10,stroke)+tx(325,345,'依風向、風力與實際轉動紀錄判讀',18);}
  }else if(['terrain','mountain','hill','plateau','basin','plain','taiwanTerrain','river','coast','transport','landUse','weatherClimate','latitude','altitude','monsoon','waterStorage','storm','slope','mapKey','globe','compass','taiwan','regionalMap','coordinates','seaTrade'].includes(m)){
   if(m==='taiwan')return window.ExamDiagrams.draw({kind:'examTaiwan'});
   if(m==='taiwanTerrain'){const d=window.ExamDiagrams.draw({kind:'examTaiwan'});return {...d,body:d.body+path('M425 185L455 205L425 255L410 300L385 355L365 395L365 350L385 290L400 245Z',green)+tx(505,345,'山地分布',18)+line([415,305],[475,330],stroke,2),alt:'臺灣輪廓中以綠色標示中央偏東的山地概略分布，非精密地形測繪。'};}
   if(m==='river'){body=path('M90 50Q125 125 230 160T365 265T540 310',blue,18)+arr(155,115,215,145)+arr(310,202,350,250)+arr(440,283,505,305)+tx(110,30,(rows[0]?.[0]||'')+' 上游')+tx(400,205,(rows[1]?.[0]||'')+' 中游')+tx(525,345,(rows[2]?.[0]||'')+' 下游、出海處');return {body,box:'0 0 650 380',alt:'依原表代號標示上游、中游、下游；河水由高處流向低處。'};}
   if(m==='compass'||m==='mapKey'){body=c(325,170,120,'#f2f1df')+path('M325 60L300 190L325 170L350 190Z',green)+path('M325 280L300 150L325 170L350 150Z',tan)+tx(325,35,'北 N',25)+tx(325,330,'南 S',25)+tx(480,180,'東 E',25)+tx(170,180,'西 W',25);}
   else if(m==='globe'||m==='latitude'||m==='coordinates'||m==='regionalMap'){body=c(325,170,130,'#c9e4ec')+`<ellipse cx="325" cy="170" rx="65" ry="130" fill="none" stroke="${stroke}"/>`+line([195,170],[455,170],stroke,3)+[110,230].map(y=>path(`M210 ${y}Q325 ${y+30} 440 ${y}`)).join('')+c(390,132,5,'#c97e66')+tx(530,137,'臺灣位置示意',18)+line([400,132],[460,132])+tx(180,180,'赤道',18)+tx(325,30,'北半球',20)+tx(325,340,'經緯線位置示意，未繪製大陸海岸線',17);}
   else if(m==='terrain'||['mountain','hill','plateau','basin','plain'].includes(m)){
    const shapes={mountain:'M10 160L55 40L95 115L130 10L180 160Z',hill:'M10 160Q35 90 70 120Q110 65 180 160Z',plateau:'M10 160L45 65H145L180 160Z',basin:'M10 160V45L65 135H125L180 45V160Z',plain:'M10 160L10 140H180V160Z'};
    const list=m==='terrain'?Object.keys(shapes):[m];box='0 0 650 '+(list.length>1?470:400);list.forEach((key,i)=>{const x=list.length===1?175:20+i%3*215,y=list.length===1?70:25+Math.floor(i/3)*215;body+=group(x,y,list.length===1?1.5:1,path(shapes[key],green)+tx(95,195,{mountain:'山地',hill:'丘陵',plateau:'臺地',basin:'盆地',plain:'平原'}[key],20));});
   }else if(m==='weatherClimate'){body=sun(140,90)+drop(230,130)+r(65,205,220,90)+tx(175,255,'某一天的觀測')+r(370,50,210,245)+[0,1,2,3].map(i=>line([390,100+i*40],[560,100+i*40])).join('')+tx(475,88,'多年紀錄')+tx(325,335,'比較觀測時間長短，不能只用一天代表長期');}
   else if(m==='storm'||m==='slope'){body=path('M60 245L210 60L340 245Z',green)+path('M170 125L210 140L195 160L235 175L220 195',tan,12)+path('M365 95Q350 40 410 45Q450 10 495 50Q560 35 575 95Z','#b9c5ce')+[380,430,480,530].map(x=>path(`M${x} 120l-35 65`,'none',4)).join('')+r(420,240,110,70,tan)+path('M405 240L475 195L545 240Z',tan)+tx(325,340,'觀察天候、地勢與住家位置的關係');}
   else if(m==='altitude'){body=path('M60 290L330 40L580 290Z',green)+r(160,205,25,75)+r(330,75,25,75)+tx(130,320,'低處')+tx(370,60,'高處')+tx(480,150,'比較量測紀錄',18);}
   else if(m==='monsoon'){body=path('M280 275L340 85L400 275Z',green)+arr(530,75,410,175)+path('M440 110Q465 75 500 110Q540 80 560 120Z','#bdced9')+drop(460,165,.6)+drop(500,180,.6)+tx(325,325,'風向、山勢與降雨的關係示意');}
   else if(m==='waterStorage'){body=path('M65 280L155 95L260 280M390 280L490 95L585 280',green)+path('M180 280V195H470V280Z',blue)+r(300,175,40,120,tan)+tx(325,335,'雨量與蓄水需依長期紀錄比較');}
   else{body=path('M10 250L145 60L280 250Z',green)+path('M280 250Q430 190 640 250V320H280Z',blue)+r(350,180,100,70,tan)+path('M340 180L400 140L460 180Z',tan)+path('M100 300Q290 200 430 290','none',8)+arr(460,265,590,265)+tx(325,345,'地形、道路、聚落與海域的配置示意',18);}
  }else{
   // Language/social studies: draw the objects and physical arrangement mentioned
   // in the text rather than replacing a picture with a list of prose sentences.
   if(m==='gecko'){
    body=r(45,30,560,260,'#e5e2d5')+path('M140 200Q220 140 300 170Q360 190 400 120',green,22)+c(410,110,24,green)+path('M270 165L240 105M300 175L270 245M350 165L365 230M370 155L350 90',green,10)+tx(325,335,'觀察身體與四肢，文字修辭不等於實際建築物。',18);
   }else if(m==='comparison'){
    body=kid(120,180,blue,1)+kid(250,150,green,1.3)+path('M380 95Q390 45 430 65Q470 25 505 65Q560 45 570 95Z','#f2f0e8')+path('M465 270V205',tan,8)+c(465,180,55,'#efcdd8')+tx(180,335,'比較身高')+tx(480,335,'比較外形');
   }else if(m==='clayCup'){
    body=path('M170 70Q250 90 330 70V250Q250 300 170 250Z',tan)+path('M330 115Q450 90 425 205Q410 245 330 225','none',17)+path('M195 110Q245 128 300 110','none',2)+tx(325,335,'陶杯外形示意；物品的回憶依文章理解');
   }else if(m==='flipBird'){
    body=[0,1,2].map(i=>r(20+i*215,55,195,230)+group(115+i*215,170,.7,bird(0,0,0))+path('M'+(90+i*215)+' 190L'+(55+i*215)+' '+(110+i*50),'none',9)+tx(115+i*215,315,String(i+1))).join('');
   }else if(m==='blockTower'){
    body=[0,1,2].map(i=>r(150,240-i*60,65,55,['#8fb8a4','#dfbf88','#9cb4d1'][i])).join('')+r(95,60,175,55,'#dcad95')+[0,1,2].map(i=>r(385+i*55,240,50,55,green)).join('')+r(410,180,105,55,tan)+r(438,120,50,55,blue)+tx(180,335,'甲：底部較窄')+tx(465,335,'乙：底部較寬');
   }else if(m==='wipeWater'){
    body=r(65,140,520,150,tan)+path('M150 240Q200 170 250 225Q310 175 350 240Q250 275 150 240Z',blue)+path('M375 150L515 165L490 240L360 215Z','#d6e3da')+arr(380,110,280,150)+tx(325,335,'布與水面的接觸示意，吸水情形依文中紀錄。',18);
   }else if(m==='scissors'){
    body=c(220,230,40,'#d4e4dc')+c(330,230,40,'#d4e4dc')+path('M240 200L380 55M310 200L170 55','none',10)+c(275,155,10,tan)+r(430,100,110,150,'#eee6d1')+tx(325,335,'一把工具供多人共用，先確認工作順序。',18);
   }else if(m==='storageLabels'){
    body=[0,1,2].map(i=>r(50+i*205,50,185,220,tan)+r(65+i*205,65,155,35,'#f7f3df')+book(85+i*205,180)+tx(142+i*205,90,['甲','乙','丙'][i],20)).join('')+tx(325,330,'標籤與櫃內物品要逐一核對');
   }else if(m==='routeMap'){
    body=r(65,60,130,70,tan)+r(450,60,130,70,green)+r(65,240,130,70,blue)+path('M195 95H450M130 130V240M195 275H515V130','none',8)+path('M290 65l50 60M340 65l-50 60','#d1937f',5)+tx(325,190,'封閉路段')+tx(130,100,'起點')+tx(515,100,'目的地')+tx(325,345,'示意道路；實際地點與可走路線依文章確認。',17);
   }else if(m==='schoolbag'){
    body=r(220,95,230,210,'#9ab9b3')+path('M260 95V60Q335 5 410 60V95','none',12)+r(255,205,160,75,tan)+book(60,90)+group(500,50,.8,paper())+arr(160,170,205,190)+arr(490,170,465,190)+tx(325,340,'將核對過的用品集中收好');
   }else if(m==='pictureInventory'){
    const valid=rows.filter(row=>Number.isFinite(Number(row[1]))&&Number.isFinite(Number(row[2])));
    box='0 0 650 '+(valid.length*185+60);
    valid.forEach((row,i)=>{const name=String(row[0]),y=55+i*185;body+=tx(325,y-15,name,23);[1,2].forEach((col,j)=>{const n=Number(row[col]);body+=tx(70,y+45+j*65,v.table.headers[col],18);for(let k=0;k<Math.min(n,16);k++)body+=fruit(150+k%8*58,y+35+j*65+Math.floor(k/8)*28,name,.28);body+=tx(610,y+45+j*65,n,22);});});
    body+=tx(325,valid.length*185+45,'依原表繪製；超過 16 個時以數字標示完整數量。',17);
   }else if(m==='paperBridge'){body=r(65,180,125,110,tan)+r(460,180,125,110,tan)+path('M170 180Q325 240 480 180','#e6ece4',8)+r(300,188,45,22,'#aeb9bd')+tx(130,330,'支撐物')+tx(520,330,'支撐物')+tx(325,80,'紙橋側面示意');}
   else if(m==='umbrellaPlant'){body=pot(325,260,1)+path('M175 120Q325-15 475 120Z','#e7c68c')+path('M325 120V260Q325 285 300 270',tan,5)+[80,120,530,570].map(x=>path(`M${x} 60l-20 50`,'none',3)).join('');}
   else if(m==='pencilTray'){body=r(80,130,200,110,tan)+r(370,130,200,110,tan)+path('M395 150L550 150L535 215H410Z','#dde5e2')+path('M105 165L250 220M420 180H530', '#d6a45e',9)+arr(200,110,250,110)+tx(180,305,'平面')+tx(475,305,'凹槽示意');}
   else if(m==='kettle'){body=path('M190 235Q160 100 260 100H350Q430 140 395 235Z',tan)+path('M395 150Q485 110 470 220Q450 245 405 220','none',9)+path('M185 160L100 110L110 160L180 220',tan)+path('M235 90H355','none',8)+[250,290,330].map(x=>path(`M${x} 65q-20-20 0-40`)).join('')+line([420,180],[530,180],stroke,2)+tx(545,185,'標記',18);}
   else if(m==='roofGarden'){body=r(100,140,450,170,'#d5dedb')+path('M80 140L210 55L600 55L550 140Z','#c1cdb7')+[0,1,2].map(i=>pot(230+i*105,110,.35)).join('')+[0,1,2,3].map(i=>r(140+i*95,190,45,65,blue)).join('')+tx(325,340,'高處看外觀；照顧方式仍需訪談或紀錄');}
   else if(m==='bakery'){body=r(90,180,470,110,tan)+path('M70 85L590 85L550 35H110Z','#e0b399')+[0,1,2,3].map(i=>`<ellipse cx="${170+i*95}" cy="200" rx="35" ry="20" fill="#edc68e" stroke="${stroke}"/>`+path(`M${160+i*95} 160q-15-20 0-40`)).join('')+r(435,240,70,75,'#e9d9bb')+tx(325,335,'烤餅與紙袋的情境示意');}
   else if(m==='logo'){body=[0,1,2].map(i=>r(40+i*210,55,175,215,['#dce9dc','#f0dfb8','#d8e4ee'][i])+c(128+i*210,135,43,['#7cae87','#dca76d','#8babca'][i])+path(`M${103+i*210} 135l25-25l25 25l-25 25Z`,'#fff')+tx(128+i*210,245,['甲','乙','丙'][i])).join('')+tx(325,335,'圖案與配色示意，不代替文中實際商標資料');}
   else if(m==='storyboard'){body=[0,1,2].map(i=>r(20+i*215,55,195,230)+kid(115+i*215,150,green,.8)+c(75+i*225,220-i*55,17,'#e5b36c')+tx(115+i*215,315,String(i+1))).join('');}
   else if(m==='seaPaintings'){body=(v.paintingLabels||['清晨','夕陽']).map((_label,i)=>r(20+i*215,60,195,205,tan)+r(32+i*215,72,171,180,['#c7deeb','#efbe91','#ada6cc'][i])+path(`M${32+i*215} 185Q${80+i*215} 168 ${115+i*215} 185T${203+i*215} 185V252H${32+i*215}Z`,['#8ebacc','#ce8e77','#8d8cba'][i])+tx(115+i*215,310,['清晨','夕陽','想像中的海'][i])).join('');}
   else if(m==='gallery'){body=r(65,30,245,220,tan)+path('M80 230L150 100L210 185L295 125V235Z',green)+r(360,30,225,220,tan)+c(470,110,42,'#d8bea3')+kid(250,245,blue,.7)+kid(450,245,green,.7);}
   else if(m==='climb'){body=r(180,20,320,290,'#d0d7d1')+[0,1,2,3].flatMap(i=>[0,1,2].map(j=>c(230+j*95,60+i*70,10,['#e0b58d','#9eafc5','#b8b08a'][j]))).join('')+path('M320 20V180','none',4)+kid(320,175,blue,1)+tx(325,345,'使用繩索與安全裝備，依指導攀登');}
   else if(m==='mosquitoNet'){body=r(100,220,450,50,tan)+path('M90 210L180 45H480L570 210Z','#e5eeee')+[0,1,2,3,4,5,6].map(i=>line([180+i*50,45],[100+i*65,210],'#9eb7ad',1)).join('')+path('M180 45Q330 100 480 45','none',2)+tx(325,325,'蚊帳覆蓋睡眠空間，開口須妥善處理');}
   else if(m==='fundraiser'){body=r(70,190,500,80,tan)+book(110,115)+path('M320 125H420V230H320Z','#e7d0ad')+path('M335 125Q370 75 405 125')+r(465,120,70,110,'#d5e2dd')+path('M480 135H520')+tx(325,330,'義賣物品、包裝與收款位置示意');}
   else if(m==='libraryCard'||m==='reminder'||m==='notes'){body=book(75,200)+group(330,55,1.6,paper())+r(360,80,90,28,'#ecd99d')+path('M380 260l20 20l35-45')+tx(190,330,'閱讀、核對與記錄');}
   else if(m==='schedule'||m==='agenda'){body=r(60,45,530,240)+[0,1,2,3,4].map(i=>line([60,90+i*38],[590,90+i*38])).join('')+line([180,45],[180,285])+[0,1,2,3].map(i=>r(205,103+i*38,[260,180,310,100][i],23,['#b7d4c2','#e8ce9e','#b7cfdf','#e5e8df'][i])).join('')+tx(120,78,'時間')+tx(375,78,'工作／預留空檔')+tx(325,330,'示意安排；實際時間與先後依文章、題目或附表');}
   else if(m==='measurement'){body=r(100,180,450,65,'#eadab3')+Array.from({length:31},(_,i)=>line([115+i*14,180],[115+i*14,180+(i%5?12:28)],stroke,1)).join('')+path('M125 130H450','none',7)+tx(325,325,'測量工具與物體對齊的情境示意');}
   else if(m==='vote'){body=r(240,150,180,130,tan)+path('M230 150L280 105H450L420 150Z','#e8d8b8')+path('M295 125H380','none',7)+group(300,25,.7,paper())+path('M320 60l15 15l25-30')+kid(120,180,green,1)+kid(540,180,blue,1)+tx(325,330,'依規則投票，計票後仍須聆聽意見');}
   else if(m==='privacy'){body=r(190,35,270,270,'#d9e5e8')+r(235,125,180,105,tan)+path('M270 125V100Q325 40 380 100V125','none',10)+c(325,175,12,stroke)+path('M325 185V207','none',6)+tx(325,335,'分享資料前先確認對象與內容');}
   else if(m==='resources'||m==='verify'||m==='library'||m==='book'){body=book(70,170)+r(270,70,150,150,blue)+r(310,225,70,15,tan)+group(480,80,1,paper())+arr(210,155,255,155)+arr(430,155,470,155)+tx(135,300,'書籍')+tx(345,300,'資料查找')+tx(530,300,'記錄核對');}
   else if(m==='checklist'||m==='revise'||m==='study'){body=group(90,45,1.8,paper())+group(400,45,1.8,paper())+arr(290,165,380,165)+path('M435 105l15 15l30-35M435 150l15 15l30-35M435 195l15 15l30-35','none',4)+tx(180,330,'原始紀錄')+tx(490,330,'核對與修訂');}
   else if(m==='accessibility'||m==='rights'){body=path('M70 280H220V220H330V160H440V100H580',tan,5)+path('M70 280L580 100',green,8)+c(300,220,40,blue)+kid(290,145,blue,.65)+tx(325,335,'觀察不同需求與可使用的通道');}
   else if(m==='culture'){body=[0,1,2].map(i=>kid(115+i*210,130,palette[i],.9)+`<ellipse cx="${115+i*210}" cy="265" rx="65" ry="20" fill="#efe6d4" stroke="${stroke}"/>`+path(`M${85+i*210} 255q30-40 60 0Z`,i===1?'#e1c28d':'#ece9db')).join('')+tx(325,335,'飲食與生活經驗不代表每個人的選擇');}
   else if(m==='division'||m==='teamSkills'||m==='selfIntro'||m==='balance'){body=[0,1,2].map(i=>kid(115+i*210,155,palette[i],.95)).join('')+book(70,240)+group(280,230,.45,paper())+path('M485 260L560 260M500 225L550 280',tan,8)+arr(185,110,255,110)+arr(395,110,465,110)+tx(325,340,'不同角色與工具；實際任務依題目分工');}
   else if(['discussion','listen','ask','sharedRules'].includes(m)){body=kid(140,200,green,1)+kid(500,200,blue,1)+speech(160,55)+speech(390,55)+r(250,210,150,25,tan)+path('M275 235V310M375 235V310','none',7)+tx(325,335,m==='sharedRules'?'共同空間的情境示意':'輪流表達與傾聽');}
   else throw Error('未實作各科配圖：'+m);
  }
  return {body,box,alt:v.caption+'；'+(v.description||'依圖文提供的資料判斷。')};
 }

 function libraryDiagram(v){
  const t=(x,y,s,size=23)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#294b3c" font-size="${size}">${escape(s)}</text>`;
  if(v.kind==='referenceData')return {body:'',tableOnly:true,alt:'資料表；完整內容見下表。'};
  if(v.kind==='referenceNumber')return {body:`<rect x="170" y="30" width="260" height="260" rx="20" fill="#e6efdf" stroke="#547f7b"/>${t(300,215,v.value,150)}`,alt:'數字卡：'+v.value};
  if(v.kind==='referenceFruit'){
   const body=v.items.map((row,j)=>{
    const y=75+j*130;
    return t(80,y+20,row.name,22)+Array.from({length:row.count},(_,i)=>{
     const x=210+i*95;
     return row.name==='bananas'?`<path d="M${x-28} ${y-25}Q${x+10} ${y+22} ${x+40} ${y-24}Q${x+30} ${y+67} ${x-28} ${y-25}Z" fill="#f4d46e" stroke="#8d7542" stroke-width="3"/>`:`<path d="M${x} ${y-13}C${x-55} ${y-57} ${x-50} ${y+55} ${x} ${y+42}C${x+50} ${y+55} ${x+55} ${y-57} ${x} ${y-13}Z" fill="#df9381" stroke="#936554" stroke-width="3"/><path d="M${x} ${y-13}l8-28" stroke="#5a7656" stroke-width="5"/>`;
    }).join('');
   }).join('');return {body,alt:v.items.map(r=>r.name+'：'+r.count).join('；')};
  }
  if(v.kind==='referenceOptics')return {body:`<rect x="45" y="145" width="510" height="145" fill="#cfe8ee"/><line x1="45" y1="145" x2="555" y2="145" stroke="#416f7c" stroke-width="3"/><line x1="300" y1="30" x2="300" y2="290" stroke="#6f8c92" stroke-dasharray="7 6"/><path d="M130 45L300 145L375 275" fill="none" stroke="#bd6545" stroke-width="5"/><path d="M208 95L220 98L212 89M340 224L350 232L348 219" fill="none" stroke="#bd6545" stroke-width="4"/>${t(490,90,'空氣')}${t(490,215,'水')}${t(102,137,'水面',19)}`,alt:'光由空氣斜射入水，在水面交界處改變方向；箭頭沿入射到水中方向。'};
  if(v.kind==='referenceRoots')return {body:`<line x1="30" y1="85" x2="570" y2="85" stroke="#8d7659" stroke-width="4"/><path d="M165 30V265M165 120l-52 35M165 155l45 35M165 200l-35 40" fill="none" stroke="#906f4b" stroke-width="7"/>${[0,1,2,3,4,5].map(i=>`<path d="M435 80Q${370+i*22} 155 ${365+i*28} 265" fill="none" stroke="#906f4b" stroke-width="4"/>`).join('')}${t(165,310,'甲')}${t(435,310,'乙')}`,alt:'甲有明顯主根與側根；乙有多條粗細相近的根。'};
  if(v.kind==='referenceMap')return {body:`<path d="M370 45Q410 55 397 105Q380 180 322 270Q299 285 310 230Q325 125 370 45Z" fill="#bad0a8" stroke="#547f7b" stroke-width="3"/><circle cx="205" cy="185" r="8" fill="#7d9c8c"/><circle cx="190" cy="205" r="5" fill="#7d9c8c"/>${t(183,155,'澎湖')}${t(365,305,'臺灣本島')}${t(112,250,'臺灣海峽')}${t(500,170,'太平洋')}<path d="M535 80V28l-9 15m9-15l9 15" stroke="#294b3c" fill="none" stroke-width="3"/>${t(535,110,'北',20)}`,alt:'位置示意圖，未依比例。指北箭頭向上；澎湖在臺灣本島西側，東側是太平洋。'};
  return null;
 }
 function dataFor(q){if(q.figure||q.chart)return null;if(q.visual)return q.visual;if(q.visualPolicy==='none')return null;const u=window.REVIEW_UNITS[q.unit];return u.articleVisuals?.[q.passageId]||u.topicVisuals?.[q.topic]||null;}
 function render(v,zoom=false,key=''){const drawing=window.AuditDiagrams?.draw(v)||libraryDiagram(v)||subjectDiagram(v)||supplement(v)||window.BExamDiagrams?.draw(v)||window.ExamDiagrams?.draw(v)||window.ReasoningVisuals?.draw(v)||math(v)||scene(v),uid='learning-visual-'+(++serial);const caption=v.caption||'圖像觀察卡',description=v.description||drawing.alt||'教學情境示意；請依圖文提供的資料作答。';return `<figure class="learning-visual ${v.kind.startsWith('audit')?'audit-diagram':''} ${v.examLineArt&&v.kind!=='camouflage'?'exam-line-art':''} ${v.kind.startsWith('triangle')||['isosceles','quadrilateral','parallelogram'].includes(v.kind)?'geometry-visual':''}"><figcaption><span>${escape(caption)}</span>${!zoom?`<button type="button" class="visual-zoom" data-zoom-visual="${escape(key)}">放大圖卡 ↗</button>`:''}</figcaption>${drawing.tableOnly?'':`<svg viewBox="${drawing.box||'0 0 600 330'}" role="img" aria-labelledby="${uid}"><title id="${uid}">${escape(drawing.alt||description)}</title><rect width="100%" height="100%" rx="22" fill="#fffaf0"/>${drawing.body}</svg>`}${v.table&&!v.hideTable?`<div class="visual-table-scroll"><table><caption>${escape(caption)}・資料表</caption><thead><tr>${v.table.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${v.table.rows.map(row=>`<tr>${row.map((value,i)=>i===0?`<th scope="row">${escape(value)}</th>`:`<td>${escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}<p class="visual-description">${escape(description)}</p></figure>`;}
 function markup(q){const v=dataFor(q);if(!v)return '';registry.set(q.id,v);return render(v,false,q.id);}
 function logText(q){const v=dataFor(q);return v?'\n【圖卡資料】'+JSON.stringify(v)+'\n':'';}
 document.addEventListener('click',e=>{const button=e.target.closest('[data-zoom-visual]');if(!button)return;const visual=registry.get(button.dataset.zoomVisual);if(!visual)return;let dialog=document.querySelector('#learning-visual-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='learning-visual-dialog';dialog.className='learning-visual-dialog';dialog.setAttribute('aria-label','放大圖卡');document.body.appendChild(dialog);}dialog.innerHTML='<button class="visual-close secondary" type="button">關閉圖卡 ×</button>'+render(visual,true);dialog.querySelector('.visual-close').onclick=()=>dialog.close();dialog.showModal();});
 window.LearningVisuals={markup,dataFor,logText};
})();
