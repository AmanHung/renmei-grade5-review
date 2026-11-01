import fs from 'node:fs';
import {sources} from './assessment-sources.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default function reports(units){
 const active=units.filter(u=>u.active!==false),all=active.flatMap(u=>u.questions),articles=new Set(all.map(q=>q.passageId).filter(Boolean)).size;
 const intro=`版本 12.0.0，更新日期：2026-11-01。有效範圍共 ${active.length} 組、${active.length*20} 個重點、${all.length} 題、${articles} 篇閱讀題組。三上數學限第 1～4 單元；角單元保留內部舊題號對應，不列入練習、錯題或模擬考。`;
 const policy='保留精選推理題，重新納入同考點的數值、角色與題型變式，另補平移讀尺題；變式不是全新考點。自然社會每單元 100 題觀念＋100 題閱讀；國語每組 100 題、英語每組 115 題；數學各有效單元至少 100 題。閱讀整篇抽取，避免拆散同篇五題。每次優先未練題並避開上一份；題庫允許時避開最近六份，題目用完後重新輪替。舊作答紀錄保留。';
 const rows=active.map(u=>`| ${u.grade===3?'三上':'五上'} | ${u.subject} | ${u.name} | ${u.questions.length} | ${u.questions.filter(q=>q.passageId).length} |`).join('\n');
 const refs=Object.entries(sources).map(([id,s])=>`### ${id}：${s.title}\n\n[原始來源](${s.url})\n\n${s.detail}\n`).join('\n');
 fs.writeFileSync('考題參考與刪重.md',`# 題庫與來源紀錄\n\n${intro}\n\n${policy}\n\n題型參考沿用先前核對資料，本次未重新查閱公開原卷。原創延伸題與練習變式均不宣稱為出版社或學校官方題目。\n\n| 年級 | 科目 | 單元 | 題數 | 其中閱讀題數 |\n| --- | --- | --- | ---: | ---: |\n${rows}\n\n## 來源與用途\n\n${refs}`);
 fs.writeFileSync('題庫清單.md',`# 三上與五上複習題庫\n\n${intro}\n\n${policy}\n\n| 年級 | 科目 | 單元 | 題數 | 其中閱讀題數 |\n| --- | --- | --- | ---: | ---: |\n${rows}\n\n`+active.map(u=>`## ${u.grade===3?'三上':'五上'} ${u.subject}：${u.name}\n\n${u.scope||'第 '+u.number+' 單元'}；${u.questions.length} 題。\n\n`+u.cards.map((c,i)=>`${i+1}．${c.title}：${c.text}`).join('\n\n')).join('\n\n'));
 fs.writeFileSync('dist/assessment-sources.html',`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>題庫與來源紀錄</title><style>body{font:18px/1.8 system-ui;max-width:960px;margin:auto;padding:24px;color:#294b3c}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccd9d2;padding:8px}section{margin:30px 0}</style><a href="./">回到複習室</a><h1>題庫與來源紀錄</h1><p>${intro}</p><p>${policy}</p><p>本次沿用先前版本已核對的題型與課程來源，新增內容為原創練習，不是官方試題。</p><table><tr><th>年級</th><th>科目</th><th>單元</th><th>題數</th></tr>${active.map(u=>`<tr><td>${u.grade} 上</td><td>${u.subject}</td><td>${esc(u.name)}</td><td>${u.questions.length}</td></tr>`).join('')}</table>${Object.entries(sources).map(([id,s])=>`<section><h2>${id}：${esc(s.title)}</h2><a href="${esc(s.url)}">原始來源</a><p>${esc(s.detail)}</p></section>`).join('')}</html>`);
}
