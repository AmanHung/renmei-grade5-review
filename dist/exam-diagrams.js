(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const line=(a,b,extra='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${/\bstroke=/.test(extra)?'':'stroke="#111"'} ${/\bstroke-width=/.test(extra)?'':'stroke-width="2"'} ${extra}/>`;
 const text=(x,y,s,size=21,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="#111">${esc(s)}</text>`;
 const path=(d,extra='')=>`<path d="${d}" fill="none" stroke="#111" ${/\bstroke-width=/.test(extra)?'':'stroke-width="2"'} stroke-linejoin="round" ${extra}/>`;
 const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${/\bfill=/.test(extra)?'':'fill="white"'} stroke="#111" stroke-width="1.6" ${extra}/>`;
 const poly=points=>`<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="white" stroke="#111" stroke-width="2"/>`;
 const arrow=(a,b,dash=false)=>{const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),p=t=>[b[0]-10*Math.cos(ang+t),b[1]-10*Math.sin(ang+t)];return line(a,b,dash?'stroke-dasharray="5 4"':'')+path(`M${p(.4)}L${b}L${p(-.4)}`);};
 const deg=a=>a*Math.PI/180;
 function intersection(a,b,c,d){const u=b.map((n,i)=>n-a[i]),v=d.map((n,i)=>n-c[i]),den=u[0]*v[1]-u[1]*v[0],w=c.map((n,i)=>n-a[i]),t=(w[0]*v[1]-w[1]*v[0])/den;return a.map((n,i)=>n+t*u[i]);}
 function angle(p,a,b,label,r=27,offset=1.7){let aa=Math.atan2(a[1]-p[1],a[0]-p[0]),bb=Math.atan2(b[1]-p[1],b[0]-p[0]),d=bb-aa;while(d>Math.PI)d-=2*Math.PI;while(d< -Math.PI)d+=2*Math.PI;const pos=(t,rr=r)=>[p[0]+Math.cos(t)*rr,p[1]+Math.sin(t)*rr],s=pos(aa),e=pos(aa+d),mid=pos(aa+d/2,r*offset);return `<path d="M${s} A${r} ${r} 0 0 ${d>0?1:0} ${e}" fill="none" stroke="#111" stroke-width="1.6"/>`+text(mid[0],mid[1]+7,label,21);}
 function compound(v){
  const A=[65,60],B=[65,370],C=[65+310/Math.tan(deg(90-v.leftTop)),370],D=[160,370];
  const direction=180-(90-v.leftTop+v.rightBetween),rise=90+v.leftTop-v.top-v.rightBetween,E=intersection(D,[D[0]+Math.cos(deg(rise))*100,D[1]-Math.sin(deg(rise))*100],C,[C[0]+Math.cos(deg(direction))*100,C[1]-Math.sin(deg(direction))*100]),P=intersection(A,C,D,E);
  return {points:{A,B,C,D,E,P},body:path(`M${A}L${B}L${C}L${A}M${D}L${E}L${C}`)+path(`M${B[0]} ${B[1]-18}h18v18`)+angle(A,B,C,v.leftTop+'°')+angle(E,D,C,v.top+'°',24)+angle(C,A,E,v.rightBetween+'°',30)+angle(P,D,C,'x°',28)+text(45,47,'A')+text(43,397,'B')+text(C[0]+12,400,'C')+text(D[0]-8,398,'D')+text(E[0]+5,E[1]-15,'E')};
 }
 function parallelogram(v){
  const knownA=180-v.corner,h=220,shift=h/Math.tan(deg(knownA)),width=shift+h/Math.tan(deg(v.diagonal)),A=[65,340],B=[65+width,340],C=[65+width+shift,120],D=[65+shift,120];
  const mark=(a,b,n=1)=>{const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2,u=[(b[0]-a[0])/Math.hypot(b[0]-a[0],b[1]-a[1]),(b[1]-a[1])/Math.hypot(b[0]-a[0],b[1]-a[1])];return Array.from({length:n},(_,i)=>path(`M${x-u[0]*6-u[1]*6+i*8*u[0]} ${y-u[1]*6+u[0]*6+i*8*u[1]}L${x+i*8*u[0]} ${y+i*8*u[1]}L${x-u[0]*6+u[1]*6+i*8*u[0]} ${y-u[1]*6-u[0]*6+i*8*u[1]}`)).join('');};
  return {points:{A,B,C,D},body:poly([A,B,C,D])+line(B,D)+mark(A,B)+mark(D,C)+mark(A,D,2)+mark(B,C,2)+angle(B,A,C,v.corner+'°',56,1.25)+angle(B,A,D,v.diagonal+'°',25,1.7)+angle(D,A,B,'x°',30)+text(A[0]-14,A[1]+24,'A')+text(B[0]+16,B[1]+24,'B')+text(C[0]+14,C[1]-10,'C')+text(D[0]-15,D[1]-12,'D')};
 }
 function chart(v){const rows=v.table.rows,vals=rows.map(r=>Number(r[v.valueColumn??1])),max=Math.max(...vals),step=v.step||Math.max(1,Math.ceil(max/5)),top=step*Math.ceil(max/step),W=640,H=390,L=70,R=590,T=45,B=285;
  let body='';for(let n=0;n<=top;n+=step){const y=B-n/top*(B-T);body+=line([L,y],[R,y],'stroke="#bbb" stroke-width="1"')+text(L-16,y+6,n,17,'end');}
  body+=arrow([L,B],[R+20,B])+arrow([L,B],[L,T-20])+text(L-6,20,v.unit||'次',17);
  rows.forEach((r,i)=>{const x=L+(i+.5)*(R-L)/rows.length,w=Math.min(75,(R-L)/rows.length*.55),h=vals[i]/top*(B-T);body+=rect(x-w/2,B-h,w,h)+text(x,B+32,r[0],19);});
  body+=text(330,365,v.note||'教學模擬資料',17);return {box:`0 0 ${W} ${H}`,body,alt:rows.map((r,i)=>r[0]+' '+vals[i]+' '+(v.unit||'')).join('；')};}
 function syringePanel(x,y,name,value,after,water=false){const left=105,w=350,unit=30,px=left+value*unit;return `<g transform="translate(${x} ${y})">${text(35,45,name,20)}${rect(left,17,w,57)}${rect(left,17,Math.max(1,value*unit),57,`fill="${water?'url(#exam-water)':'white'}"`)}${path(`M${left-40} 37H${left}M${left-40} 52H${left}M${left-40} 30V59`)}${Array.from({length:11},(_,i)=>line([left+i*unit,17],[left+i*unit,i%5?25:32])+((i%2===0||i===value)?text(left+i*unit,99,i,16):'')).join('')}${line([px,12],[px,79],'stroke-width="5"')}${line([px,46],[left+w+42,46],'stroke-width="5"')}${line([left+w+42,25],[left+w+42,68],'stroke-width="5"')}${after?arrow([left+w+105,46],[left+w+52,46]):''}${text(left-43,115,'出口封住',16)}</g>`;}
 function syringes(v){const rows=v.table.rows;return {box:'0 0 680 620',body:'<defs><pattern id="exam-water" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 9H12" stroke="#aaa" stroke-width="1"/></pattern></defs>'+text(320,30,'甲組：裝空氣',23)+syringePanel(0,45,'施力前',rows[0][1],false)+syringePanel(0,178,'施力後',rows[0][2],true)+text(320,335,'乙組：裝水',23)+syringePanel(0,350,'施力前',rows[1][1],false,true)+syringePanel(0,483,'施力後',rows[1][2],true,true),alt:'同樣無針注射筒，出口封好；空氣刻度 '+rows[0][1]+' 到 '+rows[0][2]+'，水 '+rows[1][1]+' 到 '+rows[1][2]+'。刻度單位為格。'};}
 function plant(v){const leaf=(x,y,flip=false)=>`<g transform="translate(${x} ${y}) scale(${flip?-1:1} 1)">${path('M0 0C-80-10-105-68-88-102C-34-96-10-40 0 0Z')}${path('M0 0L-88-102M-23-28L-68-37M-43-50L-83-67')}</g>`;return {box:'0 0 650 460',body:path('M320 360V144M320 198Q292 178 283 150M320 265L376 232M320 329L272 299')+leaf(283,150)+leaf(376,232,true)+leaf(272,299)+path('M320 360Q300 385 304 427M320 360Q332 397 328 445M320 368Q355 382 373 410M309 389L281 405M335 396L356 432')+line([100,357],[560,357],'stroke-dasharray="7 4"')+`<g transform="translate(320 105)">${[0,60,120,180,240,300].map(a=>`<ellipse cy="-27" rx="17" ry="34" transform="rotate(${a})" fill="white" stroke="#111" stroke-width="1.6"/>`).join('')}<circle r="17" fill="white" stroke="#111" stroke-width="2"/></g>`+line([338,108],[510,71])+text(535,77,'A',25)+line([218,115],[116,96])+text(90,101,'B',25)+line([321,285],[522,269])+text(546,277,'C',25)+line([333,406],[492,422])+text(520,430,'D',25),alt:'植物全株線圖，A 指向頂部花朵，B 指向葉片，C 指向主莖，D 指向土面以下的根。'};}
 function leaves(v){const rows=v.table.rows;let body='';for(let i=0;i<3;i++){const x=105+i*210;body+=line([x,260],[x,55],'stroke-width="3"');const positions=i===0?[[-1,120],[1,120],[-1,210],[1,210]]:i===1?[[-1,110],[1,165],[-1,220]]:[[-1,155],[1,155],[0,155]];for(const [s,y]of positions){const cx=x+s*46,cy=y-32;body+=line([x,y],[cx,cy])+`<ellipse cx="${cx}" cy="${cy}" rx="22" ry="43" transform="rotate(${s*42} ${cx} ${cy})" fill="white" stroke="#111" stroke-width="2"/>`+line([cx-s*15,cy+30],[cx+s*15,cy-30]);}body+=text(x,300,rows[i][0],25)+`<circle cx="${x}" cy="380" r="47" fill="white" stroke="#111" stroke-width="1.5"/>`+path(`M${x} 420V340`)+(i===1?[-16,16].map(dx=>path(`M${x+dx} 414Q${x+dx*1.6} 380 ${x+dx} 346`)).join(''):[-1,1].flatMap(s=>[355,375,395].map(y=>line([x,y+14],[x+s*29,y])+path(`M${x+s*14} ${y+7}l${s*3} -12l${s*10} 8M${x+s*17} ${y-5}l${s*9} -6`))).join(''));}return {box:'0 0 650 450',body:body+text(325,25,'葉在莖上的排列',21)+text(325,330,'葉脈局部放大',18),alt:rows.map(r=>r.join('，')).join('；')};}
 const island=[[121.56,25.28],[121.93,25.12],[121.99,24.94],[121.83,24.59],[121.62,24.01],[121.50,23.49],[121.40,23.01],[121.15,22.67],[120.99,22.18],[120.84,21.90],[120.72,22.08],[120.63,22.50],[120.29,23.13],[120.10,23.65],[120.14,24.08],[120.49,24.58],[120.90,25.01],[121.19,25.13]];
 function taiwan(){const x=lon=>110+(lon-119)*135,y=lat=>85+(26-lat)*85;let body='';for(let lat=22;lat<=26;lat++)body+=line([75,y(lat)],[590,y(lat)],'stroke="#bbb" stroke-width="1" stroke-dasharray="4 4"')+text(610,y(lat)+6,lat+'°N',15);for(let lon=119;lon<=122;lon++)body+=line([x(lon),72],[x(lon),450],'stroke="#bbb" stroke-width="1" stroke-dasharray="4 4"')+text(x(lon),62,lon+'°E',15);body+=poly(island.map(([lon,lat])=>[x(lon),y(lat)]))+text(375,250,'臺灣',22)+text(194,290,'A',30)+text(510,290,'B',30)+text(420,106,'C',30)+text(370,460,'D',30)+arrow([90,144],[90,87])+text(90,79,'N',20)+text(330,500,'主島與海域位置示意；未提供測量距離的比例尺',16);return {box:'0 0 650 525',body,alt:'臺灣主島位置示意，北箭頭朝上；A在臺灣西側、B在東側、C在北側、D在南側。圖上119至122度東經、22至26度北緯為位置參照，非測量用圖。'};}
 function terrain(v){let body='';v.table.rows.forEach((r,i)=>{const x=20+i*215,baseline=335,h=Number(r[1])*.27;const pts=i===0?[[x+10,baseline],[x+10,baseline-h],[x+190,baseline-h],[x+190,baseline]]:i===1?[[x+10,baseline],[x+45,baseline-h*.55],[x+92,baseline-h],[x+145,baseline-h*.66],[x+195,baseline]]:[[x+10,baseline],[x+10,baseline-150],[x+48,baseline-112],[x+82,baseline-h],[x+125,baseline-h],[x+165,baseline-120],[x+195,baseline-150],[x+195,baseline]];body+=poly(pts)+text(x+103,45,r[0],25)+line([x+103,80],[x+103,baseline-h-8],'stroke-dasharray="4 4"')+text(x+103,75,r[1]+' m',19)+text(x+103,378,['低且廣平','起伏明顯','中央低、周圍高'][i],17);});return {box:'0 0 650 410',body:line([15,335],[635,335],'stroke-dasharray="6 4"')+text(325,404,'同一高度基準；地形外形為示意',17)+body,alt:v.table.rows.map(r=>r.join('，')).join('；')};}
 function numberLine(v){const labels=v.labels,L=75,R=565,y=125;return {box:'0 0 650 235',body:arrow([L-25,y],[R+25,y])+labels.map((s,i)=>{const x=L+i*(R-L)/(labels.length-1);return line([x,y-13],[x,y+13])+text(x,y+48,s,23);}).join('')+text(325,218,'相鄰刻度間隔相同',18),alt:labels.join('、')+'；刻度等距。'};}
 function strips(v){let body='';if(v.mode==='overlap'){const k=6,a=46*k,b=38*k,o=9*k;body=rect(65,85,a,35)+rect(65+a-o,120,b,35)+rect(65+a-o,85,o,70,'fill="url(#exam-hatch)"')+text(65+a/2,62,'46 毫米',22)+text(65+a-o+b/2,185,'38 毫米',22)+line([65+a-o,80],[65+a-o,220],'stroke-dasharray="4 4"')+line([65+a,80],[65+a,220],'stroke-dasharray="4 4"')+text(65+a-o/2,245,'重疊 9 毫米',21)+path(`M65 275v15H${65+a-o+b}v-15`)+text(325,325,'整條長度：？毫米',23);}else{const k=5.5,L=55,W=90*k;body=rect(L,105,W,50)+text(325,65,'原紙帶長 9 公分',24);for(let i=1;i<=4;i++)body+=line([L+i*18*k,87],[L+i*18*k,180],'stroke-dasharray="5 4"');for(let i=0;i<4;i++)body+=text(L+(i+.5)*18*k,215,'18 mm',19);body+=text(L+81*k,215,'？',25)+text(325,275,'剪下 4 段後，求剩餘長度',20);}return {box:'0 0 650 355',body:'<defs><pattern id="exam-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke="#888" stroke-width="1"/></pattern></defs>'+body,alt:v.mode==='overlap'?'兩段46和38毫米紙條，重疊9毫米；括線標出合起來的整體長度。':'9公分紙帶，四段各18毫米的裁切標記，剩餘一段未知。'};}
 function receipt(v){const rows=v.rows;return {box:'0 0 650 '+(100+rows.length*62),body:rect(90,15,470,65+rows.length*62)+text(325,55,v.heading,24)+line([110,76],[540,76])+rows.map((r,i)=>text(120,116+i*62,r[0],21,'start')+text(530,116+i*62,r[1],21,'end')).join(''),alt:rows.map(r=>r.join('：')).join('；')};}
 function notePair(v){return {box:'0 0 650 350',body:v.notes.map((n,i)=>`<g transform="translate(${25+i*320} 20)">${rect(0,0,285,280)}${line([0,50],[285,50])}${text(143,34,i?'修改後的便條':'原來的便條',22)}${n.map((s,j)=>text(143,100+j*45,s,20)).join('')}</g>`).join(''),alt:v.notes.map((n,i)=>(i?'修改後':'原來')+'：'+n.join('，')).join('；')};}
 function beaks(){
  const head=(x,label,beak)=>`<g transform="translate(${x} 0)">${text(100,35,label,25)}${path('M22 177Q16 129 41 102Q69 76 106 101Q122 115 115 154L94 177')}<circle cx="88" cy="112" r="3" fill="#111"/>${path(beak)}${path('M26 183Q57 164 94 177')}</g>`;
  return {box:'0 0 660 230',body:head(0,'甲','M113 113L189 140L113 153Z M113 137L180 140')+head(220,'乙','M115 119Q158 116 205 134Q158 133 115 141 M115 131L200 134')+head(440,'丙','M115 121Q164 116 204 137Q203 154 115 152 M115 140Q161 146 202 138')+text(330,218,'側面線圖；各圖未按同一比例繪製',17),alt:'三種鳥喙側面：甲短厚而尖、乙細長、丙寬扁；請再對照取食紀錄。'};
 }
 function rubberLab(){let body='';
  for(let i=0;i<3;i++){
   const x=15+i*220,L=i===2?70:140,left=x+100-L/2,right=left+L,amp=i===1?23:10;
   body+=text(x+100,30,['A','B','C'][i],25)+rect(x+10,55,180,150)+rect(left-5,98,10,54)+rect(right-5,98,10,54)+line([left,122],[right,122])+line([left,126],[right,126])+path(`M${left} 124Q${x+100} ${124-amp*2} ${right} 124M${left} 124Q${x+100} ${124+amp*2} ${right} 124`,'stroke-dasharray="4 4"')+path(`M${left} 168v12H${right}v-12`)+text(x+100,201,(i===2?10:20)+' cm',18)+arrow([x+100,70],[x+100,104])+text(x+100,242,i===1?'較用力撥':'輕撥',20);
  }
  return {box:'0 0 680 275',body,alt:'A、B 支點間20公分，C為10公分；A與C輕撥，B較用力撥。虛線是振動範圍示意，實際結果見觀察表。'};
 }
 function refraction(){let body='';
  for(let i=0;i<3;i++){
   const x=i*220;
   body+=`<g transform="translate(${x} 0)">${text(110,32,['① 空杯','② 加入水','③ 取出檢查'][i],22)}`;
   if(i<2){body+=path('M38 78L49 248H178L190 78')+path('M38 78Q114 66 190 78');if(i===1)body+=line([45,152],[184,152],'stroke-dasharray="6 4"')+text(174,177,'水',18);}
   else body+=line([24,248],[200,248])+text(110,283,'放回桌上，檢查形狀',18);
   const coords=i===1?'M127 59L95 152L44 234':'M127 59L65 234';
   body+=path(coords,'stroke-width="5"')+'</g>';
  }
  return {box:'0 0 660 315',body,alt:'同一吸管：空杯時直；加入水後從側面看，水面附近似乎偏折；取出檢查仍直。'};
 }
 function timetable(v){return {box:'0 0 650 300',body:rect(50,20,550,255)+v.slots.map((r,i)=>line([50,60+i*72],[600,60+i*72])+text(70,100+i*72,r[0]+'～'+r[1],20,'start')+text(350,100+i*72,r[2],20,'start')).join('')+line([325,20],[325,275])+text(70,48,'時間',20,'start')+text(350,48,'安排',20,'start'),alt:v.slots.map(r=>r.slice(0,3).join('，')).join('；')};}
 function draw(v){
  if(v.kind==='examEvidenceTable')return {body:'',tableOnly:true,alt:'請閱讀下表的完整資料。'};
  if(v.kind==='examBeaks')return beaks();
  if(v.kind==='examRubberLab')return rubberLab();
  if(v.kind==='examRefraction')return refraction();
  if(v.kind==='examTimetable')return timetable(v);
  if(v.kind==='examCompound'){const d=compound(v);return {box:'0 0 650 430',body:d.body,alt:`相交三角形線圖；左下為直角，標示${v.leftTop}度、${v.top}度、${v.rightBetween}度，交點下方為未知角x。`};}
  if(v.kind==='examParallel'){const d=parallelogram(v);return {box:'0 0 650 420',body:d.body,alt:`平行四邊形ABCD加對角線BD；B角${v.corner}度，ABD角${v.diagonal}度，ADB為未知角x。`};}
  if(v.kind==='examBars')return chart(v);
  if(v.kind==='examSyringes')return syringes(v);
  if(v.kind==='examPlant')return plant(v);
  if(v.kind==='examLeaves')return leaves(v);
  if(v.kind==='examTaiwan')return taiwan();
  if(v.kind==='examTerrain')return terrain(v);
  if(v.kind==='examNumberLine')return numberLine(v);
  if(v.kind==='examStrips')return strips(v);
  if(v.kind==='examReceipt')return receipt(v);
  if(v.kind==='examNotes')return notePair(v);
  if(v.kind==='examRods')return {box:'0 0 650 '+(Math.ceil(v.sets.length/2)*175+10),body:v.sets.map((set,i)=>`<g transform="translate(${i%2*320} ${Math.floor(i/2)*175})">${text(30,40,['甲','乙','丙','丁'][i],24)}${set.map((n,j)=>line([85,35+j*42],[85+n*9,35+j*42])+text(270,42+j*42,n+' cm',19)).join('')}</g>`).join(''),alt:v.sets.map((s,i)=>['甲','乙','丙','丁'][i]+'：'+s.join('、')+'公分').join('；')};
  return null;
 }
 window.ExamDiagrams={draw,compound,parallelogram};
})();
