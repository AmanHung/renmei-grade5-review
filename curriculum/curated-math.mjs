// 人工審題：每題有不同任務，保留計算填答，不以換數字擴張題庫。
const N=(text,answer,unitLabel,explanation,visual,extra={})=>({type:'numeric',text,answer,unitLabel,explanation,visual,...extra});
const S=(text,options,explanation,visual,extra={})=>({type:'single',text,options,answer:0,explanation,visual,...extra});
const board=(caption,items)=>({kind:'reasoningBoard',caption,items});
const cards=(caption,numbers)=>({kind:'numberCards',caption,numbers});
const angles=(caption,items)=>({kind:'angleCards',caption,items:items.map(([label,opening,rotation=0,length=65])=>({label,opening,rotation,length}))});
const tri=(a,b)=>({kind:'triangleAngles',caption:'根據已知條件推理',angles:[a,b,null]});
const iso=v=>({kind:'isosceles',caption:'相同記號表示兩腰相等',vertex:v});
const sides=(a,b)=>({kind:'triangleSides',caption:'第三邊未知，邊長未按比例',sides:[a,b,null]});
const chart=(caption,values)=>({caption,labels:['週一','週二','週三','週四'],values,unit:'本'});

const grade3Angles=[
 S('三把剪刀的開口如圖。哪一把的開口最大？注意不要用刀片長短判斷。',['乙','甲','丙','刀片最長的甲一定最大'],'乙的兩邊張開程度最大；邊長不決定角的大小。',angles('剪刀的開口比較',[['甲',35,0,95],['乙',120,0,48],['丙',70,0,75]]),{difficulty:'core',family:'compare-opening'}),
 S('甲、乙的邊長不同。把頂點與其中一邊疊合後，另一邊也重合，哪個判斷正確？',['兩個角一樣大','甲較大，因為邊較長','乙較大，因為邊較短','沒有標邊長就完全不能判斷'],'重合比較的是兩邊張開程度；同角不同邊長仍一樣大。',angles('不同邊長的兩個角',[['甲',60,0,95],['乙',60,0,48]]),{difficulty:'core',family:'length-invariance'}),
 S('同一張角卡只旋轉，沒有剪開或摺動。圖中的哪個說法合理？',['大小不變，方向改了','轉向右邊就變大','頂點換位置就沒有角','邊朝下時一定是直角'],'旋轉整張角卡不改變兩邊張開程度，因此大小不變。',angles('同一張角卡旋轉前後',[['原來',105,0,75],['旋轉後',105,110,75]]),{difficulty:'core',family:'rotation-invariance'}),
 S('甲是用紙摺出的直角檢查片。比較乙的張開程度，乙應歸在哪一類？',['鈍角','銳角','直角','只看圖的方向不能辨認'],'以甲的直角作基準，乙比直角張開更多，但沒有張成一直線，屬於鈍角。',angles('以直角作為比較基準',[['甲：直角片',90,0],['乙：待判斷',130,25]]),{difficulty:'basic',family:'right-angle-reference'}),
 S('小安把甲的兩條邊都畫長，成為乙，並說「所以角變大」。應如何修正？',['張開程度不變，角仍一樣大','只延長一條邊才會變大','所有長邊都是鈍角','兩邊畫長，頂點就變成兩個'],'延長線段不改變它們的方向與張開程度；不能把邊長當作角的大小。',angles('檢查畫長線段的說法',[['甲',75,0,50],['乙',75,0,100]]),{difficulty:'challenge',family:'critique-length'}),
 S('三張卡邊長相同。把角從小排到大，哪個順序正確？',['丙、甲、乙','甲、乙、丙','乙、甲、丙','三張邊長相同，所以角相同'],'丙張開最小，甲次之，乙最大；邊長相同也可以有不同大小的角。',angles('依張開程度排序',[['甲',85],['乙',140],['丙',40]]),{difficulty:'core',family:'order-three'}),
 S('機器手臂固定一邊，只把另一邊向外打開，從甲變乙。下列哪項確實改變？',['角的大小','角的頂點數量','每個角有幾條邊','固定那一邊的長度'],'只有活動邊向外轉動，兩邊張開程度增加；頂點與兩邊的基本構成沒有改變。',angles('只移動其中一邊',[['甲',40],['乙',95]]),{difficulty:'core',family:'moving-one-ray'}),
 S('用直角片檢查兩個角，甲留下空隙，乙超出直角片。哪組分類正確？',['甲是銳角，乙是鈍角','甲、乙都是直角','甲是鈍角，乙是銳角','張開越小的角邊數越少'],'甲張開比直角小，是銳角；乙比直角大但不到平角，是鈍角。',angles('兩次直角片檢查',[['甲',55,20],['基準',90],['乙',125,10]]),{difficulty:'core',family:'classify-two'}),
 S('小晴想公平比較兩個角，不使用量角器。哪種做法最合適？',['讓頂點與其中一邊重合，再看另一邊','把較長的邊排在最前面','只比較角卡的紙張面積','把兩個頂點放得越遠越好'],'疊合頂點與一邊能使用同一基準比較張開程度，不受卡片大小影響。',angles('選擇角的比較方法',[['甲',65,15,90],['乙',95,30,55]]),{difficulty:'challenge',family:'choose-method'}),
 S('圖中甲、乙的方向不同。小凱說「只有兩邊一橫一直才是直角」，哪張卡能反駁他？',['乙也可以是直角','只有甲有頂點','乙旋轉後就變成鈍角','任何斜放的角都是銳角'],'直角旋轉後仍是直角，兩邊不必恰好對著紙面橫線與直線。',angles('旋轉後的直角',[['甲',90,0],['乙',90,40]]),{difficulty:'challenge',family:'right-angle-orientation'}),
 N('兩張完整長方形卡原本共有 8 個直角。只把其中一張旋轉，兩張卡共有幾個直角？',8,'個','每張完整長方形仍有 4 個直角，旋轉不改變角的種類；合計 4＋4＝8。',{kind:'rotatedRectangles',caption:'兩張完整卡片，沒有剪掉角',rotations:[0,35]},{difficulty:'core',family:'rectangle-rotation'}),
 S('把一張長方形卡的一個角沿斜線剪掉，留下的五邊形如圖。哪個說法正確？',['還有三個直角，斜切處新增兩個不是直角的角','角變多，所以每個角都變大','所有角仍然都是直角','只要是五邊形就一定沒有直角'],'原本四個直角中有一個被剪去，其餘三個仍保留；斜切處的兩個新角不是直角。',{kind:'cutCorner',caption:'只沿斜線剪去右上角'},{difficulty:'challenge',family:'cut-corner'}),
 S('圖上三條射線從同一個 O 點伸出。甲、乙兩個小角合起來成為較大的角，哪個判斷正確？',['大角比甲、乙各自都大','大角和甲一定相同','線多一條就代表頂點多一個','只要共用頂點，每個角就一樣大'],'甲、乙是不重疊的兩部分，合起來的張開程度比各部分大；它們仍共用頂點 O。',{kind:'splitAngle',caption:'兩個相鄰小角合成一個大角',opening:120,split:45},{difficulty:'challenge',family:'compose-angle'}),
 S('門板從甲的位置轉到乙，開口變小。若門板沒有換過，哪個理由最能解釋？',['兩邊之間的張開程度減少','門板自動縮短了','門框變成沒有頂點','所有門板的角都一樣大'],'門板轉動會改變它與門框之間的張開程度；開口變小不需要縮短門板。',angles('門框與門板的開口',[['甲',115,0,80],['乙',35,0,80]]),{difficulty:'core',family:'door-reason'}),
 S('圖中三位同學對同一個角的說法，哪一位用了正確的判斷依據？',['小禾：看兩邊張開程度','小安：看邊線顏色深不深','小晴：看圖離紙邊多遠','都只要數線段長度'],'角的大小由張開程度決定，顏色、紙面位置與邊的長短都不是判斷大小的依據。',angles('從證據判斷',[['觀察角',80,35,80]]),{difficulty:'basic',family:'identify-evidence'}),
 S('甲與乙原本是相同的角。只把甲的一邊向內轉，乙完全不動，之後怎麼比較？',['甲比乙小','甲與乙仍必定相等','乙的邊較長才會比較大','兩個角都沒有頂點'],'一邊向內轉會減少張開程度，甲因此變小；這與整張卡旋轉的情形不同。',angles('比較局部轉動與保持不動',[['甲：向內轉後',30],['乙：沒有改動',75]]),{difficulty:'challenge',family:'local-vs-whole-turn'})
];

const geometry5=[
 N('三角形 A、B 兩角如圖。C 角是多少度？',75,'度','三角形內角和 180 度，所以 180－45－60＝75。',tri(45,60),{difficulty:'basic',family:'third-angle'}),
 N('等腰三角形的頂角是 44 度，求一個底角。',68,'度','兩個底角相等，先求合計 180－44＝136，再除以 2，得 68。',iso(44),{difficulty:'core',family:'isosceles-base'}),
 S('小安說「這個三角形還有一個直角」。根據圖上兩個已知角，應如何判斷？',['不對，第三角是 80 度，不是直角','對，只要圖看起來像就可以','對，任何三角形都有直角','不對，因為三角形只有兩個角'],'先用內角和求第三角：180－35－65＝80 度；不能憑外觀判成直角。',tri(35,65),{difficulty:'challenge',family:'critique-right-triangle'}),
 N('等腰三角形的兩個底角各 72 度，頂角是多少度？',36,'度','底角合計 72×2＝144 度，頂角為 180－144＝36 度。',{kind:'triangleKnown',caption:'兩個底角相等',angles:[72,72,null]},{difficulty:'core',family:'isosceles-vertex'}),
 N('直角三角形有一個銳角是 28 度，另一個銳角是多少度？',62,'度','兩個銳角合計 90 度，90－28＝62 度。',tri(90,28),{difficulty:'core',family:'right-triangle-complement'}),
 S('三張角卡標示 50、60、80 度。小組想把它們當成同一個三角形的三內角，哪項檢查正確？',['合計 190 度，不能是同一個三角形的三內角','三個都是銳角，所以一定可以','只要有三張卡就可以','角卡顏色不同，所以一定不能'],'50＋60＋80＝190 度，不符合三角形內角和 180 度。',board('檢查三張角卡',['50°','60°','80°']),{difficulty:'challenge',family:'validate-angle-set'}),
 N('等腰三角形頂角 100 度。兩個底角相差多少度？',0,'度','等腰三角形的兩個底角相等；各為 40 度，所以相差 0 度。',iso(100),{difficulty:'core',family:'equal-angle-difference'}),
 N('兩個三角形各自的未知角分別是甲與乙。已知甲圖另外兩角為 40、65 度；乙圖為 55、55 度。甲比乙大幾度？',5,'度','甲＝180－40－65＝75；乙＝180－55－55＝70；相差 5 度。',{kind:'twoTriangles',caption:'分別求角，再作比較',triangles:[[40,65,null],[55,55,null]]},{difficulty:'challenge',family:'compare-triangles'}),
 N('兩根棒長 5、9 公分，第三根須為整數公分。最短可用幾公分，才圍得成三角形？',5,'公分','第三邊須大於兩邊差 4、小於兩邊和 14；最短整數長度是 5 公分。',sides(5,9),{difficulty:'core',family:'triangle-shortest-side'}),
 N('兩條邊長 6、10 公分。整數長度的第三邊，共有幾種可能？',11,'種','第三邊大於 4 且小於 16，整數可為 5～15，共 11 種。',sides(6,10),{difficulty:'challenge',family:'count-third-sides'}),
 S('三根棒長 4、7、11 公分。小晴說「剛好接在一起，就能圍成三角形」。哪個說明正確？',['4＋7＝11，三根只會排成直線，不能圍成三角形','相等時最容易圍成三角形','只檢查最長棒是否小於 20 就夠','三根棒不論長短一定能圍成'],'兩短邊的和必須大於最長邊；等於時無法圍出三角形。',board('比較兩短邊的和',['4 公分','7 公分','11 公分']),{difficulty:'challenge',family:'equality-is-not-triangle'}),
 N('三角形周長 24 公分，已知兩邊是 7、9 公分。第三邊多長？',8,'公分','24－7－9＝8，且 7＋8＞9，符合三角形條件。',sides(7,9),{difficulty:'core',family:'perimeter-missing-side'}),
 S('等邊三角形旋轉後，哪個性質仍然正確？',['三邊相等，每個內角都是 60 度','朝上的角一定最大','旋轉後只剩兩邊相等','直立時才有三個角'],'旋轉不改變邊長與角度；等邊三角形的三個角都為 60 度。',tri(60,60),{difficulty:'core',family:'equilateral-invariance'}),
 N('平行四邊形一角是 68 度。與它相鄰的內角是多少度？',112,'度','平行四邊形相鄰內角和為 180 度，180－68＝112。',{kind:'parallelogram',caption:'相鄰角未知',known:68},{difficulty:'core',family:'adjacent-parallelogram'}),
 N('平行四邊形一角 72 度。與它相對的角是多少度？',72,'度','平行四邊形的對角相等；相鄰角才是合計 180 度。',{kind:'parallelOpposite',caption:'求相對的內角',known:72},{difficulty:'core',family:'opposite-parallelogram'}),
 S('小凱把平行四邊形的兩個相鄰角寫成 70、70 度，哪個修正正確？',['保留其中一個 70 度，另一個應為 110 度','兩角一樣大，所以必定正確','把兩個角都改成 35 度','平行四邊形沒有相鄰的角'],'相鄰角須合計 180 度，70＋70 不符合；另一角是 110 度。',{kind:'parallelogram',caption:'核對相鄰角的紀錄',known:70},{difficulty:'challenge',family:'critique-adjacent-equality'}),
 N('四邊形三個內角分別是 80、95、110 度。第四個內角是多少度？',75,'度','四邊形內角和是 360 度，360－80－95－110＝75。',{kind:'quadKnown',caption:'已知三個內角',angles:[80,95,110,null]},{difficulty:'core',family:'fourth-angle'}),
 N('四邊形中，甲、乙兩角都是直角，丙角是 65 度。丁角比丙角大幾度？',50,'度','丁＝360－90－90－65＝115 度；115－65＝50 度。',{kind:'quadKnown',caption:'先求未知角，再求差',angles:[90,90,65,null]},{difficulty:'challenge',family:'quadrilateral-angle-difference'}),
 S('一張圖形卡只註明「四邊等長」。哪個結論一定成立？',['它是菱形，但還不能確定四角都是直角','一定是正方形','一定不是平行四邊形','四邊等長代表只有一個內角'],'四邊等長可判為菱形；還要知道四角為直角，才能判為正方形。',{kind:'rhombus',caption:'四邊有相同的等長記號'},{difficulty:'challenge',family:'sufficient-shape-condition'}),
 N('一個長方形長 12 公分、寬 7 公分。把它旋轉後，周長是多少公分？',38,'公分','旋轉不改變邊長，周長為（12＋7）×2＝38 公分。',{kind:'rectangleDimensions',caption:'旋轉前後邊長不變',width:12,height:7},{difficulty:'core',family:'rectangle-perimeter-invariance'})
];

const additions={
8:[
 N('圖書借閱量如圖。週二比週一增加的本數，是週四比週三增加本數的幾倍？',2,'倍','週二增加 30－20＝10 本，週四增加 30－25＝5 本，10÷5＝2。',null,{chart:chart('四天借閱量',[20,30,25,30]),difficulty:'challenge',family:'ratio-of-changes'}),
 N('四天借閱量合計 120 本，週四的紀錄遺失。已知週一 20、週二 35、週三 25 本，週四幾本？',40,'本','120－20－35－25＝40 本；用總數減去已知三天。',board('紀錄單缺一格',['週一 20 本','週二 35 本','週三 25 本','週四 ？本']),{difficulty:'core',family:'missing-chart-value'}),
 S('圖中週二、週四都是 30 本。下列哪個說法仍符合資料？',['兩天相同，但中間借閱量曾下降','兩天相同，表示四天每天都相同','週二到週四持續增加','週三沒有任何人借書'],'週三降到 18 本，再回升至 30 本；相同的端點不代表中途沒有變化。',null,{chart:chart('觀察中途變化',[20,30,18,30]),difficulty:'challenge',family:'same-endpoints'}),
 N('從週一到週四，總共「增加過」多少本？只把相鄰兩天上升的量相加。',25,'本','週一到週二增加 15，週三到週四增加 10，合計 25；中間減少 5 不計入上升量。',null,{chart:chart('分清上升量與整體變化',[20,35,30,40]),difficulty:'challenge',family:'sum-positive-changes'}),
 S('同一份資料把縱軸每格從 5 本改成 10 本。哪項敘述正確？',['資料值不變，但線段的視覺陡度可能不同','所有借閱量變成兩倍','最高點必定換到別天','改刻度等於刪除一半資料'],'刻度是表示數據的方法，改變刻度不改變原始借閱數，閱讀時要先看單位與刻度。',null,{chart:chart('先讀刻度再判斷',[15,25,20,35]),difficulty:'challenge',family:'scale-interpretation'}),
 N('若每天至少借出 25 本才達標，這四天總共還差幾本才能讓每一天都達標？',15,'本','週一差 25－15＝10，週三差 25－20＝5，另外兩天已達標；合計差 15。',null,{chart:chart('每天目標 25 本',[15,35,20,30]),difficulty:'challenge',family:'daily-shortfalls'})
],
9:[
 N('24 枝筆要平均裝盒、不剩下；每盒至少 5 枝、至多 8 枝。有幾種不同的每盒枝數？',2,'種','24 的因數中，5～8 之間只有 6、8，所以有 2 種。',board('分裝條件',['總數 24 枝','每盒 5～8 枝','每盒同樣多，不剩下']),{difficulty:'challenge',family:'factors-with-bounds'}),
 N('一個數是 6 的倍數，大於 30 而且小於 50，個位是 2。這個數是多少？',42,'','候選數是 36、42、48，只有 42 的個位為 2。',board('三個線索一起看',['6 的正倍數','30＜□＜50','個位數字是 2']),{difficulty:'challenge',family:'multiple-clues'}),
 S('小安說「8 是 24 的倍數，因為 24÷8＝3」。應怎麼修正？',['24 是 8 的倍數，8 是 24 的因數','8 和 24 互為倍數','3 是 24 的最大因數','兩個數有關係就互為因數'],'24 可以用 8 乘整數 3 得到，所以 24 是 8 的倍數，8 是 24 的因數。',cards('從整除式判讀關係',[24,8,3]),{difficulty:'challenge',family:'factor-multiple-direction'}),
 N('36 人排隊，排數要比每排人數少，兩者都大於 1。共有幾種不同的排法？',3,'種','可排 2 排每排 18 人、3 排每排 12 人、4 排每排 9 人；6×6 不符合排數較少，共 3 種。',board('長方形隊伍的限制',['36 人，不剩下','排數＜每排人數','排數與每排人數都＞1']),{difficulty:'challenge',family:'factor-pair-constraint'}),
 N('從 1 到 40 的整數中，是 5 的倍數但不是 10 的倍數的數，共有幾個？',4,'個','符合的是 5、15、25、35；去除同時是 10 倍數的數，共 4 個。',board('在兩個條件之間篩選',['1～40，含端點','是 5 的倍數','不是 10 的倍數']),{difficulty:'core',family:'multiple-exclusion'}),
 N('小晴把 18 的所有因數寫成 1、2、3、6、9，漏掉的因數是多少？',18,'','每個正整數本身也是因數；完整列表是 1、2、3、6、9、18。',board('檢查清單是否完整',['18 的因數清單','1、2、3、6、9、□']),{difficulty:'core',family:'check-factor-list'})
],
11:[
 N('紅繩 24 公分、藍繩 36 公分，要剪成同樣長且不剩下的小段。每段最長幾公分？',12,'公分','每段長要同時整除 24、36，最大公因數是 12。',board('兩條繩都要剛好剪完',['紅繩 24 公分','藍繩 36 公分','每段同長，不剩下']),{difficulty:'core',family:'rope-gcd'}),
 N('甲車每 12 分鐘、乙車每 18 分鐘發車一次，上午 8：00 同時出發。到 8：40 前，下一次同時發車是 8 點幾分？',36,'分','最小公倍數為 36 分鐘，8：00 再過 36 分鐘是 8：36。',board('從共同起點往後推',['甲：每 12 分鐘','乙：每 18 分鐘','共同起點 8：00']),{difficulty:'challenge',family:'schedule-time'}),
 N('有 18 枝紅筆、30 枝藍筆，要分成最多包且各包兩色數量相同、都不剩。每包共有幾枝筆？',8,'枝','最多可分 6 包，每包紅筆 3 枝、藍筆 5 枝，合計 8 枝；題目問每包枝數，不是包數。',board('先找包數，再算每包',['18 枝紅筆','30 枝藍筆','最多包，每包內容相同']),{difficulty:'challenge',family:'gcd-then-per-group'}),
 N('鉛筆每包 6 枝、原子筆每包 8 枝，兩種各買到相同枝數且總枝數最少。兩種筆合計幾枝？',48,'枝','每種最少 24 枝，兩種合計 24＋24＝48 枝；不能只答最小公倍數 24。',board('「每種」與「合計」不同',['鉛筆：每包 6 枝','原子筆：每包 8 枝','兩種枝數相同']),{difficulty:'challenge',family:'lcm-then-total'}),
 S('長 18、寬 24 公分的紙要切成最大且同樣大的正方形、不剩紙。小安想用最小公倍數當邊長，錯在哪裡？',['正方形邊長要整除長與寬，應找最大公因數','只要是公倍數都能放進紙裡','最大正方形邊長應大於紙的長與寬','長方形一定只能切成兩個正方形'],'切割不剩時，正方形邊長必須是長寬的共同因數，最大邊長為 6 公分。',{kind:'tiling',caption:'正方形要能排入長方形',width:24,height:18},{difficulty:'challenge',family:'choose-gcd-not-lcm'}),
 N('一個數大於 20、小於 50，同時是 4 和 6 的倍數，而且不是 8 的倍數。這個數是多少？',36,'','範圍內的公倍數為 24、36、48；排除 8 的倍數 24、48，剩下 36。',board('公倍數加上排除條件',['20＜□＜50','同時是 4、6 的倍數','不是 8 的倍數']),{difficulty:'challenge',family:'common-multiple-exclusion'})
],
12:[
 N('一個角柱共有 10 個頂點，它的底面是幾邊形？',5,'邊形','角柱上下底面各有相同數量的頂點，10÷2＝5，所以底面是五邊形。',{kind:'solids',caption:'根據頂點資訊反推',hideNames:true,models:[{shape:'prism',n:5,count:1}]},{difficulty:'core',family:'inverse-prism-vertices'}),
 N('一個角錐有 6 個面，這個角錐有幾個頂點？',6,'個','扣除一個底面，側面有 5 個，為五角錐；底面 5 個頂點加尖頂 1 個，共 6 個。',{kind:'solids',caption:'由面數推回底面，再求頂點',hideNames:true,models:[{shape:'pyramid',n:5,count:1}]},{difficulty:'challenge',family:'pyramid-face-to-vertices'}),
 N('三角柱與四角錐各做一個骨架，每條邊各用一根細棒且不共用。合計需要幾根？',17,'根','三角柱需要 9 根，四角錐需要 8 根，合計 17 根。',{kind:'solids',caption:'兩種形體分開計算',models:[{shape:'prism',n:3,count:1},{shape:'pyramid',n:4,count:1}]},{difficulty:'challenge',family:'mixed-skeletons'}),
 S('小晴說「圓柱放橫時就不是圓柱」。哪個理由能修正她？',['旋轉不改變兩個圓形底面與曲面的構造','圓柱只要轉動就會長出頂點','圓柱橫放後會有六個平面','圓柱能不能站立決定名稱'],'形體名稱看構造，與擺放方向無關；圓柱仍有兩個圓形平面與一個曲面。',{kind:'solids',caption:'觀察構造，不用站立方向命名',models:[{shape:'cylinder',count:1}]},{difficulty:'core',family:'solid-orientation'}),
 N('有一個四角柱、一個圓錐和一個球。這些形體的頂點合計有幾個？',9,'個','四角柱有 8 個頂點，圓錐 1 個，球 0 個，合計 9 個。',{kind:'solids',caption:'三種形體的頂點比較',models:[{shape:'prism',n:4,count:1},{shape:'cone',count:1},{shape:'sphere',count:1}]},{difficulty:'challenge',family:'mixed-vertices'}),
 S('圖上角柱有些邊畫成虛線。計算骨架需要的細棒時，應怎麼處理？',['虛線仍代表真正的邊，要一起計算','虛線全部不能計算','只算正面看得到的一個面','只計算最長的一條邊'],'虛線表示被遮住的邊，仍是完整形體的一部分；骨架要包含所有邊。',{kind:'solids',caption:'虛線表示被遮住的邊',models:[{shape:'prism',n:3,count:1}]},{difficulty:'core',family:'hidden-edges'})
],
17:[
 N('用 0、2、5、8 四張數字卡各一次排成四位數，最大的偶數是多少？',8520,'','先讓千位最大為 8、百位 5；剩下 2、0 排成最大偶數尾數 20，得 8520。',cards('每張卡都只能用一次',[0,2,5,8]),{difficulty:'challenge',family:'largest-even-number'}),
 N('用 0、3、6、9 四張數字卡各一次，排成最小四位數是多少？',3069,'','千位不能放 0，先放最小的 3，再把剩下數字由小到大放，得到 3069。',cards('最小四位數，千位不能是零',[0,3,6,9]),{difficulty:'challenge',family:'smallest-with-zero'}),
 N('數線每一大格增加同樣多。依序標著 2980、2990、□、3010，□ 是多少？',3000,'','每格增加 10，2990 再加 10 是 3000，要注意跨過百與千。',board('等距數線紀錄',['2980 → 2990 → □ → 3010']),{difficulty:'core',family:'cross-thousand-sequence'}),
 N('一個四位數有 4 個千、12 個百、3 個十、6 個一。這個數是多少？',5236,'','12 個百是 1200，4000＋1200＋30＋6＝5236；百的數量可以再換成千。',board('不標準的位值分組',['4 個千','12 個百','3 個十','6 個一']),{difficulty:'challenge',family:'regroup-place-value'}),
 N('把 5832 的百位與個位數字交換，新數是多少？',5238,'','原百位是 8、個位是 2；交換後千位與十位不動，得到 5238。',cards('只交換百位與個位',[5832]),{difficulty:'core',family:'swap-digits'}),
 S('小安說「4098 比 4102 大，因為 98 比 2 大」。哪項修正正確？',['4102 較大，千位相同後要先比較百位','只比較最後一個數字就好','有 0 的數一定最小','兩個數都有四位，所以一樣大'],'四位數由高位依序比較；千位同為 4，4102 的百位 1 大於 4098 的百位 0。',cards('比較時從高位開始',[4098,4102]),{difficulty:'challenge',family:'critique-number-comparison'})
],
18:[
 N('圖書館原有 3250 本，上午借出 486 本，下午還回 278 本。現在有幾本？',3042,'本','先借出再還回：3250－486＋278＝3042 本。',board('兩種方向的數量變化',['原有 3250 本','借出 486 本','還回 278 本']),{difficulty:'challenge',family:'subtract-then-add'}),
 N('小晴買 1680 元的書包與 875 元的鞋子，付 3000 元，應找回多少元？',445,'元','先算合計 1680＋875＝2555，再算找零 3000－2555＝445。',board('先合計，再找零',['書包 1680 元','鞋子 875 元','付 3000 元']),{difficulty:'challenge',family:'total-then-change'}),
 N('兩班共募集 4320 元，甲班比乙班多 680 元。若甲班募到 2500 元，乙班募到幾元？',1820,'元','用總數減甲班：4320－2500＝1820；再用 2500－1820＝680 檢查條件。',board('三項資訊互相核對',['合計 4320 元','甲班 2500 元','甲比乙多 680 元']),{difficulty:'challenge',family:'consistent-information'}),
 N('印表機顯示的累積張數由 2897 變成 3506，這段期間印了幾張？',609,'張','累積數相減才是期間印量：3506－2897＝609 張。',board('累積數不是本次印量',['開始 2897 張','結束 3506 張']),{difficulty:'core',family:'cumulative-difference'}),
 N('□－1785＝2640。□ 是多少？',4425,'','被減數＝差＋減數，所以 2640＋1785＝4425；可代回原式檢查。',board('用逆運算找缺少的數',['□－1785＝2640']),{difficulty:'core',family:'unknown-minuend'}),
 S('小安算 4002－1987＝2115。下列哪個檢查最能直接發現錯誤？',['把 2115 加回 1987，結果不是 4002','看答案有四位數就算對','只看個位 5 就能保證正確','把 1987 改成 1000 再比較'],'減法可用差加減數回推被減數；2115＋1987＝4102，沒有回到 4002。',board('檢查退位計算',['原式：4002－1987','小安的答案：2115']),{difficulty:'challenge',family:'verify-subtraction'})
],
19:[
 N('長 8 公分的紙條剪掉 27 毫米，剩下多少毫米？',53,'毫米','先換成相同單位：8 公分＝80 毫米，80－27＝53 毫米。',{kind:'lengths',caption:'先換單位再相減',segments:[{value:8,label:'公分'},{value:27,label:'毫米'}]},{difficulty:'challenge',family:'mixed-unit-subtraction'}),
 N('兩段紙條長 46、38 毫米，重疊 9 毫米黏成一條，整條多長？',75,'毫米','46＋38 先算出兩段合計，重疊部分被算了兩次，要減一次 9，得 75。',{kind:'lengths',caption:'有重疊，不能直接相加',segments:[{value:46,label:'毫米'},{value:38,label:'毫米'}]},{difficulty:'challenge',family:'overlap-length'}),
 N('鉛筆不是從尺的 0 刻度量起，而是由 12 毫米到 39 毫米。鉛筆長多少毫米？',27,'毫米','終點減起點：39－12＝27 毫米；不能直接把 39 當長度。',null,{figure:{type:'ruler',start:12,end:39},difficulty:'core',family:'nonzero-ruler'}),
 N('一條 9 公分長的紙帶，要剪下 4 段、每段 18 毫米。紙帶還剩多少毫米？',18,'毫米','9 公分＝90 毫米，4 段共 18×4＝72 毫米，90－72＝18。',board('先算需要的總長',['紙帶 9 公分','每段 18 毫米','剪 4 段']),{difficulty:'challenge',family:'repeat-length-and-remainder'}),
 S('小晴說「6 公分 4 毫米比 60 毫米短，因為 4 小於 60」。應如何修正？',['6 公分 4 毫米是 64 毫米，比 60 毫米長','不同單位永遠不能比較','只比較毫米那一段就可以','有兩種單位表示長度一定較短'],'先統一單位，6 公分 4 毫米＝64 毫米，比較 64 與 60 才合理。',{kind:'lengths',caption:'完整讀出複名數',segments:[{value:6,label:'公分'},{value:4,label:'毫米'}]},{difficulty:'challenge',family:'critique-unit-comparison'}),
 N('兩條相同長的線合計 14 公分。每條線長多少毫米？',70,'毫米','每條線 14÷2＝7 公分，再換成 70 毫米。',board('相同的兩條線',['兩條合計 14 公分','每條長度相同']),{difficulty:'core',family:'equal-parts-conversion'})
],
20:[
 N('每盒 24 枝彩色筆，買 6 盒，另外送 8 枝，總共幾枝？',152,'枝','先算 24×6＝144，再加送的 8 枝，得 152 枝。',{kind:'groups',caption:'六盒以外還有贈品',per:24,count:6,unit:'盒'},{difficulty:'challenge',family:'product-plus-extra'}),
 N('每張票 135 元，買 4 張，付 600 元，找回多少元？',60,'元','135×4＝540 元，600－540＝60 元。',board('乘法與找零',['每張 135 元','4 張票','付 600 元']),{difficulty:'challenge',family:'product-and-change'}),
 N('每箱 128 瓶水，買 5 箱；活動喝掉 76 瓶，剩幾瓶？',564,'瓶','先算 128×5＝640，再減 76＝564 瓶。',{kind:'groups',caption:'先求總量，再扣除使用量',per:128,count:5,unit:'箱'},{difficulty:'challenge',family:'product-minus-used'}),
 N('甲每天讀 18 頁、乙每天讀 15 頁，兩人都讀 7 天。甲比乙多讀幾頁？',21,'頁','每天相差 18－15＝3 頁，7 天相差 3×7＝21 頁。',board('比較相同天數的累積量',['甲：每天 18 頁','乙：每天 15 頁','都讀 7 天']),{difficulty:'challenge',family:'difference-times-days'}),
 N('小安把 203×4 的十位 0 漏掉，算成 23×4。他的答案比正確答案少多少？',720,'','正確為 812，錯誤為 92，相差 720；漏掉的 180 乘 4 也得到 720。',board('找出漏掉位值的影響',['正確：203×4','誤算：23×4']),{difficulty:'challenge',family:'zero-place-value-error'}),
 S('小晴把 36×5 寫成 30×5＋6。應如何修正？',['30×5＋6×5，個位也要乘 5','30×5＋6×0','30＋6×5，十位不用乘','36＋5 就是同一題'],'把 36 分成 30 與 6 時，兩部分都要乘 5，再把 150 與 30 相加。',board('分拆乘數後，每一部分都要處理',['36＝30＋6','36×5＝？']),{difficulty:'challenge',family:'distributive-error'})
]
};

// 公開卷中的「缺格乘法」與「等腰兩邊不能直接猜」題型，換題材並保留條件推理。
grade3Angles.forEach(q=>{q.referenceFocus='多圖比較、直角基準、邊長與旋轉迷思';});
grade3Angles[2].options=['大小不變，方向改了','旋轉後張開程度一定變大','旋轉後張開程度一定變小','方向不同就一定不能比較'];
grade3Angles[8].options=['讓頂點與其中一邊重合，再看另一邊','只讓頂點重合，兩邊都不對齊就直接比端點','只把最長的一邊排成平行，不核對頂點','先算兩條邊的長度和，再比較長度和'];
grade3Angles[11].options=['還有三個直角，斜切處新增兩個不是直角的角','還有四個直角，因為斜切不影響原本四角','只剩兩個直角，因為斜線兩端各減掉一個直角','共有五個直角，因為現在有五個頂點'];
grade3Angles[12].options=['大角比甲、乙各自都大','大角等於甲、乙中比較大的那個','大角比甲大，但一定比乙小','共用同一個頂點，所以三個角一樣大'];
geometry5.push(N('等腰三角形其中兩邊長 6、12 公分。第三邊應是幾公分？',12,'公分','等腰第三邊可能先想到 6 或 12；但 6＋6＝12 不能圍成三角形，所以只能是 12。',sides(6,12),{difficulty:'challenge',family:'isosceles-side-elimination',referenceFocus:'明義卷第二大題第 6 題的條件排除'}));
additions[20].push(N('乘法直式有一格被遮住：2□6×3＝738。□ 內的數字是多少？',4,'','個位 6×3＝18，向十位進 1；試填 4 時，4×3＋1＝13，十位寫 3 再進 1，百位 2×3＋1＝7，符合 738。',board('找回直式中的缺格',['2□6','×3','＝738']),{difficulty:'challenge',family:'missing-multiplication-digit',referenceFocus:'五堵卷第二大題第 3 題的缺格乘法'}));

export default function curateMath(units){
 for(const u of units.filter(u=>u.subject==='數學')){
  const before=u.questions.length;
  if(u.id===21||u.id===10){const rows=u.id===21?grade3Angles.filter((q,i)=>![4,7,9,13,14,15].includes(i)):geometry5.filter((q,i)=>i!==6);u.questions=rows.map((q,i)=>({...q,id:`u${u.id}-t${41+i}-n1`,unit:u.id,topic:40+i,concept:q.family,revision:6,difficulty:q.difficulty||'core',family:q.family}));}
  else {
   // 每種原始任務只保留一題，刪除只換數字的其餘版本。
   const seen=new Set();u.questions=u.questions.filter(q=>{const key=q.concept;if(seen.has(key))return false;seen.add(key);q.family='foundation-'+key;q.difficulty='basic';return true;});
   // 非零起點讀尺已有一題；新題取代它而不另外重複。
   if(u.id===19)u.questions=u.questions.filter(q=>!q.figure);
   const extra=additions[u.id]||[];u.questions.push(...extra.map((q,i)=>({...q,id:`u${u.id}-t${41+i}-n1`,unit:u.id,topic:40+i,concept:q.family,revision:6,difficulty:q.difficulty||'core'})));
  }
  u.qualityRevision=6;u.audit={before,after:u.questions.length,reason:'刪除只換數字的模板變體；加入比較、條件推理、逆向與多步驟任務。'};
 }
}
