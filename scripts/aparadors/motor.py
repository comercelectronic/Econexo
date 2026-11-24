"""Generador del escenario y motor de evaluación de Aparadors BCN. Python 3 + Pillow."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from itertools import product
import base64, io, json, random
from hashlib import md5
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
rng = random.Random(23)
im = Image.new("RGB", (600, 300), "#fac69a")
d = ImageDraw.Draw(im)
def box(x,y,w,h,c):
    d.rectangle((x,y,x+w-1,y+h-1),fill=c)
def oval(x,y,w,h,c):
    d.ellipse((x,y,x+w,y+h),fill=c)
def window(x,y,w,h):
    box(x-3,y-2,w+6,h+6,"#e9ac87")
    box(x,y,w,h,"#34405a")
    box(x+3,y+2,w//2-4,h-4,"#866b82")
    box(x+w//2+1,y+2,w//2-4,h-4,"#b78b90")
    box(x-5,y+h,w+10,4,"#6d535b")
    for k in range(1,w,5):box(x+k,y+h-8,1,9,"#51444e")
    box(x-2,y+h-9,w+4,2,"#51444e")
for y in range(120):
    box(0,y,600,1,tuple(int(a+(b-a)*y/120) for a,b in zip((246,168,151),(255,219,161))))
oval(420,8,51,51,"#ffebad")
for x in range(-5,610,18):
    ht=rng.randint(8,38);box(x,79-ht,19,ht,"#bd9394")
for x,w,y,c in [(-25,139,56,"#c07a65"),(110,119,35,"#dfab87"),(229,148,47,"#b98678"),(377,120,59,"#d19c77"),(497,119,24,"#b27773")]:
    box(x,y,w,220,c);box(x-3,y,w+6,4,"#795c63");box(x,y+6,w,2,"#f1c29b")
    for wy in range(y+15,160,36):
        for wx in range(x+13,x+w-18,34):window(wx,wy,20,23)
for x in (17,470):
    box(x,163,100,80,"#384758");box(x+5,168,90,60,"#789490")
    for i in range(10):box(x+i*10,157,10,10,["#fcdaac","#b95c53"][i%2])
box(0,242,600,58,"#c79e95")
for y in range(248,301,12):
    box(0,y,600,1,"#b68e87")
    for x in range(y%28,600,36):box(x,y-11,1,11,"#b68e87")
# L’atelier, dessiné comme une devanture miniature avec trois baies.
box(115,97,370,150,"#553c42");box(118,94,364,149,"#245553")
box(115,92,369,5,"#153e40");box(118,98,363,2,"#96ab8f")
box(129,104,342,22,"#204947")
font=ImageFont.load_default(size=15)
d.text((300,115),"ATELIER   ·   BARCELONA",font=font,anchor="mm",fill="#ffe8bb")
box(129,136,342,93,"#0f3539");box(134,140,332,83,"#c68f75")
for i in range(24):
    x=126+i*14;c=("#d87155","#ffe1ab")[i%2]
    d.polygon([(x+2,128),(x+14,128),(x+16,143),(x,143)],fill=c)
    box(x,143,14,3,c)
for x in (121,473):
    box(x,148,4,84,"#6b9783")
box(126,230,347,6,"#84a28e");box(113,241,374,5,"#173e40")
for x,y in [(48,182),(525,185)]:
    box(x,y,6,60,"#735646")
    for _ in range(100):
        px=rng.gauss(x+3,10);py=rng.gauss(y-8,9)
        oval(int(px),int(py),8,8,rng.choice(["#386653","#568363","#829357"]))
    box(x-9,y+51,24,12,"#aa6654")
out=io.BytesIO();im.save(out,format="PNG")
def verdict(level, slots, light):
    hero,side=("tarta","regalo") if level==0 else ("vela","rama")
    prices={"tarta":40,"regalo":16,"vela":22,"rama":10,"libre":0}
    cost=sum(prices[item] for item in slots)+(8 if light=="difusa" else 16)
    focus=slots[1]==hero if level==0 else slots.count(hero)==2
    rhythm=(side in slots and slots.count(hero)==1) if level==0 else slots[0]==slots[2]==hero and slots[1]==side
    lighting=light==("central" if level==0 else "difusa")
    budget=cost<=(75 if level==0 else 68)
    return [cost,focus,rhythm,lighting,budget]
items=["libre","tarta","regalo","vela","rama"]
lights=["central","difusa","lateral"]
scores={str(n)+":"+":".join((*slots,light)):verdict(n,slots,light)
        for n,slots,light in product(range(2),product(items,repeat=3),lights)}
for n,slots,light in [(0,("regalo","tarta","libre"),"central"),(1,("vela","rama","vela"),"difusa")]:
    assert all(verdict(n,slots,light)[1:])
def photo(name):
    key=name.replace(" ","_");h=md5(key.encode()).hexdigest()
    return "https://upload.wikimedia.org/wikipedia/commons/"+h[0]+"/"+h[:2]+"/"+quote(key)
photos=[photo("127 Aparador nadalenc de la pastisseria Escribà, Gran Via 546 (Barcelona).jpg"),photo("Cereria Subirà, aparador.jpg")]
html=(ROOT/"juego.html").read_text(encoding="utf-8-sig")
html=html.replace("__ESCENA__",base64.b64encode(out.getvalue()).decode()).replace("__MOTOR__",json.dumps(scores,separators=(",",":"))).replace("__FOTOS__",json.dumps(photos))
(ROOT/"index.html").write_text(html,encoding="utf-8")
