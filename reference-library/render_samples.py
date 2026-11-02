from pathlib import Path
import subprocess
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent.parent
RAW=ROOT/'research'/'reference-library'
ids=['REF-259cc36ab7','REF-e05ab93ee3','REF-b3ac3a1ec8','REF-dcff2019fd','REF-d7ead9893d','REF-bf9819daf9','REF-62e311149b','REF-b81ad739fc','REF-857b30709b','REF-843f6a9aff','REF-c98c66c792','REF-be750e3396']
poppler=Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
for id in ids:
    subprocess.run([str(poppler),'-f','1','-l','2','-scale-to','1100','-png',str(RAW/(id+'.pdf')),str(RAW/id)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
for k in range(0,len(ids),3):
    canvas=Image.new('RGB',(2200,3*1140),'#dddddd'); d=ImageDraw.Draw(canvas)
    for i,id in enumerate(ids[k:k+3]):
        for j,p in enumerate(sorted(RAW.glob(id+'-*.png'))[:2]):
            im=Image.open(p); im.thumbnail((1100,1100))
            canvas.paste(im,(j*1100,i*1140+30)); d.text((j*1100+10,i*1140+8),id+' page '+str(j+1),fill='black')
    canvas.save(RAW/f'contact-{k//3+1}.jpg')
print('Rendered 12 papers, first 2 pages each, 4 contact sheets.')
