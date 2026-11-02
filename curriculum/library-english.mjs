const people=[['Amy','Ben','Cody'],['Emma','Fred','Gina'],['Leo','May','Nick'],['Tina','Tom','Mia'],['Nina','Owen','Paul']];
const unique=(a,others)=>[a,...[...new Set(others)].filter(x=>x!==a)].slice(0,4);
const one=(text,answer,others,explanation)=>({type:'single',text,options:unique(answer,others),answer:0,explanation});
export default function english(units){
 const out=[];
 for(const unit of [6,7,15,16]){
  const lower=unit>=15,age=unit===16,fruit=unit===7,ref=lower?'REF-d7ead9893d':'REF-bf9819daf9';
  const base={unit,revision:16,sourceIds:[ref],referencePages:[1,2],sourceType:'依公開英語卷共同句型與圖文題型重新編寫',visualPolicy:'none',difficulty:'core'};
  function add(n,q){out.push({...base,id:`u${unit}-t${201+n}-a`,topic:200+n,concept:units[unit].name,family:`library-en-${unit}-${n}`,...q});}
  if(lower){
   const rows=age?[
    one('A: How old are you?　B: ______','I’m eight.',['My name is Amy.','Good morning.','Nice to meet you.'],'How old are you? 詢問年齡，應以年歲回答。'),
    one('「I’m ten years old.」是幾歲？','10',['1','7','8'],'ten 是十，不是 one。'),
    one('圖卡上的生日數字是 7。請選出對應句子。','I’m seven.',['I’m six.','I’m eight.','I’m ten.'],'圖卡數字 7 對應 seven。'),
    one('哪個問句適合詢問對方幾歲？','How old are you?',['What’s your name?','Good morning.','Nice to meet you.'],'How old 用來問年齡；What’s your name? 問姓名。'),
    one('A: I’m nine.　B: I’m nine, too.　兩人情況如何？','兩人都九歲',['A 九歲，B 十歲','兩人名字相同','兩人都十九歲'],'too 在這裡表示也，兩人都九歲。'),
    one('I’m six ______ old.','years',['name','morning','hello'],'表達年齡常用數字加 years old。'),
    one('ten、eight、six，依數量由大到小是哪個？','10、8、6',['6、8、10','8、10、6','10、6、8'],'三個英文數字依序是十、八、六。'),
    one('A: My name is Ben. I’m eight.　Ben 介紹了什麼？','姓名與年齡',['只有姓名','只有年齡','飲料喜好'],'My name is Ben. 介紹姓名，I’m eight. 介紹年齡。'),
    one('「nine」對應哪個數字？','9',['6','8','10'],'nine 是九，與 six 的六不同。'),
    one('A: How old are you?　B: I’m ______.　要表示五歲應填？','five',['fine','name','hello'],'five 是五；fine 不是年齡數字。'),
    one('A: I’m seven.　B: I’m ten.　誰年紀較大？','B',['A','兩人同歲','無法比較'],'十歲比七歲大，因此是 B。'),
    one('Which number is eight?','8',['3','6','9'],'eight 表示八。')
   ]:[
    one('A: What’s your name?　B: ______','My name is Ben.',['I’m seven.','Good morning.','Nice to meet you.'],'詢問姓名時，以 My name is… 或 I’m… 加姓名回答。'),
    one('A: Nice to meet you.　B: ______','Nice to meet you, too.',['My name is Nice.','What’s your name, too?','I’m morning.'],'初次見面的招呼可回應 Nice to meet you, too.。'),
    one('「My name is Amy.」說話者的名字是什麼？','Amy',['My','Name','Is'],'My name is 後面的 Amy 是姓名。'),
    one('哪個句子是在介紹自己？','I’m Cody.',['Hello, Cody.','Good morning, Cody.','Nice to meet you, Cody.'],'I’m Cody. 介紹自己的名字；其他句子是在對 Cody 打招呼。'),
    one('Tom 說：「Hello, Tina.」誰是被打招呼的人？','Tina',['Tom','Hello','兩人都叫 Tom'],'冒號前是 Tom 在說話，Hello 後的 Tina 是被稱呼的人。'),
    one('字母 A 對應哪個小寫？','a',['b','d','e'],'A 的小寫是 a，留意 b 與 d 的方向。'),
    one('字母 m 對應哪個大寫？','M',['N','W','H'],'m 的大寫是 M，不能與 N 混淆。'),
    one('A、B、C、______，空格應填哪個？','D',['E','G','B'],'英文字母依序是 A、B、C、D。'),
    one('Amy 和 Ann 的名字如何辨別？','比較完整拼字',['只看第一個 A 就當同一人','只看字母顏色','只看兩人誰先說話'],'兩個名字都以 A 開頭，需繼續核對後面的字母。'),
    one('A: Good morning!　B: ______','Good morning!',['My morning is Ben.','Name is good.','I’m your name.'],'早晨可用 Good morning! 互相問候。'),
    one('I’m Ben. 與 My name is Ben. 在介紹姓名時有何關係？','都可以表示自己叫 Ben',['前者只問年齡','後者表示十歲','兩句都不是自我介紹'],'兩種句型都可用於介紹自己的姓名。'),
    one('字母順序 g、h、______，空格應填？','i',['j','f','b'],'g、h 之後是 i。')
   ];
   rows.forEach((q,i)=>{if(age&&i===2)q.visual={kind:'referenceNumber',caption:'生日數字卡',description:'依數字卡選出對應的英文句子。',value:7};add(i,q);});
  }else{
   const rows=fruit?[
    one('How many ______ do you need?','apples',['apple','an apple','a apple'],'How many 後接可數名詞複數 apples。'),
    one('She ______ two bananas.','needs',['need','needing','are need'],'第三人稱單數 she 搭配 needs。'),
    one('A: How many oranges do you need?　B: ______','I need three oranges.',['I like orange juice.','Yes, I do.','She likes milk.'],'問數量需要回答所需水果及數量。'),
    one('We need one ______.','apple',['apples','an apples','a apples'],'one 後接單數 apple。'),
    one('They ______ four bananas.','need',['needs','does need','is need'],'複數主詞 they 搭配 need。'),
    one('圖中有幾個 apples？','3',['2','4','5'],'逐個數圖上的蘋果，共三個。'),
    one('「We need two oranges.」中需要幾個橘子？','2',['1','3','4'],'two 表示二，所以這句是需要兩個橘子。'),
    one('A: Does Ben need apples?　B: Yes, he ______.','does',['do','need','is'],'Does 問句的肯定簡答用 Yes, he does.。'),
    one('Amy needs five bananas. She has three. How many more does she need?','2',['3','5','8'],'需要五根、已有三根，再需 5－3＝2 根。'),
    one('A: How many apples does she need?　B: She ______ one apple.','needs',['need','do','are'],'回答為 she needs，需注意第三人稱單數。'),
    one('圖中 apples 和 bananas 合計有幾個？','5',['2','3','6'],'圖上三個蘋果與兩根香蕉，合計五個。'),
    one('Which sentence is correct?','We need two apples.',['We needs two apples.','We need two apple.','We needs two apple.'],'we 搭配 need，two 後用複數 apples。')
   ]:[
    one('______ she like milk tea?','Does',['Do','Is','Are'],'第三人稱單數 she 用 Does 詢問喜好。'),
    one('He ______ orange juice.','likes',['like','liking','are like'],'he 搭配 likes。'),
    one('A: Do you like milk?　B: No, I ______.','don’t',['doesn’t','isn’t','aren’t'],'Do you…? 的否定回答為 No, I don’t.。'),
    one('A: Does Ben like tea?　B: Yes, he ______.','does',['do','is','likes'],'Does 問句的簡答為 Yes, he does.。'),
    one('They ______ water.','like',['likes','does like','is like'],'they 是複數主詞，使用 like。'),
    one('She doesn’t ______ milk tea.','like',['likes','liking','liked'],'doesn’t 後使用原形動詞 like。'),
    one('A: What do you like?　B: ______','I like orange juice.',['I’m eight.','My name is Amy.','I need two apples.'],'問題問喜好，應回應喜歡的飲料。'),
    one('My dad likes tea. I like milk. Who likes tea?','My dad.',['I do.','Both people.','Nobody.'],'第一句直接指出 dad 喜歡 tea。'),
    one('Which sentence is correct?','She likes milk.',['She like milk.','She do like milk.','She are like milk.'],'第三人稱單數 she 的肯定句用 likes。'),
    one('A: Do Amy and Ben like water?　B: Yes, ______.','they do',['she does','he does','they does'],'Amy and Ben 是兩人，用 they do。'),
    one('I like juice, but I don’t like tea. Which drink do I like?','Juice.',['Tea.','Both drinks.','Neither drink.'],'but 後為不喜歡茶；前面說喜歡果汁。'),
    one('A: Does your mom like milk?　B: No, ______.','she doesn’t',['she don’t','he doesn’t','they do'],'mom 對應 she，Does 問句否定簡答用 doesn’t。')
   ];
   rows.forEach((q,i)=>{if(fruit&&[5,10].includes(i))q.visual={kind:'referenceFruit',caption:'水果數量圖',description:'請觀察圖中的水果，逐一數出數量。',items:[{name:'apples',count:3},...(i===10?[{name:'bananas',count:2}]:[])]};add(i,q);});
  }
  for(let n=0;n<(unit===6?5:4);n++){
   const [a,b,c]=people[n],passageId=`library-english-${unit}-${n}`,ages=[7+n%3,9,8];
   let passage,questions,rows,headers;
   if(lower){
    passage=age?`${a}: Hello! My name is ${a}. I’m ${ages[0]}. How old are you?\n${b}: Hi! I’m ${b}. I’m ${ages[1]} years old.\n\n${c}: Good morning! My name is ${c}. I’m ${ages[2]}.\n${a}: Nice to meet you, ${c}.\n\n${c}: Nice to meet you, too.`:`${a}: Good morning! My name is ${a}. What’s your name?\n${b}: Hello! I’m ${b}. Nice to meet you.\n\n${a}: Nice to meet you, too.\n${c}: Hi, ${b}! My name is ${c}.\n\n${b}: Hello, ${c}!`;
    questions=age?[
     one(`${a} 幾歲？`,String(ages[0]),['6','7','8','9','10'],`對話中 ${a} 說 I’m ${ages[0]}.。`),
     one('誰說 I’m nine years old.?',b,[a,c,'三人一起說'],`${b} 說自己九歲。`),
     one(`誰向 ${c} 說 Nice to meet you?`,a,[b,c,'沒有任何人'],`第三人的介紹後，是 ${a} 向 ${c} 打招呼。`),
     one(`哪筆姓名年齡資料正確？`,`${c}—8`,[`${c}—6`,`${b}—7`,`${a}—10`],`${c} 在介紹中說 I’m 8.。`),
     one('How old are you? 是要確認哪項資料？','年齡',['姓名','飲料喜好','水果數量'],'How old 詢問年齡，與介紹姓名不同。')
    ]:[
     one('第一個介紹自己的人是誰？',a,[b,c,'沒有介紹'],`對話開頭是 ${a} 說 My name is ${a}.。`),
     one(`誰回答 ${a} 的姓名問題？`,b,[a,c,'三人同時'],`What’s your name? 之後由 ${b} 回答。`),
     one(`Hi, ${b}! My name is ${c}. 是誰說的？`,c,[a,b,'沒有說話者'],`冒號前標明說話者 ${c}；${b} 是被打招呼的人。`),
     one('哪組名單與三人介紹一致？',`${a}、${b}、${c}`,[`${a}、Hello、${c}`,`${b}、Morning、Name`,`${c}、Nice、You`],'名單應列三位人物，招呼語不是姓名。'),
     one('哪句適合回應 Nice to meet you.?','Nice to meet you, too.',['My name is Nice.','What’s your old?','I’m morning.'],'初次見面可用 Nice to meet you, too. 回應。')
    ];headers=['Name',...(age?['Age']:[])];rows=[a,b,c].map((v,i)=>[v,...(age?[ages[i]]:[])]);
   }else if(fruit){
    const target=5+n,have=2+n,bananas=2+n%2;
    passage=`${a}: Let’s make fruit salad. We need ${target} apples and ${bananas} bananas.\n${b}: We have ${have} apples and ${bananas} bananas.\n\n${a}: How many more apples do we need?\n${b}: Three. We don’t need more bananas.\n\n${c}: I have three apples. Here you are!\n${a}: Thank you. Now we have ${target} apples. Let’s wash the fruit first.`;
    questions=[one('How many apples do they need in all?',String(target),['2','3','4','5','6','7','8'],`目標是 ${target} apples，需與一開始已有的數量區分。`),one('How many more apples do they need at first?','3',[String(target),String(have),'1','9'],'目標減現有數量，還差三個。'),one('Do they need more bananas?','No, they don’t.',['Yes, they do.','They need three more.','They need five more.'],'現有香蕉數已等於目標，不需再補。'),one('Who brings three apples?',c,[a,b,'Nobody.'],`${c} 說 I have three apples. Here you are!。`),one('What do they do before making the salad?','Wash the fruit.',['Eat all the apples.','Buy more bananas.','Throw away the list.'],'最後一句 Let’s wash the fruit first. 指出先洗水果。')];
    headers=['Fruit','Need','Have at first'];rows=[['apples',target,have],['bananas',bananas,bananas]];
   }else if(n===4){
    passage='Nina: I like milk and water.\nOwen: I like milk, too. I don’t like tea.\n\nPaul: We have tea and water. We don’t have milk.\nNina: Water for me, please.\n\nOwen: Water for me, too.\nPaul: OK. Two cups of water.';
    questions=[one('Which drink is NOT available?','Milk.',['Water.','Tea.','All three drinks.'],'Paul 說沒有 milk；另兩種飲料有提供。'),one('What does Owen NOT like?','Tea.',['Milk.','Water.','All drinks.'],'Owen 說 I don’t like tea.。'),one('What does Nina choose at the end?','Water.',['Milk.','Tea.','No drink.'],'Nina 在得知沒有牛奶後，選擇 water。'),one('How many cups of water does Paul prepare?','2',['1','3','4'],'Nina 與 Owen 各一杯，共兩杯。'),one('Why does Nina choose water instead of milk?','There is no milk.',['She does not like water.','Paul only has tea.','Owen takes all the water.'],'Nina 原本喜歡牛奶與水；Paul 說沒有牛奶，所以選現有的水。')];
    headers=['Menu','Available'];rows=[['milk','No'],['tea','Yes'],['water','Yes']];
   }else{
    const drinks=['milk tea','orange juice','water','milk'],d=drinks[n],e=drinks[(n+1)%4],f=drinks[(n+2)%4];
    passage=`${a}: I like ${d}. Do you like ${d}, ${b}?\n${b}: No, I don’t. I like ${e}.\n\n${c}: My mom likes ${d}. I like ${f}.\n${a}: Does your mom like ${e}?\n${c}: No, she doesn’t.\n\n${b}: One ${d} for ${a}, one ${e} for me, and one ${f} for ${c}.\n${a}: Thank you!`;
    questions=[one(`What does ${b} like?`,e,[d,f,'All three drinks.'],`${b} 說 I like ${e}.。`),one(`Who likes ${f}?`,c,[a,b,`${c}’s mom`],`${c} 自己喜歡 ${f}，母親喜好不同。`),one(`Does ${c}’s mom like ${e}?`,'No, she doesn’t.',['Yes, she does.','Yes, he does.','No, they don’t.'],'母親是否喜歡這種飲料，對話已有否定回答。'),one(`Which order is for ${a}?`,d,[e,f,'No drink.'],`${a} 說喜歡 ${d}，最後點單也對應 ${d}。`),one('Why must they check the names in the order?','Different people like different drinks.',['Everyone likes the same drink.','All the names are the same.','Nobody wants a drink.'],'三人的喜好不同，要將人名與飲料正確配對。')];
    headers=['Person','Likes'];rows=[[a,d],[b,e],[c,f],[`${c}’s mom`,d]];
   }
   const passageTitle=lower?(age?'Names and ages '+(n+1):'Meet our friends '+(n+1)):(fruit?'Fruit for our salad '+(n+1):n===4?'Choose from the menu':'Check the drink order '+(n+1));
   questions.forEach((q,i)=>out.push({...base,...q,text:`〈${passageTitle}〉${q.text}`,id:`u${unit}-t${221+n}-r${i+1}`,topic:220+n,concept:units[unit].name,passageId,passageTitle,passage,readingOrder:i+1,readingSkill:['找資料','配對資訊','句型理解','整合對話','情境應用'][i],family:passageId,visual:{kind:'referenceData',caption:lower?'對話資料卡':'本篇訂單資料',description:'搭配完整對話核對人物及資訊。',table:{headers,rows}}}));
  }
 }
 return out;
}
