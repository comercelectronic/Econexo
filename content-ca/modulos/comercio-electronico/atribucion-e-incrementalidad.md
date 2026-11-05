---
id: L_atribucio
titulo: "Atribució i incrementalitat"
objetivo: "Interpretar amb prudència qui «s'emporta» cada venda."
orden: 38
codigos: ["1.6","1.9"]
area: "Analítica"
capitulo: "5.3"
capitulo_titulo: "Les dades no quadren"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"Google diu que vaig vendre 100. Meta, 100. TikTok, 50. 250 vendes!"}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"I la botiga diu 160."},{"quien":"eco","gesto":"confusion","texto":"Algú menteix?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Cada plataforma s'atribueix les mateixes vendes. Per saber què funciona de debò, fes proves amb grup de control."}]
ejemplo: "Meta diu 120 vendes, Google 90, el correu 40. La botiga n'ha fet 160. No hi ha cap error greu: els models d'atribució se solapen."
errores: ["Sumar les vendes de totes les plataformes.","Creure que atribuir és demostrar causalitat.","Canviar de model d'atribució per fer quedar bé un canal."]
test:
  - {"p":"Les plataformes sumen 250 vendes però la botiga n'ha fet 160. Per què?","o":["Les plataformes compten també les vendes de la competència","Diversos canals s'atribueixen la mateixa venda","La botiga no ha instal·lat bé el píxel","Hi ha vendes cancel·lades que no s'han restat"],"c":1,"por":"Cada plataforma compta les vendes on ha participat."}
  - {"p":"Com mesures la incrementalitat?","o":["Amb un experiment amb grup de control","Comparant el ROAS de cada plataforma","Amb el model d'atribució de l'últim clic","Comparant el mes de la campanya amb el mes anterior"],"c":0,"por":"Compara el que passa amb i sense la campanya."}
  - {"p":"Què és una finestra de conversió?","o":["El període després d'un clic o impressió en què una venda s'atribueix a l'anunci","El temps que l'anunci es mostra a cada usuari","Els dies que dura una campanya d'anuncis","El temps que triga un usuari a fer clic a l'anunci"],"c":0,"por":"Finestres més llargues atribueixen més vendes."}
  - {"p":"Cas real · eBay (2013). Va aturar els anuncis a Google per a cerques amb el seu propi nom en algunes zones i les vendes gairebé no van canviar. Què en conclous?","o":["Que els anuncis a Google no funcionen mai","Que molts d'aquells clics haurien arribat igualment: tenien poca incrementalitat","Que el ROAS d'aquells anuncis era negatiu","Que cal invertir més en la pròpia marca"],"c":1,"por":"La plataforma s'atribuïa aquelles vendes, però sense anuncis la gent clicava el resultat orgànic. Només un experiment ho revela."}
  - {"p":"Cas real · Airbnb (2020). Durant la pandèmia va retallar molt la publicitat de rendiment i el trànsit a la web es va recuperar gairebé al nivell anterior. Què va aprendre?","o":["Que la publicitat no serveix per a marques conegudes","Que el trànsit orgànic sempre supera el de pagament","Que part de les vendes atribuïdes als anuncis s'haurien fet igualment","Que cal tornar a invertir el doble per recuperar-se"],"c":2,"por":"Mesurar la incrementalitat va permetre redirigir el pressupost cap a la marca i el producte."}
---
L'<b>atribució</b> és la regla que decideix quin canal rep el mèrit d'una venda. Cada plataforma fa servir el seu model i la seva <b>finestra de conversió</b> (per exemple, 7 dies després del clic), i sovint totes s'atribueixen la mateixa venda.

Per això la suma de les vendes que diuen les plataformes pot ser més gran que les vendes reals de la botiga.

La <b>incrementalitat</b> respon una altra pregunta: quantes vendes <b>no</b> s'haurien produït sense la campanya? Es mesura amb experiments: un grup que veu els anuncis i un altre que no (per exemple, per zones geogràfiques).
