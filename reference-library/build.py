"""Build auditable catalogue/SQLite without redistributing exam text or images."""
from pathlib import Path
import json, sqlite3, csv, re, hashlib
from collections import Counter
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'reference-library'
data=json.loads((OUT/'sources.json').read_text(encoding='utf-8'))
reviews=json.loads((OUT/'reviews.json').read_text(encoding='utf-8'))
scopes=[
 (3,'國語','翰林','第 1～6 課、統整活動一、二；時間是什麼、妙用便利貼、提早五分鐘、水滾了、為梨花撐傘、小鉛筆大學問','舊版明天再寫、猴子的數學或其他版本課文不視為同版。'),
 (3,'數學','康軒','第 1～4 單元：10000 以內的數、四位數的加減、毫米、乘法','排除角單元及其小題；不因參考卷含角而擴大範圍。'),
 (3,'英語','翰林 Here We Go 1','Unit 1、Unit 2、Review 1；姓名、問候、年齡','舊 Dino 僅取共同句型與形式；聽力必須另取得音檔。'),
 (3,'自然','南一','第 1～2 單元：認識植物、空氣和水','排除磁鐵、受力等非此次範圍內容。'),
 (3,'社會','翰林','第 1～2 單元：升上三年級的新學習、校園規範和班級自治','排除家庭、消費等非此次範圍主題。'),
 (5,'國語','康軒','第 1～6 課、學習地圖一、二；蚊帳大使、從空中看臺灣、攀岩高手、恆久的美、它抓得住你——商標的故事、故事動起來','舊第三課憧憬不納入現行課文。'),
 (5,'數學','翰林','第 1～5 單元、學習加油讚（一）；折線圖、倍數與因數、平面圖形、公倍數與公因數、立體形體','排除分數、小數運算、扇形分率、面積體積後續單元。'),
 (5,'英語','康軒 Wonder World 5','Get Ready、Unit 1、Unit 2、Review 1；飲料喜好、水果與需求數量','排除星期、課表、現在進行式等其他冊內容。'),
 (5,'自然','康軒','第 1～2 單元：動物世界、探索聲光世界','太陽與植物卷只取局部共同光學題。'),
 (5,'社會','康軒','第 1～2 單元：臺灣我的家、臺灣的自然環境與生活','社會規範等後續內容逐題排除。')]
keywords={
 (3,'國語'):['時間是什麼','妙用便利貼','提早五分鐘','水滾了','為梨花撐傘','小鉛筆大學問'],
 (3,'數學'):['千位','毫米','驗算','乘法'],(3,'英語'):["yourname","oldareyou","I’m","I'm"],
 (3,'自然'):['葉脈','葉緣','空氣','占有空間','植物'],(3,'社會'):['班級','班會','學習資源','公約'],
 (5,'國語'):['蚊帳大使','從空中看臺灣','攀岩高手','恆久的美','商標','故事「動」起來'],
 (5,'數學'):['折線圖','公因數','公倍數','三角形','柱體'],(5,'英語'):['fruit','salad','like','need','drink'],
 (5,'自然'):['動物','音量','音色','折射','變因'],(5,'社會'):['地形','臺灣','台灣','季風','海岸']}
db=sqlite3.connect(OUT/'reference-library.sqlite')
db.executescript('''DROP TABLE IF EXISTS sources; DROP TABLE IF EXISTS reviews; DROP TABLE IF EXISTS target_scopes; DROP TABLE IF EXISTS catalogue_fts;
CREATE TABLE sources(id TEXT PRIMARY KEY,grade INTEGER,subject TEXT,title TEXT,school TEXT,url TEXT,access TEXT,pages INTEGER,sha256 TEXT,checked_at TEXT,local_pdf TEXT,review_status TEXT,scope_match TEXT,keyword_hits TEXT,year INTEGER);
CREATE TABLE reviews(source_id TEXT PRIMARY KEY REFERENCES sources(id),text_pages TEXT,visual_pages TEXT,included TEXT,excluded TEXT,language_style TEXT,image_style TEXT,question_types TEXT,caution TEXT);
CREATE TABLE target_scopes(grade INTEGER,subject TEXT,publisher TEXT,scope TEXT,exclusion TEXT,PRIMARY KEY(grade,subject));
CREATE VIRTUAL TABLE catalogue_fts USING fts5(source_id UNINDEXED,content,tokenize='trigram');''')
db.executemany('INSERT INTO target_scopes VALUES(?,?,?,?,?)',scopes)
for r in data['sources']:
    review=reviews.get(r['id'])
    text_path=ROOT/'research'/'reference-library'/(r['id']+'.txt')
    text=re.sub(r'\s+','',text_path.read_text(encoding='utf-8')) if text_path.exists() else ''
    hits=[k for k in keywords[r['grade'],r['subject']] if k.lower() in text.lower()]
    r['keyword_hits']=hits
    r['publisher_verified']='未核定；不得僅依檔名、課名或角色推定'
    r['scope_match']=review['match'] if review else '待逐題比對' if r['access']=='downloaded' else '無法判定'
    r['review_status']=('文字及指定頁面視覺檢閱' if review['visual_pages'] else '文字檢閱，圖片待核') if review else ('僅下載、擷取文字與關鍵詞初篩，未人工讀完' if r['access']=='downloaded' else '未讀取，不作命題證據')
    year=re.search(r'(10\d|11\d)',r['title']); r['year']=int(year[1]) if year else None
    if review: r['analysis']=review
    vals=[r.get(k) for k in ['id','grade','subject','title','school','url','access','pages','sha256','checked_at','local_pdf','review_status','scope_match']]+[json.dumps(hits,ensure_ascii=False),r['year']]
    db.execute('INSERT INTO sources VALUES('+','.join('?'*15)+')',vals)
    if review:
        db.execute('INSERT INTO reviews VALUES(?,?,?,?,?,?,?,?,?)',(r['id'],json.dumps(review['pages']),json.dumps(review['visual_pages']),review['included'],review['excluded'],review['language'],review['images'],json.dumps(review['types'],ensure_ascii=False),review['caution']))
    content=' '.join([r['title'],r['subject'],r['scope_match'],' '.join(hits),json.dumps(review or {},ensure_ascii=False)])
    db.execute('INSERT INTO catalogue_fts VALUES(?,?)',(r['id'],content))
db.commit(); db.close()
(OUT/'catalogue.json').write_text(json.dumps({'checked_at':'2026-11-02','sources':data['sources']},ensure_ascii=False,indent=2),encoding='utf-8')
fields=['id','grade','subject','year','title','school','scope_match','review_status','pages','url','local_pdf','sha256']
with (OUT/'catalogue.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore'); w.writeheader(); w.writerows(data['sources'])
ok=[r for r in data['sources'] if r['access']=='downloaded']; counts=Counter((r['grade'],r['subject']) for r in ok)
lines=['# 公開考卷參考資料庫','', '建立日期：2026-11-02。依專案現行三上、五上考試範圍建立。','',
 f"共 {len(data['sources'])} 筆來源；成功下載 {len(ok)} 份、共 {sum(r['pages'] for r in ok)} 頁；失敗 {len(data['sources'])-len(ok)} 筆。{len(reviews)} 份附人工文字分析，其中 12 份另檢視各前 2 頁影像。其他資料僅完成文字擷取與關鍵詞初篩，沒有宣稱逐卷讀完。",'',
 '## 開啟與查詢','',
 '- [各科出題風格與命題規格](出題風格.md)：先讀這份，了解實際觀察與後續命題建議。',
 '- [完整來源目錄](catalogue.csv)：以 Excel 開啟，可篩選年級、科目、學年度、範圍符合程度及檢閱狀態。',
 '- [結構化資料](catalogue.json)：含逐卷分析、排除內容及關鍵詞初篩；關鍵詞命中不代表範圍已核定。',
 '- [SQLite 資料庫](reference-library.sqlite)：sources、reviews、target_scopes、catalogue_fts 四表；中文搜尋至少使用 3 字的詞組。',
 '- [範例查詢](queries.sql)。`collect.py` 重新蒐集；`build.py` 重新產生索引並保留 `reviews.json` 的人工註記。',
 '- 原始 PDF、擷取文字、樣張影像位於 `../research/reference-library/`，本機保留且沿用既有 Git 忽略規則；不納入公開網站部署。',
 '', '## 範圍與涵蓋','', '| 年級 | 科目 | 版本與目標範圍 | 已下載卷數 |', '| --- | --- | --- | ---: |']
for g,s,p,scope,ex in scopes: lines.append(f'| {g} 上 | {s} | {p}；{scope} | {counts[g,s]} |')
lines+=['','## 取用規則','',
 '「考點高度重疊」僅表示已讀內容包含多數共同考點，尚未核定原校版本，不等於完全同版同範圍。部分相符卷必須用人工註記的 included／excluded 逐題篩選；僅題型參考不得搬入原卷課文。沒有任何一份卷被標為 115 仁美原卷。',
 '', '後續編題先查 `target_scopes`，再讀符合科目的 `reviews`；題目紀錄應保存來源 ID、參考頁碼、參考形式、共同考點與排除項目。採原創情境與重繪圖，不能只替換原卷數字或人名。聽力題有題紙不代表有可播放音檔；作圖、短答與實作不應冒稱網站已能自動評分。',
 '', '## 搜尋與缺口','',
 '搜尋先以年級、上學期、期中、版本與考點組合查詢，找到學校官方考卷庫後實查永安卷庫第 8～48 頁（41 個索引頁），並重新連線核對既有五堵、大華、明義、深美來源。廣泛搜尋有許多課程計畫、商售介紹及非官方重製站，均未算作已取得考卷。',
 '', '來源以永安國小為主，另有明義與深美，樣本並非各校命題的代表性抽樣。未取得所有科目完全同版同範圍的卷：尤其三上新版翰林國語、同冊 Here We Go 1 完整卷及五上新版攀岩高手課文題仍有缺口。年份較新不保證考點較吻合。網路公開不表示可公開重製；本資料庫提供連結與分析，不將整卷與圖像上傳網站。',
 '', '既有 `research/g3-*.pdf` 是課程計畫，未算成此次原卷；原有引用記錄不因本次失敗就改稱從未存在。',
 '', '## 完整目錄','', '| ID | 年級科目 | 來源 | 範圍判定 | 檢閱狀態 |', '| --- | --- | --- | --- | --- |']
for r in data['sources']:
    title=r['title'].replace('|','／')
    lines.append(f"| {r['id']} | {r['grade']} 上 {r['subject']} | [{title}]({r['url']}) | {r['scope_match']} | {r['review_status']} |")
lines+=['','## 逐卷人工分析','']
for r in data['sources']:
    a=reviews.get(r['id'])
    if not a: continue
    lines += [f"### {r['id']}：{r['title']}",'',f"[官方原卷]({r['url']})｜[本機 PDF](../{r['local_pdf']})｜文字頁：{a['pages']}｜已看影像頁：{a['visual_pages']}",'',f"- 符合程度：{a['match']}。",f"- 可參考：{a['included']}",f"- 排除：{a['excluded']}",f"- 敘述：{a['language']}",f"- 配圖：{a['images']}",f"- 題型：{'、'.join(a['types'])}。",f"- 留意：{a['caution']}",'']
(OUT/'README.md').write_text('\n'.join(lines),encoding='utf-8')
# Integrity check: all downloaded files match the recorded bytes and digest.
assert len({r['id'] for r in data['sources']})==len(data['sources'])
assert all((ROOT/r['local_pdf']).exists() and hashlib.sha256((ROOT/r['local_pdf']).read_bytes()).hexdigest()==r['sha256'] for r in ok)
assert all(any(r['grade']==g and r['subject']==s for r in ok) for g,s,*_ in scopes)
print(json.dumps({'sources':len(data['sources']),'downloaded':len(ok),'pages':sum(r['pages'] for r in ok),'text_reviewed':len(reviews),'visually_reviewed':sum(bool(a['visual_pages']) for a in reviews.values()),'hashes_verified':True,'coverage':{f'{g}上{s}':counts[g,s] for g,s,*_ in scopes}},ensure_ascii=False))
