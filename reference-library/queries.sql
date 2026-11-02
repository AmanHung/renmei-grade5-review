-- 各科下載量與檢閱狀態。
SELECT grade, subject, access, review_status, count(*) AS papers
FROM sources GROUP BY grade, subject, access, review_status;

-- 三上數學可使用範圍；必須同時閱讀排除規則。
SELECT * FROM target_scopes WHERE grade=3 AND subject='數學';
SELECT s.id,s.title,s.url,r.* FROM sources s JOIN reviews r ON r.source_id=s.id
WHERE s.grade=3 AND s.subject='數學';

-- 全文搜尋為三字以上片語；回傳分析，不收錄整卷原文。
SELECT s.id,s.title,s.url,s.scope_match FROM catalogue_fts f
JOIN sources s ON s.id=f.source_id WHERE catalogue_fts MATCH '"折線圖"';

-- 只顯示已經人工檢視圖片的來源。
SELECT s.id,s.grade,s.subject,s.title,r.visual_pages,r.image_style
FROM sources s JOIN reviews r ON s.id=r.source_id WHERE r.visual_pages<>'[]';

-- 下載失敗，不能假稱已讀的來源。
SELECT id,title,url FROM sources WHERE access='failed';
