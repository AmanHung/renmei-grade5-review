# 小小複習室

12.0.0：三上數學改為第 1～4 單元（練習、錯題、A/B 卷一致），有效題庫 3,437 題，各單元至少 100 題。自然社會每模式各 100 題，英語每組 115 題。保留推理題並納入已編寫的練習變式，新增平移讀尺題；變式不宣稱為全新考點。

抽題避開上一份，題庫足夠時避開最近六份；優先未練題，閱讀維持完整五題組。新增位值積木、數量流程、等長線段、重疊紙條、裁切、等量組、角卡、木棒與尺規平移圖。

全科配圖：自然、社會、國語、英語共 1,819 道練習或模擬考題改用主題對應圖示，包含根系、葉序、實驗裝置、地形、方位、班級自治、紙橋、蚊帳與可數水果圖。附表數值保留，圖片中的代號由原資料帶入；示意圖不另編量測數值。SVG 支援放大。

[開啟網站](https://amanhung.github.io/renmei-grade5-review/?grade=3)｜[題庫清單](題庫清單.md)

## 孩子如何使用

在 iPad Safari 開啟網站，輸入名字或暱稱，選年級與單元。可使用 Safari 分享選單「加入主畫面」。同一台裝置可切換名字。

名字是紀錄標籤，不是帳號驗證。重點、抽題歷史、錯題與成績保存在瀏覽器，不同裝置不自動合併。舊作答與完成成績保留，退役題號不改成新題；錯題畫面只列目前有效題目。

每次作答與完成練習會送到家長的 GAS；收到回執才標示同步，離線資料保留待補傳。紀錄含圖卡資料與年級單元，不放到 GitHub，不需孩子登入 Google。後端見 [GAS設定說明.md](GAS設定說明.md)。

## 本機維護與發布

執行 `node prepare.mjs` 產生題庫、來源頁、題庫清單與刪重報告；執行 `node preview.mjs` 後以 http://127.0.0.1:4173 預覽。教材模組在 curriculum/，審題與來源由 quality-review.mjs、assessment-sources.mjs 管理。

檢查：`node test-v12.cjs`、`node test-all-subject-visuals.cjs`、`node validate.cjs`、`node test-reading.cjs`、`node test-visuals.cjs`、`node test-grades.cjs`、`node test-gas.cjs`。會檢查唯一任務、抽題不重複、完整閱讀組、圖上實際角度、數字評分及 GAS 寫入去重。

推送 main 後 GitHub Actions 先測試，再發布 dist/ 到 GitHub Pages。

版本與範圍證據見 [三上版本核對.md](三上版本核對.md)、[版本核對.md](版本核對.md)。
