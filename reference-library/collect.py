"""Collect public school papers; full source files stay in ignored research/."""
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import urljoin, quote, urlsplit, urlunsplit
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed
import json, re, hashlib, io
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'reference-library'
RAW = ROOT / 'research' / 'reference-library'
RAW.mkdir(parents=True, exist_ok=True)
BASE = 'https://www.yap.kh.edu.tw'
def fetch(url):
    p=urlsplit(url)
    url=urlunsplit((p.scheme,p.netloc,quote(p.path,safe='/%'),quote(p.query,safe='=&%?+'),''))
    with urlopen(Request(url, headers={'User-Agent':'Mozilla/5.0'}), timeout=22) as r:
        return r.read()
def archive(page):
    url=BASE+f'/view/index.php?MainMenuId=44061&MainType=104&SubMenuId=0&SubType=0&TypeChange=&WebID=33&page={page}'
    data=fetch(url).decode('utf-8',errors='replace')
    found=[]
    for href,name in re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>',data,re.S|re.I):
        name=unescape(re.sub('<[^>]+>','',name)).strip()
        if '.pdf' not in href.lower() or '期中' not in name: continue
        grade=3 if re.search('三上|三年級|三自然',name) else 5 if re.search('五上|五年級|五自然',name) else None
        if not grade or re.search('下|期末',name): continue
        sub=next((v for k,v in [('國語','國語'),('數學','數學'),('英','英語'),('自然','自然'),('社會','社會'),('三自','自然'),('五自','自然')] if k in name),None)
        if sub: found.append(dict(title=name,url=urljoin(BASE,unescape(href)),school='永安國小',grade=grade,subject=sub,discovery_url=url,discovery='official_archive'))
    return found
def download(row):
    row=dict(row)
    row['id']='REF-'+hashlib.sha256(row['url'].encode()).hexdigest()[:10]
    path=RAW/(row['id']+'.pdf')
    try:
        data=path.read_bytes() if path.exists() else fetch(row['url'])
        if not data.startswith(b'%PDF'): raise ValueError('response is not PDF')
        reader=PdfReader(io.BytesIO(data))
        texts=[p.extract_text() or '' for p in reader.pages]
        path.write_bytes(data)
        (RAW/(row['id']+'.txt')).write_text('\n\n'.join(texts),encoding='utf-8')
        row.update(access='downloaded',pages=len(texts),sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),local_pdf=str(path.relative_to(ROOT)).replace('\\','/'),text_characters=sum(map(len,texts)),review_status='文字已擷取，待逐卷人工比對與視覺檢視',checked_at='2026-11-02')
    except Exception as e: row.update(access='failed',error=str(e)[:250],review_status='未讀取，不作命題證據',checked_at='2026-11-02')
    return row
if __name__=='__main__':
    found=[]; errors=[]
    with ThreadPoolExecutor(max_workers=6) as pool:
        jobs={pool.submit(archive,i):i for i in range(8,49)}
        for f in as_completed(jobs):
            try: found.extend(f.result())
            except Exception as e: errors.append({'page':jobs[f],'error':str(e)[:180]})
    # Additional schools already cited in project records; all rechecked this run.
    old=(ROOT/'考題參考與刪重.md').read_text(encoding='utf-8')
    for title,url in re.findall(r'### ([^\n]+)\n\n\[原始來源\]\(([^\n]+)\)',old):
        if '課程' in title or '課程' in url: continue
        grade=3 if '三上' in title else 5 if '五上' in title else None
        sub=next((s for s in ['國語','英語','數學','自然','社會'] if s in title),None)
        if grade and sub: found.append(dict(title=title,url=url,school=title.split('：')[-1].split(' ')[0],grade=grade,subject=sub,discovery='existing_project_reference_rechecked'))
    found=list({r['url']:r for r in found}.values())
    rows=[]
    with ThreadPoolExecutor(max_workers=6) as pool:
        for row in pool.map(download,found):
            rows.append(row)
            print(row['id'],row['title'],row['access'],flush=True)
    rows.sort(key=lambda r:(r['grade'],r['subject'],r['title']))
    (OUT/'sources.json').write_text(json.dumps({'schema_version':1,'checked_at':'2026-11-02','sources':rows,'archive_errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print('TOTAL',len(rows),'OK',sum(r['access']=='downloaded' for r in rows),flush=True)
