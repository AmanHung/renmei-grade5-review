export const sources={
 M3:{title:'五堵國小 113 三上數學期中卷',url:'https://wdps.kl.edu.tw/docs/file/309/113三上期中數學.pdf',detail:'選擇題第 2、3 題；第二大題的位值、缺格與數列；後續應用題。參考直角基準、驗算、位值與條件判斷，不取範圍外內容。'},
 A3:{title:'深美國小 113 三上數學期末卷（角的部分）',url:'https://oldsmps.kl.edu.tw/books/file/166/數.pdf',detail:'第 1 頁：多圖比較、筷子開口、直角數量、角的大小排序、邊長迷思；只取角的部分，其餘單元不納入。'},
 M3B:{title:'大華國小 114 三上數學期中卷',url:'https://www.thps.tyc.edu.tw/modules/tad_uploader/index.php?cat_sn=68&cfsn=841&fn=114上三年級數學期中評量試卷.pdf&op=dlfile',detail:'第 1 頁：非標準位值分組、數字卡排序、毫米、購物與乘法應用；與本站範圍交叉後改編。'},
 M5:{title:'明義國小 113 五上數學期中卷',url:'https://xc.hlc.edu.tw/~myps_www/modules/tad_uploader/index.php?cat_sn=798&cfsn=7333&fn=113上五年級數學期中試卷113.10.25.pdf&op=dlfile',detail:'第 1 頁因倍數關係與等腰三角形；第 2 頁圖形推角；第 3 頁附條件分組與剪正方形。排除小數、分數、扇形等本站範圍外題。'},
 M5B:{title:'五堵國小 113 五上數學期中卷',url:'https://wdps.kl.edu.tw/docs/file/309/113五上期中數學.pdf',detail:'圖形與立體形體性質、因倍數、三角形條件；只依共同考點作題型參照，不當成仁美原卷。'},
 N3:{title:'永安國小 111 三上自然期中卷',url:'https://www.yap.kh.edu.tw/upload/33/104_44061/111三上自然期中評量試卷.pdf',detail:'第 1 頁植物構造、葉片、空氣與水占空間及生活應用；不是 115 年新卷。'},
 N3B:{title:'深美國小 108 三上自然期末卷（空氣部分）',url:'https://oldsmps.kl.edu.tw/books/file/45/自.pdf',detail:'第 1 頁比較空氣發射器資料、空氣／水注射筒及倒扣杯。只取空氣與水共同考點。'},
 N5:{title:'明義國小 113 五上自然期中卷',url:'https://xc.hlc.edu.tw/~myps_www/modules/tad_uploader/index.php?cat_sn=798&cfsn=7341&fn=113五年級上學期期中評量自然考卷.pdf&op=dlfile',detail:'動物自保、分工與育幼、實驗變因、音量音高、折射；用來檢查考點與應用層次。'},
 S3:{title:'永安國小 111 三上社會期中卷',url:'https://www.yap.kh.edu.tw/upload/33/104_44061/111三上社會期中評量試卷.pdf',detail:'學習資源選擇、班級幹部分工、班會程序、合理規範與學習方法；參考情境判斷，不照搬整卷。'},
 S5:{title:'大華國小 114 五上社會期中卷',url:'https://www.thps.tyc.edu.tw/modules/tad_uploader/index.php?cat_sn=70&cfsn=847&fn=114上5年級社會期中評量試卷.pdf&op=dlfile',detail:'臺灣位置、地形與生活、人文差異與規範；新聞與時事細節不作現行事實沿用。'},
 E3:{title:'深美國小 109 三上英語期中卷',url:'https://oldsmps.kl.edu.tw/books/file/62/英.pdf',detail:'舊翰林 Dino 系列，並非 Here We Go 1；只參考姓名、年齡、說話者及看圖辨識題型，另依已核對的 Here We Go 1 範圍限制詞句。'},
 E3Scope:{title:'大成國小 113 Here We Go 1 課程計畫',url:'https://www.curriculum.chc.edu.tw/storage/25/113/5-3英語文.pdf/1GdvKv85jTy05JNn1b8PmemXibpKhaKFwOmWdmTQ.pdf',detail:'範圍補核：Unit 1 姓名、Unit 2 年齡與 Review 1。這是課程計畫，不是考卷。'},
 E5:{title:'大華國小 114 五上英語期中卷',url:'https://www.thps.tyc.edu.tw/modules/tad_uploader/index.php?cat_sn=70&cfsn=848&fn=114上5年級英語期中評量試題.pdf&op=dlfile',detail:'第 2 頁回應句與喜好；第 3 頁完整飲料／水果閱讀題組，參考人物指涉、需求數量與整篇資訊核對。'},
 C5:{title:'明義國小 107 五上國語期中卷',url:'https://www.myps.hlc.edu.tw/modules/tad_uploader/index.php?cat_sn=327&cfsn=3566&fn=花蓮縣花蓮市明義國民小學五年級國語期中評量試卷.pdf&op=dlfile',detail:'第 3 頁完整閱讀題組：詞義、指涉、動機與具體事件排序。只參考閱讀測量方式，不將舊版課文、歷史故事當成目前課文。'},
 C3:{title:'辛亥國小 113 三上翰林國語課程與閱讀提問',url:'https://tten.tp.edu.tw/Login/Downment?grade=3&spid=6f22d2e6-e8c8-4e2f-9af4-613ba9c8ae8b&subject=Language',detail:'閱讀四層次與具體故事脈絡；此項為教學參考，不是假稱三上原考卷。國語同時交叉參照 C5 公開卷的閱讀題型。'}
};
export function attachSources(units){
 for(const u of units){let ids=u.subject==='數學'?(u.grade===3?(u.id===21?['A3','M3']:['M3','M3B']):['M5','M5B']):u.subject==='英語'?(u.grade===3?['E3','E3Scope']:['E5']):u.subject==='國語'?(u.grade===3?['C3','C5']:['C5']):u.subject==='自然'?(u.grade===3?['N3','N3B']:['N5']):u.grade===3?['S3']:['S5'];
  u.sources=ids.map(id=>({id,...sources[id]}));u.sourceNote='參考公開考卷的考點與題型後改編；延伸文本與圖表另行編寫。非仁美原卷、非出版社官方原題。';
  for(const q of u.questions){q.sourceIds=ids;q.sourceType=q.revision===6?'參考題型改編':'既有延伸題・依公開考點複核';}
 }
}
