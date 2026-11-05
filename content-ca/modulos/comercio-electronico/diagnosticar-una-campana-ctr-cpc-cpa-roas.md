---
id: L_ads2
titulo: "Diagnosticar una campanya: CTR, CPC, CPA i ROAS"
objetivo: "Trobar on falla una campanya abans de tocar res."
orden: 36
codigos: ["1.6"]
area: "Publicitat digital"
capitulo: "5.1"
capitulo_titulo: "La campanya que surt malament"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"El meu anunci té un munt de clics! Però no venc res."}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"Si l'anunci atreu, el problema és després del clic."},{"quien":"eco","gesto":"confusion","texto":"Després del clic hi ha alguna cosa?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"La pàgina de destinació i la mesura. Mira el CTR, el CPA i el ROAS junts."}]
ejemplo: "CTR del 3 % (bo), 400 clics, 0 compres registrades. En revisar-ho, la pàgina de pagament no funcionava en mòbils Android (cas simulat)."
errores: ["Canviar l'anunci quan el problema és la web.","Mirar el ROAS sense restar el marge del producte.","Treure conclusions amb poques dades."]
test:
  - {"p":"10.000 impressions i 200 clics. Quin és el CTR?","o":["0,2 %","2 %","20 %","5 %"],"c":1,"por":"200 ÷ 10.000 = 0,02 → 2 %."}
  - {"p":"Has gastat 600 € i has fet 20 vendes. Quin és el CPA?","o":["30 €","3,3 €","300 €","20 €"],"c":0,"por":"600 ÷ 20 = 30 €."}
  - {"p":"Molts clics, CTR alt, zero conversions. On mires primer?","o":["La pàgina de destinació i el seguiment de conversions","La segmentació del públic de l'anunci","El text i la imatge de l'anunci","La puja màxima per clic"],"c":0,"por":"L'anunci funciona; el problema és després del clic."}
  - {"p":"Cas real · Super Bowl 2024. Un anunci de 30 segons costava uns 7 milions de dòlars i el partit el van veure uns 120 milions de persones. Quin és el cost per mil impressions (CPM) aproximat?","o":["Uns 58 $","Uns 5,8 $","Uns 583 $","Uns 17 $"],"c":0,"por":"7.000.000 ÷ (120.000.000 ÷ 1.000) = 7.000.000 ÷ 120.000 ≈ 58 $ per mil espectadors."}
  - {"p":"Cas real · Google Ads. El «nivell de qualitat» fa que un anunci més rellevant pugui pagar menys per clic que un competidor que puja més. Com abaixes el CPC?","o":["Pujant menys i esperant","Millorant la rellevància de l'anunci, de les paraules clau i de la pàgina de destinació","Afegint moltes més paraules clau","Mostrant l'anunci només de nit"],"c":1,"por":"Google premia els anuncis útils per a l'usuari: més qualitat, més posició per menys diners."}
---
<b>CTR</b> = clics ÷ impressions. Indica si l'anunci crida l'atenció del públic. <b>CPC</b> = cost ÷ clics. <b>CPA</b> = cost ÷ conversions (quant costa cada venda o contacte). <b>ROAS</b> = ingressos generats ÷ inversió publicitària.

Llegeix l'embut: si el CTR és bo però no hi ha conversions, el problema pot ser la <b>pàgina de destinació</b>, el procés de compra o el <b>seguiment</b> (la conversió no es registra).

Abans d'aturar una campanya, comprova que les dades són <b>fiables</b>.
