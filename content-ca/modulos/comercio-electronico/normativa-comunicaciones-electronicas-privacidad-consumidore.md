---
id: L_normativa
titulo: "Normativa: comunicacions electròniques, privacitat i consumidors"
objetivo: "Aplicar la LSSI, el RGPD, la normativa de galetes, d'accessibilitat i els drets dels consumidors en línia."
orden: 27
codigos: ["1.7","2.9"]
area: "Correu i CRM"
capitulo: "3.7"
capitulo_titulo: "Una inspecció a la vista"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"El meu bàner de galetes només té el botó «Acceptar»! Així tothom accepta."}]
  - [{"quien":"nexo","gesto":"enfado","texto":"Això pot costar una multa."},{"quien":"eco","gesto":"sorpresa","texto":"Per un botó?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Rebutjar ha de ser tan fàcil com acceptar. I el client té 14 dies per desistir d'una compra en línia."}]
ejemplo: "Una botiga revisa la web: afegeix l'avís legal, un bàner de galetes amb el botó «Rebutjar» i el mode de consentiment activat, casella de consentiment no marcada al formulari, la informació del desistiment a les condicions de venda i millores d'accessibilitat al procés de compra."
errores: ["Casella de consentiment marcada per defecte.","Carregar Google Analytics abans que l'usuari accepti les galetes.","No informar del dret de desistiment."]
test:
  - {"p":"Quants dies té el consumidor per desistir d'una compra en línia?","o":["7 dies naturals","14 dies naturals","14 dies hàbils","30 dies naturals"],"c":1,"por":"És el termini general de la normativa de consumidors."}
  - {"p":"Es pot enviar un correu comercial a qualsevol adreça que trobem a internet?","o":["Sí, si és l'adreça genèrica d'una empresa","No, cal consentiment previ","Sí, si inclou un enllaç per donar-se de baixa","Sí, si l'adreça és pública a la seva web"],"c":1,"por":"La LSSI prohibeix les comunicacions comercials no sol·licitades."}
  - {"p":"Què exigeix la Llei europea d'accessibilitat a moltes botigues en línia des del 2025?","o":["Que la web i el procés de compra siguin accessibles per a persones amb discapacitat","Que la web estigui disponible en diversos idiomes","Que la web funcioni bé al mòbil","Que la botiga tingui atenció al client per telèfon"],"c":0,"por":"Contrast, text alternatiu, navegació amb teclat i formularis clars, entre altres."}
  - {"p":"Cas real · Google (2022). L'autoritat francesa de protecció de dades li va imposar 150 milions d'euros de multa. Per què?","o":["Per no tenir avís legal","Perquè rebutjar les galetes era més difícil que acceptar-les","Per enviar correus comercials sense permís","Per no respectar el dret de desistiment"],"c":1,"por":"El consentiment ha de ser lliure: rebutjar ha de costar el mateix que acceptar."}
  - {"p":"Cas real · Meta (2023). Va rebre una multa de 1.200 milions d'euros, la més alta fins aleshores per protecció de dades, per transferir dades d'usuaris europeus als Estats Units. Quina norma va incomplir?","o":["La LSSI","La Llei de serveis digitals","El Reglament general de protecció de dades (RGPD)","La Llei europea d'accessibilitat"],"c":2,"por":"El RGPD regula on i com es poden tractar les dades personals, també quan surten de la UE."}
---
La <b>LSSI-CE</b> obliga a identificar l'empresa a la web (avís legal amb raó social, NIF, adreça i contacte) i prohibeix enviar comunicacions comercials per correu o SMS sense <b>consentiment previ</b>, llevat de clients anteriors amb productes semblants i possibilitat de baixa.

El <b>RGPD</b> i la <b>LOPDGDD</b> regulen les dades personals: base legal per tractar-les, informació clara (política de privacitat), mínim de dades necessàries, seguretat i els drets d'accés, rectificació, supressió, oposició, limitació i portabilitat. Les <b>galetes</b> no necessàries requereixen consentiment, i rebutjar ha de ser tan fàcil com acceptar.

En les vendes a distància, el consumidor té un <b>dret de desistiment de 14 dies naturals</b> sense haver de justificar-ho (amb excepcions com els productes peribles o personalitzats), i s'ha d'informar de les condicions de venda, devolució i cancel·lació abans de comprar.

Normes més recents: la <b>Llei europea d'accessibilitat</b> obliga des del juny del 2025 moltes botigues en línia a ser accessibles; la <b>Llei de serveis digitals</b> (DSA) exigeix als marketplaces identificar els venedors i fer transparent la publicitat; les <b>ressenyes falses</b> estan prohibides; i la publicitat amb creadors s'ha d'identificar com a publicitat. Per mesurar respectant el consentiment, Google fa servir el <b>mode de consentiment</b>.
