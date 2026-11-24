"""Construye el mundo y los sprites originales de Aparadors BCN con Python y Pillow."""
from PIL import Image, ImageDraw
from pathlib import Path
from hashlib import md5
from urllib.parse import quote
import base64, io, json, random, colorsys

root=Path(__file__).resolve().parent
def png(im):
    stream=io.BytesIO(); im.save(stream,format="PNG",optimize=True)
    return "data:image/png;base64,"+base64.b64encode(stream.getvalue()).decode()
def shop(i):
    rng=random.Random(71+i)
    walls=["#d69874","#d2af88","#dfb198","#abaaa0","#c68f7e","#c5a677"]
    trims=["#215b59","#79414e","#486846","#345773","#9c5238","#696141"]
    tile=["#bb7159","#9e6659","#c17d63","#9d7165","#b6755f","#ad7759"][i%6]
    wall,trim=walls[i%6],trims[i%6]
    if i>=6:
        def tone(h,s,v):
            return "#%02x%02x%02x"%tuple(round(c*255) for c in colorsys.hsv_to_rgb(h%1,s,v))
        wall=tone((i*.087+.02)%1,.21+i%3*.035,.84)
        trim=tone(i*.138,.39,.41+i%4*.033)
    im=Image.new("RGBA",(248,203));d=ImageDraw.Draw(im)
    def r(a,b,c,e,col):d.rectangle((a,b,c,e),fill=col)
    def line(points,col,w=1):d.line(points,fill=col,width=w)
    def poly(points,col):d.polygon(points,fill=col)
    side="#997666"
    poly([(9,66),(25,48),(238,48),(222,66)],tile)
    r(9,66,221,193,wall);poly([(222,66),(238,48),(238,176),(222,193)],side)
    for yy in range(76,190,10):
        line([(10,yy),(220,yy)],"#bd957e")
    # Terracotta roof, raised cornices, chimney stacks, skylight.
    poly([(2,61),(26,29),(246,29),(222,61)],tile)
    for j in range(24,245,8):line([(j,31),(j-20,59)],"#d89b7c",2)
    for j in range(34,60,6):line([(24-(j-30)*.7,j),(243-(j-30)*.7,j)],"#9d685a")
    r(2,60,222,66,"#754f49");r(4,62,222,63,"#f2c197")
    poly([(222,60),(246,28),(246,35),(222,67)],"#78564c")
    for xx in [40,177]:
        r(xx,17,xx+9,40,"#af7160");r(xx-2,15,xx+11,18,"#e4a084");r(xx+7,19,xx+10,38,"#81564d")
    poly([(99,45),(106,35),(129,35),(123,45)],"#4b6268");line([(101,44),(122,44),(128,36)],"#efbb91",2)
    for x in [21,71,122,172]:
        r(x-3,73,x+34,106,"#eac8a1");r(x,75,x+31,105,"#384e55")
        r(x+3,77,x+14,101,"#8caaa3");r(x+17,77,x+28,101,"#c5b4a1");r(x+2,88,x+29,90,"#655a58")
        for dx in [-7,32]:
            r(x+dx,76,x+dx+5,102,trim)
            for yy in range(78,103,4):r(x+dx,yy,x+dx+5,yy,"#82938a")
        r(x-6,106,x+37,110,"#85665b")
        for u in range(-3,36,5):r(x+u,99,x+u,106,"#40464c")
        r(x-5,98,x+35,99,"#495354")
        if rng.choice([0,1]):
            r(x+3,100,x+17,104,"#a56349")
            for k in range(12):
                a=x+rng.randint(2,18);b=rng.randint(94,99);r(a,b,a+2,b+2,rng.choice(["#60734e","#c76f65","#819259"]))
    r(9,113,222,191,trim);r(14,118,216,134,"#f2d9ac")
    r(18,141,157,185,"#2b4249");r(22,145,153,180,"#efd2a2")
    for x in range(24,150,13):
        h=rng.randint(7,21);r(x,178-h,x+8,179,rng.choice(["#af6658","#c79555","#648476","#e7af79"]));r(x,177-h,x+8,179-h,"#ffe4b1")
    r(86,142,89,183,trim);r(164,140,209,191,"#423f42");r(168,145,204,170,"#8baba2")
    line([(171,165),(193,146)],"#b9c9b4",2);r(171,175,201,188,trim);r(198,171,201,174,"#f2c673")
    for x in range(12,214,12):
        c=trim if ((x-12)//12)%2 else "#f5dab0"
        poly([(x+3,135),(x+15,135),(x+11,145),(x-1,145)],c);r(x-1,145,x+10,148,c)
    r(6,192,225,195,"#887768");r(4,196,223,198,"#cbb99e")
    # Different shopfront architecture, roof furniture and actual merchandise silhouettes.
    if i%4==1:
        for x in (17,68,120,169):
            d.pieslice((x,66,x+38,91),180,360,fill="#f0d2ae")
            d.arc((x+3,69,x+35,93),180,360,fill=trim,width=2)
        for x in (7,214):r(x,112,x+5,192,"#ddc6a1")
    if i%4==2:
        r(6,35,236,48,"#c6a281")
        for x in range(8,237,16):
            r(x,30,x+5,44,"#e2c59f");r(x+2,32,x+6,44,"#ad917a")
        r(5,27,240,30,"#e4cdaa")
    if i%4==3:
        for x in [43,137]:
            poly([(x,52),(x+18,27),(x+36,51)],"#805b53")
            r(x+10,40,x+25,51,"#cfa58c");r(x+13,42,x+22,51,"#52686b")
    if i%3==0:
        for x in (31,80,130,182):
            for t in range(7):
                a=x+rng.randrange(-5,12);b=98+rng.randrange(-2,8)
                d.ellipse((a,b,a+4,b+3),fill=rng.choice(["#527b58","#789a65","#ad6259"]))
    if i%5==0:
        for a in range(18):
            x=11+rng.randrange(1,13);y=76+a*2
            d.ellipse((x,y,x+5,y+5),fill=rng.choice(["#638060","#779261"]))
    # Recessed display glass, plinths in perspective and jewel-like highlights.
    r(22,151,153,181,"#344b4d")
    for y in range(152,181):
        f=(y-152)/29
        r(24,y,151,y,tuple(int(a+(b-a)*f) for a,b in zip((194,159,121),(229,206,157))))
    r(25,177,152,179,"#ac8564")
    for j,x in enumerate([42,76,109,137]):
        h=rng.choice([2,4,7]);r(x-9,178-h,x+9,178,"#bc9473")
        yy=175-h
        ink=[trim,"#98614f","#526f65","#bd8c50"][(i+j)%4]
        typ=(i+j//3)%9
        if typ==0:
            r(x-6,yy-5,x+6,yy,"#b87068");d.ellipse((x-6,yy-7,x+6,yy-3),fill="#f8e0ac");r(x,yy-10,x+1,yy-7,"#bf5144")
        elif typ==1:
            poly([(x-3,yy-16),(x+3,yy-16),(x+4,yy-8),(x+8,yy),(x-8,yy),(x-3,yy-9)],ink)
        elif typ==2:
            d.arc((x-4,yy-14,x+4,yy-3),180,360,fill=ink,width=2);r(x-7,yy-8,x+7,yy,ink);r(x-2,yy-7,x+2,yy-5,"#d5ad67")
        elif typ==3:
            poly([(x-8,yy-11),(x-3,yy-14),(x+3,yy-14),(x+8,yy-11),(x+6,yy-7),(x+4,yy-8),(x+4,yy),(x-4,yy),(x-4,yy-8),(x-6,yy-7)],ink)
        elif typ==4:
            for a in [-4,2]:r(x+a,yy-10-a,x+a+3,yy,"#fff0c1");r(x+a+1,yy-13-a,x+a+2,yy-11-a,"#df9558")
        elif typ==5:
            r(x-6,yy-13,x-4,yy,ink);r(x-5,yy-5,x+6,yy-3,ink);r(x+4,yy-4,x+6,yy,ink)
        elif typ==6:
            r(x-6,yy-12,x+6,yy-2,ink);r(x-4,yy-10,x+4,yy-5,"#95afab")
        elif typ==7:
            d.ellipse((x-7,yy-10,x+7,yy),fill=ink);r(x-4,yy-12,x+4,yy-9,ink)
        else:
            r(x-4,yy-5,x+4,yy,"#a86e57")
            for a in [-4,0,4]:d.ellipse((x+a-3,yy-13-abs(a),x+a+3,yy-6),fill="#658767")
    for x in (22,86,151):r(x,150,x+2,181,trim)
    line([(26,165),(37,153)],"#f5dfb4");line([(96,167),(108,153)],"#e8cfad")
    if i%3==1:
        for x in range(13,215):r(x,136,x,145,trim)
        r(13,144,214,146,"#c9a671")
    if i%3==2:
        r(12,136,214,147,"#decaa6")
        for x in range(16,214,9):r(x,138,x+3,146,trim)
    return png(im)
def object_sprite(kind):
    im=Image.new("RGBA",(84,84));d=ImageDraw.Draw(im)
    r=lambda x,y,w,h,c:d.rectangle((x,y,x+w,y+h),fill=c)
    e=lambda x,y,w,h,c:d.ellipse((x,y,x+w,y+h),fill=c)
    if kind=="tree":
        r(37,44,7,33,"#705b47");r(39,44,2,30,"#ad8d62")
        rng=random.Random(28)
        for _ in range(95):
            x,y=rng.uniform(-1,1),rng.uniform(-1,1)
            if x*x+y*y<1:
                a=int(36+x*26);b=int(29+y*22);e(a-8,b-8,19,19,["#456c58","#548467","#689568","#91ab70"][int(max(0,min(3,1.5-x-y)))])
    if kind=="fountain":
        e(3,44,76,30,"#847f76");e(3,39,76,30,"#ecdab5");e(8,43,65,20,"#549a9b");e(14,44,54,14,"#84c8b9");r(38,25,7,30,"#b1a58b");e(22,22,38,13,"#daccac");e(27,23,28,7,"#8bbeb4");d.arc((30,5,43,38),180,340,fill="#d8ffff",width=2);d.arc((41,6,54,39),195,355,fill="#c6efdf",width=2)
    if kind=="bench":
        for x in [13,63]:r(x,42,4,22,"#4c5a54")
        for y in [32,39,47]:r(10,y,62,4,"#b17c50");r(10,y,62,1,"#dcac74")
    return png(im)
def photo(name):
    key=name.replace(" ","_");h=md5(key.encode()).hexdigest()
    return "https://upload.wikimedia.org/wikipedia/commons/"+h[0]+"/"+h[:2]+"/"+quote(key)
names=["127 Aparador nadalenc de la pastisseria Escribà, Gran Via 546 (Barcelona).jpg","Cereria Subirà, aparador.jpg","148 Pastisseria Santa Clara, c. Llibreteria 21 (Barcelona), aparador per Sant Jordi, 2025.jpg"]
assets={"stores":[shop(i) for i in range(36)],"trees":object_sprite("tree"),"bench":object_sprite("bench"),"fountain":object_sprite("fountain"),"photos":[photo(n) for n in names]}
template=(root/"juego.html").read_text(encoding="utf-8-sig")
out=root/"index.html"
prod=root.parent.parent/"public/jocs/aparadors-bcn"
if prod.is_dir():out=prod/"index.html"
out.write_text(template.replace("__ASSETS__",json.dumps(assets)),encoding="utf-8")
