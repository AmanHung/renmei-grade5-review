from pathlib import Path
import sqlite3,json,csv
p=Path(__file__).resolve().parent
c=sqlite3.connect(p/'reference-library.sqlite')
assert c.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
assert c.execute('SELECT count(*) FROM sources').fetchone()[0]==60
assert c.execute('SELECT count(*) FROM reviews').fetchone()[0]==15
assert c.execute('SELECT count(*) FROM target_scopes').fetchone()[0]==10
assert c.execute('SELECT count(*) FROM catalogue_fts WHERE catalogue_fts MATCH ?',('"折線圖"',)).fetchone()[0]>0
for statement in (p/'queries.sql').read_text(encoding='utf-8').split(';'):
    if statement.strip(): c.execute(statement).fetchall()
cat=json.loads((p/'catalogue.json').read_text(encoding='utf-8'))['sources']
assert len(list(csv.DictReader((p/'catalogue.csv').open(encoding='utf-8-sig'))))==len(cat)
assert len({r['sha256'] for r in cat if r['access']=='downloaded'})==55
assert all(r['id'] in (p/'README.md').read_text(encoding='utf-8') for r in cat)
assert all(len(r.get('analysis',{}).get('visual_pages',[]))<=r.get('pages',0) for r in cat)
print('PASS: SQLite integrity, 60 catalogue rows, 55 unique PDFs, 15 reviews, 10 scope groups, all SQL examples, CSV/JSON consistency.')
