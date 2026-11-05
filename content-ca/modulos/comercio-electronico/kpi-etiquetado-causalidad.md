---
id: L_kpi
titulo: "KPI, etiquetatge i causalitat"
objetivo: "Construir un informe que separi activitat, resultats de màrqueting i resultats comercials."
orden: 16
codigos: ["1.1","3.10"]
area: "Analítica"
capitulo: "2.4"
capitulo_titulo: "El client que només mira els seguidors"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"Aquest mes he publicat 30 vídeos!"}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"I què ha passat amb les vendes?"},{"quien":"eco","gesto":"confusion","texto":"Publicar 30 vídeos no és un resultat?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"És activitat. El resultat és el que aconsegueixes. I etiqueta els enllaços per saber d'on ve cada visita."}]
ejemplo: "Un informe honest: «Hem publicat 20 vegades (activitat), han arribat 1.200 visites des d'Instagram (màrqueting) i 18 han comprat, 540 € (comercial)»."
errores: ["Barrejar activitat amb resultats.","Atribuir tot el canvi a la campanya.","Enllaços sense etiquetar."]
test:
  - {"p":"«Hem publicat 30 vídeos.» Quin nivell és?","o":["Activitat","Resultat comercial","Interacció","Abast"],"c":0,"por":"Descriu la feina feta, no el resultat obtingut."}
  - {"p":"Per a què serveixen els paràmetres UTM?","o":["Per identificar de quina campanya ve cada visita","Per saber quantes vegades s'ha vist l'anunci","Per comptar les vendes de cada producte","Per evitar que les visites es dupliquin a Analytics"],"c":0,"por":"Permeten atribuir visites i vendes a cada acció."}
  - {"p":"Les vendes pugen al desembre i la campanya també era al desembre. Què pots afirmar?","o":["La campanya ha causat la pujada, perquè coincideixen","Hi ha correlació, però cal descartar l'estacionalitat","La campanya ha funcionat si les vendes han pujat més d'un 10 %","No es pot saber res de cap campanya feta al desembre"],"c":1,"por":"Cal comparar amb anys anteriors o un grup de control."}
  - {"p":"Cas real · Wells Fargo (2016). El banc va fixar objectius molt agressius de comptes oberts per client. Milers d'empleats van obrir comptes sense permís dels clients. Què il·lustra?","o":["Que els objectius de vendes no s'han de mesurar","Que un KPI mal triat pot incentivar conductes que fan mal al negoci","Que el problema era que el KPI no tenia termini","Que calia mesurar més KPI alhora"],"c":1,"por":"Quan una mètrica es converteix en l'objectiu, la gent pot optimitzar el número en lloc del resultat real."}
  - {"p":"Cas real · Google Analytics. Els paràmetres UTM es diuen així per Urchin, l'empresa que Google va comprar el 2005 i que va donar origen a Google Analytics. Quin d'aquests enllaços està ben etiquetat per a un butlletí?","o":["web.cat/?font=correu","web.cat/?utm_source=butlleti&utm_medium=email&utm_campaign=novembre","web.cat/?utm_campaign=novembre","web.cat/butlleti-novembre"],"c":1,"por":"Font, mitjà i campanya permeten saber d'on ve cada visita i comparar canals."}
---
Un <b>KPI</b> (indicador clau de rendiment) és la mètrica que diu si avances cap a l'objectiu. Separa tres nivells: <b>activitat</b> (publicacions fetes), <b>resultats de màrqueting</b> (visites, contactes) i <b>resultats comercials</b> (vendes, ingressos).

Per saber d'on ve cada visita cal <b>etiquetar</b> els enllaços de les campanyes (paràmetres UTM) i definir <b>esdeveniments i conversions</b> a l'analítica web.

<b>Correlació no és causalitat</b>: que dues coses passin alhora no vol dir que una provoqui l'altra. Les vendes poden pujar al desembre per Nadal, no per la campanya.
