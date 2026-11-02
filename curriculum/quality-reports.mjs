import fs from 'node:fs';
import {sources} from './assessment-sources.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default function reports(units){
 const active=units.filter(u=>u.active!==false),all=active.flatMap(u=>u.questions),articles=new Set(all.map(q=>q.passageId).filter(Boolean)).size;
 const intro=`內容修訂版 16，更新日期：2026-11-02。有效範圍共 ${active.length} 組、${active.length*20} 個重點、${all.length} 題、${articles} 篇閱讀題組。三上數學限第 1～4 單元；角單元保留內部舊題號對應，不列入練習、錯題或模擬考。`;
 const policy='依公開考卷參考資料庫重新審題；刪除抽象模板、牽強選項與重複變式，新增範圍內語詞句型、對話、資料閱讀及數學應用。題數依各單元實際內容呈現，不再以每單元至少 100 題湊量。文字可獨立作答者不強配圖，資料表與必要圖像保留。閱讀整組抽取；小題庫以可供輪替的題數練習。舊作答紀錄保留，新題使用新題號。';
 const rows=active.map(u=>`| ${u.grade===3?'三上':'五上'} | ${u.subject} | ${u.name} | ${u.questions.length} | ${u.questions.filter(q=>q.passageId).length} |`).join('\n');
 const refs=Object.entries(sources).map(([id,s])=>`### ${id}：${s.title}\n\n[原始來源](${s.url})\n\n${s.detail}\n`).join('\n');
 fs.writeFileSync('考題參考與刪重.md',`# 題庫與來源紀錄\n\n${intro}\n\n${policy}\n\n本次參考 2026-11-02 已檢閱的公開原卷與逐卷分析；詳細新增、退役及考卷替換見「題庫更新與退役紀錄.md」。原創延伸題與練習變式均不宣稱為出版社或學校官方題目。\n\n| 年級 | 科目 | 單元 | 題數 | 其中閱讀題數 |\n| --- | --- | --- | ---: | ---: |\n${rows}\n\n## 來源與用途\n\n${refs}`);
 fs.writeFileSync('題庫清單.md',`# 三上與五上複習題庫\n\n${intro}\n\n${policy}\n\n| 年級 | 科目 | 單元 | 題數 | 其中閱讀題數 |\n| --- | --- | --- | ---: | ---: |\n${rows}\n\n`+active.map(u=>`## ${u.grade===3?'三上':'五上'} ${u.subject}：${u.name}\n\n${u.scope||'第 '+u.number+' 單元'}；${u.questions.length} 題。\n\n`+u.cards.map((c,i)=>`${i+1}．${c.title}：${c.text}`).join('\n\n')).join('\n\n'));
 fs.writeFileSync('dist/assessment-sources.html',`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>題庫與來源紀錄</title><style>body{font:18px/1.8 system-ui;max-width:960px;margin:auto;padding:24px;color:#294b3c}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccd9d2;padding:8px}section{margin:30px 0}</style><a href="./">回到複習室</a><h1>題庫與來源紀錄</h1><p>${intro}</p><p>${policy}</p><p>本次依公開考卷參考資料庫修訂，新增題目附來源與頁碼；各單元題數以下表為準。</p><table><tr><th>年級</th><th>科目</th><th>單元</th><th>題數</th></tr>${active.map(u=>`<tr><td>${u.grade} 上</td><td>${u.subject}</td><td>${esc(u.name)}</td><td>${u.questions.length}</td></tr>`).join('')}</table>${Object.entries(sources).map(([id,s])=>`<section><h2>${id}：${esc(s.title)}</h2><a href="${esc(s.url)}">原始來源</a><p>${esc(s.detail)}</p></section>`).join('')}</html>`);
}
